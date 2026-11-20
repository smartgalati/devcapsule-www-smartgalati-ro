# Deploy Rocada/test4 to GitHub Pages

`.github/workflows/claude-rocada-pages.yml` builds `claude-rocada-site` and
publishes it to this repository's GitHub Pages site, the only hosting path
kept. The Pages build only differs from the plain root-path build by the
address compiled into it. (The Google Cloud Storage and Firebase scripts that
served the earlier previews were removed on 2026-11-20.)

Address: **`https://ccozianu.github.io/devcapsule-chessclub-website/`** for the
repository as it is named today. The owner and repository name are read at
build time, so a rename or a fork changes the address without a code change.

## One-time owner setup

1. **Eligibility.** GitHub Pages serves public repositories on GitHub Free and
   private repositories only on a paid plan (Pro, Team, Enterprise). This
   repository is private. Either keep it private on an eligible plan or review
   its contents before making it public; the
   [hosting research](../engineering-docs/design-notes/hosting/2026-09-30-static-hosting-costs-and-alternatives.md#github-pages)
   advises against going public merely for free hosting. Pages also excludes
   sites that mainly run a commercial business; the club's informational site
   is expected to fit, but that is a policy reading, not a guarantee.
2. **Switch Pages on.** Repository *Settings → Pages → Build and deployment →
   Source*: choose **GitHub Actions**. No branch is involved; the workflow
   uploads the built `dist/` as a Pages artifact. This step needs repository
   admin rights and cannot be done by the workflow itself with the default
   `GITHUB_TOKEN`, so until it is done every run stops at the
   "Read the Pages address" step with a message saying Pages is not enabled.
3. **Run it.** Push a change under `claude-rocada-site/` to `main`, or open
   *Actions → "Rocada site (GitHub Pages)" → Run workflow*. The `deploy` job's
   environment shows the published URL when it finishes.

## What the workflow does

- `actions/configure-pages` reads the site's address from the Pages settings
  and exposes it as an origin (`https://ccozianu.github.io`) and a base path
  (`/devcapsule-chessclub-website`). With a custom domain configured in the
  Pages settings the origin becomes that domain and the base path is empty.
- `npm run pages:build` passes both to Astro as `site` and `base`
  (`ROCADA_SITE`, `ROCADA_BASE` in `astro.config.mjs`). Canonical and
  Open Graph URLs, optimized images, CSS and every internal link then carry
  the Pages address. The build runs `astro check` first, as always.
- `npm run pages:check` serves `dist/` with `astro preview` under the same
  base path and runs the browser suite (routes, every internal link, redirect
  stubs, 404, menus, contact reveal, gallery, Lichess fallback, widths, axe)
  and the palette suite before anything is uploaded.
- `actions/upload-pages-artifact` + `actions/deploy-pages` publish the tree.
  Concurrency is one deployment at a time without cancelling a running one.

The existing CI workflow (`claude-rocada-site.yml`) still builds and tests the
root-path version on every change.

## How the site stays base-path aware

Astro prefixes what it generates (`Astro.url`, `astro:assets` images, bundled
CSS and scripts) but not hand-written `href` values. The site therefore routes
every internal link through `withBase()` from `src/lib/url.ts`, and the header
compares `stripBase(Astro.url.pathname)` with its root-relative route table.
Links written in Markdown bodies (`[arhiva](/arhiva/)` in `content/`) are
prefixed at render time by a small rehype plugin in `astro.config.mjs`.
Authoring rule: write internal paths root-relative (`/noutati/`) everywhere;
components wrap them in `withBase()`, Markdown and frontmatter values such as
the home page pillars are prefixed by the plugin or the page that renders them.
`robots.txt` is generated from the base path (`src/pages/robots.txt.ts`); the
static copy that named the GCS sitemap, which does not exist, was removed.
`tests/url.test.mjs` covers the helpers; the browser suite fails if any
internal link lacks the prefix (this is how the Markdown links were caught).
The suite also ignores errors thrown by Lichess's own embed script inside the
iframe, which started failing the chess page in November 2026 independently of
this work; the site's own code throws nothing.

## Local verification

```bash
cd claude-rocada-site
npm ci
npm run pages:build                      # dist/ for https://<owner>.github.io/<repo>/ from the origin remote
npm run pages:check [screenshot-dir]     # preview on 127.0.0.1:4336 + browser and palette suites under the base path
PAGES_SITE_URL=https://smartgalati-pages.mycodespace.ai PAGES_BASE_PATH= npm run pages:build   # custom-domain build
```

`npm run build` and `npm run preview` remain the plain root-path build.
Playwright's Chromium is installed with `npx playwright install chromium` when
missing. `scripts/pages.sh` derives the address from the `origin` remote when
`PAGES_SITE_URL` is unset and refuses to guess for a non-GitHub remote.

## Custom domain (optional)

In *Settings → Pages → Custom domain* enter e.g.
`smartgalati-pages.mycodespace.ai`, and add a DNS `CNAME` record for that name
pointing at `ccozianu.github.io` in the `mycodespace.ai` zone (Cloud DNS
project `central-trees-497510-h7`, zone `mycodespace`). GitHub verifies the
record, provisions HTTPS, and `configure-pages` then reports the domain as the
origin with an empty base path on the next run, so the site rebuilds at the
root automatically. No `CNAME` file is needed when publishing from Actions.

## Limits and behaviour to know

- Published site at most 1 GB; soft bandwidth limit 100 GB/month; a
  deployment times out after 10 minutes. The Rocada build is about 565 files.
- GitHub serves the root `404.html` for unknown paths, so the site's 404 page
  works; the archived-article redirect stubs at old `/noutati/<slug>/`
  addresses are ordinary pages and keep working.
- GitHub Pages sets its own cache headers (roughly ten minutes); there is no
  per-path cache control or URL map, unlike the GCS deployment.
- A project site's `robots.txt` lives under the base path, where crawlers do
  not look; the account-level `ccozianu.github.io/robots.txt` would govern.
- Pages has no deploy-time hook into the two-year archive boundary: like the
  other hosts, the boundary advances only when the site is rebuilt. Pushing
  any change, or running the workflow manually, rebuilds it.
