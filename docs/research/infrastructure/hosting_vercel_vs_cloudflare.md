# Hosting: Vercel (behind Cloudflare DNS/CDN) versus all-Cloudflare for two Next.js 16 apps and a Hono API, Nigeria, 10–50M registered users

Date of research: 2026-10-24. Scope: engineering and cost note for two founders.

**Sourcing caveat that applies to every figure in this file.** The research sandbox's egress proxy refused CONNECT (HTTP 403, policy denial) to vercel.com, developers.cloudflare.com, opennext.js.org, blog.cloudflare.com, makerkit.dev and every other external host, and WebFetch returned DNS failures for the same hosts. I therefore could not open any official page. Every price and limit below is marked **[snippet]**: it comes from a web-search summary that quoted the named page. None are **[fetched]**. Where the search engine returned the official page's wording verbatim I say so, but the writer should treat the numbers as "to be confirmed against the live page" and the founders should open the five URLs in the "Verify first" list at the end before signing anything.

---

## Key question 1: Next.js on Cloudflare in 2026 (OpenNext adapter, Vinext, feature support, limits, Pages status)

### Takeaway
Next.js runs on Cloudflare Workers through `@opennextjs/cloudflare` (Node runtime only, pre-1.0 line maturing through 2025–2026) and, since 2026, through Cloudflare's own Vite-based reimplementation `vinext` (1.0 announced, ">99% test compatibility excluding cache components"). ISR, middleware, server actions, PPR and `use cache` are listed as supported by Cloudflare's current guide; image optimisation only via Cloudflare Images. The 3 MB / 10 MB compressed bundle limit was reportedly replaced on 2026-09-04 by a single 64 MiB uncompressed limit on all plans; isolate memory stays 128 MB. Cloudflare Pages is not sunset but Cloudflare recommends Workers (Static Assets) for new projects.

