# Gödöllői Agapé Gyülekezet weboldal — Design (POC)

## Cél
Statikus, telepíthető bemutatkozó oldal (POC fázis), Astro-val, Azure Static Web Apps hostinghoz. Nincs CMS, backend, adatbázis, űrlap-feldolgozás. Tartalom magyar, a `CLAUDE.md`-ben rögzített szöveg szó szerint.

## Technológia
- Astro (legfrissebb stabil), SSG kimenet `dist/`.
- Sima CSS, scoped stílusok `.astro` fájlokban. Nincs Tailwind vagy más UI-keretrendszer.
- `lang="hu"`, szemantikus HTML, mobil-first reszponzív, alap akadálymentesség (alt szövegek, kontraszt).

## Struktúra

```
src/
  layouts/
    Base.astro          # közös fejléc/lábléc, nav, <head>/meta
  components/
    Placeholder.astro   # SVG kép-placeholder (caption, aspectRatio prop)
  pages/
    index.astro
    bemutatkozas.astro
    royal-rangers.astro
    kapcsolat.astro
    404.astro
staticwebapp.config.json
README.md
```

## Komponensek

**Base.astro** (layout)
- Fejléc: gyülekezet neve + logó placeholder + nav (Kezdőlap · Bemutatkozás · Royal Rangers · Kapcsolat), mobilon összecsukható menü.
- Lábléc: gyülekezet neve, cím (Gödöllő, Peres u. 54), copyright.
- Props: `title` (oldal `<title>`-hez), `description` (meta).

**Placeholder.astro**
- Props: `caption: string`, `ratio: "16:9" | "4:3"`, `alt: string`.
- Inline SVG: semleges háttérszín téglalap + középre igazított felirat, helyes méretarány, `alt` a körülölelő `<figure>`/`<img>`-szerű szemantikán vagy `role="img"` + `aria-label`.

## Oldalak — tartalom
A `CLAUDE.md`-ben szó szerint megadott magyar szöveg kerül be, változtatás nélkül, beleértve a szándékos 7–17 / 5–17 eltérést (bemutatkozás vs. royal-rangers oldal) — ezt NEM egységesítjük.

1. **index.astro** — hero szöveg, kiemelt alkalom-blokk (vasárnap 9:30, cím), 3 kártya (bemutatkozás/royal-rangers/kapcsolat linkekkel), közösségi kép placeholder (16:9).
2. **bemutatkozas.astro** — 5 szekció (Kik vagyunk / Célunk / Az evangélium hirdetése / Szolgálat embertársaink felé / Gyermekek és fiatalok), áthidaló link a Royal Rangers oldalra, kép placeholder (4:3).
3. **royal-rangers.astro** — Bevezető / Mit adunk / Korosztályok (általános megfogalmazás, nincs kitalált korosztály-elnevezés) / Szülőknek (link Kapcsolatra), kép placeholder (4:3).
4. **kapcsolat.astro** — cím, e-mail és telefon TODO-placeholder (kód-kommenttel jelölve), vasárnapi alkalom, OSM `<iframe>` embed API-kulcs nélkül a Peres u. 54-hez, épület kép placeholder (4:3).

## Hosting / Azure Static Web Apps
- `staticwebapp.config.json`: `navigationFallback` → `/404.html`, `index.html` mint alapértelmezett dokumentum.
- `README.md`: `npm install`, `npm run dev`, `npm run build`, Azure SWA telepítés (GitHub Actions workflow, app location `/`, output location `dist`).

## Amit nem csinálunk
- Nincs hitvallás / teológiai tartalom.
- Nincs kitalált elérhetőség, statisztika, dátum a megadottakon túl.
- Nincs API-kulcsos külső szolgáltatás (térkép, analytics).
- 7–17 és 5–17 korhatár nem egységesítve.

## Tesztelés / ellenőrzés
- `npm run build` sikeresen lefut, `dist/` létrejön.
- Dev szerver böngészőben ellenőrizve: nav minden oldalon működik, linkek célba érnek, placeholder képek megjelennek megfelelő aránnyal, mobil nézet (viewport resize) rendben.

## Nyitott kérdés
Nincs — a `CLAUDE.md` feladatleírás teljes körű, minden tartalmi döntés rögzített.
