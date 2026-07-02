# vincejiang.com — 部署与维护规范(SPEC)

> 这份文档是「权威说明」。任何人(或 agent)想发文章、加 demo、或排障,**先读这一份**。
> 改了部署逻辑(Dockerfile / workflow / nginx 配置 / 生成器),**必须同步更新本文件**。

---

## 1. 这是什么

`vincejiang.com` 是 Vince(小蒋)的个人站,三块内容:
- **Blog**(`/blog/`):md 写就的博客杂谈与技术笔记;
- **Gallery**(`/gallery/`):交互式 demo / 实验的作品集索引(status-ai、HiFi 笔记、Mac 选购等);
- **门户首页**(`/`):汇聚 Blog 最新、Gallery、以及六个香港高校「非官方」野史站的入口。

- 仓库:`github.com/VincentJiang06/vincejiang-demo`(**public**)。push 用 SSH 别名 `github-vincent`;git 提交身份 `Vince Jiang <realvincentjiang@gmail.com>`。
- 线上:`https://vincejiang.com` 和 `https://www.vincejiang.com`。
- **构建方式**:仓库存 **md 源 + 模板 + 生成器**;镜像构建时由 `tools/build-site.mjs` 编译成纯静态站。没有后端、没有数据库(唯一例外见 §11 的 status-ai)。

托管在自有服务器(Vultr 东京)上,经 **Cloudflare Tunnel** 对外。和该机其他 6 个站共用基础设施:`cloudflared 隧道 → Traefik 反代 → 每站一个 Docker 容器`。

---

## 2. 怎么发一篇博客文章(TL;DR)

**三步:**
1. 在 `posts/` 放一个 md,比如 `posts/my-post.md`(带图就建目录 `posts/my-post/index.md` + 同目录放图);
2. 写好 frontmatter(至少 `title`);
3. `git commit`,**commit message 里带「发布」二字**(或 `[publish]`),`git push`。

约 1~2 分钟后 `https://vincejiang.com/blog/my-post/` 就上线,首页最新列表 / Blog 索引 / RSS / sitemap 全自动更新。

**发布判定(关键)**:一篇 md「已发布」⟺ **git 历史里存在任一触碰过它的 commit,其 message 含「发布」或 `[publish]`**。
- commit 没写「发布」→ 文件躺在仓库里但**不上线**(草稿);之后任何一次带「发布」的 commit 碰它(改一个字也行)即上线;
- frontmatter 写 `draft: true` → 强制隐藏(优先级最高,压过发布词);
- 这套判定由 CI 的 `tools/gen-manifest.mjs` 读 git 历史算出,**无状态、无机器人回写**。

**frontmatter 字段**:
```yaml
---
title: 必填
description: 建议填;缺省时取正文首段前 ~120 字
tags: [可选]
date: 2026-07-03      # 可选;缺省 = 首次「发布」commit 的日期(真实,禁虚刷)
updated: 2026-07-05   # 可选;缺省 = 最后一次「发布」commit 的日期
draft: true           # 可选;强制隐藏
cover: cover.png      # 可选;带图目录文章的封面(相对本文件目录)
---
```
- slug = 文件名 / 目录名(kebab-case)。**发布后别改名**(URL 会变);非改不可就在 `docker/site.conf` 加 301。

---

## 3. 怎么加一个 demo(老工作流,不变)

1. 在**仓库根目录**建一个文件夹,如 `my-demo/`,里面至少放一个 `index.html`(可带 js/css/图片,全静态);
2. 生成器会**原样收录**根目录下的内容文件夹(除基础设施/元文件外);
3. `git commit && git push`。约 1~2 分钟后 `https://vincejiang.com/my-demo/` 可访问。
4. 想让它出现在 Gallery / 首页,往 `site.config.json` 的 `gallery` 数组加一条。

干净 URL:`/my-demo` 自动找 `/my-demo/index.html`;`/foo` 找 `/foo.html`。

---

## 4. 目录结构

