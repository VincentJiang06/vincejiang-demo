#!/usr/bin/env bash
# shots.sh —— 在 playwright 容器里跑 shots.mjs(截图 + 提色)。playwright-core 装在仓库外缓存目录,
# 不进 tools/package.json(CI 的 npm ci 不需要它)。版本必须与镜像 tag 一致才能找到浏览器。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PW_VERSION=1.61.1
PW_DIR="${PW_DIR:-$HOME/.cache/vj-shots-pw-$PW_VERSION}"
if [ ! -d "$PW_DIR/node_modules/playwright-core" ]; then
  mkdir -p "$PW_DIR"
  (cd "$PW_DIR" && npm init -y >/dev/null 2>&1 && npm i --no-audit --no-fund "playwright-core@$PW_VERSION")
fi
docker run --rm --network host \
  -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -e NODE_PATH=/pw/node_modules \
  -e ORIGIN="${ORIGIN:-https://vincejiang.com}" \
  -v "$ROOT":/repo -v "$PW_DIR/node_modules":/pw/node_modules \
  -w /repo \
  "mcr.microsoft.com/playwright:v$PW_VERSION-jammy" \
  node tools/shots.mjs "$@"
