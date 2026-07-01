# Gödöllői Agapé Gyülekezet Website — Design (POC)

## Goal
Static, deployable presentation site (POC phase), built with Astro, hosted on Azure Static Web Apps. No CMS, no backend, no database, no form processing. Content is Hungarian, taken verbatim from `CLAUDE.md`.

## Tech stack
- Astro (latest stable), SSG output to `dist/`.
- Plain CSS, scoped styles in `.astro` files. No Tailwind or other UI framework.
- `lang="hu"`, semantic HTML, mobile-first responsive, baseline accessibility (alt text, contrast).

## Structure

```
src/
  layouts/
    Base.astro          # shared header/footer, nav, <head>/meta
  components/
    Placeholder.astro   # SVG image placeholder (caption, aspectRatio prop)
  pages/
    index.astro
    bemutatkozas.astro
    royal-rangers.astro
    kapcsolat.astro
    404.astro
staticwebapp.config.json
README.md
```

## Components

**Base.astro** (layout)
- Header: church name + logo placeholder + nav (Kezdőlap · Bemutatkozás · Royal Rangers · Kapcsolat), collapsible menu on mobile.
- Footer: church name, address (Gödöllő, Peres u. 54), copyright.
- Props: `title` (page `<title>`), `description` (meta).

**Placeholder.astro**
- Props: `caption: string`, `ratio: "16:9" | "4:3"`, `alt: string`.
- Inline SVG: neutral background rect + centered caption text, correct aspect ratio, `alt` exposed via surrounding semantics or `role="img"` + `aria-label`.

## Pages — content
Hungarian text given verbatim in `CLAUDE.md` goes in unchanged, including the intentional 7–17 / 5–17 age-range discrepancy (bemutatkozas vs. royal-rangers page) — this is NOT to be unified.

1. **index.astro** — hero text, highlighted service-time block (Sunday 9:30, address), 3 cards (bemutatkozas/royal-rangers/kapcsolat links), community photo placeholder (16:9).
2. **bemutatkozas.astro** — 5 sections (Kik vagyunk / Célunk / Az evangélium hirdetése / Szolgálat embertársaink felé / Gyermekek és fiatalok), bridge link to Royal Rangers page, photo placeholder (4:3).
3. **royal-rangers.astro** — Bevezető / Mit adunk / Korosztályok (general phrasing only, no invented age-group names) / Szülőknek (link to Kapcsolat), photo placeholder (4:3).
4. **kapcsolat.astro** — address, email and phone as TODO placeholders (marked with code comment), Sunday service time, OSM `<iframe>` embed with no API key for Peres u. 54, building photo placeholder (4:3).

## Hosting / Azure Static Web Apps
- `staticwebapp.config.json`: `navigationFallback` → `/404.html`, `index.html` as default document.
- `README.md`: `npm install`, `npm run dev`, `npm run build`, Azure SWA deploy steps (GitHub Actions workflow, app location `/`, output location `dist`).

## Out of scope
- No creed / theological content.
- No invented contact info, statistics, or dates beyond what's given.
- No external service requiring an API key (maps, analytics).
- 7–17 and 5–17 age ranges not unified.

## Testing / verification
- `npm run build` succeeds, `dist/` produced.
- Dev server checked in browser: nav works on every page, links resolve, placeholder images render at correct ratio, mobile viewport (resize) works.

## Open questions
None — the `CLAUDE.md` brief is complete, all content decisions are fixed.
