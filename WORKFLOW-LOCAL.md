# Local Workflow: chessclub-website

This is the project's own half of the workflow. `WORKFLOW.md` beside it is the
installed generic definition and binds wherever it speaks; this file governs
wherever it is silent. The headings below are the topics a project usually
needs to settle for itself. Fill the ones that apply, delete the ones that do
not, and add any this project needs that were not foreseen. Bootstrap wrote
this file once and will not touch it again. See *The Project's Local
Workflow* in `WORKFLOW.md`.

## Integration Branch

Fill in only if it is not `main`. `WORKFLOW.md` says `main` throughout and
means the project's integration branch, whatever its name; state the name
here if it differs, for example `master` or `trunk`.

## Version Scheme

How the source names itself between releases and at a release, and the
command that sets it. For example: a Python project carries `X.Y.Z.dev0`
between releases and `X.Y.Z` at the release; a Maven project carries
`X.Y.Z-SNAPSHOT`. The marker must order before the release in the
ecosystem's tooling.

## Release Policy

The ref spelling if it differs from `release-<version>` and `v<version>`; how
a candidate is built and published; what the candidate gate checks and how a
documented exception is recorded; what acceptance evidence is required; and
where the acceptance record lives.

## Validation Commands

The site is `claude-rocada-site/`, an Astro project. Every command below runs
from that directory.

**Environment.** Node.js 22 (`node --version` prints `v22.x`) and npm; then
`npm ci`. The browser suites additionally need Playwright's Chromium:
`npx playwright install chromium`.

**Unit tests.** `npm test && npm run test:contrast`

**Integration tests.** The static build: `npm run build`. It includes
`astro check` and must finish with zero errors.

**End-to-end tests.** Playwright against a running site, opt-in: start
`npm run preview` (port 4326), then `npm run test:browser && npm run
test:themes`. For the published address, which is what the Pages workflow
runs: `PAGES_SITE_URL=https://test.smartgalati.ro PAGES_BASE_PATH= npm run
pages:build`, then the same variables with `npm run pages:check`. The site's
`README.md` holds the full description.

**Smoke test.** `npm run preview`, then
`curl --fail --silent http://localhost:4326/` returns the home page. After a
deployment: `curl --fail --silent --location https://test.smartgalati.ro/`.

**Gate.** Before a checkpoint and before integration, for a change under
`claude-rocada-site/`: the unit tests, then `npm run build`. A change to
documentation or workflow files only has no runtime gate; check the Markdown
links it adds and `git diff --check`.

**Candidate gate and acceptance evidence.** Every push to `main` under
`claude-rocada-site/` is published to the test site by the Pages workflow
only after its unit, browser and palette checks pass, and is then saved as a
`website-candidate-<run>-<attempt>` release: that run is the candidate gate.
Acceptance is the human review of the test site; the evidence is the
production repository's publish run for that candidate tag and
`/build-info.json` on the production site. See `docs/publishing.md`.

## Host Capabilities

What the project needs from the machine and the hosting service that the
generic workflow cannot assume: branch permissions, runners, credentials, and
the justification for each.

## Exceptions

### Prototype-phase direct integration

Authorized by the project owner on 2026-09-27. While this project is a
prototype/design experiment, `direct-main` is the default delivery method.
Agents may integrate completed work into `main` and push `main` directly,
without a pull request or another per-change merge confirmation. This also
applies to the completed `codex-astra-site` workstream.

Reason: prioritize quick design experiments while retaining the workflow
scaffolding for later engineering practice. Keep validation proportional to
the change and retain concise requirements, evidence and resumable state.
Use the direct-main procedure in `WORKFLOW.md`: synchronize first, integrate
by one merge commit per deliverable (`git merge --no-ff`, the rule since
definition 0.3.0; fast-forward before that) and push normally; never
force-push `main`.

This exception ends when the owner declares the prototype phase over or
explicitly restores pull-request delivery. It does not authorize production
domain cutover, which remains a separate owner decision.
