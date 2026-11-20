/**
 * Contact obfuscation helpers. The stored value is the reversed plain text;
 * the browser reverses it back on demand. This defeats naive scrapers that grep
 * HTML for phone/e-mail patterns, but not a scraper that executes JavaScript.
 */
export function encodeReversed(value: string): string {
  return Array.from(value).reverse().join('');
}
export function decodeReversed(value: string): string {
  return Array.from(value).reverse().join('');
}
