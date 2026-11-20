import { defineConfig } from 'astro/config';

// Static output only. The public address defaults to the original preview address;
// the GitHub Pages build sets
// ROCADA_SITE (origin) and ROCADA_BASE (project path such as /devcapsule-www-smartgalati-ro)
// through scripts/pages.sh. Internal links read the base via src/lib/url.ts.
const site = process.env.ROCADA_SITE || 'https://smartgalati-test4.mycodespace.ai';
const base = (process.env.ROCADA_BASE || '/').replace(/\/+$/, '') || '/';
const prefix = base === '/' ? '' : base;

/**
 * Rehype plugin: prefix root-relative `href`/`src` values in rendered Markdown
 * (`[arhiva](/arhiva/)` in content/) with the base, mirroring what src/lib/url.ts
 * does for component links. No-op at the root base. Self-contained walker, no extra
 * dependency; protocol-relative `//host` URLs are left alone.
 */
function rehypeBasePrefix() {
  const fix = (node) => {
    if (node.type === 'element' && node.properties) {
      for (const key of ['href', 'src']) {
        const value = node.properties[key];
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
          node.properties[key] = prefix + value;
        }
      }
    }
    for (const child of node.children || []) fix(child);
  };
  return (tree) => {
    if (prefix) fix(tree);
  };
}

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro'],
    routing: { prefixDefaultLocale: false },
  },
  devToolbar: { enabled: false },
  markdown: { rehypePlugins: [rehypeBasePrefix] },
});
