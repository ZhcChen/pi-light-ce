<div align="center">
  <h1>pi-light-ce</h1>
  <p><strong>面向 Pi 的轻量工程工作流模板工具包</strong></p>
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
  <p>简体中文 | <a href="./README.en.md">English</a></p>
</div>

`pi-light-ce` 是一个 **面向 Pi 的轻量工程工作流模板工具包**。

它不追求重型框架，也不试图兼容所有 harness。它只做一件事：让每个新 Pi 项目都从一套固定、轻量、可复用的工程工作流开始。

## 项目概览

| 项目项 | 说明 |
| --- | --- |
| 名称 | `pi-light-ce` |
| 当前定位 | Pi-first 轻量工程工作流模板工具包 |
| 当前形态 | CLI 脚手架 + 文档与 prompt 模板 |
| 默认自动化边界 | 不提供 CE 式 workflow runtime；优先提示词约束与显式 CLI |
| 支持范围 | 仅支持 Pi |
| 核心命令 | `pi-l-ce` |
| 工作流 | `plan -> execute -> review -> compound` |
| 前置收敛 | `docs/brainstorms/`，仅在需求不清或方案分叉时使用 |
| 许可证 | [MIT](./LICENSE) |
| 运行要求 | Node.js 18+、npm、Pi |

## 边界与取舍

- `pi-light-ce` 不是重 runtime 框架，也不是纯 skill 包；它当前的职责是提供项目脚手架、文档结构和工作流约束
- 默认不引入 CE 式 workflow runtime，例如后台 job runner、跨模型调度控制器、隐藏的 `/plan` 执行脚本层
- 工作流优先停留在提示词和约束层：`AGENTS.md`、`docs/` 模板，以及写入目标项目 `.pi/prompts/` 的 Pi 内部入口
- 目标项目默认采用“自然语言资产用简体中文、领域性标识用英文”的约定：代码注释、说明文档、提交信息使用简体中文；函数名、API 名称、配置键等继续使用英文或既有约定
- 需要自动化时，优先增加用户显式调用的 CLI/helper，而不是让 workflow 在背后隐式启动程序化控制面

## 一键安装命令

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

脚本可重复运行。仓库已存在时会更新，不会重复克隆第二份。

## 命令使用

| 场景 | 命令 |
| --- | --- |
| 查看帮助 | `pi-l-ce --help` |
| 查看版本 | `pi-l-ce --version` |
| 检查环境与当前项目 | `pi-l-ce doctor` |
| 初始化当前目录 | `pi-l-ce init .` |
| 初始化其他目录（不存在时自动创建） | `pi-l-ce init /path/to/project` |
| 强制覆盖模板文件 | `pi-l-ce init --force /path/to/project` |
| 从 GitHub 更新本地安装 | `pi-l-ce self-update` |
| 运行本地 smoke test | `npm test` |

## 命令分层

| 类型 | 入口 | 作用 |
| --- | --- | --- |
| 外部 CLI | `pi-l-ce init` / `pi-l-ce self-update` / `pi-l-ce doctor` | 安装、初始化、维护模板源与环境检查 |
| 项目内 Pi 入口 | `/brainstorm` / `/plan` / `/execute` / `/review` / `/compound` | 在目标项目内触发轻量工作流提示词 |

## 初始化后生成的项目文件

`pi-l-ce init` 会向目标项目写入以下文件：

| 路径 | 作用 |
| --- | --- |
| `AGENTS.md` | 项目工作流约束 |
| `developer.md` | 可选开发参考，不参与主流程判断 |
| `.pi/prompts/brainstorm.md` | 项目内 `/brainstorm` 入口模板 |
| `.pi/prompts/plan.md` | 项目内 `/plan` 入口模板 |
| `.pi/prompts/execute.md` | 项目内 `/execute` 入口模板 |
| `.pi/prompts/review.md` | 项目内 `/review` 入口模板 |
| `.pi/prompts/compound.md` | 项目内 `/compound` 入口模板 |
| `docs/brainstorms/TEMPLATE.md` | 需求不清或方案分叉时使用的简体中文 brainstorm 模板 |
| `docs/plans/TEMPLATE.md` | 简体中文计划模板 |
| `docs/solutions/TEMPLATE.md` | 简体中文沉淀模板 |

