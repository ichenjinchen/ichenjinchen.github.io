# Docker 本地运行

不需要在宿主机装 Ruby、Bundler、Jekyll。镜像里已经装好，依赖版本由 `Gemfile.lock` 锁定。

## 首次

```bash
git clone git@github-jason:ichenjinchen/ichenjinchen.github.io.git
cd ichenjinchen.github.io
docker compose up -d --build     # 首次构建约 1–2 分钟，之后秒级
```

打开 http://localhost:4000

## 日常

```bash
docker compose up -d        # 启动
docker compose logs -f      # 看构建日志
docker compose down         # 停止
docker compose up -d --build   # 改了 Dockerfile / Gemfile 后重建
```

改动 `_pages`、`_data`、`_includes` 等源码会自动重建（`-w` 监听 + bind mount）。
若发现改文件没触发重建，是 Docker Desktop 的文件事件丢失，在 `docker-compose.yaml`
的 command 末尾加 `--force_polling` 即可。

## Linux 宿主

UID/GID 要跟宿主机对齐，否则 `_site` 会写成 root 属主：

```bash
UID=$(id -u) GID=$(id -g) docker compose up -d --build
```

## 说明

- 镜像基于 `ruby:3.4-slim`，Bundler 固定 4.0.7（与 `Gemfile.lock` 的 `BUNDLED WITH` 一致）。
- `Gemfile.lock` 已纳入版本管理；改依赖请用 `docker compose run --rm jekyll-site bundle update <gem>`，不要手改。
- 站点内容（荣誉、活动、个人资料）存在 Supabase 云端，容器只负责渲染，不改变内容。
- 发布仍由 GitHub Pages 自己构建，本地 Docker 只用于预览和写作。
