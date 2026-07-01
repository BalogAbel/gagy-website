# Gödöllői Agapé Gyülekezet Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static 4-page Astro site (Hungarian content, per spec) for Gödöllői Agapé Gyülekezet, deployable to Azure Static Web Apps with zero backend.

**Architecture:** Astro SSG project. One shared layout (`Base.astro`) provides header/nav/footer. One reusable `Placeholder.astro` component renders inline SVG image placeholders. Four content pages plus a 404 page consume the layout. No test framework is used for logic (there is none) — verification is `npm run build` succeeding, content grep checks against the built HTML in `dist/`, and a manual browser pass via the preview tool for nav/responsiveness/placeholder rendering.

**Tech Stack:** Astro (latest stable, scaffolded via `npm create astro@latest`), plain CSS (scoped in `.astro` files), no UI framework, no CMS.

**Spec:** `docs/superpowers/specs/2026-07-01-gyulekezet-website-design.md`

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (scaffold default, overwritten in Task 3), `.gitignore`

- [ ] **Step 1: Scaffold with the Astro CLI**

Run from the project root (`/Users/abelbalog/Documents/Development/private/gyuli-site`):

```bash
npm create astro@latest . -- --template minimal --install --typescript strict --no-git --yes
```

Note: `--no-git` is used because the directory is already a git repo (initialized during brainstorming). `--yes` skips interactive prompts.

- [ ] **Step 2: Verify scaffold**

```bash
cat package.json
ls src/pages
```

Expected: `package.json` has an `astro` dependency; `src/pages/index.astro` exists (default placeholder content — will be replaced in Task 3).

- [ ] **Step 3: Confirm build works out of the box**

```bash
npm run build
```

Expected: exits 0, creates `dist/index.html`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Placeholder component

**Files:**
- Create: `src/components/Placeholder.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  caption: string;
  ratio?: "16:9" | "4:3";
  alt: string;
}

const { caption, ratio = "4:3", alt } = Astro.props;
const [w, h] = ratio === "16:9" ? [16, 9] : [4, 3];
const viewBoxHeight = (100 * h) / w;
---

<div class="placeholder" style={`aspect-ratio: ${w} / ${h};`} role="img" aria-label={alt}>
  <svg viewBox={`0 0 100 ${viewBoxHeight}`} preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height={viewBoxHeight} fill="#dfe6e0" />
    <text
      x="50"
      y={viewBoxHeight / 2}
      dominant-baseline="middle"
      text-anchor="middle"
      font-size="4"
      fill="#5a6b60"
      font-family="system-ui, sans-serif"
    >
      {caption}
    </text>
  </svg>
</div>

<style>
  .placeholder {
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
  }
  .placeholder svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
```

- [ ] **Step 2: Verify it renders**

Temporarily add to `src/pages/index.astro` (will be overwritten in Task 3 anyway):

```astro
---
import Placeholder from "../components/Placeholder.astro";
---
<Placeholder caption="Teszt" ratio="16:9" alt="Teszt kép" />
```

Run:

```bash
npm run build && grep -o '<svg[^>]*>' dist/index.html | head -1
```

Expected: an `<svg` tag is present in the built output, confirming the component renders server-side.

- [ ] **Step 3: Commit**

```bash
git add src/components/Placeholder.astro
git commit -m "feat: add SVG placeholder component"
```

---

## Task 3: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write the layout**

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;

