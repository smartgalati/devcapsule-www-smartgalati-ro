# claude-rocada-site — ACS Smart Galați, candidate "Rocada" (smartgalati-test4)

Independent static website candidate for **ACS Smart Galați**, commissioned by the
[test4 work order](../engineering-docs/work-orders/2026-09-27-smartgalati-test4-prototype.md).
Published at **https://webtest.smartgalati.ro/** through GitHub Pages. The design ("Rocada" — castling:
safety first, then development) is navy ink and amber on warm paper, with a Fraunces
display face and the Atkinson Hyperlegible body face, six selectable palettes, and
content taken only from the club's own website.

## Quick start

```bash
cd claude-rocada-site
npm ci                  # Node 22 (see .nvmrc / package.json engines)
npm run dev             # http://localhost:4325 with hot reload (forward port 4325 in the IDE)
npm run build           # astro check + static build into dist/
npm run preview         # serves dist/ on http://localhost:4326
```

Checks (all run without cloud credentials):

```bash
npm test                # archive boundary unit tests (node:test)
npm run test:contrast   # WCAG token contrast for every palette
npm run test:browser    # Playwright: routes, links, menus, contact reveal, gallery, Lichess, widths, axe
npm run test:themes     # Playwright: six palettes × pages, persistence, blocked storage, cross-tab
```

The browser suites expect a running site (`npm run preview`, or `SITE_URL=https://…`).
Playwright's Chromium is installed with `npx playwright install chromium` when missing.

## What is where

| Path | Purpose |
|---|---|
| `content/` | All editable Markdown; see the Romanian [authoring guide](content/README.md) |
| `src/config/site.ts` | Enrollment URL (fixed: `https://forms.gle/smartgalati-inscriere`), encoded contact details, Lichess game, archive window |
| `src/i18n/` | UI strings (`ro.ts`) and the locale scaffold; Romanian is the only delivered locale |
| `src/content.config.ts` | Collection schemas (validated at build) |
| `src/lib/archive.mjs` | Rolling two-year archive boundary and news URL routing |
| `src/lib/palettes.ts` | Palette registry (ids, labels, upstream credits) |
| `src/styles/tokens.css` | Typography, spacing and layout tokens |
| `src/styles/themes.css` | Semantic color tokens for the six palettes |
| `src/styles/global.css` | Base styles, layout primitives, buttons, cards |
| `src/components/` | Header (hover-safe/keyboard dropdown, mobile menu), palette switcher, contact reveal, gallery lightbox, Lichess embed, cards |
| `src/pages/` | Routes: `/`, `/despre-noi/`, `/antrenori/`, `/echipe/`, `/sportivi/`, `/performante/`, `/inscrieri/`, `/sustine/`, `/contact/`, `/noutati/`, `/noutati/[slug]/`, `/arhiva/`, `/arhiva/[year]/`, `/arhiva/[year]/[slug]/`, `/galerie/`, `/galerie/[album]/`, `/sah-online/`, `404` |
| `public/licenses/palettes.txt` | Upstream palette and font license notices (served at `/licenses/palettes.txt`) |
| `scripts/pages.sh` | GitHub Pages build (`pages:build`) and base-path check (`pages:check`) |
| `src/lib/url.ts` | `withBase()` / `stripBase()`: every internal link honours Astro's `base` (GitHub Pages project path) |
| `tests/` | Unit, contrast and browser suites |

## Content model

Markdown files with validated frontmatter; templates named `_template.md` are ignored.

- `content/home/prima-pagina.md` — hero text, three pillars, support banner.
- `content/pages/*.md` — Despre noi, Echipe, Sportivi, Înscrieri, Susține, Contact (`/nume/`).
- `content/coaches/*.md` — six coach profiles, ordered by `order`, photos in `src/assets/coaches/`.
- `content/performances/*.md` — confirmed results with `year`, `result`, `order`, `source_url`.
- `content/galleries/*.md` — albums with local photos (`src/assets/photos/`) and/or an external `album_url`.
- `content/news/YYYY-MM-DD-slug.md` — 134 articles converted from the club's original site
  (2016–2025), each keeping `source_url`. The public slug drops the date prefix.

Images are optimized to responsive WebP at build time by Astro (`sharp`). Large
albums should live in an external public album (`album_url`) with one local cover.

## Archive behaviour

