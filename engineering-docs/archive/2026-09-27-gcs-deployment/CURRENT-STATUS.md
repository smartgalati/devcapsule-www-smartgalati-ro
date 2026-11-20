# Workstream Archive Status: GCS Deployment

Name: `gcs-deployment`

Start date: `2026-09-27`

Conclusion date: `2026-09-27`

State: concluded; integrated into main

Definition read: WORKFLOW.md@eabe23ed644a, WORKFLOW-LOCAL.md@05687aa6136c

Branch association: `ws-gcs-deployment/scripts-v2` (delivered to `main`)

## Goal

Enhance scripts/gcs deployment suite to support multi-project deployments (resource project `mycodespace3p`, DNS project `central-trees-497510-h7`), regional Finland GCS buckets, existing and new Load Balancers (cross-project capable), and automated DNS record configuration, incorporating lessons learned from prior runs.

## Outcome & Evidence

- Enhanced and modularized GCS & Load Balancer deployment suite in `scripts/gcs/`:
  1. `config.env`: Centralized environment configuration with default target website `smartgalati-test2`, bucket `test2-smartgalati-mycodespace`, region `europe-north1` (Finland), resource project `mycodespace3p`, DNS project `central-trees-497510-h7` (zone `mycodespace`).
  2. `common.sh`: Common helpers ensuring `gcloud` discovery, non-interactive API enablement (`compute.googleapis.com`, `storage.googleapis.com`, `dns.googleapis.com`, `orgpolicy.googleapis.com`), and dynamic Org Policy `iam.allowedPolicyMemberDomains` handling.
  3. `01-create-bucket.sh`: Regional storage creation in Finland with uniform bucket-level access and no public-access prevention; handles global namespace collision diagnostics.
  4. `02-configure-website.sh`: Website entrypoints, public viewer binding, automated detection of Org Policy HTTP 412, dynamic override generation and application, and propagation retry loop.
  5. `03-deploy-site.sh`: Astro 5 static build and GCS sync with 1-year immutable edge caching for `_astro/*` assets and 5-minute caching for HTML.
  6. `04-setup-https-loadbalancer.sh`: Automates new External Application Load Balancer setup under `mycodespace3p`.
  7. `04b-add-to-existing-loadbalancer.sh`: Adds websites to existing Load Balancers across projects without allocating additional IPs or interrupting existing sites.
  8. `05-configure-dns.sh`: Automates Cloud DNS `A` record creation in `central-trees-497510-h7` with IP auto-discovery and resolver verification.
  9. `check-status.sh`: Real-time diagnostic probe for DNS, Google-managed SSL status (`PROVISIONING` -> `ACTIVE`), and live HTTPS connectivity.
  10. `README.md`: Comprehensive documentation covering topology, lessons learned, and execution walkthrough.
- Verified live deployment:
  - Domain: `https://smartgalati-test2.mycodespace.ai`
  - Bucket: `gs://test2-smartgalati-mycodespace` (Location: `europe-north1`, Project: `mycodespace3p`)
  - Load Balancer: `chessclub-test2` (IP: `8.232.113.26`, Project: `mycodespace3p`)
  - DNS: `smartgalati-test2.mycodespace.ai` (Zone: `mycodespace`, Project: `central-trees-497510-h7`)
  - SSL Certificate: `chessclub-test2-cert` is `ACTIVE`
  - Protocol & Status: `HTTP/2 200` served via Google Cloud CDN edge cache.

## Residual Risks & Recommendations

- None. Both `smartgalati-test.mycodespace.ai` (on `central-trees-497510-h7`) and `smartgalati-test2.mycodespace.ai` (on `mycodespace3p`) operate independently. Future sites can attach to either balancer using `04b-add-to-existing-loadbalancer.sh`.
