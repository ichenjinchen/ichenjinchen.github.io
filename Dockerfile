# Jekyll 本地开发镜像
# 依赖版本由 Gemfile.lock 锁定，Ruby / Bundler 版本与锁文件保持一致，保证任何机器构建结果相同。
FROM ruby:3.4-slim

# 构建参数：让容器内的用户 UID/GID 与宿主机一致，避免挂载目录产生的文件无法读写。
# macOS 默认 1000 即可；Linux 上用 `UID=$(id -u) GID=$(id -g) docker compose up` 传入。
ARG UID=1000
ARG GID=1000

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    JEKYLL_ENV=docker \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

# 只装编译原生扩展所需的最小系统包，nodejs 不再需要（assets/js/main.min.js 已提交）
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential \
      git \
      curl \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g "${GID}" app \
    && useradd -m -u "${UID}" -g app app

WORKDIR /usr/src/app

# 先只复制依赖清单：改动源码不会触发重新安装 gem
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 4.0.7 --no-document \
    && bundle install \
    && rm -rf /usr/local/bundle/cache/*.gem /usr/src/app/.bundle

# 再复制源码（compose 下会被 bind mount 覆盖，这里保证单独 docker run 也能用）
COPY --chown=${UID}:${GID} . .

USER app

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "-H", "0.0.0.0", "-w", "--config", "_config.yml,_config_docker.yml"]
