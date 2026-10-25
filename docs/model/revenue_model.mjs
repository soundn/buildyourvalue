#!/usr/bin/env node
/**
 * Twelve-month revenue and cost model for Build Your Value (Ladda). Deterministic: every input
 * is in this file with its source in docs/research/revenue_model_inputs.md (cited by section).
 * Run `node docs/model/revenue_model.mjs` for the markdown tables or `--json` for raw numbers.
 * Months count from the start of Phase 0; the MVP launches in month 3. Founders take no salary.
 */

// §1 Anthropic list prices, USD per million tokens (platform.claude.com pricing, 25 Oct 2026)
const TOK = { sonnetIn: 2.0, sonnetOut: 10.0, haikuIn: 0.10, haikuOut: 0.50, batch: 0.5 };
const usd = (inTok, outTok, model, batch = false) => {
  const [i, o] = model === "sonnet" ? [TOK.sonnetIn, TOK.sonnetOut] : [TOK.haikuIn, TOK.haikuOut];
  return ((inTok * i + outTok * o) / 1e6) * (batch ? TOK.batch : 1);
};
// §2 token budgets per event: [input, output], low / base / high
const BUDGET = {
  cvGenerate: { low: [3000, 2000], base: [5000, 2500], high: [8000, 4000], model: "sonnet" },
  tailoring: { low: [3000, 1500], base: [4000, 2500], high: [6000, 3000], model: "sonnet" },
  coverLetter: { low: [2500, 500], base: [3500, 800], high: [5000, 1200], model: "sonnet" },
  mockInterview: { low: [15000, 2000], base: [30000, 4000], high: [60000, 6000], model: "sonnet" },
  digest30: { low: [18000, 2000], base: [21000, 3000], high: [25000, 4500], model: "haiku", batch: true },
  digest5: { low: [6000, 600], base: [6000, 600], high: [6000, 600], model: "haiku", batch: true },
  scamTriage: { low: [1000, 100], base: [1500, 150], high: [2500, 300], model: "haiku", batch: true },
  intakeQuestion: { low: [300, 40], base: [400, 60], high: [600, 120], model: "haiku" },
};
const EMBED_PER_LISTING_USD = 0.000012;
const LISTINGS_PER_MONTH = 9000;
const INTAKE_QUESTIONS = 10;

const PRICE = { pass: 1999, core: 1999, remote: 9999 }; // §5, BRD 14.1, ADR-0018 (Remote ₦9,999 a month; the ₦24,999 quarter is not modelled separately)
const FEE = { pass: 30, core: 30, remote: 250 }; // §5 Paystack: 1.5% under ₦2,500; 1.5% + ₦100 above
const VAT_RATE = 0.075;
const VAT_THRESHOLD_PER_MONTH = 100_000_000 / 12; // §5
const EMAIL_USD = 0.0004; // Resend Pro blended (§6); SES later $0.0001
const SMS_NGN = 7; // §6 Termii
const WHATSAPP_NGN_PER_REMOTE = 350; // §3 [unverified]

// §3 usage per active user per month: digests of 30 (or 5 for free), tailorings, cover letters, mock interviews
const USAGE = {
  low: { free: { d5: 4.3 }, pass: { d30: 7, tail: 3, cl: 0 }, core: { d30: 13, tail: 2, cl: 1 }, remote: { d30: 17, tail: 5, cl: 2, mock: 0.5 } },
  base: { free: { d5: 4.3 }, pass: { d30: 7, tail: 5, cl: 1 }, core: { d30: 13, tail: 3.5, cl: 2 }, remote: { d30: 17, tail: 8, cl: 4, mock: 1 } },
  high: { free: { d5: 4.3 }, pass: { d30: 7, tail: 10, cl: 2 }, core: { d30: 13, tail: 5, cl: 4 }, remote: { d30: 17, tail: 15, cl: 8, mock: 3 } },
};
const EMAILS = { free: 5, pass: 9, core: 15, remote: 15 };

// §7 base sign-ups per month; low 0.5x, high 2x
const SIGNUPS_BASE = [50, 200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000];

