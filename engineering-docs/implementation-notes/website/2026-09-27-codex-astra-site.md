# Independent Astra Website: Implementation and Delivery Evidence

Date: 2026-09-27
Requirements: R-SITE-001 through R-SITE-007

## Authorized Scope

Independent website in `codex-astra-site/`, preserving previous candidates, and deployment at `smartgalati-test3.mycodespace.ai` using the existing GCS scripts and test2 load balancer. The user explicitly retained the non-working enrollment URL for comparison. No production-domain cutover.

## Implementation

- Astro 5.18.2, static HTML, locally bundled variable fonts, custom responsive CSS and small browser scripts. No dependency on the other candidate's source/build.
- 20 static pages including the 404; 6 coaches, 7 news records, 3 performance records, 3 galleries with 51 local historical photos. New high-volume albums support external URLs. Photos optimized to responsive WebP.
- Romanian content and default locale; configurable future English locale. English translations are not represented as delivered.
- Markdown collections, schema validation, templates and Romanian authoring documentation; CMS remains optional as in the work-order overview.
- Date-only UTC rolling two-year archive cutoff. Exact cutoff stays current; leap-year clamp tested. Build-time routing generates year-specific archive URLs.
- Working Lichess game embed; browser confirmed `cg-board` renders and site content remains visible when Lichess requests are blocked.
- Contact details revealed on click, avoiding plaintext contact values in initial HTML. This deters naive scraping, not JavaScript-aware scraping.
- Existing editorial content reused; placeholder album/study URLs removed from this candidate. Club facts remain subject to owner verification before production.

## Validation

- `npm run build`: 20 pages, 0 errors, 0 warnings, 0 hints.
- `npm test`: 3 passing tests for boundary/date/URL behavior.
- `npm run dev -- --port 4323`: HTTP 200; IDE-accessible server.
- Production preview browser checks: all 19 content routes and 19 internal link targets; image loading, one main heading, Romanian language attribute.
- Viewports: 1440, 768, 390 and 320 pixels; no horizontal overflow on home; eight representative routes checked on mobile.
- Interactive checks: mobile menu open/Escape/navigation, contact reveal, news tag filtering, gallery album filtering, next-photo keyboard navigation, Escape and focus restoration.
- axe WCAG 2 A/AA + 2.1 AA scan: zero site-owned violations on home, courses, coaches, contact, gallery, news, archive and chess pages. A later pass after the third-party Lichess frame loaded identified contrast violations within its player labels/move list in both light and dark themes. These cross-origin styles cannot be repaired by the parent site; tests report third-party findings separately and retain the direct Lichess alternative link. This is automated evidence, not a claim of complete accessibility certification.
- Lichess iframe HTTP 200, board rendered in browser; blocked-iframe fallback checked.
- Custom 404 displays a recovery link. Screenshots available locally in `/tmp/astra-browser/`.

## Cloud Resources

- Bucket `gs://test3-smartgalati-mycodespace`, project `mycodespace3p`, region `europe-north1`.
- Shared IP `8.232.113.26`, URL map `chessclub-test2-url-map`, proxy `chessclub-test2-https-proxy`.
- Original default backend `chessclub-test2-backend` preserved. Original `chessclub-test2-cert` retained.
- Added backend `chessclub-test2-test3-smartgalati-mycodespace-backend`, host matcher `smartgalati-test3-mycodespace-ai-matcher`, certificate `chessclub-test2-smartgalati-test3-mycodespace-ai-cert`.
- DNS A `smartgalati-test3.mycodespace.ai` → `8.232.113.26`, zone `mycodespace`, project `central-trees-497510-h7`, TTL 300.
- Existing `scripts/gcs` scripts used unchanged. Candidate wrapper supplies explicit environment parameters; test2 configuration unchanged.
- Managed certificate became ACTIVE and verified HTTPS served HTTP 200 on 2026-09-27 at 17:10 UTC. Root and all 19 content routes passed the public-domain browser suite. Test2 still returns verified HTTPS 200. Missing routes return the custom HTML with HTTP 404; `/contact` redirects with HTTP 301 to `/contact/`.

## Automation and Remaining Review

CI builds/tests site changes and supports manually triggered deployment with existing Workload Identity repository variables. Identity/IAM provisioning is not performed automatically; local authenticated deployment is fully operational. Owner visual selection and production readiness remain a separate review.

