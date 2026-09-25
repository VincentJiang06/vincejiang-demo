#!/usr/bin/env bash
# verify-live.sh —— 从公网确认线上跑的是指定 commit(deploy.yml 的 verify job 与 live-drift.yml 共用)。
#   bash tools/verify-live.sh <期望的 40 位 sha> [站点根 URL] [最多尝试次数]
#
# 读 <站点>/version.json(镜像构建时由 Dockerfile 写入 {"sha":"<git sha>"},nginx 侧 no-store),
# 带随机 query 绕开 Cloudflare 边缘缓存。每 10s 重试一次,等边缘/隧道收敛。
# 退出码:0 = 一致;1 = 不一致或站点不可达;
#        Cloudflare 对 CI 出口 IP 弹质询(cf-mitigated: challenge)时无法判断 → 只报 warning、退出 0,不制造假红。
set -euo pipefail

want="${1:?usage: verify-live.sh <sha> [url] [attempts]}"
site="${2:-https://vincejiang.com}"
tries="${3:-12}"
hdr="$(mktemp)"; body="$(mktemp)"
trap 'rm -f "$hdr" "$body"' EXIT

got=""
for i in $(seq 1 "$tries"); do
  code="$(curl -sS -m 15 -o "$body" -D "$hdr" -w '%{http_code}' \
            -H 'Cache-Control: no-cache' \
            "$site/version.json?probe=${GITHUB_RUN_ID:-local}-$i-$RANDOM" || true)"
  if grep -qi '^cf-mitigated: *challenge' "$hdr"; then
    echo "::warning::Cloudflare 对本 runner 弹了质询,无法从公网核对版本(不判失败)"
    exit 0
  fi
  got="$(grep -oE '"sha" *: *"[0-9a-f]{7,40}"' "$body" | grep -oE '[0-9a-f]{7,40}' || true)"
  if [[ "$code" == 200 && "$got" == "$want" ]]; then
    home="$(curl -sS -m 15 -o /dev/null -w '%{http_code}' "$site/?probe=${GITHUB_RUN_ID:-local}-$RANDOM" || true)"
    if [[ "$home" == 200 ]]; then
      echo "✓ $site 已是 ${want:0:7}(第 $i 次探测),首页 200"
      exit 0
    fi
    echo "  version 已对上,但首页返回 $home,重试…"
  else
    echo "  第 $i/$tries 次:HTTP $code,线上 sha=${got:-<无>},期望 ${want:0:7}"
  fi
  [[ "$i" -lt "$tries" ]] && sleep 10
done

echo "::error::$site 线上版本 ${got:-<无>} ≠ 期望 $want(或首页不可达)"
exit 1
