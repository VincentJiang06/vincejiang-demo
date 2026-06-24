# vincejiang.com — 部署与维护规范(SPEC)

> 这份文档是「权威说明」。任何人(或 agent)想更新网站、加 demo、或排障,**先读这一份**。
> 改了部署逻辑(Dockerfile / workflow / nginx 配置),**必须同步更新本文件**。

---

## 1. 这是什么

`vincejiang.com` 是一个**纯静态的 demo 展示站**,用来放各种产品 demo / 实验。
- 仓库:`github.com/VincentJiang06/vincejiang-demo`(public)
- 线上地址:`https://vincejiang.com` 和 `https://www.vincejiang.com`
- 没有后端、没有数据库、没有 Node 构建步骤——**仓库里放什么静态文件,网站上就有什么**。

托管在一台自有服务器(Vultr 东京)上,经 **Cloudflare Tunnel** 对外。和该机上其他 6 个站
(UniWild 集群)共用同一套基础设施:`cloudflared 隧道 → Traefik 反代 → 每站一个 Docker 容器`。

---

## 2. 怎么更新网站(TL;DR)

**只需要一件事:把改动 push 到 `main` 分支。** 其余全自动:

```
git push  →  GitHub Actions 构建 Docker 镜像  →  推到 GHCR
          →  服务器上的 self-hosted runner 自动拉新镜像 + 滚动重启容器
          →  约 1–2 分钟后 vincejiang.com 就是最新版
```

不需要 SSH 上服务器、不需要手动跑任何命令。push 完去仓库的 **Actions** 标签页能看到
`build-and-deploy` 在跑;两个 job(`image` → `deploy`)都变绿就上线了。

---

## 3. 怎么加一个新 demo

1. 在**仓库根目录**建一个文件夹,比如 `my-demo/`,里面至少放一个 `index.html`
   (想放 `app.js` / `style.css` / 图片 / 视频都行,全是静态资源)。
2. 在根目录 `index.html` 的 Demos 列表里加一行链接,指向 `/my-demo/`。
3. `git add . && git commit -m "add my-demo" && git push`。
4. 完事。约 1–2 分钟后 `https://vincejiang.com/my-demo/` 就能访问。

**约定:**
- 每个 demo = 根目录下一个独立文件夹,自带 `index.html`,用根相对路径(`/my-demo/...`)引用自己的资源。
- 文件夹会被 `Dockerfile` 的 `COPY . /usr/share/nginx/html` 自动收录,**无需改任何配置**。
- 干净 URL 可用:`/my-demo` 会自动找 `/my-demo/index.html`;`/foo` 会找 `/foo.html`。

**不要**把下面这些当成 demo 内容(它们是基础设施,已在 `.dockerignore` 里排除,不会被发布):
`Dockerfile`、`.dockerignore`、`docker/`、`.github/`、`SPEC.md`、`README.md`、`.git/`。

---

## 4. 端到端架构(发生了什么)

```
浏览器  ──HTTPS──▶  Cloudflare 边缘(终止 TLS,签发证书)
                      │  Public Hostname: vincejiang.com / www → 隧道
                      ▼
        Cloudflare Tunnel（出站长连,服务器不开任何入站端口)
                      │
                      ▼
   服务器: cloudflared(systemd 原生服务) ──http://localhost:8080──▶ Traefik 容器
                      │  按 Host 路由:HostRegexp(^(.+\.)?vincejiang\.com$)
                      ▼
        svc-vincejiang 容器(nginx:alpine,发布本仓库静态内容,听 :80)
```

- **HTTPS**:由 Cloudflare 边缘提供,容器内只有明文 :80。
- **零公网端口**:服务器不监听任何对外端口(连 80/443 都不开),全靠 cloudflared 主动外连。
- **镜像**:`ghcr.io/vincentjiang06/vincejiang-demo:latest`(必须全小写)。

---

## 5. CI/CD 细节

文件:`.github/workflows/deploy.yml`,两个 job:

| job | 跑在哪 | 干什么 |
|-----|--------|--------|
| `image` | GitHub 托管 runner(ubuntu-latest) | `docker build` → 推 `ghcr.io/vincentjiang06/vincejiang-demo:{latest,<sha>}` |
| `deploy` | **服务器上的 self-hosted runner**(labels: `self-hosted, vincejiang`) | `cd /home/vince/platform && ./redeploy.sh svc-vincejiang`(= `docker compose pull && up -d`) |

