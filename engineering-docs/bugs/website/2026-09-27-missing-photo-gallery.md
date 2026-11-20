---
status: closed
severity: minor
target: none
owner: maintenance
opened: 2026-09-27
closed: 2026-09-27
requirements: []
---

# Bug: Missing Photo Gallery (/galerie-foto)

## Symptom

During the initial site migration from the legacy WordPress website (https://smartgalati.ro/), the photo gallery page (`/galerie-foto/`) and its albums were not migrated to the Astro static website. The page is missing, and no link exists in the header navigation or footer.

## Environment

- Framework: Astro 5 (`ag-flash3.8-site/`)
- Branch: `ws-maintenance/missing-photo-gallery`
- Source Reference: https://smartgalati.ro/galerie-foto/

## Reproduction

1. Visit legacy site at `https://smartgalati.ro/galerie-foto/` -> contains albums for Campionatul de Șah pentru Juniori 2016 (7 photos), Festivalul FISCA Cap Aurora 2022 (24 photos), and Cantonament ACS Smart Galați 2024 (20 photos).
2. Visit new site navigation or attempt to navigate to `/galerie-foto` -> 404 Not Found, missing from navigation menus.

Expected:
The photo gallery is available at `/galerie-foto`, accessible via the navigation header (under "Clubul Nostru") and footer, displaying the club's photo albums with clean categorization, responsive grid, and lightbox view.

Actual:
Route `/galerie-foto` does not exist.

## Evidence

- Source page inspection of `https://smartgalati.ro/galerie-foto/` shows 3 active albums managed by the `wp-photo-album-plus` plugin:
  1. Album 3: "Campionatul de sah pentru juniori 2016" (7 photos)
  2. Album 6: "FESTIVALUL FISCA, CAP AURORA, IUNIE 2022" (24 photos)
  3. Album 7: "Cantonament ACS Smart Galati 2024" (20 photos)

## Resolution & Close Verification

1. **Asset Bundling**:
   - Downloaded and cataloged all 51 photos across all 3 albums from the legacy server to `ag-flash3.8-site/public/images/galerie/`.
   - Created metadata catalog in `ag-flash3.8-site/src/data/galerie.json` with Romanian descriptive titles, locations, and album years.
2. **Page Implementation**:
   - Created `ag-flash3.8-site/src/pages/galerie-foto.astro` featuring:
     - Hero stats and album overview cards.
     - Interactive filter tabs (Toate, Cantonament Bran 2024, Festivalul FISCA 2022, Juniori 2016).
     - Responsive grid with hover preview cards.
     - Pure vanilla JS accessible Lightbox modal with keyboard controls (Esc, ArrowLeft, ArrowRight) and photo counter.
3. **Navigation Integration**:
   - Added "📷 Galerie Foto" to the desktop header dropdown under *Clubul Nostru*.
   - Added link to mobile navigation drawer.
   - Added link to footer under *Comunitate & Resurse*.
4. **Verification**:
   - Ran `astro check && astro build`: 19 pages built in ~2.0s with 0 errors, 0 warnings, and 0 hints.

## Close Criteria

Done means:
1. Route `/galerie-foto` is implemented in Astro matching the modern design system with theme switching support.
2. Photo gallery includes all 3 albums with filter tabs (Toate, Cantonament Bran 2024, Festivalul FISCA 2022, Juniori 2016).
3. Image modal / lightbox allows viewing full-size images and cycling through photos.
4. Navigation updated in `Layout.astro` (header dropdown, mobile drawer, and footer).
5. Build succeeds cleanly with 0 errors and 0 warnings (`npm run build`).

Verification:
- Run `npm run build` in `ag-flash3.8-site`.
- Check all routes and verify asset loading.

Reopen if:
Photos or albums are missing, or links are broken on `/galerie-foto`.
