# pi-light-ce

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Pi First](https://img.shields.io/badge/Pi-first-7c3aed)
![Node >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-1f6feb)
![Docs](https://img.shields.io/badge/docs-default%20zh--CN-brightgreen)

简体中文 | [English](./README.en.md)

`pi-light-ce` 是一个 **面向 Pi 的轻量工程工作流工具包**。

它不追求重型框架，也不试图兼容所有 harness。它只做一件事：让每个新 Pi 项目都从一套固定、轻量、可复用的工程工作流开始。

## 项目概览

| 项目项 | 说明 |
| --- | --- |
| 名称 | `pi-light-ce` |
| 当前定位 | Pi-first 轻量工程工作流工具包 |
| 支持范围 | 仅支持 Pi |
| 核心命令 | `pi-l-ce-init` |
| 工作流 | `plan -> execute -> review -> compound` |
| 许可证 | [MIT](./LICENSE) |
| 运行要求 | Node.js 18+、npm、Pi |

## 核心思想

| 原则 | 说明 |
| --- | --- |
| 小内核 | Pi 保持运行时内核，不再额外引入重型 workflow 平台 |
| 固定流程 | 保留 `plan`、`execute`、`review`、`compound` 四个阶段 |
| 轻量执行 | 每个阶段都保留，但深度按任务大小伸缩 |
| Pi-only | 当前不兼容 Claude Code、Codex、Cursor 等其他 harness |
| 模板优先 | 主要通过模板、约束文件、初始化命令沉淀工作方式 |

## 工作流模型

| 阶段 | 目的 | 最小动作 |
| --- | --- | --- |
| `plan` | 明确目标、范围、验证方式 | 在 `docs/plans/` 下创建或更新计划 |
| `execute` | 按计划持续执行 | 用 `/goal` 连续推进，不在阶段边界停机 |
| `review` | 对照计划验证结果 | 跑聚焦验证，检查偏移和回归 |
| `compound` | 沉淀复用知识 | 将决策、坑点、经验写入 `docs/solutions/` |

## 初始化后生成的项目文件

`pi-l-ce-init` 会向目标项目写入以下文件：

| 路径 | 作用 |
| --- | --- |
| `AGENTS.md` | 项目工作流约束 |
| `docs/plans/TEMPLATE.md` | 计划模板 |
| `docs/solutions/TEMPLATE.md` | 沉淀模板 |

## 仓库结构

```text
bin/
  pi-l-ce-init                全局初始化命令
templates/
  project/
    AGENTS.md                 项目工作流约束
    docs/
      plans/
        TEMPLATE.md           计划模板
      solutions/
        TEMPLATE.md           沉淀模板
```

## 使用前提

| 组件 | 是否必须 | 说明 |
| --- | --- | --- |
| Node.js 18+ | 必须 | 用于运行全局初始化命令 |
| npm | 必须 | 用于安装全局命令 |
| Pi | 必须 | 工作流运行时 |
| `pi-subagents` | 推荐 | 子代理编排底座 |
| `@narumitw/pi-goal` | 推荐 | 长计划持续执行机制 |

推荐安装的 Pi 包：

```bash
pi install npm:pi-subagents
pi install npm:@narumitw/pi-goal
```

## 安装全局命令

最简单、跨平台一致的方式，是直接从 GitHub 通过 npm 全局安装。

### 从 GitHub 安装

| 平台 | HTTPS | SSH |
| --- | --- | --- |
| macOS | `npm install -g git+https://github.com/ZhcChen/pi-light-ce.git` | `npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git` |
| Linux | `npm install -g git+https://github.com/ZhcChen/pi-light-ce.git` | `npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git` |
| Windows PowerShell | `npm install -g git+https://github.com/ZhcChen/pi-light-ce.git` | `npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git` |

### 从本地仓库安装

| 平台 | 命令 |
| --- | --- |
| macOS / Linux | `npm install -g /absolute/path/to/pi-light-ce` |
| Windows PowerShell | `npm install -g C:\path\to\pi-light-ce` |

## 验证安装

```bash
pi-l-ce-init --help
```

如果能看到帮助输出，说明全局命令安装成功。

## 初始化项目

| 场景 | 命令 |
| --- | --- |
| 初始化当前目录 | `pi-l-ce-init .` |
| 初始化其他目录 | `pi-l-ce-init /path/to/project` |
| 强制覆盖受管理文件 | `pi-l-ce-init --force /path/to/project` |

## 初始化后的建议动作

| 步骤 | 动作 |
| --- | --- |
| 1 | 阅读生成的 `AGENTS.md` |
| 2 | 在 `docs/plans/` 下写任务计划 |
| 3 | 使用 `/goal` 连续执行计划 |

推荐的 `/goal` 执行提示词：

```text
/goal Read the relevant file under docs/plans/ and execute it continuously. Do not stop at phase boundaries. Stop only for missing decisions, missing permissions or credentials, unsafe irreversible actions, or completed-and-verified work.
```

## 当前非目标

| 不做什么 | 原因 |
| --- | --- |
| 重型插件框架 | 保持 Pi-first 的轻量形态 |
| 大而全 workflow suite | 避免引入额外复杂度 |
| CE 上游兼容层 | 当前只沉淀自己的轻量工作流 |
| 多 harness 抽象层 | 当前只支持 Pi |
| 额外 runtime 代码生成 | 除非后续证明确有必要 |

## 许可证

本项目采用 [MIT License](./LICENSE)。
