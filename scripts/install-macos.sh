#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${PI_L_CE_REPO_URL:-https://github.com/ZhcChen/pi-light-ce.git}"
INSTALL_ROOT="${HOME}/.pi-l-ce"
REPO_DIR="${INSTALL_ROOT}/repo"
USER_BIN="${HOME}/.local/bin"
PRIMARY_WRAPPER_PATH="${USER_BIN}/pi-l-ce"

node_major_version() {
  if ! command -v node >/dev/null 2>&1; then
    printf '0\n'
    return 1
  fi

  node -p 'Number(process.versions.node.split(".")[0])' 2>/dev/null || printf '0\n'
}

log() {
  printf '==> %s\n' "$*"
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

ensure_brew() {
  if command -v brew >/dev/null 2>&1; then
    return 0
  fi

  fail "Homebrew is required on macOS for this installer. Install Homebrew first, then rerun this script."
}

install_brew_package_if_missing() {
  local command_name="$1"
  local package_name="$2"

  if command -v "$command_name" >/dev/null 2>&1; then
    return 0
  fi

  log "Installing ${package_name} via Homebrew"
  brew install "$package_name"
}

install_pi_if_missing() {
  if command -v pi >/dev/null 2>&1; then
    return 0
  fi

  log "Installing pi-coding-agent via Homebrew"
  brew install pi-coding-agent
}

ensure_supported_node() {
  local node_major

  node_major="$(node_major_version || true)"
  if [[ "$node_major" -ge 18 ]]; then
    return 0
  fi

  fail "Node.js 18 or newer is required. Detected $(node --version 2>/dev/null || printf 'unknown'). Upgrade Node.js, then rerun this script."
}

clone_or_update_repo() {
  mkdir -p "$INSTALL_ROOT"

  if [[ -d "$REPO_DIR/.git" ]]; then
    log "Updating existing repository in $REPO_DIR"
    git -C "$REPO_DIR" pull --ff-only
    return 0
  fi

  rm -rf "$REPO_DIR"
  log "Cloning repository into $REPO_DIR"
  git clone "$REPO_URL" "$REPO_DIR"
}

create_wrappers() {
  mkdir -p "$USER_BIN"

  cat > "$PRIMARY_WRAPPER_PATH" <<EOF
#!/usr/bin/env bash
set -euo pipefail
exec node "$REPO_DIR/bin/pi-l-ce" "\$@"
EOF

  local legacy_wrapper_path="${USER_BIN}/pi-l-ce-init"
  if [[ -e "$legacy_wrapper_path" ]]; then
    rm -f "$legacy_wrapper_path"
  fi

  chmod +x "$PRIMARY_WRAPPER_PATH"
  log "Installed command wrapper at $PRIMARY_WRAPPER_PATH"
}

ensure_path() {
  local shell_rc
  local line='export PATH="$HOME/.local/bin:$PATH"'

  if printf '%s' "$PATH" | tr ':' '\n' | grep -Fx "$USER_BIN" >/dev/null 2>&1; then
    return 0
  fi

  shell_rc="$HOME/.zshrc"
  if [[ "${SHELL:-}" == */bash ]]; then
    shell_rc="$HOME/.bashrc"
  fi

  if [[ ! -f "$shell_rc" ]] || ! grep -Fqx "$line" "$shell_rc"; then
    printf '\n# Added by pi-light-ce\n%s\n' "$line" >> "$shell_rc"
    log "Added $USER_BIN to PATH in $shell_rc"
  fi

  log "Open a new shell, or run: export PATH=\"$USER_BIN:\$PATH\""
}

main() {
  ensure_brew
  install_brew_package_if_missing git git
  install_brew_package_if_missing node node
  ensure_supported_node
  install_pi_if_missing
  clone_or_update_repo
  create_wrappers
  ensure_path

  log "Done"
  log "Verify with: pi-l-ce --help"
  log "Initialize with: pi-l-ce init ."
  log "Update later with: pi-l-ce self-update"
}

main "$@"