```
posts/            # 博客 md 源(posts/<slug>.md 或 posts/<slug>/index.md + 图)
templates/        # base.html(页骨架)+ site.css(全站单一样式源)
tools/            # 生成器 —— build-site.mjs / gen-manifest.mjs / audit.mjs + package.json
site.config.json  # 首页 & gallery 的单一数据源(6 野史站 + gallery 作品)
<demo>/           # 各 demo 文件夹(status-ai / vince-hifi-notes / mac-buying-demo …),原样收录
docker/           # nginx 配置(site.conf + snippets/security-headers.conf)
Dockerfile        # 多阶段:node 编译 → nginx 发布
.github/workflows/# deploy.yml(check→image→deploy)+ audit.yml(手动审计)
```
**生成物**(不入库,构建时产出):`index.html`、`/blog/**`、`/gallery/`、`sitemap.xml`、`llms.txt`、`posts-manifest.json`。

**不对外发布**(生成器的 COPY_EXCLUDE + .dockerignore 挡掉):`docker/ tools/ templates/ posts/ site.config.json .github/ .git SPEC.md README.md node_modules posts-manifest.json`。

---

## 5. 端到端架构

```
浏览器 ──HTTPS──▶ Cloudflare 边缘(终止 TLS)
                    │ Public Hostname: vincejiang.com / www → 隧道
                    ▼
     Cloudflare Tunnel(出站长连,服务器零入站端口)
                    │
                    ▼
  服务器: cloudflared(systemd) ──http://localhost:8080──▶ Traefik 容器
                    │ HostRegexp(^(.+\.)?vincejiang\.com$)
                    ▼
     svc-vincejiang 容器(nginx:alpine,发布编译产物,听 :80)
```
- HTTPS 由 CF 边缘提供,容器内只有明文 :80;源站强制 HTTPS 由 Traefik 的 XFP 跳转路由处理。
- **镜像**:`ghcr.io/vincentjiang06/vincejiang-demo`;部署的 tag 是**触发该次构建的 git sha**(见 §6)。

---

## 6. CI/CD 细节

文件:`.github/workflows/deploy.yml`,push `main` 触发三个 job 串起来:

| job | 跑在哪 | 干什么 |
|-----|--------|--------|
| `check` | GitHub 托管 | 生成 manifest → `build-site.mjs --check`(frontmatter/slug/内容目录 index.html 硬 gate)+ html-validate(warn-only) |
| `image` | GitHub 托管 | 生成 manifest → 多阶段 `docker build` → 推 `ghcr.io/...:{latest, <sha>}` |
| `deploy` | **服务器 self-hosted runner** | `cd /home/vince/platform && ./deploy-pinned.sh svc-vincejiang <sha>` |

**deploy-pinned.sh(在 platform 仓库)** 做的事:把 `<sha>` 写进 `platform/.env` 的 `VINCEJIANG_TAG` → `docker compose pull/up -d` → **健康门**(容器 healthcheck 变 healthy + 经 Traefik 真路由验 `/health`=ok 且 `/`=200)→ **任一步失败自动回滚上一个 tag 并让 job 变红**。
- compose 里 `image: ghcr.io/...:${VINCEJIANG_TAG:-latest}`;所以部署镜像与触发 commit 强绑定,可精确回滚。
- 顶层最小权限 `contents: read`;`image` job 单独 `packages: write`。
- `deploy` 单独串行 concurrency(`cancel-in-progress: false`),滚动更新中途不被后一次 push 取消。
- 只有本仓库用 self-hosted runner 自动部署;其余 6 站仍手动 `redeploy.sh`。

---

## 7. 回滚

在服务器上:
```bash
cd /home/vince/platform
./deploy-pinned.sh svc-vincejiang <旧-git-sha>     # 部署任意历史 sha;过不了健康门会自动再退回
grep VINCEJIANG_TAG .env                            # 看当前部署的是哪个 sha
```
GHCR 保留每个 sha 的镜像,`<旧-git-sha>` 用要回退到的那次 commit 的完整 sha。

---

## 8. 手动 SEO/GEO 审计(不阻塞日常构建)

- 线上触发:仓库 **Actions → seo-geo-audit → Run workflow**(`.github/workflows/audit.yml`);报告进 job summary + artifact。**只审计不部署**。
- 本地等价:`cd tools && node audit.mjs`(或 `--out report.md`)。
- 审计内容:逐页对照 MUST(title/desc/canonical/OG/twitter/lang/viewport/单 h1)+ 断链 + img alt + JSON-LD 可解析 + sitemap 双向覆盖。report-only。

---

## 9. 排障

