import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pack, validateCandidate } from '../scripts/candidate.mjs';

const source = {
  tag: 'website-candidate-123-1', repository: 'smartgalati/devcapsule-www-smartgalati-ro',
  runId: '123', runAttempt: '1', sourceSha: 'a'.repeat(40), origin: 'https://test.smartgalati.ro',
};
function site(t, canonical = 'https://test.smartgalati.ro/') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'candidate-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, 'site');
  fs.mkdirSync(path.join(dir, 'contact'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), `<link rel="canonical" href="${canonical}">`);
  fs.writeFileSync(path.join(dir, 'contact', 'index.html'), 'contact');
  return { dir, bundle: path.join(root, 'bundle') };
}

test('pack writes an archive of the exact files and metadata that matches it', (t) => {
  const { dir, bundle } = site(t);
  const candidate = pack(dir, bundle, source);
  const archive = fs.readFileSync(path.join(bundle, 'website.tar.gz'));
  assert.equal(candidate.digest, 'sha256:' + createHash('sha256').update(archive).digest('hex'));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(bundle, 'candidate.json'), 'utf8')), candidate);
  const names = execFileSync('tar', ['-tzf', path.join(bundle, 'website.tar.gz')], { encoding: 'utf8' });
  assert.match(names, /\.\/index\.html/);
  assert.match(names, /\.\/contact\/index\.html/);
  assert.match(fs.readFileSync(path.join(bundle, 'release-notes.txt'), 'utf8'), /website-candidate-123-1/);
});

test('pack refuses a build for another origin or under a base path', (t) => {
  const { dir, bundle } = site(t, 'https://smartgalati.github.io/devcapsule-www-smartgalati-ro/');
  assert.throws(() => pack(dir, bundle, source), /root-path build/);
  assert.equal(fs.existsSync(bundle), false);
});

test('pack refuses symbolic links and an existing bundle', (t) => {
  const { dir, bundle } = site(t);
  fs.mkdirSync(bundle);
  assert.throws(() => pack(dir, bundle, source), /EEXIST/);
  fs.rmdirSync(bundle);
  fs.symlinkSync('/etc/passwd', path.join(dir, 'link'));
  assert.throws(() => pack(dir, bundle, source), /Not an ordinary file/);
});

test('metadata must agree with its tag', () => {
  const good = { schema: 1, ...source, digest: 'sha256:' + 'b'.repeat(64) };
  assert.equal(validateCandidate(good, source.tag), good);
  assert.throws(() => validateCandidate({ ...good, runId: '124' }, source.tag));
  assert.throws(() => validateCandidate({ ...good, origin: 'https://test.smartgalati.ro/' }, source.tag));
  assert.throws(() => validateCandidate(good, 'v1.0.0'));
});
