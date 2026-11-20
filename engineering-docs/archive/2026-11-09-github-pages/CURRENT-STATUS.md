# GitHub Pages Deployment for Rocada — Delivery Record

Started and concluded: 2026-11-09. Outcome: delivered. Delivery: direct-main
under the prototype-phase exception in WORKFLOW-LOCAL.md; branch
`ws-github-pages/deployment` rebased onto `main`, fast-forwarded and pushed
normally. The implementation commit precedes this finishing commit.

Owner request (chat, 2026-11-09): a version of the claude-rocada-site deployment
that publishes to GitHub Pages beside the Google Cloud Storage script.

## Result

- [Operator guide](../../../docs/github-pages-deployment.md): eligibility,
  one-time enablement (Settings → Pages → Source: GitHub Actions), triggers,
  custom domain, limits, local verification.
- [Workflow](../../../.github/workflows/claude-rocada-pages.yml): on `main`
  pushes under `claude-rocada-site/` and on manual dispatch; reads the Pages
  address with `actions/configure-pages`, builds with that origin and base
  path, runs unit, contrast, browser and palette suites under the base path,
  uploads `dist/` and deploys with `actions/deploy-pages`.
- Site made base-path aware: `src/lib/url.ts` (`withBase`, `stripBase`)
  for component links, a rehype plugin in `astro.config.mjs` for Markdown
  links, generated `robots.txt`, env-driven `site`/`base`
  (`ROCADA_SITE`, `ROCADA_BASE`). Root-path builds are byte-for-byte the
  same routes as before; GCS and Firebase paths unchanged.
- `scripts/pages.sh` → `npm run pages:build` / `npm run pages:check`
  (preview on 127.0.0.1:4336 under the base path, then both browser suites).
- [R-SITE-007 amendment](../../../REQUIREMENTS.md) records the third hosting path.

## Evidence (local, 2026-11-09)

Node 22.23.1, Astro 5.18.2. Unit tests 10/10 (archive boundary + new
`tests/url.test.mjs`); token contrast all palettes pass; `astro check`
0 errors/warnings/hints. Pages build (`https://ccozianu.github.io` +
`/devcapsule-chessclub-website`): 288 pages, 569 files; canonical
`https://ccozianu.github.io/devcapsule-chessclub-website/despre-noi/`, brand,
favicon, redirect-stub target, Markdown links and `robots.txt` all carry the
prefix; browser suite (routes, 190 internal link targets, redirect stub, 404,
menus, contact reveal, gallery, Lichess fallback, widths, axe) and palette
suite pass under the base path. Root-path build: browser (186 targets) and
palette suites pass as before.

Findings fixed on the way: the base-path check caught five root-relative links
inside Markdown page bodies (rehype plugin added); the chess page reported a
`pageerror` thrown by lichess.org's own embed script inside the iframe (also
failing the pre-existing root-path suite); the suite now ignores errors whose
stack is on lichess.org, consistent with its existing Lichess exclusions.

## Not Verified / Residual

- No live Pages deployment: the repository is private, Pages needs an eligible
  plan, and enabling it needs repository admin rights the agent lacks (no `gh`,
  no token). Until the owner enables Pages the workflow stops at
  "Read the Pages address" on every `main` push touching the site.
- GitHub Actions results were not observed from this environment.
- Custom domain path is documented, not exercised.

## Workflow / Residual State

Intake and mail empty; no owned bugs. Definition unchanged during the
workstream. Stale `astro preview` processes left by earlier sessions on ports
4326–4331 were stopped during validation; `pages:check` now uses its own port
and refuses a busy one.
