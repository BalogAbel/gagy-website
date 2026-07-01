import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const page = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const headingPattern = (heading) => new RegExp(`<h2>${escapeRegExp(heading)}</h2>`);

test("navigation uses the requested four labels", async () => {
  const layout = await page("src/layouts/Base.astro");

  assert.match(layout, /label: "Kezdőlap"/);
  assert.match(layout, /label: "Kik vagyunk\?"/);
  assert.match(layout, /label: "Royal Rangers"/);
  assert.match(layout, /label: "Kapcsolat"/);
  assert.doesNotMatch(layout, /label: "Bemutatkozás"/);
});

test("home page follows the requested short invitation structure", async () => {
  const home = await page("src/pages/index.astro");

  assert.match(home, /<section class="hero">/);
  assert.match(home, /<section class="service-time">/);
  assert.match(home, /<section class="cards">/);
  assert.match(home, /<section class="hero-image">/);
  assert.match(home, /A Biblia által bemutatott keresztény életmodellt/);
  assert.match(home, /Kicsi, befogadó közösség vagyunk/);
  assert.match(home, /Vasárnaponként 9:30-tól várunk szeretettel/);
  assert.match(home, /Ismerj meg minket/);
  assert.match(home, /Gyermekeknek, fiataloknak/);
  assert.match(home, /Gyere el, keress minket/);
  assert.match(home, /Royal Rangers/);
  assert.match(home, /href="\/bemutatkozas"/);
  assert.match(home, /href="\/kapcsolat"/);
  assert.doesNotMatch(home, /<section class="intro">/);
  assert.doesNotMatch(home, /<section class="highlight">/);
});

test("about page has the requested sections", async () => {
  const about = await page("src/pages/bemutatkozas.astro");

  [
    "Kik vagyunk?",
    "Honnan indultunk?",
    "Gyermekek, fiatalok és családok",
    "Az Agapé közösség részeként",
    "Gyülekezeti ház és mező",
  ].forEach((heading) => assert.match(about, headingPattern(heading)));

  assert.match(about, /1980-ban/);
  assert.match(about, /pünkösdi-karizmatikus ébredés során/);
  assert.match(about, /egy\s+házaspár\s+és\s+néhány\s+gödöllői\s+egyetemista/);
  assert.match(about, /1995-ben ismerkedtünk meg a Royal Rangers programmal/);
  assert.match(about, /1997-ben\s+megalakult\s+a\s+Gödöllői\s+5\.\s+számú\s+Royal\s+Rangers\s+törzs/);
  assert.match(about, /2000-ben gyülekezetünk csatlakozott az Agapé Gyülekezetek Közösségéhez/);
  assert.match(about, /2022-ben az Agapé Közösség megvásárolta a gyülekezeti házat körülölelő mezőt/);
  assert.doesNotMatch(about, /7–17/);
});

test("royal rangers page is the most detailed and uses the correct age range", async () => {
  const rr = await page("src/pages/royal-rangers.astro");

  [
    "Mi a Royal Rangers?",
    "Royal Rangers Gödöllő RR5",
    "Kiknek szól?",
    "Mit csinálunk?",
    "Mit szeretnénk átadni?",
    "Érdeklődés",
  ].forEach((heading) => assert.match(rr, headingPattern(heading)));

  assert.match(rr, /5–18 éves gyermekek és fiatalok számára/);
  assert.match(rr, /1962-ben indult az Amerikai Egyesült Államokban/);
  assert.match(rr, /Magyarországra 1994-ben érkezett/);
  assert.match(rr, /1997-ben\s+megalakult\s+a\s+Gödöllői\s+5\.\s+számú\s+Royal\s+Rangers\s+törzs/);
  assert.match(rr, /Gödöllő\s+Gyermekeiért,\s+Ifjúságáért\s+Díj/);
  assert.match(rr, /nagycsoportos óvodásoktól 17 éves korig/);
  assert.match(rr, /péntekenként\s+17:00\s+és\s+19:00\s+között/);
  assert.match(rr, /Próbakönyv/);
  assert.match(rr, /Légy készen! Készen minden időben!/);
  assert.match(rr, /Amit tehát szeretnétek[\s\S]*\(Máté 7:12\)/);
  assert.match(rr, /Isten segítségével a lehető legjobbat teljesítem/);
  assert.match(rr, /17:00–19:00/);
  assert.doesNotMatch(rr, /7–17/);
});

test("contact page includes first-visit expectations", async () => {
  const contact = await page("src/pages/kapcsolat.astro");

  assert.match(contact, /<h2>Mire számíthatok, ha először jövök\?<\/h2>/);
  assert.match(contact, /alkalmaink nyitottak/);
  assert.match(contact, /nem szükséges előzetesen jelentkezni/);
  assert.match(contact, /Vasárnap 9:30/);
  assert.match(contact, /https:\/\/www\.google\.com\/maps/);
  assert.match(contact, /G%C3%B6d%C3%B6ll%C5%91%2C%20Peres%20u\.%2054/);
  assert.doesNotMatch(contact, /openstreetmap/);
});
