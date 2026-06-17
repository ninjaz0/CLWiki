# Yuan1z0825/nature-skills

`nature-skills` 是一组面向 Codex 和其他 Agent 的科研写作、论文阅读、学术绘图、引用检索、审稿回复、论文转 PPT、论文转专利等 Skill 集合。它不是一个 Python 包，也不是 npm 包；仓库里的每个 `skills/nature-*` 文件夹才是一个可安装的 Skill 单元，核心入口是该文件夹里的 `SKILL.md`。

项目地址：[github.com/Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills)

本页基于目标仓库当前内容整理：读取到的 `main` 分支 `HEAD` 为 `57b15c75678c9ed53f94ae02c8be4c4db48b9814`。仓库说明为“符合nature论文学术表达和科研绘图的Skill”。

## 它解决什么问题

普通对话式 AI 可以帮你改一段文字、解释一篇论文或画一个图，但它经常有三个问题：

- 输出标准不稳定，同一个任务每次都靠 prompt 临场约束。
- 学术场景要求细，写作、引用、图表、审稿回复各有不同规则。
- Agent 容易把“看起来像 Nature 风格”误解成泛泛的润色或排版。

`nature-skills` 的思路是把这些高频科研任务拆成一组可复用的操作协议。每个 Skill 都写明触发场景、工作流、禁止事项、参考文件和输出格式，让 Agent 在处理 Nature 或高影响力期刊相关任务时，不是临时发挥，而是按固定规则执行。

## 适合什么人

- 正在写英文论文，希望把中文草稿、实验结果或图注整理成更接近 Nature 系列文章的表达。
- 需要从论文生成中文精读 Markdown、组会 PPT、审稿意见回复或 Data Availability 声明。
- 希望让 Codex 按明确流程画科研图，而不是只生成一段一次性的 matplotlib 代码。
- 需要做文献检索、DOI/PMID/arXiv ID 校验、引用格式转换或 Zotero/EndNote 文件导出。
- 想把论文、技术报告或实验材料整理成中文发明专利初稿，但仍保留人工和专利专业人士复核。

## 安装重点

官方文档反复强调一个规则：

> 不要只复制 `SKILL.md`，要复制或引用完整的 skill 文件夹。

原因是很多 Skill 依赖同级目录里的 `references/`、`static/`、`manifest.yaml`、脚本、资源文件，或者 `skills/_shared/` 里的共享材料。只复制单个 `SKILL.md`，表面上看像安装成功，实际运行时会缺参考文件。

给 Codex 的推荐安装话术：

```text
Install the Codex skills from this repository:
https://github.com/Yuan1z0825/nature-skills.git

Please install the full skill folders under skills/, including skills/_shared,
into my Codex skills directory. Do not copy only SKILL.md.
```

如果只安装一个 Skill，也要点名保留共享目录：

```text
Install only nature-reader from:
https://github.com/Yuan1z0825/nature-skills.git

Also install skills/_shared if the skill needs shared support files.
```

手动安装全部 Skill 的基本命令：

```bash
git clone https://github.com/Yuan1z0825/nature-skills.git
cd nature-skills
mkdir -p ~/.codex/skills
cp -R skills/_shared ~/.codex/skills/
for d in skills/nature-*; do
  cp -R "$d" ~/.codex/skills/
done
```

安装或更新后，建议开启一个新的 Codex 会话，让系统重新发现本地 Skill。

## Skill 总览

