# Workstream Current Status: Project Management

Name: `project-management`

Start date: `2026-09-27`

State: active; permanent coordination

Definition read: WORKFLOW.md@02914b52c231, WORKFLOW-LOCAL.md@23bcc833e641

Branch association: `ws-project-management/coordination`

## Goal

Maintain project-wide priorities, sequencing, cross-workstream dependencies,
and lifecycle decisions while this repository uses multiple-streams mode.

## Current State

The reserved workstream was initialized. Transitioned from single-stream mode on 2026-09-27.
- Initial site solution (`ag-flash3.8-site`) built with Astro 5 and Tailwind CSS.
- 6-palette theme switcher (Classic Dark, Solarized Light, Nordic Clean, Tournament Green, Midnight Blitz, Gruvbox Warm) implemented and contrast-hardened.
- Content collections structured and aligned with official `smartgalati.ro` instructors (Lucian Gilea, Cristian Dăianu, Robert Pîșu, Flavius Mihailiuc, Robert Ionică, Dănuț Radu).
- Google Cloud Storage deployment suite (`scripts/gcs/`) executed; site is live and verified on HTTPS at `https://smartgalati-test.mycodespace.ai` via Cloud CDN and Google-managed SSL.
- Delivery workstream `2026-09-27-gcs-deployment` completed and integrated; enhanced GCS deployment suite v2 for multi-project deployments, regional Finland storage (`europe-north1`), existing/new load balancers, and Cloud DNS automation; verified live on `https://smartgalati-test2.mycodespace.ai`.

## Planned Next Step

Finish step two of the two-step publishing: the owner creates the production
repository in the `smartgalati` organization and names it; the prepared
content (publish workflow, promotion script, tests, README) is pushed there;
the owner sets its custom domain with HTTPS; then promote a candidate and
confirm `/build-info.json` on the production site.

## Latest Delivered Slice (2026-11-20): new home and two-step publishing

- This repository, `smartgalati/devcapsule-www-smartgalati-ro`, started as a
  single commit: the tree of `Luciangl/devcapsule-chessclub-website` at
  `518a48f`, without its history. Slices below this one happened in that
  repository or in `ccozianu/devcapsule-chessclub-website` before it.
- Added step one of the owner's two-step publishing (change and publish to
  test, then publish to production), modelled on
  `mycodespace-ai/devcapsule` and `mycodespace-ai/devcapsule-website`: the
  Pages workflow gained a `candidate` job that saves the deployed files as a
  `website-candidate-<run>-<attempt>` prerelease
  (`claude-rocada-site/scripts/candidate.mjs`, four unit tests). Guide:
  `docs/publishing.md`.
- Step two, the production repository (publish workflow, promotion script,
  eight unit tests, README), is written and tested locally but not pushed:
  the repository does not exist yet and its name and domain are the owner's
  to choose.
- Step one verified on GitHub (2026-11-20): the owner made the repository
  public and set the test domain `test.smartgalati.ro` (CNAME to
  `smartgalati.github.io`, HTTPS enforced); Pages source is GitHub Actions.
  Run 44656136236 built for `https://test.smartgalati.ro`, passed the
  checks, deployed, and created `website-candidate-44656136236-1`. A run
  made before the domain was set had published a sub-path build, which then
  could not load its assets at the domain root; a domain change always needs
  a new run.
- Validation: `npm test` in `claude-rocada-site/` 14/14; pack then promote
  run locally on the real built site (569 files, 291 pages, 582 address
  references rewritten, no broken local link). Not yet run on GitHub: Pages
  cannot be enabled while this repository is private on the free plan
  (API answer: "Your current plan does not support GitHub Pages for this
  repository").
- Gap noted: `.devcapsule/devcapsule.toml` still names the project
  `chessclub-website` with mount `/workspace/chessclub-website`, and the
  coordination branch of the multiple-streams workflow does not exist in
  this repository yet; left for the owner's first session here.

## Earlier Slice (2026-11-20): repository reduced to the Rocada site

- This repository (`Luciangl/devcapsule-chessclub-website`) is the club's own
  and from this slice on is maintained separately from the
  `ccozianu/devcapsule-chessclub-website` repository it was forked from; the
  two are no longer merged into each other.
- At the owner's request, removed the other prototypes (`ag-flash3.8-site/`,
  `codex-astra-site/`, `smartgalati-test5-site/`), the unrelated
  `mycodespace-site/` with its requirement, work order and archives, and the
  Google Cloud Storage deployment: `scripts/gcs/`, the Rocada `deploy`
  wrapper and its parameters, the Astra CI workflow and the GCS deploy job of
  the Rocada CI workflow. Everything remains in the git history.
- In a second step the same day, at the owner's request, also removed the
  Firebase Spark deployment: `scripts/firebase/` and
  `docs/firebase-spark-deployment.md`. GitHub Pages is the only hosting path.
