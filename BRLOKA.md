# Brloka — Ursus AI landing page

What this is and how to pick it back up. Read this first, then `index.html`.

## What this is

**Ursus** — a fictional bear-themed AI SaaS ("autonomous agents that ship while you
sleep"). A single-page marketing site: hero, logo marquee, bento features, terminal
demo of an "overnight run", stats, pricing, testimonials, FAQ, CTA, footer.

- Pure static site. **No build step, no dependencies, no framework.**
- Works fully offline: fonts are vendored in `assets/fonts/` (woff2 only).
- Dark + light theme ("night/day den") via `data-theme` on `<html>`, persisted in
  `localStorage` under `ursus-theme`.

## Layout

```
ursus-ai/
├── index.html      all markup, one page, sections with ids: product / how / pricing / faq / cta
├── styles.css      design system + all components + responsive + reduced-motion
├── script.js       all interactions, one IIFE, vanilla JS (ES5-ish var style)
├── fonts.css       @font-face for vendored fonts
├── assets/fonts/   6 woff2 files: Clash Display 500/600/700, Satoshi 400/500/700
└── BRLOKA.md       this file
```

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000    # then http://localhost:8000
```

## Conventions

- Design tokens are CSS custom properties on `[data-theme="dark"]` / `[data-theme="light"]`
  in `styles.css` (`--bg`, `--panel`, `--amber`, `--green`, `--grad`, ...). Change themes
  there, not per-component. Radius `--radius`, nav height `--nav-h`.
- Fonts: `Clash Display` for headings (`--font-display`), `Satoshi` for body (`--font-body`).
- JS: everything in one IIFE in `script.js`, `var` + function expressions, no modules.
  Features: theme toggle, scroll progress, burger nav, reveal-on-scroll
  (`.reveal` + IntersectionObserver), animated counters, typing terminal demo,
  pricing toggle, FAQ accordion, card tilt, magnetic buttons, fireflies canvas,
  paw-print click stamp.
- `prefers-reduced-motion` is respected everywhere; `pointer: fine` gates tilt/magnetic.
- No emojis anywhere; icons are inline SVG. Bear paw SVG is reused — copy it from the
  nav `.brand` if you need it again.

## Sanity checks (run after editing)

```bash
node --check script.js                       # JS syntax
python3 -m http.server 8000 &                # then curl every asset referenced in
                                             # index.html / fonts.css — all must 200
```

Last check (2026-11-19): JS syntax OK, HTML tags balanced, no duplicate ids, all
local refs resolve, all 6 font files present and valid woff2.

## Known state / gotchas

- Font files: originally vendored with a trailing `'` in the filename and the
  `.ttf`/`.woff` downloads were S3 `NoSuchKey` error XML. Fixed 2026-11-19:
  junk formats deleted, `fonts.css` references woff2 only.
- CTA form (`#ctaForm`): set `CTA_ENDPOINT` at the top of the CTA section in
  `script.js` to a real URL to receive `POST {"email": "..."}`; empty string =
  demo mode (validates locally, sends nothing).
- Footer links under Company/Resources/Legal are placeholders (`#top` / `#faq`).
- Stats/testimonials/marquee companies are fictional placeholder content.
- Favicon is an inline SVG data URI; `assets/og-image.png` is the social card
  (1200x630, rendered with the vendored fonts).

## Status (2026-11-19) — DONE

- Meta/SEO: canonical, OG + Twitter cards, `theme-color` (synced on theme
  toggle), hero fonts preloaded.
- Verified in headless Chromium (desktop 1440px + mobile 390px, dark + light):
  zero console/page errors, zero failed requests, all 6 woff2 fonts load;
  theme toggle, burger menu, pricing toggle, FAQ, terminal demo, counters and
  CTA validation all work; no horizontal overflow on mobile.
- Deployed: **https://1xxalexx1.github.io/ursus-ai/** (GitHub Pages, `main` / root,
  public repo `1xxalexx1/ursus-ai`). Live check passed (HTTP 200, fonts + OG
  image 200, no errors). Redeploys automatically on every push to `main`.

## How to continue (remaining ideas, in order)

1. Set `CTA_ENDPOINT` in `script.js` when a real signup endpoint exists.
2. Replace fictional stats/testimonials/marquee with real content, or keep as
   clearly-demo copy; decide footer link targets (real pages vs. remove).
3. Custom domain: add a `CNAME` file at the repo root + set it in
   `Settings → Pages`, then update canonical/OG URLs.
4. If more pages are needed (docs, blog, changelog), keep the same pattern:
   one HTML file per page sharing `styles.css`/`script.js`, new section classes
   in `styles.css`.

## Git

Public repo `github.com/1xxalexx1/ursus-ai`, branch `main`, remote `origin`.
Commits use the noreply author email (GitHub rejects the `.local` one).
Push to `main` = automatic Pages redeploy.
