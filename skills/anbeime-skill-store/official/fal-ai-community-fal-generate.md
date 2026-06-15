# fal-ai-community/fal-generate：Skill 说明与安装

fal-ai-community/fal-generate 是 [anbeime/skill](https://github.com/anbeime/skill) 技能商店收录的官方技能，来源条目指向：[https://github.com/fal-ai-community/skills/blob/main/skills/claude.ai/fal-generate/SKILL.md](https://github.com/fal-ai-community/skills/blob/main/skills/claude.ai/fal-generate/SKILL.md)。

它在技能商店中的分类是 **fal.ai 团队技能**。Generate images and videos using fal.ai AI models。

## 适合做什么

适合把该领域的经验、步骤和注意事项固化成代理可复用的执行流程。

更具体地说，可以在任务里把它当成一组可复用的操作规程：让代理先读取该 Skill 的说明，再按其中的步骤、约束和检查清单执行。这样比临时写提示词更稳定，也更容易复现。

## 什么时候使用

- 任务和该 Skill 的描述高度一致，需要固定流程而不是一次性回答。
- 你希望代理先遵循来源仓库中的约束，再进行文件修改、分析或生成。
- 任务会反复出现，值得把流程沉淀为可复用能力。

## 使用前注意

安装前先确认来源仓库是否仍然维护、目录里是否存在 `SKILL.md`，以及是否需要额外依赖或账号权限。对会修改线上服务、账号内容、生产代码或真实数据的 Skill，应该先让 Codex 只做结构检查和风险说明，再决定是否执行。

## 安装方式

最稳妥的方式是把来源链接发给 Codex，让它先检查仓库结构，再安装到本机技能目录。可以直接这样说：

```text
帮我安装这个 Skill：https://github.com/fal-ai-community/skills/blob/main/skills/claude.ai/fal-generate/SKILL.md
安装前先确认目录里有 SKILL.md 或明确的技能入口；不要覆盖已有目录；安装后告诉我安装路径和是否需要重启 Codex。
```

这个来源指向仓库中的单个文件。安装时不要链接这个文件本身，而是克隆仓库后检查 `skills/claude.ai/fal-generate` 目录是否包含完整 `SKILL.md` 和配套资源。

手动安装可以参考：

```bash
mkdir -p ~/src ~/.codex/skills
git clone --depth 1 https://github.com/fal-ai-community/skills.git ~/src/fal-ai-community-skills
ls ~/src/fal-ai-community-skills/skills/claude.ai/fal-generate
# 确认该目录包含 SKILL.md 后，再链接到 ~/.codex/skills/fal-generate
```

安装或链接完成后，重启 Codex 或开启新会话，再用该 Skill 的名称或典型任务触发验证。

## 一句话总结

fal-ai-community/fal-generate 的价值在于把“Generate images and videos using fal.ai AI models”这类任务转成可复用的代理流程。安装时以来源链接和实际 `SKILL.md` 为准，不要把没有入口文件的目录当成已安装成功。
