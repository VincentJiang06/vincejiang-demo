# 声音仪表盘

单副耳机的可编辑听感卡片。以用户提供的 NFACOUS 参考图为基础，添加名称、评价日期和签名。

- 五个频段各选突出 / 均衡 / 收敛。
- 动态、瞬态、声场、分离度、解析度各五档（1–5）。桌面可拖动旋钮、使用方向键或点击外圈五段；手机竖屏改为五个独立档位块。
- 所有信息实时编码进 URL 的 `#review=` 片段，刷新、收藏或复制链接均能恢复；不依赖本地存储或后端数据库。链接为快照，之后编辑不会修改别人已经收到的链接。
- JPEG 导出为 1518 px 宽，质量 82%的原版排布，包含填写信息，不含工具栏。
- 暂不提供评价列表。

## 运行

`npm install` 后 `npm run dev -- --port 4173`，打开 `http://localhost:4173/sound_dashboard/`。

`npm run build` 输出静态文件至 `dist/client/`；把该目录内容部署到网站 `/sound_dashboard/` 目录，对应目标 `https://vincejiang.com/sound_dashboard/`。资源路径已设置同一前缀。正式部署后复制分享链接会自动使用正式域名；本地预览复制的链接为本地地址。生产发布走 `vincejiang-demo` 的 main 分支 CI；源码位于该仓库 `tools/sound-dashboard/`，流水线生成 `/sound_dashboard/` 静态站点。

`npm test` 验证中文 / Unicode 链接往返、全部状态还原、五档约束和无效数据处理。

## 自适应

以仪表盘实际可用宽度为准：560 px 及以下使用紧凑布局，覆盖手机、窄窗口和平板竖屏；更宽显示五组旋钮。图标已按反馈缩小，不显示旋钮下方的 1–5 数字。

## 还原边界

标题锁定区按参考图用文字重绘（“声音仪表盘”+ 字距铺满的 SOUND DASHBOARD），左对齐，不再保留 NFACOUS 位置的遮挡块；`public/assets/brand.png` 仅作留档，页面不再引用。可编辑圆点、旋钮和图标按参考重绘为 SVG。英文使用本地打包的 Oswald，中文使用系统黑体；没有原始字体和矢量素材，无法保证逐像素一致。参考图保存于 `public/assets/reference.png`，不作为页面背景。

## 命令行直接生成 JPEG

已安装命令 `sound-dashboard`。Node.js 22+；首次安装：`npm install && npm run build && npm link`，`sound-dashboard --install-browser` 安装图片渲染器。生成时无需打开用户浏览器，也不上传评价数据。

```bash
sound-dashboard --name "示例耳机" \
  --bands 突出,均衡,均衡,突出,均衡 \
  --steps 3,4,3,4,4 --theme mint \
  --jpeg card.jpg --format json --output card.json
```

默认直接输出 `sound-dashboard.jpg`，同时打印中英简介及正式分享链接。`--input examples/dashboard.json` 可替代逐项参数，`--input -` 接收 stdin。`--no-image` 只生成文字/链接，`--copy` 在 macOS 复制链接，`--force` 明确覆盖已有文件。

五频段顺序：低频、中低频、中频、中高频、高频，0/1/2 对应突出/均衡/收敛。五项 `steps` 顺序：动态、瞬态、声场、分离度、解析度，每项1–5（网页内部值0/25/50/75/100也可通过JSON的values输入）。工具只复述已填写档位，不按型号推断结论，不把缺失数据填成均衡或3档。日期默认 Asia/Shanghai 当天。

HiFi review 已增加 `scripts/sound_dashboard.py` 与 `rules/sound-dashboard.md`。可在完成证据校验后直接生成图片；集成源文件保存在 `integrations/hifi-review/`。
