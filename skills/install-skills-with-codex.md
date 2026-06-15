# Skill 清单里的 Skill 怎么安装：直接用自然语言让 Codex 自己装

很多人第一次看到 Codex 的 **Skills 清单**，会有一个很自然的问题：

> 这些 Skill 看起来很有用，但我要怎么安装？

最简单的答案是：

> **不要先急着自己抄命令。把你想装的 Skill 名称、GitHub 地址或清单截图发给 Codex，用自然语言说清楚目标，让 Codex 自己检查、安装和验证。**

这才是 Codex 最适合发挥的地方。Skill 安装本质上就是文件、目录、GitHub 仓库和本地配置的组合操作，正好属于 Codex 擅长处理的范围。

---

## 一、先理解：清单里的 Skill 分几种

你看到的 Skill 清单，通常可能混着几种来源：

| 类型 | 含义 | 是否需要安装 |
|------|------|--------------|
| 当前会话已经列出的 Skill | Codex 这轮已经能看到的技能 | 通常不用再装 |
| 系统内置 Skill | Codex 自带或插件预装的技能 | 通常不用手动装 |
| GitHub 仓库里的 Skill | 别人开源的技能目录，例如科研写作 Skill | 需要安装到本机技能目录 |
| OpenAI curated / experimental Skill | 官方技能仓库里的可安装技能 | 需要按名称或路径安装 |
| 本地项目里的 Skill | 你电脑上某个目录里的 `SKILL.md` | 需要复制或链接到技能目录 |

所以第一步不是直接安装，而是先让 Codex 判断：**这个 Skill 是已经可用，还是需要安装。**

可以直接这样说：

```text
帮我检查一下这个 Skill 是否已经安装；如果没有，就帮我安装，并说明安装到了哪里。
```

## 二、最推荐的方法：把需求说给 Codex

你不需要记住 `$CODEX_HOME`、符号链接、Git sparse checkout 这些细节。更好的方式是把目标说清楚，让 Codex 去查本机环境。

例如：

```text
帮我安装 Norman-bury/research-writing-skill 这个 GitHub 仓库里的科研写作 Skill。
安装前先检查我的 Codex 技能目录，安装后帮我验证文件是否存在。
```

或者：

```text
我想安装 skill 清单里的 research-writing-assistant。
你先判断它是不是已经在当前 Codex 里可用；如果没有，就从对应 GitHub 仓库安装。
```

再比如你只有一个链接：

```text
帮我把这个 Skill 安装到 Codex：
https://github.com/Norman-bury/research-writing-skill

安装完成后告诉我是否需要重启 Codex。
```

这些说法比直接复制命令更稳，因为 Codex 会先看你本机的真实目录、已有文件和当前配置，减少装错位置或重复安装的概率。

## 三、Codex 通常会怎么安装

不同 Skill 仓库的结构不完全一样，但安装动作大致只有两种。

第一种是**直接安装某个 Skill 目录**。一个标准 Skill 通常包含 `SKILL.md`，Codex 可以把这个目录安装到技能目录里。通用安装器通常会把技能放到类似下面的位置：

```text
~/.codex/skills/<skill-name>
```

第二种是**克隆仓库，然后用目录链接接入**。有些仓库会把很多 Skill 放在同一个 `skills/` 目录里，例如 `research-writing-skill`。这种情况下，更适合保留整个仓库，再把其中的技能目录链接到 Codex 能发现的位置。

以 Research Writing Skill 为例，它的 Codex 安装说明大致是：

```bash
git clone https://github.com/Norman-bury/research-writing-skill.git ~/.codex/research-writing-skill
mkdir -p ~/.agents/skills
ln -s ~/.codex/research-writing-skill/skills ~/.agents/skills/research-writing
```

但普通用户不一定要手动敲这些命令。你可以让 Codex 读仓库里的安装说明，然后自己执行。

更推荐这样说：

```text
请根据这个仓库自己的 Codex 安装说明来安装：
https://github.com/Norman-bury/research-writing-skill

不要盲目覆盖已有目录。先检查是否已经安装；如果已经安装，只告诉我如何更新。
```

## 四、安装前应该让 Codex 检查什么