// Scenario = revenue scenario; the cost side (token budgets, usage) is set separately so a pessimistic
// case pairs weak revenue with heavy usage and a weak naira.
const SCENARIOS = {
  low: { label: "Low", signupMult: 0.5, activation: 0.5, conversion: 0.02, passPer100: 1, passUpgrade: 0.2, churn: 0.10, remoteShare: 0.10, mauShare: 0.30, usage: "high", budgets: "high", fx: 1800, adsNgn: 0, employerRoles: [2, 5], employerFee: 15000, affiliateTake: 0.001, affiliateUsd: 1, otpPerMau: 1.0 },
  base: { label: "Base", signupMult: 1.0, activation: 0.6, conversion: 0.03, passPer100: 2, passUpgrade: 0.3, churn: 0.075, remoteShare: 0.15, mauShare: 0.45, usage: "base", budgets: "base", fx: 1400, adsNgn: 300000, employerRoles: [5, 10], employerFee: 20000, affiliateTake: 0.002, affiliateUsd: 5, otpPerMau: 0.6 },
  high: { label: "High", signupMult: 2.0, activation: 0.65, conversion: 0.04, passPer100: 3, passUpgrade: 0.4, churn: 0.05, remoteShare: 0.25, mauShare: 0.60, usage: "low", budgets: "low", fx: 1400, adsNgn: 1000000, employerRoles: [10, 20], employerFee: 30000, affiliateTake: 0.003, affiliateUsd: 22, otpPerMau: 0.3 },
};

// §6 fixed costs by phase, USD per month (midpoints), plus one-offs in naira
function fixedUsd(month, registered) {
  if (month <= 2) return { tooling: 200, hosting: 20, database: 0, jobs: 0, email: 0, jobData: 15, observability: 0 };
  const s = Math.min(1, Math.max(0, (registered - 10000) / 90000)); // ramps Phase 1 lines to Phase 2 lines by ~100k users
  const lerp = (a, b) => a + (b - a) * s;
  return { tooling: 200, hosting: lerp(70, 140), database: lerp(42, 125), jobs: lerp(10, 35), email: lerp(20, 55), jobData: lerp(80, 315), observability: lerp(13, 175) };
}
// §6 one-offs: CAC and trading name ~₦25k, NDPC ₦10k, domains ₦90k, trademark ₦225k, counsel placeholder ₦200k
const ONE_OFF_NGN = { 1: 325000, 2: 225000 };

const eventUsd = (name, level) => { const b = BUDGET[name]; const [i, o] = b[level]; return usd(i, o, b.model, Boolean(b.batch)); };

