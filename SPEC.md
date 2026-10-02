# vincejiang.com — 部署与维护规范(SPEC)

> 这份文档是「权威说明」。任何人(或 agent)想发文章、加 demo、或排障,**先读这一份**。
> 改了部署逻辑(Dockerfile / workflow / nginx 配置 / 生成器),**必须同步更新本文件**。

---

## 1. 这是什么

`vincejiang.com` 是 Vince(小蒋)的个人站,三块内容:
- **Blog**(`/blog/`):md 写就的博客杂谈与技术笔记;
- **Gallery**(`/gallery/`):交互式 demo / 实验的作品集索引(status-ai、HiFi 笔记、Pretext 字符游戏等);
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
3. `git commit`,**commit message 以「发布」开头**(如 `发布：我的新文`),`git push`。

约 1~2 分钟后 `https://vincejiang.com/blog/my-post/` 就上线,首页最新列表 / Blog 索引 / RSS / sitemap 全自动更新。

**发布判定(关键)**:一篇 md「已发布」⟺ git 历史里存在任一触碰过它的 commit,其 message 命中**发布标记**:
- **某行以「发布」开头**,后接空格/冒号/行尾 —— 如 `发布：标题`、`发布: title`、`发布 xxx`;或
- **方括号标记** `[发布]` / `[publish]` / `【发布】`(可在任意位置,如 `feat: xxx [publish]`)。
- ⚠️ **仅在句中提到「发布」二字不算**(如「修复发布流程」「还没发布」「无发布词」)——必须是行首发布标记或方括号标记,避免把草稿误发。
- commit 没命中标记 → 文件在仓库里但**不上线**(草稿);之后任一命中标记、且触碰该文件的 commit 即让它上线;
- frontmatter 写 `draft: true` → 强制隐藏(优先级最高,压过发布标记);
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

### 2.1 论文格式(`layout: paper`)
frontmatter 写 `layout: paper` → 用论文模板渲染:A4 排版、左侧大纲、连续分页、三线表、题注编号、打印即规范 A4 稿。**完整写法见 `templates/PAPER-SPEC.md`**(权威)。渲染器 `tools/paper.mjs` + 零依赖图表/结构图/脑图引擎 `tools/paper-charts.mjs`,骨架/样式/脚本 `templates/paper.{html,css,js}`。

### 2.2 分组(子目录即 URL 前缀)
`posts/<group>/<slug>.md` → `/blog/<group>/<slug>/`;根目录 `posts/<slug>.md` 仍是 `/blog/<slug>/`(不变)。例:`posts/pension-demo/paper-1.md` → `/blog/pension-demo/paper-1/`。

### 2.3 双语(中英,双 URL + 顶部切换)
中文主文件 `<slug>.md` + 英文译文 `<slug>.en.md`(同目录兄弟,`lang: en`,只需 title/description/正文)。生成中文主页 + `/en/` 英文子页;**首页 / Blog 索引 / RSS 只收中文主页,英文页不重复出现**;两页互挂 hreflang(x-default→中)、顶部「中/EN」切换。论文的双语元数据(`title_en/abstract_en/keywords_en`)统一放中文 `paper:` 里(单一数据源)。

### 2.4 Research collections
`site.config.json` 的 `collections` 加一条正文 collection(`key`=子目录名,`order`=slug 顺序,`layout:paper` 用论文格式)→ 自动生成落地页 `/blog/<key>/`(编号清单)+ 每篇「上/下篇」串联导航。

若有 revision / 评述 / 复盘,再加一条 revision collection,并用 `revisionOf` 指回正文 collection;正文 collection 可用 `revisedBy` 指向 revision collection。`/research/` 会按「正文 + Revision」自动成对展示,header 的 Research 入口只指向 `/research/`,不 hardcode 到某个具体 collection。Blog 索引只列散篇,不列 Research collections。

---

## 3. 怎么加一个 demo(老工作流,不变)

