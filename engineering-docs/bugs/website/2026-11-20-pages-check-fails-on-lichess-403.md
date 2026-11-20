---
status: fixed
severity: blocking
target: none
owner: maintenance
opened: 2026-11-20
requirements: []
---

# Bug: Pages publish fails because the Lichess embed answers 403

## Symptom

The *Rocada site (GitHub Pages)* workflow fails in the step *Browser, palette
and accessibility checks under the Pages base path*, so nothing is published.
First seen in `Luciangl/devcapsule-chessclub-website`, run 44495945259
(2026-11-19, `workflow_dispatch`, commit `ab91d3d`). The same code published
successfully on 2026-11-09.

## Reproduction

1. In `claude-rocada-site/`: `npm ci`
2. `PAGES_SITE_URL=http://webtest.smartgalati.ro PAGES_BASE_PATH= npm run pages:build`
3. `PAGES_SITE_URL=http://webtest.smartgalati.ro PAGES_BASE_PATH= npm run pages:check`

Expected: all browser and palette checks pass.

Actual: one failure, `no console/page errors`, listing for `/sah-online/`:
`Failed to load resource: the server responded with a status of 403 ()` and
`Refused to display 'https://lichess.org/' in a frame because it set
'X-Frame-Options' to 'sameorigin'.`

## Evidence

- Root cause: lichess.org now answers
  `https://lichess.org/embed/game/MPJcy1JW?theme=brown&bg=auto` with a
  Cloudflare challenge for automated clients: `HTTP 403`,
  `cf-mitigated: challenge`, `x-frame-options: SAMEORIGIN` (observed from the
  GitHub runner and from this capsule with `curl` and headless Chromium,
  2026-11-20). The site's code did not change between the passing and the
  failing run.
- `tests/browser.mjs` already ignored Lichess page errors and failed
  requests, but not console errors. Chromium reports a refused frame against
  the embedding page, from `chrome-error://chromewebdata/`, and the 403 line
  does not name lichess.org, so the test counted a third party's answer as
  the site's own error.
- The page is designed not to depend on the embed: the direct link under the
  board remains. Whether ordinary visitors' browsers are also challenged was
  not verified; it depends on Cloudflare's judgment of each visitor.

## Close Criteria

Done means: the Pages workflow publishes again in
`Luciangl/devcapsule-chessclub-website` with the Lichess embed refused.

Verification: `npm run pages:check` passes locally with the custom-domain
settings while lichess.org answers 403 (done 2026-11-20: all browser and
palette checks pass); then a green run of the Pages workflow.

Reopen if: the check fails again on a console error caused by lichess.org.
