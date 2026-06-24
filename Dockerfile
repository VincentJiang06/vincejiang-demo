# vincejiang.com — 纯静态 demo 展示站。
# 单阶段:把仓库根目录的静态内容塞进 nginx:alpine 发布。没有 Node 构建步骤——
# 仓库里放什么(index.html + 各 demo 文件夹),容器里就发布什么。
#
# geo-open:不拦内地(产品展示站,与 UniWild 野史站的拦内地逻辑无关)。
# HTTPS 由 Cloudflare 边缘终止;容器只听 :80 明文,经宿主机 cloudflared 隧道接入。
#
# 本地试跑:  docker build -t svc-vincejiang . && docker run --rm -p 8080:80 svc-vincejiang
#           curl -s localhost:8080/health   # → ok
FROM nginx:alpine

# nginx 配置(覆盖镜像自带的 default.conf)
COPY docker/snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY docker/site.conf                       /etc/nginx/conf.d/default.conf

# 站点静态内容 = 仓库根目录。关键约定:在根目录新增一个 demo 文件夹 → 自动收录 → 上线即可见。
# 随后删掉混进来的基础设施/元文件,不让它们被对外发布。
COPY . /usr/share/nginx/html
RUN cd /usr/share/nginx/html \
 && rm -rf docker Dockerfile .dockerignore .github .git .gitignore SPEC.md README.md LICENSE

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1
