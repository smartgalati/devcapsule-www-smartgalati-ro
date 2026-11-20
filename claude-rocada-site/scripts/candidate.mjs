// Package the exact files a successful test deployment published as a "website candidate":
// website.tar.gz plus candidate.json (source revision, run, test origin, archive SHA-256).
// The production repository promotes a candidate by tag; see docs/publishing.md.
//   CANDIDATE_TAG=website-candidate-<run>-<attempt> node scripts/candidate.mjs pack <site-dir> <bundle-dir>
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const TAG_PATTERN = /^website-candidate-[1-9][0-9]*-[1-9][0-9]*$/;
const digest = (bytes) => 'sha256:' + createHash('sha256').update(bytes).digest('hex');

export function validateCandidate(candidate, tag) {
  assert.match(tag, TAG_PATTERN);
  assert.equal(candidate.schema, 1);
  assert.equal(candidate.tag, tag);
  assert.equal(tag, `website-candidate-${candidate.runId}-${candidate.runAttempt}`);
  assert.match(candidate.repository, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
  assert.match(candidate.sourceSha, /^[a-f0-9]{40}$/);
  assert.match(candidate.origin, /^https?:\/\/[a-z0-9.-]+$/, 'origin must be a scheme and host, no path or trailing slash');
  assert.match(candidate.digest, /^sha256:[a-f0-9]{64}$/);
  return candidate;
}

/** Only ordinary files and directories with plain names: what a static site needs, nothing a tar could abuse. */
function validateFiles(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = prefix + entry.name;
    assert(/^[A-Za-z0-9_.@~+ -]+$/.test(entry.name) && entry.name !== '..', `Unsupported file name: ${name}`);
    assert(entry.isFile() || entry.isDirectory(), `Not an ordinary file or directory: ${name}`);
    if (entry.isDirectory()) validateFiles(path.join(dir, entry.name), name + '/');
  }
}

export function pack(siteDir, bundleDir, source) {
  assert(fs.existsSync(path.join(siteDir, 'index.html')), `${siteDir} is not a built site`);
  validateFiles(siteDir);
  // A candidate must be a root-path build: promotion only swaps the origin, it cannot move a base path.
  const home = fs.readFileSync(path.join(siteDir, 'index.html'), 'utf8');
  assert(home.includes(`<link rel="canonical" href="${source.origin}/"`),
    `index.html is not a root-path build for ${source.origin}`);
  fs.mkdirSync(bundleDir); // Refuse to replace an existing bundle.
  const archive = path.join(bundleDir, 'website.tar.gz');
  execFileSync('tar', ['-czf', archive, '--format=ustar', '-C', siteDir, '.']);
  const candidate = validateCandidate({ schema: 1, ...source, digest: digest(fs.readFileSync(archive)) }, source.tag);
  fs.writeFileSync(path.join(bundleDir, 'candidate.json'), JSON.stringify(candidate, null, 2) + '\n');
  fs.writeFileSync(path.join(bundleDir, 'release-notes.txt'),
    `Website candidate: the exact files of a successful test deployment.\n\n` +
    `Test site: ${source.origin}/\n` +
    `Test run: https://github.com/${source.repository}/actions/runs/${source.runId}/attempts/${source.runAttempt}\n` +
    `Source: ${source.sourceSha}\n` +
    `SHA-256 (website.tar.gz): ${candidate.digest.slice(7)}\n\n` +
    `Review the test site, then enter ${source.tag} in the production repository's publish workflow.\n`);
  return candidate;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  assert.equal(process.argv[2], 'pack', 'Usage: candidate.mjs pack <site-dir> <bundle-dir>');
  const candidate = pack(path.resolve(process.argv[3] || 'candidate-site'), path.resolve(process.argv[4] || 'candidate-bundle'), {
    tag: process.env.CANDIDATE_TAG,
    repository: process.env.GITHUB_REPOSITORY,
    runId: process.env.GITHUB_RUN_ID,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT,
    sourceSha: process.env.GITHUB_SHA,
    origin: (process.env.CANDIDATE_ORIGIN || '').replace(/\/+$/, ''),
  });
  console.log(`Candidate ${candidate.tag}: ${candidate.digest}`);
}
