#!/usr/bin/env node
/**
 * Twelve-month revenue and cost model for Build Your Value (Ladda). Deterministic: every input
 * is in INPUTS below with its source in docs/research/revenue_model_inputs.md; run
 * `node docs/model/revenue_model.mjs` to print the scenario tables as markdown, or
 * `node docs/model/revenue_model.mjs --json` for the raw numbers. Months are counted from the
 * start of Phase 0; the MVP launches in month 3. Founders take no salary in this model.
 */
const FX = 1400; // naira per US dollar, October 2026 anchor (COST_ANALYSIS.md)

const PRICE = { pass: 1999, core: 1999, remote: 4999 }; // naira, VAT-inclusive (BRD 14.1, ADR-0017)
const FEE = { pass: 30, core: 30, remote: 175 }; // Paystack per charge (1.5% under ₦2,500; 1.5% + ₦100 above)
const VAT_RATE = 0.075;
const VAT_TURNOVER_THRESHOLD_NGN_PER_MONTH = 100_000_000 / 12; // Nigeria Tax Act 2025 small-company exemption

// Anthropic list prices per million tokens (ai_capabilities.md via COST_ANALYSIS.md; batch 50% off)
const TOK = { haikuIn: 0.10, haikuOut: 0.50, sonnetIn: 2.0, sonnetOut: 10.0, batch: 0.5 };
const usd = (inTok, outTok, model, batch = false) => {
  const [i, o] = model === "sonnet" ? [TOK.sonnetIn, TOK.sonnetOut] : [TOK.haikuIn, TOK.haikuOut];
  return ((inTok * i + outTok * o) / 1e6) * (batch ? TOK.batch : 1);
};
// Cost per product event, US dollars (token budgets from revenue_model_inputs.md)
const EVENT = {
  cvGenerate: usd(3000, 2500, "sonnet"), // parse + rewrite, once per activated user
  tailoring: usd(3500, 1800, "sonnet"),
  coverLetter: usd(2500, 700, "sonnet"),
  mockInterview: usd(6000, 2500, "sonnet"),
  intake: 7 * usd(400, 60, "haiku"), // seven phrased questions
  digest: usd(30 * 600 + 1500, 30 * 60, "haiku", true), // batched rerank of 30 jobs
  scamTriagePerListing: usd(700, 80, "haiku", true),
  embeddingPerListing: 0.00002, // voyage-4-lite $0.02 per MTok, ~1,000 tokens
};

// Usage per active user per month by tier (BRD 14.1 tiers as amended by ADR-0017)
const USAGE = {
  free: { digest: 4, tailoring: 0, coverLetter: 0, mockInterview: 0, whatsappNgn: 0, emails: 5 },
  pass: { digest: 7, tailoring: 8, coverLetter: 2, mockInterview: 0, whatsappNgn: 0, emails: 9 },
  core: { digest: 13, tailoring: 5, coverLetter: 2, mockInterview: 0, whatsappNgn: 0, emails: 15 },
  remote: { digest: 13, tailoring: 10, coverLetter: 3, mockInterview: 1, whatsappNgn: 350, emails: 15 },
};
const EMAIL_USD = 0.0005; // Resend Pro blended; SES later is $0.0001
const SMS_OTP_NGN_PER_MAU = 0.6 * 7;
const LISTINGS_PER_MONTH = 9000; // scam triage and embeddings on the ingested corpus from launch

const SCENARIOS = {
  low: { label: "Low", signupMult: 0.5, activation: 0.5, conversion: 0.02, remoteShare: 0.1, coreChurn: 0.10, remoteChurn: 0.09, passToCore: 0.15, employerStartMonth: 9, employersStart: 1, employerStep: 1 },
  base: { label: "Base", signupMult: 1.0, activation: 0.6, conversion: 0.03, remoteShare: 0.15, coreChurn: 0.08, remoteChurn: 0.07, passToCore: 0.2, employerStartMonth: 7, employersStart: 3, employerStep: 2 },
  high: { label: "High", signupMult: 2.0, activation: 0.65, conversion: 0.045, remoteShare: 0.2, coreChurn: 0.06, remoteChurn: 0.05, passToCore: 0.25, employerStartMonth: 6, employersStart: 4, employerStep: 3 },
};
// Base-case new sign-ups per month: months 1–2 are the hand-run pilot, month 3 the MVP launch.
const SIGNUPS_BASE = [50, 150, 600, 1000, 1500, 2200, 3000, 3800, 4600, 5500, 6500, 7500];
// Of those who convert, the split by first product (pass is one-off; a share of pass buyers move to Core next month)
const CONVERT_SPLIT = { pass: 0.5, core: 0.4, remote: 0.1 }; // remote share overridden per scenario
const EMPLOYER_FEE_NGN = 20000;
const AFFILIATE_NGN_PER_PAYER = 50; // from month 7
const MAU_SHARE_OF_OLDER_REGISTERED = 0.3; // PLAN.md: ~3,000 MAU per 10,000 registered

