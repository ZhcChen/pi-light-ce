#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${PI_L_CE_REPO_URL:-https://github.com/ZhcChen/pi-light-ce.git}"
INSTALL_ROOT="${HOME}/.pi-l-ce"
REPO_DIR="${INSTALL_ROOT}/repo"
USER_BIN="${HOME}/.local/bin"
PRIMARY_WRAPPER_PATH="${USER_BIN}/pi-l-ce"
COMPAT_WRAPPER_PATH="${USER_BIN}/pi-l-ce-init"

log() {
  printf '==> %s\n' "$*"
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

run_as_root() {
  if [[ "$(id -u)" -eq 0 ]]; then
    "$@"
    return 0
  fi

  if command -v sudo >/dev/null 2>&1; then
    sudo "$@"
    return 0
  fi

  fail "This installer needs root privileges to install missing system packages. Install sudo or run as root."
}

install_base_packages() {
  local need_git=0
  local need_curl=0
  local need_node=0
  local need_npm=0

  command -v git >/dev/null 2>&1 || need_git=1
  command -v curl >/dev/null 2>&1 || need_curl=1
  command -v node >/dev/null 2>&1 || need_node=1
  command -v npm >/dev/null 2>&1 || need_npm=1

  if [[ "$need_git" -eq 0 && "$need_curl" -eq 0 && "$need_node" -eq 0 && "$need_npm" -eq 0 ]]; then
    return 0
  fi

  if command -v apt-get >/dev/null 2>&1; then
    log "Installing missing packages with apt-get"
    run_as_root apt-get update
    run_as_root apt-get install -y git curl nodejs npm
    return 0
  fi

  if command -v dnf >/dev/null 2>&1; then
    log "Installing missing packages with dnf"
    run_as_root dnf install -y git curl nodejs npm
    return 0
  fi

  if command -v yum >/dev/null 2>&1; then
    log "Installing missing packages with yum"
    run_as_root yum install -y git curl nodejs npm
    return 0
  fi

  if command -v pacman >/dev/null 2>&1; then
    log "Installing missing packages with pacman"
    run_as_root pacman -Sy --noconfirm --needed git curl nodejs npm
    return 0
  fi

  if command -v zypper >/dev/null 2>&1; then
    log "Installing missing packages with zypper"
    run_as_root zypper --non-interactive install git curl nodejs npm
    return 0
  fi

  if command -v apk >/dev/null 2>&1; then
    log "Installing missing packages with apk"
    run_as_root apk add git curl nodejs npm
    return 0
  fi

  fail "Unsupported Linux package manager. Install git, curl, nodejs, and npm manually, then rerun this script."
}

install_pi_if_missing() {
  if command -v pi >/dev/null 2>&1; then
    return 0
  fi

  log "Installing pi-coding-agent via npm"
  if npm install -g @earendil-works/pi-coding-agent; then
    return 0
  fi

  if command -v sudo >/dev/null 2>&1 && [[ "$(id -u)" -ne 0 ]]; then
    sudo npm install -g @earendil-works/pi-coding-agent
    return 0
  fi

  fail "Failed to install pi-coding-agent automatically. Install Pi manually, then rerun this script."
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

  cat > "$COMPAT_WRAPPER_PATH" <<EOF
#!/usr/bin/env bash
set -euo pipefail
exec node "$REPO_DIR/bin/pi-l-ce-init" "\$@"
EOF

  chmod +x "$PRIMARY_WRAPPER_PATH" "$COMPAT_WRAPPER_PATH"
  log "Installed command wrappers at $USER_BIN"
}

ensure_path() {
  local shell_rc
  local line='export PATH="$HOME/.local/bin:$PATH"'

  if printf '%s' "$PATH" | tr ':' '\n' | grep -Fx "$USER_BIN" >/dev/null 2>&1; then
    return 0
  fi

  shell_rc="$HOME/.bashrc"
  if [[ "${SHELL:-}" == */zsh ]]; then
    shell_rc="$HOME/.zshrc"
  fi

  if [[ ! -f "$shell_rc" ]] || ! grep -Fqx "$line" "$shell_rc"; then
    printf '\n# Added by pi-light-ce\n%s\n' "$line" >> "$shell_rc"
    log "Added $USER_BIN to PATH in $shell_rc"
  fi

  log "Open a new shell, or run: export PATH=\"$USER_BIN:\$PATH\""
}

main() {
  install_base_packages
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