- `image` 用仓库自带的 `GITHUB_TOKEN` 推 GHCR,无需额外 secret。
- `deploy` 在服务器上以用户 `vince` 运行;runner 主动外连 GitHub 取任务,**不需要服务器开入站端口**。
- 只有本仓库(`vincejiang-demo`)用 self-hosted runner 自动部署;UniWild 那 6 个站仍是手动 `redeploy.sh`。

### 服务器侧 svc 定义
在 `UniWild/platform` 仓库的 `docker-compose.yml` 里(服务器路径 `/home/vince/platform/docker-compose.yml`):

```yaml
  svc-vincejiang:
    image: ghcr.io/vincentjiang06/vincejiang-demo:latest
    restart: always
    networks: [web]
    labels:
      - traefik.enable=true
      - traefik.http.routers.vincejiang.rule=HostRegexp(`^(.+\.)?vincejiang\.com$$`)
      - traefik.http.routers.vincejiang.entrypoints=web
      - traefik.http.services.vincejiang.loadbalancer.server.port=80
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```
> `$$` 是 compose 转义,容器实际拿到单个 `$`(正则行尾锚点)。

---

## 6. 一次性搭建清单(已完成,留档备查)

这些只需做一次,正常情况下**不用再碰**:

- [x] **Cloudflare Public Hostname**:Zero Trust → Networks → Tunnels → 该隧道 → Public Hostname,
      加 `vincejiang.com` 和 `www.vincejiang.com` 两条 → Service `HTTP` → URL `localhost:8080`。
- [x] **platform compose**:加上面第 5 节的 `svc-vincejiang` 段。
- [x] **GHCR 包设为 public**:首次构建后,在 `github.com/users/VincentJiang06/packages` 找到
      `vincejiang-demo` → Package settings → Change visibility → Public。
      (这样服务器拉镜像无需登录 GHCR。若保持 private,则服务器需 `docker login ghcr.io` 且账号有 read 权限。)
- [x] **self-hosted runner**:在服务器上注册了一个 GitHub Actions runner(labels `self-hosted,vincejiang`),
      作为 systemd 服务常驻。注册方式见下方第 8 节。

---

## 7. 排障

| 症状 | 多半是 | 怎么查 / 修 |
|------|--------|-------------|
| `https://vincejiang.com` 返回 **530**(CF 1033) | 隧道没有该 hostname 的路由 | Cloudflare 面板补 Public Hostname(第 6 节) |
| 返回 **404 page not found**(Traefik 纯文本) | 隧道通了,但没有匹配的容器/路由 | 服务器 `docker ps` 看 `svc-vincejiang` 是否在跑;compose label 的 HostRegexp 是否对 |
| `deploy` job 失败,`pull access denied` | GHCR 包是 private 或服务器没登录 | 把包设 public(第 6 节),或在服务器 `docker login ghcr.io` |
| push 了但网站没变 | runner 没在线 / job 没触发 | 仓库 Settings → Actions → Runners 看 runner 是否 `Idle`;Actions 页看 workflow 有没有跑 |
| 改了内容但浏览器还是旧的 | 浏览器/CF 缓存 | HTML 是 `no-cache`,一般刷新即可;静态资源缓存一周,改名或强刷 |

**手动兜底**(runner 挂了时,在服务器上):
```bash
cd /home/vince/platform && ./redeploy.sh svc-vincejiang
docker compose logs --tail=30 svc-vincejiang
```

---

## 8. self-hosted runner 注册(参考)

在服务器上(用户 `vince`,目录 `~/actions-runner`):
```bash
# 1. 在 GitHub 取注册 token:仓库 → Settings → Actions → Runners → New self-hosted runner(Linux x64)
#    复制页面给出的 --token <TOKEN>
# 2. 配置(labels 必须含 vincejiang,与 deploy.yml 的 runs-on 对应):
cd ~/actions-runner
./config.sh --url https://github.com/VincentJiang06/vincejiang-demo \
            --token <TOKEN> --labels vincejiang --name vultr-tokyo --unattended
# 3. 装成 systemd 服务常驻:
sudo ./svc.sh install vince && sudo ./svc.sh start
```
> 安全提示:self-hosted runner 会执行本仓库 workflow 里的命令。仓库是私人自有、push 受控,
> 风险可接受;但不要把此仓库设为接受外部 PR 自动跑 workflow。

---

## 9. 本地预览

```bash
# 直接开静态文件
python3 -m http.server 8000        # 然后访问 http://localhost:8000
# 或完整跑容器(连 nginx 配置一起验)
docker build -t svc-vincejiang . && docker run --rm -p 8080:80 svc-vincejiang
curl -s localhost:8080/health      # → ok
```