其中目标项目里的 `AGENTS.md` 来自模板文件 `PLCE_AGENTS.md`；`.pi/prompts/*.md` 会注册为该项目内的 `/brainstorm`、`/plan`、`/execute`、`/review`、`/compound` 入口。

`developer.md` 是可选开发参考，用来放通用开发提示，不参与主流程判断，也不替代 `AGENTS.md`。

`docs/*/TEMPLATE.md` 只作结构参考。正式内容应优先写入同目录下的具体文件，例如 `docs/plans/2025-07-26-short-name.md`，不要直接把真实记录写进 `TEMPLATE.md`。

## 使用提示

- `pi-l-ce doctor` 会检查当前运行环境、推荐 Pi 包，以及当前目录下的项目模板文件是否齐全
- 目标项目默认约束是：代码注释、说明文档、提交信息等自然语言资产使用简体中文；函数名、API 名称、配置键等领域性标识保持英文或沿用既有约定
- 项目内 `.pi/prompts/*.md` 需要在 Pi 信任该项目后才会被发现
- 如果你在执行 `pi-l-ce init` 前已经打开 Pi 会话，运行 `/reload` 或重开会话，让新写入的 prompt 模板生效

## 仓库结构

```text
bin/
  pi-l-ce                     主 CLI 命令
lib/
  cli.js                      共享 CLI 逻辑
scripts/
  install-macos.sh            macOS 安装脚本
  install-linux.sh            Linux 安装脚本
  install-windows.ps1         Windows 安装脚本
  smoke-test.js               跨平台 smoke test 主脚本
  smoke-test.sh               smoke test Bash 包装器
templates/
  project/
    .pi/
      prompts/
        brainstorm.md          项目内 /brainstorm 提示词模板
        plan.md                项目内 /plan 提示词模板
        execute.md             项目内 /execute 提示词模板
        review.md              项目内 /review 提示词模板
        compound.md            项目内 /compound 提示词模板
    PLCE_AGENTS.md            模板源文件，初始化后写入为 AGENTS.md
    developer.md              可选开发参考文件
    docs/
      brainstorms/
        TEMPLATE.md           brainstorm 模板
      plans/
        TEMPLATE.md           计划模板
      solutions/
        TEMPLATE.md           沉淀模板
```

## 推荐的 Pi 包

| 包 | 是否推荐 | 作用 |
| --- | --- | --- |
| `pi-subagents` | 推荐 | 子代理编排底座 |
| `@narumitw/pi-goal` | 推荐 | 长计划持续执行机制 |

安装命令：

```bash
pi install npm:pi-subagents
pi install npm:@narumitw/pi-goal
```

## 工作流模型

`brainstorm` 不是固定主流程阶段；它是 `plan` 之前的可选前置收敛层。只有在需求不清、范围未定、方案分叉或未知项较多时，才先写 `docs/brainstorms/`，再进入 `docs/plans/`。

| 阶段 | 目的 | 最小动作 |
| --- | --- | --- |
| `plan` | 明确目标、范围、验证方式 | 在 `docs/plans/` 下创建或更新计划 |
| `execute` | 按计划持续执行 | 使用 `/execute` 进入执行；长任务用 `/goal` 连续推进 |
| `review` | 对照计划验证结果 | 跑聚焦验证，检查偏移和回归 |
| `compound` | 沉淀复用知识 | 将决策、坑点、经验写入 `docs/solutions/` |

## 许可证

本项目采用 [MIT License](./LICENSE)。
