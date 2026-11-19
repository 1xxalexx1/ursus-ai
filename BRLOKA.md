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
  renamed, junk formats deleted, `fonts.css` references woff2 only.
- CTA form (`#ctaForm`) is demo-only — shows a confirmation message, sends nothing.
- Footer links under Company/Resources/Legal are placeholders (`#top` / `#faq`).
- Stats/testimonials/marquee companies are fictional placeholder content.
- Favicon is an inline SVG data URI; no separate file needed.

## How to continue (next steps, in order)

1. **Visual pass in a real browser** — open it, click through, toggle theme, resize
   to mobile width, test the burger menu. Fix anything that looks off.
2. **Meta/SEO polish** — add Open Graph tags (`og:title`, `og:description`,
   `og:image`, `twitter:card`) and a `<meta name="theme-color">` in `<head>`.
3. **Content** — replace fictional stats/testimonials with real ones (or keep as
   clearly-demo copy), decide on footer link targets (real pages vs. remove).
4. **Wire the CTA** — point `#ctaForm` at a real endpoint (e.g. a form service or
   your own backend) instead of the demo message.
5. **Deploy** — any static host (GitHub Pages, Cloudflare Pages, Netlify).
   No build step needed; upload the folder as-is.
6. If more pages are needed (docs, blog, changelog), keep the same pattern:
   one HTML file per page sharing `styles.css`/`script.js`, new section classes in
   `styles.css`.

## Git

Repo initialized on `main`. Initial build committed as `5af15d5`
("Ursus AI SaaS site — initial build, fonts vendored for offline use").
Later fixes are uncommitted until Alex says to commit.
