# 论文展示模板规格(PAPER-SPEC)

> 给一篇质量合格的论文 md,生成 **A4 排版、符合学术论文格式、可直接浏览器打印成规范 A4 稿**的网页:
> 左侧大纲、连续分页(屏显 A4 纸张连排 / 打印原生分页)、三线表、题注编号、参考文献、可选严格数据图表与结构图/脑图。
>
> **这份文档是权威说明**。Opus 适配论文时照此写 md。改了渲染器(`tools/paper.mjs`、`tools/paper-charts.mjs`)或模板(`templates/paper.*`),**必须同步改本文件**。
> 关联:全站部署规范见 `SPEC.md`;生成器 `tools/build-site.mjs` 按 `layout: paper` 调用 `renderPaper`。

---

## 1. 启用 & 放置

一篇文章要用论文格式,frontmatter 写 `layout: paper` 即可。放置决定 URL(见 `SPEC.md §分组路由`):

| 源文件 | URL |
|---|---|
| `posts/<slug>.md` | `/blog/<slug>/` |
| `posts/<group>/<slug>.md` | `/blog/<group>/<slug>/` |
| `posts/<group>/<slug>.en.md` | `/blog/<group>/<slug>/en/`(英文子页,见 §4) |

**研究专辑**(一组按顺序连排的论文):在 `site.config.json` 的 `collections` 加一条,`order` 列出 slug。该组自动获得落地页 `/blog/<key>/`(编号清单)+ 每篇的「上一篇/下一篇」串联导航,即「多页面文件连排」。

---

## 2. Frontmatter schema

```yaml
---
layout: paper                     # 必填:启用论文模板
title: 论文中文题目                 # 必填:题目(正文里绝不能再写 # 一级标题)
description: 用于 <meta>/分享卡      # 可选;缺省取 paper.abstract 前 150 字
date: 2026-07-04                  # 可选;缺省 = 首次「发布」commit 日期
lang: zh-CN                       # 可选;默认 zh-CN
paper:
  authors:                        # 作者。字符串或对象
    - name: Vince Jiang
      affil: 某某单位             # 可选
      email: x@y.com             # 可选
  affiliations: [某某单位]         # 可选;缺省从 authors[].affil 汇总
  version: 工作论文               # 可选;进页眉元信息行(version · date · vincejiang.com)
  short: 短题名                   # 可选;每页页眉的 running head;缺省用 title
  subtitle: 副题                  # 可选;题目下方(题目含「——」会自动切成 title + subtitle)
  autonumber: false               # 可选;见 §5「标题编号」。默认 true
  abstract: 中文摘要正文…          # 强烈建议:进标题下方带边框的摘要框
  keywords: [关键词一, 关键词二]    # 可选;数组或「;」分隔字符串
  # —— 英文(双语单一数据源;英文子页与英文摘要框都取这里,见 §4)——
  title_en: English Title
  abstract_en: English abstract…
  keywords_en: [keyword-one, keyword-two]
---
```

> **单一数据源原则**:一切论文元数据(作者/版本/双语题目/双语摘要/双语关键词)都放在**中文主文件**的 `paper:` 里。英文 `.en.md` 只提供**译好的正文**(+ 可选 `title`/`description` 供 `<head>`)。

---

## 3. 正文结构(body)

正文用普通 Markdown。铁律:

- **禁 `# 一级标题`**:题目由 frontmatter `title` 提供。正文出现 `# ` 会**直接报错**(被 `build --check` 拦下)。章从 `##` 起,节 `###`,小节 `####`。
- 章节标题会自动进**左侧大纲**(收 `##`/`###` 两级)。
- 段落自动首行缩进 2 字;`**加粗**` 用黑体、`*斜体*` 斜体;`> 引用`、列表、`---` 分隔线、`` `代码` ``/代码块均按论文样式渲染。

### 特殊节(免编号)
标题文本命中这些词时**不参与自动编号**(仍进大纲):`摘要 / Abstract / 关键词 / Keywords / 参考文献 / References / 致谢 / Acknowledgements / 附录 / Appendix`。

### 图(figure)+ 自动编号「图 N」
- **图片**:单独成段的 `![题注](图片相对路径)` → 居中图 + 题注(取 alt)+ 自动「图 N」。图片放文章同目录,用带图目录式 `posts/<group>/<slug>/index.md` + 同目录图。
- **数据图表 / 结构图 / 脑图**:用围栏代码块,见 §6(可选)。

### 表(table)+ 自动编号「表 N」
markdown 表格**前面紧挨一段** `表：题注`(或 `Table: caption`),渲染成**三线表** + 表上方带「表 N 题注」。没有前置题注段的表格照样渲染成三线表,但不编号(`--check` 会 warn)。

```
表：P7 市场的平均战略配置(2026)

| 资产 | 份额 |
|---|---|
| 权益 | 48% |
| 债券 | 31% |
```

### 引文与参考文献 —— 两种体例都支持
- **数字引文** `[12]`:正文里的 `[12]`、`[3, 5]` 自动变上标并链到参考文献第 12 条。需要有 `## 参考文献`(或 `References`)节 + 其下一个有序列表(`1. …`),列表项自动获得 `#ref-n` 锚点。
- **MLA 作者-年** `(WTW 2026)`:原样渲染(不自动链)。`## 参考文献（Works Cited）` 下用普通列表列出。**本站养老金专辑用的就是这种。**

### 手动分页
需要强制换页处写 `<div class="pagebreak"></div>`(屏显与打印都在此断页)。

---

## 4. 双语(中英)

