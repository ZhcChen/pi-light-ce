<div align="center">
  <h1>pi-light-ce</h1>
  <p><strong>A lightweight, Pi-first engineering workflow template kit</strong></p>
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

`pi-light-ce` is a **lightweight, Pi-first engineering workflow template kit**.

It does not try to become another heavy framework or a multi-harness abstraction layer. Its job is simple: make every new Pi project start from the same minimal structure and engineering workflow.

## Overview

| Item | Value |
| --- | --- |
| Name | `pi-light-ce` |
| Scope | Pi-first lightweight engineering workflow template kit |
| Current shape | CLI scaffold + documentation and prompt templates |
| Default automation boundary | No CE-style workflow runtime; prefer prompt constraints and explicit CLI helpers |
| Supported runtime | Pi only |
| Main command | `pi-l-ce` |
| Workflow | `plan -> execute -> review -> compound` |
| Pre-plan clarification | `docs/brainstorms/`, used only when requirements or options are still unclear |
| License | [MIT](./LICENSE) |
| Requirements | Node.js 18+, npm, Pi |

## Boundaries

- `pi-light-ce` is not a heavy runtime framework and not a pure skill package; its current job is to provide project scaffolding, documentation structure, and workflow constraints
- It does not introduce CE-style workflow runtime pieces such as hidden `/plan` execution scripts, background job runners, or cross-model control layers
- Workflow stays primarily in the prompt and contract layer: `AGENTS.md`, `docs/` templates, and project-local Pi entrypoints under `.pi/prompts/`
- When automation is needed, prefer explicit user-invoked CLI/helpers instead of adding an implicit programmatic control plane behind the workflow

## One-Command Installation

### macOS

```bash
curl -fsSL https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-macos.sh | bash
```

### Linux

```bash
curl -fsSL https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-linux.sh | bash
```

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-windows.ps1 | iex
```

The scripts are idempotent. If the repository is already present, they update it instead of cloning a second copy.

## Command Usage

| Scenario | Command |
| --- | --- |
| show help | `pi-l-ce --help` |
| show version | `pi-l-ce --version` |
| inspect runtime and current project | `pi-l-ce doctor` |
| initialize current directory | `pi-l-ce init .` |
| initialize another directory (created automatically if missing) | `pi-l-ce init /path/to/project` |
| force overwrite template files | `pi-l-ce init --force /path/to/project` |
| update local installation from GitHub | `pi-l-ce self-update` |
| run local smoke test | `npm test` |

## Entry Points

| Type | Entry point | Purpose |
| --- | --- | --- |
| external CLI | `pi-l-ce init` / `pi-l-ce self-update` / `pi-l-ce doctor` | install, initialize, maintain the template source, and inspect the environment |
| in-project Pi entrypoints | `/brainstorm` / `/plan` / `/execute` / `/review` / `/compound` | trigger lightweight workflow prompts inside the target project |

## Generated Project Files

`pi-l-ce init` writes these files into a target project:

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | project workflow contract |
| `.pi/prompts/brainstorm.md` | in-project `/brainstorm` entry template |
| `.pi/prompts/plan.md` | in-project `/plan` entry template |
| `.pi/prompts/execute.md` | in-project `/execute` entry template |
| `.pi/prompts/review.md` | in-project `/review` entry template |
| `.pi/prompts/compound.md` | in-project `/compound` entry template |
| `docs/brainstorms/TEMPLATE.md` | Simplified Chinese brainstorm template for unclear requirements or competing options |
| `docs/plans/TEMPLATE.md` | Simplified Chinese plan template |
| `docs/solutions/TEMPLATE.md` | Simplified Chinese compound / solution template |

The target project's `AGENTS.md` is generated from the template source file `PLCE_AGENTS.md`, and `.pi/prompts/*.md` becomes the project's `/brainstorm`, `/plan`, `/execute`, `/review`, and `/compound` entrypoints.

`docs/*/TEMPLATE.md` is structure-only reference material. Real project records should go into concrete files in the same directory, such as `docs/plans/2025-07-26-short-name.md`, instead of writing live content into `TEMPLATE.md`.

## Usage Notes

- `pi-l-ce doctor` checks the current runtime, recommended Pi packages, and whether the current directory has the expected template files
- Project-local `.pi/prompts/*.md` is discovered only after Pi trusts the project
- If you already had a Pi session open before running `pi-l-ce init`, run `/reload` or reopen the session so the new prompt templates are picked up

## Repository Layout

```text
bin/
  pi-l-ce                     primary CLI command
lib/
  cli.js                      shared CLI logic
scripts/
  install-macos.sh            macOS installer
  install-linux.sh            Linux installer
  install-windows.ps1         Windows installer
  smoke-test.js               cross-platform smoke test entrypoint
  smoke-test.sh               bash wrapper for the smoke test
templates/
  project/
    .pi/
      prompts/
        brainstorm.md          in-project /brainstorm prompt template
        plan.md                in-project /plan prompt template
        execute.md             in-project /execute prompt template
        review.md              in-project /review prompt template
        compound.md            in-project /compound prompt template
    PLCE_AGENTS.md            template source copied into target AGENTS.md
    docs/
      brainstorms/
        TEMPLATE.md           brainstorm template
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

`brainstorm` is not part of the fixed main workflow. It is an optional pre-plan clarification layer used before `plan` when requirements are unclear, scope is still open, options compete, or unknowns are high.

| Stage | Purpose | Minimum action |
| --- | --- | --- |
| `plan` | define goal, scope, and validation | create or update a plan under `docs/plans/` |
| `execute` | keep work moving against the plan | enter execution with `/execute`; use `/goal` for long-running continuation |
| `review` | validate results against the plan | run focused checks and look for drift or regressions |
| `compound` | capture reusable knowledge | write decisions, pitfalls, or lessons under `docs/solutions/` |

## License

This project is licensed under the [MIT License](./LICENSE).
