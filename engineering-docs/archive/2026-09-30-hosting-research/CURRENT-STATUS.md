# Hosting Research: Completed Workstream

Start date: 2026-09-30
Outcome: completed research; no migration or hosting decision adopted.
Branch: `ws-hosting-research/analysis`
Delivery: direct-main under WORKFLOW-LOCAL.md; ordinary rebase/fast-forward and normal push.
Durable deliverable commit: `a3d30a8` (Research static hosting costs and provider tradeoffs).

## Deliverable and Evidence

- [Static hosting costs and alternatives](../../design-notes/hosting/2026-09-30-static-hosting-costs-and-alternatives.md): current scripts, standalone/shared/marginal costs, nine provider options, recommendations and migration checks.
- Requirements considered: R-SITE-001, R-SITE-003, R-SITE-006, R-SITE-007. No requirement changed.
- Verified public primary-source pricing/limits on 2026-09-30; queried AWS S3 Ireland and Azure West Europe public price feeds. Measured existing local build artifacts without assuming they match live buckets.
- Checked cost arithmetic, local links and diff whitespace. Documentation-only: no application tests required.
- Mailbox and intake empty; no open bugs owned by this workstream. Both reserved streams present.

## Limits and Next Step

No gcloud executable or authenticated billing data was available. Live inventory, invoices, traffic, Finland-specific storage quote and provider latency are unverified; the note identifies these limits and gives an invoice-reconciliation procedure. No cloud resources or DNS changed.

Next optional step: reconcile a complete calendar month's bill and choose whether to pilot another host. Production cutover remains a separate owner decision. Recorded portfolio next step (test5 work order) was not erased or executed by this research.

## Workflow and Checkout Notes

Started from main 4265f2b, identical to origin/main; synchronized again before integration with no new upstream changes. Used a separate worktree to preserve unrelated test5 files in the original checkout. Workflow 0.2.14 new-stream wording is internally inconsistent about branch-before-registration; followed explicit step 6 by committing registration on the first workstream branch and publishing it before research edits. No definition/version changed.

Original checkout's two untracked test5 deployment files are preserved across final integration. Published checkpoints before retirement; archived intake-dispositions.md records no received items.
