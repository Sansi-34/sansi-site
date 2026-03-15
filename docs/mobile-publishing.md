# 手机发文与自动部署

## 你以后最省事的发布方式

1. 手机上打开 GitHub 仓库
2. 进入 `src/content/notes/`
3. 复制一篇模板，或者新建一个 `.mdx` 文件
4. 先写草稿，保留 `draft: true`
5. 想发布时改成 `draft: false`
6. 如果想放到首页精选，再加 `featured: true`
7. 提交到 `main` 或 `master`
8. GitHub Actions 自动构建并上传到服务器

## 推荐的文件名

用英文小写加中横线，例如：

- `mi-band-7-unbrick.mdx`
- `first-embedded-note.mdx`
- `oracle-bone-ar-note.mdx`

生成后的文章地址会是：

- `/notes/mi-band-7-unbrick/`

## 最简 frontmatter

```mdx
---
title: 文章标题
description: 一句话描述
date: 2026-03-15
tags:
  - C++
featured: false
draft: true
---
```

下面这些字段现在都有默认值，不写也能过：

- `readingTime`
- `category`
- `kicker`
- `excerpt`
- `related`
- `keywords`

## 你平时真正要记的只有两件事

- `draft: true` 不会上线
- `featured: true` 会优先进入首页精选

## GitHub Secrets 要配什么

到仓库设置里添加这些 `Secrets and variables -> Actions`：

- `DEPLOY_HOST`: `39.97.252.239`
- `DEPLOY_USER`: `root`
- `DEPLOY_PASSWORD`: 你的服务器密码
- `DEPLOY_PATH`: `/var/www/sansi/`
- `DEPLOY_PORT`: `22`

## 现在这套自动部署怎么触发

工作流文件在：

- `.github/workflows/deploy.yml`

触发方式：

- 推送到 `main`
- 推送到 `master`
- 手动点 `Run workflow`

## 一个更稳的小习惯

- 手机上先写草稿：`draft: true`
- 准备让它上首页，再决定要不要 `featured: true`
- 晚点自己过一遍再改成 `draft: false`

这样就不会出现写一半自动上线的情况。
