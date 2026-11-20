# Workstream Archive Status: Claude Rocada Site

Name: `claude-rocada-site`
Start date: `2026-09-27`
Conclusion date: `2026-09-27`
State: concluded; direct-main integration
Branch association: `ws-claude-rocada-site/implementation`
Target branch: `main`
Delivery method: `direct-main`, under the owner-authorized prototype exception in `WORKFLOW-LOCAL.md` (rebase onto `main`, fast-forward, normal push).
Source delivery reference: the implementation commits on the branch (`779df60` site, `f2899c9` documentation) followed by the finishing commit that adds this archive and removes the open-work row; discoverable with `git log --diff-filter=A -- engineering-docs/archive/2026-09-27-claude-rocada-site/CURRENT-STATUS.md`.

## Outcome

Independent "Rocada" website in `claude-rocada-site/`, live at **https://smartgalati-test4.mycodespace.ai** on the shared `chessclub-test2` load balancer with its own bucket, backend, certificate, host rule and DNS record. 284 static pages: home, club pages, six coaches, twelve confirmed performances, three albums (51 photos) with an accessible lightbox, 134 real articles from the club's original site with a rolling two-year archive and redirect stubs, a Lichess demonstration, readable typography tokens and six persistent palettes (three light, three dark). Fixed enrollment URL retained. Test2 and test3 verified intact.

## Evidence

- [Implementation and deployment evidence](../../implementation-notes/website/2026-09-27-claude-rocada-site.md): local build/tests/contrast/browser/palette suites, hot reload, Lighthouse lab numbers, cloud resources, live HTTPS checks and continuity.
- [Candidate guide](../../../claude-rocada-site/README.md) and [authoring guide](../../../claude-rocada-site/content/README.md).

## Residual Review

Owner comparison and aesthetic choice pending. Facts to confirm with the club before production are listed in the authoring guide (published ratings/rosters are historical; schedule and fiscal data are not published). Enrollment form remains non-working by owner instruction. The Lichess iframe is third-party content. CDN edges may serve the first hour's asset headers with a one-hour lifetime. Optional CI deployment needs Workload Identity variables; local authenticated deployment is the supported path. No production cutover performed.

No pending intake or workstream-owned open bugs.
