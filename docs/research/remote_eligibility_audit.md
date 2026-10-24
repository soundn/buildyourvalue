# Remote-eligibility audit (2026-10-24)

Question (Philip's test): of the fresh remote listings a Nigerian job seeker would see this week, how many can a person living in Nigeria actually apply to? Listings published in the last 30 days, pulled on 2026-10-24 from public feeds, classified by the deterministic rules in `core/src/remote.ts` (country lists and location labels first, then the text). Re-run with `npm run audit:remote -w api`.

Sources: Remotive public API, Remote OK public API (listings link back to Remote OK as required by its terms), Himalayas public API, and the public Greenhouse or Ashby job boards of four remote-first companies filtered to their remote-labelled roles. All feeds answered.

## Headline

Fresh listings (published in the last 30 days):

| Set | Listings | Open to Nigeria | Restricted | Unclear |
|---|---|---|---|---|
| All | 601 | 40 (7%) | 509 (85%) | 52 (9%) |
| Remote job boards | 390 | 19 (5%) | 322 (83%) | 49 (13%) |
| Remote-first company boards | 211 | 21 (10%) | 187 (89%) | 3 (1%) |

Every live listing in the same feeds, whatever its age (company boards keep evergreen roles open for months, and those are still real jobs):

| Set | Listings | Open to Nigeria | Restricted | Unclear |
|---|---|---|---|---|
| All | 1138 | 299 (26%) | 758 (67%) | 81 (7%) |
| Remote job boards | 429 | 23 (5%) | 332 (77%) | 74 (17%) |
| Remote-first company boards | 709 | 276 (39%) | 426 (60%) | 7 (1%) |

Read "open" as "nothing in the listing excludes Nigeria". "Unclear" means the listing does not say; in practice most of those turn out to be country-limited once you reach the application form, so the honest range for a digest is between the open share and the open-plus-unclear share.

## By source (all live listings)

| Source | Listings | Open | Restricted | Unclear |
|---|---|---|---|---|
| Remotive | 10 | 7 (70%) | 3 (30%) | 0 (0%) |
| Remote OK | 99 | 13 (13%) | 16 (16%) | 70 (71%) |
| Himalayas | 320 | 3 (1%) | 313 (98%) | 4 (1%) |
| Canonical | 285 | 235 (82%) | 49 (17%) | 1 (0%) |
| GitLab | 218 | 1 (0%) | 211 (97%) | 6 (3%) |
| Grafana Labs | 145 | 0 (0%) | 145 (100%) | 0 (0%) |
| Supabase | 61 | 40 (66%) | 21 (34%) | 0 (0%) |

## Why listings are restricted

| Reason | Listings |
|---|---|
| country list (…) excludes Nigeria | 311 |
| location label … names regions that exclude Nigeria | 193 |
| timezone list excludes UTC+1 | 2 |
| text overlap with US working hours required | 1 |
| text residents of a named country only | 1 |
| text citizenship or permanent residency required | 1 |

## What the open listings are

| Role family (from the title) | Open listings |
|---|---|
| Engineering | 22 |
| Finance, legal and operations | 5 |
| Product and project | 4 |
| Sales and marketing | 3 |
| Other | 3 |
| Writing and teaching | 1 |
| Virtual assistant and admin | 1 |
| Design | 1 |

## Sample of open listings

| Title | Company | Source | Why open |
|---|---|---|---|
| AI Trainer - Video Annotation | iMerit Technology | Remotive | location label "Worldwide" includes Nigeria |
| Software Engineer, AI Coding Tasks | Askable | Remotive | location label "Worldwide" includes Nigeria |
| Remote Office Assistant | Coalition Technologies  | Remotive | location label "Worldwide" includes Nigeria |
| Inside Sales Contractor | Credit Wellness, LLC | Remotive | location label "Worldwide" includes Nigeria |
| Tier III Service Desk Engineer | Unio Digital | Remotive | location label "Worldwide" includes Nigeria |
| Freelance Writer | IAPWE | Remotive | location label "Worldwide" includes Nigeria |
| Freelance Copywriter | Coalition Technologies  | Remotive | location label "Worldwide" includes Nigeria |
| Senior DevOps Engineer | Lemon.io | Remote OK | text mentions Africa, EMEA or Nigeria |
| Accounting & Finance Manager | Political Asylum Lawyers | Remote OK | text says work from anywhere |
| Senior Software Engineer II Applied AI | Wrapbook | Remote OK | text says work from anywhere |
| Project and Quality Administrator Work From Home Dayshift | Twoconnect | Remote OK | text mentions global candidates |
| Payment Operations Specialist | Utopia | Remote OK | text mentions global candidates |
| Product Engineering Lead | Tether Operations Limited | Remote OK | text mentions global candidates |
| Senior React Full stack Developer | Lemon.io | Remote OK | text mentions Africa, EMEA or Nigeria |
| Project Manager | Spiralyze | Remote OK | location label "Worldwide" includes Nigeria |
| Enterprise Sales Development Representative | Toptal | Remote OK | text mentions global candidates |
| Executive Assistant | SmartPA | Himalayas | country list includes Nigeria |
| Engineering Manager/Team Lead | Autochek | Himalayas | country list includes Nigeria |
| Lead Product Designer | Zoftify — Travel Software Development | Himalayas | text mentions global candidates |
| Engineering Manager - Distributed Systems, Python / Go | Canonical | Canonical | location label "Home based - EMEA" includes Nigeria |
| Financial Planning & Analysis Manager | Canonical | Canonical | location label "Home based - EMEA" includes Nigeria |
| General Counsel (remote) | Canonical | Canonical | location label "Home based - EMEA" includes Nigeria |
| Graduate Software Engineer, Open Source and Linux, Canonical Ubuntu | Canonical | Canonical | location label "Home based - Worldwide" includes Nigeria |
| Head of Financial Planning & Analysis | Canonical | Canonical | location label "Home based - EMEA" includes Nigeria |
| Legal Counsel – Commercial & Technology Transactions | Canonical | Canonical | location label "Home based - EMEA" includes Nigeria |

## Caveats

- Rules, not judgement: a listing that says "Worldwide" and quietly means "contractors in the Americas" is counted open. Spot-check the CSV before quoting a number externally.
- The fresh-only table under-counts Canonical, whose Worldwide and EMEA roles were mostly published more than 30 days ago but are still open; the all-live table includes them.
- Remotive's public feed now returns only ten listings, so Remote OK and Himalayas carry the job-board sample. Remote OK's listings are up to ten weeks old; the freshness filter removes the older ones.
- The company boards are a convenience sample of four companies known to hire remotely; they say what a well-run remote employer's mix looks like, not what the market looks like.
- Open does not mean winnable. The fit score is a separate question from eligibility.

The row-level data is in `remote_eligibility_audit.csv` beside this file.