### Cited Findings
- Cloudflare's OpenNext framework guide marks Incremental Static Regeneration (ISR) and Middleware as supported; "the one exception is Node.js middleware introduced in Next.js 15.2, which is not yet supported" (status as indexed; check the live table). Image optimisation is "Supported through Cloudflare Images". The current table lists PPR and `'use cache'` as supported "with a note that both are experimental in Next.js". [snippet] — [Cloudflare: Next.js on Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs); [Cloudflare: OpenNext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)
- The adapter "currently only supports the Node runtime of Next.js"; the Edge runtime is the domain of the older, now-superseded `@cloudflare/next-on-pages`. [snippet] — [OpenNext Cloudflare docs](https://opennext.js.org/cloudflare); [Cloudflare blog, April 2025 1.0.0-beta announcement](https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/)
- Older OpenNext release pages (0.3, 0.5) listed ISR/PPR as partial and "Composable Caching ('use cache') not yet supported"; these are outdated relative to the current Cloudflare table. [snippet] — [OpenNext former releases 0.5](https://opennext.js.org/cloudflare/former-releases/0.5)
- Cloudflare's guide also says to "migrate to vinext when compatibility allows" and that Wrangler's automatic configuration now uses vinext for Next.js projects. [snippet] — [Cloudflare: Next.js on Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs)
- Vinext 1.0 (Cloudflare blog, 2026): "an alternative implementation of the Next.js API surface built on Vite"; "test compatibility has risen to more than 99%, excluding cache components"; covers App Router and Pages Router; deploys to Workers free plan, Netlify or AWS Lambda; Workers is "the first natively supported target". Cloudflare acquired VoidZero (Vite) in June 2026. [snippet] — [Cloudflare blog: Vinext 1.0](https://blog.cloudflare.com/vinext-nextjs-on-vite/); [cloudflare/vinext README](https://github.com/cloudflare/vinext)
- Independent analysis: "OpenNext remains the safer choice for many teams today"; vinext "is more compelling as an experiment in architecture than as a default production recommendation". [snippet] — [LogRocket on vinext](https://blog.logrocket.com/vinext-cloudflares-vite-based-next-js-replacement/); [Pragmatic Engineer: Cloudflare rewrites Next.js](https://blog.pragmaticengineer.com/the-pulse-cloudflare-rewrites-next-js-as-ai-rewrites-commercial-open-source/)
- Next.js 16.2 (March 2026) made the Build Adapters API stable, described by Makerkit as "the foundation for OpenNext, AWS Amplify, Cloudflare, and other non-Vercel deployments", including `proxy.ts`. Next.js 16.2.6 (2026-05-07) patched 13 security advisories. [snippet, third party] — [Makerkit: Next.js 16 what's new](https://makerkit.dev/blog/md/tutorials/nextjs-16)
- As of December 2025 the OpenNext Cloudflare docs still listed Next.js 15 as the only officially supported version (OpenNext issue #972). [snippet] — [Reddit snapshot, Dec 2025](https://reddit.sentinel-team.org/posts/1pex20t/snapshots/2025-12-06T08%3A30%3A34.415989Z)
- Next.js Cache Components (`use cache`) require the Node.js runtime ("Edge runtime not supported") and are not available with static export. [snippet] — [vercel-labs next-skills: cache components](https://skills.cat/skills/vercel-labs/next-skills/next-cache-components)
- Worker size limit (current limits page, as indexed): 3 MB Free / 10 MB Paid. A conflicting, newer snapshot of the same page shows 64 MiB for both tiers. [snippet] — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Secondary reports citing the Cloudflare changelog of 2026-09-04: "the compressed size limit has been removed, with only the uncompressed size checked across all plans"; limit 64 MiB (67,108,864 bytes) on Free and Paid; a 6 MB+ compressed Worker deployed on Free in testing; 64 MB+ rejected with code 10027; `wrangler deploy --dry-run` reports the counted value. [snippet] — [Classmethod: Workers 64 MiB limit](https://dev.classmethod.jp/en/articles/cloudflare-workers-64mib-size-limit/); [releases.sh digest 2026-08-31](https://releases.sh/collections/application-platforms/digest/2026-08-31)
- An OpenNext docs PR referenced "a Free account is capped at 3 MiB per Worker and a Paid one at 10 MiB" as the constraint Next.js bundles hit (pre-September-2026 state). [snippet] — [opennextjs/docs PR #36](https://github.com/opennextjs/docs/pull/36/files)
- Memory: 128 MB per isolate on Free and Paid. Worker startup time limit: 1 second on both plans. CPU time: 10 ms per request Free; Paid default 30 s, configurable to 5 min via `cpu_ms`. Subrequests: 50 per request Free, 10,000 Paid (an older snapshot listed 1,000 for Cache API calls). [snippet] — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/); [fast.io Workers limits summary](https://fast.io/resources/cloudflare-workers-limits/)
- Vercel's own comparison page notes "Workers get a fixed 128 MB of memory per isolate" and that Vercel bills wall-clock duration while Cloudflare bills active CPU time, so cost depends on workload (biased source). [snippet] — [Vercel KB: Next.js on Vercel vs Cloudflare](https://blog.vercel.com/kb/guide/next-js-on-vercel-vs-cloudflare)
- Cloudflare Pages: official migration guide "Migrate from Pages to Workers" exists; static asset requests on Workers are free; Pages Functions are billed at Workers rates. Workers "has a distinctly broader set of features" (Durable Objects, Cron Triggers). A mirror of the guide says Cloudflare "recommends Workers over Pages for new projects, because Workers is where its development focus is going". [snippet] — [Cloudflare: migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)
- Kenton Varda (Cloudflare) reportedly said in a blog comment thread that Cloudflare "is not sunsetting Pages"; Pages features are being folded into Workers and existing Pages projects will eventually be auto-migrated. [snippet, secondhand] — [Bryce Wray: From Pages to Workers (again), Nov 2025](https://brycewray.com/posts/2025/11/pages-workers-again-revisited/)
- Workers Sites (not Pages) is formally deprecated in favour of Workers Static Assets. [snippet] — [Wrangler deprecations](https://developers.cloudflare.com/workers/wrangler/deprecations/)
- Third-party 2026 commentary: Pages is "in maintenance mode" (their words), still supported with bug fixes, new features go to Workers. [snippet] — [mecanik.dev: Pages vs Workers 2026](https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/); [morphllm comparison](https://www.morphllm.com/comparisons/cloudflare-pages-vs-workers)
- Static assets on Workers: "requests to static assets are free and unlimited"; requests to the Worker script (SSR) are billed at Workers rates; no storage charge for assets. [snippet] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)

### Inferences
- For a greenfield Next.js 16 project targeting Cloudflare, use Workers with Static Assets (not Pages) and `@opennextjs/cloudflare`; keep an eye on vinext but do not bet production on it until cache-components support lands and the 1.0 line has a few months of field reports.
- If the September 2026 64 MiB uncompressed limit is confirmed, the historical "Next.js bundle exceeds 3 MB on Free" blocker is gone and the free plan becomes viable for the admin console; the 128 MB memory ceiling and the 10 ms CPU cap on Free remain the real constraints, so SSR workloads still need Workers Paid.
- `use cache` and PPR: supported on paper via OpenNext; the two founders should run the actual app on a preview Worker before relying on them, because the support matrix changed three times in eighteen months.
- Cold starts: Cloudflare's own docs returned by search do not quantify cold starts; I found no measured number. The 1 s startup limit implies Cloudflare expects isolate startup well under that. Treat "0 ms cold start" marketing claims as unverified.

### Gaps
- Could not open opennext.js.org or the Cloudflare guide to read the current support table line by line (image optimisation details, `after()`, `next/og`, Node middleware status, Next.js 16.x minimum version).
- No official Cloudflare changelog text for the 2026-09-04 size-limit change was retrievable; the figure rests on two secondary reports citing it.
- No measured cold-start or p95 latency figures for OpenNext on Workers from Lagos.
- No sourced statement on `@opennextjs/cloudflare` 1.x release notes or its explicit Next.js 16 support line.

---

## Key question 2: Vercel in 2026 (plans, usage meters, regional rates, bills at scale, regions near Lagos)

### Takeaway
Vercel Pro is $20/seat with $20 usage credit per seat; the big meters are Fast Data Transfer ($0.15/GB after 1 TB in US/EU, $0.28/GB in Cape Town), Edge Requests ($2.00/M in iad1, $2.60/M fra1, $2.80/M cpt1 after 10 M), function invocations ($0.60/M after 1 M), Active CPU ($0.128/h US, $0.184/h fra1, $0.200/h cpt1) and Provisioned Memory ($0.0106/GB-h US, $0.0152 fra1, $0.0166 cpt1). Vercel has no PoP in Nigeria; its only African compute region is Cape Town (cpt1, AWS af-south-1). No first-party bill at 1 M or 10 M MAU was found; third-party models put 200k MAU at about $1,340/month and 1.5 M visitors at about $3,100/month, and the one well-documented viral bill (Cara, 2024) was about $96,000 for one week.

### Cited Findings
- Pro: "Each developer seat costs $20 per month and includes $20 of usage credit"; included 1 TB Fast Data Transfer and 10 M Edge Requests "are free and do not consume credit". [snippet, Makerkit says verified May 2026] — [Makerkit: Vercel cost 2026](https://makerkit.dev/blog/md/saas/vercel-cost)
- Fast Data Transfer: 1 TB included on Pro, then $0.15/GB in US regions; Fast Origin Transfer no included tier, $0.06/GB US. Edge Requests: 10 M included, then $2/M (US). Active CPU $0.128/CPU-hour (US). [snippet] — [Makerkit Vercel pricing calculator](https://makerkit.dev/pricing-calculator/vercel); [Flexprice Vercel pricing breakdown](https://flexprice.io/blog/vercel-pricing-breakdown)
- Fluid compute pricing doc (one copy "last updated 2026-06-16"): Active CPU / Provisioned Memory by region: iad1, cle1, pdx1 $0.128/h and $0.0106/GB-h; fra1 $0.184 and $0.0152; cpt1 (Cape Town) $0.200 and $0.0166. Included on Pro: 16 Active CPU hours and 1,440 GB-hours; Hobby 4 h and 360 GB-h. Invocations: first 1 M included, then $0.60 per million on Pro. [snippet] — [Vercel docs: Fluid compute pricing](https://vercel.com/docs/fluid-compute/pricing); [Vercel changelog: Active CPU pricing](https://vercel.com/changelog/lower-pricing-with-active-cpu-pricing-for-fluid-compute)
- Conflict on Provisioned Memory: Vercel's Platforms pricing page says "Starting at $0.0212 per GB-hr", versus $0.0106 on the Fluid doc; the Platforms page is for a different offering. [snippet] — [Vercel Platforms pricing](https://vercel.com/platforms/pricing)
- Regional pricing: Cape Town (cpt1) page lists "$0.28 per 1 GB beyond an included 1 TB" and "$2.80 per 1,000,000 Requests beyond 10,000,000"; "This pricing is available only to Pro plan users". Frankfurt (fra1) page (dated 2026-02-13): Fast Data Transfer 1 TB included then $0.15/GB; Edge Requests 10 M included then $2.60/M. Washington (iad1): $2.00/M Edge Requests. Cross-region ranges: Edge Requests $2.00–$3.20/M, Fast Data Transfer $0.15–$0.47/GB. [snippet] — [Vercel cpt1 pricing](https://vercel.com/docs/pricing/regional-pricing/cpt1); [Vercel fra1 pricing](https://vercel.com/docs/pricing/regional-pricing/fra1); [Vercel iad1 pricing](https://www.vercel.com/docs/pricing/regional-pricing/iad1); [Vercel regional pricing overview](https://vercel.com/docs/pricing/regional-pricing)
- Image Optimization: transformations $0.05–$0.0812 per 1K, cache reads $0.40–$0.64 per 1M, cache writes $4.00–$6.40 per 1M; Hobby includes 5K transformations, 300K reads, 100K writes/month; billed on cache MISS and STALE; delivery also incurs Fast Data Transfer and Edge Requests; regional pricing is opt-in for existing customers. [snippet] — [Vercel: Image Optimization limits and pricing](https://examples.vercel.com/docs/image-optimization/limits-and-pricing); [Vercel changelog: reduced image optimization pricing](https://vercel.com/changelog/faster-transformations-and-reduced-pricing-for-image-optimization)
- ISR: Pro column shows 10 M ISR Reads and 2 M ISR Writes included, "then starting at $0.40 per 1M" reads and "$4 per 1M" writes; Hobby 1 M / 200K. LHR1 regional page: $0.48 per 1M read units, $4.80 per 1M write units. Platforms page lists only the 1 M / 200K allowances, so the Pro allowance is not fully consistent across Vercel pages. [snippet] — [Vercel pricing (examples mirror)](https://examples.vercel.com/docs/pricing); [Vercel lhr1 pricing](https://vercel.com/docs/pricing/regional-pricing/lhr1)
- Edge Middleware invocations: 1 M included on Pro, then $0.65 per 1M. Edge Config reads $3.00/M after 1 M, writes $5.00 per 1,000 after 500. [snippet] — [Vercel pricing (examples mirror)](https://examples.vercel.com/docs/pricing)
- Spend Management (Pro, owner/billing roles): notify at 50/75/100% (web, email, optional SMS at 100%), webhook, pause production deployments; checks "are not continuous" so actions can fire "several minutes after you cross your spend amount"; paused visitors see "503 DEPLOYMENT_PAUSED"; projects must be resumed manually. Changelog: "Spend Management now pauses production deployments by default"; docs versions disagree on the default. [snippet] — [Vercel docs: Spend Management](https://vercel.com/docs/spend-management); [Vercel changelog](https://vercel.com/changelog/spend-management-now-pauses-production-deployments-by-default)
- Vercel WAF: features available on all plans (DDoS mitigation, IP blocking, custom rules) are free, but "when a custom rule is active, you incur usage for every challenged or denied request"; Enterprise metered: rate limiting $0.50 per 1M allowed requests, OWASP CRS managed rules $0.80 per 1M inspected requests plus $0.20/GB inspected payload (page dated 2025-03-04). Bot Management pricing not published. [snippet] — [Vercel WAF usage and pricing](https://vercel.com/docs/vercel-waf/usage-and-pricing)
- DDoS mitigation page (updated 2026-01-05): "automatic mitigation for all deployments, regardless of your plan" (L3/L4/L7); "Vercel does not charge customers for traffic that gets blocked with DDoS mitigation"; requests served before mitigation and non-DDoS bot traffic are billed. Older pages say Attack Challenge Mode usage fees, including illegitimate traffic, are the customer's responsibility. [snippet] — [Vercel: DDoS mitigation](https://vercel.com/docs/vercel-firewall/ddos-mitigation)
- Enterprise: listed as "Custom" with Managed WAF Rulesets; one third-party site says contracts "often requiring annual contracts starting at $20,000-25,000" (unverified). [snippet] — [Vercel pricing](https://vercel.com/pricing); [Temperstack Vercel plans](https://www.temperstack.com/plans/vercel/)
- Regions: cpt1 = AWS af-south-1 Cape Town, the only African compute region in Vercel's tables; Edge Network "119 Points of Presence in 94 cities across 51 countries" (newer copy: 126 PoPs, 19–20 compute regions); traffic goes PoP -> nearest compute region over private links. No Lagos or Johannesburg PoP appears in indexed docs; Netify sees Vercel with "1 IP in Cape Town" in South Africa. [snippet] — [Vercel Edge Network regions](https://vercel.com/docs/edge-network/regions); [Netify: Vercel in South Africa](https://www.netify.ai/resources/hosting/vercel/country/za)
- Scale anecdotes: Makerkit says Vercel "gets expensive at roughly 100,000 monthly active users or eight engineers"; its example "6-person SaaS, 200,000 MAU, 4 TB bandwidth, ISR-heavy" is about $1,340/month; a 1.5 M-visitor workload about $3,096/month, "at this scale, Enterprise pricing or a CDN offload usually beats the published rates". [snippet, vendor] — [Makerkit: Vercel cost 2026](https://makerkit.dev/blog/saas/vercel-cost); [Waymaker OS: Vercel real cost at scale](https://www.waymakeros.com/learn/vercel-pricing-2026-real-cost-at-scale)
- Techconcepts (May 2026) models a 5 TB-bandwidth, 5 M-invocation site at roughly EUR 1,620/month on Vercel Pro and says Cloudflare saves 70–95% once bandwidth passes about 1 TB. [snippet] — [Techconcepts: Vercel vs Cloudflare Pages](https://techconcepts.org/blog/vercel-vs-cloudflare-pages)
- Bill-shock cases: Cara (2024) about $96,000 for one week of viral traffic, excluding egress and storage; a $23,000 DDoS-driven bill "billed at the normal bandwidth rate" (2026 write-up); Build Minutes billing enabled by default caused unexpected charges (Vercel community); Vercel has waived some bills. [snippet] — [CostGoat: Cara $96k](https://costgoat.com/bill-shock/stories/vercel-cara-96k-week-bandwidth); [Usagebox: $23,000 Vercel bill](https://usagebox.com/articles/vercel-23000-dollar-bill-usage-based-platform-bill-shock-2026); [Vercel community: build minutes](https://community.vercel.com/t/vercel-build-minutes-billing-enabled-by-default-causing-unexpected-charges/37434); [Upstash: Vercel cost](https://upstash.com/blog/vercel-cost)
- Codegiant cites a developer billed over $2,000/month after usage spikes on a simple app (anecdote). [snippet] — [Codegiant: Cloudflare vs Vercel](https://blog.codegiant.io/p/cloudflare-vs-vercel)

### Inferences
- For Nigerian users on Vercel, the realistic choice is compute in fra1/lhr1/cdg1 (Lagos-Europe submarine paths) or cpt1; cpt1 is priced about 40% higher than US on CPU and nearly double on bandwidth, and Lagos-Cape Town latency is often not better than Lagos-London, so Europe is the sensible default. This is my inference; no latency measurement was found.
- Because Vercel has no Nigerian PoP, every request from Lagos crosses an undersea cable before hitting Vercel's edge; placing Cloudflare (which has a Lagos PoP) in front for DNS, TLS termination and static caching helps TTFB on cached assets but does not help SSR/API round trips.
- Vercel's meters that matter for this product are Edge Requests and Fast Data Transfer; both scale linearly with page views and have no volume tiering below Enterprise.

### Gaps
- No first-party or verifiable third-party Vercel bill for a consumer app at 1 M or 10 M MAU; only models and one viral-week anecdote.
- Could not confirm Pro's included ISR allowances (10 M/2 M vs 1 M/200K) or Fast Origin Transfer rates per region.
- Vercel's guidance on putting a third-party CDN/proxy (Cloudflare) in front of Vercel and its effect on Edge Request/Fast Origin Transfer billing was not retrieved; treat the "Cloudflare caches static assets in front of Vercel" variant in the cost model as unvalidated.
- No public Enterprise unit pricing.

---

## Key question 3: Cloudflare Workers in 2026 (plans, meters, storage, placement, African PoPs, observability, limits)

### Takeaway
Workers Free: 100,000 requests/day, 10 ms CPU. Workers Paid: $5/month with 10 M requests and 30 M CPU-ms included, then $0.30/M requests and $0.02/M CPU-ms; static asset requests free and unlimited; no egress charge; subrequests not billed. KV $0.50/M reads, $5/M writes, $0.50/GB-month; Durable Objects $0.15/M requests plus $12.50/M GB-s. Workers Logs 20 M events included then $0.60/M (7-day retention). Cloudflare has served Lagos locally since October 2018 (MDXI Lekki, IXPN and WAF-IX peering) alongside Johannesburg (2014) and Cape Town (2017). Limits that bite: 128 MB memory, 50 subrequests on Free (10,000 Paid), 10 ms CPU on Free.

### Cited Findings
- Workers Paid (Standard): "10 million included requests per month, then $0.30 per additional million"; "30 million CPU milliseconds per month, then $0.02 per additional million CPU milliseconds"; "Max of 5 minutes of CPU time per invocation (default: 30 seconds)"; "Cloudflare does not bill for subrequests you make from your Worker". Base $5/month. Docs example: 15 M requests costs $8.00/month; a project with 80% static requests costs $5.00. [snippet] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- Free plan: 100,000 requests per day, 10 ms CPU per invocation, no duration charge. Cron Trigger and Queue consumer invocations can run up to 15 minutes CPU. [snippet] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/about/pricing)
- A Blazing CDN post says overage is $0.50/M, conflicting with the official $0.30/M. [snippet] — [BlazingCDN Cloudflare pricing guide](https://blog.blazingcdn.com/en-us/cloudflares-pricing-plans-a-comprehensive-guide)
- Static assets: "requests to static assets are free and unlimited" on free and paid; no storage charge. [snippet] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/index.md)
- Workers KV: $0.50/GB-month stored, $0.50 per million reads, $5.00 per million writes/deletes/lists; free tier 1 GB, 100,000 reads/day, 1,000 writes/day. Durable Objects: $0.15 per million requests, $12.50 per million GB-seconds duration, plus SQL rows read/written and storage; included in Workers Paid ($5 minimum). [snippet] — [Cloudflare rates page](https://www.cloudflare.com/en-in/rates/); [Cloudflare pricing summary](https://cloudflare.com/pricing/.md)
- Workers Logs: Paid "20 million included per month, +$0.60 per additional million", 7-day retention; Free 200,000/day, 3-day retention. [snippet] — [Cloudflare Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/); [Cloudflare rates](https://www.cloudflare.com/en-in/rates/)
- Workers for Platforms: $25/month, 20 M requests and 60 M CPU-ms included, then $0.30/M and $0.02/M; 1,000 scripts included then $0.02 per script; one request billed across dispatch -> user -> outbound chain. [snippet] — [Workers for Platforms pricing](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/)
- Smart Placement: per-Worker opt-in; "analyzes the request duration of the Worker in different Cloudflare locations on a regular basis" and forwards to a location near back-end services when significantly faster; only considers locations where the Worker has already run; since the 2025-03-22 change a placed Worker no longer reverts on brief traffic dips. [snippet] — [Cloudflare: Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement/); [Changelog 2025-03-22](https://developers.cloudflare.com/changelog/2025-03-22-smart-placement-stablization)
- Lagos PoP: Cloudflare blog dated 2018-10-30, "Lagos, Nigeria - Cloudflare's 155th city", colocated with an undersea cable operator, connected to IXPN and WAF-IX; "Instead of serving Nigeria from Europe (London, Lisbon, etc), content can be delivered locally from Lagos". Tech.Africa names the MDXI data centre in Lekki. Johannesburg (Dec 2014) and Cape Town (2017) preceded it. A third-party aggregator lists Cloudflare with 1 data centre in Nigeria of 312 worldwide. No 2025–2026 announcement of a new Nigerian site found. [snippet] — [Cloudflare blog: Lagos](https://blog.cloudflare.com/lagos); [Tech.Africa](https://tech.africa/cloudflare-lagos-nigeria); [BTW Media: Cloudflare in Africa](https://btw.media/en/cloudflare-enhancing-internet-infrastructure-in-africa); [GetDeploying: data centres in Nigeria](https://getdeploying.com/datacenters-in-nigeria)
- Limits: 128 MB memory both plans; CPU 10 ms Free / 30 s default Paid (to 5 min); subrequests 50 Free / 10,000 Paid; Worker startup 1 s; size 3 MB/10 MB (older) vs 64 MiB uncompressed (Sept 2026 reports, see Q1). [snippet] — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/); [Classmethod 64 MiB](https://dev.classmethod.jp/en/articles/cloudflare-workers-64mib-size-limit/)
- Cloudflare zone plans (third-party, conflicting): Pro $20/month and Business $200/month on annual billing versus $25 and $250 monthly; Enterprise custom (one source: about $5,000/month floor). Custom WAF rule counts quoted as 5 or 20 on Pro and 100 or "more" on Business; Free "cannot write custom rules" (also contradicted elsewhere; verify). [snippet] — [EastonDev: Cloudflare pricing 2026](https://eastondev.com/blog/en/posts/dev/20251201-cloudflare-pricing-compare/); [CDNsun: Cloudflare pricing 2026](https://blog.cdnsun.com/cloudflare-pricing/); [EastonDev: Pro vs Business upgrade](https://eastondev.com/blog/en/posts/dev/20260528-cloudflare-pro-business-upgrade/)
- Turnstile: Free plan $0 with "unlimited challenges and verification requests", up to 20 widgets, 10 hostnames per widget, 7-day analytics; Enterprise contact sales. [snippet] — [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)
- Bot defence across Free/Pro/Business combines Cloudflare Bots, WAF custom rules, rate limiting and Turnstile; advanced Bot Management is Enterprise (sources conflict on Business). [snippet] — [Cloudflare: stop malicious bots](https://developers.cloudflare.com/use-cases/application-security/bots/stop-malicious-bots/)
- Cloudflare Images (needed for OpenNext image optimisation): 5,000 unique transformations/month free, then $0.50 per 1,000 unique transformations; a unique transformation is one original plus one parameter set (AVIF/WebP variants count once); over the free cap new transformations return error 9422 rather than a charge. [snippet] — [Cloudflare Images pricing](https://developers.cloudflare.com/images/pricing)

### Inferences
- Cloudflare's meters are request-count and CPU-time based with no bandwidth meter, so the cost curve for a page-view-heavy PWA is roughly 15–25x flatter than Vercel's at the same traffic (see cost model).
- Workers Logs can become the largest Cloudflare line item at 10 M+ users if every request emits several events; use head-based sampling or ship to Logpush/R2.
- The Lagos PoP means both static assets and Workers execute in-country for Nigerian users; Supabase (the database) will still sit in a remote region, so Smart Placement near the database is worth enabling for the API Worker.

### Gaps
- Could not retrieve Cloudflare's official plan page to settle Pro/Business price ($20/$200 vs $25/$250) or the exact custom-rule and rate-limiting-rule allowances per plan.
- No Cloudflare-published measurement of Lagos cold-start or latency; no confirmation of whether Workers run in every Lagos cage or only in larger metros.
- Smart Placement's interaction with the OpenNext Worker (assets following back-end location) is only described for Pages Functions in the retrieved snippet.

---

## Key question 4: Hosting the Hono API (Workers vs Node on Fly.io/Railway; Node-only libraries; Browser Rendering; Queues and Cron)

### Takeaway
Hono runs natively on Workers (default export, no adapter) and on Node via `@hono/node-server`, so the same handlers can move either way. On Workers, `nodejs_compat` gives Buffer, streams, crypto and (from compatibility date 2025-09-01) a virtual `node:fs`, but `child_process` is a non-functional stub and real Playwright/Chromium cannot run; PDF rendering therefore means Cloudflare Browser Rendering (`@cloudflare/puppeteer` or the `@cloudflare/playwright` fork) at $0.09 per browser-hour beyond 10 included hours and $2 per extra concurrent browser beyond 10 on Workers Paid. Queues cost $0.40 per million operations (about 3 ops per message) with 1 M included; Cron Triggers are billed as ordinary Worker invocations. No source confirmed the `docx` package's behaviour on Workers.

### Cited Findings
- `@hono/node-server`: runs Hono on Node's built-in HTTP server via `serve({ fetch: app.fetch, port })`; Node 18.14.1+/19.7+/20+; README notes Hono's overhead is higher on Node than on edge runtimes. On Workers the default-export pattern needs no adapter; scaffold `npm create hono@latest -- --template cloudflare-workers`, deploy with `wrangler deploy`; bindings (KV, D1, R2) via context env. [snippet] — [@hono/node-server README mirror](https://github.com/miyamonz/node-server); [Pandastack: deploy Hono to production](https://pandastack.io/blog/deploy-hono-api-to-production)
- Edge runtimes are a poor fit for long-lived TCP database connections; guides recommend Node for container/VM deployments with a database. [snippet] — [Pandastack](https://pandastack.io/blog/deploy-hono-api-to-production)
- Supabase from Workers: "Hyperdrive is a connection pooler — connecting pooler-to-pooler causes errors"; the database client "cannot be initialized at module top level". [snippet, third-party skill guide] — [Codaone: Vercel to Cloudflare](https://www.codaone.ai/skills/vercel-to-cloudflare/)
- Node compatibility: with `nodejs_compat`, Buffer, Node streams ("a full implementation of Node.js streams is available"), partial crypto, DNS; `node:child_process` "is a non-functional stub. You cannot spawn child processes or execute shell commands"; `node:fs` available by default with compatibility date >= 2025-09-01 as a virtual filesystem for bundled files and `/tmp`; some modules are "non-functional stubs" that import but do not work. [snippet] — [Cloudflare: Node.js compatibility](https://developers.cloudflare.com/workers/platform/nodejs-compatibility/); [Cloudflare blog: a year of Node.js compatibility (2025)](https://blog.cloudflare.com/nodejs-workers-2025/); [workerd Node differences](https://www.mintlify.com/cloudflare/workerd/nodejs/differences); [Cloudflare: node:fs](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/)
- Playwright: Cloudflare maintains `@cloudflare/playwright`, "a version of Playwright that was modified to be compatible with Cloudflare Workers and Browser Rendering", paired with `nodejs_compat_v2` and a browser binding; README lists features "not fully supported". Stock `playwright` needs a local browser and filesystem, which Workers lack. [snippet] — [cloudflare/playwright](https://github.com/cloudflare/playwright); [Cloudflare Browser Rendering: Playwright](https://developers.cloudflare.com/browser-rendering/platform/playwright)
- Browser Rendering pricing (changelog 2025-07-28): Workers Paid includes 10 browser-hours/month and 10 concurrent browsers; overage $0.09 per browser-hour and $2.00 per additional concurrent browser (concurrency = daily peak averaged over the month); Free 10 minutes/day and 3 concurrent browsers; hours shared across REST API and bindings. Worked example: 50 REST hours = $3.60; with a concurrency overage total $13.60. A third-party calculator lists $2.00 per browser-hour and 2 free browsers, conflicting with the official page. [snippet] — [Cloudflare Browser Rendering pricing](https://developers.cloudflare.com/browser-rendering/pricing/); [Changelog 2025-07-28](https://developers.cloudflare.com/changelog/2025-07-28-br-pricing/); [flarecalc browser rendering](https://flarecalc.com/calculators/browser-rendering)
- Queues: Standard operations $0.40 per million; Paid includes 1,000,000 operations/month; Free 10,000 operations/day; "each delivered message usually costs 3 operations: 1 write, 1 read, and 1 delete". [snippet] — [Cloudflare Queues pricing](https://developers.cloudflare.com/queues/pricing/); [Cloudflare rates](https://www.cloudflare.com/en-in/rates/)
- Cron Triggers: "Cron Trigger and Queue Consumer invocations can run for up to 15 minutes of CPU time each"; no separate price line found, they are billed as Worker requests/CPU. [snippet] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/about/pricing)
- `docx` on Workers: no source found. General evidence: "Uncaught ReferenceError: Buffer is not defined" is the classic Workers failure for Node-oriented packages; enabling `nodejs_compat` adds Buffer. [snippet] — [Remix issue #2813](https://github.com/remix-run/remix/issues/2813); [Cloudflare blog: Node.js streams on Workers](https://blog.cloudflare.com/workers-node-js-apis-stream-path)

### Inferences
- The `docx` package is pure JavaScript built on JSZip; with `nodejs_compat` (Buffer, streams) it should bundle, and using `Packer.toBlob`/`toArrayBuffer` instead of `toBuffer` avoids Buffer altogether. This is my inference, not a sourced finding: test it in `wrangler dev` before committing.
- The Anthropic SDK's streaming uses `fetch` and Web Streams, which Workers support natively; it should work with `nodejs_compat`. Also inference; the research brief asserts it is fine and I found nothing contradicting it, but nothing confirming it either.
- PDF export on Workers is a product decision, not just a port: Browser Rendering concurrency (10 included) caps simultaneous CV renders; at 10 M users with bursts (e.g. right after the digest email lands) the $2/concurrent-browser overage or a queue in front becomes necessary. Alternative: generate PDFs on a small Node service (Fly.io/Railway) with Playwright, or in the browser with a client-side renderer, and keep the API on Workers.
- Queues ($0.40/M ops) versus pg_cron/pgmq: for this product's job volume (digest assembly, scam triage, embeddings) the Queues bill is in single-digit dollars at every tier; the choice should turn on where the data lives (Supabase) and observability, not price.

### Gaps
- No Fly.io or Railway pricing was researched (out of scope of the search budget); the "Node fallback" cost is therefore not quantified here.
- No sourced confirmation of `docx` or `@anthropic-ai/sdk` on Workers.
- Cloudflare Hyperdrive pricing and its interaction with Supabase's Supavisor pooler were not retrieved beyond the one third-party warning.
- Browser Rendering session duration limits and PDF-specific limits not retrieved.

---

## Key question 5: Cost model at 1k, 100k, 1M, 10M and 50M registered users

### Takeaway
Under the stated assumptions (30% MAU, 20 page views per active user per week, 8 edge requests, 3 dynamic requests and 150 KB per page view, API hosted alongside the frontend), Vercel Pro list pricing in fra1 lands at roughly $40 / $85 / $1,200 / $13,300 / $67,000 per month at 1k / 100k / 1M / 10M / 50M users, driven almost entirely by Edge Requests and Fast Data Transfer; putting Cloudflare in front to absorb static assets roughly halves that from 1 M users up (about $470 / $6,000 / $30,600 at 1M / 10M / 50M). The all-Cloudflare stack lands at roughly $5–30 / $30 / $90–120 / $650–900 / $3,200–4,500. Vercel Enterprise is custom and unpublished; only an assumed-discount range can be given.

### Cited Findings
(Unit prices used below are those cited in Q2 and Q3; repeated here with sources so the model is self-contained.)
- Vercel Pro: $20/seat with $20 credit; 1 TB Fast Data Transfer and 10 M Edge Requests included; fra1 overage $0.15/GB and $2.60/M; cpt1 $0.28/GB and $2.80/M; iad1 $2.00/M. [snippet] — [Vercel fra1](https://vercel.com/docs/pricing/regional-pricing/fra1); [Vercel cpt1](https://vercel.com/docs/pricing/regional-pricing/cpt1); [Makerkit](https://makerkit.dev/blog/md/saas/vercel-cost)
- Vercel Fluid: 1 M invocations included then $0.60/M; 16 Active CPU hours and 1,440 GB-h included; fra1 $0.184/CPU-h and $0.0152/GB-h; cpt1 $0.200 and $0.0166; US $0.128 and $0.0106. [snippet] — [Vercel Fluid compute pricing](https://vercel.com/docs/fluid-compute/pricing)
- Cloudflare Workers Paid $5: 10 M requests and 30 M CPU-ms included; $0.30/M requests; $0.02/M CPU-ms; static assets free; no egress. KV $0.50/M reads, $5/M writes. Workers Logs 20 M events then $0.60/M. Browser Rendering $0.09/browser-hour beyond 10 h. Cloudflare Images $0.50 per 1,000 unique transformations beyond 5,000. [snippet] — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/); [Cloudflare rates](https://www.cloudflare.com/en-in/rates/); [Browser Rendering pricing](https://developers.cloudflare.com/browser-rendering/pricing/); [Cloudflare Images pricing](https://developers.cloudflare.com/images/pricing)
- Independent model for reference: Makerkit's preset small-SaaS workload costs about $60/month on Vercel Pro versus $5.04 on Workers Paid ("cheaper by $54.96/mo (92%)"), excluding ISR, image optimisation, Edge Config and WAF which "can add 10–30% on image or ISR-heavy apps". [snippet, vendor] — [Makerkit Vercel vs Cloudflare calculator](https://makerkit.dev/pricing-calculator/vercel-vs-cloudflare)
- Third-party models: 200k MAU SaaS about $1,340/month on Vercel; 1.5 M visitors about $3,096/month; 5 TB / 5 M invocations about EUR 1,620/month. [snippet] — [Makerkit](https://makerkit.dev/blog/saas/vercel-cost); [Techconcepts](https://techconcepts.org/blog/vercel-vs-cloudflare-pages)

### Inferences (the model; every number here is derived, not cited)

**Assumptions (A1–A12).**
- A1 Registered users U at each tier: 1,000; 100,000; 1,000,000; 10,000,000; 50,000,000.
- A2 Monthly active share 30% (brief). MAU = 0.3 U.
- A3 20 page views per active user per week (brief) = 86.7 page views per MAU per month (4.33 weeks).
- A4 Per page view: 1 dynamic document/RSC request to Next.js, 2 API calls to Hono, 5 static asset requests (JS chunks, CSS, icons, fonts; the PWA service worker caches most assets after first visit, so 5 is already a discount from a cold load). Total 8 edge requests, 3 function invocations per page view.
- A5 Data transferred per page view 150 KB on average (about 30 KB document, 20 KB API JSON, 100 KB amortised assets and images). Nigerian mobile-first design should keep this low; CV PDFs excluded.
- A6 Compute per dynamic request: 40 ms active CPU and 200 ms wall time on Vercel; on Cloudflare 30 ms CPU for SSR and 10 ms per API call (50 CPU-ms per page view). Vercel Fluid effective concurrency 10 per 2 GB instance for the memory meter.
- A7 Two founders = 2 Vercel seats ($40, with $40 credit that offsets metered usage other than the free included allotments).
- A8 Vercel compute region fra1 (Frankfurt) for the base case; cpt1 variant noted. Vercel API hosted as Vercel functions (Hono runs on Vercel's Node runtime) so the comparison is like-for-like; a Fly.io/Railway API would replace the invocation/CPU lines with a fixed VM cost not quantified here.
- A9 Cloudflare: one Workers Paid subscription covers all three Workers (PWA, admin, API). Next.js cache (ISR) in KV at 1 read per page view. Zone plan Free at 1k–100k, Pro ($20–25) from 1 M for custom WAF rules.
- A10 Workers Logs sampled at 10% of requests (1 event per sampled request). Without sampling multiply the logs line by 10.
- A11 Image optimisation, ISR reads/writes, Edge Middleware, build minutes, monitoring and log drains on Vercel are excluded (Makerkit's "10–30%" uplift applies for image/ISR-heavy apps; this app is text-heavy).
- A12 Digest emails are handled elsewhere (brief) and excluded; database (Supabase) excluded.

**Derived monthly volumes.**

| Tier (registered) | MAU | Page views | Edge requests (8/PV) | Dynamic invocations (3/PV) | Data (150 KB/PV) |
|---|---|---|---|---|---|
| 1,000 | 300 | 26,000 | 208k | 78k | 3.9 GB |
| 100,000 | 30,000 | 2.6 M | 20.8 M | 7.8 M | 390 GB |
| 1,000,000 | 300,000 | 26 M | 208 M | 78 M | 3.9 TB |
| 10,000,000 | 3 M | 260 M | 2.08 B | 780 M | 39 TB |
| 50,000,000 | 15 M | 1.3 B | 10.4 B | 3.9 B | 195 TB |

**Scenario A: Vercel Pro, fra1, everything served by Vercel (Cloudflare only for DNS, proxy off).**

| Tier | Seats | Edge Requests ($2.60/M after 10 M) | Fast Data Transfer ($0.15/GB after 1 TB) | Invocations ($0.60/M after 1 M) | Active CPU ($0.184/h after 16 h) | Memory ($0.0152/GB-h after 1,440) | Total (before $40 credit) |
|---|---|---|---|---|---|---|---|
| 1k | $40 | $0 | $0 | $0 | $0 | $0 | about $40 |
| 100k | $40 | $28 | $0 | $4 | $13 | $0 | about $85 (about $45 after credit) |
| 1M | $40 | $515 | $435 | $46 | $157 | $0 | about $1,190 |
| 10M | $40 | $5,380 | $5,700 | $467 | $1,590 | $110 | about $13,300 |
| 50M | $40 | $27,000 | $29,100 | $2,340 | $7,970 | $640 | about $67,100 |

cpt1 variant (Cape Town): Edge Requests $2.80/M and $0.28/GB roughly add 8% to requests and 87% to bandwidth: about $1,560 at 1M, $18,700 at 10M, $95,000 at 50M.

**Scenario B: Vercel Pro behind Cloudflare proxy caching static assets (unvalidated against Vercel's proxy guidance, see Gaps).** Assume Cloudflare serves the 5 asset requests and 100 KB of the 150 KB per page view, so Vercel sees 3 edge requests and 50 KB per page view; compute unchanged.

| Tier | Vercel total |
|---|---|
| 1k | about $40 |
| 100k | about $60 |
| 1M | about $470 (ER 78 M -> $177; data 1.3 TB -> $45; compute $203; seats $40) |
| 10M | about $6,000 (ER 780 M -> $2,000; data 13 TB -> $1,800; compute $2,170; seats $40) |
| 50M | about $30,600 (ER 3.9 B -> $10,100; data 65 TB -> $9,600; compute $10,950; seats $40) |

Cloudflare zone cost in this scenario: Free at small tiers, Pro $20–25 from 1 M.

**Scenario C: Vercel Enterprise.** No published unit prices. Third-party floor estimate $20,000–25,000 per year [snippet, Temperstack]. If the founders negotiate 40–60% off Pro list on bandwidth and requests (a common pattern reported anecdotally but unsourced here), Scenario A becomes very roughly $5,000–8,000 at 10 M and $27,000–40,000 at 50 M, plus the platform fee. Treat as a placeholder for a sales conversation, not a figure.

**Scenario D: all-Cloudflare (Workers Paid for PWA, admin and API; Static Assets; KV cache; Browser Rendering for PDFs; Queues; Turnstile free).**

| Tier | Workers Paid base | Requests to Workers (3/PV; $0.30/M after 10 M) | CPU (50 ms/PV; $0.02/M ms after 30 M) | KV reads (1/PV; $0.50/M) | Workers Logs (10% sampled; $0.60/M after 20 M) | Zone plan | Browser Rendering (5% of MAU x 2 PDFs x 3 s) | Total |
|---|---|---|---|---|---|---|---|---|
| 1k | $5 | $0 | $0 | $0 | $0 | Free | $0 | about $5 |
| 100k | $5 | $0 (7.8 M) | $2 | $1 | $0 | Free (or Pro $20–25) | $0 | about $8–33 |
| 1M | $5 | $20 | $25 | $13 | $0 (7.8 M events) | Pro $20–25 | $1 | about $85–90 |
| 10M | $5 | $231 | $260 | $130 | $35 | Pro $20–25 | $12 (plus concurrency overage risk) | about $700 (unsampled logs: about $2,100) |
| 50M | $5 | $1,170 | $1,300 | $650 | $220 | Business $200–250 | $60 (plus concurrency) | about $3,600–3,700 (unsampled logs: about $10,600) |

Browser Rendering concurrency: at 10 M users the assumed 300k PDFs/month is about 0.1 per second on average; bursts after a digest send could exceed 10 concurrent browsers, at $2 per extra browser averaged over daily peaks; a queue in front keeps this bounded.

**Headline ratio.** At 1 M users Vercel Pro list is roughly 13x all-Cloudflare (Scenario A) or 5x (Scenario B); at 10 M it is roughly 19x or 9x; at 50 M roughly 18x or 8x. The ratio is driven by Vercel's per-request and per-GB meters, which Cloudflare does not charge for static traffic and never charges for egress.

**Sensitivity.** Doubling page weight (300 KB/PV) adds about $5,700 at 10 M on Vercel A and $0 on Cloudflare. Doubling dynamic requests per page adds about $2,100 on Vercel A and about $500 on Cloudflare at 10 M. Removing the 10% log sampling is the single biggest Cloudflare swing (about +$1,400 at 10 M).

### Gaps
- Vercel's rules on third-party proxies in front of Vercel (and whether Fast Origin Transfer or Edge Requests still accrue) were not retrievable; Scenario B is therefore an assumption.
- Image Optimization, ISR, Edge Middleware and build-minute costs on Vercel are excluded; for an app with a job-listing feed rendered via ISR they could add several hundred dollars at 10 M (Makerkit's 10–30% rule of thumb).
- No Fly.io/Railway cost for a Node API fallback.
- No Enterprise unit pricing; Scenario C is a placeholder.
- Fluid compute's memory meter depends on instance lifetime and concurrency that I estimated (A6); real bills could differ by a factor of 2–3 on that line (it is a minor line at every tier).

---

## Key question 6: Operational considerations (previews, rollbacks, CI, multi-region, DDoS/WAF/bots, rate limiting, lock-in, what African and Indian consumer apps run on)

### Takeaway
Both platforms give git-based preview deployments and instant rollbacks; Vercel's are turnkey for Next.js, Cloudflare's come via Wrangler/Workers Builds and GitHub Actions. DDoS mitigation is free on both (Vercel does not bill blocked traffic; Cloudflare's network is the industry default), but WAF custom rules on Vercel are metered per challenged/denied request while Cloudflare bundles them in Pro/Business zone plans; Turnstile is free and unlimited. Lock-in is symmetric but different in kind: Vercel locks the Next.js runtime features (ISR/`use cache` semantics, Image Optimization, Fluid) while Cloudflare locks storage bindings (KV, DO, R2, Queues) and the Workers runtime. Large African and Indian consumer apps I could source (Paystack, Jumia, Meesho) run on AWS or GCP with Kubernetes, not on Vercel or Cloudflare Workers; none published a Vercel or Workers case study.

### Cited Findings
- Vercel Spend Management pauses production at the cap (503), notifications at 50/75/100%; checks are not continuous. [snippet] — [Vercel docs: Spend Management](https://vercel.com/docs/spend-management)
- Vercel DDoS: automatic on all plans; blocked traffic not billed; Attack Challenge Mode usage billed to customer per older docs. WAF custom rules bill "for every challenged or denied request"; OWASP managed rules and rate limiting are Enterprise, $0.80/M inspected and $0.50/M allowed. [snippet] — [Vercel DDoS mitigation](https://vercel.com/docs/vercel-firewall/ddos-mitigation); [Vercel WAF pricing](https://vercel.com/docs/vercel-waf/usage-and-pricing)
- Cloudflare: Turnstile Free is $0 with unlimited challenges (20 widgets). Rate limiting rules "define rate limits for requests matching an expression and the action to perform"; recommended alongside Turnstile. Legacy rate limiting was billed at $0.05 per 10,000 good requests; newer WAF rate-limiting rules are plan-bundled (counts unverified). [snippet] — [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/); [Cloudflare: stop malicious bots](https://developers.cloudflare.com/use-cases/application-security/bots/stop-malicious-bots/); [CDNsun Cloudflare pricing](https://blog.cdnsun.com/cloudflare-pricing/)
- Cloudflare Workers CI: freeCodeCamp tutorial deploys a full-stack Next.js app to Workers with GitHub Actions CI/CD. Cloudflare's "Vercel to Workers" migration guide notes "Vercel specific features are not supported by Cloudflare Workers". [snippet] — [freeCodeCamp: Next.js on Workers with GitHub Actions](https://www.freecodecamp.org/news/how-to-deploy-a-full-stack-next-js-app-on-cloudflare-workers-with-github-actions-ci-cd/); [Cloudflare: migrate from Vercel](https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/index.md)
- Migration experience: one developer moving a full Next.js app from Vercel to Cloudflare found it "more powerful and more stable than I expected", with costs "far lower", but "the move wasn't painless"; complaints about Vercel were cold starts, build times and pricing growth. Another noted multi-service, edge-heavy apps "would need more rework". [snippet] — [dev.to: Next.js on Cloudflare vs Vercel](https://dev.to/dev_tips/nextjs-on-cloudflare-vs-vercel-why-pretty-deploys-dont-scale-2m9a); [dev.to: ditching Vercel for Cloudflare Pages](https://dev.to/jenc/block-ai-crawlers-save-tears-ditching-vercel-for-cloudflare-pages-2846)
- Startup programs compared (Better Stack): the question is "whether Vercel's polish is valuable enough to justify the smaller credit and higher long-term cost". [snippet] — [Better Stack: Cloudflare vs Vercel for startups](https://betterstack.com/community/comparisons/cloudflare-vs-vercel-startups.md)
- Paystack (Nigeria): job postings list TypeScript/Node.js (Express, Sails, Nest), React/Angular/Vue, Redis, MySQL, MongoDB, Docker, Kubernetes and AWS; an SRE "manages Paystack's AWS cloud infrastructure". [snippet] — [Paystack engineering](https://paystack.com/engineering); [Paystack job posting](https://job-boards.greenhouse.io/paystack/jobs/8222225002)
- Jumia: Cairo tech-centre posting describes Kubernetes infrastructure with Terraform, Ansible, Helm, GitHub Actions and ArgoCD; a dated StackShare profile lists AWS EC2/S3/RDS/CloudWatch and BigQuery. [snippet] — [Jumia job posting](https://job-boards.eu.greenhouse.io/jumia/jobs/4569892101); [StackShare profile](https://stackshare.io/echav/stacks)
- Meesho (India): "peak production load ... 14 M RPS, powered by over 1000+ microservices spawning over 450K cores"; all services containerised on multiple Kubernetes clusters; stack Java/Go, Kafka, Redis, ScyllaDB, MySQL on GCP; Google Cloud case study cites GKE and Cloud CDN for tier-3 city performance. [snippet] — [Google Cloud: Meesho case study](https://cloud.google.com/customers/meesho); [Meesho job posting](https://jobs.lever.co/meesho/fcebd937-47fd-4efe-b1de-1ad8ba571e32)
- Flutterwave, Kuda, Apna: no infrastructure write-ups found in search results. [snippet] — [Guardian NG feature on African fintech architecture (narrative, non-technical)](https://guardian.ng/features/rewiring-payments-how-engineers-architecture-began-transforming-african-fintech/)
- Cloudflare's own position on Vercel features: Vercel KB says the OpenNext adapter runs Next.js in Node mode and highlights the 128 MB memory cap and CPU-vs-wall-clock billing difference. [snippet] — [Vercel KB: Next.js on Vercel vs Cloudflare](https://blog.vercel.com/kb/guide/next-js-on-vercel-vs-cloudflare)

### Inferences
- Lock-in and exit cost. Vercel -> Cloudflare: the app code is standard Next.js so the move is mostly build/deploy plumbing plus re-testing ISR/`use cache`, image loader (switch to Cloudflare Images or a custom loader) and middleware; expect days, not months, for two apps of this size. Cloudflare -> Vercel: anything written against KV/DO/R2/Queues bindings or Browser Rendering must be swapped for Vercel KV/Blob/Upstash equivalents; keep bindings behind interfaces in `api/` to keep that cheap. Hono itself is portable both ways.
- Multi-region: Cloudflare runs the Workers in every PoP (including Lagos) by default; Vercel Pro functions run in one chosen region per project with multi-region on Enterprise. For a Nigeria-only audience, single-region Europe on Vercel is acceptable but strictly worse on TTFB than Workers in Lagos.
- The "everyone big runs Kubernetes on AWS/GCP" pattern among African and Indian consumer apps says more about their age and payments compliance than about Vercel/Cloudflare; it does mean the founders will not find a peer case study for either option at 10 M+ users in the region.
- Security posture: an all-Cloudflare stack gets WAF, rate limiting, Turnstile and bot heuristics on one bill and one dashboard; the Vercel option in practice needs Cloudflare in front anyway for the same protections, which is why the brief's "Vercel behind Cloudflare" framing is right.

### Gaps
- No public engineering blog from Jumia, Flutterwave, Kuda or Apna describing hosting; Paystack and Jumia evidence is job postings (weak).
- Cloudflare Workers Builds (native CI with preview URLs) details and limits were not retrieved; the freeCodeCamp GitHub Actions path is the documented alternative.
- No sourced comparison of rollback mechanics (Vercel instant rollback vs Wrangler versions/gradual deployments) in the results.
- Cloudflare per-plan WAF custom rule and rate-limiting rule counts unverified.

---

## Verify first (five URLs the founders should open before deciding; all were policy-blocked in this sandbox)
1. https://developers.cloudflare.com/workers/platform/limits/ (confirm 64 MiB uncompressed size limit and 128 MB memory).
2. https://developers.cloudflare.com/workers/platform/pricing/ (confirm $5, 10 M requests, 30 M CPU-ms, $0.30/M, $0.02/M CPU-ms, Logs, KV).
3. https://vercel.com/docs/fluid-compute/pricing and https://vercel.com/docs/pricing/regional-pricing/fra1 and /cpt1 (confirm regional CPU, memory, Edge Request and bandwidth rates).
4. https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs (current OpenNext/vinext feature table for Next.js 16).
5. https://www.cloudflare.com/plans/ (Pro/Business price and WAF/rate-limit rule counts).
