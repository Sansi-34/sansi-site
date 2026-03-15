# Sansi Site

基于 `Astro + MDX` 的个人博客骨架，按当前原型迁移而来。

## 当前已迁移

- 首页 `/`
- 专题页 `/archive`
- 标签总览 `/tags`
- 标签详情 `/tags/[slug]`
- 文章详情 `/notes/[slug]`
- 关于页 `/about`
- 404 页
- 深浅色三态切换
- 顶部搜索
- 文章目录高亮
- 代码复制按钮
- RSS
- sitemap
- robots.txt

## 项目结构

- `src/content/notes`: 站内笔记 MDX
- `src/data/site.ts`: 站点级文案、旧文入口、关于页信息
- `src/utils/content.ts`: 标签统计、专题轨道、slug 规则
- `src/utils/search.ts`: 搜索索引生成
- `public/assets/site.js`: 主题切换、搜索、TOC、复制交互
- `src/styles/global.css`: 全站样式
- `templates/note-template.mdx`: 新文章模板
- `docs/mobile-publishing.md`: 手机发文与自动部署说明

## 本地启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建输出默认在 `dist/`。

## 手机发文

推荐直接看：

- `docs/mobile-publishing.md`

现在 frontmatter 已经压简单了，最少只要这些字段：

```mdx
---
title: 文章标题
description: 一句话描述
date: 2026-03-15
tags:
  - C++
draft: true
---
```

## GitHub Actions 自动部署

工作流文件：

- `.github/workflows/deploy.yml`

你需要在 GitHub 仓库里配置这些 Secrets：

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PASSWORD`
- `DEPLOY_PATH`
- `DEPLOY_PORT`

配置好之后，推送到 `main` 或 `master` 就会自动构建并上传 `dist/` 到服务器。

## Ubuntu + Nginx 部署

推荐你的服务器走纯静态部署：资源占用最低，也最稳。

### 1. 服务器安装 Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2. 本地构建后上传 `dist/`

可以把 `dist/` 上传到服务器，例如：

```bash
scp -r dist/* root@your-server-ip:/var/www/sansi/
```

### 3. Nginx 站点配置

示例路径：`/etc/nginx/sites-available/sansi`

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/sansi;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/sansi /etc/nginx/sites-enabled/sansi
sudo nginx -t
sudo systemctl reload nginx
```

### 4. HTTPS

后面接域名后建议直接上 `certbot`：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 后续建议

1. 把更多真实文章迁成 `src/content/notes/*.mdx`
2. 买域名后把 `astro.config.mjs` 里的 `site` 改成真实域名
3. 后面把服务器登录从 `root + 密码` 换成 `SSH key`
