/**
 * Site-wide settings that editors may need to change without touching components.
 * Contact values are stored encoded (see src/lib/contact.ts) so that the plain
 * phone/e-mail never appear in the generated HTML; they are decoded on click.
 */
export const site = {
  name: 'ACS Smart Galați',
  shortName: 'Smart Galați',
  legalName: 'Asociația Club Sportiv Smart Galați',
  tagline: 'Club de șah din Galați, fondat în 2014',
  url: 'https://smartgalati-test4.mycodespace.ai',
  originalSite: 'https://smartgalati.ro/',
  /** Fixed by the owner; known not to work at the moment. Do not replace. */
  enrollmentUrl: 'https://forms.gle/smartgalati-inscriere',
  redirectUrl: 'https://redirectioneaza.ro/acs-smart-galati',
  anafForm230Url: 'https://static.anaf.ro/static/10/Anaf/Declaratii_R/230.html',
  frsahPortalUrl: 'https://portal.frsah.ro/',
  /** Public contact details from smartgalati.ro/contact, base64 of reversed text. */
  contact: {
    phone: '602 577 8570',
    email: 'moc.oohay@hastrams',
  },
  /** Lichess demonstration: a public game; the page also links to it directly. */
  lichess: {
    gameId: 'MPJcy1JW',
  },
  /** News older than this many years (rolling, by calendar date) move to the archive. */
  archiveYears: 2,
} as const;
