# pi-light-ce

中文版 | [English](./README.en.md)

`pi-light-ce` 是一个 **面向 Pi 的轻量工程工作流工具包**。

它固定保留 4 个阶段：

1. `plan`
2. `execute`
3. `review`
4. `compound`

目标不是再造一个重型框架，而是让每个新 Pi 项目都能从同一套最小结构、最小规则、最小执行习惯开始。

## 当前定位

这个仓库当前只做 3 件事：

- 提供项目模板
- 提供全局初始化命令：`pi-l-ce-init`
- 约定一套轻量 Pi 工作流：计划、`/goal` 执行、复核、沉淀

当前明确只支持 **Pi**。

暂不考虑：

- Claude Code
- Codex
- Cursor
- 其他 harness

## 工作流模型

`pi-light-ce` 保留完整 4 流程，但把每一步做轻。

### 1. Plan

在 `docs/plans/` 下创建或更新任务计划。

### 2. Execute

使用 `/goal` 针对计划持续执行，避免 Pi 在每个阶段边界都停下来询问是否继续。

### 3. Review

对照计划检查结果，并执行聚焦验证。

### 4. Compound

把可复用的决策、坑点、排查路径或经验沉淀到 `docs/solutions/`。

## 初始化后生成的项目结构

`pi-l-ce-init` 会向目标项目写入这些文件：

```text
AGENTS.md
/docs/plans/TEMPLATE.md
/docs/solutions/TEMPLATE.md
```

其中：

- `AGENTS.md` 定义项目工作流约束
- `docs/plans/TEMPLATE.md` 是计划模板
- `docs/solutions/TEMPLATE.md` 是沉淀模板

## 仓库结构

```text
bin/
  pi-l-ce-init          全局初始化命令
templates/
  project/
    AGENTS.md           项目工作流约束
    docs/
      plans/
        TEMPLATE.md     计划模板
      solutions/
        TEMPLATE.md     沉淀模板
```

## 使用前提

使用全局命令前，请确保本机具备：

- Node.js 18+
- npm
- Pi（单独安装）

推荐安装的 Pi 包：

```bash
pi install npm:pi-subagents
pi install npm:@narumitw/pi-goal
```

## 安装全局命令

最简单、跨平台一致的方式，是直接从 GitHub 通过 npm 全局安装。

### macOS

公开仓库安装：

```bash
npm install -g git+https://github.com/ZhcChen/pi-light-ce.git
```

如果你更习惯 SSH：

```bash
npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git
```

### Linux

公开仓库安装：

```bash
npm install -g git+https://github.com/ZhcChen/pi-light-ce.git
```

如果你更习惯 SSH：

```bash
npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git
```

### Windows PowerShell

公开仓库安装：

```powershell
npm install -g git+https://github.com/ZhcChen/pi-light-ce.git
```

如果你更习惯 SSH：

```powershell
npm install -g git+ssh://git@github.com/ZhcChen/pi-light-ce.git
```

### 从本地仓库安装

如果你已经把仓库 clone 到本地：

```bash
npm install -g /absolute/path/to/pi-light-ce
```

Windows PowerShell 示例：

```powershell
npm install -g C:\path\to\pi-light-ce
```

## 验证安装

安装完成后，执行：

```bash
pi-l-ce-init --help
```

如果能看到帮助输出，说明全局命令可用。

## 初始化项目

初始化当前目录：

```bash
pi-l-ce-init .
```

初始化其他目录：

```bash
pi-l-ce-init /path/to/project
```

强制覆盖受管理文件：

```bash
pi-l-ce-init --force /path/to/project
```

## 初始化后的建议动作

运行完 `pi-l-ce-init` 后，建议按这个顺序开始：

1. 阅读生成的 `AGENTS.md`
2. 在 `docs/plans/` 下写任务计划
3. 使用 `/goal` 连续执行计划

推荐的执行提示词示例：

```text
/goal Read the relevant file under docs/plans/ and execute it continuously. Do not stop at phase boundaries. Stop only for missing decisions, missing permissions or credentials, unsafe irreversible actions, or completed-and-verified work.
```

## 非目标

当前明确不做这些事：

- 不做重型插件框架
- 不做大而全 workflow suite
- 不做 CE 上游兼容层
- 不做多 harness 抽象层
- 不在目标项目里生成额外 runtime 代码，除非后面证明确有必要
