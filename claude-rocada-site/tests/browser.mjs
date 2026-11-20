/**
 * Browser regression suite against a running site (default http://localhost:4326).
 * Usage: SITE_URL=https://smartgalati-test4.mycodespace.ai node tests/browser.mjs [screenshot-dir]
 * For a build served under a base path (GitHub Pages project site) set BASE_PATH=/<repository>;
 * SITE_URL stays the origin. Hand-written links in the pages then already carry the prefix.
 */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const origin = (process.env.SITE_URL || 'http://localhost:4326').replace(/\/$/, '');
const prefix = (process.env.BASE_PATH || '').replace(/\/$/, '');
const base = origin + prefix;
const shots = process.argv[2];
if (shots) mkdirSync(shots, { recursive: true });
const failures = [];
const ok = (cond, msg) => (cond ? console.log(`  ok   ${msg}`) : (failures.push(msg), console.log(`  FAIL ${msg}`)));

const routes = [
  '/', '/despre-noi/', '/antrenori/', '/echipe/', '/sportivi/', '/performante/', '/inscrieri/', '/sustine/', '/contact/',
  '/noutati/', '/arhiva/', '/arhiva/2017/', '/galerie/', '/galerie/cantonament-2024/', '/galerie/juniori-2016/', '/sah-online/',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
// The Lichess board is an optional third-party iframe: whatever lichess.org answers (a Cloudflare challenge
// with 403 and X-Frame-Options, as it does for automated browsers since 2026-11) must not fail this site's checks.
// Chromium reports a refused frame against our page from chrome-error://, naming lichess.org only in some messages,
// so count Lichess's refused responses here and forgive that many matching "Failed to load resource" lines at the end.
const lichessRefusals = [];
page.on('response', (r) => r.url().includes('lichess.org') && r.status() >= 400 && lichessRefusals.push(r.status()));
page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && !m.text().includes('lichess.org') && consoleErrors.push(`${page.url()}: ${m.text()}`));
// Errors thrown by lichess.org's own embed scripts inside the iframe are third-party too, like its blocked requests below.
page.on('pageerror', (e) => !(e.stack || '').includes('lichess.org') && consoleErrors.push(`${page.url()}: ${e.message}`));
page.on('requestfailed', (r) => !r.url().includes('lichess') && consoleErrors.push(`${page.url()}: request failed ${r.url()}`));

console.log('Routes and internal links');
const internal = new Set();
const unprefixed = new Set();
for (const r of routes) {
  const res = await page.goto(base + r, { waitUntil: 'networkidle' });
  ok(res?.status() === 200, `${r} -> ${res?.status()}`);
  const h1 = await page.locator('h1').count();
  ok(h1 === 1, `${r} has exactly one h1 (${h1})`);
  ok((await page.getAttribute('html', 'lang')) === 'ro', `${r} lang=ro`);
  const links = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')));
  links.forEach((l) => !l.startsWith(prefix + '/') && unprefixed.add(`${r}: ${l}`));
  links.forEach((l) => internal.add(l.split('#')[0]));
  const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => i.getAttribute('src') && i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').map((i) => i.src));
  ok(broken.length === 0, `${r} has no broken eager images ${broken.join(' ')}`);
}
ok(unprefixed.size === 0, `internal links carry the base path "${prefix || '/'}" ${[...unprefixed].slice(0, 5).join(' ')}`);
let checked = 0;
for (const l of internal) {
  if (l.startsWith(prefix + '/licenses/')) continue;
  const res = await page.request.get(origin + l);
  if (res.status() !== 200) failures.push(`internal link ${l} -> ${res.status()}`);
  checked++;
}
ok(!failures.some((f) => f.startsWith('internal link')), `${checked} internal link targets return 200`);

console.log('Redirect stub for archived article at the old address');
const stub = await page.request.get(base + '/noutati/s-a-facut-istorie-istorie/', { maxRedirects: 0 });
ok(stub.status() === 200 && (await stub.text()).includes('http-equiv="refresh"') && (await stub.text()).includes(`url=${prefix}/arhiva/2023/s-a-facut-istorie-istorie/`), 'old news address of an archived article points to the archive');
const archived = await page.request.get(base + '/arhiva/2023/s-a-facut-istorie-istorie/');
ok(archived.status() === 200, 'archived article renders at /arhiva/2023/...');

console.log('404');
const nf = await page.goto(base + '/pagina-inexistenta/');
ok(nf?.status() === 404 || (await page.locator('h1').textContent())?.includes('Pagina nu există'), `missing page returns 404 (${nf?.status()}) with recovery text`);

console.log('Desktop dropdown: hover, pointer into menu, keyboard');
await page.goto(base + '/', { waitUntil: 'networkidle' });
const trigger = page.locator('[data-dropdown-button]');
await trigger.hover();
const menu = page.locator('#menu-club');
ok(await menu.isVisible(), 'dropdown opens on hover');
const box = await menu.boundingBox();
await page.mouse.move(box.x + 20, box.y + 20);
await page.waitForTimeout(150);
ok(await menu.isVisible(), 'dropdown stays open while the pointer moves into it');
await page.mouse.move(700, 600);
await page.waitForTimeout(150);
await page.keyboard.press('Tab');
await trigger.focus();
await page.keyboard.press('Enter');
ok((await trigger.getAttribute('aria-expanded')) === 'true' && (await menu.isVisible()), 'dropdown opens with Enter and sets aria-expanded');
await page.keyboard.press('Tab');
ok(await page.evaluate(() => document.activeElement?.closest('#menu-club') !== null), 'Tab moves focus into the dropdown');
await page.keyboard.press('Escape');
ok((await trigger.getAttribute('aria-expanded')) === 'false' && (await page.evaluate(() => document.activeElement === document.querySelector('[data-dropdown-button]'))), 'Escape closes and returns focus');

