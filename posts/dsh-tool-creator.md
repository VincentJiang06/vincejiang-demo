---
title: "造工具的工厂：验收证据随制品出厂"
description: "dsh-tool-creator 三天开发全程复盘：五角色门控流水线如何把「验收证据」打进每一个出厂制品，攻击轮抓获的真 P1、独立修复审计用我自己的证据反驳我、以及便宜模型为什么是门地板的推论而不是赌博。附架构图与 flash 分层两轮实测数据。"
tags: [AI, agent, dsh, 技术报告]
date: 2026-08-19
updated: 2026-08-19
lang: zh-CN
---

<style>
.vz{color-scheme:light;
  --vz-s1:#2a78d6; --vz-s2:#008300; --vz-s3:#e87ba4;
  --vz-ink:var(--fg,#1d1d2b); --vz-sub:var(--sub,#63637a);
  --vz-grid:rgba(20,20,40,.13); --vz-axis:rgba(20,20,40,.32);
  --vz-box:rgba(42,120,214,.08); --vz-band:rgba(0,131,0,.08);
  margin:2.2rem 0;}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .vz{color-scheme:dark;
    --vz-s1:#3987e5; --vz-s2:#00a300; --vz-s3:#d55181;
    --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);
    --vz-box:rgba(57,135,229,.14); --vz-band:rgba(0,163,0,.12);}
}
:root[data-theme="dark"] .vz{color-scheme:dark;
  --vz-s1:#3987e5; --vz-s2:#00a300; --vz-s3:#d55181;
  --vz-grid:rgba(255,255,255,.14); --vz-axis:rgba(255,255,255,.32);
  --vz-box:rgba(57,135,229,.14); --vz-band:rgba(0,163,0,.12);}
