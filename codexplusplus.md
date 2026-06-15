# Codex++：给 Codex App 加一层外部增强启动器

如果你已经在用 Codex App，但总觉得有些日常操作不够顺手，**Codex++** 就是一个值得了解的第三方增强工具。

项目地址：[BigPizzaV3/CodexPlusPlus](https://github.com/BigPizzaV3/CodexPlusPlus)

先把定位说清楚：

> **Codex++ 不是 OpenAI 官方功能，也不是 Codex App 的替代品。它更像是一个外部启动器和管理工具，用来在启动 Codex App 时注入一些增强能力。**

它的核心思路不是改掉 Codex App 本体，而是通过外部 launcher 启动 Codex，再借助 Chromium DevTools Protocol 把增强脚本注入到 Codex 页面里。这一点很重要，因为它决定了 Codex++ 的优点和边界。

---

## 一、Codex++ 解决什么问题？

Codex App 本身已经能完成大量编程 Agent 工作，但真实使用久了，用户会遇到一些偏“工具层”的摩擦：

- API Key 或自定义 provider 场景下，部分入口和官方登录态能力之间容易产生冲突。
- 会话列表更偏归档管理，缺少更直接的删除、导出、移动等操作。
- 切换模型供应商后，历史会话的可见性和配置同步需要额外处理。
- 想给 Codex 加一些个人脚本或辅助入口时，原生界面没有统一管理面板。
- 创建 worktree 时，希望更明确地从远端上游分支开始，而不是从当前本地 HEAD 派生。

Codex++ 不是去替代 Codex 的 Agent 能力，而是把这些“周边操作”集中到一个外部管理层里。

## 二、它怎么工作？

可以把 Codex++ 理解成两部分：

| 组件 | 作用 |
|------|------|
| `Codex++` | 静默启动入口，不显示管理界面，只负责启动 Codex 并注入增强功能。 |
| `Codex++ 管理工具` | Tauri 控制面板，用于检查状态、修复、更新、配置中转注入、管理增强功能和用户脚本。 |

从项目源码看，它的主要技术栈是：

- Rust 后端，负责启动、配置、端口、桥接、更新等核心逻辑。
- Tauri + React 管理界面，提供图形化控制面板。
- 外部 CDP 注入脚本，给 Codex 渲染端增加菜单和增强操作。
- 本地数据处理模块，用于会话导出、Provider 同步和 Codex 本地数据库读取。

这种设计的好处是：它不需要直接修改 Codex App 的 `app.asar`，也不需要往 Codex 安装目录写入 DLL。代价是：它依赖 Codex 页面结构和本地运行方式，一旦 Codex App 更新导致页面结构变化，增强脚本就可能需要跟着更新。

## 三、主要功能概览

### 3.1 启动和管理

安装后一般会出现两个入口：一个是静默启动器，一个是管理工具。日常使用时，从 `Codex++` 启动 Codex，就能加载增强功能；需要配置、诊断或更新时，再打开 `Codex++ 管理工具`。

管理工具里可以做的事情包括：

- 检查 Codex++ 后端和注入状态。
- 查看日志和诊断信息。
- 启动、修复或更新 Codex++。
- 管理增强功能开关。
- 管理用户脚本。

### 3.2 Codex 界面增强

Codex++ 会在 Codex 页面里增加自己的入口，用来访问一些原生界面没有直接提供的操作。根据项目 README，它覆盖的典型增强包括：

- 插件入口解锁。
- 特殊插件强制安装。
- 会话删除。
- Markdown 导出。
- 项目移动。
- Timeline。
- 用户脚本注入。

这些功能更适合已经熟悉 Codex 的用户。新手如果只是刚开始写第一个项目，没有必要一上来就把所有增强都打开。

### 3.3 中转注入模式

Codex++ 支持把模型请求切到自定义兼容 API，同时保留官方 ChatGPT/Codex 登录态负责账号能力和插件入口。

这个模式的边界要理解清楚：

| 部分 | 谁负责 |
|------|--------|
| Codex App 账号能力、登录态、插件入口 | 官方 ChatGPT/Codex 登录态 |
| 模型请求的 Base URL、Key、模型名 | Codex++ 写入的 provider 配置 |
| 兼容 API 是否可用 | 用户自己选择的上游服务和协议兼容性 |

Codex++ 会把类似下面的 provider 写入 `~/.codex/config.toml`：

```toml
model_provider = "CodexPlusPlus"

[model_providers.CodexPlusPlus]
name = "CodexPlusPlus"
wire_api = "responses"
requires_openai_auth = true
base_url = "https://example.com/v1"
experimental_bearer_token = "sk-..."
```

这类配置改动会影响 Codex 的真实请求路径，所以使用前至少应该确认三件事：

1. Codex 已经检测到 ChatGPT 登录状态。
2. 自定义 Base URL 可访问，并且支持对应协议。
3. `~/.codex/config.toml` 已经备份，方便出问题时回滚。

不要把真实 API Key 放进日志、截图或 issue。

### 3.4 Provider 同步和历史会话

切换 provider 后，很多用户关心的是：旧会话还在不在？

Codex++ 的 Provider 同步功能会在启动前同步本地会话 metadata，让切换供应商后旧会话仍然尽量可见。项目里还专门维护了 Provider Sync 备份路径：

```text
~/.codex/backups_state/provider-sync
```

这说明 Codex++ 的关注点不只是“能不能发请求”，还包括长期使用时的会话连续性。

### 3.5 Upstream worktree 创建

Codex++ 还提供从 `upstream/<base-branch>` 创建新 worktree 的能力。项目 README 给出的等价命令是：

```bash
git worktree add -b <new-branch> <worktree-path> upstream/<base-branch>
```

它的意义是：先 fetch 远端分支，再从更新后的上游分支创建 worktree，减少从陈旧本地 HEAD 派生造成的冲突。

对经常基于上游仓库做修改、开分支、跑 Codex 多任务的人来说，这个功能比普通“复制一个工作区”更可控。

## 四、安装方式

Codex++ 通过 GitHub Releases 发布安装包：

[https://github.com/BigPizzaV3/CodexPlusPlus/releases](https://github.com/BigPizzaV3/CodexPlusPlus/releases)

项目 README 里列出的包名模式是：

| 平台 | 安装包 |
|------|--------|
| Windows | `CodexPlusPlus-*-windows-x64-setup.exe` |
| macOS Intel | `CodexPlusPlus-*-macos-x64.dmg` |
| macOS Apple Silicon | `CodexPlusPlus-*-macos-arm64.dmg` |

macOS 安装后通常会有：

- `/Applications/Codex++.app`
- `/Applications/Codex++ 管理工具.app`

如果 macOS 提示应用无法打开或已损坏，项目 README 说明这是未签名、未公证安装包可能触发的 Gatekeeper 拦截。你需要自己判断是否信任该开源项目和下载来源，再决定是否解除隔离限制。

## 五、什么时候适合用？

Codex++ 更适合这几类用户：

- 已经稳定使用 Codex App，希望减少日常管理摩擦。
- 需要在官方登录态和自定义兼容 API 之间做混合配置。
- 经常导出、移动、整理 Codex 会话。
- 希望管理用户脚本或额外增强入口。
- 经常基于远端上游分支创建新 worktree。

不太适合这几类情况：

- 你还没有跑通 Codex App 的基本使用。
- 你不清楚 `~/.codex/config.toml` 是什么，也不想处理配置回滚。
- 你无法判断第三方安装包和本地注入脚本的风险。
- 你只是想找一个“更聪明的模型”，而不是改善 Codex App 的使用流程。

## 六、使用前要知道的边界

Codex++ 的优势来自“外部增强”，风险也来自这里。

第一，它不是官方产品。Codex App 更新后，页面结构、登录态、配置读取方式都有可能变化，Codex++ 需要跟进适配。

第二，它会读写 Codex 的本地配置和状态。项目 README 提到的关键路径包括：

| 路径 | 用途 |
|------|------|
| `~/.codex/config.toml` | Codex 配置 |
| `~/.codex/auth.json` | Codex 登录状态 |
| `~/.codex/sqlite/*.db` | Codex 本地数据库 |
| `~/.codex/state_5.sqlite` | 旧版本地数据库回退路径 |
| `~/.codex-session-delete/` | Codex++ 状态与日志 |
| `~/.codex/backups_state/provider-sync` | Provider 同步备份 |

第三，中转注入会改变模型请求配置。配置前应该保留备份，并且先用最小请求测试目标 Base URL 和 Key。

第四，macOS 安装包如果没有签名和公证，会被系统拦截。这不是普通用户应该随手忽略的提示，至少要确认下载来源、仓库可信度和自己能承担的风险。

## 七、源码结构

如果你想看它是怎么实现的，可以从这些目录入手：

```text
apps/
  codex-plus-launcher/          静默启动入口
  codex-plus-manager/           Tauri 管理工具
assets/inject/
  renderer-inject.js            注入到 Codex 渲染端的增强脚本
crates/
  codex-plus-core/              启动、注入、配置、更新、安装、桥接等核心逻辑
  codex-plus-data/              会话数据、导出、Provider 同步
scripts/installer/
  windows/CodexPlusPlus.nsi     Windows NSIS 安装包
  macos/package-dmg.sh          macOS DMG 打包
```

源码根目录的 workspace 版本目前显示为 `1.2.9`，并标记为 Rust 2024 edition。项目 README 也说明开发检查大致包括前端检查、Vite 构建、Rust 格式检查、测试和 release 构建。

## 八、一句话总结

Codex++ 的价值不在于“让模型更聪明”，而在于给 Codex App 加了一层外部管理和增强能力：启动、注入、配置、会话整理、Provider 同步、用户脚本和 worktree 创建都被放到一个工具里。

如果你已经深度使用 Codex，它可能很有用；如果你还在入门阶段，先把原版 Codex App 的账号、项目文件夹、Thread 和基本任务跑顺，再考虑引入这类增强工具。
