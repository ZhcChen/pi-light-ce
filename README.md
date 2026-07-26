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

## 安装器会做什么

三个平台脚本都会执行同一套核心动作：

| 动作 | 说明 |
| --- | --- |
| 检查依赖 | 检查 `git`、`node`、`npm`、`pi` 是否存在 |
| 安装缺失依赖 | 按平台安装缺失项 |
| 创建用户目录 | 创建 `~/.pi-l-ce` 或 `%USERPROFILE%\.pi-l-ce` |
| 克隆仓库 | 将本仓库克隆到用户目录下的 `repo/` |
| 更新仓库 | 如果仓库已存在，则执行 `git pull --ff-only` |
| 暴露命令 | 创建全局可调用的 `pi-l-ce-init` 命令包装器 |
| 处理 PATH | 将用户级命令目录加入 PATH（必要时） |

默认克隆位置：

| 平台 | 目录 |
| --- | --- |
| macOS / Linux | `~/.pi-l-ce/repo` |
| Windows | `%USERPROFILE%\.pi-l-ce\repo` |

## 平台安装策略

| 平台 | 缺失依赖安装策略 |
| --- | --- |
| macOS | 用 **Homebrew** 安装缺失的 `git`、`node`、`pi-coding-agent` |
| Linux | 用系统包管理器安装 `git`、`curl`、`node`、`npm`，再用 `npm` 安装 Pi |
| Windows | 用 **winget** 安装 `Git`、`Node.js`，再用 `npm` 安装 Pi |

约束说明：

| 平台 | 说明 |
| --- | --- |
| macOS | 安装脚本要求系统里已安装 Homebrew；如果没有，脚本会提示先安装 Homebrew |
| Linux | 当前脚本支持 `apt-get`、`dnf`、`yum`、`pacman`、`zypper`、`apk` |
| Windows | 安装脚本要求系统里可用 `winget` |

这也回答你前面那个问题：**Windows 这边可以用 winget，但主要用于 Git 和 Node.js；Pi 本身还是通过 npm 安装。**

## 一键安装命令

推荐直接执行平台脚本。

| 平台 | 一键安装命令 |
| --- | --- |
| macOS | `curl -fsSL https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-macos.sh | bash` |
| Linux | `curl -fsSL https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-linux.sh | bash` |
| Windows PowerShell | `irm https://raw.githubusercontent.com/ZhcChen/pi-light-ce/main/scripts/install-windows.ps1 | iex` |

脚本可重复运行。仓库已存在时会更新，不会重复克隆第二份。

## 验证安装

安装完成后，执行：

```bash
pi-l-ce-init --help
```

如果能看到帮助输出，说明全局命令已经可用。

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
  pi-l-ce-init                Node CLI 初始化命令
scripts/
  install-macos.sh            macOS 安装脚本
  install-linux.sh            Linux 安装脚本
  install-windows.ps1         Windows 安装脚本
templates/
  project/
    AGENTS.md                 项目工作流约束
    docs/
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

| 阶段 | 目的 | 最小动作 |
| --- | --- | --- |
| `plan` | 明确目标、范围、验证方式 | 在 `docs/plans/` 下创建或更新计划 |
| `execute` | 按计划持续执行 | 用 `/goal` 连续推进，不在阶段边界停机 |
| `review` | 对照计划验证结果 | 跑聚焦验证，检查偏移和回归 |
| `compound` | 沉淀复用知识 | 将决策、坑点、经验写入 `docs/solutions/` |

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
