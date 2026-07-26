<div align="center">
  <h1>pi-light-ce</h1>
  <p><strong>A lightweight, Pi-first engineering workflow kit</strong></p>
  <p>
    <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
    <img alt="Pi First" src="https://img.shields.io/badge/Pi-first-7c3aed">
    <img alt="Workflow" src="https://img.shields.io/badge/workflow-4%20stages-0f766e">
    <img alt="Installer" src="https://img.shields.io/badge/installer-bootstrap%20scripts-2563eb">
  </p>
  <p>
    <img alt="Node 18+" src="https://img.shields.io/badge/node-18%2B-339933?logo=node.js&amp;logoColor=white">
    <img alt="Platform" src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-1f6feb">
    <img alt="Docs" src="https://img.shields.io/badge/docs-zh--CN%20%7C%20EN-brightgreen">
  </p>
  <p><a href="./README.md">简体中文</a> | English</p>
</div>

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

## One-Command Installation

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

The target project's `AGENTS.md` is generated from the template source file `PLCE_AGENTS.md`.

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
    PLCE_AGENTS.md            template source copied into target AGENTS.md
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