1. 在**仓库根目录**建一个文件夹,如 `my-demo/`,里面至少放一个 `index.html`(可带 js/css/图片,全静态);
2. 生成器会**原样收录**根目录下的内容文件夹(除基础设施/元文件外);
3. `git commit && git push`。约 1~2 分钟后 `https://vincejiang.com/my-demo/` 可访问。
4. 想让它出现在 Gallery / 首页,往 `site.config.json` 的 `gallery` 数组加一条 —— 至少 `key`(截图文件名,一般=文件夹名)、`title`、`href`、`date`(上线日=该目录 git 首次提交,禁虚刷)、`desc`;然后跑一遍截图管线(见 §3.2)生成卡片截图与主色相。

干净 URL:`/my-demo` 自动找 `/my-demo/index.html`;`/foo` 找 `/foo.html`。

**嵌套在 Gallery 下的 demo**:也可以把 demo 放在 `gallery/<name>/` 里,地址即 `/gallery/<name>/`(如 `gallery/paletter/` → `/gallery/paletter/`)。`gallery/` 自身在构建时被视作资源目录原样拷贝,生成器随后再写入 Gallery 索引页 `gallery/index.html`,两者共存不冲突(见 build-site.mjs 的 `ASSET_DIRS`)。

### 3.1 demo 的源料怎么存(以 reactor-study 为例)

根目录下的内容文件夹是**产物**。如果某个 demo 是由生成器编译出来的,源料要单独存,并且**必须加进 `tools/build-site.mjs` 的 `COPY_EXCLUDE`** —— 否则 `--check` 会因为「内容目录缺 index.html」直接失败。

`reactor-study/`(产物,现挂在子域 `reactor.vincejiang.com`) ← 原则上由 `reactor-study-src/site`(零框架静态生成器)编译。

> ### ⚠️ 当前产物领先于源码,别直接重建
>
> 迁子域(`fbbc43d`)与 v2 视觉重做(`691675b`)这两轮改动是**直接改在 `reactor-study/` 产物上**的,没有回流到 `reactor-study-src/site`。差异实测:`index.html` 133 行、`modules/tree.js` 257 行、`theme/led.css` 100 行、`theme/tokens.css` 24 行不同,且产物里的 `modules/tree-data.js`(606 行)在源码里**根本不存在**。
>
> 也就是说,**现在跑一遍生成器再覆盖过去,会把 v2 打回 v1**。要么先把 v2 的改动反向合进 `reactor-study-src/site` 再重建,要么继续手改产物 —— 但别在没合并前用下面的命令。
>
> 另注:产物现在用的是扁平的 `?v=r2` 而非生成器打的内容哈希;两者语义不同(内容哈希是改了才变,`r2` 是人工版本号)。

源码回流对齐后,子域下的正确构建方式(BASE 留空 = 站根,不是子路径):

```bash
cd reactor-study-src/site
SITE=https://reactor.vincejiang.com node build.mjs
rsync -a --delete dist/ ../../reactor-study/
```

`BASE` 只在挂子路径时才需要(会给内部链接加前缀并写入 `<html data-base>` 供前端运行时拼 URL);`SITE` 定 canonical/sitemap;构建末尾给 `theme/*.css` 与 `modules/*.js` 的引用打 `?v=<内容哈希>`。nginx 侧的子域 server 块与主站 `/reactor-study/` → 子域的 301 见 `docker/site.conf`。

`reactor-study-src/` 里还有 `research/`(14 份专题报告 + 7 份深化报告 + 64 份原始搜索转储)、`experiments/`(5 个可复现实验)、`course/`(课程策划与文风契约)。**不含论文 PDF 与全文转录**——受版权保护,取回信息见 `reactor-study-src/papers/SOURCES.md`。

### 3.2 色条卡与主色相(2026-08 版式)

首页/Gallery/Blog/Research 的列表统一为**两列色条卡**(`.proj`):顶部一条色相条(6px;主打卡 10px+站色染层)+
标题圆点/hover 描边同色;简介裁 3 行保证卡片尺寸相近。**卡上不展示截图**(截取不全、字形等呈现问题一刀切),
但色相仍来自各站首屏截图的主色提取:

- **gallery 项**:`./tools/shots.sh <key>` 截图(存本地 `assets/shots/`,**已 gitignore 不入库不上站**)并把提取的
  `hue` 写回 `site.config.json`;`hueManual` 人工覆盖优先;近单色站 `hue:null` = 中性灰卡。渲染层另有色相防撞
  (spreadHues 保序聚簇,相邻 ≥18°)。截图容器的中文字体/预操作等细节见 shots.sh/shots.mjs 头注释。
- **blog 散篇**:slug 确定性哈希 → hue(稳定标识色,无需配置)。
- **research/collection**:固定语义色 —— 论文 245 靛 / Revision 32 琥珀。
- **友链 wildSites**:手选反官色 hue(shots 只记录提取值绝不覆盖),纸皮石纹理卡,三列。

**列表工具栏**:/gallery/ 与 /blog/ 共用 `listTools()` + `LIST_TOOLS_SCRIPT`(约定 `#tool-grid` 直接子元素含
`.t` 与 `<time datetime>`;`data-unit` 计数单位;筛选 chips 仅 gallery 有)。全站圆角已统一缩小(--radius 8px,
局部 4~10px),偏长方形调性。

### 3.3 背景 = 纯色(2026-08-04 终版裁决)

生成器页面的背景就是 body 的 `--page`:**亮=纯白 `#ffffff`,暗=纯黑 `#000000`**。没有背景层、没有背景
SVG、没有背景脚本 —— 层次全靠卡片的毛玻璃与色条承担。

背景裁决链(全部试过并被否):纯色 → 静态海浪 → 粒子堆砌(「太少没意思」)→ 流场丝线(「乱/拖尾」)→
星尘流星(「更奇怪了」)→ 等高线(「太丑」)→ 点状晕团渐变 → 人工 S 弯色带 → 等高线路径色带 →
**回到纯色(现行)**。相关资源与生成器(`gen-waves.mjs`/`gen-topo.mjs`/`gen-bg.mjs`、`bg-*.svg`)均已删除。
**别再给这个站提背景图形/动画方案**;真要改先问,行为测试里有「无背景层/无背景资源」的硬断言挡着。

另:全站交互规范 —— **hover 一律不位移、不改字色**(2026-08-04 用户两次裁决;紫色 --link 是旧链接色,
不作主题强调用),指示 = 色相描边光环 + 色条提亮;标签 chip 统一 flat 化(.tag inline-flex),**chip 内禁用
emoji**(排版不稳,星形用 CSS ::before 画)。

---

## 4. 目录结构

```
posts/            # 博客 md 源:posts/<slug>.md、posts/<slug>/index.md+图,或 posts/<group>/<slug>.md 分组;<slug>.en.md 为英文译版
templates/        # base.html + site.css(博客)+ paper.{html,css,js}(论文模板)+ PAPER-SPEC.md(论文写法规范)
tools/            # 生成器 —— build-site.mjs / paper.mjs / paper-charts.mjs / gen-manifest.mjs / audit.mjs
assets/           # 纯静态资源(mosaic.svg 纸皮石瓦纹、og.png、beacon.js),原样收录;shots/ 是本地取色产物(gitignore,构建时剔除)
release/          # 论文源内容暂存(不对外发布)
reactor-study-src/# /reactor-study/ 那个 demo 的源料:研究报告、实验脚本、课程策划、站点生成器源码。
                  # 只存仓库供后续开发,不对外发布(产物是 reactor-study/)。见 §3.1
site.config.json  # 首页 / gallery / 友链(wildSites) / Research collections 的单一数据源
<demo>/           # 各 demo 文件夹(status-ai / vince-hifi-notes …),原样收录
docker/           # nginx 配置(site.conf + snippets/security-headers.conf)
Dockerfile        # 多阶段:node 编译 → nginx 发布
.github/workflows/# deploy.yml(check→image→deploy)+ audit.yml(手动审计)
```
**生成物**(不入库,构建时产出):`index.html`、`/blog/**`、`/research/`、`/gallery/`、`sitemap.xml`、`llms.txt`、`posts-manifest.json`。

