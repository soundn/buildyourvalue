# Nigerian Job-Seeker Market and Pain Points (2025-2026)

Research note for a product team designing an AI-assisted, subscription-based career platform (CV building, email-delivered job matching, course recommendations) for Nigerians. Compiled 2026-10-20 from web search results only; full-page fetches (DataReportal, AllAfrica, TechCabal, NBS PDFs) were blocked by the research environment's network, and the shared web-search budget ran out before every sub-question could be closed. Figures are quoted as reported by the linked source; anything older than 2024 is flagged.

## Key Question 1: Unemployment, underemployment, youth unemployment, and annual inflow of graduates / NYSC corps members

### Takeaway
Official NBS figures (new ILO-aligned methodology) show very low headline unemployment (4.3% in Q2 2024) but roughly 93% informal employment and 9.2% time-related underemployment; the last confirmed NBS Labour Force Survey release found in this research is Q2 2024 (published Nov 2024) and no Q3 2024, Q4 2024 or 2025 release surfaced. Roughly 600,000 graduates a year feed the NYSC, which can only mobilise about 418,000-450,000 in 2026 and carries a backlog reported at over 500,000.

### Cited Findings
- NBS Labour Force Survey Q2 2024: headline unemployment 4.3%, down from 5.3% in Q1 2024 and 5.0% in Q3 2023 — [Guardian Nigeria](https://guardian.ng/news/unemployment-rate-drops-to-4-3-in-q2-2024-nbs/); NBS report PDF — [NBS](https://nigerianstat.gov.ng/download/1241594)
- NBS Q1 2024: unemployment 5.3%, up from 5.0% in Q3 2023 — [NAN](https://nannews.ng/?p=266943); [Arise TV](https://www.arise.tv/nigerias-unemployment-rate-rises-to-5-3-in-q1-2024-nbs-report-reveals/); NBS Q1 2024 PDF — [NBS](https://nigerianstat.gov.ng/download/1241429)
- Youth (15-24) unemployment Q2 2024: 6.5%, down from 8.4% in Q1 2024 — [EUAA Nigeria country focus](https://www.euaa.europa.eu/nigeria-country-focus/323-employment-specific-groups); [BusinessDay editorial](https://businessday.ng/editorial/article/alleviating-poverty-through-education/) (BusinessDay notes 2025 youth unemployment is only "projected" at ~6.5% from Q2 2024 data, i.e. an extrapolation, not a measurement)
- Time-related underemployment Q2 2024: 9.2%, down from 10.6% in Q1 2024; combined unemployment + underemployment (LU2) 13.0%, down from 15.3% — [Guardian Nigeria](https://guardian.ng/news/unemployment-rate-drops-to-4-3-in-q2-2024-nbs/); [NESG Unemployment Alert Q2 2024 PDF](https://nesgroup.org/download_resource_documents/Unemployment%20Alert%202024Q2_1732787107.pdf)
- Informal employment Q2 2024: 93.0% of employed persons (92.7% in Q1 2024); non-agricultural informal employment 90.4% (NESG); 85.6% of working Nigerians are self-employed — [Nairametrics](https://nairametrics.com/2024/11/26/nbs-says-85-6-of-working-class-nigerians-are-self-employed/); [BusinessDay](https://businessday.ng/business-economy/article/self-employment-lowers-nigerias-jobless-rate-to-4-3/); [NESG](https://nesgroup.org/download_resource_documents/Unemployment%20Alert%202024Q2_1732787107.pdf)
- EUAA cites a "2025" unemployment rate of 4.15% for women and 2.14% for men (15-64) but does not cite a primary NBS release; treat with caution — [EUAA](https://www.euaa.europa.eu/nigeria-country-focus/323-employment-specific-groups)
- Advocacy figure: a September 2025 "State of the Nigerian Youth" report claims nearly 80 million Nigerian youth are unemployed; this is not comparable to the NBS labour-force definition and its methodology could not be checked — [AllAfrica](https://allafrica.com/stories/202509050114.html)
- Older NBS data points (pre-2024, flagged): Q2 2023 unemployment 4.2% (Q1 2023: 4.1%) — [Premium Times tag page](https://www.premiumtimesng.com/tag/labour-force)
- NBS microdata catalogue lists Q1 and Q2 2024 LFS; no later quarter surfaced in search — [NBS microdata catalog 152](https://microdata.nigerianstat.gov.ng/index.php/catalog/152/related-materials); [catalog 151](https://microdata.nigerianstat.gov.ng/index.php/catalog/151/related-materials)
- NYSC Director-General Olakunle Nafiu: "over 400 corps-producing institutions turning out around 600,000 graduates yearly"; not all are eligible each year (exemptions; doctors and lawyers do extra training first) — [TheCable](https://www.thecable.ng/?p=1297801); [Leadership](https://leadership.ng/federal-government-approves-50000-additional-nysc-mobilisation-slots/)
- 2026 mobilisation target: ~418,000 corps members after President Tinubu approved an additional 50,000 slots in the 2026 budget "in response to ... long waits for mobilisation" — [NAN](https://nannews.ng/tinubu-approves-additional-50000-for-nysc-mobilisation-in-2026/); [VON](https://von.gov.ng/nysc-gets-50000-additional-nysc-mobilisation-slots/); a later NYSC statement cites 450,000 approved for 2026 — [VON](https://von.gov.ng/nysc-to-mobilise-450000-graduates-in-2026/); a 2025 projection of ~650,000 for 2026 also appeared and looks inconsistent — [MSME Africa](https://msmeafricaonline.com/?p=64907)
- NYSC backlog: commentary (Feb 2026) says over 500,000 graduates are awaiting mobilisation and that the scheme can only mobilise ~240,000-350,000 a year; this is analysis, not an official figure — [AllAfrica](https://allafrica.com/stories/202602030633.html)
- 2025 Batch C: only about 40% of registered prospective corps members could join the orientation course because camp capacity across 36 states + FCT was limited — [ABS Tech Connect](https://www.abstechconnect.com/blogs/important-update-for-2025-batch-c-prospective-corps-members-db10041b); Batch C1 registration opened 4 Nov 2025, camp 19 Nov-9 Dec 2025 — [Leadership](https://leadership.ng/2025-nysc-batch-c1-how-to-get-your-call-up-number-all-you-need-to-know/)
- Example of batch scale: Edo State received 1,900 PCMs for 2025 Batch A Stream I alone — [Gazette Nigeria](https://gazettengr.com/2025-batch-a-stream-i-edo-hosts-1900-corps-members/)

### Inferences
- The headline 4.3% rate masks the real problem: ~93% informality and self-employment mean "unemployment" is largely hidden as precarious hustling. A product should assume most "employed" users are actually seeking a first formal job or a better one.
- NYSC alone creates a predictable, dated inflow of ~400,000-450,000 people a year who enter the job market within 12 months of mobilisation, plus a backlog of 500,000+ waiting to serve, both of whom are concentrated, reachable cohorts (batch dates are public).
- The gap between ~600,000 graduates and ~418,000 mobilisation slots means roughly 150,000-200,000 graduates a year are in limbo (not serving, usually not yet employable in formal roles that require NYSC discharge certificates).

### Gaps
- No NBS Labour Force Survey release after Q2 2024 was found; whether NBS published Q3/Q4 2024 or any 2025 quarter is unconfirmed (search budget exhausted before checking nigerianstat.gov.ng directly).
- ILO modelled estimates and World Bank youth unemployment / NEET figures for Nigeria 2025 were not retrieved.
- No official figure for total graduates (universities + polytechnics + colleges of education) from NUC/NBTE/JAMB; only the NYSC DG's ~600,000 statement.

## Key Question 2: Job-seeker segments and their rough sizes

### Takeaway
Hard segment sizes are scarce; the best proxies are ~418,000-450,000 NYSC corps members a year (fresh graduates), ~12 million Nigerian LinkedIn users (white-collar/professional pool), ~17% of Nigerian jobs being remote, and a very large informal/blue-collar majority (93% of the employed). Diaspora-bound seekers can be sized from UK migration (~52,000 Nigerians in 2024, 27,000 on work visas).

### Cited Findings
- Fresh graduates / NYSC: ~600,000 graduates a year; ~418,000-450,000 to be mobilised in 2026 — [TheCable](https://www.thecable.ng/?p=1297801); [VON](https://von.gov.ng/nysc-to-mobilise-450000-graduates-in-2026/)
- Professional / white-collar proxy: LinkedIn users in Nigeria ~11.62 million (4.9% of population) in Jan 2025, rising to ~12.03 million (5.1%) in June 2025 and ~12.13 million in July 2025; 25-34 age group is largest at ~6.3 million — [NapoleonCat Jan 2025](https://napoleoncat.com/stats/linkedin-users-in-nigeria/2025/01); [NapoleonCat Jun 2025](https://napoleoncat.com/stats/linkedin-users-in-nigeria/2025/06); [NapoleonCat Jul 2025](https://napoleoncat.com/stats/linkedin-users-in-nigeria/2025/07)
- Remote-work seekers: MyJobMag 2025 report puts remote work at ~17% of Nigerian jobs vs a 28% global average; MyJobMag 2026 data: fewer than 10% of Nigerian remote workers earn above $350/month and 82% would prefer structured local employment over freelancing remotely — [Vanguard, July 2026](https://www.vanguardngr.com/2026/07/remote-work-reshapes-nigerias-tech-workforce-widens-global-opportunities/amp/); [AllAfrica](https://allafrica.com/stories/202607240385.html)
- Jobberman (2025): 62% of international companies were actively recruiting young Africans for remote roles or via freelance platforms; World Bank estimates Nigerians account for a significant share of 17.5 million online freelancers across Nigeria, Ghana and South Africa (regional figure, not Nigeria-specific) — [Vanguard](https://www.vanguardngr.com/2026/07/remote-work-reshapes-nigerias-tech-workforce-widens-global-opportunities/amp/)
- Blue-collar / informal: 93.0% informal employment, 85.6% self-employed (Q2 2024) — [Nairametrics](https://nairametrics.com/2024/11/26/nbs-says-85-6-of-working-class-nigerians-are-self-employed/)
- Diaspora-bound: ONS 2024 estimates ~52,000 Nigerians migrated to the UK in 2024 (27,000 work visas, 22,000 study, 3,000 other), down sharply from the 141,000 in the year to June 2023 (when Nigerians were the second-largest non-EU nationality for UK immigration after Indians) — [ICIR](https://www.icirnigeria.org/?p=251245); [Gazette Nigeria](https://gazettengr.com/fresh-data-shows-141000-nigerians-fled-to-uk-in-one-year-as-economy-worsens-under-tinubu/)
- Canada (older, flagged): 12,595 permanent-resident permits to Nigerians in 2019 (+214.9% vs 2015); over 51,000 Nigerians admitted as PRs 2016-2021 — [Dataphyte](https://dataphyte.com/latest-reports/why-are-nigerians-becoming-japarians-blame-it-on-the-state-of-the-nation)
- Marginalised segments (Jobberman/Mastercard Foundation 2025 report): 72% of Nigerian employers make no effort toward inclusive hiring; among surveyed PWDs and displaced women, 55% of PWDs and 44% of displaced women had secured some work, mainly self-employment in creative media and agriculture — [Nairametrics](https://nairametrics.com/?p=427610)
- Jobberman 2022 report (flagged, older): "more than half" of surveyed unemployed youth were both unemployed and unemployable; <1% had benefited from government social-security initiatives; coping via hustling, family/friends and partner stipends; North East and North West face longer unemployment spells — [TechCabal](https://techcabal.com/?p=104659); [BusinessDay](https://businessday.ng/?p=609984)
- Age ceilings: some large Nigerian employers set maximum ages for graduate roles, with some cut-offs now around 25 — [NaijaTechGuide](https://www.naijatechguide.com/why-your-dream-graduate-job-remains.html)

### Inferences
- The addressable "formal-job-seeking" segment is probably in the 10-15 million range (LinkedIn users + annual NYSC cohorts + backlog), not the 80 million advocacy number; the blue-collar majority is much larger but harder to serve with CV/ATS tooling and email delivery.
- Remote-work seekers are motivated by FX earnings but most earn little; the 82%-prefer-local-employment finding suggests remote roles are a complement, not the core, of what most users want.
- Age ceilings (~25) make speed-to-first-job a genuine anxiety for fresh graduates; a product that shortens time-to-first-offer has a concrete value proposition for them.

### Gaps
- No Nigeria-specific count of online freelancers (only the 17.5m three-country World Bank figure).
- No 2025 Canadian or US visa figures for Nigerians were retrieved.
- No size estimate for mid-career professionals actively job-hunting, or for artisans using digital job channels.

## Key Question 3: How Nigerians find jobs today (channels)

### Takeaway
No large, recent survey quantifying channel split (WhatsApp vs LinkedIn vs job boards) was found. Qualitative reporting describes a highly fragmented market: Jobberman is the largest local board, with MyJobMag, HotNigerianJobs, NgCareers etc. sharing the rest, while WhatsApp/Telegram groups, X threads and Instagram recruiter pages carry a large share of postings informally; LinkedIn has become a major tool for white-collar and tech talent.

### Cited Findings
- Guardian Nigeria: the Nigerian job market is "distributed across dozens of sources" unlike the US/UK; Jobberman is the largest local board, with MyJobMag, BestJobs, HotNigerianJobs and NgCareers each holding part of the market; WhatsApp groups, Telegram channels, Twitter threads and Instagram pages run by recruitment consultants are named as informal channels where openings are posted (anecdotal, one job seeker's account) — [Guardian Nigeria](https://guardian.ng/business-services/how-nigerian-job-seekers-are-using-aggregation-platforms-to-navigate-a-fragmented-market/)
- BusinessDay: LinkedIn "has evolved into a major job-hunting tool in Nigeria" (citing Sensor Tower download data), especially among white-collar professionals, startups and tech talent; mobile apps are "increasingly becoming the first stop" for Nigerians seeking work — [BusinessDay](https://businessday.ng/?p=1038800)
- Jobberman/TATC with Mastercard Foundation claims to have trained over 2.4 million young Nigerians and facilitated 600,000+ job placements since 2020 (self-reported; no independent evaluation found) — [Leadership](https://leadership.ng/?p=149856)
- Jobberman Ghana (not Nigeria) prices job-seeker premium at GHC 70/month and alert packages from GHC 20/month, showing the group's model of charging seekers for alerts — [Jobberman Ghana](https://www.jobberman.com.gh/discover/better-customer-experience-with-our-new-prices-our-priceshttps-www-jobberman-com-gh-discover-better-customer-experience-with-our-new-prices)
- Social platform reach: WhatsApp was the most popular social platform in Nigeria in Q3 2024, cited by over 95% of internet users aged 16+ — [Statista](https://www.statista.com/statistics/1176101/leading-social-media-platforms-nigeria/); NOI Polls (undated): usage Facebook 86%, WhatsApp 84%, Instagram 19%, Twitter 11%, Snapchat 2%; WhatsApp most preferred at 51% vs Facebook 45% — [NOI Polls](https://www.noi-polls.com/post/social-media-poll-result-release)
- LinkedIn ~12 million Nigerian users vs ~109 million internet users (so roughly 1 in 9 internet users) — [NapoleonCat](https://napoleoncat.com/stats/linkedin-users-in-nigeria/2025/06); [DataReportal Digital 2026 Nigeria](https://datareportal.com/reports/digital-2026-nigeria)
- Small academic studies exist (188 job seekers at Nexus International University, 2022; 184 NYSC members in Ogun State) but channel breakdowns were not accessible — [Crawford University repository](https://repository.crawforduniversity.edu.ng/handle/123456789/177); [Babcock University](https://publications.babcock.edu.ng/publication/view/1109)
- Volume per vacancy (sponsored content, indicative only): a posting from a reputable company on major Nigerian boards or LinkedIn draws ~200-500 applications, 2,000+ for multinationals, banks or oil & gas — [Techpoint Brand Press](https://techpoint.africa/brandpress/cvsense-launches-ai-recruitment-platform-to-help-companies-reduce-costly-hiring-mistakes/)
- Paramilitary recruitment drive drew ~1.9 million applicants for 30,000 posts — [AllAfrica, Aug 2025](https://allafrica.com/stories/202508190095.html)
- NYSC placement is a documented path to a first job: graduates who serve at a company they want to join are often offered a role after service — [CVStudio](https://www.cvstudio.io/first-job-after-university-nigeria)

### Inferences
- Because WhatsApp reach (>95% of internet users) dwarfs LinkedIn (~11%), discovery and distribution for a mass-market product should lean on WhatsApp/Telegram sharing; LinkedIn is the right channel only for the white-collar/tech sub-segment.
- Fragmentation itself is a pain point: aggregation + de-duplication + scam-filtering is a defensible job-to-be-done.
- Extreme applicant-to-vacancy ratios (200-2,000+ per role) mean users value anything that improves screening pass-through (CV/ATS optimisation) and early alerts.

### Gaps
- No quantitative survey (2024-2026) of channel usage shares by Nigerian job seekers was found; Jobberman's own market reports were not retrieved before the search budget ran out.
- Newspaper and recruitment-agency usage shares were not covered by any result.

## Key Question 4: Documented pain points

### Takeaway
Recruitment fraud ("pay to apply", fake slots, impersonated HR) is the most heavily documented pain point in 2025, with demanded fees of ₦5,000-₦500,000; ghosting, 2-year-experience requirements for entry-level roles, age ceilings, ATS screening, and the cost of data are documented mostly through commentary and vendor content rather than surveys.

### Cited Findings
- Scam fees: fraudsters posing as officials or middlemen promise a guaranteed "slot" for a fee; fees for processing, training, onboarding or medical tests range from ₦5,000 to ₦500,000 — [AllAfrica, 19 Aug 2025](https://allafrica.com/stories/202508190095.html)
- Dangote Group (Aug 2025) warned of scammers impersonating its HR staff on LinkedIn and other platforms demanding payment; it never takes payment at any stage and posts vacancies only on its careers portal — [Nairametrics](https://nairametrics.com/?p=508829); [Nigeria Startup Act portal news](https://www.nigeriastartupact.ng/?p=7738); Dangote Cement disowned social-media ads asking for an "administrative fee" — [Global Cement](https://globalcement.com/news/12704-dangote-cement-warns-public-against-recruitment-scam)
- Nigeria Immigration Service (Feb 2025) warned no recruitment was underway and fraudulent adverts were circulating; similar past warnings from Nigeria Customs Service and CBN — [BusinessDay opinion](https://businessday.ng/opinion/article/the-rise-of-recruitment-fraud-in-nigeria-how-job-seekers-can-stay-safe/); Julius Berger "not hiring" fact-check — [Africa Check](https://africacheck.org/fact-checks/meta-programme-fact-checks/nigerian-construction-giant-julius-berger-not-hiring-warns)
- NgCareers maintains a public list of suspected fake recruiters/employers — [NgCareers](https://ngcareers.com/fake-companies)
- Overseas-job scam variant: fake foreign offers demand >$1,000 for visas/travel via wire transfer, after which the payee cannot be traced — [ACE Money Transfer](https://acemoneytransfer.com/es/blog/how-nigerians-in-the-netherlands-are-falling-for-fake-job-offers-online)
- Ghosting: Zikoko (satire, anecdotal) calls Nigerian recruiters the "OGs" of ghosting, including candidates who pass several interview stages; salary-expectation questions are a common trigger for silence — [Zikoko](https://www.zikoko.com/?p=307304)
- Experience requirements: fresh graduates are rejected for lacking the "2 years of experience" many entry-level listings ask for — [NaijaTechGuide](https://www.naijatechguide.com/why-your-dream-graduate-job-remains.html); a 2026 guide says such requirements describe an "ideal candidate" and strong graduates still get hired — [CVStudio](https://www.cvstudio.io/first-job-after-university-nigeria)
- Age ceilings for graduate roles, some now ~25 — [NaijaTechGuide](https://www.naijatechguide.com/why-your-dream-graduate-job-remains.html)
- ATS: one Nigerian applicant sent 3,000+ applications in 2023 and received ~2,000 rejections, attributing it to ATS screening (single anecdote) — [Techpoint Africa](https://techpoint.africa/2024/05/01/applicant-tracking-systems-weakness-recruitment/); Nigerian CV guides say ATS drops CVs lacking role-specific keywords and that fresh graduates list credentials without framing experience — [Profolio](https://www.profolio.ng/data-scientist/cv-sample); [Profolio](https://www.profolio.ng/recruiter/entry-level-cv)
- An unsourced vendor claim that "73% of Nigerian CVs are rejected by ATS before a human reads them" exists; no methodology, do not cite as fact — [Britzzy Joblin landing page](https://britzzy-joblin.hf.space/)
- Recruiters spend ~7.4 seconds on a CV (2018 Ladders eye-tracking, US study, not Nigerian) — cited via [Techpoint Brand Press](https://techpoint.africa/brandpress/cvsense-launches-ai-recruitment-platform-to-help-companies-reduce-costly-hiring-mistakes/)
- Skills mismatch: Coursera data show Nigerian learners score 51% in entrepreneurship courses but only 3% in cloud computing — [Techpoint Africa](https://techpoint.africa/insight/nigeria-coursera-skills-deficiency/); Jobberman 2022: more than half of surveyed youth both unemployed and "unemployable" (older) — [TechCabal](https://techcabal.com/?p=104659)
- Remote-work payment friction: PayPal limitations in Nigeria push workers to Payoneer; exchange-rate losses of ~₦100 per transfer cited; Nigeria Tax Act 2025 taxes residents on worldwide income — [Vanguard](https://www.vanguardngr.com/2026/07/remote-work-reshapes-nigerias-tech-workforce-widens-global-opportunities/amp/); 3MTT newsletter notes Nigeria has agreements with 100+ countries (US, UK, Canada) to track residents' foreign income — [3MTT Insider](https://3mttofficial.substack.com/p/3mtt-insider-unlocking-the-future)
- Data cost as a barrier: see Key Question 5 (1GB rose ~65% in early 2025)

### Inferences
- Trust is the primary differentiator: a platform that verifies employers and guarantees "never pay to apply" addresses the most visible, emotionally charged pain point; user education against scams can double as acquisition content.
- "No feedback" and ghosting mean users have no idea why they fail; an AI tool that explains CV/keyword gaps per job (a proxy for feedback) fills a real vacuum.
- Because many complaints are documented only anecdotally, the product team should run its own survey; the evidence base for prioritising ATS vs scams vs experience-requirements is thin.

### Gaps
- No Nairaland or r/Nigeria threads were retrieved (the Nairaland-restricted search was blocked by the budget limit); first-hand anecdotes come only from Zikoko, Techpoint and career blogs.
- No survey quantifying ghosting rates, lack-of-feedback rates, or the share of listings asking for 2+ years' experience in Nigeria.
- No data on transport costs for in-person interviews or cyber-café costs.

## Key Question 5: Internet and device access

### Takeaway
About 107-109 million Nigerians are online (~45% penetration), almost all on mobile; Android holds ~82% of mobile OS share vs ~18% iOS; smartphone penetration is ~54-65% of connections depending on source; and a 1GB bundle rose ~65% on average to ~₦475 after the NCC approved a 50% tariff hike in January 2025. WhatsApp reaches >95% of internet users; no data on email-checking frequency was found.

### Cited Findings
- DataReportal Digital 2025 Nigeria: 107 million internet users at start of 2025, penetration 45.4%; 150 million cellular connections (64.0% of population) — [DataReportal Digital 2025 Nigeria](https://datareportal.com/reports/digital-2025-nigeria)
- DataReportal Digital 2026 Nigeria: 109 million internet users at end of 2025, penetration 45.5% — [DataReportal Digital 2026 Nigeria](https://datareportal.com/reports/digital-2026-nigeria)
- TechCabal (Aug 2025): Nigeria lost ~1 million internet users in six months; Canalys: smartphone sales volumes fell 7% Jan-Jun 2025 — [TechCabal](https://techcabal.com/2025/08/06/nigeria-loses-one-million-internet-users/)
- Smartphone penetration (Feb 2026, citing NCC): ~65.1%; Airtel reported its smartphone penetration rose 4.6 points to 54.1% — [MEXC news](https://www.mexc.com/news/634818) (secondary aggregator; definitions differ)
- Mobile OS share, Nigeria, Aug 2026 (StatCounter): Android 81.96%, iOS 17.93% — [StatCounter](https://gs.statcounter.com/os-market-share/mobile/nigeria/%5C); mobile+tablet June 2026: Android 82.58%, iOS 17.25% — [StatCounter](https://gs.statcounter.com/os-market-share/mobile-tablet/nigeria); tablets June 2025: Android 88.3%, iOS 11.4% — [Statista](https://www.statista.com/statistics/1176101/leading-social-media-platforms-nigeria/) (caution: several StatCounter result pages were for Niger, not Nigeria)
- NCC approved a 50% tariff increase (calls, data, SMS) in January 2025; regulatory ceiling for 1GB rose from ₦287.5 to ₦431.25; operators had sought >100% — [Condia](https://thecondia.com/mtn-nigeria-data-price-hike-2025/); [AllAfrica](https://allafrica.com/stories/202501070420.html); [Dubawa](https://dubawa.org/new-telecom-tariff-hike-what-this-means-for-nigerians/?amp=1)
- Retail 1GB: average across MTN, Airtel, Glo, 9mobile rose 65.22% from ₦287.5 to ₦475; MTN ₦200 -> ₦350, Airtel ₦350 -> ₦500, Glo ₦300 -> ₦750, 9mobile unchanged at ₦300 — [BusinessDay](https://businessday.ng/?p=928934)
- Larger bundles: MTN weekly 15GB rose ₦2,000 -> ₦6,000; monthly 75GB ₦16,000 -> ₦20,000 — [GBC Ghana](https://www.gbcghanaonline.com/news/nigerians-outraged-as-mobile-data-prices-soar-despite-regulatory-cap/2025/); [BusinessDay](https://businessday.ng/?p=949775)
- WhatsApp: most popular platform in Nigeria Q3 2024, >95% of internet users 16+ — [Statista](https://www.statista.com/statistics/1176101/leading-social-media-platforms-nigeria/); WhatsApp users "majority between 16 and 40" (no official count) — [Technology Times](https://technologytimes.ng/whatsapp-most-used-chat-app-nigeria/); Kaspersky (May 2020-Apr 2021, older): WhatsApp most-visited app by Nigerian children, then YouTube and Zoom — [Technext](https://technext.ng/2021/06/09/e-learning-pushes-whatsapp-above-facebook-as-most-used-app-by-children-in-nigeria/)
- Coursera (2023, older): 79% of Nigerian learners learn on mobile devices — [Techpoint Africa](https://techpoint.africa/insight/nigeria-coursera-skills-deficiency/)
- Only ~1 in 9 internet users is on LinkedIn (~12m vs ~109m) — [NapoleonCat](https://napoleoncat.com/stats/linkedin-users-in-nigeria/2025/06); [DataReportal](https://datareportal.com/reports/digital-2026-nigeria)

### Inferences
- Design for Android-first, low-end devices, and data-light pages; a 1GB bundle at ₦350-₦750 is a meaningful recurring cost, so heavy web apps or large PDF downloads are a friction point.
- Email delivery is viable for the graduate/professional segment (every university, NYSC and LinkedIn account requires an email), but WhatsApp is where attention lives; the product should offer WhatsApp (or at least WhatsApp-shareable) delivery alongside email.
- Flat internet penetration (45.4% -> 45.5% in a year) and falling smartphone sales mean the addressable online population is not growing fast; growth must come from share, not market expansion.

### Gaps
- No data on how often young Nigerians check email vs WhatsApp, or on email-open rates in Nigeria; this is a key unknown for an email-delivered product and should be tested directly.
- DataReportal device, speed and per-platform ad-audience figures for Nigeria could not be extracted (page fetch blocked).
- No 2026 price list for 1GB bundles was retrieved; 2025 figures may be stale.
- GSMA Mobile Economy Sub-Saharan Africa and NCC subscriber statistics were not retrieved.

## Key Question 6: What Nigerian job seekers already pay for, and willingness to pay

### Takeaway
Documented price points: professional CV rewrites run ₦10,000-₦30,000 (tiered by seniority), a small 2024-25 survey found Gen Z spending ~₦462,500/year on online upskilling including data, and Jobberman's sister site in Ghana charges job seekers GHC 20-70/month for alerts/premium. No Nigeria-specific LinkedIn Premium or Jobberman job-seeker price, and no robust willingness-to-pay survey, was found.

### Cited Findings
- MyJobMag CV rewrite: entry-level CV rewrite listed at ₦30,000; cover-letter and LinkedIn profile rewrites also offered — [MyJobMag](https://www.myjobmag.com/rewrite-services)
- RightMyCV tiers: ₦10,000 (0-2 yrs), ₦20,000 (3-9 yrs, adds LinkedIn review), ₦30,000 (10+ yrs, adds role-suitability report) — [RightMyCV](https://rightmycv.onrender.com)
- Selar listings: resume writing at ₦10,000 (or $7 internationally), 3-day delivery — [Selar](https://selar.com/p555047x71); senior "Experienced CV Branding" at $88.48 — [Selar](https://selar.com/experiencedCV)
- Freelance CV writers on Hubstaff charge ~$4/hour (individual, Lagos) — [Hubstaff Talent](https://hubstafftalent.net/profiles/chinedu-marvelous-munachimso)
- Online upskilling spend: survey of 12 respondents aged 17-29 found typical annual spend of ₦462,500 (courses, bootcamps, certifications and mobile data), 61% of their total education spend; sample too small to generalise — [Condia](https://thecondia.com/gen-z-cost-online-upskilling-nigeria/)
- Coursera (2023, older): 1.7 million Nigerian learners; Nigeria ranked third globally for professional-certificate enrolment; 33% women; 79% on mobile — [Techpoint Africa](https://techpoint.africa/insight/nigeria-coursera-skills-deficiency/); Nigerian STEM enrolments doubled YoY to March 2023 — [Intelpoint](https://intelpoint.co/?p=446)
- Local course marketplace Kobocourse reports 13,000+ creators and learners registered — [Techeconomy](https://techeconomy.ng/?p=148709)
- Jobberman Ghana (proxy for group pricing model, not Nigeria): premium job-seeker products GHC 70/month, alert packages from GHC 20/month — [Jobberman Ghana](https://www.jobberman.com.gh/discover/better-customer-experience-with-our-new-prices-our-priceshttps-www-jobberman-com-gh-discover-better-customer-experience-with-our-new-prices)
- Jobberman Nigeria employer-side prices seen: ₦11,500 and ₦100,000 job-posting tiers (older BusinessDay coverage) — [BusinessDay](https://businessday.ng/?p=285679); [Channels TV, 2020](https://www.channelstv.com/2020/03/03/sponsored-jobberman-reduces-prices-offers-more-value/)
- LinkedIn Premium Career global pricing reported at $29.99-$39.99/month or ~$239/year, varying by region; no naira figure found — [Salesbread](https://salesbread.com/how-much-does-linkedin-premium-cost/); [Tech.co](https://tech.co/news/how-much-linkedin-premium-cost-worth-it)
- Scam "fees" of ₦5,000-₦500,000 that people actually pay indicate what desperate seekers will spend for perceived access — [AllAfrica](https://allafrica.com/stories/202508190095.html)
- Remote-worker earnings: <10% earn above $350/month (MyJobMag 2026) — [Vanguard](https://www.vanguardngr.com/2026/07/remote-work-reshapes-nigerias-tech-workforce-widens-global-opportunities/amp/)

### Inferences
- A one-off ₦10,000-₦30,000 CV rewrite is the established anchor price; a subscription priced well below that per month (e.g. ₦2,000-₦5,000) but bundling CV, matching and courses could undercut human CV writers while feeling cheap relative to a 1GB-per-week data habit (~₦1,500-₦3,000/month).
- The fact that people pay scammers ₦5,000+ for "slots" shows willingness to pay for perceived access to jobs, but also that trust (refund guarantees, verified employers) is a precondition.
- Mid/senior professionals (paying ₦20,000-₦30,000 for CVs, $88 for branding) are the most monetisable tier; fresh graduates are price-sensitive and better reached with freemium.

### Gaps
- No Nigeria-specific LinkedIn Premium or Jobberman Nigeria job-seeker price (search budget exhausted before the jobberman.com-restricted search ran).
- No representative willingness-to-pay survey for job-search tools in Nigeria; the 12-person Condia sample is the only direct spend evidence.
- No data on cyber-café usage or pricing.

## Key Question 7: Macro factors (inflation, naira, japa, remote work, 3MTT, Startup Act)

### Takeaway
Inflation has fallen from 22.22% (June 2025) to 15.91% (June 2026) with the naira near ₦1,380/$ and a narrow parallel-market gap; UK-bound "japa" fell from 141,000 (year to June 2023) to ~52,000 (2024); 3MTT has selected ~390,000 fellows across cohorts but reported only ~117,000 trained by Aug 2025; the Startup Act portal had registered 12,948 startups at an early snapshot with labelling and seed-fund status unclear.

### Cited Findings
- Inflation: 15.91% y/y in June 2026, down from 22.22% a year earlier (PwC H2 2026 outlook) — [Techeconomy](https://techeconomy.ng/pwc-nigerias-inflation-halves-naira-steadies-as-reforms-take-hold); 15.06% in Feb 2026 — [United Capital Inflation Watch Jan 2026 PDF](https://unitedcapitalplcgroup.com/wp-content/uploads/2026/01/Inflation-watch-January-2026.pdf); CBN projects 12.94% average for 2026; one analyst group forecasts 6.57% by Dec 2026 — [Leadership](https://leadership.ng/analysts-forecast-5-5-gdp-growth-inflation-at-6-in-2026/); government projects 4.68% GDP growth in 2026 — [AllAfrica](https://allafrica.com/stories/202601160069.html)
- Naira: ₦1,380.47/$ on 24 Mar 2026 — [Trading Economics](https://tradingeconomics.com/nigeria/currency); ₦1,379.68 official vs ₦1,385 parallel in June 2026 (PwC) — [Techeconomy](https://techeconomy.ng/pwc-nigerias-inflation-halves-naira-steadies-as-reforms-take-hold); CBN forecast ~₦1,400/$ for 2026 — [Leadership](https://leadership.ng/analysts-forecast-5-5-gdp-growth-inflation-at-6-in-2026-2/)
- Japa (UK): ~52,000 Nigerians in 2024 (27k work, 22k study, 3k other) vs 141,000 in year to June 2023; UK net migration fell to 431,000 from 860,000 — [ICIR](https://www.icirnigeria.org/?p=251245); [Gazette Nigeria](https://gazettengr.com/fresh-data-shows-141000-nigerians-fled-to-uk-in-one-year-as-economy-worsens-under-tinubu/); stricter UK/Canada/US visa policies are delaying "japa" plans — [Nigeria Housing Market](https://www.nigeriahousingmarket.com/guides/japa-dreams-delayed-how-stricter-visa-policies-in-uk-canada-us-impact-housing-demand-in-nigeria); factfile — [Nation Africa](https://nation.africa/africa/news/nigeria-s-japa-migration-phenonemon-factfile-3937144)
- Remote work: ~17% of Nigerian jobs remote (MyJobMag 2025); 62% of international companies recruiting young Africans remotely (Jobberman 2025); <10% of remote workers earn >$350/month and 82% prefer structured local employment (MyJobMag 2026) — [Vanguard](https://www.vanguardngr.com/2026/07/remote-work-reshapes-nigerias-tech-workforce-widens-global-opportunities/amp/)
- 3MTT: Cohort 1 = 30,000 fellows; Cohort 2 = 270,000 (10% of the 3 million target) — [FMCIDE](https://fmcide.gov.ng/minister-kicks-off-phase-2-of-3mtt-initiative-270000-new-fellows-selected/); [NAN](https://nannews.ng/ministry-commences-phase-2-of-3mtt-initiative-selects-270000-fellows/); a later cohort added 90,000 — [Nairametrics](https://nairametrics.com/?p=502219); Minister Tijani said in Aug 2025 that 117,000+ had been trained, some already employed — [Nairametrics](https://nairametrics.com/?p=521588); 30,000 fellows "ready for job market" — [Technology Times](https://technologytimes.ng/3mtt-30000-fellows-ready-for-job-market/)
- 3MTT placement: 3MTT-NJFP Placement Initiative launched 29 Oct 2025 offering pre-screened fellows to employers at no recruitment cost; Microsoft, Airtel and others engaging — [FMCIDE](https://fmcide.gov.ng/ministry-announces-3mtt-njfp-placement-initiative-to-connect-skilled-digital-talent-with-employers-nationwide/); NJFP placed 3,000 fellows into 3MTT (2024) — [UNDP](https://www.undp.org/nigeria/press-releases/nigeria-jubilee-fellows-programme-njfp-places-3000-fellows-3-million-tech-talent-programme-3mtt-fuel-innovation-and-employment); FG partnering with BPO firms to outsource trained Nigerians to foreign companies — [Guardian Nigeria](https://guardian.ng/technology/fg-bpo-companies-partner-to-create-jobs-for-3mtt-fellows/); 3MTT-Loubby AI partnership for global employment — [Techeconomy](https://techeconomy.ng/?p=116558)
- Nigeria Startup Act 2022: NITDA reported 12,948 startups registered on the portal plus 912 VCs, 1,735 angels, 925 hubs (early snapshot, undated in result) — [Guardian Nigeria](https://guardian.ng/business-services/nigeria-startup-act-attracts-12948-small-businesses-as-labeling-begins/); label valid 10 years, issued by NITDA as Secretariat to the National Council — [Mondaq, Nov 2025](https://www.mondaq.com/nigeria/corporate-and-company-law/1703610/obtaining-a-startup-label-under-the-nigeria-startup-act-2022); two-year review notes labelling requirement and a seed fund for labelled startups — [Mondaq](https://webiis08.mondaq.com/nigeria/corporate-and-company-law/1699582/startup-act-in-nigeria-two-years-on); KPMG summary — [KPMG PDF](https://assets.kpmg.com/content/dam/kpmg/ng/pdf/Nigerian-Startup-Act.pdf)
- Tax: Nigeria Tax Act 2025 taxes residents on worldwide income (relevant to remote earners) — [Vanguard](https://www.vanguardngr.com/2026/07/remote-work-reshapes-nigerias-tech-workforce-widens-global-opportunities/amp/)

### Inferences
- With inflation still ~16% and the naira ~₦1,380/$, naira-denominated subscription prices will need periodic review; dollar-linked pricing is feasible only for the remote-work/diaspora tier.
- Slowing japa (tighter UK/Canada/US visas) likely redirects ambition toward remote foreign work and better local jobs, both of which a matching + upskilling product can serve.
- 3MTT's ~390,000 selected fellows and the new placement initiative are a ready-made, digitally skilled, government-recognised cohort; partnership or integration (e.g. importing 3MTT credentials) is a plausible acquisition channel.
- Startup Act labelling may offer tax and funding incentives for the platform itself; verify current labelling status with NITDA.

### Gaps
- No 2025-2026 Canadian/US immigration figures for Nigerians.
- Total 3MTT fellows trained as of 2026 and number placed with foreign employers were not found.
- Current count of labelled startups and status of the Startup Act seed fund were not confirmed.
- No GSMA or NCC macro telecom figures retrieved.
