# NanoBanana-PPT-Skills：Skill 说明与安装

NanoBanana-PPT-Skills 是 [anbeime/skill](https://github.com/anbeime/skill) 本地技能库收录的技能，归类在 **PPT与演示**。

基于AI自动生成高质量PPT图片和视频。

## 基本信息

| 项目 | 内容 |
|------|------|
| 分类 | PPT与演示 |
| 来源 | anbeime/skill 本地技能库 |
| 评分 | ⭐⭐⭐⭐⭐ |
| 标准入口 | 当前仓库未找到标准 `SKILL.md` |
| API 需求 | ✅ 是 |
| API 类型 | Google Gemini API（PPT图片生成） |

## 适合做什么

适合把该领域的经验、步骤和注意事项固化成代理可复用的执行流程。 在原始技能管理表中，它的整合状态是：核心技能，PPT图片+视频生成。

使用时可以直接把任务目标说清楚，让代理先读取该 Skill 的 `SKILL.md`，再按其中的流程、依赖和检查点执行。对于需要外部 API、浏览器登录或真实平台发布的技能，先做草稿和本地验证，再确认是否执行线上动作。

## 典型触发方式

```text
请使用 NanoBanana-PPT-Skills 这个 Skill，先说明你会读取哪些说明文件，再帮我完成这个任务：<写清楚你的具体目标>
```

它还可以和这些技能协同：[[ppt-generator]], [[pptx-generator]]。

## 安装方式

当前克隆的 anbeime/skill 仓库没有为这个条目提供可验证的标准 `SKILL.md` 入口。它可能只存在于历史备份、本地 D 盘目录、外部仓库，或只是技能清单中的索引项。

不要把空目录直接链接成 Skill。建议先这样处理：

```bash
git clone --depth 1 https://github.com/anbeime/skill.git ~/src/anbeime-skill
find ~/src/anbeime-skill -iname '*nanobanana*ppt*skills*' -print
find ~/src/anbeime-skill -name SKILL.md -print
```

只有在找到包含 `SKILL.md` 的真实目录后，才把该目录复制或链接到 `~/.codex/skills/`。

安装后重启 Codex 或开启新会话，再用该 Skill 名称或典型任务触发验证。

## 一句话总结

NanoBanana-PPT-Skills 的价值在于把“基于AI自动生成高质量PPT图片和视频”这类任务沉淀成可复用流程。安装时以实际 `SKILL.md` 为准；如果仓库中没有入口文件，就先定位来源，不要创建不可触发的空 Skill。
