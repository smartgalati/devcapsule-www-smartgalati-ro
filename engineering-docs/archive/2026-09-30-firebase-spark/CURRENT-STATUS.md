# Firebase Spark Deployment — Delivery Record

Started and concluded: 2026-09-30. Outcome: requested scripts delivered.
Delivery: direct-main under WORKFLOW-LOCAL.md, ws-firebase-spark/deployment
rebased onto unchanged main 0d3e1ab. Implementation commit: d095318; this
finishing commit archives the record and is delivered by fast-forward and normal
push. No live Firebase deployment or domain cutover was requested or performed.

## Result

- [Operator guide](../../../docs/firebase-spark-deployment.md) covers setup,
  deployment, billing boundary, quotas, and local verification.
- [Scripts](../../../scripts/firebase/) create a new unbilled project, prepare and
  publish only static Hosting assets, and check billing and published routes.
- Guards refuse linked/billed, unknown, or mismatched projects. A separate
  Spark project is required. Canonical URLs honor the deployment build URL.
- [R-SITE-007](../../../REQUIREMENTS.md) records the additional hosting path.
  [Hosting research](../../design-notes/hosting/2026-09-30-static-hosting-costs-and-alternatives.md)
  retains cost/tradeoff context.

## Evidence

Node 22.23.1, Firebase CLI 15.32.0. Passed 14 guard/artifact/command tests,
6 existing Rocada tests, Bash syntax checks, and git diff --check. Astro check:
0 errors/warnings/hints. Build: 285 pages, 565 static files.
Firebase Hosting emulator passed home/contact/gallery, a real 404, slash
redirect, canonical hostname, archive/article routes, and short HTML versus
immutable fingerprinted-asset cache headers.

Cloud CLI calls were mocked for refusal/publication tests; emulator and static
build were real. Account permissions and cloud provisioning remain unverified.
The operator supplies a unique project ID and authentication, then executes the
guide. The project must remain unlinked to billing: scripts cannot prevent a
concurrent or later administrator upgrade. Existing GCS charges continue.

## Workflow / Residual State

Intake/mail empty, no owned open bugs. No changed upstream workflow or main
content at synchronization. Original checkout's unrelated untracked test5 files
were preserved during integration. The portfolio's recorded test5 work order
remains its next planned step; this request did not replace that state.
The initial branch-registration wording gap was resolved using explicit step 6
(first-branch registration commit and publish), consistent with hosting-research.
Correction to earlier environment evidence: gcloud is installed outside PATH at
/home/devcapsule/xtras/google-cloud-sdk/bin/gcloud; the scripts locate it.