console.log('Contact reveal');
await page.goto(base + '/contact/', { waitUntil: 'networkidle' });
const html = await page.content();
ok(!html.includes('0758 775 206') && !html.includes('smartsah@yahoo.com'), 'plain phone/e-mail absent from initial HTML');
await page.locator('[data-reveal-btn="phone"]').focus();
await page.keyboard.press('Enter');
const tel = page.locator('[data-reveal-out="phone"] a');
ok((await tel.getAttribute('href')) === 'tel:0758775206' && (await tel.textContent()) === '0758 775 206', 'phone revealed by keyboard with tel: link');
await page.locator('[data-reveal-btn="email"]').click();
ok((await page.locator('[data-reveal-out="email"] a').getAttribute('href')) === 'mailto:smartsah@yahoo.com', 'e-mail revealed with mailto: link');

console.log('Gallery lightbox');
await page.goto(base + '/galerie/cantonament-2024/', { waitUntil: 'networkidle' });
const first = page.locator('[data-gallery-item]').first();
ok((await first.getAttribute('href'))?.startsWith(prefix + '/_astro/'), 'thumbnail links to a large image without JavaScript');
await first.click();
const dialog = page.locator('[data-lightbox]');
ok(await dialog.evaluate((d) => d.open), 'lightbox opens');
ok(await page.evaluate(() => document.activeElement === document.querySelector('[data-lightbox-close]')), 'focus moves to the close button');
await page.keyboard.press('ArrowRight');
ok((await page.locator('[data-lightbox-counter]').textContent())?.includes('2 din 20'), 'ArrowRight advances to photo 2');
ok(((await page.locator('[data-lightbox-img]').getAttribute('alt')) || '').length > 10, 'enlarged photo has a descriptive alt');
await page.keyboard.press('Escape');
ok(!(await dialog.evaluate((d) => d.open)), 'Escape closes the lightbox');
ok(await page.evaluate(() => document.activeElement === document.querySelector('[data-gallery-item]')), 'focus returns to the thumbnail');

console.log('Lichess embed');
await page.goto(base + '/sah-online/', { waitUntil: 'networkidle' });
const frame = page.locator('[data-lichess-frame]');
ok((await frame.getAttribute('src'))?.startsWith('https://lichess.org/embed/game/'), 'iframe points to a Lichess game');
ok((await page.locator('a[href^="https://lichess.org/"]').first().getAttribute('href'))?.length > 20, 'direct Lichess link present');
const blocked = await browser.newContext({ viewport: { width: 1200, height: 800 } });
const bp = await blocked.newPage();
await bp.route('**/lichess.org/**', (r) => r.abort());
await bp.goto(base + '/sah-online/', { waitUntil: 'load' });
ok((await bp.locator('h1').textContent()) === 'Șah online' && (await bp.locator('a[href^="https://lichess.org/"]').count()) > 0, 'page and fallback link usable when Lichess is blocked');
await blocked.close();

console.log('Responsive widths: no horizontal overflow, mobile menu');
for (const width of [320, 390, 768, 1024, 1440]) {
  const c = await browser.newContext({ viewport: { width, height: 900 } });
  const p = await c.newPage();
  for (const r of ['/', '/noutati/', '/arhiva/', '/antrenori/', '/echipe/', '/contact/', '/galerie/cantonament-2024/', '/performante/']) {
    await p.goto(base + r, { waitUntil: 'networkidle' });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over <= 0, `${width}px ${r} no horizontal overflow (${over}px)`);
    if (shots && (r === '/' || r === '/noutati/')) await p.screenshot({ path: `${shots}/w${width}${r.replace(/\//g, '_')}.png`, fullPage: r === '/' });
  }
  if (width <= 768) {
    await p.goto(base + '/', { waitUntil: 'networkidle' });
    const toggle = p.locator('[data-menu-toggle]');
    ok(await toggle.isVisible(), `${width}px menu toggle visible`);
    await toggle.click();
    ok(await p.locator('#mobile-menu').isVisible() && (await p.locator('#palette-mobile').isVisible()), `${width}px mobile menu opens with palette control`);
    await p.keyboard.press('Escape');
    ok(!(await p.locator('#mobile-menu').isVisible()), `${width}px Escape closes the mobile menu`);
  }
  await c.close();
}

console.log('Zoom 200% (viewport 720x450 as proxy) keeps navigation usable');
{
  const c = await browser.newContext({ viewport: { width: 720, height: 450 } });
  const p = await c.newPage();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(over <= 0, 'no horizontal overflow at 720px');
  ok(await p.locator('[data-menu-toggle]').isVisible(), 'compact menu shown at 720px');
  await c.close();
}

console.log('Accessibility (axe, default palette)');
for (const r of ['/', '/noutati/', '/contact/', '/galerie/cantonament-2024/', '/arhiva/', '/antrenori/']) {
  await page.goto(base + r, { waitUntil: 'networkidle' });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).exclude('iframe').analyze();
  const own = results.violations.filter((v) => !v.nodes.every((n) => n.target.join(' ').includes('lichess')));
  ok(own.length === 0, `${r} axe violations: ${own.map((v) => `${v.id}(${v.nodes.length})`).join(', ') || 'none'}`);
}

for (const status of lichessRefusals) {
  const i = consoleErrors.findIndex((e) => e.includes(`Failed to load resource: the server responded with a status of ${status}`));
  if (i >= 0) consoleErrors.splice(i, 1);
}
ok(consoleErrors.length === 0, `no console/page errors (${consoleErrors.slice(0, 5).join(' | ')})`);
await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s):\n- ${failures.join('\n- ')}` : '\nAll browser checks passed.');
process.exit(failures.length ? 1 : 0);
