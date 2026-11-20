# Work Order: smartgalati-test4 — Independent ACS Smart Galați Prototype

Date: 2026-09-27  
Status: ready for the next coding agent; implementation not started  
Requested by: project owner, Costin Cozianu

## 1. Outcome and creative freedom

Build and deploy another independent website for **ACS Smart Galați**, at
**https://smartgalati-test4.mycodespace.ai**, under the same conditions as the
completed test3 experiment. The owner will compare candidates and may later
choose one or combine ideas. This is a design experiment, not production cutover.

Choose your own visual identity, layout, typography, framework and component
architecture. Aim for a polished, readable, spacious, welcoming chess-club site
that serves parents, beginners and competitive players. You have the same
technical freedom as the test3 author: Astro is a recommendation, not a mandate;
Tailwind is optional. Design quality, content fidelity, usability and
maintainability matter more than matching another implementation.

Create a separate repository-root directory, suggested **`smartgalati-test4-site/`**.
You may choose a more descriptive candidate name; document it and update
`SITE_DIR` accordingly. Do not put sources inside another candidate or depend on
its source tree at runtime/build time. Reuse factual Markdown, authentic club
photographs and useful deployment patterns where appropriate, retaining source
attribution. You are encouraged to make your own design rather than a recolor.
Existing candidates are references and reusable inputs, not a required template.

This document is the candidate-specific supplement to the
[original work order](2026-09-26-chessclub-website.md) and
[requirements register](../../REQUIREMENTS.md), R-SITE-001–007. Where they differ,
this order governs test4: independent directory, test4 hostname, GCS-only hosting,
shared existing load balancer, unchanged enrollment URL and the prototype delivery
policy below. It does not change the contracts of other candidates.

## 2. Content and authoring contract

- Romanian is the default. Provide configurable i18n scaffolding for future
  languages; a complete English translation is not required.
- Deliver the homepage and core club content: Despre Noi, Antrenori, Echipe,
  Performanțe, Contact/Locație, Susține 3.5%, news, a historical archive and a
  usable photo gallery. Include clear enrollment and club-support calls to action.
- Use the original club website and existing migrated content as factual sources.
  Preserve authentic dates and results. Do not invent medals, ratings, schedules,
  membership numbers, testimonials, working album links or current tax deadlines.
  Record uncertainty for owner review rather than presenting guesses as facts.
- Include the six existing coach profiles: Lucian Gilea, Cristian Clement Dăianu,
  Robert Pîșu, Flavius Mihailiuc, Robert Ionică and Dănuț Radu. The original work
  order's `lucian-jugaru.md` and FIDE-ID example are schema illustrations, not
  additional factual staff records.
- Keep editable content in the candidate's `content/` directory, with plain
  Markdown, understandable frontmatter, validation, copyable templates and a
  short Romanian authoring guide. Content updates must not require component edits.
  Direct IDE/GitHub editing is sufficient; a visual CMS is optional, as for test3.
- Automatically partition dated news/results older than two calendar years at
  build time into indexed archive URLs such as `/arhiva/[year]/[slug]/`.
  Explain that static-site archive eligibility advances on rebuild; test the
  boundary and avoid broken internal links when records move into the archive.
- Use locally optimized core imagery and real club photos. Support external public
  album links for future high-volume uploads; avoid adding large unoptimized
  collections. Gallery thumbnails must lead to a usable enlarged image or album,
  with accessible controls when using a lightbox.
- Demonstrate one Lichess embed/interactive board with a direct-link fallback.
  Keep the core site independent of third-party API availability. Full PGN tools,
  live broadcasts and puzzles remain optional enhancements.

**Enrollment URL is fixed:** `https://forms.gle/smartgalati-inscriere`.
Keep it configurable but use that exact value. The owner explicitly accepts that
it currently does not work; external form availability is not an acceptance gate.
Do not create a replacement form. Protect public phone/email from naive scraping
using a usable, keyboard-accessible approach; describe its limits honestly.

## 3. Readability and palette choices

Carry forward the owner's test3 refinements as part of equivalent conditions:

- Keep text easy to read, including the desktop top band, navigation, metadata,
  captions and footer. Avoid tiny, thin text on dark backgrounds. Use shared
  typography tokens so sizes and weights can be adjusted centrally. Test zoom
  and mobile wrapping; do not trade readability for fitting everything on one row.
