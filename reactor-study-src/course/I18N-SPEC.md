# REACTOR 双语规格（zh 主 / en 副）

> 2026-07-20 立项。翻译执行主体：Opus 4.8（用户指定）。
> 中文是母版，英文是译版；任何内容改动先改中文再同步英文。

## 1. URL 与文件布局

```
/                     中文首页（天赋树）        /en/                  英文首页
/lesson/R01.html      中文课                    /en/lesson/R01.html   英文课
/atlas.html           中文图鉴                  /en/atlas.html        英文图鉴
/llms.txt             中文机读目录              /en/llms.txt          英文机读目录
/sitemap.xml          两语全收（含 hreflang 对照）
```

源文件：
```
content/lessons/R01.mjs        中文课文（母版）
content/lessons-en/R01.mjs     英文课文（同结构，blocks 一一对应）
content/i18n.json              UI 骨架 + 分支名 + 节点标题/钩子的双语词条
```

## 2. 语言协商

- **不做自动跳转**（自动跳转会伤 SEO 且惹恼用户）。默认给中文，页面右上角提供切换。
- 切换按钮：与主题按钮同形制（`.btn.lang-toggle`），显示对侧语言（中文页显示 `EN`，
  英文页显示 `中`）。点击跳到对侧同一节点：`/lesson/R01.html` ↔ `/en/lesson/R01.html`。
- 记忆：切换时写 `localStorage["reactor.lang"]`，仅用于「下次点站内链接时保持语种」，
  **不做首屏重定向**。

## 3. SEO 双语要件（每页必须）

- `<html lang="zh-CN">` / `<html lang="en">`
- `<link rel="alternate" hreflang="zh-Hans" href="…">`
- `<link rel="alternate" hreflang="en" href="…">`
- `<link rel="alternate" hreflang="x-default" href="…">`（指中文版）
- canonical 指向自身语种
- `og:locale` 各自 zh_CN / en_US，并互加 `og:locale:alternate`
- sitemap 每条 `<url>` 内嵌 `xhtml:link` 双语对照
- 两语各一份 llms.txt；英文版 robots 同样放行 AI 检索器

## 4. 翻译契约（英文文风）

中文侧已有契约 v2（面向小白）+ v3（去讲课化、干练）。英文版对应：

1. **Plain, direct English.** Short sentences. No lecture voice: never write
   "In this lesson", "we will now", "as we saw earlier", "worth ten minutes".
   Open on the phenomenon or the story, exactly as the Chinese does.
2. **Terms**: give the English term of art as the primary form, with a plain-English
   gloss on first use (e.g. "commensuration — turning unlike things into one
   comparable number"). Chinese-only coinages get a natural English rendering,
   not a transliteration.
3. **Facts are frozen.** Every number, date, citation, author name and finding must
   survive translation unchanged. Do not add, drop, soften or "improve" any claim.
4. **Structure is frozen.** Same block count, same block types, same order.
   Callouts keep their variant (myth / intuit / applied). Keep the closing
   「留一个问题」→ "One open question" and 「一句话带走」→ "The one-line takeaway".
5. **Cross-references**: `<code>R01</code>` node IDs stay as-is (IDs are language
   neutral); the surrounding sentence gets translated.
6. **Module blocks are byte-identical to the Chinese file** — the interactive
   modules read their own copy from `modules/*.js`; module UI strings are handled
   separately in the i18n pass, not per-lesson.
7. Character rules: no em dash 「——」, no exclamation marks, straight quotes are
   fine in English (the 「」 rule is Chinese-only).

## 5. 交付批次

- P0 管线：build 双语路由 + hreflang + 切换按钮 + i18n.json 骨架（主线）
- T1 UI/骨架/图鉴词条（i18n.json：导航、页脚、横条、分支名、69 节点标题+钩子、
  术语表 34 条、讹传表 43 条）
- T2–T6 课文翻译，每波约 14 课（Opus 4.8）
- T7 交互模块 UI 文案英文化（modules/*.js 提字典）
- 终检：两语截图审计 + hreflang 校验 + sitemap 双语核对 + 部署
