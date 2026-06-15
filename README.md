# CLWiki

Codex 使用经验知识库，使用纯静态 HTML/CSS/JS 构建，可直接部署到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173`。

## 新增文章

1. 把新的 Markdown 文件放到仓库根目录或自定义子目录。
2. 在 `articles.json` 的 `articles` 数组里新增一项，填写 `id`、标题、分类和 `source`。
3. 本地预览确认目录、表格、图片和链接显示正常。

## GitHub Pages

把仓库推到 GitHub 后，在仓库的 `Settings -> Pages` 中选择对应分支和根目录即可。这个站点不需要构建步骤。
