---
name: email-template
description: Create or edit an email the platform sends (the job digest, welcome, OTP fallback, payment receipt, dunning reminder, learning-path nudge, employer notifications). Use this for any task that mentions an email, a digest, a notification people receive in their inbox, or copy that will be sent to users, even when it is phrased as "message users when X". It enforces the deliverability rules (one-click unsubscribe, plain-text part, size), the no-fee trust line, naira formatting and a rendered preview.
argument-hint: <template_name> <trigger and audience>
---

# Create an email template

Email is the product's primary delivery channel (PLAN.md, Architecture), and Gmail is the
inbox most Nigerian users read it in. Gmail and Yahoo reject or spam-folder bulk senders
that miss one-click unsubscribe, lack a text part, or cross a 0.3% spam-report rate. One
careless template can damage the sending domain for every template, so the rules below are
not optional polish.

## Where templates live

`api/src/emails/<template_name>.ts`, exporting one function:

```ts
export function render<TemplateName>(input: <TemplateName>Input): RenderedEmail
```

`RenderedEmail` is `{ subject: string; html: string; text: string; headers: Record<string,string> }`
defined in `api/src/emails/types.ts` (create it on first use together with
`api/src/emails/layout.ts`, a shared wrapper that provides the header, footer and the
unsubscribe block so no template can forget them). Templates are plain TypeScript string
builders, not a framework; they must render in a worker with no React runtime.

Read `frontend/src/app/digest/page.tsx` for the digest's content and tone before writing a
new template. It is the reference for voice: direct, concrete, no exclamation marks.

## Rules every template meets

- **Subject** under 60 characters, specific, no ALL CAPS, no emoji. For the digest, lead
  with the count: "5 jobs you can actually get this week".
- **Text part** that reads well on its own. Many users have images and HTML off to save
  data, and the text part is what spam filters compare against the HTML.
- **Headers**: `List-Unsubscribe: <mailto:...>, <https://.../unsubscribe?token=...>` and
  `List-Unsubscribe-Post: List-Unsubscribe=One-Click` on every non-transactional email
  (RFC 8058). The layout adds these; a template only sets `transactional: true` for OTPs
  and receipts, which are exempt.
- **Footer**, from the layout: the no-fee statement ("We never charge you to apply, and no
  employer on this platform may charge you"), the sender's legal name and postal address,
  an unsubscribe link, and a "report a listing" line in the digest.
- **Size** under 100 KB of HTML (Gmail clips at 102 KB) and no external images. Inline
  only the SVG icon if needed. Tables for layout, inline styles, system fonts.
- **Links** go to the original employer posting or to our own domain. Never a shortener.
  Append `utm_source=email&utm_campaign=<template_name>` so PostHog can attribute clicks.
- **Money** is formatted with the shared helper (₦ and thousands separators, no decimals).
  Dates are "Fri 24 Oct".
- **Personalisation** comes from the input object, never from free text in a prompt. If the
  digest includes an AI-written line, it is generated upstream with structured output and
  passed in as a string.

## Preview and test

- Add a case to `api/src/emails/preview.ts` (create on first use) that renders the template
  with sample data and writes `api/.previews/<template_name>.html` and `.txt`. Open the HTML
  in a browser or with Playwright and look at it at 360px width before finishing.
- Add a unit test in `api/tests/emails/<template_name>.test.ts` (create the folder and a
  vitest config on first use) asserting: subject length, presence of the unsubscribe headers
  when not transactional, presence of the no-fee line, HTML under 100 KB, and that every
  `href` is on an allowed domain. These are the checks that protect the sending domain.

## Finish

Report: the template name and trigger, the subject line, the input fields, where the preview
files are, and the test results. If the email is marketing rather than transactional, say so,
because marketing requires consent under GAID 2025 and must honour unsubscribes within two
days.