**不对外发布**(生成器的 COPY_EXCLUDE + .dockerignore 挡掉):`docker/ tools/ templates/ posts/ release/ reactor-study-src/ site.config.json .github/ .git SPEC.md README.md node_modules posts-manifest.json`。`assets/` 属例外:原样收录(供 `/assets/mosaic.svg` 等),但不要求 index.html。

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

生成器保证每页 MUST:`<title> · Vince Jiang`、自指 canonical、meta description、OG 四件套 + twitter card、`<html lang>`、viewport、单 h1。JSON-LD 单一来源在 build-site.mjs / paper.mjs(禁手写内嵌):首页 `WebSite`+`Person`;博客文章 `BlogPosting`+`BreadcrumbList`;论文 `ScholarlyArticle`(摘要/关键词/`about`/`genre`/`isPartOf` Research collection + `workTranslation`↔`translationOfWork` 中英互链)+`BreadcrumbList`;Research 索引 `CollectionPage`;Research collection 落地页 `CollectionPage`+`CreativeWorkSeries`(`hasPart` 含各篇摘要)。日期一律真实 git 日期。
机读层(GEO):每篇文章的 md 源副本 `/blog/<…>/index.md`(英文 `en/index.md`);`llms.txt`(Research collections 逐篇列出 + 每篇机读 md 链接,置顶于 blog 之上);RSS;sitemap(Research 与各 collection 优先级更高,lastmod 真实 git 日期);`robots.txt` 显式放行 GPTBot / OAI-SearchBot / ChatGPT-User / ClaudeBot / Claude-SearchBot / PerplexityBot / Google-Extended。

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

## 14. Dots — Mandy 的云朵书桌（2026-10-01）

- 独立公开子域 `https://dots.vincejiang.com`；静态源 `dots/` 随当前网站镜像发布，nginx 专用 server root。已有 wildcard Tunnel/Traefik 已可到达，无需新 DNS/隧道/凭证。
- 旧浏览器若把上线前根路径的 301 缓存为跳主站，可打开 `https://dots.vincejiang.com/refresh`：此专用入口发送 `Clear-Site-Data: "cache"` 与 no-store，再 302 到已确认可访问的 `/index.html`。只请求清当前 HTTPS origin 的缓存，不清 Cookie/DOM storage；不支持该头的浏览器仍可使用 `/index.html` 或带版本参数的入口。不得用全站 Cookie 清理或改无关 Cloudflare 规则解决。
- 角色：钴蓝云朵、黑色画师帽、大竖胶囊眼与白色高光，云内少量笔触和星点；首页以多条新闻正文摘要和歌单侧栏为主，无大 Hero；不依赖远程头像或过期签名 URL。Dots 不注入本站 analytics beacon。
- 内容真源 `dots/content/index.json`，`dots.content/1`，香港日期。每日 HN 十篇、每周歌单、归档搜索。正文以纯文本段落渲染；公开字段白名单由 `tools/dots-validate.mjs` 校验。内容只能包含审校后的公开材料。
- 发布时间由调用方现有任务管理：每日香港 10:00、周日香港 19:00 左右。本仓库没有新增内容调度，也不能自行读取 ChatGPT 聊天。
- `node tools/dots-publish.mjs /path/to/edition.json` 导入已审校单期；修订保留期次和条目 ID。`node tools/dots-validate.mjs` 校验；仅提交 `dots/content/index.json`，推 `main` 即运行现有 CI。
- 反馈服务 `tools/dots-service/` 构建同一 GHCR package 的 `feedback-<sha>` 镜像。`platform` 新增 `svc-dots-feedback` 和 `dots-feedback` 持久卷；仅 `Host(dots.vincejiang.com) && PathPrefix(/api/)`，优先级 1100，无宿主机公开端口。不改 status/cus 等服务。
- CI 先通过原有 `deploy-pinned.sh` 发布静态站，再用 `./deploy-pinned.sh svc-dots-feedback feedback-<sha> dots.vincejiang.com` 发布反馈服务，服务各自可回滚。静态服务成功而反馈失败时 CI 失败，页面可读但需修复/回滚反馈服务后再验收。
- `POST /api/feedback` 只收 `{id,reaction:up|down|heart,value:boolean}`，同源 Origin 检查、有限 ID 白名单、1KiB 上限、短时 IP 限流（仅进程内哈希）与 Traefik 限流。SQLite 事务提交之后才确认成功；同匿名浏览器同条目 up/down 互斥、heart 独立。Cookie 仅用于去重，不能声称识别真实身份或完全防刷。
- `GET /api/feedback` 返回当前匿名浏览器选择和公共计数；`GET /api/feedback/summary` 仅返回匿名公共汇总，`dots.feedback/1`；均 no-store。前端约每 30 秒刷新公共计数，自己写入成功即时更新。
- Mac 执行 `python3 tools/dots-sync-feedback.py`：读取公开汇总，用 Mac 已有 gh 身份将白名单投影提交至同仓库 **dots-feedback 分支 / feedback/latest.json**。不向服务器复制私钥或 token。分支不匹配部署 workflow 的 main 触发条件。无变化不提交，普通 fast-forward push 防覆盖；竞态失败重跑即可。
- 快照 `dots.feedback.snapshot/1`：`window=lifetime-current-state`，是可撤回的累计当前状态，**不可把多份快照相加**；稳定 item_id 关联内容，version=内容 SHA256，exportedAt 表示抓取时刻，lastChangedAtUnix 表示条目最近变更。仅公开 up/down/heart 汇总，不公开 IP、Cookie 或原始逐访客记录；样例票不导出。
- 双向任务顺序：先 `dots-sync-feedback.py` → 读取远端 `dots-feedback:feedback/latest.json` → 生成新一期 → 人工/任务审校公开边界 → publish + validate + commit + push main → 等该 SHA 的 CI 成功。不存在任意网页点击唤醒助手的接口；反馈在下一期读取时影响选题，不等于实时通知，更不是用户本人的偏好。
- 单次读 GitHub：`gh api repos/VincentJiang06/vincejiang-demo/contents/feedback/latest.json?ref=dots-feedback --jq .content` 后 base64 解码（返回的是公开数据，不是凭证）。同步脚本只在调用时运行；未新建 cron/第三套定时任务。
- SQLite 数据持久卷不能删除。人工备份应使用 SQLite backup API 生成一致快照，而不是只复制 WAL 模式主文件。后台备份策略接入另行确认；当前容器重建可保留反馈，不能宣称已具备异地灾备。