| 症状 | 多半是 | 怎么查 / 修 |
|------|--------|-------------|
| push 了但网站没变 | check/image job 失败,或 runner 没在线 | 仓库 Actions 页看红在哪一 job;服务器 `pgrep -f Runner.Listener` 看 runner |
| `deploy` job 红、线上仍是旧版 | 健康门没过,已自动回滚(符合预期) | 看 Actions 里 deploy-pinned 的输出;多半是新构建内容坏了 |
| 文章 push 了不显示 | commit 没写「发布」,或 `draft: true` | 补一次带「发布」的 commit 碰该文件;去掉 draft |
| `pull access denied` | GHCR 包非 public | 把 `vincejiang-demo` 包设 public |
| 返回 404(Traefik 纯文本) | 容器没起来 / 路由不匹配 | `docker ps` 看 svc-vincejiang;compose HostRegexp |
| 改内容浏览器还是旧的 | 缓存 | HTML 是 no-cache,一般刷新即可;静态资源缓存一周,改 `?v=N` |

**手动兜底部署**(runner 挂了时):`cd /home/vince/platform && ./deploy-pinned.sh svc-vincejiang latest`

---

## 10. self-hosted runner

在服务器 `~/actions-runner`,labels `self-hosted,vincejiang`,注册到本仓库(注册见该目录 `config.sh`)。

**常驻方式(现状)**:cron 看门狗 `~/actions-runner/keepalive.sh` —— `@reboot` + 每分钟一次,runner 进程不在就(重新)拉起,flock 防并发双启。开机自启 + 崩溃自恢复,不需要 root。
> 若日后想换成「官方 systemd 系统服务」(需 root):`sudo ./svc.sh install vince && sudo ./svc.sh start`,装好后**要删掉 crontab 里的 keepalive 两行**,否则会和 systemd 抢着起 runner(双 runner)。

---

## 11. `/status-ai` —— 特殊:依赖服务器侧后端 + 开放接口

`/status-ai/`(本仓库 `status-ai/index.html`)是纯静态前端,数据来自一个**不在本仓库**的后端 `svc-status`(在服务器 `UniWild/platform`),因为翻译要用 DeepSeek API、密钥绝不能进前端/public 仓库。

- **前端**:`fetch('/status-ai/api')` 渲染;换图标/静态文件要 bump `?v=N`(边缘缓存一周);改 HTML 即时生效。
- **后端**:`platform/status-svc/server.mjs`(容器 `svc-status`),拉 OpenAI/Anthropic 官方 Statuspage + DeepSeek 写中文解说,按内容 hash 缓存。改后端:服务器 `cd platform && docker compose up -d --build svc-status`。
- **路由**:Traefik 把 `vincejiang.com/status-ai/api` 高优先级指到该容器(**必须精确到 `/api`**,否则会劫持静态页)。
- **红线**:`/status-ai/api` 路径动不得;`DEEPSEEK_API_KEY` 只在 `platform/.env`,不进任何仓库/前端。
- **开放接口**:`GET https://vincejiang.com/status-ai/api` —— 只读、开放 CORS、`schema: vincejiang.status/1`。

> 想加别的「需密钥/需服务器侧抓取」的页面,照此模式:前端放本仓库,后端放 platform 用 `/xxx/api` 路由,密钥进 `platform/.env`。

---

## 12. SEO/GEO 基建(长在模板/生成器里,零维护)

生成器保证每页 MUST:`<title> · Vince Jiang`、自指 canonical、meta description、OG 四件套 + twitter card、`<html lang>`、viewport、单 h1。JSON-LD 单一来源在 build-site.mjs(禁手写内嵌):首页 `WebSite`+`Person`;文章 `BlogPosting`(真实 git 日期)+`BreadcrumbList`;gallery `CollectionPage`+`ItemList`。
机读层(GEO):每篇文章的 md 源副本 `/blog/<slug>/index.md`、`llms.txt`、RSS、sitemap(lastmod 用真实 git 日期,禁虚刷)。

---

## 13. 本地预览

```bash
cd tools && npm ci
node build-site.mjs --out ../site      # 编译到 ../site(无 manifest 时:所有非 draft 视为已发布)
python3 -m http.server -d ../site 8000 # 访问 http://localhost:8000

# 或完整跑容器(连 nginx 配置一起验):
docker build -t svc-vincejiang . && docker run --rm -p 8080:80 svc-vincejiang
curl -s localhost:8080/health          # → ok
```
