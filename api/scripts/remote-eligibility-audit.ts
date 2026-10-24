/**
 * Remote-eligibility audit: pull fresh remote listings from public feeds and count how many a
 * person living in Nigeria can actually apply to. Writes docs/research/remote_eligibility_audit.md
 * and .csv. Run: npm run audit:remote -w api
 *
 * Sources and their terms: Remotive public API (attribution and link-back), Remote OK public API
 * (must mention Remote OK and link back), Himalayas public API (utm attribution in links),
 * Greenhouse and Ashby public job-board APIs of remote-first companies.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { classifyRemoteEligibility, stripHtml, type RemoteEligibility, type RemoteListingInput } from "@byv/core";

type Listing = RemoteListingInput & {
  source: string;
  group: "remote job board" | "remote-first company board";
  company: string;
  url: string;
  postedAt?: string; // ISO date
};

const UA = "Ladda remote-eligibility audit (research; contact help@useladda.com)";
const DAYS = 30;
const since = Date.now() - DAYS * 86400e3;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}
const fresh = (iso?: string) => !iso || Number.isNaN(Date.parse(iso)) || Date.parse(iso) >= since;

async function remotive(): Promise<Listing[]> {
  const j = await getJson<{ jobs: Array<{ url: string; title: string; company_name: string; publication_date: string; candidate_required_location: string; description: string }> }>("https://remotive.com/api/remote-jobs");
  return j.jobs.map((x) => ({ source: "Remotive", group: "remote job board", title: x.title, company: x.company_name, url: x.url, postedAt: x.publication_date, locationLabel: x.candidate_required_location, description: x.description }));
}
async function remoteok(): Promise<Listing[]> {
  const j = await getJson<Array<Record<string, unknown>>>("https://remoteok.com/api");
  return j.slice(1).map((x) => ({ source: "Remote OK", group: "remote job board", title: String(x.position ?? ""), company: String(x.company ?? ""), url: String(x.url ?? ""), postedAt: String(x.date ?? ""), locationLabel: String(x.location ?? ""), description: String(x.description ?? "") }));
}
async function himalayas(target: number): Promise<Listing[]> {
  const out: Listing[] = [];
  let cursor: string | undefined;
  while (out.length < target) {
    const j = await getJson<{ nextCursor?: string; jobs: Array<{ title: string; companyName: string; applicationLink: string; pubDate: number; locationRestrictions?: string[]; timezoneRestrictions?: number[]; description: string }> }>(`https://himalayas.app/jobs/api?limit=20${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
    for (const x of j.jobs) out.push({ source: "Himalayas", group: "remote job board", title: x.title, company: x.companyName, url: x.applicationLink, postedAt: new Date(x.pubDate * 1000).toISOString(), allowedCountries: x.locationRestrictions, allowedTimezones: x.timezoneRestrictions, description: x.description });
    if (!j.nextCursor || j.jobs.length === 0) break;
    cursor = j.nextCursor;
  }
  return out;
}
async function greenhouse(token: string, name: string): Promise<Listing[]> {
  const j = await getJson<{ jobs: Array<{ absolute_url: string; title: string; location: { name: string }; updated_at: string; first_published?: string; content: string }> }>(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`);
  return j.jobs
    .filter((x) => /remote|home[- ]based|worldwide|anywhere/i.test(x.location.name))
    .map((x) => ({ source: name, group: "remote-first company board", title: x.title, company: name, url: x.absolute_url, postedAt: x.first_published ?? x.updated_at, locationLabel: x.location.name, description: stripHtml(x.content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")) }));
}
async function ashby(token: string, name: string): Promise<Listing[]> {
  const j = await getJson<{ jobs: Array<{ title: string; location: string; isRemote?: boolean; publishedAt: string; jobUrl: string; descriptionPlain: string }> }>(`https://api.ashbyhq.com/posting-api/job-board/${token}`);
  return j.jobs
    .filter((x) => x.isRemote || /remote/i.test(x.location))
    .map((x) => ({ source: name, group: "remote-first company board", title: x.title, company: name, url: x.jobUrl, postedAt: x.publishedAt, locationLabel: x.location, isRemote: x.isRemote, description: x.descriptionPlain }));
}

const FAMILIES: Array<[string, RegExp]> = [
  ["Engineering", /engineer|developer|devops|sre|architect|programmer|qa|test|security|infrastructure|platform|backend|frontend|full[- ]?stack|mobile|ios|android|data engineer|ml|machine learning|ai\b/i],
  ["Data and analytics", /data (analyst|scientist)|analytics|bi\b|business intelligence|research/i],
  ["Design", /design|ux|ui\b|product designer|creative/i],
  ["Product and project", /product manager|product owner|project|program(me)? manager|scrum|delivery/i],
  ["Customer support and success", /support|customer success|customer experience|help ?desk|technical account|community/i],
  ["Sales and marketing", /sales|account executive|sdr|bdr|business development|marketing|growth|seo|content|copywriter|social media|partnerships?/i],
  ["Finance, legal and operations", /finance|accountant|accounting|bookkeep|payroll|legal|counsel|compliance|operations|ops\b|people|hr\b|recruit|talent|office/i],
  ["Virtual assistant and admin", /virtual assistant|assistant|administrative|admin\b|coordinator|scheduler|data entry/i],
  ["Writing and teaching", /writer|editor|translator|teacher|tutor|instructor|curriculum|localization/i],
];
const family = (title: string) => FAMILIES.find(([, re]) => re.test(title))?.[0] ?? "Other";

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\s+/g, " ").slice(0, 300)}"`;

async function main() {
  const batches = await Promise.allSettled([
    remotive(), remoteok(), himalayas(320),
    greenhouse("canonical", "Canonical"), greenhouse("gitlab", "GitLab"), greenhouse("grafanalabs", "Grafana Labs"),
    ashby("supabase", "Supabase"),
  ]);
  const failures: string[] = [];
  const all: Listing[] = [];
  batches.forEach((b, i) => (b.status === "fulfilled" ? all.push(...b.value) : failures.push(`${i}: ${String(b.reason)}`)));

  const seen = new Set<string>();
  const listings = all.filter((l) => {
    const key = l.url || `${l.company}|${l.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const allRows = listings.map((l) => ({ l, r: classifyRemoteEligibility(l) as RemoteEligibility, fresh: fresh(l.postedAt) }));
  const rows = allRows.filter((x) => x.fresh);
  const count = (xs: typeof rows, v: RemoteEligibility["verdict"]) => xs.filter((x) => x.r.verdict === v).length;
  const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "-");
  const table = (label: string, xs: typeof rows) => `| ${label} | ${xs.length} | ${count(xs, "open")} (${pct(count(xs, "open"), xs.length)}) | ${count(xs, "restricted")} (${pct(count(xs, "restricted"), xs.length)}) | ${count(xs, "unclear")} (${pct(count(xs, "unclear"), xs.length)}) |`;

  const sources = [...new Set(rows.map((x) => x.l.source))];
  const groups: Listing["group"][] = ["remote job board", "remote-first company board"];
  const reasonCounts = new Map<string, number>();
  for (const x of rows) if (x.r.verdict === "restricted") reasonCounts.set(x.r.reasons[x.r.reasons.length - 1].replace(/"[^"]*"/g, "…").replace(/\(.*?\)/g, "(…)"), (reasonCounts.get(x.r.reasons[x.r.reasons.length - 1].replace(/"[^"]*"/g, "…").replace(/\(.*?\)/g, "(…)")) ?? 0) + 1);
  const open = rows.filter((x) => x.r.verdict === "open");
  const famCounts = new Map<string, number>();
  for (const x of open) famCounts.set(family(x.l.title), (famCounts.get(family(x.l.title)) ?? 0) + 1);
  const today = new Date().toISOString().slice(0, 10);

  const md = `# Remote-eligibility audit (${today})

Question (Philip's test): of the fresh remote listings a Nigerian job seeker would see this week, how many can a person living in Nigeria actually apply to? Listings published in the last ${DAYS} days, pulled on ${today} from public feeds, classified by the deterministic rules in \`core/src/remote.ts\` (country lists and location labels first, then the text). Re-run with \`npm run audit:remote -w api\`.

Sources: Remotive public API, Remote OK public API (listings link back to Remote OK as required by its terms), Himalayas public API, and the public Greenhouse or Ashby job boards of four remote-first companies filtered to their remote-labelled roles. ${failures.length ? `Feeds that failed this run: ${failures.join("; ")}.` : "All feeds answered."}

## Headline

Fresh listings (published in the last ${DAYS} days):

| Set | Listings | Open to Nigeria | Restricted | Unclear |
|---|---|---|---|---|
${table("All", rows)}
${groups.map((g) => table(g[0].toUpperCase() + g.slice(1) + "s", rows.filter((x) => x.l.group === g))).join("\n")}

Every live listing in the same feeds, whatever its age (company boards keep evergreen roles open for months, and those are still real jobs):

| Set | Listings | Open to Nigeria | Restricted | Unclear |
|---|---|---|---|---|
${table("All", allRows)}
${groups.map((g) => table(g[0].toUpperCase() + g.slice(1) + "s", allRows.filter((x) => x.l.group === g))).join("\n")}

Read "open" as "nothing in the listing excludes Nigeria". "Unclear" means the listing does not say; in practice most of those turn out to be country-limited once you reach the application form, so the honest range for a digest is between the open share and the open-plus-unclear share.

## By source (all live listings)

| Source | Listings | Open | Restricted | Unclear |
|---|---|---|---|---|
${sources.map((s) => table(s, allRows.filter((x) => x.l.source === s))).join("\n")}

## Why listings are restricted

| Reason | Listings |
|---|---|
${[...reasonCounts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## What the open listings are

| Role family (from the title) | Open listings |
|---|---|
${[...famCounts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Sample of open listings

| Title | Company | Source | Why open |
|---|---|---|---|
${open.slice(0, 25).map((x) => `| ${x.l.title.replace(/\|/g, "/")} | ${x.l.company.replace(/\|/g, "/")} | ${x.l.source} | ${x.r.reasons[0].replace(/\|/g, "/")} |`).join("\n")}

## Caveats

- Rules, not judgement: a listing that says "Worldwide" and quietly means "contractors in the Americas" is counted open. Spot-check the CSV before quoting a number externally.
- The fresh-only table under-counts Canonical, whose Worldwide and EMEA roles were mostly published more than 30 days ago but are still open; the all-live table includes them.
- Remotive's public feed now returns only ten listings, so Remote OK and Himalayas carry the job-board sample. Remote OK's listings are up to ten weeks old; the freshness filter removes the older ones.
- The company boards are a convenience sample of four companies known to hire remotely; they say what a well-run remote employer's mix looks like, not what the market looks like.
- Open does not mean winnable. The fit score is a separate question from eligibility.

The row-level data is in \`remote_eligibility_audit.csv\` beside this file.
`;
  mkdirSync("../docs/research", { recursive: true });
  writeFileSync("../docs/research/remote_eligibility_audit.md", md);
  const csv = ["source,group,company,title,posted_at,fresh,verdict,basis,reasons,url", ...allRows.map(({ l, r, fresh }) => [l.source, l.group, l.company, l.title, (l.postedAt ?? "").slice(0, 10), fresh ? "yes" : "no", r.verdict, r.basis, r.reasons.join("; "), l.url].map(csvCell).join(","))].join("\n");
  writeFileSync("../docs/research/remote_eligibility_audit.csv", csv);
  console.log(`fresh ${rows.length}: open ${count(rows, "open")}, restricted ${count(rows, "restricted")}, unclear ${count(rows, "unclear")} | all live ${allRows.length}: open ${count(allRows, "open")}, restricted ${count(allRows, "restricted")}, unclear ${count(allRows, "unclear")}; failures ${failures.length}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
