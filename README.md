# Tailwind Color Theme Generator

Pick a brand color. Get a full palette — brand, CTA, info, warning, success, danger, grays, plus lighter/darker steps for each.

Built with Vue 2, [chroma-js](https://gka.github.io/chroma.js/), and Tailwind v1. No backend. It all runs in the browser.

## Run it locally

From the repo root:

```bash
npm install
npm run dev
```

That compiles `src/` into `dist/` and copies `index.html` to the project root.

Open `index.html` in a browser.

For rebuilds while you edit:

```bash
npm run watch
```

Production build:

```bash
npm run prod
```

## How to use it

1. Set a **brand color** (hex, rgb, hsl, named CSS colors — whatever chroma-js accepts).
2. Tweak **theme influence** and **grays mix** if you want.
3. Pick a **CTA harmony** (monochromatic, analogous, triadic, etc.). That drives the CTA color off the brand.
4. Hit **Randomize** if you don't care and want to roll the dice.
5. Copy output from the **Tailwind / SASS / SCSS** tabs.

Dark/light mode and your last tab/harmony choice stick around in `localStorage`.

Status colors (info, warning, success, danger) stay in normal UI hue ranges. They don't go full neon just because your brand is loud. Theme influence only nudges them a bit.

## Output format

Each theme color exports five steps:

- `-lighter` / `-light` (tints)
- base
- `-dark` / `-darker` (shades)

Grays get a subtle brand tint based on **Grays mix**.

Tabs share the same shift values. At least they should — if SASS/SCSS looks wrong in root `src/`, that's a known bug there (hardcoded tint values in the template). Step-14 fixes that.

## Stack notes

- **Tailwind 1.1** — no `rounded-2xl`, `gap-*`, etc. Custom bits live in `app.css` where needed.
- **Font Awesome 5.11** from CDN — not FA6 icon names.
- **PurgeCSS** scans `src/` — if you add classes in HTML, they need to exist in source files PurgeCSS reads.

## Contributing

Originally forked from [@adevade](https://twitter.com/adevade).
