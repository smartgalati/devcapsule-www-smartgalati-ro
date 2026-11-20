/**
 * Rolling two-year archive boundary, computed on UTC calendar dates only.
 * Plain JavaScript so the same code runs in Astro and in `node --test`.
 */

/** Date-only UTC timestamp `years` before `now`; 29 February clamps to 28 February. */
export function cutoffTimestamp(now = new Date(), years = 2) {
  const year = now.getUTCFullYear() - years;
  const month = now.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(now.getUTCDate(), lastDay);
  return Date.UTC(year, month, day);
}

/** True when `date` is strictly older than the cutoff. An item exactly two years old stays current. */
export function isArchived(date, now = new Date(), years = 2) {
  return new Date(date).getTime() < cutoffTimestamp(now, years);
}

/** Public URL slug of a news file: strips the leading `YYYY-MM-DD-` prefix. */
export function newsSlug(id) {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/** Canonical path of a news entry given the build date. */
export function newsPath(id, date, now = new Date(), years = 2) {
  const d = new Date(date);
  return isArchived(d, now, years)
    ? `/arhiva/${d.getUTCFullYear()}/${newsSlug(id)}/`
    : `/noutati/${newsSlug(id)}/`;
}
