# Box Park III — Landing Page

Static landing page (`index.html` + `css/style.css` + `js/main.js`) plus two
serverless functions under `api/` for lead routing and tracking.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel — no build step needed, it's detected as a
   static site with serverless functions automatically.
3. In Vercel → Project → Settings → Environment Variables, add the values
   from `.env.example`. Leave any integration blank to disable it (each one
   fails gracefully and just skips itself — see `api/lead.js`).
4. Deploy. `/api/lead` and `/api/config` go live automatically alongside the
   static site.

Any other static host that supports Node serverless functions (Netlify,
Cloudflare Pages) works too — just move `api/lead.js` and `api/config.js`
into that platform's function folder convention.

## What's wired up

- **Meta Pixel** — loaded client-side once `META_PIXEL_ID` is set (fetched
  from `/api/config`, not hardcoded).
- **Meta Conversions API** — `api/lead.js` sends a server-side `Lead` event
  on form submit, deduplicated against the client-side Pixel event via a
  shared `eventId`.
- **Bitrix24** — `api/lead.js` posts the lead to `crm.lead.add` via an
  inbound webhook.
- **WAHA (WhatsApp HTTP API)** — `api/lead.js` sends a WhatsApp message to
  the sales number with the lead details.
- **GA4** — loaded client-side once `GA4_MEASUREMENT_ID` is set; fires a
  `generate_lead` event on submit.

## Not done yet

- Real logo files for the "Developer Credibility" portfolio row
  (`img/logos/*.png` — currently gracefully falls back to text chips).
- Actual credential values — see `.env.example`.
- This repo isn't connected to git/GitHub yet.