### 14.1 精读与唱片架 UI 契约

- HN 首页用 `preview`（可选；默认正文首段）作短预览，展开完整剩余段落；独立期次保留全部正文。首次十篇各四节，保持原 ID 与排序。
- 音乐 `artwork` 可选，只接受 `https://is1-ssl.mzstatic.com/image/thumb/.../320x320bb.jpg` 固定图片地址，无查询参数。需人工核验曲目/专辑匹配；字段白名单不等于内容真实性核验。图片失败显示艺人文字封套，链接和介绍仍可用。
- 唱片架使用 CSS 透视、封套侧边、唱片和层板阴影；原生 details/summary 支持触屏与键盘。减少动态效果设置关闭倾斜和动画。必要阅读局限留在期次正文/说明，重复功能介绍移到关于页。
- `dots/feedback.css` 为独立 SVG 反馈组件，`feedback-state.mjs` 管理乐观更新、同条目 pending、失败回滚、排除写入前已开始的旧读取；后台回执才提示保存完成。公开 API 契约不变。请求超时提示未确认，后续读服务器状态收敛。
- `node --test tools/dots-client.test.mjs` 测状态行为与封面边界，CI 与 SQLite 行为测试一起执行；nginx 明确为两个 `.mjs` 模块发送 JavaScript MIME。

- 构建在新拷贝的 Dots 产物中为 JS/CSS/SVG 及两个模块 import 加同一 SHA256 内容版本参数；资源内容变化即换 URL，不依赖访问者清理旧版缓存。源码不写死版本。HTML 和资源继续发送 no-cache 以复核；新页面引用版本 URL，避开此前已永久缓存的无版本资产。

## 15. Study 课程笔记

