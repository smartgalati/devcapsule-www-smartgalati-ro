/** Palette suite: every palette × representative pages, axe contrast, persistence, blocked storage. */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { palettes, STORAGE_KEY, defaultPalette } from '../src/lib/palettes.ts';

const base = (process.env.SITE_URL || 'http://localhost:4326').replace(/\/$/, '') + (process.env.BASE_PATH || '').replace(/\/$/, '');
const shots = process.argv[2];
if (shots) mkdirSync(shots, { recursive: true });
const failures = [];
const ok = (cond, msg) => (cond ? console.log(`  ok   ${msg}`) : (failures.push(msg), console.log(`  FAIL ${msg}`)));
const browser = await chromium.launch();

console.log('Every palette: applied, persisted, axe-clean on three pages');
for (const pal of palettes) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.selectOption('#palette-desktop', pal.id);
  ok((await page.getAttribute('html', 'data-palette')) === pal.id, `${pal.id} applied from desktop select`);
  ok((await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)) === pal.id, `${pal.id} stored`);
  for (const r of ['/', '/noutati/', '/contact/']) {
    await page.goto(base + r, { waitUntil: 'networkidle' });
    ok((await page.getAttribute('html', 'data-palette')) === pal.id, `${pal.id} restored on ${r}`);
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).exclude('iframe').analyze();
    ok(res.violations.length === 0, `${pal.id} ${r} axe: ${res.violations.map((v) => `${v.id}(${v.nodes.length})`).join(', ') || 'none'}`);
    if (shots && r === '/') await page.screenshot({ path: `${shots}/${pal.id}.png`, fullPage: false });
  }
  await ctx.close();
}

console.log('Early restoration before body scripts');
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript((k) => localStorage.setItem(k, 'nord'), STORAGE_KEY);
  await page.route('**/*.js', (r) => r.abort());
  await page.goto(base + '/noutati/', { waitUntil: 'domcontentloaded' });
  ok((await page.getAttribute('html', 'data-palette')) === 'nord', 'stored palette applied by the head script even with bundled JS blocked');
  await ctx.close();
}

console.log('Invalid stored value falls back to the default');
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript((k) => localStorage.setItem(k, 'nu-exista'), STORAGE_KEY);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  ok((await page.getAttribute('html', 'data-palette')) === defaultPalette, 'unknown value -> default palette');
  await ctx.close();
}

console.log('Blocked storage: switching still works on the page');
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.selectOption('#palette-desktop', 'solarized-light');
  ok((await page.getAttribute('html', 'data-palette')) === 'solarized-light' && errors.length === 0, 'palette switches without storage and without page errors');
  await ctx.close();
}

console.log('Mobile select and cross-tab sync');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.locator('[data-menu-toggle]').click();
  await page.selectOption('#palette-mobile', 'catppuccin-latte');
  ok((await page.getAttribute('html', 'data-palette')) === 'catppuccin-latte', 'mobile select applies palette');
  const other = await ctx.newPage();
  await other.goto(base + '/contact/', { waitUntil: 'networkidle' });
  ok((await other.getAttribute('html', 'data-palette')) === 'catppuccin-latte', 'second tab starts with the stored palette');
  await page.selectOption('#palette-mobile', 'nord');
  await other.waitForTimeout(300);
  ok((await other.getAttribute('html', 'data-palette')) === 'nord' && (await other.inputValue('#palette-desktop')) === 'nord', 'storage event syncs the other tab and its select');
  await ctx.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s):\n- ${failures.join('\n- ')}` : '\nAll palette checks passed.');
process.exit(failures.length ? 1 : 0);
