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
# 中文字体:镜像只有文泉驿,截出来的中文字形不对。挂载 Noto Sans/Serif SC 变量字体(仓库外缓存,
# 首次自动从 google/fonts 下载),fontconfig 会优先 Noto 系,截图字形即与真实系统一致。
FONT_DIR="${FONT_DIR:-$HOME/.cache/vj-shots-fonts}"
mkdir -p "$FONT_DIR"
# --fail 必须带:否则 404/5xx 的错误页会被写成 .ttf 并因存在性判断永久缓存,字体静默回退文泉驿
[ -f "$FONT_DIR/NotoSansSC.ttf" ]  || curl -sSfL -o "$FONT_DIR/NotoSansSC.ttf"  "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"
[ -f "$FONT_DIR/NotoSerifSC.ttf" ] || curl -sSfL -o "$FONT_DIR/NotoSerifSC.ttf" "https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf"
# fontconfig 偏好:把 PingFang/雅黑/宋体等族名解析到 Noto,否则容器仍会选中文泉驿(字形不对)
if [ ! -f "$FONT_DIR/fonts.conf" ]; then
  cat > "$FONT_DIR/fonts.conf" <<'FCEOF'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <alias binding="strong"><family>PingFang SC</family><prefer><family>Noto Sans SC</family></prefer></alias>
  <alias binding="strong"><family>Microsoft YaHei</family><prefer><family>Noto Sans SC</family></prefer></alias>
  <alias binding="strong"><family>Hiragino Sans GB</family><prefer><family>Noto Sans SC</family></prefer></alias>
  <alias binding="strong"><family>Source Han Sans SC</family><prefer><family>Noto Sans SC</family></prefer></alias>
  <alias binding="strong"><family>Songti SC</family><prefer><family>Noto Serif SC</family></prefer></alias>
  <alias binding="strong"><family>SimSun</family><prefer><family>Noto Serif SC</family></prefer></alias>
  <alias binding="strong"><family>Source Han Serif SC</family><prefer><family>Noto Serif SC</family></prefer></alias>
  <alias binding="strong"><family>system-ui</family><prefer><family>Noto Sans SC</family></prefer></alias>
  <alias binding="strong"><family>sans-serif</family><prefer><family>Noto Sans SC</family></prefer></alias>
  <alias binding="strong"><family>serif</family><prefer><family>Noto Serif SC</family></prefer></alias>
</fontconfig>
FCEOF
fi
docker run --rm --network host \
  -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -e NODE_PATH=/pw/node_modules \
  -e ORIGIN="${ORIGIN:-https://vincejiang.com}" \
  -v "$ROOT":/repo -v "$PW_DIR/node_modules":/pw/node_modules \
  -v "$FONT_DIR":/usr/share/fonts/vj-cjk:ro \
  -v "$FONT_DIR/fonts.conf":/tmp/.config/fontconfig/fonts.conf:ro \
  -w /repo \
  "mcr.microsoft.com/playwright:v$PW_VERSION-jammy" \
  node tools/shots.mjs "$@"