**双 URL + 顶部切换**模型:

1. 中文主文件 `<slug>.md`:全 frontmatter,含 `paper.title_en / abstract_en / keywords_en`。
2. 英文译文 `<slug>.en.md`:`lang: en` + `title:`(英文题)+ `description:` + **译好的正文**。**不要**在 `.en.md` 里重复 `paper:` 元数据。
3. 生成结果:中文主页 `/blog/…/<slug>/` + 英文子页 `/blog/…/<slug>/en/`;**首页/Blog 索引/RSS 只收中文主页**(英文页不重复出现);两页互挂 `hreflang`(`x-default` 指中文),右上角药丸「中 / EN」互跳。
4. 英文页的题目/摘要框取 `paper.title_en / abstract_en`;中文页的摘要框下会附英文 Abstract(若填了 `abstract_en`),即标准中英双摘要。

> 只有中文、暂无译文时:不建 `.en.md` 即可,页面不出现切换钮,一切正常。

---

## 5. 标题编号:`autonumber`

- `autonumber: true`(默认):模板**自动**给章节编号 `1 / 1.1 / 1.1.1`,标题文本别自己带号。适合「新写、交给模板排号」的论文。
- `autonumber: false`:**保留标题里的手写编号**(如 `## 一、…`、`## 第一章 …`),模板不再叠加。适合「已带完整手写编号」的成稿——**本站养老金五篇用的就是这个**,避免「1 一、…」双重编号。

两种模式都照常生成锚点 id 和左侧大纲。

---

## 6. 可选:严格数据图表 / 结构图 / 脑图

> 引擎在 `tools/paper-charts.mjs`(零依赖、构建时出 SVG、学术黑白灰、黑白打印不丢信息)。**可选**——养老金专辑按用户要求纯正文、不用。
>
> **数据保真铁律**:图表里每一个数值都必须能溯源到论文正文或其证据台账。**零编造**。宁可不画,不可画假。

用围栏代码块触发(语言标签 `chart` / `flow` / `mindmap`),渲染成带「图 N」编号的 figure。

### 6.1 数据图表 ```chart``` (JSON)
`type` ∈ `bar | hbar | line | scatter | pie`。通用:`caption`(图题)、`source`(数据来源)、`size:[宽,高]`、`unit`、`xlabel`、`ylabel`、`ymin`/`ymax`、`values`(柱顶标数值)。
- **bar / line / scatter**:`x:[类目…]`(bar 必填;line/scatter 可选)+ `series:[{name, data:[…]}]`。数值轴模式(无 `x`)下 `data` 用 `[[x,y], …]`。`stack:true` 堆叠柱。
- **hbar**(类目名长时):`x:[类目…]` + `series` + 可选 `xmax`。
- **pie**:`data:[{label, value}, …]`。

```chart
{"type":"bar","caption":"P7 平均战略配置(2026)","source":"WTW 2026","unit":"%","x":["权益","债券","其他","现金"],"series":[{"name":"份额","data":[48,31,19,3]}],"values":true}
```

### 6.2 结构图 / 流程图 ```flow``` (JSON)
`ranks`:二维数组,每行一层节点(节点 = 字符串,或 `{id,label,shape,em}`;`shape` ∈ `rect|round|stadium|diamond`,`em:true` 强调)。`edges`:`[from,to,label]` 或 `{from,to,label,dash}`。`direction`:`TB`(默认)或 `LR`。`caption`。

```flow
{"caption":"识别层→四层机制","direction":"LR","ranks":[["利率"],[{"id":"acct","label":"会计口径"},{"id":"hedge","label":"对冲"},{"id":"beh","label":"行为参照点"},{"id":"settle","label":"结算物理"}],["配置函数"]],"edges":[["利率","acct"],["利率","hedge"],["利率","beh"],["利率","settle"],["acct","配置函数"],["hedge","配置函数"],["beh","配置函数"],["settle","配置函数"]]}
```

### 6.3 脑图 ```mindmap``` (缩进文本)
首行可写 `caption: 图题`;单一根节点,缩进定层级,左→右布局。

```mindmap
caption: 五篇递进
低利率与养老金配置
	P1 利率传导机制
	P2 DB/DC 制度分化
	P3 另类与全球化
	P4 退出期风险治理
	P5 中国制度适配
```

---

## 7. 打印 & 分页行为

- **屏显**:深灰底 + A4 纸张(794×1123px@96dpi)连排;JS 按块级粒度分页,页眉(running head)+ 页码;左侧大纲随滚动高亮;无 JS 时退化为单张连续长纸(打印仍正确)。
- **打印 / 存 PDF**(侧栏按钮或 Ctrl/Cmd+P):隐藏一切界面(侧栏、切换钮、屏显分页),`@page A4`(上下 25.4mm、左右 30mm)由浏览器原生分页,页脚居中页码,标题避免孤悬、图表/表格不跨页断裂——**即规范 A4 论文稿**。

---

## 8. 预览 & 发布

```bash
cd tools && npm ci
node build-site.mjs --check      # 硬 gate:frontmatter / 正文违规(# 一级标题)/ 图表 JSON 非法 / 论文试渲染
node build-site.mjs --out ../site && python3 -m http.server -d ../site 8000
# 打开 http://localhost:8000/blog/<group>/<slug>/;侧栏「打印 / 存 PDF」验 A4
```

发布同全站规则(`SPEC.md §2`):`git commit` 且 **commit message 以「发布」开头**(或含 `[发布]`/`[publish]`)→ push `main` → CI 部署。没有发布标记的论文留在仓库里当草稿、不上线。
