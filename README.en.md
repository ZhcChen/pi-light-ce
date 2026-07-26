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

## Core Principles

| Principle | Meaning |
| --- | --- |
| Small core | Pi stays the runtime core; no large workflow platform is added |
| Fixed stages | Keep `plan`, `execute`, `review`, and `compound` |
| Variable depth | Every stage stays, but its depth scales with task size |
| Pi-only | No Claude Code, Codex, Cursor, or other harness compatibility layer |
| Template-first | Workflow is standardized mainly through templates and project conventions |

## Workflow Model

| Stage | Purpose | Minimum action |
| --- | --- | --- |
| `plan` | define goal, scope, and validation | create or update a plan under `docs/plans/` |
| `execute` | keep work moving against the plan | use `/goal` so Pi does not stop at phase boundaries |
| `review` | validate results against the plan | run focused checks and look for drift or regressions |
| `compound` | capture reusable knowledge | write decisions, pitfalls, or lessons under `docs/solutions/` |

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
  pi-l-ce-init                global initializer command
templates/
  project/
    AGENTS.md                 project workflow contract
    docs/
      plans/
        TEMPLATE.md           plan template
      solutions/
        TEMPLATE.md           compound template
```

## Requirements

| Component | Required | Notes |
| --- | --- | --- |
| Node.js 18+ | Yes | needed for the global initializer command |
| npm | Yes | used for installation |
| Pi | Yes | workflow runtime |
| `pi-subagents` | Recommended | subagent orchestration base |
| `@narumitw/pi-goal` | Recommended | long-running execution mechanism |

Recommended Pi packages:

```bash
pi install npm:pi-subagents
pi install npm:@narumitw/pi-goal
```

## Install the Global Command

The easiest cross-platform installation method is global npm install from GitHub.

### Install from GitHub

| Platform | HTTPS | SSH |
| --- | --- | --- |
| macOS | `npm install -g git+https://github.com/ZhcChen/pi-light-ce.git` | `npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git` |
| Linux | `npm install -g git+https://github.com/ZhcChen/pi-light-ce.git` | `npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git` |
| Windows PowerShell | `npm install -g git+https://github.com/ZhcChen/pi-light-ce.git` | `npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git` |

### Install from a Local Checkout

| Platform | Command |
| --- | --- |
| macOS / Linux | `npm install -g /absolute/path/to/pi-light-ce` |
| Windows PowerShell | `npm install -g C:\path\to\pi-light-ce` |

## Verify Installation

```bash
pi-l-ce-init --help
```

If help text appears, the global command is installed correctly.

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
