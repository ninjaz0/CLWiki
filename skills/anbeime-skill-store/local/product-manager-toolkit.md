# product-manager-toolkit：Skill 说明与安装

product-manager-toolkit 是 [anbeime/skill](https://github.com/anbeime/skill) 本地技能库收录的技能，归类在 **产品与项目管理**。源文件标题是“Product Manager Toolkit”。

产品经理工具包。

## 基本信息

| 项目 | 内容 |
|------|------|
| 分类 | 产品与项目管理 |
| 来源 | anbeime/skill 本地技能库 |
| 评分 | ⭐⭐⭐ |
| 标准入口 | `skills/product-manager-toolkit/product-manager-toolkit/SKILL.md` |
| API 需求 | ❌ 否 |
| API 类型 | 纯本地处理 |

## 适合做什么

适合把该领域的经验、步骤和注意事项固化成代理可复用的执行流程。 在原始技能管理表中，它的整合状态是：产品管理专用。

使用时可以直接把任务目标说清楚，让代理先读取该 Skill 的 `SKILL.md`，再按其中的流程、依赖和检查点执行。对于需要外部 API、浏览器登录或真实平台发布的技能，先做草稿和本地验证，再确认是否执行线上动作。

## 典型触发方式

```text
请使用 product-manager-toolkit 这个 Skill，先说明你会读取哪些说明文件，再帮我完成这个任务：<写清楚你的具体目标>
```

它还可以和这些技能协同：[[sales-ai-assistant]]。

## 安装方式

这个仓库里存在标准入口：`skills/product-manager-toolkit/product-manager-toolkit/SKILL.md`。如果要安装到 Codex，可以保留整个仓库，再把包含 `SKILL.md` 的目录链接到技能目录。

```bash
mkdir -p ~/src ~/.codex/skills
git clone --depth 1 https://github.com/anbeime/skill.git ~/src/anbeime-skill
ln -s ~/src/anbeime-skill/skills/product-manager-toolkit/product-manager-toolkit ~/.codex/skills/product-manager-toolkit
```

如果目标目录已经存在，不要直接覆盖。先用 `ls -la ~/.codex/skills` 检查已有安装，再决定是更新原仓库还是更换链接。

安装后重启 Codex 或开启新会话，再用该 Skill 名称或典型任务触发验证。

## 一句话总结

product-manager-toolkit 的价值在于把“产品经理工具包”这类任务沉淀成可复用流程。安装时以实际 `SKILL.md` 为准；如果仓库中没有入口文件，就先定位来源，不要创建不可触发的空 Skill。