export function run(key, overrides = {}) {
  const s = { ...SCENARIOS[key], ...overrides };
  const ev = Object.fromEntries(Object.keys(BUDGET).map((n) => [n, eventUsd(n, s.budgets)]));
  const u = USAGE[s.usage];
  const perTier = {
    free: u.free.d5 * ev.digest5,
    pass: u.pass.d30 * ev.digest30 + u.pass.tail * ev.tailoring + u.pass.cl * ev.coverLetter,
    core: u.core.d30 * ev.digest30 + u.core.tail * ev.tailoring + u.core.cl * ev.coverLetter,
    remote: u.remote.d30 * ev.digest30 + u.remote.tail * ev.tailoring + u.remote.cl * ev.coverLetter + u.remote.mock * ev.mockInterview,
  };
  const onboardingUsd = ev.cvGenerate + INTAKE_QUESTIONS * ev.intakeQuestion;

  let registered = 0, core = 0, remote = 0, cash = 0, prevPass = 0, breakEvenMonth = null;
  const rows = [];
  for (let m = 1; m <= 12; m++) {
    const signups = Math.round(SIGNUPS_BASE[m - 1] * s.signupMult);
    const activated = Math.round(signups * s.activation);
    const older = registered;
    registered += signups;
    const mau = Math.round(older * s.mauShare + activated);
    const live = m >= 3;
    // Subscriptions: conversion of newly activated users, split Remote / Core; pass buyers separately; a share of last month's pass buyers upgrade to Core
    const newSubs = live ? activated * s.conversion : activated * s.conversion * 0.5; // the pilot sells pre-orders by hand
    const newRemote = newSubs * s.remoteShare;
    const newCore = newSubs * (1 - s.remoteShare) + prevPass * s.passUpgrade;
    const pass = activated * (s.passPer100 / 100);
    core = core * (1 - s.churn) + newCore;
    remote = remote * (1 - s.churn) + newRemote;
    prevPass = pass;
    const payers = pass + core + remote;
    const freeActive = Math.max(0, mau - payers);

    const subscriptionNgn = pass * PRICE.pass + core * PRICE.core + remote * PRICE.remote;
    const employerRoles = m < 5 ? 0 : m <= 8 ? s.employerRoles[0] : s.employerRoles[1];
    const employerNgn = employerRoles * s.employerFee;
    const affiliateNgn = m >= 5 ? mau * s.affiliateTake * s.affiliateUsd * s.fx : 0;
    const grossNgn = subscriptionNgn + employerNgn + affiliateNgn;
    const feesNgn = pass * FEE.pass + core * FEE.core + remote * FEE.remote + employerNgn * 0.015;
    const vatNgn = grossNgn > VAT_THRESHOLD_PER_MONTH ? grossNgn * (VAT_RATE / (1 + VAT_RATE)) : 0;
    const netRevenueNgn = grossNgn - feesNgn - vatNgn;

    const aiUsd = activated * onboardingUsd + freeActive * perTier.free + pass * perTier.pass + core * perTier.core + remote * perTier.remote
      + (live ? LISTINGS_PER_MONTH * (ev.scamTriage + EMBED_PER_LISTING_USD) : 0);
    const emails = freeActive * EMAILS.free + pass * EMAILS.pass + core * EMAILS.core + remote * EMAILS.remote;
    const deliveryNgn = emails * EMAIL_USD * s.fx + mau * s.otpPerMau * SMS_NGN + remote * WHATSAPP_NGN_PER_REMOTE;
    const fixed = fixedUsd(m, registered);
    const fixedNgn = Object.values(fixed).reduce((a, b) => a + b, 0) * s.fx;
    const adsNgn = live ? s.adsNgn : 0;
    const oneOffNgn = ONE_OFF_NGN[m] ?? 0;
    const costNgn = aiUsd * s.fx + deliveryNgn + fixedNgn + adsNgn + oneOffNgn;
    const resultNgn = netRevenueNgn - costNgn;
    cash += resultNgn;
    if (breakEvenMonth === null && resultNgn > 0 && m >= 3) breakEvenMonth = m;
    rows.push({ month: m, signups, registered, mau, pass: Math.round(pass), core: Math.round(core), remote: Math.round(remote), payers: Math.round(payers), grossNgn, employerNgn, affiliateNgn, netRevenueNgn, aiNgn: aiUsd * s.fx, deliveryNgn, fixedNgn, adsNgn, oneOffNgn, costNgn, resultNgn, cash, aiPerMauNgn: mau ? (aiUsd * s.fx) / mau : 0 });
  }
  const sum = (k, n) => rows.slice(0, n).reduce((a, r) => a + r[k], 0);
  const tot = (n) => ({ gross: sum("grossNgn", n), net: sum("netRevenueNgn", n), ai: sum("aiNgn", n), cost: sum("costNgn", n), result: sum("resultNgn", n) });
  return { scenario: s.label, perTierNgn: Object.fromEntries(Object.entries(perTier).map(([k, v]) => [k, v * s.fx])), onboardingNgn: onboardingUsd * s.fx, rows, six: tot(6), twelve: tot(12), breakEvenMonth, cashLow: Math.min(...rows.map((r) => r.cash)), payersEnd: rows[11].payers, registeredEnd: rows[11].registered };
}

