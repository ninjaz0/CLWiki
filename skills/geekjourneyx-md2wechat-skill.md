# geekjourneyx/md2wechat-skill

`md2wechat` 是面向 AI Agent 的微信公众号创作与发布 CLI。它把 Markdown 转成微信公众号可用的 HTML，也支持本地预览、微信草稿上传、文章封面和信息图生成、写作风格生成、AI 去痕、主题和排版模块发现。

项目地址：[github.com/geekjourneyx/md2wechat-skill](https://github.com/geekjourneyx/md2wechat-skill)

本页基于目标仓库当前内容整理：`VERSION` 为 `2.6.0`，读取到的提交为 `4982a41`。

## 适合什么场景

- 已经用 Markdown 写公众号文章，希望转换成微信编辑器友好的 HTML。
- 希望先本地预览，再决定是否上传图片或创建微信草稿。
- 希望 Agent 按固定 SOP 操作，而不是靠临时 prompt 猜命令。
- 希望使用主题、结构化排版模块、封面图、信息图、写作风格和 AI 去痕流程。

## 安装 CLI

如果你已经有 Node/npm，官方 README 推荐：

```bash
npm install -g @geekjourneyx/md2wechat
```

如果 npm 镜像刚发布后短暂不可用，可以指定官方源：

```bash
npm install -g @geekjourneyx/md2wechat --registry=https://registry.npmjs.org/
```

macOS 或 Linux 也可以用 Homebrew：

```bash
brew install geekjourneyx/tap/md2wechat
```

验证安装：

```bash
md2wechat version --json
md2wechat skills read md2wechat --json
```

`skills read` 会读取当前 CLI 内置的 Agent 操作协议。它不是额外安装外部 skill，而是确认当前二进制和内置 SOP 一致。

## 初始化配置

首次使用先生成配置文件：

```bash
md2wechat config init
```

默认配置位置：

```text
~/.config/md2wechat/config.yaml
```

如果要创建微信公众号草稿，至少需要配置：

- `wechat.appid`
- `wechat.secret`
- `api.md2wechat_key`

## 推荐工作流

对一篇本地 Markdown，先检查，再预览，最后转换：

```bash
md2wechat inspect article.md --json
md2wechat preview article.md
md2wechat convert article.md -o article.html
```

创建微信草稿需要显式提供封面：

```bash
md2wechat convert article.md --draft --cover cover.jpg
```

`preview` 只生成本地预览，不上传图片、不创建草稿，也不会改写原 Markdown。涉及上传、草稿、发布、远程图片生成的动作，都应该在用户明确要求后再执行。

## Agent 使用规则

目标仓库的 `skills/md2wechat/SKILL.md` 把操作分成几类：

- 标准文章 HTML、预览、元数据检查、微信草稿：用 `inspect`、`preview`、`convert`。
- 图片优先帖子、小绿书、多图帖子：用 `create_image_post`，不要和 `convert --draft` 混用。
- 封面或信息图：优先用 `generate_cover` 或 `generate_infographic`。
- 写作风格生成或 AI 去痕：用 `write` 或 `humanize`。
- 不确定主题、provider、prompt 或排版模块时，先运行 discovery 命令，不要凭记忆猜。

常用 discovery：

```bash
md2wechat themes list --json
md2wechat layout list --json
md2wechat providers list --json
md2wechat capabilities --json
```

当本地 CLI 版本可能和仓库文档不一致时，优先读取当前可执行文件内置 SOP：

```bash
md2wechat skills read md2wechat --json
```

## 可以直接对 Codex 这样说

```text
帮我用 md2wechat 处理 article.md：先 inspect，再 preview。如果没有 blocker，再生成 article.html。不要上传图片，也不要创建微信草稿。
```

```text
帮我把 article.md 转成微信公众号草稿。先检查 md2wechat 配置和文章 readiness；如果缺少封面、微信凭证或 API key，先停下来告诉我。
```

```text
帮我用 md2wechat 给这篇公众号文章选择合适主题和少量排版模块。先运行 themes/layout discovery，不要直接猜模块语法。
```
