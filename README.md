# Gödöllői Agapé Gyülekezet — weboldal (POC)

Statikus, Astro-alapú bemutatkozó weboldal. Nincs backend, nincs CMS, nincs
adatbázis — a `dist/` mappába épített statikus fájlokat szolgáljuk ki.

## Fejlesztés

```bash
npm install
npm run dev
```

A dev szerver alapértelmezetten a `http://localhost:4321` címen fut.

## Build

```bash
npm run build
```

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
