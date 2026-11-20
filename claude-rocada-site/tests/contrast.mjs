/**
 * WCAG 2 contrast check for every palette in src/styles/themes.css.
 * Fails (exit 1) when a text/background pairing used by the components drops
 * below 4.5:1, or a large-text/UI pairing below 3:1.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const css = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/styles/themes.css'), 'utf8');
const blocks = [...css.matchAll(/\[data-palette='([a-z-]+)'\]\s*\{([^}]+)\}/g)];
const hex = (h) => {
  const m = h.replace('#', '');
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
};
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(hex(a)), lum(hex(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground, background, minimum, description]
const pairs = [
  ['--c-text', '--c-bg', 4.5, 'body text on page'],
  ['--c-text', '--c-surface', 4.5, 'body text on card'],
  ['--c-text', '--c-surface-2', 4.5, 'body text on tinted panel'],
  ['--c-text', '--c-bg-2', 4.5, 'body text on alternate band'],
  ['--c-text-2', '--c-bg', 4.5, 'muted text on page'],
  ['--c-text-2', '--c-surface', 4.5, 'muted text on card'],
  ['--c-text-2', '--c-surface-2', 4.5, 'muted text on tinted panel'],
  ['--c-text-2', '--c-bg-2', 4.5, 'muted text on alternate band'],
  ['--c-heading', '--c-bg', 4.5, 'headings on page'],
  ['--c-heading', '--c-surface', 4.5, 'headings on card'],
  ['--c-heading', '--c-surface-2', 4.5, 'headings on tinted panel'],
  ['--c-link', '--c-bg', 4.5, 'links on page'],
  ['--c-link', '--c-surface', 4.5, 'links on card'],
  ['--c-link', '--c-surface-2', 4.5, 'links on tinted panel'],
  ['--c-link', '--c-bg-2', 4.5, 'links on alternate band'],
  ['--c-primary', '--c-bg-2', 4.5, 'ghost button on alternate band'],
  ['--c-accent-text', '--c-bg-2', 4.5, 'accent text on alternate band'],
  ['--c-accent-text', '--c-bg', 4.5, 'accent text (eyebrows) on page'],
  ['--c-accent-text', '--c-surface', 4.5, 'accent text on card'],
  ['--c-accent-text', '--c-accent-soft', 4.5, 'chip text on chip'],
  ['--c-on-primary', '--c-primary', 4.5, 'button label'],
  ['--c-on-primary', '--c-primary-hover', 4.5, 'button label (hover)'],
  ['--c-primary', '--c-bg', 4.5, 'ghost button / nav text on page'],
  ['--c-primary', '--c-surface', 4.5, 'ghost button on card'],
  ['--c-primary', '--c-surface-2', 4.5, 'ghost button on tinted panel'],
  ['--c-band-text', '--c-band', 4.5, 'header band text'],
  ['--c-band-muted', '--c-band', 4.5, 'header band secondary text'],
  ['--c-band-text', '--c-band-2', 4.5, 'support band text'],
  ['--c-band-muted', '--c-band-2', 4.5, 'support band secondary text'],
  ['--c-band-accent', '--c-band', 4.5, 'band accent text'],
  ['--c-band-accent', '--c-band-2', 4.5, 'support band accent text'],
  ['#1b1408', '--c-accent', 4.5, 'accent button label'],
  ['#1b1408', '--c-band-accent', 4.5, 'band button label'],
  ['--c-focus', '--c-bg', 3, 'focus ring on page'],
  ['--c-focus', '--c-surface', 3, 'focus ring on card'],
  ['--c-focus-band', '--c-band', 3, 'focus ring on band'],
  ['--c-focus-band', '--c-band-2', 3, 'focus ring on support band'],
  ['--c-border-strong', '--c-surface', 3, 'form control border'],
];

let failures = 0;
for (const [, id, body] of blocks) {
  const vars = Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const val = (k) => (k.startsWith('#') ? k : vars[k]);
  let worst = Infinity;
  for (const [fg, bg, min, why] of pairs) {
    const f = val(fg);
    const b = val(bg);
    if (!f || !b || !/^#/.test(f) || !/^#/.test(b)) continue;
    const r = ratio(f, b);
    worst = Math.min(worst, r / min);
    if (r < min) {
      failures++;
      console.log(`FAIL ${id}: ${why} ${f} on ${b} = ${r.toFixed(2)}:1 (min ${min})`);
    }
  }
  console.log(`${id}: ${pairs.length} pairings checked, lowest margin ${(worst * 100).toFixed(0)}% of minimum`);
}
if (failures) {
  console.error(`${failures} contrast failure(s)`);
  process.exit(1);
}
console.log('All palettes pass the token contrast check.');
