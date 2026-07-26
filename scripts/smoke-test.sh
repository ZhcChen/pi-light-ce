#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TMP_DIR="$(mktemp -d)"
PACK_FILE=""

cleanup() {
  rm -rf "$TMP_DIR"
  if [[ -n "$PACK_FILE" && -f "$PACK_FILE" ]]; then
    rm -f "$PACK_FILE"
  fi
}
trap cleanup EXIT

cd "$REPO_ROOT"

node ./bin/pi-l-ce --help >/dev/null
node ./bin/pi-l-ce init "$TMP_DIR" >/dev/null

required_files=(
  "$TMP_DIR/AGENTS.md"
  "$TMP_DIR/docs/brainstorms/TEMPLATE.md"
  "$TMP_DIR/docs/plans/TEMPLATE.md"
  "$TMP_DIR/docs/solutions/TEMPLATE.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing expected file: $file" >&2
    exit 1
  fi
done

PACK_NAME="$(npm pack --silent)"
PACK_FILE="$REPO_ROOT/$PACK_NAME"

if [[ ! -f "$PACK_FILE" ]]; then
  echo "npm pack did not produce $PACK_FILE" >&2
  exit 1
fi

package_entries=(
  "package/bin/pi-l-ce"
  "package/lib/cli.js"
  "package/templates/project/PLCE_AGENTS.md"
  "package/templates/project/docs/brainstorms/TEMPLATE.md"
  "package/templates/project/docs/plans/TEMPLATE.md"
  "package/templates/project/docs/solutions/TEMPLATE.md"
)

pack_listing="$(tar -tf "$PACK_FILE")"
for entry in "${package_entries[@]}"; do
  if ! printf '%s\n' "$pack_listing" | grep -Fx "$entry" >/dev/null 2>&1; then
    echo "Missing expected package entry: $entry" >&2
    exit 1
  fi
done

echo "smoke test passed"