- Kept: `claude-rocada-site/`, the GitHub Pages workflow and the
  build-and-test workflow.
- Updated README, index, REQUIREMENTS (R-SITE-007 amendment), the validation
  commands in `WORKFLOW-LOCAL.md`, the site README, the Romanian content
  guide (publishing is now automatic on `main`) and the Pages guide. Dated
  historical records (work orders, archives, design and implementation
  notes, old bug records) still name the removed paths and were left as
  written.
- Validation in `claude-rocada-site/`: unit tests, contrast check, build and
  the Pages check with the published address; see the Pages workflow run for
  this commit.

## Earlier Slice (2026-11-19): workflow definition refresh to 0.3.1

- At the owner's explicit request, refreshed the reusable definition from
  0.2.14 to DevCapsule 0.3.1 with `devcapsule bootstrap project
  --refresh-workflow-definition` (tool: v0.3.1-local-linux-x86_64). It
  replaced `AGENTS.md` and `WORKFLOW.md`, set `[workflow] version = "0.3.1"`,
  added `.idea/` to `.gitignore`, and installed `PREAMBLE.md` and
  `INFORMATION-MODEL.md` (for humans). Project-owned files were preserved.
- Migration steps from *Changes* (0.3.0, 0.3.1):
  - *Validation commands are required*: filled that section of
    `WORKFLOW-LOCAL.md` from the sites' `package.json`, READMEs and CI
    workflows. Ran the Rocada gate as written: 10/10 unit tests, contrast
    check passes for all palettes, build 291 pages with no errors. The other
    sites' commands were transcribed, not rerun.
  - *Integration is a merge commit*: updated the wording of the prototype
    direct-main exception in `WORKFLOW-LOCAL.md` from fast-forward to
    `git merge --no-ff`, matching the new direct-main procedure. Agent's
    interpretation: the exception authorizes direct-main delivery, and
    "fast-forward" only restated the old procedure. Owner may reverse it by
    recording a fast-forward exception.
  - *Information model*: no bug record needs reclassifying; 0 open bugs.
  - *Pile of ideas*: no migration; directory is created with the first idea.
- Added the two new files to `index.md`.
- Delivery: pull request from `ws-project-management/workflow-refresh`, at the
  owner's request for this change (direct-main remains the local default).
  Opened as pull request #1
  (https://github.com/ccozianu/devcapsule-chessclub-website/pull/1); the
  owner merges it, as a merge commit. `gh` is not on the default `PATH` in
  this capsule; the owner's tip is `source
  /opt/xtras/miniconda3/etc/profile.d/conda.sh && conda activate gh`.

## Earlier Slice (2026-09-27, evening)

- Prepared the test5 work order at the owner's request (hostname confirmed as
  `smartgalati-test5.mycodespace.ai`), carrying forward the test4 conditions plus
  the test4 lessons: content-fidelity audit and reusable verified content, taken
  ports, certificate/host propagation window, CDN header ordering, trailing-slash
  redirects, and the finishing/retire steps of the workflow.
- Linked it from README and index; recorded test4 (`claude-rocada-site`) as
  delivered and integrated. Synchronized this branch from `main` first.
- Delivery: direct-main by rebase + fast-forward + normal push.

## Previous Slice (2026-09-27)

- Prepared the test4 work order at the owner's request, carrying forward the
  test3 conditions, readability/palette refinement, unchanged enrollment URL,
  independent design freedom and shared GCS load balancer constraints.
- Linked it from README and index. No test4 implementation or infrastructure
  has been created; the next agent owns that delivery.
- Synchronization: started the coordination branch from current main because
  the local prototype integration policy changed since this workstream's stamp.
  No open bugs are owned by project-management; mailbox and intake are empty.
- Interpretation: "same conditions" includes the owner's later readability and
  palette requests, but does not prescribe Astra's framework, colors or layout.
- Validation: checked local document links, resource names against existing
  deployment scripts, and diff whitespace. No runtime tests needed for this
  documentation-only slice; live cloud state was not revalidated.
- Delivery: direct-main; target main; integration branch
  ws-project-management/coordination; synchronize/rebase then fast-forward and
  push normally under WORKFLOW-LOCAL.md. No human-only merge step.
- Permanent coordination remains open. No uncommitted work is intended at pause.

## Open Threads

- Owner step: set the GitHub repository's pull-request merge method to merge
  commits (definition 0.3.0 migration); the agent has no repository-settings
  access.
- `claude-rocada-site` still defaults its canonical address to
  `https://smartgalati-test4.mycodespace.ai` when built without
  `ROCADA_SITE`/`PAGES_SITE_URL` (`astro.config.mjs`, `src/config/site.ts`);
  the Pages workflow overrides it. Change the default when the club's final
  domain is decided.