const ngn = (n) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const k = (n) => (Math.abs(n) >= 1e6 ? `₦${(n / 1e6).toFixed(1)}m` : ngn(n));
const SENSITIVITIES = [
  ["Base, no paid media", "base", { adsNgn: 0 }],
  ["Base, founders' Claude Max not charged to the company", "base", { tooling: 0 }],
  ["Base at ₦1,800 to the dollar", "base", { fx: 1800 }],
  ["Base with heavy AI use (high token budgets and usage)", "base", { budgets: "high", usage: "high" }],
  ["Base with 4% conversion", "base", { conversion: 0.04 }],
  ["Base with 2% conversion", "base", { conversion: 0.02 }],
  ["Base with churn at 5%", "base", { churn: 0.05 }],
  ["Base with half the sign-ups", "base", { signupMult: 0.5 }],
];
function runWith(label, key, o) {
  const r = o.tooling === 0 ? (() => { const saved = fixedUsd; const res = run(key, o); return res; })() : run(key, o);
  return { label, ...r };
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(Object.fromEntries(Object.keys(SCENARIOS).map((key) => [key, run(key)])), null, 2));
} else {
  const out = [];
  const base = run("base");
  out.push("### AI cost per active user per month (base token budgets and usage, ₦1,400 to the dollar)", "", "| Tier | AI cost per month | What it buys |", "|---|---|---|",
    `| Free | ${ngn(base.perTierNgn.free)} | 4.3 batched five-job digests |`,
    `| ₦1,999 pass (per purchase) | ${ngn(base.perTierNgn.pass)} | 7 daily 30-job digests, 5 tailorings, 1 cover letter |`,
    `| Core ₦1,999 | ${ngn(base.perTierNgn.core)} | 13 digests, 3.5 tailorings, 2 cover letters |`,
    `| Remote ₦9,999 | ${ngn(base.perTierNgn.remote)} | 17 digests, 8 tailorings, 4 cover letters, 1 mock interview (WhatsApp ₦350 is separate) |`,
    `| Onboarding, once per activated user | ${ngn(base.onboardingNgn)} | CV parse and rewrite on Sonnet plus ten phrased intake questions |`, "");
  out.push("### Three scenarios", "", "| Scenario | 6-month revenue (net of fees) | 6-month AI spend | 6-month total cost | 6-month result | 12-month revenue (net) | 12-month AI spend | 12-month total cost | 12-month result | Payers at month 12 | Registered at month 12 | First profitable month | Cash low point |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const key of Object.keys(SCENARIOS)) {
    const r = run(key);
    out.push(`| ${r.scenario} | ${k(r.six.net)} | ${k(r.six.ai)} | ${k(r.six.cost)} | ${k(r.six.result)} | ${k(r.twelve.net)} | ${k(r.twelve.ai)} | ${k(r.twelve.cost)} | ${k(r.twelve.result)} | ${r.payersEnd.toLocaleString("en-NG")} | ${r.registeredEnd.toLocaleString("en-NG")} | ${r.breakEvenMonth ?? "not within 12"} | ${k(r.cashLow)} |`);
  }
  out.push("", "### Sensitivities on the base case", "", "| Change | 12-month revenue (net) | 12-month total cost | 12-month result | First profitable month | Cash low point |", "|---|---|---|---|---|---|");
  for (const [label, key, o] of SENSITIVITIES) {
    const r = run(key, o);
    const adj = o.tooling === 0 ? 200 * (SCENARIOS[key].fx) * 12 : 0; // tooling is a flat $200 a month in fixedUsd
    const twelveCost = r.twelve.cost - adj, twelveResult = r.twelve.result + adj;
    let cashLow = r.cashLow, be = r.breakEvenMonth;
    if (adj) { let c = 0; cashLow = Infinity; be = null; for (const x of r.rows) { const res = x.resultNgn + 200 * SCENARIOS[key].fx; c += res; cashLow = Math.min(cashLow, c); if (be === null && res > 0 && x.month >= 3) be = x.month; } }
    out.push(`| ${label} | ${k(r.twelve.net)} | ${k(twelveCost)} | ${k(twelveResult)} | ${be ?? "not within 12"} | ${k(cashLow)} |`);
  }
  for (const key of Object.keys(SCENARIOS)) {
    const r = run(key);
    out.push("", `### ${r.scenario} case by month`, "", "| Month | New sign-ups | Registered | Active | Pass buyers | Core | Remote | Gross revenue | Net revenue | AI | Delivery (email, SMS, WhatsApp) | Fixed | Paid media | One-off | Result | Cumulative cash | AI per active user |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
    for (const x of r.rows) out.push(`| ${x.month} | ${x.signups.toLocaleString()} | ${x.registered.toLocaleString()} | ${x.mau.toLocaleString()} | ${x.pass} | ${x.core} | ${x.remote} | ${k(x.grossNgn)} | ${k(x.netRevenueNgn)} | ${k(x.aiNgn)} | ${k(x.deliveryNgn)} | ${k(x.fixedNgn)} | ${k(x.adsNgn)} | ${k(x.oneOffNgn)} | ${k(x.resultNgn)} | ${k(x.cash)} | ${ngn(x.aiPerMauNgn)} |`);
  }
  console.log(out.join("\n"));
}
