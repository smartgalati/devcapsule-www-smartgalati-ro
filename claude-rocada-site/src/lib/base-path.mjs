/**
 * Base-path helpers, plain JavaScript so the same code runs in Astro and in
 * `node --test`. The site is normally served at the origin root (`base` is `/`);
 * on a GitHub Pages project site it lives under `/<repository>/`, and every
 * internal link must carry that prefix. Astro adds it to optimized images, CSS
 * and `Astro.url`, but not to hand-written `href` values.
 */

/** Trim trailing slashes: `/repo/` → `/repo`, `/` → ``. */
function prefixOf(base) {
  return (base || '/').replace(/\/+$/, '');
}

/** Prefix a root-relative path (`/noutati/`) with the base (`/repo/` → `/repo/noutati/`). */
export function joinBase(base, path) {
  if (!path.startsWith('/')) throw new Error(`joinBase expects a root-relative path, got "${path}"`);
  return prefixOf(base) + path;
}

/** Remove the base from a pathname so route checks can compare root-relative paths. */
export function stripBase(base, pathname) {
  const prefix = prefixOf(base);
  if (!prefix) return pathname;
  if (pathname === prefix) return '/';
  return pathname.startsWith(prefix + '/') ? pathname.slice(prefix.length) : pathname;
}
