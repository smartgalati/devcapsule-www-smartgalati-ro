import { test } from 'node:test';
import assert from 'node:assert/strict';
import { joinBase, stripBase } from '../src/lib/base-path.mjs';

test('root base leaves paths unchanged', () => {
  assert.equal(joinBase('/', '/noutati/'), '/noutati/');
  assert.equal(joinBase('/', '/'), '/');
  assert.equal(stripBase('/', '/noutati/'), '/noutati/');
});

test('project base is prefixed once, with or without its trailing slash', () => {
  assert.equal(joinBase('/repo/', '/noutati/'), '/repo/noutati/');
  assert.equal(joinBase('/repo', '/noutati/'), '/repo/noutati/');
  assert.equal(joinBase('/repo/', '/'), '/repo/');
  assert.equal(joinBase('/repo/', '/licenses/palettes.txt'), '/repo/licenses/palettes.txt');
});

test('stripping the base restores root-relative routes', () => {
  assert.equal(stripBase('/repo/', '/repo/noutati/'), '/noutati/');
  assert.equal(stripBase('/repo/', '/repo/'), '/');
  assert.equal(stripBase('/repo/', '/repo'), '/');
  assert.equal(stripBase('/repo/', '/repository/x/'), '/repository/x/');
});

test('relative paths are rejected so a missing slash cannot hide', () => {
  assert.throws(() => joinBase('/repo/', 'noutati/'));
});
