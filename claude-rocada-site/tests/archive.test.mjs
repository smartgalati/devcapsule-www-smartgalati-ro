import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cutoffTimestamp, isArchived, newsPath, newsSlug } from '../src/lib/archive.mjs';

const at = (iso) => new Date(iso + 'T12:00:00Z');

test('cutoff is exactly two years earlier on the UTC calendar', () => {
  assert.equal(cutoffTimestamp(at('2026-09-27')), Date.UTC(2024, 8, 27));
});

test('the boundary day stays current; the day before is archived', () => {
  const now = at('2026-09-27');
  assert.equal(isArchived(at('2024-09-27'), now), false);
  assert.equal(isArchived(at('2024-09-26'), now), true);
  assert.equal(isArchived(at('2024-09-28'), now), false);
});

test('leap day clamps to 28 February in non-leap years', () => {
  const now = at('2026-02-28');
  assert.equal(cutoffTimestamp(now), Date.UTC(2024, 1, 28));
  const leap = at('2028-02-29');
  assert.equal(cutoffTimestamp(leap), Date.UTC(2026, 1, 28));
});

test('build time of day never changes the verdict', () => {
  const early = new Date('2026-09-27T00:00:01Z');
  const late = new Date('2026-09-27T23:59:59Z');
  assert.equal(isArchived(at('2024-09-27'), early), isArchived(at('2024-09-27'), late));
});

test('archive window is configurable', () => {
  assert.equal(isArchived(at('2023-01-01'), at('2026-09-27'), 5), false);
});

test('slugs drop the date prefix and paths route by archive state', () => {
  assert.equal(newsSlug('2025-02-09-editia-a-2-a-de-blitz'), 'editia-a-2-a-de-blitz');
  assert.equal(newsPath('2025-02-09-editia-a-2-a-de-blitz', at('2025-02-09'), at('2026-09-27')), '/noutati/editia-a-2-a-de-blitz/');
  assert.equal(newsPath('2023-10-02-s-a-facut-istorie', at('2023-10-02'), at('2026-09-27')), '/arhiva/2023/s-a-facut-istorie/');
});