.vz svg{display:block;max-width:100%;height:auto;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.vz text{fill:var(--vz-ink);font-size:11px}
.vz .t2{fill:var(--vz-sub);font-size:10px}
.vz .tb{font-weight:600;font-size:12px}
.vz .bx{fill:var(--vz-box);stroke:var(--vz-axis);stroke-width:1;rx:4}
.vz .bd{fill:var(--vz-band);stroke:var(--vz-axis);stroke-width:1;rx:4}
.vz .ar{stroke:var(--vz-axis);stroke-width:1.2;fill:none}
.vz figcaption{font-size:.85rem;color:var(--sub,#63637a);margin-top:.5rem;line-height:1.5}
</style>

[上上篇](/blog/fable-scaling-layering/)写模型和 harness，[上一篇](/blog/skill-spiral/)写夹在中间的 skill。这一篇写第三层：**造 skill 的工厂**。对象是 [dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator)——2026-08-17 至 08-19，三天，从深夜调研到 GitHub v0.1.0 + npm 双发布：一个跑在 dsh（DeepSeek Harness）上的制品工厂，五个受限角色子代理被确定性步进，造出 dsh skill / plugin / preset，并把一份**机器裁定、可复验的验收证据**打进每一个出厂制品内部。执行器 [dsh-pipeline-executor](https://www.npmjs.com/package/dsh-pipeline-executor) 独立发在 npm 上，本项目是它的第一个 dogfood 消费者。

结论先行：

1. **每个非确定性都要一个机械保证，不要一条指令。** capability 等级由执行器盖章而不是让模型写对；跨会话台账污染由逐行 sha 校验 fail-close；工具结果深冻结就 clone-before-write。指令层的「请你保证……」在 deepseek-v4-pro 上被实测击穿过太多次，最后活下来的全是机械层。
2. **质量地板由门保证，所以换便宜模型是推论，不是赌博。** 三个机械阶段换 deepseek-v4-flash，单次提速 33–64%；敢换的全部理由是每一关的验收门在下面兜着——两轮 live 各抓住一类真缺陷，地板被证明真实存在。
3. **修复者不能审计自己的修复。** 独立修复审计（一个没写过这些修复的新鲜上下文）用**同一个提交里我自己修正过的证据**反驳了我的修复论证——「契约层拒绝 ≠ 机械保证」这个错，我在修它的当口又犯了一次。

## 1. 任务定义：为什么是工厂，不是又一个 skill

[上一篇](/blog/skill-spiral/)的终点是 skill-creator-max：从哲学知识库重新推导出的薄 conductor，人在环上判每一关——那是一条**人判传承线**。dsh-tool-creator 走的是另一条线：**机器判工厂线**。全程 headless，没有人在环上，每一关由可执行的验证器判 exit code，验收由对抗电池打，评级由装配器机械折算。两条线共享同一套哲学底座，分界只有一个问题：判断权在谁手里。

工厂线要成立，有一个市面上没人做的前提：**验收证据必须随制品出厂**。市面上的生成器（skill-creator 类）共同的缺陷不是生成质量，而是证据在打包时被丢掉——生成器自称验证过，但制品到手后没有任何人能复验这句话。dsh-tool-creator 的每个制品根部都躺着一份 `acceptance-manifest.json`：逐文件 sha256 + rootHash、模型与 dsh 版本钉死、verdict 折算规则、可重跑的 reverify 命令。拿到目录的人跑一条命令：

```
node tools/reverify.mjs <artifact-dir>
```

byte 完整性 + 制品自带的确定性 harness 当场重证。「verified on rc.6」从一句自述变成「re-verify on rc.7」的一次执行。

## 2. 架构：控制流不在模型手里

<figure class="vz">
<svg viewBox="0 0 680 252" role="img" aria-label="五角色流水线架构图：五个阶段各带验收门，下方是执行器与两份出厂证据">
  <rect class="bx" x="8" y="26" width="118" height="62" rx="4"/>
  <text x="67" y="46" text-anchor="middle" class="tb">composer</text>
  <text x="67" y="62" text-anchor="middle" class="t2">flash · 需求→SkillSpec</text>
  <text x="67" y="78" text-anchor="middle" class="t2">门 validate_spec</text>
  <line class="ar" x1="126" y1="57" x2="141" y2="57"/><polygon points="141,53 148,57 141,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="143" y="26" width="118" height="62" rx="4"/>
  <text x="202" y="46" text-anchor="middle" class="tb">guidance</text>
  <text x="202" y="62" text-anchor="middle" class="t2">flash · 结构契约</text>
  <text x="202" y="78" text-anchor="middle" class="t2">门 validate_structure</text>
  <line class="ar" x1="261" y1="57" x2="276" y2="57"/><polygon points="276,53 283,57 276,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="278" y="26" width="118" height="62" rx="4"/>
  <text x="337" y="46" text-anchor="middle" class="tb">engineer</text>
  <text x="337" y="62" text-anchor="middle" class="t2">pro · 实现+语料+harness</text>
  <text x="337" y="78" text-anchor="middle" class="t2">门 validate_report</text>
  <line class="ar" x1="396" y1="57" x2="411" y2="57"/><polygon points="411,53 418,57 411,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="413" y="26" width="118" height="62" rx="4"/>
  <text x="472" y="46" text-anchor="middle" class="tb">zipper</text>
  <text x="472" y="62" text-anchor="middle" class="t2">flash · 打包(仅 skill)</text>
  <text x="472" y="78" text-anchor="middle" class="t2">门 打包检查</text>
  <line class="ar" x1="531" y1="57" x2="546" y2="57"/><polygon points="546,53 553,57 546,61" fill="var(--vz-axis)"/>
  <rect class="bx" x="548" y="26" width="124" height="62" rx="4"/>
  <text x="610" y="46" text-anchor="middle" class="tb">battery</text>
  <text x="610" y="62" text-anchor="middle" class="t2">pro · 3 透镜对抗验收</text>
  <text x="610" y="78" text-anchor="middle" class="t2">门 validate_decision</text>
  <line class="ar" x1="340" y1="88" x2="340" y2="104"/><polygon points="336,104 340,111 344,104" fill="var(--vz-axis)"/>
  <rect class="bd" x="8" y="112" width="664" height="52" rx="4"/>
  <text x="340" y="132" text-anchor="middle" class="tb">dsh-pipeline-executor（独立 npm 包）</text>
  <text x="340" y="150" text-anchor="middle" class="t2">声明式 manifest · 受限子代理派发（persona + 工具白名单 + outputSchema）· 产物由执行器落盘 · execFile 门 · append-only 台账</text>
  <line class="ar" x1="170" y1="164" x2="170" y2="180"/><polygon points="166,180 170,187 174,180" fill="var(--vz-axis)"/>
  <line class="ar" x1="510" y1="164" x2="510" y2="180"/><polygon points="506,180 510,187 514,180" fill="var(--vz-axis)"/>
  <rect class="bx" x="8" y="188" width="324" height="52" rx="4"/>
  <text x="170" y="208" text-anchor="middle" class="tb">evidence-ledger.jsonl</text>
  <text x="170" y="226" text-anchor="middle" class="t2">每次尝试一行 · manifestSha256 逐行钉死 · 机器写入</text>
  <rect class="bx" x="348" y="188" width="324" height="52" rx="4"/>
  <text x="510" y="208" text-anchor="middle" class="tb">acceptance-manifest.json（随制品出厂）</text>
  <text x="510" y="226" text-anchor="middle" class="t2">逐文件 sha256 · verdict 折算 · reverify 一条命令复验</text>
</svg>
<figcaption>图 1 · 五角色流水线。控制流在声明式 manifest 里由执行器机械步进，模型零转写；每关一个可执行验收门，绿了进下一关，红了按宪章重试表最多三次，全绿才出厂。flash / pro 标注为 L7 之后的模型分层（§5）。</figcaption>
</figure>

几个设计决定值得单独说：

- **产物由执行器落盘，不由模型转写。** 角色子代理的返回是结构化对象（outputSchema 钉死），写文件的是执行器。上上篇写过 v4-pro 字节转写实测 5/6 不可信——那就不让它转写。
- **角色包作为 persona 派发，不作为 prompt 拼接。** 上一篇 B15 案例的根因（role-pack 稀释）在这里从结构上消失。
- **台账机器写入、逐行钉 manifest sha。** 有一次我在跑到一半时装了新版本 preset，台账立刻出现两个 manifestSha256，装配器整跑拒绝——被自己的机械保证抓获的感觉相当微妙，但这正是它存在的意义：**「绝不中途安装」从纪律变成了被强制执行的事实**。
- **验收电池是流水线的一等公民**，三个透镜（coherence / gaming / reality）各自独立打制品，synthesis 汇总写 decision record，装配器从**磁盘上的透镜产物**机械计数——verdict 说了不算，findings 才算。

## 3. 三天时间线与 live 战绩

- **08-17**：深夜自主调研（dsh 源码深读 + v4-pro 行为学），定五个结构性决定；L0 脚手架 + L1 执行器（先跑可行性 spike，把受限派发的每个接缝实测一遍再写代码）。
- **08-18**：L2 conductor 宪章（准入门 / 重试表 / 停机语义）+ L3 三个 target 的建造手册（plugin 六条 boot 不变量、preset 八条挂载守则，全部是真机踩雷换来的）+ L4 acceptance-manifest 标准与零依赖 reverify。
- **08-18/19**：L5 三 target live 矩阵——skill / preset / plugin 全部拿到绿 manifest，外加一次故障注入实测（zipper 门被种死 → conductor 三次重试后诚实报 `stopped_unmet`，绝不放水）。上一篇输掉的 B15 头对头，这次 2 胜 1 平 1 微负，「不再输」达成。
- **08-19**：L6 攻击轮 + 发布（§4）；L7 flash 分层两轮实测（§5）。

离线测试面收在 187 项：61 个验证器 selftest 陷阱（每个陷阱是一类伪造，全部必须被抓住）+ 126 个 node 用例。CI 全离线零依赖，14 秒跑完。

## 4. 攻击轮：对自己动手

发布前，五个独立攻击透镜 + 交叉综合对全套系统做对抗验收——SEED 门保证攻击者不瞎（每个透镜带一个已知缺陷，没抓到就整轮作废）。抓获 1 P1 + 6 P2，P1 是真家伙：

> 验收装配器的地板是单向的——它拒绝「报了 breaches 却零 findings」，但**不拒绝「报 clean 而磁盘上躺着 P1/P2 findings」**。而 clean 恰是唯一解锁 industrial 顶级评级的 verdict：一个偷懒的 synthesis 能给说谎的制品盖出最高章。

修复是 repro-first 的：先造一个说谎的 manifest 证明它现在能过（能过），再加反向地板（磁盘上有 P1/P2 强制 breaches_found），证明它现在被拒（被拒），全程留痕。攻击台账先于修复提交进 git——防的是修复者顺手删发现。

真正的心路低谷在下一步。攻击者纪律要求**修复审计轮换**：一个没写过这些修复的新鲜上下文，重新五透镜打修复 diff。它的头号发现是：我在修复论证里写「synthesis 子代理 toolFilter 只读，物理上不能篡改透镜产物」——**错**。宿主侧的 subagent 门是开着的，只读子代理仍能派生不受限 helper 去改文件，而证明这一点的证据，就躺在**同一个提交里我自己修正过的 T-D2 数据**里。同一类错误（把契约层拒绝当机械保证），在修正它的提交里复发，被独立审计当场抓获。修复者不能审计自己的修复——这句话从纪律变成了亲身经历。

修不掉的不藏：空壳透镜的假阴性（验收电池全员不作为时，零 findings 的 clean 无法被计数抓住）写进每份出厂 manifest 的 limits[]，真解（机械 SEED 门）排进 v0.2。**修机械可修的，披露修不掉的**——这是整个项目的发布姿态。

## 5. L7：便宜模型是门地板的推论

L5 实测单跑 62.4 分钟，两根长杆是 engineer（26.5，真实现+30 组语料，不能动——B15 的胜利就是从语料深度来的）和 battery（17.8，刚按预算砍过 47%，再砍就伤攻击面）。剩下的杠杆只有一个：三个机械阶段换 deepseek-v4-flash，**敢换的理由是每关的门在下面兜着**。

<figure class="vz">
<svg viewBox="0 0 680 264" role="img" aria-label="五阶段耗时三跑对比柱状图：基线、V1 含重试、V2 全首过">
  <rect x="180" y="6" width="12" height="12" fill="var(--vz-s1)"/><text x="197" y="16">基线(R3, 全 pro)</text>
  <rect x="316" y="6" width="12" height="12" fill="var(--vz-s2)"/><text x="333" y="16">V1 含重试</text>
  <rect x="424" y="6" width="12" height="12" fill="var(--vz-s3)"/><text x="441" y="16">V2 全首过</text>
  <line x1="46" y1="150" x2="668" y2="150" stroke="var(--vz-grid)"/>
  <line x1="46" y1="90" x2="668" y2="90" stroke="var(--vz-grid)"/>
  <line x1="46" y1="30" x2="668" y2="30" stroke="var(--vz-grid)"/>
  <text x="40" y="153" text-anchor="end" class="t2">10</text>
  <text x="40" y="93" text-anchor="end" class="t2">20</text>
  <text x="40" y="33" text-anchor="end" class="t2">30</text>
  <line x1="46" y1="210" x2="668" y2="210" stroke="var(--vz-axis)"/>
  <rect x="61" y="158.4" width="32" height="51.6" fill="var(--vz-s1)"><title>composer 基线 8.6 分</title></rect>
  <rect x="99" y="152.4" width="32" height="57.6" fill="var(--vz-s2)"><title>composer V1 9.6 分（含 a1 ROLE_NO_OUTPUT 重试；绿次 5.8）</title></rect>
  <rect x="137" y="181.8" width="32" height="28.2" fill="var(--vz-s3)"><title>composer V2 4.7 分（40960 预算下首过）</title></rect>
  <rect x="183" y="153" width="32" height="57" fill="var(--vz-s1)"><title>guidance 基线 9.5 分</title></rect>
  <rect x="221" y="172.8" width="32" height="37.2" fill="var(--vz-s2)"><title>guidance V1 6.2 分（首过）</title></rect>
  <rect x="259" y="166.2" width="32" height="43.8" fill="var(--vz-s3)"><title>guidance V2 7.3 分（首过）</title></rect>
  <rect x="305" y="51" width="32" height="159" fill="var(--vz-s1)"><title>engineer 基线 26.5 分（pro）</title></rect>
  <rect x="343" y="82.8" width="32" height="127.2" fill="var(--vz-s2)"><title>engineer V1 21.2 分（pro，快侧方差）</title></rect>
  <rect x="381" y="28.8" width="32" height="181.2" fill="var(--vz-s3)"><title>engineer V2 30.2 分（pro，慢侧方差）</title></rect>
  <rect x="427" y="168.6" width="32" height="41.4" fill="var(--vz-s1)"><title>zipper 基线 6.9 分（r1c，当时实为 pro）</title></rect>
  <rect x="465" y="157.8" width="32" height="52.2" fill="var(--vz-s2)"><title>zipper V1 8.7 分（含 a1 ROLE_NO_OUTPUT 重试；绿次 2.5）</title></rect>
  <rect x="503" y="193.8" width="32" height="16.2" fill="var(--vz-s3)"><title>zipper V2 2.7 分（49152 预算下首过）</title></rect>
  <rect x="549" y="103.2" width="32" height="106.8" fill="var(--vz-s1)"><title>battery 基线 17.8 分（pro）</title></rect>
  <rect x="587" y="115.2" width="32" height="94.8" fill="var(--vz-s2)"><title>battery V1 15.8 分</title></rect>
  <rect x="625" y="126.6" width="32" height="83.4" fill="var(--vz-s3)"><title>battery V2 13.9 分</title></rect>
  <text x="115" y="228" text-anchor="middle" class="t2">composer</text>
  <text x="115" y="242" text-anchor="middle" class="t2">flash</text>
  <text x="237" y="228" text-anchor="middle" class="t2">guidance</text>
  <text x="237" y="242" text-anchor="middle" class="t2">flash</text>
  <text x="359" y="228" text-anchor="middle" class="t2">engineer</text>
  <text x="359" y="242" text-anchor="middle" class="t2">pro</text>
  <text x="481" y="228" text-anchor="middle" class="t2">zipper</text>
  <text x="481" y="242" text-anchor="middle" class="t2">flash</text>
  <text x="603" y="228" text-anchor="middle" class="t2">battery</text>
  <text x="603" y="242" text-anchor="middle" class="t2">pro</text>
</svg>
<figcaption>图 2 · 同题（csv-md-table skill，请求字节级相同）三跑分阶段耗时，纵轴分钟。合计：基线 62.4 → V1 62.0 → V2 <b>59.69</b>。flash 绿次提速 composer −33% / guidance −35% / zipper −64%；V1 的两次重试（+10.0 分）恰好吃掉全部提速，V2 消灭重试后 sub-60，但 0.3 分的余量小于 engineer 的同模型方差（跨跑 21.2 / 26.5 / 30.2）——诚实表述是「典型 sub-60，非保证」。</figcaption>
</figure>

V1 判 partial 之后的尸检（会话日志逐帧）把死因定得很干净：两次 `ROLE_NO_OUTPUT` 都是 **reasoning 膨胀撞 maxTokens**——flash 在部署级 `reasoningEffort=high`（不可按派发下调，接缝层实测确认）下，推理量远超为 pro 调的预算。composer 死于 24576（1.8 万 token 是 reasoning，结构化输出已开流 22 个 delta 被掐断）；zipper 死于 32768（**百分之百是 reasoning**，自检循环，输出从未开始）；而 guidance 在 40960 下两轮全首过。三个阶段把故障夹出一个干净的区间：24576 死、32768 死、40960 过。修复是纯 manifest 预算头寸（cap 是上限不是支出，空余不计费），V2 实证 0/4 死亡。

两个附赠发现比主线还有味道：

- **死配置**：排查时发现 zipper 的 role 块里躺着一对 `provider/model: flash` 键——更早的优化轮配的，但执行器只读 stage 级配置，**这对键从未生效过**，此前所有跑的 zipper 一直是 pro。杠杆只在执行器**读取的位置**才是真的，验证配置生效的唯一凭据是运行时台账里的 roleModel。
- **门地板的实证**：V2 的 engineer（pro，跑间方差）把触发电池做成了形状检查没实跑，battery 的 gaming 与 reality 透镜**各自独立**把它定为 P1，verdict 压到 candidate——真实质量回归被抓住、计数、写进出厂评级，而不是溜出厂。换便宜模型敢，是因为验收从不依赖模型自觉；这个论断在两轮 live 里各兑现了一次。

## 6. 复盘：嘱托与保证

上一篇的判据是「说不清谁在判、凭什么判、失手了谁兜底的概念只是嘱托」。这个项目把同一句话推到执行层：

> 如果一条约束只存在于 prompt 里——它是嘱托。嘱托在足够多的采样下必然被击穿。
>
> 如果一条约束被击穿时有机械层当场拒绝——它才是保证。工厂能 headless 运转的全部前提，是把每条 load-bearing 的约束从前者搬到后者。

搬不动的怎么办？**披露**。机器判工厂线和人判传承线的真正差别不在质量，在于工厂必须把「谁裁定的、什么没裁定、veto 在不在场」原原本本写进出厂证据——因为没有人在场替它背书。出厂 manifest 的 limits[] 里躺着机器自裁定声明、空壳透镜残余、独立性边界（全程同族模型互攻，跨厂商盲区结构性不可见）——这些不是免责声明，是这条产品线的定义的一部分。

三天，约 ¥110–120 API 消耗，10 个 live 运行工作区，一个 P1 教训，一次被独立审计反驳的羞辱，两轮 flash 实测。仓库在 [github.com/VincentJiang06/dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator)（含攻击台账、差异电池、L7 实测的全部证据文档），执行器在 [npm](https://www.npmjs.com/package/dsh-pipeline-executor)。下一个高地已经排好：机械 SEED 门，把「验收电池自己不作为」也从嘱托搬进保证。