安装 Skill 之前，最好让 Codex 先做三件事：

1. 检查当前 Codex 能读取哪些技能目录。
2. 检查目标 Skill 是否已经存在。
3. 检查 GitHub 仓库里真正的 `SKILL.md` 或 `skills/` 目录结构。

你可以直接把这些要求写进一句话里：

```text
帮我安装这个 Skill。安装前请先检查：
1. 我本机 Codex 的技能目录在哪里；
2. 这个 Skill 是否已经存在；
3. GitHub 仓库里哪个目录才是真正的 Skill 目录。

确认后再安装，安装完帮我验证。
```

这句话的意义很大。它避免了三个常见错误：

- 把整个仓库装成一个 Skill，结果 Codex 找不到入口。
- 重复安装到两个不同目录，后面不知道哪个在生效。
- 覆盖已有本地修改。

## 五、安装后必须重启 Codex

Skill 安装完成后，通常需要重启 Codex，新的 Skill 才会被下一轮会话发现。

所以安装完成后，你应该让 Codex 给出两个结果：

```text
安装完成后请告诉我：
1. 安装路径；
2. 我是否需要重启 Codex；
3. 重启后怎么验证这个 Skill 已经生效。
```

重启之后，你可以开一个新会话测试：

```text
你现在能看到哪些 research-writing 相关的 Skill？请列出来。
```

或者直接用触发场景测试：

```text
我要写一篇毕业论文，请使用科研写作相关 Skill，先帮我做选题和结构规划。
```

如果 Skill 生效，Codex 通常会说明它正在使用对应的写作流程，而不是直接生成一整篇文章。

## 六、几个可以直接复制的例子

### 例子 1：安装 GitHub Skill 仓库

```text
帮我安装这个 Codex Skill：
https://github.com/Norman-bury/research-writing-skill

要求：
1. 先检查是否已经安装；
2. 按仓库里的 Codex 安装说明执行；
3. 不要覆盖已有目录；
4. 安装后告诉我安装路径和是否需要重启 Codex。
```

### 例子 2：安装清单里的某个 Skill

```text
我想安装 Skill 清单里的 nature-writing。
请先确认它现在是不是已经可用；如果不可用，请查找对应来源并安装。
安装后验证 `SKILL.md` 是否存在。
```

### 例子 3：安装官方 curated Skill

```text
帮我列出 OpenAI curated skills 里可以安装的技能。
我选定之后，你再帮我安装到 Codex 技能目录。
```

### 例子 4：从本地目录安装

```text
这个目录里有我自己写的 Skill：
/Users/me/projects/my-skill

请检查里面是否有 `SKILL.md`，如果结构正确，就帮我安装到 Codex 能发现的技能目录。
```

### 例子 5：更新已经安装的 Skill

```text
帮我更新已经安装的 research-writing Skill。
先确认它是复制安装还是 Git 仓库链接安装，再选择合适的更新方式。
更新后不要自动重启 Codex，只告诉我下一步怎么做。
```

## 七、什么时候不要直接让 Codex 安装

自然语言安装很方便，但不代表什么都应该直接装。

遇到下面几种情况，应该先停一下：

- 仓库来源不明确，或者不是你信任的作者。
- Skill 要求你提供 API Key、Token 或账号密码。
- 安装说明要求修改系统级目录。
- Codex 提示目标目录已经存在，但你不知道里面是什么。
- 你只是想临时试一下，不确定后续是否长期使用。

这时更好的说法是：

```text
先不要安装。请你只阅读这个 Skill 的安装说明和源码结构，告诉我它会改哪些本地文件，以及有什么风险。
```

## 八、一句话总结

Skill 的安装不应该变成用户手动抄命令的负担。

你只要把三件事说清楚：

- **我要装哪个 Skill**
- **来源在哪里**
- **安装前先检查，安装后要验证**

剩下的目录判断、仓库读取、链接创建、文件检查，都可以交给 Codex 完成。

最实用的一句话是：

```text
帮我安装这个 Skill。先检查是否已经安装，不要覆盖已有内容；安装后告诉我路径、验证结果，以及是否需要重启 Codex。
```
