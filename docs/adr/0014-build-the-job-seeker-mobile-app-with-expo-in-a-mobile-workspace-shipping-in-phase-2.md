# ADR-0014: Build the job-seeker mobile app with Expo (React Native) in a `mobile/` workspace, shipping Android first in Phase 2 while the PWA stays primary

- Status: Accepted
- Date: 2026-10-24
- Deciders: Founders
- Related: ADR-0001 (repository split trigger); ADR-0008 and ADR-0011 (hosting; "no app-store distribution" narrowed here); PLAN.md §Price at ₦1,999 (sell on the web, not in the app store), §Ship a PWA (phase table, "do not build a native app before Phase 3"); BRD NFR-006; ARCHITECTURE.md §Services and their future repositories; CLAUDE.md §Workspace, §Rules that keep the split clean

## Context
PLAN.md says the MVP is a mobile PWA and that a native app should wait until Phase 3, because
Android Chrome makes a PWA installable and push-capable and app-store billing takes 15% of
every naira. Two things moved the question: an Expo Router scaffold already exists in an untracked
`mobile/` workspace (added to the root `workspaces` array in this session), and the Phase 2 feature list (Pro tier notifications, re-match on course
completion, campus and NYSC campaigns) depends on reliable push and on being found where
Nigerian users look for apps, which on Android is the Play Store. Android is about 82 to 88% of
Nigerian mobile traffic. The constraint is two founders who already write TypeScript across
four workspaces and cannot carry a second language or a second type system.

## Decision
The job-seeker mobile app is built with Expo (React Native, TypeScript) in a `mobile/`
workspace of this repository today and in a `buildyourvalue-mobile` repository after the split
that ADR-0001 triggers. It uses Expo Router for navigation, EAS Build and EAS Submit for store
builds, EAS Update for over-the-air JavaScript updates, `expo-notifications` for push and
NativeWind for Tailwind-style styling that shares design tokens conceptually with the web
apps. It imports `@byv/core` for types and static reference data only and talks to `api` over
HTTP, exactly as `frontend` and `admin` do; it never scores, matches or calls Claude. The admin
console stays web-only. The PWA remains the primary channel and the only place subscriptions
are sold (web checkout through Paystack, never app-store billing) until Phase 2; the native app
ships in Phase 2 on Android for push notifications, share-sheet CV capture (a user shares a
PDF or DOCX from WhatsApp or Drive straight into the CV builder) and Play Store presence, with
iOS following.

## Alternatives considered
| Option | Why not (or why not yet) |
|---|---|
| Flutter | Dart means no code or type sharing with `@byv/core` and a second skill set for two founders; the API client, role data and CV types would be hand-duplicated. |
| Capacitor wrapping the PWA | Fastest route to a store listing and reuses the Next.js app, but native UX (navigation, share sheet, offline) is weaker and push reliability on low-end Android depends on the web view. Acceptable as an interim store presence if Phase 2 slips. |
| Kotlin Multiplatform | Android-first fits the market, but no TypeScript sharing and an iOS story that still needs Swift UI work; wrong fit for a TypeScript team. |
| React Native without Expo | Same language and sharing, but the founders would own Gradle and Xcode build maintenance, signing and update infrastructure that EAS provides as a service. |
| Stay PWA-only through Phase 3 (PLAN.md's position) | Web Push on Android Chrome works, but PWA install rates stay low without a store listing, iOS Web Push is limited to installed home-screen apps, and share-sheet capture is not available to a PWA on most Android builds; the Phase 2 loop needs the first two. |

## Consequences
- Positive: one language and one type package across five workspaces; `@byv/core` changes land in the app the same way they land in the web apps; EAS Update ships fixes without a store review; push goes through the platform channels instead of Web Push's Android-only reliability; the Play Store listing is a trust signal in a market where 84% of adults met a scam last year.
- Negative or risks: a fifth workspace to typecheck and a fifth future repository to split (ADR-0001's checklist grows); Expo SDK upgrades roughly twice a year and the React Native version pin must track `@byv/core`'s TypeScript target; store review and policy (Google Play's rules on subscriptions sold off-store must be followed exactly, so the app links to web checkout rather than selling); EAS has a paid tier; Apple requires a developer account and iOS testing hardware the founders may not have.
- On acceptance: `mobile` is in the root `workspaces` array with its own `package.json`, `tsconfig.json` and `@byv/core` dependency; it still needs an `.env.example` declaring `EXPO_PUBLIC_API_URL` as the HTTP boundary, plus NativeWind and `expo-notifications` when those screens are built; ARCHITECTURE.md's services table and CLAUDE.md's Workspace table and split rules gain a `mobile/` row and rule; PLAN.md's "before Phase 3" sentence links here; the first-deploy checklist (ADR-0011) does not include the app.
- What would make us revisit this: Phase 1 digest and PWA metrics missing their gates (then the app waits, and Capacitor is the interim if a store listing is still wanted); EAS pricing or Expo's SDK cadence becoming a cost or maintenance problem out of proportion to a two-person team; Web Push and share-target support on Android and iOS reaching parity with native (then the PWA stays the only client); a B2G or institutional partner in Phase 3 requiring a specific platform.

## Verification
Checked in the repository on 2026-10-24: an untracked `mobile/` workspace (`@byv/mobile`)
holds an Expo Router scaffold (`expo ~58.0.19`, `expo-router ~58.0.26`, `react-native 0.88.0`,
`app/_layout.tsx`, `app/index.tsx`, `app/jobs.tsx`) depending on `@byv/core`, and the root
`package.json` now lists `mobile` as a fifth workspace (uncommitted). NativeWind,
`expo-notifications`, EAS configuration and an `.env.example` do not exist yet, so this ADR
records the stack, not a shipped app. From PLAN.md's research:
Android at about 82% of Nigerian mobile traffic (the 82 to 88% band is the founders' figure),
Google Play's 15% subscription fee and Apple's Small Business Program 15%, both snippets.
Unverified: EAS pricing (a free tier with limited builds and paid plans exist; the founders
must check expo.dev/pricing before the first store build); current Google Play policy wording
on linking to off-store checkout for a subscription app; Expo SDK 58's support for the React
Native version pinned in the scaffold; whether NativeWind's current major works with Expo
Router's layout files without configuration the two founders have not tried. Estimate: that
share-sheet CV capture and push are the features that justify a native app in Phase 2 rather
than Phase 3; measure PWA install and Web Push opt-in rates in Phase 1 before building.