| Skill | 状态 | 主要用途 | 适合怎么说 |
|------|------|----------|------------|
| `nature-figure` | Stable | 生成 Nature 或高影响力期刊风格的 Python/R 科研图，强调多面板结构、字体、配色、SVG 可编辑输出 | “帮我做一张 Nature figure” |
| `nature-polishing` | Stable | 学术英文润色和中英转换，控制句长、时态、hedging、英式拼写和过度声明 | “把这段润色成 Nature style” |
| `nature-writing` | Draft | 从结果、图、笔记或中文草稿重建论文段落，包括摘要、引言、结果、讨论和方法 | “帮我写 introduction” |
| `nature-reviewer` | Draft | 以 Nature 风格审稿人视角做预投稿评估，输出多位审稿意见和综合风险 | “用审稿人视角评估这篇稿子” |
| `nature-citation` | Beta | 为文本或 claim 查找 Nature/CNS 系列引用候选，并导出 ENW、RIS 或 Zotero RDF | “帮我找支撑这段的 CNS citation” |
| `nature-data` | Draft | 写 Data Availability、仓储计划、数据引用和 FAIR 元数据检查 | “帮我写 data availability statement” |
| `nature-reader` | Beta | 把论文做成双语 Markdown 精读稿，带原文锚点、图文对应和结构化解释 | “把这篇论文转成全文中英对照 Markdown” |
| `nature-response` | Beta | 写或审查逐点回复审稿意见，给每条意见编号、分类、映射修改动作和证据位置 | “帮我写 response to reviewers” |
| `nature-paper2ppt` | Beta | 把论文、PDF、摘要或阅读笔记做成中文组会、journal club 或论文汇报 PPTX | “把这篇 paper 做成中文 PPT” |
| `nature-paper-to-patent` | Beta | 从论文、技术报告、代码和图表生成有证据链的中文发明专利草稿 | “把这篇论文转成专利初稿” |
| `nature-academic-search` | Beta | 通过本地 MCP 工作流搜索 PubMed、CrossRef、arXiv，校验标识符并管理引用文件 | “search papers / verify DOI / literature search” |

## 推荐使用方式

最有效的用法不是只说“帮我用 nature-skills”，而是把任务、材料和交付物说清楚。

例如读论文：

```text
用 nature-reader 处理这篇 PDF。请输出完整中文-英文对照 Markdown，
保留章节结构、关键图表解释和原文锚点，不要遗漏图文对应关系。
```

例如学术润色：

```text
用 nature-polishing 润色下面这段 Results。保留原始数据和含义，
不要新增引用或机制解释。请同时指出过度声明和证据不足的位置。
```

例如科研绘图：

```text
用 nature-figure 基于这份 CSV 做一张多面板结果图。主输出为 SVG，
PNG 只作为预览。请避免重复面板，每个 panel 回答一个不同科学问题。
```

例如论文转 PPT：

```text
用 nature-paper2ppt 把这篇论文做成中文 journal club PPTX。
请以论文的科学论证链为主线，不要机械照搬 Introduction、Methods、Results 的顺序。
```

例如审稿回复：

```text
用 nature-response 帮我整理这组 reviewer comments。
请给每条意见编号，区分必须修改、可以解释、需要作者补充的信息，
不要编造尚未完成的实验、页码或行号。
```

## 关键原则

`nature-skills` 的共同设计原则可以概括成五点：

- **一手来源优先**：规则来自 Nature 文章、官方指南或明确的学术规范，而不是泛泛的“高级感”。
- **显式规则优先**：每个 Skill 都尽量写清楚为什么这样做，而不是只给一句风格要求。
- **按章节处理**：摘要、引言、结果、讨论、方法、图表和审稿回复的逻辑不同，不能用一套润色模板覆盖。
- **输出物优先**：目标是能直接使用的英文段落、双语 Markdown、SVG、PPTX、引用文件或审稿回复，而不是只给建议。
- **文件夹自包含**：每个 `nature-*` Skill 独立成目录，新增或更新某个 Skill 不应该影响其他 Skill。

## 使用边界

`nature-skills` 能显著降低科研写作和材料整理的流程成本，但它不是学术事实生成器。

- 不应该让它凭空补实验数据、机制、样本量、统计结果、页码、行号或引用。
- 润色和写作类任务需要作者提供真实结果、图表、方法和论点边界。
- 引用类任务需要对 DOI、PMID、arXiv ID 和期刊范围做核验，不能把候选引用当成已读证据。
- 专利草稿只能作为发明人与专利专业人士复核前的技术文档草稿，不等于专利性、侵权、权属或可提交意见。
- 如果你只想快速问一个概念，不一定要调用 Skill；当任务有明确交付物和重复流程时，Skill 才最有价值。

## 什么时候不该用

- 只是想查一个术语定义，用普通搜索或问答更快。
- 没有提供论文、数据、图表、审稿意见或草稿，却要求生成“完整论文”。
- 任务本身不属于科研写作、阅读、绘图、引用、回复、PPT 或专利材料。
- 需要法律、伦理、医学或投稿策略的最终判断时，应该让专业人士复核。

## 一句话总结

`nature-skills` 更像是一套“科研 Agent 操作手册”，而不是一个单一工具。它把 Nature 风格写作、图表、引用、阅读、审稿回复和论文衍生材料拆成可触发、可复用、可检查的 Skill，适合把高频科研工作变成稳定流程。
