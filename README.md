<div align="center">
  <h1>pi-light-ce</h1>
  <p><strong>面向 Pi 的轻量工程工作流工具包</strong></p>
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

`pi-light-ce` 是一个 **面向 Pi 的轻量工程工作流工具包**。

它不追求重型框架，也不试图兼容所有 harness。它只做一件事：让每个新 Pi 项目都从一套固定、轻量、可复用的工程工作流开始。

## 项目概览

| 项目项 | 说明 |
| --- | --- |
| 名称 | `pi-light-ce` |
| 当前定位 | Pi-first 轻量工程工作流工具包 |
| 支持范围 | 仅支持 Pi |
| 核心命令 | `pi-l-ce` |
| 工作流 | `plan -> execute -> review -> compound` |
| 前置收敛 | `docs/brainstorms/`，仅在需求不清或方案分叉时使用 |
| 许可证 | [MIT](./LICENSE) |
| 运行要求 | Node.js 18+、npm、Pi |

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
| 初始化当前目录 | `pi-l-ce init .` |
| 初始化其他目录 | `pi-l-ce init /path/to/project` |
| 强制覆盖模板文件 | `pi-l-ce init --force /path/to/project` |
| 从 GitHub 更新本地安装 | `pi-l-ce self-update` |

## 初始化后生成的项目文件

`pi-l-ce init` 会向目标项目写入以下文件：

| 路径 | 作用 |
| --- | --- |
| `AGENTS.md` | 项目工作流约束 |
| `docs/brainstorms/TEMPLATE.md` | 需求不清或方案分叉时使用的简体中文 brainstorm 模板 |
| `docs/plans/TEMPLATE.md` | 简体中文计划模板 |
| `docs/solutions/TEMPLATE.md` | 简体中文沉淀模板 |

其中目标项目里的 `AGENTS.md` 来自模板文件 `PLCE_AGENTS.md`。

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
templates/
  project/
    PLCE_AGENTS.md            模板源文件，初始化后写入为 AGENTS.md
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
| `execute` | 按计划持续执行 | 用 `/goal` 连续推进，不在阶段边界停机 |
| `review` | 对照计划验证结果 | 跑聚焦验证，检查偏移和回归 |
| `compound` | 沉淀复用知识 | 将决策、坑点、经验写入 `docs/solutions/` |

## 许可证

本项目采用 [MIT License](./LICENSE)。
