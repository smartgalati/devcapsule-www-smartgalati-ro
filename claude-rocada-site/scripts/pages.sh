#!/usr/bin/env bash
# GitHub Pages build and local check for the Rocada candidate.
#   npm run pages:build              # dist/ built for the Pages address (origin + base path)
#   npm run pages:check [shot-dir]   # serve dist/ with astro preview on 127.0.0.1:4336 (PAGES_CHECK_PORT), run browser + palette suites under the base path
# The address comes from PAGES_SITE_URL and PAGES_BASE_PATH (set from actions/configure-pages in
# CI). Locally they default to the origin remote: https://<owner>.github.io and /<repository>.
# A custom domain is PAGES_SITE_URL=https://<domain> with PAGES_BASE_PATH= (empty).
# Publishing itself is done by .github/workflows/claude-rocada-pages.yml; see docs/github-pages-deployment.md.
set -euo pipefail
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${SITE_ROOT}"

if [[ -z "${PAGES_SITE_URL:-}" ]]; then
  remote="$(git config --get remote.origin.url || true)"
  remote="${remote%.git}"
  if [[ "${remote}" =~ github\.com[:/]([^/]+)/([^/]+)$ ]]; then
    owner="${BASH_REMATCH[1],,}"
    repo="${BASH_REMATCH[2]}"
    PAGES_SITE_URL="https://${owner}.github.io"
    if [[ "${repo,,}" == "${owner}.github.io" ]]; then PAGES_BASE_PATH=""; else PAGES_BASE_PATH="/${repo}"; fi
  else
    echo 'origin is not a GitHub remote; set PAGES_SITE_URL (and PAGES_BASE_PATH) explicitly' >&2
    exit 2
  fi
fi
PAGES_BASE_PATH="${PAGES_BASE_PATH:-}"
PAGES_BASE_PATH="${PAGES_BASE_PATH%/}"
if [[ -n "${PAGES_BASE_PATH}" && "${PAGES_BASE_PATH}" != /* ]]; then PAGES_BASE_PATH="/${PAGES_BASE_PATH}"; fi
export ROCADA_SITE="${PAGES_SITE_URL%/}"
export ROCADA_BASE="${PAGES_BASE_PATH:-/}"
echo "Pages target: ${ROCADA_SITE}${PAGES_BASE_PATH}/"

case "${1:-build}" in
  build)
    npm run build
    ;;
  check)
    [[ -d dist ]] || { echo 'dist/ is missing; run `npm run pages:build` first' >&2; exit 2; }
    port="${PAGES_CHECK_PORT:-4336}"
    if curl --silent --output /dev/null "http://127.0.0.1:${port}/"; then
      echo "port ${port} is already in use; stop that server or set PAGES_CHECK_PORT" >&2; exit 2
    fi
    log="$(mktemp -t rocada-pages-preview.XXXXXX.log)"
    # Run astro directly (not through npx) so the PID we stop is the server itself.
    node node_modules/astro/astro.js preview --host 127.0.0.1 --port "${port}" >"${log}" 2>&1 &
    preview=$!
    trap 'kill "${preview}" 2>/dev/null || true' EXIT
    for _ in $(seq 1 30); do
      curl --fail --silent "http://127.0.0.1:${port}${PAGES_BASE_PATH}/" >/dev/null && break
      sleep 1
    done
    curl --fail --silent "http://127.0.0.1:${port}${PAGES_BASE_PATH}/" >/dev/null || { echo "preview did not start; see ${log}" >&2; exit 1; }
    export SITE_URL="http://127.0.0.1:${port}" BASE_PATH="${PAGES_BASE_PATH}"
    node tests/browser.mjs ${2:+"$2"}
    node tests/themes.mjs ${2:+"$2"}
    ;;
  *) echo 'Usage: npm run pages:build | npm run pages:check [screenshot-dir]' >&2; exit 2 ;;
esac