入口 `/study/2026T1/` → 五个课号 → 对应笔记 `.html`，保留中文文件名和 `exercise/` 子目录。`/study/` 提供学期入口。254 份发布 Markdown 在 `tools/study-content/`，由 `tools/study-build.mjs` 在主构建/检查流程中处理；不会将该源目录复制到网站。CSCI3130、CSCI3150、CSCI3160、CSCI3230、GENA2122 分别为 66、43、74、65、6 份，包含作业答案、解题过程、实验与 Exercise 索引。

### 同步与验证

在独立分支操作，参数为桌面路径；导入器默认读取上述五个固定课号的 `study/`；指定 `--course=CSCI3230` 时仅读取该课并保留其他课程文件及 manifest 条目。导入本身不改源文件，不跟随符号链接。

```bash
node tools/study-import.mjs "$HOME/Desktop"
node tools/study-build.mjs /tmp/vince-study-preview
python3 tools/study-verify.py /tmp/vince-study-preview --desktop "$HOME/Desktop"
cd tools && npm test && npm run check
```

导入后审查 `tools/study-content/` 与 `manifest.json` 的 diff，再提交并正常合并 main。manifest 记录各源文件及发布副本的 SHA-256；验证命令确认原笔记未变。新笔记、敏感内容、图片范围与版本变化需要人工审阅；导入成功不等同于内容审查通过。删除源笔记不会自动删除仓库里的旧副本，但 manifest 不再引用它，页面构建以 manifest 为准。

复用 prompt：

> 将桌面 CSCI3130、CSCI3150、CSCI3160、CSCI3230、GENA2122 的 study 学习笔记同步到 /study/2026T1/。先读取 SPEC §15，使用独立分支执行现有导入与检查，审查新增/变更及敏感内容；包含 study 内作业与实验解析，不读取或上传目录外资料、原课件和内部核验文件。不改本地源笔记。验证全文、公式、内部链接及手机实页，协调 main 提交顺序后沿现有 CI 发布，并报告该 SHA 的部署与线上验证结果。

### 发布投影与边界

- 四门CSCI的248份正文加GENA2122的6份，共254份。课程记忆索引、核验记录、更新记录和根README不作网页正文；根README的入口由课程首页替代，`exercise/README.md`保留。
- 五门均保留人工审阅的阅读导航，导入器不再替换为自动文件清单。内部制作流程从源导航清理；发布投影仍移除技能编写行、内部运行叙述与个人绝对路径，保留学术正文和考试证据。
- 所有 PDF/PPT、核验文本/JSON/截图、配置、缓存不导入。图片引用标为“本地素材，未公开”，不读取/复制目录外作业图片。原课件链接变为不可点击的“本地课件”文字，保留原链接文字与页码。
- 导入保留三处历史TeX排版兼容修正（CSCI3160 Ex02两个集合左花括号、CSCI3230 L05-P4的 `\rvertd`）；相应源稿修正后该兼容替换不再产生差异，不改变运算含义。
- 原始 HTML 默认转义，只允许空的 `a id/name` 锚点。构建期 KaTeX 严格渲染，不加载远程公式脚本/字体。每篇标题 ID 稳定去重；显式 ID 保持大小写；内部 `.md#fragment` 转换后验证目标文档及锚点。目录外资料只标本地，目录内遗漏 Markdown 或坏锚点阻断构建。
- 文章使用桌面三列/手机折叠导航；行内/块级公式、表格、代码各自横滚；CSS/JS 链接带内容哈希以刷新旧缓存。课程筛选在浏览器本地进行，正文无需 JavaScript。

`tools/study-verify.py` 检查整个生成子树的链接、锚点、重复 ID 和资产扩展名。五门课程深化版共254篇正文、261个HTML、3,575个正文标题、3,922个正文锚点、6,276处公式；22,981个本地链接/资源引用全部通过。此前四门课程的3,645个公开锚点全部保留，其中CSCI3230为914个。源内容校对与学术正确性需结合来源及推导审阅，渲染验证不替代数学证明。


### HW01 分级提示