- Offer a labeled dropdown, available on desktop and mobile, with **5–6 total
  palette choices**, including the candidate's default and adapted open-source
  schemes. Solarized Light is an example, not a mandatory choice. Select schemes
  that suit your design; cite upstream sources and retain required license notices.
- Centralize semantic color tokens. Apply palettes consistently to all pages,
  controls, focus states and interactive states. Check contrast for each palette
  rather than assuming a terminal palette is accessible unchanged on the web.
- Remember the visitor's choice across pages/reloads when storage is available;
  remain usable when storage is blocked. Avoid a distracting wrong-theme flash.
- Provide semantic landmarks, visible keyboard focus, accessible navigation and
  dialogs, descriptive image alternatives, reduced-motion handling and sensible
  touch targets. Desktop dropdowns, if used, must remain open while moving the
  pointer into them and also work by keyboard.

The exact test3 colors, six theme names and green/ivory styling are not prescribed.

## 4. Local development and maintainability

The complete source must be understandable and editable in the IDE. Document:

```bash
cd smartgalati-test4-site   # substitute your documented directory if different
npm ci
npm run dev                # hot reload; document its port and IDE forwarding
npm run build              # checks and deployable static output
npm run preview            # local production-build smoke test
```

Commit the lockfile and declare the supported Node version. Choose an available
local port, for example 4325; do not terminate another candidate's development
server. Keep dependencies and client JavaScript proportionate to a static site.
No runtime Node server, database or SSR service is available in a GCS bucket.
Use `dist/` as build output, or make a small backwards-compatible parameterized
adaptation to the existing deployment scripts for another output directory.

Document content editing, adding news/coaches/albums, archive behavior, palette
maintenance, local checks and deployment. Provide reproducible build validation
in CI where practical; cloud credentials must not be required to build locally.
A working local deployment path must not depend on configuring CI federation.

## 5. Deployment: existing GCS scripts and shared load balancer

Use the repository's [GCS deployment suite](../../scripts/gcs/README.md).
The test3 [wrapper](../../codex-astra-site/scripts/deploy.sh) and
[environment file](../../codex-astra-site/scripts/deployment.env) demonstrate the
supported parameter pattern. Keep test4 settings in its own environment file and
wrapper; leave the shared scripts' test2 defaults intact. Small reusable script
changes are allowed if your framework needs them; preserve existing callers.

These values are taken from the delivered test3 configuration. Verify actual
cloud resources, credentials and DNS before applying changes; this order does
not claim that test4 resources already exist.

| Parameter | Test4 value |
|---|---|
| `PROJECT_ID` | `mycodespace3p` |
| `LB_PROJECT_ID` | `mycodespace3p` |
| `DNS_PROJECT_ID` | `central-trees-497510-h7` |
| `DNS_ZONE` | `mycodespace` |
| `SUBDOMAIN` | `smartgalati-test4` |
| `PARENT_DOMAIN` | `mycodespace.ai` |
| `DOMAIN` | `smartgalati-test4.mycodespace.ai` |
| `BUCKET_NAME` | `test4-smartgalati-mycodespace` |
| `LOCATION` / `STORAGE_CLASS` | `europe-north1` / `STANDARD` |
| `SITE_DIR` | `smartgalati-test4-site` (or your chosen source directory) |
| `LB_MODE` | `existing` |
| `EXISTING_LB_NAME` / `LB_NAME_PREFIX` | `chessclub-test2` |

The existing scripts derive these names:

| Object | Name |
|---|---|
| Dedicated backend bucket | `chessclub-test2-test4-smartgalati-mycodespace-backend` |
| Dedicated managed certificate | `chessclub-test2-smartgalati-test4-mycodespace-ai-cert` |
| Dedicated host/path matcher | `smartgalati-test4-mycodespace-ai-matcher` |
| Shared URL map | `chessclub-test2-url-map` |
| Shared HTTPS proxy | `chessclub-test2-https-proxy` |
| Shared forwarding rule | `chessclub-test2-https-rule` |

The shared IP recorded for test3 is `8.232.113.26`; discover and verify the current
forwarding-rule address rather than hardcoding that historical observation.
If the proposed globally unique bucket name is unavailable, choose a test4-specific
suffix and record the resulting derived resource names.

