# Box Park III Landing Page — Project Status

**Client:** Premier Choice International Real Estate Developers (PCI)
**Project:** Landing page for Box Park III, Bahria Town Phase 7
**Last updated:** this session

---

## 1. What this is

A single static landing page (`index.html` + `css/style.css` + `js/main.js`)
for Box Park III — a commercial development (46 retail shops + 46 corporate
offices) by Premier Choice International. Built from the client's own
brochure PDF, flyer PDF, and campaign/ad-copy document, following a 16-section
"high-conversion landing page" anatomy the client provided as a reference.

Two lightweight serverless functions (`api/lead.js`, `api/config.js`) are
scaffolded to route form submissions to Meta, Bitrix24, and WhatsApp — see
§5. Nothing outside `index.html`/`css`/`js` is required for the page to
render; the `api/` folder only activates once deployed somewhere that
supports serverless functions (Vercel, Netlify, etc.).

---

## 2. How we got here (session narrative)

1. **Content extraction.** Read the brochure PDF, flyer PDF, and campaign
   markdown doc the client uploaded. Pulled real project facts from them:
   pricing table, payment plan, location distances, project highlights,
   sales-pitch angles, developer credibility points. Extracted and
   re-compressed the actual renders (exterior, rooftop terrace, retail
   lobby, boutique, open office, outdoor patio, office lounge) as image
   assets rather than using stock photography or placeholders.

2. **First build.** Built the full 16-section page (hero → trust bar →
   overview → location → highlights → pricing → payment plan → gallery →
   floor breakdown → investment benefits → developer credibility → why-PCI →
   lead form → FAQ → final CTA → footer). Verified it rendered and worked
   with Playwright screenshots at desktop and mobile sizes.