## Reference Documentation

- [Astro content collections](https://docs.astro.build/en/reference/modules/astro-content/)
- [Lichess official embed interface](https://lichess.org/developers)
- [ANAF current Form 230 information](https://static.anaf.ro/static/10/Anaf/Declaratii_R/230.html) linked from the support page; no fabricated prefilled form or tax deadline.

## Final Hosted Checkpoint

- Preview: https://smartgalati-test3.mycodespace.ai
- Final upload completed with original GCS scripts; all build diagnostics remain zero.
- Public-domain Playwright suite passed: 19 routes, 19 internal targets, desktop/mobile screenshots, interactions and zero site-owned accessibility violations. Live screenshots: `/tmp/astra-live-browser/`.
- Local Lighthouse mobile simulation: performance 99, accessibility 100, best practices 100, SEO 100; FCP 1.7s, LCP 2.0s, total blocking time 0ms, CLS 0.003. These are lab results, not a guarantee of sub-second loading on arbitrary connections. Additional accessible-name advisory was corrected.
- Existing test2 certificate and default backend verified preserved; test2 HTTPS 200.
- Source branch `ws-codex-astra-site/implementation` pushed to origin. Draft PR creation through GitHub connector returned HTTP 404 (repository unavailable to connector), despite successful Git SSH publication. No mainline merge was performed.
- Local dev server remains available on port 4323. Product owner may compare designs; production cutover remains outside scope.

## Readability and Palette Refinement (2026-09-27)

Owner requested more readable desktop top-band text and other small copy while preserving the airy design, plus selectable open-source palettes.

- Desktop top band increased from 10px regular to 14px semibold. Shared rem-based label/UI tokens raise smaller dates, captions, course labels, footer and utility text. Major headings and section spacing preserved.
- Centralized all component colors into semantic tokens in `src/styles/themes.css`. Original Astra remains default; five adaptations: Solarized Light, Nord Snow, Catppuccin Latte, Gruvbox Light and Rosé Pine Dawn. Upstream attributions and license notices bundled in `public/licenses/themes.txt`; sources linked from the site README.
- Native labeled dropdown in desktop band and mobile navigation; localStorage preference restored by a head script before rendering, synchronized between controls/tabs. Invalid values fall back to original; storage-denied mode still supports switching on the current page.
- Solarized secondary text darkened after rendered-page audit found 4.39:1 contrast on a tinted panel. Final palette token checks exceed 4.5:1 for normal foreground/background pairings.
- Build: 20 pages, zero errors/warnings/hints. Existing 19-route browser regression passes. New palette browser suite passes six schemes × three representative pages with zero WCAG A/AA findings, responsive widths 320/390/768/1024/1440, persistence, cross-tab synchronization, invalid-value fallback, blocked storage, early restoration and mobile selection.
- Local comparison screenshots: `/tmp/astra-themes/`. This is automated accessibility evidence, not a complete certification.

### Hosted Refinement Verification

The readability/palette update was deployed to `https://smartgalati-test3.mycodespace.ai` with the existing deployment wrapper. CDN invalidation was scoped to host `smartgalati-test3.mycodespace.ai` on the shared URL map. Public Playwright palette suite passed all six choices, 18 route/palette accessibility audits, viewport widths 320/390/768/1024/1440, native keyboard selection, mobile navigation, stored choices across reloads/routes, cross-tab changes, invalid preference fallback, blocked storage, and early restoration with body JS blocked. Zero violations were reported for these tested pages. Public upstream notices are served at `/licenses/themes.txt`. Screenshots: `/tmp/astra-themes-live/` (ephemeral).

## Direct-Main Integration Authorization (2026-09-27)

The owner authorized merging and pushing main directly, skipping PRs during the prototype/experiment phase. `WORKFLOW-LOCAL.md` records this temporary default and its ending condition. This supersedes the original delivery's PR-access blocker. Complete source/policy reference: `c0d785c`; integration follows the normal fast-forward/direct push procedure. The completed workstream is archived at [its delivery record](../../archive/2026-09-27-codex-astra-site/CURRENT-STATUS.md). Final build and three archive tests pass; prior live browser and palette evidence remains applicable because this integration changes workflow/records only.
