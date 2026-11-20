# Publishing: test first, then production

The club's website is published in two steps, from two repositories.

| | Repository | What it publishes |
|---|---|---|
| 1. Test | this one, `smartgalati/devcapsule-www-smartgalati-ro` | every change on `main`, to the **test site** |
| 2. Production | the production repository named in its own README | one **reviewed candidate**, chosen by hand, to the **production site** |

A GitHub repository has exactly one Pages site, which is why production has a
repository of its own. That repository holds no site source.

## Step 1: change and publish to test (automatic)

1. Change the site under `claude-rocada-site/` (content is Markdown under
   `claude-rocada-site/content/`) and get the change onto `main`.
2. [`.github/workflows/claude-rocada-pages.yml`](../.github/workflows/claude-rocada-pages.yml)
   runs: unit tests, contrast check, build, browser/palette/accessibility
   checks. Only if all pass does it deploy to this repository's Pages site,
   the test site.
3. Its last job, `candidate`, saves the exact files it just deployed as a
   prerelease named `website-candidate-<run>-<attempt>`, with two assets:
   `website.tar.gz` and `candidate.json` (source revision, run, test address,
   SHA-256 of the archive). The run's summary shows the **candidate tag**;
   all candidates are listed under
   [Releases](https://github.com/smartgalati/devcapsule-www-smartgalati-ro/releases).

The `candidate` job runs only when the test site is served from a custom
domain (empty base path). While the site is at
`https://smartgalati.github.io/devcapsule-www-smartgalati-ro/` the job is
skipped, because a site built under a path cannot be moved to the root of
another domain by swapping addresses.

## Step 2: publish to production (by hand)

1. Review the test site.
2. In the production repository: **Actions → Publish production website →
   Run workflow**, branch `main`, paste the candidate tag.
3. It downloads the candidate, verifies its checksum and origin, replaces the
   test address with the production address in the pages, checks the result
   and deploys it. Nothing is rebuilt.
4. `/build-info.json` on the production site names the candidate that is live.

To roll back, run step 2 with an older candidate tag. Keep the candidate
releases you may want to return to; delete old ones freely otherwise.

## What must be true for this to work

- This repository is public, or on a plan that allows Pages for private
  repositories; and its releases are publicly downloadable, because the
  production workflow fetches the candidate without credentials.
- Pages source is *GitHub Actions* in both repositories.
- Each repository has its own custom domain with *Enforce HTTPS*: the test
  domain here, the production domain there.

The packaging code is
[`claude-rocada-site/scripts/candidate.mjs`](../claude-rocada-site/scripts/candidate.mjs)
with tests in `claude-rocada-site/tests/candidate.test.mjs`; the promotion
code and its tests live in the production repository.
