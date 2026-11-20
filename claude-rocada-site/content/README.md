# Ghid de conținut — ACS Smart Galați (varianta „Rocada”)

Tot ce se vede pe site este scris în fișiere Markdown din `claude-rocada-site/content/`.
Le poți edita din IDE sau direct pe GitHub, fără să atingi componentele. La `npm run build`
câmpurile din antet (între liniile `---`) sunt verificate; o greșeală oprește publicarea cu
un mesaj care spune fișierul și câmpul.

## Ce fișier editez?

| Director | Conținut | Adresă |
|---|---|---|
| `home/prima-pagina.md` | Titlul, textul introductiv, cele trei „piloni” și banda „Susține” | `/` |
| `pages/` | Despre noi, Echipe, Sportivi, Înscrieri, Susține, Contact | `/nume-fisier/` |
| `coaches/` | Un fișier pentru fiecare antrenor; `order` dă ordinea | `/antrenori/` |
| `performances/` | Rezultate confirmate, ordonate după `order` | `/performante/` |
| `news/` | Articole; numele începe cu data: `AAAA-LL-ZZ-titlu.md` | `/noutati/titlu/` sau `/arhiva/AN/titlu/` |
| `galleries/` | Albume foto locale sau externe | `/galerie/nume/` |

Fișierele `_template.md` din fiecare director sunt modele de copiat; nu se publică.

## Publică o știre

1. Copiază `news/_template.md` în `news/2026-10-05-cupa-toamnei.md` (data reală, apoi un
   titlu scurt fără diacritice și spații).
2. Completează `title`, `date`, `summary`; opțional `tags`, `album_url` (album public
   Google Photos), `lichess_url` (studiu sau partidă), `cover_image`.
3. Pentru copertă adaugă un JPG în `src/assets/news/` și scrie doar numele fișierului în
   `cover_image`. Folosește fotografii pentru care clubul are drept de publicare.
4. Scrie textul sub a doua linie `---`: `##` pentru subtitluri, `**îngroșat**`,
   `[text](https://...)` pentru linkuri, `-` pentru liste.
5. Verifică local cu `npm run dev` (http://localhost:4325), apoi salvează. Publicarea
   este automată: orice modificare ajunsă pe ramura `main` din GitHub este verificată
   și publicată pe site în câteva minute.

Adresa articolului se formează din numele fișierului fără dată. Nu redenumi articole
publicate: adresa se schimbă.

## Arhiva automată

La fiecare build, articolele cu data mai veche de doi ani față de ziua buildului (calendar
UTC) apar în `/arhiva/AN/…/`, iar cele mai noi în `/noutati/`. Un articol exact la limita
de doi ani rămâne la noutăți. Site-ul fiind static, limita avansează doar când site-ul este
republicat, nu singur la miezul nopții. Nu muta fișiere manual; când un articol trece în
arhivă, vechea adresă din `/noutati/` trimite automat la cea din arhivă.

## Antrenori

Copiază `coaches/_template.md`; fotografia se pune în `src/assets/coaches/` și numele ei în
`photo`. `title` (titlul sau categoria) și `rating` (Elo publicat) sunt opționale.

## Performanțe

Un fișier pe rezultat, cu `year`, `category`, `result`, `order` și, recomandat, `source_url`
către articolul-sursă. Doar rezultate confirmate; nu inventa medalii sau clasări.

## Albume foto

Copiază `galleries/_template.md`. Pentru câteva fotografii, pune-le în `src/assets/photos/`
și listează-le în `photos` cu un `alt` care descrie ce se vede (necesar pentru cititorii
de ecran). Pentru evenimente cu multe fotografii, folosește `album_url` (album public) și
o singură copertă locală — depozitul rămâne mic. Fotografiile locale sunt optimizate
automat (WebP, mai multe dimensiuni).

## Contact și formular

Telefonul și e-mailul sunt în `src/config/site.ts`, scrise invers, și se afișează doar
la apăsarea butoanelor din pagina Contact. Nu le scrie în Markdown dacă vrei să păstrezi
protecția simplă împotriva colectării automate (nu protejează de roboți care execută
JavaScript). Adresa formularului de înscriere, `https://forms.gle/smartgalati-inscriere`,
este păstrată intenționat la cererea proprietarului, deși nu funcționează acum.

## Palete de culori

Culorile sunt în `src/styles/themes.css` (un bloc per paletă), mărimile de text în
`src/styles/tokens.css`. După orice schimbare rulează `npm run test:contrast`.

## De unde vine conținutul

Textele paginilor, profilurile antrenorilor, componența echipelor, rezultatele și cele 134 de
articole (2016–2025) provin din site-ul existent al clubului (`smartgalati.ro`), cu
`source_url` în fiecare fișier. Fotografiile din galerie (51) sunt cele trei albume ale
site-ului vechi; copertele articolelor din 2024–2025 sunt prima fotografie a articolului
original. La conversie s-au eliminat linkurile către profiluri Facebook personale, iar
numerele de telefon, adresele de e-mail și un cont bancar din anunțuri vechi au fost
înlocuite cu „vezi pagina Contact”.

## De verificat cu clubul

- Ratingurile Elo și titlurile din paginile Antrenori, Echipe și Sportivi sunt cele publicate
  de club la data respectivă, nu valori curente.
- Componența echipelor de seniori (2017) și loturile de juniori (2018) sunt istorice.
- Programul grupelor și cotizațiile nu sunt publicate; pagina Înscrieri trimite la contact.
- Datele fiscale ale asociației pentru Formularul 230 nu sunt publicate pe site; pagina
  Susține trimite la platforma `redirectioneaza.ro` și la ANAF.
- Titlurile unor articole vechi au stilul original al clubului (majuscule, exclamări).
