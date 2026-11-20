/**
 * Build-time binding of the base-path helpers to Astro's `base` setting.
 * `import.meta.env.BASE_URL` is `/` for a root-path or custom-domain build and
 * `/<repository>/` for a GitHub Pages project site (see astro.config.mjs).
 */
import { joinBase, stripBase as strip } from './base-path.mjs';

const BASE: string = import.meta.env.BASE_URL;

/** Internal link target: `withBase('/noutati/')`. Use for every hand-written internal href. */
export const withBase = (path: string): string => joinBase(BASE, path);

/** Root-relative form of `Astro.url.pathname`, for active-link checks. */
export const stripBase = (pathname: string): string => strip(BASE, pathname);