const navItems = [
  { href: "/", label: "Kezdőlap" },
  { href: "/bemutatkozas", label: "Bemutatkozás" },
  { href: "/royal-rangers", label: "Royal Rangers" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

const currentPath = Astro.url.pathname.replace(/\/$/, "") || "/";
---

<!doctype html>
<html lang="hu">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} · Gödöllői Agapé Gyülekezet</title>
  </head>
  <body>
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="brand">
          <span class="logo-placeholder" aria-hidden="true">✝</span>
          <span>Gödöllői Agapé Gyülekezet</span>
        </a>
        <input type="checkbox" id="nav-toggle" class="nav-toggle" />
        <label for="nav-toggle" class="nav-toggle-label" aria-label="Menü megnyitása">
          <span></span>
        </label>
        <nav class="main-nav">
          <ul>
            {navItems.map((item) => (
              <li>
                <a href={item.href} aria-current={currentPath === item.href ? "page" : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <p>Gödöllői Agapé Gyülekezet</p>
      <p>Gödöllő, Peres u. 54</p>
      <p>&copy; {new Date().getFullYear()} Gödöllői Agapé Gyülekezet</p>
    </footer>
  </body>
</html>

<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #2f3b35;
    background: #fbfaf7;
    line-height: 1.6;
  }
  .site-header {
    background: #ffffff;
    border-bottom: 1px solid #e5e0d8;
  }
  .header-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    text-decoration: none;
    color: #2f3b35;
    font-size: 1.1rem;
  }
  .logo-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #cfe0d5;
    color: #3a6b52;
  }
  .nav-toggle {
    display: none;
  }
  .nav-toggle-label {
    display: none;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    position: relative;
  }
  .nav-toggle-label span,
  .nav-toggle-label span::before,
  .nav-toggle-label span::after {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: #2f3b35;
  }
  .nav-toggle-label span {
    top: 50%;
  }
  .nav-toggle-label span::before {
    top: -8px;
  }
  .nav-toggle-label span::after {
    top: 8px;
  }
  .main-nav ul {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
  }
  .main-nav a {
    text-decoration: none;
    color: #2f3b35;
    font-weight: 500;
  }
  .main-nav a[aria-current="page"] {
    color: #3a6b52;
    border-bottom: 2px solid #3a6b52;
  }
  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }
  .site-footer {
    background: #2f3b35;
    color: #f0efe9;
    text-align: center;
    padding: 2rem 1.5rem;
    margin-top: 3rem;
  }
  .site-footer p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  @media (max-width: 640px) {
    .nav-toggle-label {
      display: block;
    }
    .main-nav {
      flex-basis: 100%;
      display: none;
    }
    .main-nav ul {
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1rem;
    }
    .nav-toggle:checked ~ .main-nav {
      display: block;
    }
  }
</style>
```

- [ ] **Step 2: Verify layout compiles**

```bash
npm run build
```

Expected: exits 0 (layout has no consumers yet besides scaffold `index.astro`, which is replaced next task — build should still succeed since layout isn't imported anywhere yet, this step just checks for syntax errors via `astro check` if available, otherwise skip to Task 4 where it's actually used).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add shared Base layout with header/nav/footer"
```

---

## Task 4: Kezdőlap (index.astro)

**Files:**
- Modify: `src/pages/index.astro` (overwrite scaffold content)

- [ ] **Step 1: Write the page**

```astro
---
import Base from "../layouts/Base.astro";
import Placeholder from "../components/Placeholder.astro";
---

<Base
  title="Kezdőlap"
  description="Gödöllői Agapé Gyülekezet — kicsi, befogadó keresztény közösség Gödöllőn."
>
  <section class="hero">
    <h1>Gödöllői Agapé Gyülekezet</h1>
    <p>
      A Biblia által bemutatott keresztény életmodellt szeretnénk élni és megosztani –
      szóban, példamutató életformával és gyakorlati segítséggel, Gödöllőn és környékén.
    </p>
    <p>
      Kicsi, befogadó közösség vagyunk, ahol minden korosztály otthon érezheti magát.
    </p>
  </section>

  <section class="service-time">
    <p><strong>Vasárnaponként 9:30-tól várunk szeretettel.</strong></p>
    <p>Cím: Gödöllő, Peres u. 54</p>
  </section>

  <section class="cards">
    <a class="card" href="/bemutatkozas">
      <h2>Ismerj meg minket</h2>
      <p>Tudj meg többet arról, kik vagyunk és mit hiszünk fontosnak.</p>
    </a>
    <a class="card" href="/royal-rangers">
      <h2>Gyermekeknek, fiataloknak</h2>
      <p>Royal Rangers Gödöllő — közösség az 5–17 éves korosztálynak.</p>
    </a>
    <a class="card" href="/kapcsolat">
      <h2>Gyere el, keress minket</h2>
      <p>Elérhetőségek és útvonal a gyülekezethez.</p>
    </a>
  </section>

  <section class="hero-image">
    <Placeholder caption="A közösség együtt" ratio="16:9" alt="A közösség együtt" />
  </section>
</Base>

<style>
  .hero {
    text-align: center;
    padding: 1rem 0 2rem;
  }
  .hero h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .service-time {
    background: #eef3ee;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .service-time p {
    margin: 0.25rem 0;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2.5rem;
  }
  .card {
    display: block;
    background: #ffffff;
    border: 1px solid #e5e0d8;
    border-radius: 12px;
    padding: 1.25rem;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.15s ease;
  }
  .card:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  }
  .card h2 {
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
    color: #3a6b52;
  }
  .card p {
    margin: 0;
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 2: Build and verify content**

```bash
npm run build
grep -q "Kicsi, befogadó közösség" dist/index.html && echo OK
grep -q 'href="/bemutatkozas"' dist/index.html && echo OK
```

Expected: both `OK` lines printed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build kezdőlap (home page)"
```

---

## Task 5: Bemutatkozás page

**Files:**
- Create: `src/pages/bemutatkozas.astro`

- [ ] **Step 1: Write the page**

```astro
---
import Base from "../layouts/Base.astro";
import Placeholder from "../components/Placeholder.astro";
---

<Base
  title="Bemutatkozás"
  description="Ismerd meg a Gödöllői Agapé Gyülekezetet: kik vagyunk, mi a célunk, hogyan szolgálunk."
>
  <h1>Bemutatkozás</h1>

  <section>
    <h2>Kik vagyunk</h2>
    <p>
      A Gödöllői Agapé Gyülekezet az 1980-as évek eleje óta működő, kicsi evangéliumi
      keresztény közösség. Alkalmainkon minden korosztály rendszeresen részt vesz, és jó
      kapcsolatot ápolunk Gödöllő és a térség más keresztény gyülekezeteivel.
    </p>
  </section>

  <section>
    <h2>Célunk</h2>
    <p>
      A Biblia által bemutatott keresztény életmodell, mint életcél és gyakorlati életforma
      bemutatása az Egyesületben és a környezetünkben élők felé.
    </p>
  </section>

  <section>
    <h2>Az evangélium hirdetése</h2>
    <p>
      Az evangélium hirdetése szóban, példamutató életforma által és gyakorlati
      segítségnyújtással.
    </p>
  </section>

  <section>
    <h2>Szolgálat embertársaink felé</h2>
    <p>
      Szolgálni embertársaink felé, családok és egyedülállók felé, segíteni őket abban, hogy
      testi, lelki, anyagi és szociális területeken egyaránt kibontakozhassanak,
      felemelkedhessenek.
    </p>
  </section>

  <section>
    <h2>Gyermekek és fiatalok</h2>
    <p>
      Kiemelt célunk a 7–17 éves gyermekek és fiatalok felé való szolgálat. Az életkori
      sajátosságokat figyelembe véve az evangélium egyedi módon való hirdetése és a
      felekezetközi keresztény kultúra, életmód és erkölcsi értékek tanítása, közvetítése,
      terjesztése és erősítése részükre.
    </p>
    <p>
      Ezt a gyermek- és ifjúsági szolgálatot a Royal Rangers Gödöllő program keretében
      végezzük. <a href="/royal-rangers">Tudj meg többet a Royal Rangers Gödöllőről →</a>
    </p>
  </section>

  <Placeholder caption="Közösségi alkalom / segítségnyújtás" ratio="4:3" alt="Közösségi alkalom / segítségnyújtás" />
</Base>

<style>
  h1 {
    margin-bottom: 1.5rem;
  }
  section {
    margin-bottom: 2rem;
  }
  section h2 {
    color: #3a6b52;
    font-size: 1.25rem;
  }
</style>
```

Note: the 7–17 age range here is intentional per spec and must NOT be changed to match the 5–17 range on the Royal Rangers page.

- [ ] **Step 2: Build and verify content**

```bash
npm run build
grep -q "7–17 éves gyermekek" dist/bemutatkozas/index.html && echo OK
grep -q 'href="/royal-rangers"' dist/bemutatkozas/index.html && echo OK
```

Expected: both `OK` lines printed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/bemutatkozas.astro
git commit -m "feat: build bemutatkozás page"
```

---

## Task 6: Royal Rangers page

**Files:**
- Create: `src/pages/royal-rangers.astro`

- [ ] **Step 1: Write the page**

```astro
---
import Base from "../layouts/Base.astro";
import Placeholder from "../components/Placeholder.astro";
---

<Base
  title="Royal Rangers Gödöllő"
  description="Royal Rangers Gödöllő — gyermek- és ifjúsági program 5–17 éveseknek."
>
  <h1>Royal Rangers Gödöllő</h1>

  <section>
    <p>
      A „Royal Rangers Gödöllő" a gyülekezetünk keretében működő gyermek- és ifjúsági
      program az 5–17 éves korosztály számára. A cserkészet módszerét alkalmazva, az
      országos Royal Rangers Keresztény Vándorok Ifjúsági Egyesülettel együttműködve
      végezzük ezt a tevékenységet. Gödöllőn az 5-ös számú törzsként működünk.
    </p>
  </section>

  <section>
    <h2>Mit adunk?</h2>
    <p>
      Mottónk: „Légy készen!" A rangerek rendszeresen, korosztályuknak megfelelő kisebb
      csoportokban találkoznak. A hangsúlyt a természet szeretetére, a cselekvés általi
      tanulásra és a közösség erejére helyezzük, mindezt a Biblia erkölcsi alapelveire
      építve. Év közben táborokat is szervezünk.
    </p>
  </section>

  <section>
    <h2>Korosztályok</h2>
    <p>5–17 éves korig, korosztályos csoportokban.</p>
  </section>

  <section>
    <h2>Szülőknek</h2>
    <p>
      Érdeklődő szülőket szeretettel várunk. Kérdéseivel keressen minket a
      <a href="/kapcsolat">Kapcsolat</a> oldalon.
    </p>
  </section>

  <Placeholder caption="Szabadtéri, csapatos kép gyerekekkel/fiatalokkal" ratio="4:3" alt="Szabadtéri, csapatos kép gyerekekkel és fiatalokkal" />
</Base>

<style>
  h1 {
    margin-bottom: 1.5rem;
  }
  section {
    margin-bottom: 2rem;
  }
  section h2 {
    color: #3a6b52;
    font-size: 1.25rem;
  }
</style>
```

Note: the 5–17 age range here is intentional per spec and must NOT be changed to match the 7–17 range on the bemutatkozás page. Do not invent age-subgroup names (e.g. "Felfedezők") — keep the general "korosztályos csoportokban" phrasing.

- [ ] **Step 2: Build and verify content**

```bash
npm run build
grep -q "5–17 éves korosztály" dist/royal-rangers/index.html && echo OK
grep -q 'href="/kapcsolat"' dist/royal-rangers/index.html && echo OK
```

Expected: both `OK` lines printed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/royal-rangers.astro
git commit -m "feat: build royal rangers page"
```

---

## Task 7: Kapcsolat page

**Files:**
- Create: `src/pages/kapcsolat.astro`

- [ ] **Step 1: Write the page**

```astro
---
import Base from "../layouts/Base.astro";
import Placeholder from "../components/Placeholder.astro";

// TODO: replace with the real church email before going live.
const CONTACT_EMAIL = "info@example.hu";
// TODO: replace with the real church phone number before going live.
const CONTACT_PHONE = "+36 XX XXX XXXX";
---

<Base
  title="Kapcsolat"
  description="Elérhetőségek és útvonal a Gödöllői Agapé Gyülekezethez."
>
  <h1>Kapcsolat</h1>

  <section class="contact-info">
    <h2>Gödöllői Agapé Gyülekezet</h2>
    <p>Cím: Gödöllő, Peres u. 54</p>
    <p>E-mail: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    <p>Telefon: <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>{CONTACT_PHONE}</a></p>
    <p>Vasárnapi alkalom: 9:30-tól</p>
  </section>

  <section class="map">
    <iframe
      title="Térkép: Gödöllő, Peres u. 54"
      src="https://www.openstreetmap.org/export/embed.html?bbox=19.3480%2C47.5960%2C19.3620%2C47.6040&layer=mapnik&marker=47.6000%2C19.3550"
      style="border: 0;"
      loading="lazy"
    ></iframe>
    <p class="map-note">
      <a href="https://www.openstreetmap.org/?mlat=47.6000&mlon=19.3550#map=16/47.6000/19.3550" target="_blank" rel="noopener noreferrer">
        Nagyobb térkép megtekintése
      </a>
    </p>
  </section>

  <Placeholder caption="A gyülekezet épülete" ratio="4:3" alt="A gyülekezet épülete" />
</Base>

<style>
  h1 {
    margin-bottom: 1.5rem;
  }
  .contact-info {
    margin-bottom: 2rem;
  }
  .contact-info p {
    margin: 0.4rem 0;
  }
  .map {
    margin-bottom: 2rem;
  }
  .map iframe {
    width: 100%;
    height: 320px;
    border-radius: 8px;
  }
  .map-note {
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
</style>
```

Note: `bbox`/`marker` coordinates above are an approximate placeholder centered on Gödöllő town center — good enough for POC. Mark clearly for a future accuracy pass is unnecessary; the TODO comments on email/phone are the required placeholders per spec.

- [ ] **Step 2: Build and verify content**

```bash
npm run build
grep -q "TODO" src/pages/kapcsolat.astro && echo "TODO markers present"
grep -q "openstreetmap.org/export/embed" dist/kapcsolat/index.html && echo OK
grep -qv "google.com/maps" dist/kapcsolat/index.html && echo "no google maps"
```

Expected: `TODO markers present`, `OK`, `no google maps` all printed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/kapcsolat.astro
git commit -m "feat: build kapcsolat page with OSM embed and TODO contact placeholders"
```

---

## Task 8: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Write the page**

```astro
---
import Base from "../layouts/Base.astro";
---

<Base title="Az oldal nem található" description="A keresett oldal nem található.">
  <section class="not-found">
    <h1>Az oldal nem található</h1>
    <p>A keresett oldal nem létezik vagy elköltözött.</p>
    <p><a href="/">Vissza a kezdőlapra</a></p>
  </section>
</Base>

<style>
  .not-found {
    text-align: center;
    padding: 3rem 0;
  }
</style>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
test -f dist/404.html && echo OK
```

Expected: `OK` printed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page"
```

---

## Task 9: Azure Static Web Apps config

**Files:**
- Create: `staticwebapp.config.json`

- [ ] **Step 1: Write the config**

```json
{
  "navigationFallback": {
    "rewrite": "/404.html",
    "exclude": ["/images/*.{png,jpg,gif,svg}", "/css/*"]
  }
}
```

- [ ] **Step 2: Verify it's valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('staticwebapp.config.json', 'utf8')); console.log('valid JSON')"
```

Expected: `valid JSON` printed.

- [ ] **Step 3: Commit**

```bash
git add staticwebapp.config.json
git commit -m "chore: add Azure Static Web Apps config"
```

---

## Task 10: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write the README**

```markdown
# Gödöllői Agapé Gyülekezet — weboldal (POC)

Statikus, Astro-alapú bemutatkozó weboldal. Nincs backend, nincs CMS, nincs
adatbázis — a `dist/` mappába épített statikus fájlokat szolgáljuk ki.

## Fejlesztés

\`\`\`bash
npm install
npm run dev
\`\`\`

A dev szerver alapértelmezetten a `http://localhost:4321` címen fut.

## Build

\`\`\`bash
npm run build
\`\`\`

A kimenet a `dist/` mappába kerül.

## Telepítés Azure Static Web Apps-re

1. Hozz létre egy Azure Static Web App erőforrást az Azure Portálon, és kapcsold
   össze a GitHub repóval. Az Azure automatikusan létrehoz egy GitHub Actions
   workflow fájlt (`.github/workflows/azure-static-web-apps-<random>.yml`).
2. A workflow generálásakor add meg:
   - **App location:** `/`
   - **Output location:** `dist`
   - **Api location:** hagyd üresen (nincs API/backend).
3. A `staticwebapp.config.json` a repó gyökerében található, az Azure automatikusan
   felismeri (404 fallback, `index.html` alapértelmezett dokumentum).
4. Minden `main` branch-re történő push automatikusan újra deployolja az oldalt.

## Placeholder tartalmak

- A `src/pages/kapcsolat.astro` fájlban az e-mail cím és telefonszám placeholder,
  `TODO` kommenttel jelölve — valós adatokra kell cserélni éles indulás előtt.
- Minden kép helyén `src/components/Placeholder.astro` SVG-t renderel; valós fotók
  becsatolásakor ez cserélhető `<img>`-re.
```

- [ ] **Step 2: Verify formatting renders**

```bash
cat README.md | head -5
```

Expected: title line `# Gödöllői Agapé Gyülekezet — weboldal (POC)` visible.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with dev/build/Azure SWA deploy instructions"
```

---

## Task 11: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full build**

```bash
npm run build
ls dist
```

Expected: `index.html`, `bemutatkozas/`, `royal-rangers/`, `kapcsolat/`, `404.html` all present.

- [ ] **Step 2: Confirm the intentional age-range discrepancy survived**

```bash
grep -o "7–17 éves gyermekek" dist/bemutatkozas/index.html
grep -o "5–17 éves korosztály" dist/royal-rangers/index.html
```

Expected: both greps print a match (i.e., neither was "fixed" to match the other).

- [ ] **Step 3: Manual browser check**

Start the dev server with the preview tool and check, on both desktop and mobile viewport sizes:
- Nav links work from every page (Kezdőlap / Bemutatkozás / Royal Rangers / Kapcsolat).
- The 3 home-page cards link to the correct pages.
- Placeholder SVGs render with correct aspect ratio and visible caption text on all 4 content pages.
- The OSM iframe loads on the Kapcsolat page.
- Mobile nav toggle (checkbox-based menu) opens/closes correctly at a narrow viewport width.

- [ ] **Step 4: Commit any fixes found during manual check**

If the manual check finds issues, fix them in the relevant page/component file and commit:

```bash
git add -A
git commit -m "fix: <describe what manual check caught>"
```

If no issues found, skip this commit — nothing to do.