function fixedUsd(month, registered, emails) {
  const live = month >= 3;
  const scale = Math.min(1, registered / 10000); // ramps Phase 1 lines up to their ~10k-user level
  return {
    tooling: 200,
    hosting: live ? 20 + 110 * scale : 0,
    database: live ? 25 + 70 * scale : 0,
    email: live ? (emails <= 3000 ? 0 : emails <= 50000 ? 20 : 90) : 0,
    jobData: live ? 30 + 120 * scale : 0,
    observability: live ? 26 * scale : 0,
  };
}
const ONE_OFF_NGN = { 1: 350000, 2: 250000 }; // CAC, NDPC, domains, counsel retainer share (COST_ANALYSIS.md §2 midpoint)

export function run(key) {
  const s = SCENARIOS[key];
  const split = { pass: CONVERT_SPLIT.pass * (1 - s.remoteShare) / (1 - CONVERT_SPLIT.remote), core: CONVERT_SPLIT.core * (1 - s.remoteShare) / (1 - CONVERT_SPLIT.remote), remote: s.remoteShare };
  let registered = 0, core = 0, remote = 0, cash = 0;
  let prevPass = 0;
  const rows = [];
  for (let m = 1; m <= 12; m++) {
    const signups = Math.round(SIGNUPS_BASE[m - 1] * s.signupMult);
    const activated = Math.round(signups * s.activation);
    const older = registered;
    registered += signups;
    const mau = Math.round(older * MAU_SHARE_OF_OLDER_REGISTERED + activated);
    const converts = activated * s.conversion;
    const pass = converts * split.pass + (m >= 3 ? 0 : 0);
    const newCore = converts * split.core + prevPass * s.passToCore;
    const newRemote = converts * split.remote;
    core = core * (1 - s.coreChurn) + newCore;
    remote = remote * (1 - s.remoteChurn) + newRemote;
    prevPass = pass;
    const payers = pass + core + remote;
    const freeActive = Math.max(0, mau - payers);

    const grossNgn = pass * PRICE.pass + core * PRICE.core + remote * PRICE.remote;
    const employers = m >= s.employerStartMonth ? s.employersStart + s.employerStep * (m - s.employerStartMonth) : 0;
    const otherNgn = employers * EMPLOYER_FEE_NGN + (m >= 7 ? (core + remote) * AFFILIATE_NGN_PER_PAYER : 0);
    const feesNgn = pass * FEE.pass + core * FEE.core + remote * FEE.remote;
    const vatNgn = grossNgn + otherNgn > VAT_TURNOVER_THRESHOLD_NGN_PER_MONTH ? (grossNgn + otherNgn) * (VAT_RATE / (1 + VAT_RATE)) : 0;
    const netRevenueNgn = grossNgn + otherNgn - feesNgn - vatNgn;

    const tierCost = (n, u, firstMonthDraft = 0) =>
      n * (u.digest * EVENT.digest + u.tailoring * EVENT.tailoring + u.coverLetter * EVENT.coverLetter + u.mockInterview * EVENT.mockInterview + u.emails * EMAIL_USD) + firstMonthDraft;
    const onboardingUsd = activated * (EVENT.cvGenerate + EVENT.intake);
    const aiUsd = onboardingUsd + tierCost(freeActive, USAGE.free) + tierCost(pass, USAGE.pass) + tierCost(core, USAGE.core) + tierCost(remote, USAGE.remote)
      + (m >= 3 ? LISTINGS_PER_MONTH * (EVENT.scamTriagePerListing + EVENT.embeddingPerListing) : 0);
    const emails = Math.round(freeActive * USAGE.free.emails + pass * USAGE.pass.emails + core * USAGE.core.emails + remote * USAGE.remote.emails);
    const fixed = fixedUsd(m, registered, emails);
    const fixedUsdTotal = Object.values(fixed).reduce((a, b) => a + b, 0);
    const variableNgn = aiUsd * FX + mau * SMS_OTP_NGN_PER_MAU + remote * USAGE.remote.whatsappNgn;
    const costNgn = variableNgn + fixedUsdTotal * FX + (ONE_OFF_NGN[m] ?? 0);
    const resultNgn = netRevenueNgn - costNgn;
    cash += resultNgn;
    rows.push({ month: m, signups, registered, mau, pass: Math.round(pass), core: Math.round(core), remote: Math.round(remote), payers: Math.round(payers), grossNgn, otherNgn, netRevenueNgn, aiNgn: aiUsd * FX, variableNgn, fixedNgn: fixedUsdTotal * FX, oneOffNgn: ONE_OFF_NGN[m] ?? 0, costNgn, resultNgn, cash, aiPerMauNgn: mau ? (aiUsd * FX) / mau : 0 });
  }
  const sum = (k, upto) => rows.slice(0, upto).reduce((a, r) => a + r[k], 0);
  return { scenario: s.label, rows, totals: { six: { revenue: sum("netRevenueNgn", 6), gross: sum("grossNgn", 6) + sum("otherNgn", 6), ai: sum("aiNgn", 6), cost: sum("costNgn", 6), result: sum("resultNgn", 6) }, twelve: { revenue: sum("netRevenueNgn", 12), gross: sum("grossNgn", 12) + sum("otherNgn", 12), ai: sum("aiNgn", 12), cost: sum("costNgn", 12), result: sum("resultNgn", 12) } } };
}

