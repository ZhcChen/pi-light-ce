# pi-light-ce

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Pi First](https://img.shields.io/badge/Pi-first-7c3aed)
![Node >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-1f6feb)
![Docs](https://img.shields.io/badge/docs-default%20zh--CN-brightgreen)

[简体中文](./README.md) | English

`pi-light-ce` is a **lightweight, Pi-first engineering workflow kit**.

It does not try to become another heavy framework or a multi-harness abstraction layer. Its job is simple: make every new Pi project start from the same minimal structure and engineering workflow.

## Overview

| Item | Value |
| --- | --- |
| Name | `pi-light-ce` |
| Scope | Pi-first lightweight engineering workflow kit |
| Supported runtime | Pi only |
| Main command | `pi-l-ce-init` |
| Workflow | `plan -> execute -> review -> compound` |
| License | [MIT](./LICENSE) |
| Requirements | Node.js 18+, npm, Pi |

## What the Installers Do

All three platform scripts follow the same core flow:

| Action | Description |
| --- | --- |
| Check prerequisites | verify whether `git`, `node`, `npm`, and `pi` are available |
| Install missing dependencies | install missing pieces using the platform-native strategy |
| Create user directory | create `~/.pi-l-ce` or `%USERPROFILE%\.pi-l-ce` |
| Clone repository | clone this repository into the user directory under `repo/` |
| Update repository | if it already exists, run `git pull --ff-only` |
| Expose command | create a globally callable `pi-l-ce-init` wrapper |
| Update PATH | add the user command directory to PATH if needed |

Default clone location:

| Platform | Directory |
| --- | --- |
| macOS / Linux | `~/.pi-l-ce/repo` |
| Windows | `%USERPROFILE%\.pi-l-ce\repo` |

## Platform Installation Strategy

| Platform | Missing dependency strategy |
| --- | --- |
| macOS | use **Homebrew** to install missing `git`, `node`, and `pi-coding-agent` |
| Linux | use the system package manager for `git`, `curl`, `node`, and `npm`, then install Pi with `npm` |
| Windows | use **winget** for `Git` and `Node.js`, then install Pi with `npm` |

Platform notes:

| Platform | Note |
| --- | --- |
| macOS | the installer expects Homebrew to already exist; if it does not, the script stops and asks you to install Homebrew first |
| Linux | the current installer supports `apt-get`, `dnf`, `yum`, `pacman`, `zypper`, and `apk` |
| Windows | the installer expects `winget` to be available |

This also answers the earlier Windows question: **yes, winget is used on Windows, but mainly for Git and Node.js; Pi itself is still installed through npm.**

## One-Command Installation

The recommended path is to run the platform installer script directly.

| Platform | Command |
| --- | --- |
| macOS | `curl -fsSL https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-macos.sh | bash` |
| Linux | `curl -fsSL https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-linux.sh | bash` |
| Windows PowerShell | `irm https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-windows.ps1 | iex` |

The scripts are idempotent. If the repository is already present, they update it instead of cloning a second copy.

## Verify Installation

```bash
pi-l-ce-init --help
```

If help output appears, the global command is available.

## Generated Project Files

`pi-l-ce-init` writes these files into a target project:

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | project workflow contract |
| `docs/plans/TEMPLATE.md` | plan template |
| `docs/solutions/TEMPLATE.md` | compound / solution template |

## Repository Layout

```text
bin/
  pi-l-ce-init                Node CLI initializer command
scripts/
  install-macos.sh            macOS installer
  install-linux.sh            Linux installer
  install-windows.ps1         Windows installer
templates/
  project/
    AGENTS.md                 project workflow contract
    docs/
      plans/
        TEMPLATE.md           plan template
      solutions/
        TEMPLATE.md           compound template
```

## Recommended Pi Packages

| Package | Recommended | Purpose |
| --- | --- | --- |
| `pi-subagents` | Yes | subagent orchestration base |
| `@narumitw/pi-goal` | Yes | long-running execution mechanism |

Install them with:

```bash
pi install npm:pi-subagents
pi install npm:@narumitw/pi-goal
```

## Workflow Model

| Stage | Purpose | Minimum action |
| --- | --- | --- |
| `plan` | define goal, scope, and validation | create or update a plan under `docs/plans/` |
| `execute` | keep work moving against the plan | use `/goal` so Pi does not stop at phase boundaries |
| `review` | validate results against the plan | run focused checks and look for drift or regressions |
| `compound` | capture reusable knowledge | write decisions, pitfalls, or lessons under `docs/solutions/` |

## Initialize a Project

| Scenario | Command |
| --- | --- |
| initialize current directory | `pi-l-ce-init .` |
| initialize another directory | `pi-l-ce-init /path/to/project` |
| force overwrite managed files | `pi-l-ce-init --force /path/to/project` |

## Suggested Next Steps After Init

| Step | Action |
| --- | --- |
| 1 | review the generated `AGENTS.md` |
| 2 | write a plan under `docs/plans/` |
| 3 | use `/goal` to execute continuously |

Suggested `/goal` prompt:

```text
/goal Read the relevant file under docs/plans/ and execute it continuously. Do not stop at phase boundaries. Stop only for missing decisions, missing permissions or credentials, unsafe irreversible actions, or completed-and-verified work.
```

## Current Non-Goals

| Not included | Why |
| --- | --- |
| heavy plugin framework | keep the Pi-first footprint small |
| large workflow suite | avoid extra orchestration complexity |
| CE upstream compatibility layer | this repo focuses on its own lightweight workflow |
| multi-harness abstraction | Pi-only by design |
| generated runtime code inside target projects | avoid it unless it later becomes clearly necessary |

## License

This project is licensed under the [MIT License](./LICENSE).
