# stock-analysis：Skill 说明与安装

stock-analysis 是 [anbeime/skill](https://github.com/anbeime/skill) 本地技能库收录的技能，归类在 **文档与分析**。源文件标题是“股票个股分析”。

股票个股分析，实时获取价格涨跌幅。

## 基本信息

| 项目 | 内容 |
|------|------|
| 分类 | 文档与分析 |
| 来源 | anbeime/skill 本地技能库 |
| 评分 | ⭐⭐⭐ |
| 标准入口 | `skills/stock-analysis/stock-analysis/SKILL.md` |
| API 需求 | ✅ 是 |
| API 类型 | 股票数据API（如新浪财经、东方财富等） |

## 适合做什么

适合处理文档、表格、演示或 PDF 等文件型工作，重点是减少手工格式整理和重复转换。 在原始技能管理表中，它的整合状态是：金融专用技能。

使用时可以直接把任务目标说清楚，让代理先读取该 Skill 的 `SKILL.md`，再按其中的流程、依赖和检查点执行。对于需要外部 API、浏览器登录或真实平台发布的技能，先做草稿和本地验证，再确认是否执行线上动作。

## 典型触发方式

```text
请使用 stock-analysis 这个 Skill，先说明你会读取哪些说明文件，再帮我完成这个任务：<写清楚你的具体目标>
```

它还可以和这些技能协同：无。

## 安装方式

这个仓库里存在标准入口：`skills/stock-analysis/stock-analysis/SKILL.md`。如果要安装到 Codex，可以保留整个仓库，再把包含 `SKILL.md` 的目录链接到技能目录。

```bash
mkdir -p ~/src ~/.codex/skills
git clone --depth 1 https://github.com/anbeime/skill.git ~/src/anbeime-skill
ln -s ~/src/anbeime-skill/skills/stock-analysis/stock-analysis ~/.codex/skills/stock-analysis
```

如果目标目录已经存在，不要直接覆盖。先用 `ls -la ~/.codex/skills` 检查已有安装，再决定是更新原仓库还是更换链接。

安装后重启 Codex 或开启新会话，再用该 Skill 名称或典型任务触发验证。

## 一句话总结

stock-analysis 的价值在于把“股票个股分析，实时获取价格涨跌幅”这类任务沉淀成可复用流程。安装时以实际 `SKILL.md` 为准；如果仓库中没有入口文件，就先定位来源，不要创建不可触发的空 Skill。
