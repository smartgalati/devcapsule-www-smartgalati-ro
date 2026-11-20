# Workstream Current Status: Maintenance

Name: `maintenance`

Start date: `2026-09-27`

State: active; permanent maintenance

Definition read: WORKFLOW.md@02914b52c231, WORKFLOW-LOCAL.md@23bcc833e641

Branch association: `ws-maintenance/`; no branch yet

## Goal

Own the defects that no open workstream covers, on `main` and on maintained
release lines, and drive maintenance releases, while this repository uses
multiple-streams mode.

## Queue

Read from `main`, not from this file: the bug records under
`engineering-docs/bugs/` whose `owner` is `maintenance` and whose `status` is
neither `closed` nor `retired`. See *Bug Intake* in `WORKFLOW.md`.

## Current State

Bugs resolved, verified, and integrated into `main`:
1. `engineering-docs/bugs/website/2026-09-27-missing-photo-gallery.md`:
   - Restored `/galerie-foto` with 51 photos across 3 albums and bundled local assets.
2. `engineering-docs/bugs/website/2026-09-27-flaky-dropdown-menu.md`:
   - Eliminated cursor transit gap with invisible hover bridge.
   - Added click-to-pin persistent open mode with outside click and Escape key dismissal.
   - Verified cleanly with `npm run build` (19 pages, 0 errors, 0 warnings).
3. `engineering-docs/bugs/website/2026-11-20-pages-check-fails-on-lichess-403.md` (2026-11-20):
   - The Pages workflow in `Luciangl/devcapsule-chessclub-website` failed
     because lichess.org answers the embedded board with a Cloudflare
     challenge (403), which `claude-rocada-site/tests/browser.mjs` counted as
     the site's own console error.
   - Fix: the browser suite forgives console errors caused by refused
     lichess.org responses. Gate in `claude-rocada-site/`: 10/10 unit tests,
     contrast passes, build 291 pages, `pages:check` with
     `PAGES_SITE_URL=http://webtest.smartgalati.ro PAGES_BASE_PATH=` passes
     (browser and palette suites).
   - Status `fixed`; close after a green Pages run in Lucian's repository.
- The club's repository is now `Luciangl/devcapsule-chessclub-website` (a
  fork of this one), published at https://webtest.smartgalati.ro/. Its `main`
  carries three coach-profile deletions this repository does not have.

## Planned Next Step

Triage any bug whose `severity` is `untriaged`, then take the highest-severity open bug on the current release line.

## Open Threads

- None.