3. **First design rejected.** Client feedback: it looked generic/AI-templated
   (warm cream background + safe serif headings + rounded icon cards —
   exactly the pattern this kind of design work is supposed to avoid) and the
   lead form was easy to miss. Full redesign: dark architectural palette
   (near-black + maroon sampled directly from the client's logo), rounded
   cards replaced with hairline-divided editorial lists and a running
   "folio" numbering system (mirroring the brochure's own pagination), a
   literal stacked-building elevation graphic for the floor breakdown, and
   the lead form rebuilt as a high-contrast paper-on-maroon card that's hard
   to miss. Along the way, fixed two real bugs: a CSS specificity collision
   that put an unreadable dark box behind two headings, and a z-index bug
   that rendered background photos *over* their darkening overlay instead of
   under it (making text unreadable in two sections).

4. **Second round of critique — 11 numbered points + technical asks.**
   Client sent detailed section-by-section feedback (see the point-by-point
   log below) plus a request to wire up Meta CAPI/Pixel, WAHA (WhatsApp),
   Bitrix lead capture, and analytics. Rather than guess at all of it in one
   more sweeping pass, clarified the genuinely ambiguous parts first
   (map treatment, hosting platform, font licensing, credential handling)
   before touching code again.

5. **Font swap: Montserrat → Optima.** Client provided 4 licensed Optima
   font files (Regular/Medium/Bold/Italic). Subsetted and embedded them
   (replacing the Montserrat placeholder chosen in step 3), removed the
   invented brass/gold accent color entirely, and rebuilt the palette from
   only the client's real brand colors (maroon + black/white/grey).

6. **GitHub repo access — unresolved.** Attempted to create
   `usmankhan4001/PCI-Landing-Pages` directly (blocked — GitHub API
   permission denied to this session's integration). Attempted to connect to
   a manually-created repo via `add_repo` — blocked repeatedly (session's
   GitHub access is scoped per-repo and this repo was never granted).
   Client confirmed there's no GitHub App to configure on their end, and
   `gh auth login` isn't available in this environment either. **Decision:**
   work locally in this session and hand off files directly (this zip) until
   the client sorts out repo access from the claude.ai side. See §6.

7. **Section-by-section fixes**, one described request at a time:
   - **Hero**: added a popup/modal lead-capture form triggered instantly
     from the hero CTA (no scrolling to the bottom form), tightened the
     copy to lead with hard numbers to feel more urgent/exclusive, fixed a
     genuine font-subsetting glyph bug (the modal's × close icon rendered
     as a garbled character — swapped for an inline SVG icon), then fixed
     hero readability (was maroon-on-photo text with contrast problems;
     now centered, all-white, with a text-shadow for legibility).
   - **Trust bar**: rebuilt from a plain inline text list into icon +
     heading/subheading cards.
   - **Floor & Unit Breakdown**: originally a CSS-drawn abstract bar chart,
     then a CSS-drawn "building elevation" illustration — client correctly
     pushed back that it should be the *actual render* of the building.
     Rebuilt as the real exterior photo with clickable floor zones
     positioned over it (mapped by inspecting the actual image pixel
     coordinates); clicking a floor slides its layout plan into a side
     panel next to the render. Currently shows "coming soon" placeholders
     per floor since real floor-plan PNGs haven't been received yet.

---

## 3. Current state, section by section

| # | Section | Status |
|---|---|---|
| 1 | Hero | Done — centered, white text, popup lead-capture modal, urgency-driven copy |
| 2 | Trust bar | Done — icon + heading/subheading, 5 items |
| 3 | Project overview | Done |
| 4 | Location advantage | Done — includes custom interactive animated SVG map (hover a landmark, a path draws from it to Box Park III) |
| 5 | Key highlights | Done |
| 6 | Pricing table | Done — real rates from the flyer, maroon header, standout styling |
| 7 | Payment plan | Done |
| 8 | Gallery | Done — grid bug (empty tile) fixed |
| 9 | Floor & unit breakdown | Done — real render + click-to-view mechanism, wired to the client's actual floor-plan layouts (converted from `docs/Layout Plans/*.png`) |
| 10 | Investment benefits | Done |
| 11 | Developer credibility | **Partial** — portfolio row built as image-ready "logo chips" with graceful text fallback; needs real logo files from client (5 logos were pasted inline in chat, which doesn't give file access — need actual file attachments) |
| 12 | Why Premier Choice | Done |
| 13 | Lead capture form | Done — also duplicated into the hero popup modal |
| 14 | FAQs | Done |
| 15 | Final CTA | Done |
| 16 | Footer | Done |

**Typography:** Optima (client-provided licensed files: Regular, Medium,
Bold, Italic), subsetted and embedded, one family used site-wide.

**Palette:** Maroon `#67100f` (sampled directly from the client's logo),
near-black ink, warm paper/stone neutrals. No invented accent colors.

---

## 4. Outstanding — needs input from the client

1. **Portfolio logos** (Box Park I/II, River Hills, River Courtyard, Grand
   Orchard, 68 High Street, Buraq Heights, Grand Gallery — exact list
   still to be confirmed against what the client actually sent) — need
   these as **file attachments**. Checked the full repo (`img/`, `docs/`,
   `assets/`, `archive/`) — no logo files exist anywhere yet, only the
   `img/logos/*.png` references in `index.html` with a text-chip fallback.
2. ~~Floor plan PNGs~~ — **received and wired in.** Client's 6 layout-plan
   pages (`docs/Layout Plans/Layout BP 3 - _Page_1‑6.png`) were converted
   to web-sized JPGs at `src/img/floorplans/{ground-01,ground-02,
   mezzanine,1st-floor,2nd-floor,3rd-floor}.jpg` and match the click zones
   already built into the floor & unit breakdown section exactly.
3. ~~GitHub repo access~~ — **resolved.** `origin` is
   `https://github.com/usmankhan4001/PCI-Landing-Pages.git` and the repo
   has commits (init, source, assets, archive, docs) as of 2026‑07‑06/07.
4. **Hosting decision** — recommended Vercel (static site + serverless
   functions in one deploy, free tier, plugs directly into a GitHub repo
   once connected) but not yet confirmed by the client.
5. **Real credentials** for the integrations in §5 — Meta Pixel ID + CAPI
   access token, Bitrix24 inbound webhook URL, WAHA instance URL/session/key.
   Client said these are ready to provide — none received yet. **Do not
   paste secret tokens into chat** — once hosting is live, set them as
   environment variables in the hosting dashboard directly (see
   `.env.example`).
6. **Ongoing copy pass** — client flagged that since this page will be used
   directly in paid ads, copy needs continued refinement. Current copy
   pulls from the client's own tested ad-copy document where possible, but
   this is explicitly called out as not finished.

---

## 5. Technical integrations (scaffolded, not live)

`api/lead.js` and `api/config.js` are written and ready, but **inactive**
until (a) this project is deployed somewhere with serverless function
support, and (b) real credentials are set as environment variables.

| Integration | What it does | Status |
|---|---|---|
| Meta Pixel | Client-side `PageView` + `Lead` events | Code ready, needs `META_PIXEL_ID` |
| Meta Conversions API (CAPI) | Server-side `Lead` event, deduplicated with Pixel via shared event ID | Code ready, needs `META_CAPI_ACCESS_TOKEN` |
| Bitrix24 | Posts each lead to `crm.lead.add` via inbound webhook | Code ready, needs `BITRIX_WEBHOOK_URL` |
| WAHA (WhatsApp HTTP API) | Sends lead details to sales WhatsApp | Code ready, needs `WAHA_BASE_URL` / `WAHA_SESSION` / `WAHA_API_KEY` |
| GA4 | Client-side `generate_lead` event | Code ready, needs `GA4_MEASUREMENT_ID` |

Every integration fails silently/gracefully if its env vars are blank — the
page works fine with zero of them configured, they just won't fire.
See `.env.example` for the full list and `README.md` for deploy steps.

---

## 6. Repo / delivery status

- GitHub repo creation attempt (`usmankhan4001/PCI-Landing-Pages`) via API:
  denied (`403`, integration lacks repo-creation permission).
- `add_repo` connection attempts to the client's manually-created repo:
  denied 3× (session not authorized for that repo).
- Client confirmed no GitHub App appears under their GitHub installation
  settings — this session's GitHub access is managed from claude.ai's side,
  not GitHub's.
- `gh` CLI: not installed in this environment, and not permitted for use
  per this session's configuration even if it were.
- **Current delivery method:** direct file handoff (zip), per client's
  explicit choice to skip GitHub for now and work locally.

---

## 7. File manifest (this zip)

```
box-park-3-landing/
├── index.html              — the page itself
├── css/style.css           — all styles, incl. embedded Optima font (base64)
├── js/main.js               — header scroll, FAQ accordion, map hover/tap,
│                              floor-plan panel, lead modal, form submission,
│                              Meta Pixel/GA4 bootstrap
├── img/                     — real project renders (exterior, interiors,
│                              location map crop) — logos and floor plans
│                              NOT yet included, pending client files
├── api/
│   ├── lead.js               — serverless endpoint: fans out to Meta CAPI,
│   │                           Bitrix, WAHA
│   └── config.js             — serves public config (Pixel ID, GA4 ID) to
│                               the client-side JS
├── .env.example              — every credential the integrations need
├── README.md                 — deploy instructions
└── PROJECT-STATUS.md          — this file
```

---

## 8. Suggested next steps, in order

1. Client sends portfolio logo files + floor plan PNGs (as attachments).
2. Resolve GitHub repo access (claude.ai side) — or continue with direct
   file handoffs if preferred.
3. Confirm hosting platform (Vercel recommended) and deploy.
4. Client provides real integration credentials → set as environment
   variables on the hosting platform → integrations go live.
5. Continue the section-by-section design review for any remaining
   sections the client hasn't explicitly signed off on yet.
6. Further copy pass once the client identifies which sections will be
   used verbatim in ad creative vs. only on the landing page itself.