- CSCI3230 `HW01-2026T1-分级提示.md`：当前 2026T1 原题 p.1–4，13 个小问，每问三级；最终数值与完整解法只在既有详细解析中。原题已经印出的证明目标放独立默认关闭的说明中。
- CSCI3150 `HW01-Shell分级提示-2026T1.md`：当前 HW01 原题 p.1 与教师 ZIP 接口，8 个实现单元，每单元三级；自测场景不包含提交代码或隐藏测试答案，也不声称已执行这些作业测试。
- 初次提示版交付仅新增对应 Desktop study 源文件。后续CSCI3230慢讲重写更新该课的提示与详细解析；正式作答、原始课件保持不改。课程首页由manifest收录，CSCI3230阅读导航为人工审阅正文。
- Markdown 使用独占行 `:::hint 标题` 开启、`:::endhint` 关闭；支持嵌套，标题作纯文本转义，不开放任意 HTML。未配对指令使构建失败。每一级使用原生 `details/summary`，无需 JS，默认没有 open 属性；二级在一级内，三级在二级内。
- 文件名含“分级提示”时进入提示模式：不显示其他笔记侧栏或通用上一篇/下一篇；返回课程目录明确标注离开提示模式。完整解析入口放在另一个确认折叠内，展开后还需点确认链接。折叠用于防误读，不是访问控制；查看网页源码仍可看到提示。
- 真实 Chromium 验证：3230 的 46 个折叠、3150 的 28 个折叠初始全部关闭；Enter 可展开外层，后一级保持关闭；375px 手机视口页面有效宽度与 scrollWidth 均为375px，公式和表格局部滚动。


### CSCI3230 慢讲笔记

CSCI3230现有64篇学术笔记全部按初次学习重写，另有阅读导航；文件名URL保持不变。涵盖50篇L01–L10、9篇辅导与代码实践、3篇ESTR独立材料和2篇当前HW01。按具体问题、前置直觉、完整小例、符号维度、逐步推导、参数影响及自检展开。L01–L05标2026T1；L06–L10及历史辅导保留旧年预习身份；ESTR拓展不冒充CSCI必修前置；未运行的代码不写成复现实验。历史题与讲义核心主题保留，改名小节以对应位置的显式锚点兼容旧链接。

只同步这一课时：

```bash
node tools/study-import.mjs "$HOME/Desktop" --course=CSCI3230
node tools/study-build.mjs /tmp/vince-study-preview
python3 tools/study-verify.py /tmp/vince-study-preview --desktop "$HOME/Desktop"
npm test --prefix tools
node tools/build-site.mjs --check
```

复用prompt：

> 仅把桌面CSCI3230/study现有学习笔记同步到vincejiang.com/study/2026T1/CSCI3230/。读取SPEC §15，使用独立分支和--course=CSCI3230，不改本地源笔记及其他课程。保留现有原创阅读导航、提示模式、年份/ESTR范围和旧标题锚点；审查新增正文与敏感内容，不上传原课件、作答、核验、配置或缓存。跑严格公式和全站链接验证，实际检查桌面与手机页面，协调main顺序后正常快进推送并核对该SHA的CI与公开页面。若要求再次重写源笔记，先单独备份并列出明确改动范围。


### 五门课程逐篇深化

254篇保留原讲次、题例、资料年份和可用链接，在相关段落内补充推理与自检：3130侧重构造不变量、语言双向包含、泵引理量词；3150侧重进程/文件状态、并发交错、分页与I/O条件；3160侧重算法归纳、交换证明、复杂度模型和逐步演算；3230继续补充线性代数、优化条件、参数影响与数值反例；GENA2122区分事实材料、解释、比较与因果边界。

GENA2122名称依据现有课程材料的 Issues in American Culture & History，正文保留明确日期的安排冲突，不擅自合并成一个“最新”日期。补充例子与原课件材料区分标明；来源复核按实际覆盖范围记录，不把历史实验写成此次运行，也不把有限枚举当作一般证明。

本地页面验收覆盖五门课程、7篇代表笔记的桌面及375px手机视口（14次），包含搜索、锚点定位、公式排版和键盘折叠。后续同步前先比较源稿与已发布稿的差异，避免用旧本地副本覆盖已深化的网页版本。
