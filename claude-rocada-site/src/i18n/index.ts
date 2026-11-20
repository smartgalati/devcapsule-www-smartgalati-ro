import { ro } from './ro';

/**
 * i18n scaffolding. Romanian is the only delivered locale; to add English:
 *  1. copy `ro.ts` to `en.ts` and translate,
 *  2. register it below and in `astro.config.mjs` (`i18n.locales`),
 *  3. add `content/<collection>/en/` files or a `lang` field, and pages under `src/pages/en/`.
 */
export const locales = { ro } as const;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'ro';

export function t(locale: Locale = defaultLocale) {
  return locales[locale];
}

export function formatDate(date: Date, locale: Locale = defaultLocale, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locales[locale].dates.locale, {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  }).format(date);
}
