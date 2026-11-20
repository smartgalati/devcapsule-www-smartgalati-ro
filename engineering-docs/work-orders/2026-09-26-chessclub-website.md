# Work Order: Chess Club Static Website (ACS Smart Galați)

Agreed with the product owner, Costin Cozianu, on 2026-09-26. Prepared in
`chessclub-website` as the authoritative task contract for designing, scaffolding,
and delivering the static website for the ACS Smart Galați chess club.

---

## 1. Outcome

Deliver a modern, fast, and professional static website for the chess club
**ACS Smart Galați** ([smartgalati.ro](https://smartgalati.ro/)), replacing the
existing outdated WordPress implementation.

The site must:
1. Present the club, its mission, coaches, teams, performances, and news in an
   engaging, readable, and mobile-friendly design.
2. Enable non-developer content producers (coaches, club managers, parents) to
   author, update, and manage club content purely through straightforward
   Markdown files, with optional assistance from a lightweight Git-backed CMS
   or direct GitHub web editing.
3. Be easily understood and maintained by humans, with clean scaffolding and
   streamlined stylesheets.
4. Support eventual integration with Lichess-supported plugin content (studies,
   broadcasts, interactive boards, and puzzles).
5. Disregard the current WordPress theme, styling, and clunky photo plugin
   (`wppa`), providing a modern visual identity worthy of an active chess club.
6. Provide an online preview hosted at `smartgalati-test.mycodespace.ai`.

---

## 2. Underlying Framework Evaluation & Recommendation

### Requirements for the Framework
- **Static output**: Pure static HTML/CSS, deployable to GitHub Pages or Google
  Cloud Storage.
- **Multilingual Support (i18n)**: Default language is Romanian (`ro`), but the
  routing and configuration must support adding additional languages (e.g. `en`)
  without restructuring the codebase.
- **Scaffolding & DX**: Low complexity, rapid setup, minimal boilerplate.
- **Style maintenance**: Clean, modern CSS architecture (Tailwind CSS)
  allowing rapid styling tweaks without cascading side effects.
- **Content handling**: First-class Markdown support with structured frontmatter
  and schema validation.
- **Interactivity / Islands**: Ability to drop in interactive chess widgets
  (Lichess iframes, PGN viewers, board components) without forcing the entire
  site to become a heavy Single Page Application (SPA).

### Framework Comparison

| Framework | Scaffolding & Simplicity | Markdown & Content Workflow | i18n & Styling | Chess / Lichess Island Support | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Astro** | High: File-based routing, standard HTML-first mental model | Exceptional: Built-in Content Collections with Zod frontmatter validation | Native built-in i18n routing; first-class Tailwind CSS | Exceptional: Island architecture allows zero JS by default, loading JS only for chessboards | **Recommended** |
| **Hugo** | High: Single binary, ultra-fast builds | Good: Markdown files in `content/` | Built-in i18n; Go templates can be idiosyncratic to edit | Fair: Client-side JS widgets require manual script tags / shortcodes | Viable alternative |
| **11ty** | High: Minimalist JavaScript SSG | Good: Highly flexible directory data | i18n plugin required; flexible CSS pipelines | Good: Vanilla JS embeds | Good, but Astro provides cleaner component ergonomics |
| **Next.js (Static)** | Medium: Heavier React runtime | Good: Requires custom MDX/remark pipelines | Built-in routing; React component ecosystem | Good: Rich React chess libraries, but carries unnecessary client JS overhead | Disfavored for simple static brochure site |

### Recommendation: Astro + Tailwind CSS
- **Astro** delivers pure static HTML with zero client-side JavaScript for all
  brochure pages (About, Contact, News articles, Coaches), maximizing performance
  and SEO.
- Astro's native `i18n` routing allows setting Romanian (`ro`) as the default
  locale while cleanly supporting future language additions (e.g. `/en/...`).
- When Lichess embeds, interactive PGN viewers, or blitz tournament tickers are
  added, Astro components or client islands render them seamlessly without
  altering the static page foundation.
- **Tailwind CSS** provides utility-first styling that keeps the design system
  maintainable and predictable for human developers modifying layouts.

---

## 3. Content Organization, Non-Developer Authoring & Archiving

The website's content producers are chess coaches and club administrators, not
developers or front-end engineers. The authoring contract must be forgiving,
intuitive, and self-documenting.

### Authoring Workflows
Content producers can work through either of two seamlessly compatible methods:
1. **Direct GitHub Web Operation**: Navigating to `content/` on GitHub, editing
   or adding a file in the browser, and committing changes.
2. **Lightweight Git-Backed CMS (e.g., Keystatic or Decap CMS)**: Providing a
   clean visual web form under `/admin` that directly commits standard Markdown
   files and frontmatter back to GitHub. Both tools produce identical standard
   Markdown, ensuring zero lock-in and allowing direct Git edits anytime.

### Directory Structure: `content/`

All human-authored site content resides in a dedicated `content/` directory at the
root (or mapped cleanly into the static generator):

```text
content/
├── pages/                  # Static standalone pages
│   ├── despre-noi.md       # Club history, mission, values
│   ├── echipe.md           # Senior and junior team rosters
│   ├── contact.md          # Location, schedule, phone, email, map, forms
│   └── sustine.md          # 3.5% tax redirection, sponsorship info
├── coaches/                # Coach & instructor profiles
│   ├── lucian-jugaru.md
│   └── _template.md        # Copy-paste template for new coaches
├── performances/           # Club achievements, medals, championship results
│   ├── 2024-campionat-national.md
│   └── _template.md
├── news/                   # Articles, tournament announcements, blitz reports
│   ├── 2025-02-09-blitz-editia-2.md
│   ├── 2025-01-25-jucatori-acs-smart.md
│   └── _template.md
└── galleries/              # Photo album metadata and external album links
    ├── 2025-campionat-blitz.md
    └── _template.md
```

### The 2-Year Archiving Rule
To keep the primary navigation and current news stream fresh and uncluttered:
- Content items (articles, tournament results) dated **more than 2 years prior to
  the current date** are automatically routed under an **Archive** section:
  - **URL Structure**: `/noutati/arhiva/[year]/[slug]` or `/arhiva/[year]/[slug]`.
  - **Navigation**: The main news list displays current items (< 2 years old),
    with an "Arhivă Turnee & Știri" link leading to the indexed chronological
    archive.
  - **No manual movement required**: The SSG routing logic automatically
    partitions articles based on their frontmatter `date`, eliminating manual
    file shuffling by non-developer authors.

### Frontmatter Contracts for Non-Developers

Every content type uses a concise frontmatter header with plain labels and a
companion `_template.md` showing coaches exactly what each field does.

#### Example: News Article (`content/news/YYYY-MM-DD-title.md`)
```markdown
---
title: "Ediția a 2-a de Blitz la ACS Smart Galați"
date: 2025-02-09
summary: "Un nou turneu de blitz plin de energie și partide spectaculoase găzduit la clubul nostru."
cover_image: "/images/news/2025-02-09-blitz.jpg"   # or external URL
tags: ["blitz", "turnee", "juniori"]
photos_album_url: "https://photos.app.goo.gl/..." # Optional Google Photos link
lichess_study_url: ""                              # Optional Lichess study/game embed
---

Aici începe textul articolului scris în Markdown simplu...
```

#### Example: Coach Profile (`content/coaches/lucian-jugaru.md`)
```markdown
---
name: "Lucian Jugaru"
role: "Antrenor Principal / Instructor FIDE"
fide_id: "1234567"
photo: "/images/coaches/lucian-jugaru.jpg"
order: 1
---

Prezentarea antrenorului, experiența didactică și palmaresul sportiv...
```

---

## 4. Media & Image Strategy

### Evaluation: Local Repository vs. External Album (e.g. Google Photos)

| Consideration | Hosted in Repo (`/public/images/`) | External Album (e.g. Public Google Photos) |
| :--- | :--- | :--- |
| **Permanence & Reliability** | **High**: Version-controlled, zero broken link risk, independent of external third parties. | **Medium**: Album URLs may change; Google Photos lacks a permanent direct image hotlinking API. |
| **Performance & Optimization** | **High**: SSG optimizes images (responsive `srcset`, WebP/AVIF compression). | **Medium**: Embedded albums rely on external scripts/iframes or external linkouts. |
| **Git Repository Size** | **Risk**: Uploading hundreds of multi-megabyte tournament photos bloats the git history over time. | **High**: Zero repo bloat; hundreds of photos live off-repo. |
| **Workflow for Non-Devs** | Good for 1–2 photos (via GitHub web upload); high friction for 50+ camera photos. | **High**: Coaches can upload 100 tournament photos directly from smartphones into a shared Google Photos album. |

### Judged Strategy: The Hybrid Model

To maximize flexibility and best support documenting the club's active life:

1. **Curated Club Assets Hosted Locally in Repo**:
   - Logos, site banners, coach headshots, and one primary `cover_image` per news
     article or achievement are stored in the repo (`public/images/` or
     `src/assets/`).
   - These are automatically resized and optimized by the build framework for
     instant loading.
2. **High-Volume Event Galleries via Google Photos / External Albums**:
   - Tournament events and training sessions frequently produce dozens of photos.
   - Non-technical club staff upload event photos to a shared public Google Photos
     album.
   - The news article or gallery record includes `photos_album_url: "https://photos.app.goo.gl/..."`.
   - The static site presents an attractive photo album card with a preview cover
     image, a photo count badge, and a direct link to view the complete photo
     stream in Google Photos.
   - This eliminates git bloat, keeps builds fast, and provides coaches with a
     frictionless mobile workflow.

---

## 5. Chess & Lichess Integration Strategy

The site will initially function as a static information portal, with an
architectural roadmap for chess-specific interactive enhancements:

1. **Lichess Study & Game Embeds**:
   - Markdown articles can embed games or analysis studies using standard Lichess
     iframes or a lightweight Astro/HTML component:
     ```html
     <iframe src="https://lichess.org/study/embed/<study_id>/<chapter_id>?theme=brown&bg=dark"
             width="100%" height="500" frameborder="0"></iframe>
     ```
2. **Interactive PGN Viewer**:
   - Future support for embedding PGNs directly in Markdown code blocks, rendered
     via a clean client-side viewer (e.g. Chessground / PgnViewerJS).
3. **Lichess TV / Daily Puzzle Widget**:
   - Optional modular widget on the homepage or training section showing the
     daily tactical puzzle or top blitz game from Lichess.
4. **Architectural Guardrail**:
   - Core site pages must never depend on third-party chess APIs to build or
     render. If Lichess is offline, the site continues to display gracefully.

---

## 6. Visual Identity, Contact & Anti-Spam Scheme

The existing `smartgalati.ro` WordPress theme and layout are discarded per owner
instruction. The new design will follow these principles:

- **Aesthetic**: Dignified, modern, and energetic chess club feel. A balanced
  palette inspired by chess heritage: deep slate/navy, ivory/warm white, subtle
  warm gold/wood accents, and crisp typography.
- **Hierarchy & Clear CTAs**:
  - Hero section welcoming new students (both beginners and advanced competitors).
  - Clear action buttons: "Înscrie-te la Cursuri" (Enroll in classes), "Vezi
    Echipele & Antrenorii", "Donează 3.5%".
  - Quick-glance club vital stats: year founded (2014), medals won, active
    junior and senior players.
- **Contact Forms & Inquiries**:
  - Direct integration / button link to a configurable external form (e.g.,
    Google Forms) for student enrollments and inquiries, avoiding dynamic backend
    maintenance and spam vulnerabilities.
- **Anti-Spam Scheme for Contact Info**:
  - To prevent automated web scrapers from harvesting the club's email
    (`smartsah@yahoo.com`) and phone (`0758 775 206`):
    - Display text with CSS directional obfuscation (e.g., `direction: rtl;
      unicode-bidi: bidi-override`), HTML entity encoding, or a clean
      click-to-reveal button.
    - Prevents spam while remaining instantly accessible to human visitors.
- **Mobile First & Performance**:
  - Fully responsive navigation for parents and players checking news, schedules,
    and contacts on mobile devices.
  - Fast page loads (< 1s), semantic HTML5, high contrast for legibility, and
    zero unnecessary third-party tracking scripts.

---

## 7. Baseline Content Migration from `smartgalati.ro`

The work order establishes migrating and restructuring the core information from
the current site into clean Markdown:

1. **Despre Noi (About Us)**:
   - Club history (founded in 2014), mission (promoting chess in Galați, training
     for high performance, discovering new youth talent).
2. **Antrenori (Coaches & Staff)**:
   - Leadership: Lucian Gilea (President & Head Coach, FIDE Master Elo 2280), Flavius Mihailiuc (Secretary & National Arbiter).
   - Technical Staff: Cristian Clement Dăianu (FIDE Master), Robert Pîșu (FIDE Master), Flavius Mihailiuc, Robert Ionică, Dănuț Radu.
3. **Echipe & Sportivi (Teams & Athletes)**:
   - Junior and senior team rosters and participation in national championships.
4. **Performanțe (Achievements)**:
   - National championship medals, cup results, notable club milestones.
5. **Contact & Locație**:
   - Location in Galați, schedule, anti-spam protected phone and email, and
     registration Google Form link.
6. **Susține Clubul (Sponsorship & Tax Donation)**:
   - Dedicated page explaining how to redirect 3.5% of income tax to ACS Smart
     Galați, including downloadable Formular 230 instructions.
7. **Recent News & Tournament Results (< 2 Years)**:
   - Active display of 2024–2025 news and blitz tournaments.
8. **Historical Archive (> 2 Years)**:
   - Representative older posts filed under the `/arhiva/` section.

---

## 8. Hosting, Preview & Repeatable Builds

### Local Development Contract
- Standard Node.js environment:
  - `npm install` — installs dependencies.
  - `npm run dev` — runs local development server with hot-reload at `http://localhost:4321`.
  - `npm run build` — produces pure static files in `dist/`.
  - `npm run preview` — previews the generated production build locally.

### Separation of Concerns
- **Content updates**: Modifying or adding a Markdown file in `content/` requires
  zero knowledge of HTML/CSS and triggers automatic site updates upon build.
- **Styling updates**: Modifying styles (Tailwind configuration or layout
  templates) requires zero modifications to content files.

### Hosting & Preview Path
- **Static Hosting**: Configured for GitHub Pages or Google Cloud Storage.
- **Preview Deployment**: The preview site will be hosted at:
  `smartgalati-test.mycodespace.ai`
- Automated build and preview publication via a reproducible GitHub Actions workflow.

---

## 9. Autonomy Exception & Human Checkpoints

### Scoped Autonomy
The product owner delegates technical implementation choices (framework
configuration, component architecture, responsive layout design, typography,
and Markdown frontmatter schema design) to the agent. The agent carries the task
through to a reviewable deliverable without requesting repetitive micro-approvals.

### Reserved Human Decisions (Initial Setup Checkpoint)
1. **Cloud & DNS Access**:
   - Verification of credentials and DNS pointing for
     `smartgalati-test.mycodespace.ai` to the chosen static host (GitHub Pages
     or Google Cloud Storage bucket).
2. **Google Forms Link**:
   - Providing or approving the specific Google Form URL for inquiries and student
     registrations.
3. **Final Production Cutover**:
   - Authorizing the switch of the primary `smartgalati.ro` domain once review is
     complete.

---

## 10. Review & Success Criteria

The work order is considered successfully fulfilled when:

1. **Hosted Preview Operates**:
   - Static build deployed and cleanly reviewable at
     `smartgalati-test.mycodespace.ai`.
2. **Clean Scaffolding & Build**:
   - The static site builds cleanly without warnings (`npm run build`).
   - Local preview operates smoothly (`npm run dev`).
3. **Multilingual Architecture**:
   - Romanian (`ro`) configured as default, with framework architecture ready
     to enable additional locales without code rework.
4. **Content Fidelity & Archiving**:
   - All core pages (Despre Noi, Antrenori, Echipe, Performanțe, Contact, Susține
     3.5%) and recent news are converted to well-organized Markdown files.
   - Articles > 2 years old are cleanly routed to `/arhiva/` in navigation and URLs.
5. **Authoring Ergonomics**:
   - Verified that content can be added either via direct GitHub web edits or
     via a lightweight Git-backed visual CMS.
6. **Anti-Spam & Contact Forms**:
   - Configurable Google Form link integrated.
   - Contact phone and email protected from automated scraping via obfuscation.
7. **Modern Visual Design & Mobile Responsiveness**:
   - Professional, responsive layout that completely replaces the old WordPress look.
   - Verified on both mobile screen widths and desktop browsers.
8. **Chess Integration Readiness**:
   - Working demonstration of an embedded Lichess study/board component.
9. **Documentation & Resumability**:
   - `README.md` and `content/README.md` provide crystal-clear authoring
     instructions for non-developers and technical development instructions for
     future engineering sessions.