`src/lib/archive.mjs` computes a cutoff exactly `site.archiveYears` (2) years before
the build date on the UTC calendar (29 February clamps to 28 February). Articles
dated strictly before the cutoff render at `/arhiva/<year>/<slug>/`, listed on
`/arhiva/` and `/arhiva/<year>/`; the rest render at `/noutati/<slug>/`. An article
exactly two years old stays current. Because the site is static, the boundary
advances only when the site is rebuilt and republished; all internal links are
generated from the same function, and when an article moves into the archive its
old `/noutati/<slug>/` address becomes a small page that refreshes to the archive
URL, so bookmarks and external links keep working. `npm test` covers the boundary,
the leap-day clamp and time-of-day independence.

## Palettes

Six choices in the labelled "Paletă de culori" select (desktop top band and mobile
menu): **Rocada** (default), Solarized Light, Solarized Dark, Catppuccin Latte,
Nord and Catppuccin Mocha. Every component uses the semantic tokens in
`src/styles/themes.css`; to adjust a palette, edit that block. To add one: append a
`[data-palette='id']` block with the full token set, register it in
`src/lib/palettes.ts`, add its credit to `public/licenses/palettes.txt`, and run
`npm run test:contrast` (fails below 4.5:1 for text pairings or 3:1 for focus rings
and control borders) plus `npm run test:themes`.

The choice is stored in `localStorage` (`rocada-palette`), applied by a tiny inline
head script before first paint (no wrong-theme flash), and synchronized across
open tabs. If storage is blocked the switch still works for the current page.
Upstream schemes were adapted where needed to reach web contrast targets; credits:
Solarized (Ethan Schoonover, MIT), Nord (Sven Greb, MIT), Catppuccin (MIT).

## Typography and readability

`src/styles/tokens.css` defines the scale: 17px body, nothing below 14px, bold
semibold labels for band/meta text, fluid headings. Fraunces (SIL OFL) and Atkinson
Hyperlegible (SIL OFL) are bundled locally through `@fontsource` — no third-party
font requests.

## Contact protection

The phone and e-mail are stored reversed in `src/config/site.ts` and never appear
in plain form in the HTML; a keyboard-accessible button reveals each one and
creates a `tel:`/`mailto:` link. This defeats scrapers that grep static HTML for
patterns; a scraper that executes JavaScript, or reverses strings, can still read
them. Historical articles that contained phone numbers, e-mail addresses or a bank
account were redacted during conversion ("vezi pagina Contact").

## Lichess

`/sah-online/` embeds one public Lichess game (`site.lichess.gameId`) in an iframe
with a direct link fallback. Articles may add `lichess_url` / `album_url`. The site
builds and works with lichess.org unreachable; the iframe's own contents are
third-party and outside this site's styling and accessibility control.

## i18n

Romanian is the default and only locale (`astro.config.mjs` → `i18n.defaultLocale`).
`src/i18n/index.ts` documents how to add English: copy `ro.ts`, register the
locale, add localized content and pages under `src/pages/en/`.

## Continuous integration

`.github/workflows/claude-rocada-site.yml` installs, tests, builds and runs the
browser suites on every change. A second workflow publishes to GitHub Pages
(see below). The Google Cloud Storage and Firebase deployment scripts this
candidate was first previewed with were removed on 2026-11-20; GitHub Pages
is the hosting path.

## Known limitations

- Enrollment link `https://forms.gle/smartgalati-inscriere` is fixed by the owner and currently does not open a form.
- No visual CMS; edit Markdown in the IDE or on GitHub.
- Article photos beyond the 2024–2025 covers are not copied locally; each article links to the original post (`source_url`) where its photos remain.
- The Lichess iframe is third-party content; its internal contrast/labels cannot be fixed here.
- Facts to confirm with the club before production are listed in the [content guide](content/README.md#de-verificat-cu-clubul).

## GitHub Pages deployment

`.github/workflows/claude-rocada-pages.yml` builds this site for the repository's
Pages address (`https://<owner>.github.io/<repository>/`, or a custom domain set in
the Pages settings) and publishes it on every `main` change under this directory.
`npm run pages:build` and `npm run pages:check` reproduce the build and the browser
suites under that base path locally. Internal links in components go through
`withBase()` (`src/lib/url.ts`), Markdown links are prefixed by a rehype plugin in
`astro.config.mjs`, and the browser suite fails on any link without the prefix. Setup,
eligibility and limits: [GitHub Pages deployment guide](../docs/github-pages-deployment.md).
