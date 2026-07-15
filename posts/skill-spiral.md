---
title: "造 skill 的螺旋:概念解析 → eval 军备 → 回到概念"
description: "草料文风 skill 家族七天 80 个 commit 的开发全程复盘,附时间线、盲评对决数据、语义层校准闭环与 v2 双平面架构图:对 skill 的理解如何从概念解析走到 eval 军备,最后回到概念。"
tags: [AI, agent, skill, 技术报告]
date: 2026-07-15
updated: 2026-07-15
lang: zh-CN
---

<style>
.vz{color-scheme:light;
  --vz-s1:#2a78d6; --vz-s2:#008300; --vz-s3:#e87ba4;
  --vz-ink:var(--fg,#1d1d2b); --vz-sub:var(--sub,#63637a);
  --vz-grid:rgba(20,20,40,.13); --vz-axis:rgba(20,20,40,.32);
  margin:2.2rem 0;}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .vz{color-scheme:dark;
    --vz-s1:#3987e5; --vz-s2:#008300; --vz-s3:#d55181;
    --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);}
}
:root[data-theme="dark"] .vz{color-scheme:dark;
  --vz-s1:#3987e5; --vz-s2:#008300; --vz-s3:#d55181;
  --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);}
.vz svg{display:block;max-width:100%;height:auto;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.vz text{fill:var(--vz-ink);font-size:11px}
.vz .t2{fill:var(--vz-sub);font-size:10.5px}
.vz .tb{font-weight:600;font-size:12px}
.vz figcaption{font-size:.85rem;color:var(--sub,#63637a);margin-top:.5rem;line-height:1.5}
</style>

[上一篇](/blog/fable-scaling-layering/)写模型和 harness,这一篇写夹在两者中间的东西:skill。上一篇偏评论,这一篇是一份开发过程的技术复盘,对象有两个:

- **Caoliao-Docs 仓库**:2026-07-09 至 07-15,七天、80 个 commit,把"草料二维码对外文档的文风改写"从零做成一个 6-skill 家族(3 档 writer + 3 档 checker,当前 v2.3);
- **skills 仓库**:约两个月,16 个公开 skill 加上造 skill 的流水线本身。

两条线走过了同一条路径:对 skill 的理解从**概念解析**(把懂的东西写成文档)走到**以 eval 为主**(不可验证的都不算数),最后**回到概念**(概念成为唯一事实源,eval 降级为概念的校准器)。这份复盘按时间顺序给出每个阶段的做法、数据和失败模式,结论先行:

1. **概念不是散文。** 说不清"谁在判、凭什么判、失手了谁兜底"的概念只是嘱托,嘱托的执行方差不可控。
2. **eval 度量相对差,不定义质量。** 三轮大评测换了三种评审口径,冠军换了三次——rubric 本身就是一份被偷偷带进来的概念。
3. **回到概念时,eval 阶段的资产全部保留,只是换岗**:从"质量的定义者"变成"概念保真度的校准器"。这是螺旋,不是圆圈。

## 1. 任务定义与时间线

任务的工程定义:草料的对外文档(方案页、帮助文档、软文、客户案例、FAQ)此前被 AI 重写过一轮,页面逻辑成立但文风偏离。skill 的职责是**保事实、保图片引用、保信息量,换句式、换用词、换调性**,并满足三条不变量:零知识注入(原文没有的机制、收益、功能名一律不写,模型确信为真也不行)、内部经营统计零泄漏、公开页红线优先于文风。运行环境为 Claude Code skill,前置依赖只有 Node.js ≥18。

<figure class="vz">
<svg viewBox="0 0 640 268" role="img" aria-label="七天每日 commit 数柱状图,按三个阶段着色">
  <line x1="42" y1="145" x2="622" y2="145" stroke="var(--vz-grid)"/>
  <line x1="42" y1="81" x2="622" y2="81" stroke="var(--vz-grid)"/>
  <line x1="42" y1="18" x2="622" y2="18" stroke="var(--vz-grid)"/>
  <text x="36" y="148" text-anchor="end" class="t2">10</text>
  <text x="36" y="84" text-anchor="end" class="t2">20</text>
  <text x="36" y="21" text-anchor="end" class="t2">30</text>
  <path d="M 59.4 208 V 110.7 Q 59.4 106.7 63.4 106.7 H 99.4 Q 103.4 106.7 103.4 110.7 V 208 Z" fill="var(--vz-s1)"><title>07-09 · 16 commits · 概念解析+基建</title></path>
  <path d="M 142.3 208 V 22 Q 142.3 18 146.3 18 H 182.3 Q 186.3 18 186.3 22 V 208 Z" fill="var(--vz-s2)"><title>07-10 · 30 commits · eval 军备</title></path>
  <path d="M 225.1 208 V 104.3 Q 225.1 100.3 229.1 100.3 H 265.1 Q 269.1 100.3 269.1 104.3 V 208 Z" fill="var(--vz-s2)"><title>07-11 · 17 commits · eval 军备</title></path>
  <path d="M 308 208 V 205.7 Q 308 201.7 312 201.7 H 348 Q 352 201.7 352 205.7 V 208 Z" fill="var(--vz-s2)"><title>07-12 · 1 commit · 1.0.0 定版</title></path>
  <path d="M 390.9 208 V 205.7 Q 390.9 201.7 394.9 201.7 H 430.9 Q 434.9 201.7 434.9 205.7 V 208 Z" fill="var(--vz-s2)"><title>07-13 · 1 commit · 1.0.1</title></path>
  <path d="M 473.7 208 V 161.3 Q 473.7 157.3 477.7 157.3 H 513.7 Q 517.7 157.3 517.7 161.3 V 208 Z" fill="var(--vz-s3)"><title>07-14 · 8 commits · v2 重建</title></path>
  <path d="M 556.6 208 V 167.7 Q 556.6 163.7 560.6 163.7 H 596.6 Q 600.6 163.7 600.6 167.7 V 208 Z" fill="var(--vz-s3)"><title>07-15 · 7 commits · 校准+蒸馏+v2.3</title></path>
  <text x="81.4" y="100.7" text-anchor="middle">16</text>
  <text x="164.3" y="12" text-anchor="middle">30</text>
  <text x="247.1" y="94.3" text-anchor="middle">17</text>
  <text x="330" y="195.7" text-anchor="middle">1</text>
  <text x="412.9" y="195.7" text-anchor="middle">1</text>
  <text x="495.7" y="151.3" text-anchor="middle">8</text>
  <text x="578.6" y="157.7" text-anchor="middle">7</text>
  <line x1="42" y1="208" x2="622" y2="208" stroke="var(--vz-axis)"/>
  <text x="81.4" y="226" text-anchor="middle" class="t2">07-09</text>
  <text x="164.3" y="226" text-anchor="middle" class="t2">07-10</text>
  <text x="247.1" y="226" text-anchor="middle" class="t2">07-11</text>
  <text x="330" y="226" text-anchor="middle" class="t2">07-12</text>
  <text x="412.9" y="226" text-anchor="middle" class="t2">07-13</text>
  <text x="495.7" y="226" text-anchor="middle" class="t2">07-14</text>
  <text x="578.6" y="226" text-anchor="middle" class="t2">07-15</text>
  <rect x="42" y="244" width="10" height="10" rx="2" fill="var(--vz-s1)"/>
  <text x="58" y="253">概念解析 + 基建</text>
  <rect x="220" y="244" width="10" height="10" rx="2" fill="var(--vz-s2)"/>
  <text x="236" y="253">eval 军备(至 1.0.1)</text>
  <rect x="430" y="244" width="10" height="10" rx="2" fill="var(--vz-s3)"/>
  <text x="446" y="253">v2 重建 + 蒸馏</text>
</svg>
<figcaption>图 1 · Caoliao-Docs 仓库七天的每日 commit 数(合计 80),按当日主导工作归段着色。07-12/07-13 的低谷是 1.0.0/1.0.1 定版,07-14 起为 v2 推倒重建。</figcaption>
</figure>

| 阶段 | 日期 | 代表产物 | 当时的判定方式 |
|---|---|---|---|
| 概念解析 | 07-09 | 语料库 + 风格文档 + v3 / v3-doc | 人工通读 |
| eval 军备 | 07-09 – 07-13 | 盲评协议 v2.1、R1–R5 对决、机械门、六档家族 1.0.x | 盲评分数 + 机械门 |
| 回到概念 | 07-14 – 07-15 | v2 设计纲领、判断点登记表、薄壳蒸馏、v2.3 | 契约保真度(G1–G14 门) |

## 2. 阶段一:概念解析(07-09)

第一天的工作全部围绕"理解文风"展开,方法上没有问题,后来 v2 还在继续吃这批产出:

- **四路侦察**:帮助中心结构、业务范围、本地语料盘点、人写 vs AI 写的 A/B 对照。老文风样本从 Wayback Machine 的 CDX API 枚举 2024–2025 快照获得(现网页面已混入 AI 改写,不可直接当基线),每篇语料入库时带干净度分级(confirmed-human / wayback-2025-earlier / suspect-live-2026 / confirmed-ai)。
- **AI 指纹差分**:用同一页面的人写版与 AI 版做逐项对照,提炼出可操作的指纹清单——密集排比、"不是 A 而是 B"句式、破折号插入语、设问开场、口语比喻、精确数字加点名案例、篇幅膨胀至 4–5 倍。
- **风格文档化**:一份"底座灵魂"(用"你"禁"您"、禁营销形容词、诚实边界),一份红线法典(开门见山、禁设问、因果链论证、内部数据铁律)。

产出的 skill 有两版:v3 是**散文嘱托**式,`SKILL.md` 用数千字叮嘱模型该怎么写;v3-doc 增加知识检索,把语料蒸馏成库,改写前先查。

失败模式有三条,当时就有明确归因:规则来自风格指南的抽象切片、缺原生样本支撑;词汇与示例密度不足(约 30 词条、7 对好坏对照,覆盖不了 12 个场景);没有分场景路由。但更根本的问题在实测里暴露:**同一份嘱托,执行方差不可控**——模型有时忠实执行,有时自作主张;检索让它"知道"老文风长什么样,但知道与写出来是两回事。并且此时没有任何证据能回答"这一版比上一版好吗",判定方式只有人工通读。

skills 仓库更早犯过同一个错:把方法论写进知识库,默认知识密度等于执行质量。

## 3. 阶段二:eval 军备(07-09 – 07-13)

对策是把一切换成可测量的。四天里建起来的评测基建包括:

- **盲评协议**:改写产物匿名为 A–F,评审分五类 persona 席位(决策者/操作者/选型者/C 端读者等),每案例每 persona 一票,映射表私存,揭盲后聚合;协议本身迭代到 v2.1(修评审机制,不调分)。
- **确定性六轴**:错术语、红线、重俚语、轻俚语、白描等可机械计数的轴,与盲评分离。
- **机械门**:抓取残留/空骨架/悬空引子的成品门;绝对化红线 lint(零漏检→漏检率更低、永久→长期、无"全市首家");结构硬门(事实零新增、图片 src 零丢失、篇幅 ±20%);后来补上破折号零容忍门。
- **语境分类器**:节级八类语境驱动 S/M/H 自动路由,三轮迭代把节级准确率从 71.8% 提到 93.1%,CLAIM 类召回从 58% 提到 92%。

<figure class="vz">
<svg viewBox="0 0 640 210" role="img" aria-label="分类器三轮迭代前后对比条形图">
  <circle cx="48" cy="16" r="5" fill="var(--vz-s1)"/>
  <text x="60" y="20">迭代前</text>
  <circle cx="130" cy="16" r="5" fill="var(--vz-s2)"/>
  <text x="142" y="20">三轮迭代后</text>
  <line x1="44" y1="36" x2="44" y2="166" stroke="var(--vz-axis)"/>
  <line x1="184" y1="36" x2="184" y2="166" stroke="var(--vz-grid)"/>
  <line x1="324" y1="36" x2="324" y2="166" stroke="var(--vz-grid)"/>
  <line x1="464" y1="36" x2="464" y2="166" stroke="var(--vz-grid)"/>
  <line x1="604" y1="36" x2="604" y2="166" stroke="var(--vz-grid)"/>
  <text x="44" y="184" text-anchor="middle" class="t2">0</text>
  <text x="184" y="184" text-anchor="middle" class="t2">25</text>
  <text x="324" y="184" text-anchor="middle" class="t2">50</text>
  <text x="464" y="184" text-anchor="middle" class="t2">75</text>
  <text x="604" y="184" text-anchor="middle" class="t2">100%</text>
  <text x="44" y="46" class="tb">节级分类准确率</text>
  <path d="M 44 52 H 442.1 Q 446.1 52 446.1 56 V 64 Q 446.1 68 442.1 68 H 44 Z" fill="var(--vz-s1)"><title>迭代前 71.8%</title></path>
  <text x="452" y="64">71.8</text>
  <path d="M 44 72 H 517.4 Q 521.4 72 521.4 76 V 84 Q 521.4 88 517.4 88 H 44 Z" fill="var(--vz-s2)"><title>三轮后 93.1%</title></path>
  <text x="527" y="84">93.1</text>
  <text x="44" y="114" class="tb">CLAIM 类召回</text>
  <path d="M 44 120 H 364.8 Q 368.8 120 368.8 124 V 132 Q 368.8 136 364.8 136 H 44 Z" fill="var(--vz-s1)"><title>迭代前 58%</title></path>
  <text x="375" y="132">58</text>
  <path d="M 44 140 H 559.2 Q 563.2 140 563.2 144 V 152 Q 563.2 156 559.2 156 H 44 Z" fill="var(--vz-s2)"><title>三轮后 92%</title></path>
  <text x="569" y="152">92</text>
</svg>
<figcaption>图 2 · 语境分类器三轮迭代的前后对比(0.9.0.1-o1)。分类器只出证据,裁决权后来在 v2 里显式划给 LLM(D→L)。</figcaption>
</figure>

对决按轮次推进,每轮解决一个明确问题:

| 轮次 | 内容 | 关键结果 |
|---|---|---|
| R1+R2 | o1 对 v5 的等价重构 | 双重验收通过,industrial |
| R3 | 三深度档扩展(0.8.1-o1) | 双重验收通过 |
| R4 | 标准档 vs v5 行为终证 | 盲评 83.92 : 83.92,差 0.00,等价成立 |
| R5 | 全新 20 案例 × 6 版本 × 100 评审席 | 见图 3 |

R5 是这个阶段的顶点:全新 20 案例(12 场景、与旧集零重叠)、6 个版本、120 篇改写零失败、100 个盲评席位。

<figure class="vz">
<svg viewBox="0 0 640 300" role="img" aria-label="R5 盲评揭盲点图:六个版本在全综合与 C 端读者席上的得分">
  <circle cx="98" cy="16" r="5" fill="var(--vz-s1)"/>
  <text x="110" y="20">全综合(100 席)</text>
  <circle cx="300" cy="16" r="5" fill="var(--vz-s2)"/>
  <text x="312" y="20">C 端读者席(20 席)</text>
  <line x1="92" y1="32" x2="92" y2="240" stroke="var(--vz-grid)"/>
  <line x1="222" y1="32" x2="222" y2="240" stroke="var(--vz-grid)"/>
  <line x1="352" y1="32" x2="352" y2="240" stroke="var(--vz-grid)"/>
  <line x1="482" y1="32" x2="482" y2="240" stroke="var(--vz-grid)"/>
  <line x1="612" y1="32" x2="612" y2="240" stroke="var(--vz-grid)"/>
  <text x="92" y="258" text-anchor="middle" class="t2">50</text>
  <text x="222" y="258" text-anchor="middle" class="t2">60</text>
  <text x="352" y="258" text-anchor="middle" class="t2">70</text>
  <text x="482" y="258" text-anchor="middle" class="t2">80</text>
  <text x="612" y="258" text-anchor="middle" class="t2">90</text>
  <text x="84" y="48" text-anchor="end">软文</text>
  <line x1="458.6" y1="44" x2="509.3" y2="44" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="509.3" cy="44" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>软文 · 全综合 82.1</title></circle>
  <circle cx="458.6" cy="44" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>软文 · C 端读者 78.2</title></circle>
  <text x="509.3" y="34" text-anchor="middle" class="t2">82.1</text>
  <text x="458.6" y="62" text-anchor="middle" class="t2">78.2</text>
  <text x="84" y="84" text-anchor="end">v3</text>
  <line x1="471.6" y1="80" x2="534" y2="80" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="471.6" cy="80" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v3 · 全综合 79.2</title></circle>
  <circle cx="534" cy="80" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v3 · C 端读者 84.0</title></circle>
  <text x="471.6" y="70" text-anchor="middle" class="t2">79.2</text>
  <text x="534" y="98" text-anchor="middle" class="t2">84.0</text>
  <text x="84" y="120" text-anchor="end">v5</text>
  <line x1="452.1" y1="116" x2="467.7" y2="116" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="467.7" cy="116" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v5 · 全综合 78.9</title></circle>
  <circle cx="452.1" cy="116" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v5 · C 端读者 77.7</title></circle>
  <text x="467.7" y="106" text-anchor="middle" class="t2">78.9</text>
  <text x="452.1" y="134" text-anchor="middle" class="t2">77.7</text>
  <text x="84" y="156" text-anchor="end">o1-S</text>
  <line x1="432.6" y1="152" x2="545.7" y2="152" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="432.6" cy="152" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-S · 全综合 76.2</title></circle>
  <circle cx="545.7" cy="152" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-S · C 端读者 84.9,全场第一</title></circle>
  <text x="432.6" y="142" text-anchor="middle" class="t2">76.2</text>
  <text x="545.7" y="170" text-anchor="middle" class="t2">84.9 ①</text>
  <text x="84" y="192" text-anchor="end">o1-H</text>
  <line x1="181.7" y1="188" x2="326.6" y2="188" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="326.6" cy="188" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-H · 全综合 68.2</title></circle>
  <circle cx="181.7" cy="188" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>o1-H · C 端读者 56.9</title></circle>
  <text x="326.6" y="178" text-anchor="middle" class="t2">68.2</text>
  <text x="181.7" y="206" text-anchor="middle" class="t2">56.9</text>
  <text x="84" y="228" text-anchor="end">v4</text>
  <line x1="159.6" y1="224" x2="283.1" y2="224" stroke="var(--vz-grid)" stroke-width="2"/>
  <circle cx="283.1" cy="224" r="5.5" fill="var(--vz-s1)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v4 · 全综合 64.7</title></circle>
  <circle cx="159.6" cy="224" r="5.5" fill="var(--vz-s2)" stroke="var(--page,#f5f5fa)" stroke-width="2"><title>v4 · C 端读者 55.2</title></circle>
  <text x="283.1" y="214" text-anchor="middle" class="t2">64.7</text>
  <text x="159.6" y="242" text-anchor="middle" class="t2">55.2</text>
  <line x1="92" y1="240" x2="612" y2="240" stroke="var(--vz-axis)"/>
</svg>
<figcaption>图 3 · R5 揭盲结果(按全综合降序)。o1-S 在自己的目标读者(C 端)席上全场第一、最佳票 11/20 断层领先,o1-H 在选型者席超过 v5——两档各自命中自己的读者、牺牲别人的读者,正是读者契约设计的预期形状。</figcaption>
</figure>

| 版本 | 全综合 | C 端读者席 | 最佳票(/100) |
|---|---|---|---|
| 软文 | **82.1** | 78.2 | **47** |
| v3 | 79.2 | 84.0 | 19 |
| v5 | 78.9 | 77.7 | 14 |
| o1-S | 76.2 | **84.9** | 14 |
| o1-H | 68.2 | 56.9 | 5 |
| v4 | 64.7 | 55.2 | 1 |

07-12 定版 1.0.0:六 skill 镜像家族。skills 仓库同期在做同构的事:每个 skill 自带确定性校验器加红绿 eval,再配独立 attacker,"写答案的人不要同时判答案"成为一等公民。

先记录这个阶段真实成立的部分:**可正则化的规则下沉为确定性脚本(零 token、零随机)、红先绿后、独立对抗测试**,这三件事至今仍是这套工程的地基;靠文档密度传递可枚举规则,已被第一阶段证伪。

然后是两个结构性问题。它们出在方法本身的边界上,换更仔细的执行也绕不开。

**问题一:冠军随评审口径翻转。** 三轮大评测,三种 rubric,三个冠军:RUN-1 软文赢;RUN-3 换成严格产品页规范 rubric,v5 赢(89.8 vs 软文 85.5);R5 放宽为"允许按读者定位判断得体",软文又赢(82.1)。数据本身没有矛盾——变的是评审契约。这意味着盲评能回答的问题只有"在这份契约下谁赢",而"用哪份契约"恰恰是被绕过去的概念问题。R4 那个 0.00 的完美平手同样值得警惕地读:它作为等价重构的验收是成功的,但也说明盲评度量的是相对差,对"绝对的好"没有任何主张。skills 仓库提供了更硬的反例:正则事实 linter 全绿而事实错误;引用 linter 被"不可见标记"逐步拟合到失效。分数会饱和,饱和之后继续优化分数,优化的就不再是质量。

**问题二:概念债在 eval 的绿灯下积累。** 档位切成 -10/-8/-5/-2 再改名 raw/xhigh/high/med,数字越大质量越高、token 越贵,但"档位是什么东西的档位"没有定义。后果在 v2 重建前的审计里量化过:同一条规则在 `SKILL.md`、law、voice、`rules.yaml` 出现 2–4 份表述;数字规则矩阵至少 5 份副本、红线至少 6 处、H 档契约至少 7 份;`voice.md` 有 3 处乱码;frontmatter 塞着整部版本史;writer 包内没有随包 eval,装机不可验。每一份副本都是某次让 eval 变绿的局部修补留下的。

## 4. 阶段三:回到概念(07-14 – 07-15)

触发事件是用户(草料侧)对 1.0 的三条批评:**结构混乱;文风控制差;分不清哪些判断由 LLM 做出、哪些由硬编码的拟合判断器做出。** 第三条分量最重,它指向概念缺失:系统里没有任何位置能回答"这个判断是谁在判、凭什么判、失手了谁兜底"。

v2 是推倒重建,从一份写在任何代码之前的设计纲领开始,治理上引入 G 门制度:G1–G14,每道门先预注册验收标准再动手,决策全部落进 decision-ledger,battery(独立对抗验收)预算与种子在派发前注册、不可变更。纲领的核心是三个概念。

### 4.1 双平面 + 人闸:每个判断必须有归属

<figure class="vz">
<svg viewBox="0 0 640 372" role="img" aria-label="v2 双平面加人闸架构图">
  <defs>
    <marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 Z" fill="var(--vz-axis)"/>
    </marker>
  </defs>
  <rect x="14" y="86" width="96" height="56" rx="6" fill="none" stroke="var(--vz-axis)"/>
  <text x="62" y="110" text-anchor="middle" class="tb">输入文档</text>
  <text x="62" y="128" text-anchor="middle" class="t2">extract_md 归一</text>
  <line x1="110" y1="114" x2="126" y2="114" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <rect x="130" y="18" width="230" height="106" rx="6" fill="var(--vz-s1)" fill-opacity="0.10" stroke="var(--vz-s1)" stroke-width="1.5"/>
  <text x="146" y="40" class="tb">Plane D · 机械面</text>
  <text x="146" y="60" class="t2">rules.yaml 唯一规则注册表 + Node 引擎</text>
  <text x="146" y="78" class="t2">style_check / structure_check / 指纹 / 术语门</text>
  <text x="146" y="96" class="t2">确定性 · 零 token · 全档逐字节同判</text>
  <text x="146" y="114" class="t2">docs 只许指针,不许权威表述</text>
  <rect x="130" y="180" width="230" height="106" rx="6" fill="var(--vz-s2)" fill-opacity="0.10" stroke="var(--vz-s2)" stroke-width="1.5"/>
  <text x="146" y="202" class="tb">Plane L · 语义面</text>
  <text x="146" y="222" class="t2">独立 attacker 三镜头 A1/A2/A3</text>
  <text x="146" y="240" class="t2">判断卡 VC-xx:判据 + ❌/✅ 最小对</text>
  <text x="146" y="258" class="t2">+ 输出形态 + D 面兜底说明</text>
  <text x="146" y="276" class="t2">剂量 = 档位间唯一变量</text>
  <line x1="210" y1="124" x2="210" y2="176" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <text x="218" y="146" class="t2">D→L 证据初筛,</text>
  <text x="218" y="160" class="t2">LLM 裁决</text>
  <line x1="330" y1="180" x2="330" y2="128" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <text x="338" y="146" class="t2">L→D 产出,</text>
  <text x="338" y="160" class="t2">机械复核</text>
  <rect x="440" y="100" width="184" height="104" rx="6" fill="var(--vz-s3)" fill-opacity="0.12" stroke="var(--vz-s3)" stroke-width="1.5"/>
  <text x="456" y="122" class="tb">H · 人闸</text>
  <text x="456" y="142" class="t2">图片 PII 终审(逐张)</text>
  <text x="456" y="160" class="t2">修复前确认闸</text>
  <text x="456" y="178" class="t2">plausible / 放弃裁决</text>
  <text x="456" y="196" class="t2">机器不越权</text>
  <line x1="360" y1="80" x2="436" y2="118" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <line x1="360" y1="226" x2="436" y2="186" stroke="var(--vz-axis)" marker-end="url(#ah)"/>
  <rect x="130" y="304" width="494" height="58" rx="6" fill="none" stroke="var(--vz-axis)" stroke-dasharray="5 4"/>
  <line x1="245" y1="286" x2="245" y2="304" stroke="var(--vz-axis)" stroke-dasharray="3 3"/>
  <line x1="532" y1="204" x2="532" y2="304" stroke="var(--vz-axis)" stroke-dasharray="3 3"/>
  <text x="146" y="328" class="tb">判断点登记表(23 个判断点)</text>
  <text x="146" y="348" class="t2">编号 · 归属 D/L/D→L/L→D/H · 执行物 · 失手兜底 —— ledger_lint.mjs 机械校验:规则 id 实存 / 判断卡实存 / 无孤儿规则</text>
</svg>
<figcaption>图 4 · v2 双平面架构。任何判断显式归属 Plane D(可正则化 → 确定性脚本)、Plane L(原理上不可正则化 → LLM 判断卡)或 H(人闸);跨平面协作只有 D→L 与 L→D 两种登记记号。</figcaption>
</figure>

划分标准只有一条:**原理上能否正则化**。能,就进 `rules.yaml`,由 Node 引擎执行,docs 里只留指针;不能(新变体、语义、语用、因果成立性),就写成判断卡交给独立 attacker,且每张卡必须写明失手时哪个机械门兜底。人闸单列,机器不越权。

### 4.2 判断点登记表:可被 lint 的概念

`SKILL.md` 里的登记表逐行登记流水线上的每个判断点(writer-max 共 23 个),摘三行实样:

| 编号 | 判断内容 | 归属 | 执行物 | 失手兜底 |
|---|---|---|---|---|
| J-01 | 判型(doc_type × biz_scene × 细分类) | L | `doc-types.md` 判据 + 防误用闸 | 细分类错 → VC-08 低置信交人判 |
| J-04 | 节级语境 8 类 | D→L | `context_classify.mjs`(证据 + 低置信标记) | VC-08;UNKNOWN 列 fail-safe 严门 |
| J-05 | 俚语 register(太俚) | D | colloquial-register(error 级) | VC-01(表外新变体) |

配套的 `ledger_lint.mjs` 做机器校验:登记表引用的规则 id 必须实存于 `rules.yaml`,判断卡 VC-xx 必须实存于 `voice.md`,规则表不许有登记表遗漏的孤儿规则,词表门必须登记 L 面兜底。用户的第三条批评从此是一条可以跑红跑绿的断言,不再是一种感受。

### 4.3 单一事实源 + 薄壳:概念只有一个居所

<figure class="vz">
<svg viewBox="0 0 640 280" role="img" aria-label="薄壳解析架构图:四个薄壳档运行时解析两个 max 源">
  <defs>
    <marker id="ah2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 Z" fill="var(--vz-axis)"/>
    </marker>
  </defs>
  <rect x="96" y="16" width="212" height="92" rx="6" fill="var(--vz-s1)" fill-opacity="0.10" stroke="var(--vz-s1)" stroke-width="1.5"/>
  <text x="112" y="38" class="tb">writer-max(契约唯一居所)</text>
  <text x="112" y="58" class="t2">control/rules.yaml + 引擎</text>
  <text x="112" y="76" class="t2">docs/ 判断卡与红线</text>
  <text x="112" y="94" class="t2">contract-api.json(机读契约清单)</text>
  <rect x="368" y="16" width="212" height="92" rx="6" fill="var(--vz-s2)" fill-opacity="0.10" stroke="var(--vz-s2)" stroke-width="1.5"/>
  <text x="384" y="38" class="tb">checker-max(工具唯一居所)</text>
  <text x="384" y="58" class="t2">mark_violations / repair_lint</text>
  <text x="384" y="76" class="t2">score_rubric / ledger_lint</text>
  <text x="384" y="94" class="t2">契约仍经 contract-api 解析 →</text>
  <line x1="368" y1="98" x2="312" y2="98" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <rect x="20" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="85" y="198" text-anchor="middle" class="tb">writer</text>
  <text x="85" y="216" text-anchor="middle" class="t2">薄壳 · 零副本</text>
  <rect x="175" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="240" y="198" text-anchor="middle" class="tb">writer-lite</text>
  <text x="240" y="216" text-anchor="middle" class="t2">薄壳 · 零副本</text>
  <rect x="330" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="395" y="198" text-anchor="middle" class="tb">checker</text>
  <text x="395" y="216" text-anchor="middle" class="t2">薄壳 · 双解析</text>
  <rect x="485" y="176" width="130" height="54" rx="6" fill="none" stroke="var(--vz-ink)" stroke-opacity="0.5" stroke-dasharray="5 4"/>
  <text x="550" y="198" text-anchor="middle" class="tb">checker-lite</text>
  <text x="550" y="216" text-anchor="middle" class="t2">薄壳 · 双解析</text>
  <line x1="85" y1="176" x2="160" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <line x1="240" y1="176" x2="220" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <line x1="395" y1="176" x2="440" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <line x1="550" y1="176" x2="510" y2="112" stroke="var(--vz-axis)" marker-end="url(#ah2)"/>
  <text x="150" y="146" class="t2">resolve_writer.mjs</text>
  <text x="440" y="146" class="t2">resolve_checker.mjs</text>
  <text x="20" y="262" style="fill:#d03b3b;font-weight:600">⛔ fail-closed</text>
  <text x="118" y="262" class="t2">契约缺失 / 版本 &lt;2.0.0 / 路径逃逸 → 报安装指引并拒跑,绝不静默用旧契约(evals 断言三路)</text>
</svg>
<figcaption>图 5 · 薄壳解析。契约与工具各只有一个居所,四个薄壳档运行时经机读清单解析、就地调用;跨档机械判定逐字节一致由随包 eval 断言。</figcaption>
</figure>

改一处,全家族同步,漂移在物理上不可能发生;v1 的 2–7 份规则副本清零。六个包随包携带合计 125 项断言,装机即可验:契约解析、fail-closed 三路、跨档逐字节一致、各档剂量协议、SKILL 常驻税(按字符计 lite ≤ std ≤ max,当前 6366 / 6369 / 6792)。

### 4.4 语义层校准:eval 的新岗位

Plane D 逐字节可验,Plane L 怎么验?G10 预注册了三个阈值:P0 级问题召回 = 100%,整体对齐率 ≥ 85%,误伤率 ≤ 10%,上限 3 轮。做法是从判断卡出发构造 40 例金标(带生成器与评分器,评分器自身先过红绿自检),让 Opus·medium 按盲跑协议执行,量"它的判断与契约的判断有多对齐":

| 指标 | 阈值(预注册) | round-1(40 例盲跑) | round-2(修复后) |
|---|---|---|---|
| 整体对齐率 | ≥ 85% | 88.3%(过) | **98.3%** |
| P0 confirmed 召回 | = 100% | 62.5%(**不过**) | **100%(8/8)** |
| 误伤率 | ≤ 10% | 0%(过) | **0%** |

round-1 的失败本身是个有代表性的案例:三个 P0 漏判全部落在同一个执行实例上,拿地面真相(直接 grep 底稿)复核,证明漏掉的片段全部实存,而该实例在批量执行时把 case-25 的结论写进了 case-23——**根因是盲跑的执行卫生(批读串档),判断卡与 attacker 协议零缺陷**。修复动作是给盲跑协议加"单 case 隔离 + span 落盘自证",判断卡一字未改,污染切片重跑后合并终评全部达标。这就是"eval 校准概念"与"eval 定义质量"的操作性区别:失败被归因到概念、协议还是执行卫生,三者的修复动作完全不同。

### 4.5 蒸馏与 v2.3:档位语义与性能锚定

G12 预注册蒸馏契约,核心裁决一句话:**档位轴 = Plane L 的剂量,Plane D 全档恒等。**

| 档 | Plane L 剂量 | 说明 |
|---|---|---|
| lite | **0** | 无 attacker、零 LLM 子代理;语义盲区诚实声明"本档不覆盖,请升档"(登记表 L 行整体 OFF,引用任何语义判断卡即 eval FAIL) |
| 标准 | 单轮 | 三镜头一遍 → 修 confirmed → 复核一次,不重扫收敛 |
| max | 多轮 | 重扫收敛至一轮零 confirmed,≤3 轮绝对上限 fail-stop;checker-max 另加证伪复核轮 |

第一阶段"档位是什么"的悬案,在概念层一句话回答完毕;军备时代四档契约的漂移,在这个定义下直接消失,连修复动作都不需要。

v2.3 的定位裁决来自一轮跨模型基准:六个模型(Opus / Sonnet / GLM-5.2 / DeepSeek-V4-Pro / Kimi-K2.6 / Qwen3.7-Max)× 六档 × 端到端改写与体检,A/B 网页报告落盘。结论如实写进 README:**这套 skill 是让 Opus 发挥实力的脚手架,弱模型的典型病灶(知识注入、程度词升格、自造功能名、口语滑档)可以用护栏压制,但压制不等于同等水平**,于是标准档锁 Opus·medium,lite 回归走量档(Sonnet 可跑,产出回 checker + Opus 兜底),"国模特调"路线废弃、护栏沉淀为通用资产。这轮基准还顺带抓出一个自家 bug:整场基准的 style_check 结果解析读了一个不存在的 JSON 键,error/warning 恒为 0——发现后 30 份产出全量重验,唯一翻案是 GLM 的一篇实为 1 error。基准基建自己也需要被审计,这个教训记进了台账。

输出侧按"输出经济学"收口:writer 只交 `rewritten.md` 一个文件;checker 恰好交 `report.md` + `findings.json` 两份;修复一律锚点替换——复制原文后逐处"原片段 → 新片段"精确替换,禁止整篇重新生成,**输出 token 随违规数增长、与篇幅无关**,替换后由 structure_check 复核图片零丢失、未涉段落零改动。

## 5. 平行案例:skills 仓库的同构轨迹

同一条路径在 skills 仓库以更大的尺度重演了一遍,可以作为独立复现:

- **概念阶段**:方法论写进 develop-principle 知识库,靠密度传递;
- **eval 阶段**:红绿 eval、独立 battery、attacker、mutation score、trigger holdout 全部建齐,也在这里攒下 green-but-wrong 的两个案例(正则事实 linter、引用 linter 被拟合失效);
- **回到概念**:造 skill 的流水线(guidance / engineer / conductor / zipper 四技能加 attacker)越修越重,最终停下来先写哲学知识库——10 条公理、43 条 guideline、38 条宪法条款,自我攻击五轮、54 个发现(含 15 个 P1)全部修复后收敛——再从知识库**重新推导**出一个薄 conductor(skill-creator-max),旧四件套退役;attacker 的五个攻击透镜同样从哲学层重新推导;新管线重造的第一个 skill(TDD),红绿 eval 直接从概念生成。

## 6. 复盘:为什么是螺旋

把三个阶段排成一行,容易读成"绕一圈回到原点"。数据不支持这个读法:

1. **第一阶段的"概念"没有执行语义**:无归属、无兜底、无覆盖清单,对模型只是嘱托,执行方差不可控,且无法回答"变好了吗"。
2. **第二阶段是必经之路**。"可机械化 / 不可机械化"这条边界——双平面概念的地基——是几百篇改写、上百个评审席、三轮分类器迭代实测摸出来的经验数据。没有这个阶段,Plane D / Plane L 的分界线与每张判断卡上的"D 面兜底"都无从写起。
3. **第三阶段零删除**。盲评协议、机械门、红绿 eval、独立 attacker 全部保留,岗位从"定义质量"改为"校准概念保真度"(G10 的三阈值全部是保真度指标);同时新增了 eval 阶段给不出的东西:判断归属、单一事实源、fail-closed、档位语义。

留两条可操作的判据:

> 如果 skill 里存在一个判断,说不清它是谁在判、凭什么判、失手了谁兜底——那还不是概念,是嘱托。
>
> 如果 eval 全绿,但说不出这个绿在证明哪个命题——那不是质量,是分数。

上一篇写过"多次循环和 spec 无法解决智力问题",这份复盘补上后半句:**循环和 eval 也解决不了概念问题。** 概念在循环外确立,循环负责执行与校准。v2.3 的性能锚定是同一逻辑的推论:skill 是让强模型发挥实力的脚手架,不是补齐弱模型的义肢——连"对弱模型如实声明降级"这一条,也是从概念层推导出来的设计,而不是营销上的取舍。
