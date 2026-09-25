# vincejiang.com — 个人站(博客 + demo 作品集)。多阶段构建:
#   ① node 阶段:npm ci + build-site.mjs 把 md/模板/配置 编译成纯静态站到 /out
#      (发布判定用 CI 生成的 posts-manifest.json;本地无 manifest 时所有非 draft 视为已发布)。
#   ② nginx 阶段:只装 /out,零 Node 运行时。
#
# geo-open:不拦内地。HTTPS 由 Cloudflare 边缘终止;容器只听 :80 明文,经宿主机 cloudflared 隧道接入。
#
# 基础镜像钉到大版本(不再用浮动的 nginx:alpine),升级走 dependabot PR,过 CI 再合。
#
# 本地试跑(需先 `cd tools && npm ci && node gen-manifest.mjs` 生成 manifest,或省略走 fallback):
#   docker build -t svc-vincejiang . && docker run --rm -p 8080:80 svc-vincejiang
#   curl -s localhost:8080/health          # → ok
#   curl -s localhost:8080/version.json    # → {"sha":"dev"}(CI 里是本次 git sha)
#   curl -s localhost:8080/blog/            # → 博客索引
FROM node:24-alpine AS build
WORKDIR /src
# 先只拷 tools 的依赖清单,利用层缓存(源码变了不必重装依赖)
COPY tools/package.json tools/package-lock.json ./tools/
RUN cd tools && npm ci --no-audit --no-fund
# 再拷全部源码并编译(build-site 的 COPY_EXCLUDE 决定哪些进 /out)。
# 大体积、几乎不变的二进制目录(STATIC_LAYERS)从 /out 摘掉,下面单独成层。
COPY . .
RUN cd tools && node build-site.mjs --out /out \
 && rm -rf /out/font-compare/fonts

FROM nginx:1.30-alpine
# nginx 配置(覆盖镜像自带的 default.conf)
COPY docker/snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY docker/site.conf                       /etc/nginx/conf.d/default.conf
# STATIC_LAYERS:font-compare 的 320MB 字体独占一层,直接取自源码(不经 build-site)。
# 为什么:旧版整站只有一层,改一个字也要让服务器重新拉 ~290MB。独立层 + --link 后,
# 只要字体没变,构建缓存复用同一个 blob → GHCR 不再涨、服务器 pull 秒过、字体 mtime/ETag 也不变(浏览器 304)。
# 以后再有大块静态资源,照此加一行 COPY,并在上面 build 阶段的 rm 里同步摘掉。
COPY --link font-compare/fonts /usr/share/nginx/html/font-compare/fonts
# 编译产物即站点内容(每次提交都会变的那一层,只有几十 MB)
COPY --link --from=build /out /usr/share/nginx/html
# 版本戳:CI 传入触发构建的 sha,供 deploy.yml 的 verify job / live-drift 从公网核对。放最后,不打断上面的缓存。
ARG GIT_SHA=dev
RUN printf '{"sha":"%s"}\n' "$GIT_SHA" > /usr/share/nginx/html/version.json

EXPOSE 80
# start-interval:启动期每 1s 探一次,容器起来 ~1s 就 healthy。
# 旧版只有 --interval=30s,新容器要等满 30s 才 healthy;而 Traefik 不路由非 healthy 容器,
# 等于每次部署都有约 30s 的 404 空窗。(Docker Engine < 25 会忽略 start-interval,退化为 10s。)
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --start-interval=1s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1
