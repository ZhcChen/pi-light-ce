# pi-light-ce

[简体中文](./README.md) | English

`pi-light-ce` is a lightweight, Pi-first engineering workflow kit.

It keeps a fixed four-stage workflow:

1. `plan`
2. `execute`
3. `review`
4. `compound`

The goal is not to ship another heavy framework. The goal is to make every new Pi project start from the same minimal structure, rules, and execution habits.

## Current Scope

This repository currently does three things:

- provides a project template
- provides a global initializer command: `pi-l-ce-init`
- standardizes a lightweight Pi workflow around plans, `/goal`, review, and compound notes

This repository is intentionally Pi-only for now.

It does not try to support Claude Code, Codex, Cursor, or any other harness.

## Workflow Model

`pi-light-ce` keeps all four stages, but keeps them small.

### 1. Plan

Create or update one task plan under `docs/plans/`.

### 2. Execute

Use `/goal` for long-running execution against the chosen plan so Pi keeps moving instead of stopping at every phase boundary.

### 3. Review

Check the result against the plan and run focused validation.

### 4. Compound

Capture reusable decisions, pitfalls, debugging paths, or lessons under `docs/solutions/`.

## Generated Project Structure

`pi-l-ce-init` writes these files into a target project:

```text
AGENTS.md
/docs/plans/TEMPLATE.md
/docs/solutions/TEMPLATE.md
```

## Repository Layout

```text
bin/
  pi-l-ce-init          Global initializer command
templates/
  project/
    AGENTS.md           Project workflow contract
    docs/
      plans/
        TEMPLATE.md     Plan template
      solutions/
        TEMPLATE.md     Compound / solution template
```

## Requirements

Before using the global command, make sure you have:

- Node.js 18+
- npm
- Pi installed separately

Recommended Pi packages:

```bash
pi install npm:pi-subagents
pi install npm:@narumitw/pi-goal
```

## Install the Global Command

The easiest cross-platform installation method is global npm install from GitHub.

### macOS

Public GitHub repository:

```bash
npm install -g git+https://github.com/ZhcChen/pi-light-ce.git
```

SSH variant:

```bash
npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git
```

### Linux

Public GitHub repository:

```bash
npm install -g git+https://github.com/ZhcChen/pi-light-ce.git
```

SSH variant:

```bash
npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git
```

### Windows PowerShell

Public GitHub repository:

```powershell
npm install -g git+https://github.com/ZhcChen/pi-light-ce.git
```

SSH variant:

```powershell
npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git
```

### Install from a Local Checkout

If you already cloned this repository locally:

```bash
npm install -g /absolute/path/to/pi-light-ce
```

Windows PowerShell example:

```powershell
npm install -g C:\path\to\pi-light-ce
```

## Verify Installation

After installation, run:

```bash
pi-l-ce-init --help
```

## Initialize a Project

Initialize the current directory:

```bash
pi-l-ce-init .
```

Initialize another directory:

```bash
pi-l-ce-init /path/to/project
```

Force overwrite managed files:

```bash
pi-l-ce-init --force /path/to/project
```

## Suggested Next Step After Init

After running `pi-l-ce-init`, the normal flow is:

1. review the generated `AGENTS.md`
2. write a plan under `docs/plans/`
3. use `/goal` to execute continuously

Suggested `/goal` prompt:

```text
/goal Read the relevant file under docs/plans/ and execute it continuously. Do not stop at phase boundaries. Stop only for missing decisions, missing permissions or credentials, unsafe irreversible actions, or completed-and-verified work.
```

## Non-Goals

- no heavy plugin framework
- no large workflow suite
- no CE upstream compatibility layer
- no multi-harness abstraction layer
- no generated runtime code inside target projects unless it becomes clearly necessary later
