# vincejiang.com — 个人站(博客 + demo 作品集)。多阶段构建:
#   ① node 阶段:npm ci + build-site.mjs 把 md/模板/配置 编译成纯静态站到 /out
#      (发布判定用 CI 生成的 posts-manifest.json;本地无 manifest 时所有非 draft 视为已发布)。
#   ② nginx 阶段:只装 /out,零 Node 运行时。
#
# geo-open:不拦内地。HTTPS 由 Cloudflare 边缘终止;容器只听 :80 明文,经宿主机 cloudflared 隧道接入。
#
# 本地试跑(需先 `cd tools && npm ci && node gen-manifest.mjs` 生成 manifest,或省略走 fallback):
#   docker build -t svc-vincejiang . && docker run --rm -p 8080:80 svc-vincejiang
#   curl -s localhost:8080/health          # → ok
#   curl -s localhost:8080/blog/            # → 博客索引
FROM node:22-alpine AS build
WORKDIR /src
# 先只拷 tools 的依赖清单,利用层缓存(源码变了不必重装依赖)
COPY tools/package.json tools/package-lock.json ./tools/
RUN cd tools && npm ci --no-audit --no-fund
# 再拷全部源码并编译(build-site 的 COPY_EXCLUDE 决定哪些进 /out,替代旧 Dockerfile 的 rm 清理)
COPY . .
RUN cd tools && node build-site.mjs --out /out

FROM nginx:alpine
# nginx 配置(覆盖镜像自带的 default.conf)
COPY docker/snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY docker/site.conf                       /etc/nginx/conf.d/default.conf
# 编译产物即站点内容
COPY --from=build /out /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1