Provision through `01-create-bucket.sh`, `02-configure-website.sh`,
`03-deploy-site.sh`, **`04b-add-to-existing-loadbalancer.sh`**, then
`05-configure-dns.sh`, with the candidate's exported parameters. Do not create
another load balancer with `04-setup-https-loadbalancer.sh`. Subsequent content
updates should only need the build/upload path through `03-deploy-site.sh`.

Preserve all existing host rules, default backend and certificate attachments.
The upload script deletes obsolete objects in its target bucket: verify that the
target is test4 before running it. Account for framework-specific hashed asset
paths in cache headers. Check deep links, trailing-slash behavior, 404 responses,
DNS, managed-certificate readiness and public HTTPS after provisioning. Public
read access is needed for static objects; do not commit credentials.

Test2 and test3 must remain functional. The production `smartgalati.ro` domain
and other preview sites must not be redirected, replaced or removed.

## 6. Execution and delivery authority

When assigned this order, carry implementation through local validation and the
live test4 preview using available authorized cloud access. Routine technical,
design and configuration choices are delegated, as they were for test3. Ask only
for missing access or a material unresolved product decision; document external
blockers precisely and continue independent work.

Read `AGENTS.md`, `README.md`, the declared workflow, `WORKFLOW-LOCAL.md` and live
status first. Register a fresh delivery workstream for test4 under the repository
protocol; do not resume the concluded Astra workstream or implement the site on
the project-management branch. Keep evidence and resumable state in the repository.

The owner-authorized prototype exception in
[WORKFLOW-LOCAL.md](../../WORKFLOW-LOCAL.md) allows validated work to be integrated
and pushed directly to `main` without a PR or repeated merge approval. Follow its
synchronization/fast-forward procedure; never force-push `main`. Production
cutover remains a separate owner decision.

This order commissions the next candidate when picked up by its implementing
agent. Preparing this document does not itself create infrastructure or begin
site implementation.

## 7. Acceptance and handoff

Deliver evidence proportionate to the prototype, using the same standard as test3:

1. A distinct, coherent design in its own source directory, with all required
   content and a usable gallery. Check the factual sources and record anything
   requiring owner verification before production.
2. Reproducible dependency installation, clean static build and working hot-reload
   development and production previews. Show that a Markdown edit reaches output.
3. Responsive visual checks on representative mobile and desktop widths,
   including narrow screens and zoom. Exercise menus, contact reveal, galleries,
   archive links and the chess demonstration. Check for broken internal links,
   missing assets and browser errors.
4. Keyboard and accessibility checks, including contrast across every palette,
   mobile selection, persistence and unavailable-storage behavior. Distinguish
   site-owned issues from third-party iframe limitations and supply fallbacks.
5. Meaningful archive cutoff/routing tests and a recorded production-build
   performance check. Optimize obvious bottlenecks; do not claim measured speed
   or Lighthouse scores without the environment and actual evidence.
6. Live HTTPS at `smartgalati-test4.mycodespace.ai`, including a direct request to
   a nested page and a missing page, with valid certificate and correct host
   routing. Verify test2 and test3 continuity after the shared-LB change.
7. Candidate README and authoring guide, deployment parameters/wrapper, palette
   attribution, validation results, known limitations and current workstream
   state. Update the root README, requirements references and `index.md` as needed.
8. Commit and integrate the finished work under the prototype policy. Give the
   owner the preview URL, source directory, local commands and concise evidence
   for comparison. Final aesthetic selection belongs to the owner.

## 8. Helpful starting points

- [Original product work order](2026-09-26-chessclub-website.md)
- [Requirements and test3 clarifications](../../REQUIREMENTS.md)
- [Test3 developer and deployment guide](../../codex-astra-site/README.md)
- [Test3 Markdown authoring guide](../../codex-astra-site/content/README.md)
- [Test3 implementation and verification evidence](../implementation-notes/website/2026-09-27-codex-astra-site.md)
- [Earlier candidate guide](../../ag-flash3.8-site/README.md)
- [Shared GCS deployment guide](../../scripts/gcs/README.md)

Use these to avoid rediscovering factual content and deployment details. You are
free to improve on every candidate's design and implementation. The comparison
is intended to give each agent a fair opportunity to produce its best work.
