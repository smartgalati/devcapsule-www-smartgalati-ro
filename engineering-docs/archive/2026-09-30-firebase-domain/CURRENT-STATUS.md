# Firebase Custom Domain Scripts — Delivery

Started/concluded: 2026-09-30. Outcome: configurable public URL implemented.
Implementation: 8521071. Delivery: direct-main from ws-firebase-domain/deployment,
rebased onto unchanged main a4925bc, finishing commit integrated by fast-forward
and normal push under WORKFLOW-LOCAL.md. No live deployment or DNS edits.

[Guide](../../../docs/firebase-spark-deployment.md) documents FIREBASE_SITE_URL,
custom-domain connection, and verification. Default remains PROJECT_ID.web.app.
The setting controls build canonical/Open Graph URLs and HTTP checks, while the
project/site target and billing guard remain independent. Invalid origins fail
before builds/cloud calls; optional trailing slash and hostname case normalize.

Validation: all 18 Firebase tests, Bash syntax and whitespace checks passed.
Custom-domain Astro build passed check (zero errors/warnings/hints), generating
285 pages and 565 static files. Real Firebase Hosting emulator passed custom
canonical URL, home/contact/gallery/archive/article, 404, redirect and cache
checks. Cloud command tests use mocks. No live permissions/DNS/TLS verified.

Operator next step: deploy with FIREBASE_SITE_URL set, connect the hostname in
Firebase and authoritative DNS, then run status checks once HTTPS is ready.
The environment setting must also be supplied for later builds and checks;
it does not register a custom domain or automatically redirect web.app traffic.

Intake/mail empty; no open owned bugs, upstream changes, or remaining code work.
Original checkout's unrelated test5 scripts preserved. Portfolio test5 next step
unchanged. Registration followed explicit workflow step 6, as in prior stream.