const ngn = (n) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const k = (n) => (Math.abs(n) >= 1e6 ? `₦${(n / 1e6).toFixed(1)}m` : ngn(n));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(Object.fromEntries(Object.keys(SCENARIOS).map((key) => [key, run(key)])), null, 2));
} else {
  const out = [];
  out.push(`Event costs (USD): CV generate ${EVENT.cvGenerate.toFixed(4)}, tailoring ${EVENT.tailoring.toFixed(4)}, cover letter ${EVENT.coverLetter.toFixed(4)}, mock interview ${EVENT.mockInterview.toFixed(4)}, intake ${EVENT.intake.toFixed(5)}, digest ${EVENT.digest.toFixed(5)}, scam triage per listing ${EVENT.scamTriagePerListing.toFixed(6)}`);
  const perUser = (u) => (u.digest * EVENT.digest + u.tailoring * EVENT.tailoring + u.coverLetter * EVENT.coverLetter + u.mockInterview * EVENT.mockInterview) * FX;
  out.push(`AI cost per active user per month: free ${ngn(perUser(USAGE.free))}, pass ${ngn(perUser(USAGE.pass))}, Core ${ngn(perUser(USAGE.core))}, Remote ${ngn(perUser(USAGE.remote))} (plus a one-off ${ngn((EVENT.cvGenerate + EVENT.intake) * FX)} at onboarding)`);
  out.push("");
  out.push("| Scenario | 6-month gross revenue | 6-month net revenue | 6-month AI spend | 6-month total cost | 6-month result | 12-month gross revenue | 12-month net revenue | 12-month AI spend | 12-month total cost | 12-month result | Payers at month 12 | Cash low point |");
  out.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const key of Object.keys(SCENARIOS)) {
    const r = run(key); const t = r.totals; const last = r.rows[11];
    const low = Math.min(...r.rows.map((x) => x.cash));
    out.push(`| ${r.scenario} | ${k(t.six.gross)} | ${k(t.six.revenue)} | ${k(t.six.ai)} | ${k(t.six.cost)} | ${k(t.six.result)} | ${k(t.twelve.gross)} | ${k(t.twelve.revenue)} | ${k(t.twelve.ai)} | ${k(t.twelve.cost)} | ${k(t.twelve.result)} | ${last.payers.toLocaleString("en-NG")} | ${k(low)} |`);
  }
  for (const key of Object.keys(SCENARIOS)) {
    const r = run(key);
    out.push("", `### ${r.scenario} case by month`, "", "| Month | New sign-ups | Registered | Active (MAU) | Pass buyers | Core | Remote | Gross revenue | Net revenue | AI cost | All variable | Fixed | One-off | Result | Cumulative cash | AI per MAU |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
    for (const x of r.rows) out.push(`| ${x.month} | ${x.signups.toLocaleString()} | ${x.registered.toLocaleString()} | ${x.mau.toLocaleString()} | ${x.pass} | ${x.core} | ${x.remote} | ${k(x.grossNgn + x.otherNgn)} | ${k(x.netRevenueNgn)} | ${k(x.aiNgn)} | ${k(x.variableNgn)} | ${k(x.fixedNgn)} | ${k(x.oneOffNgn)} | ${k(x.resultNgn)} | ${k(x.cash)} | ${ngn(x.aiPerMauNgn)} |`);
  }
  console.log(out.join("\n"));
}
