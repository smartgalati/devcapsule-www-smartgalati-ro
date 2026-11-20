# chessclub-website (ACS Smart Galați)

Modern, fast static website for **ACS Smart Galați** ([smartgalati.ro](https://smartgalati.ro/)), an active chess club in Galați, Romania supporting both youth beginner training and competitive national performance.

## Project Purpose & Architecture

- **Static Generation**: Clean, accessible component-based architecture (recommended: Astro + Tailwind CSS) ensuring high performance, zero runtime backend requirements, and easy human maintainability.
- **Content Authoring**: Non-developer contributors (coaches, administrators) maintain pages, profiles, and news via plain Markdown files in a structured `content/` directory.
- **Media Management**: Hybrid approach combining locally optimized core assets (logos, headshots) with external public photo album links (e.g. Google Photos) for tournament coverage without git bloat.
- **Chess Integrations**: Extensible roadmap for Lichess embeds, interactive PGN game viewers, and chess tactical puzzles.

## Project Contracts & Status

- Original product work order: [`engineering-docs/work-orders/2026-09-26-chessclub-website.md`](engineering-docs/work-orders/2026-09-26-chessclub-website.md)
- Work order the site was built under: [`smartgalati-test4`](engineering-docs/work-orders/2026-09-27-smartgalati-test4-prototype.md)
- Requirements register: [`REQUIREMENTS.md`](REQUIREMENTS.md)
- Documentation index: [`index.md`](index.md)
- Live status & next resumable task: [`CURRENT-STATUS.md`](CURRENT-STATUS.md)

## The Site

[`claude-rocada-site/`](claude-rocada-site/README.md) is the club's site: the
"Rocada" design (navy/amber on warm paper, six palettes including dark ones),
content taken only from the club's original site including all 134 historical
articles. Local development on port 4325. It is the only site in this
repository; the other prototypes it was chosen from, and the Google Cloud
Storage and Firebase deployment scripts used for earlier previews, were
removed on 2026-11-20 and remain in the git history.

## Publishing

Two steps, described in [the publishing guide](docs/publishing.md):

1. Every `main` change under `claude-rocada-site/` is checked and published to
   the **test site** by
   [`.github/workflows/claude-rocada-pages.yml`](.github/workflows/claude-rocada-pages.yml),
   which also saves the published files as a *website candidate* release.
2. [`smartgalati/livewebsite-smartgalati-ro`](https://github.com/smartgalati/livewebsite-smartgalati-ro)
   publishes one reviewed candidate, chosen by its tag, to the **production
   site**.

Enabling Pages (Source: GitHub Actions), the custom domains and plan
eligibility for a private repository are owner steps; see
[the GitHub Pages deployment guide](docs/github-pages-deployment.md).
