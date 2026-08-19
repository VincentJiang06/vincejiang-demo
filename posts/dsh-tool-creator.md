---
title: "造工具的工厂：验收证据随制品出厂"
description: "dsh-tool-creator 的机制级拆解：受限子代理派发的接缝解剖（八条实测偏差）、三层哈希证据链与一次自我逮捕、verdict 折算代数与被攻击轮击穿的单向地板、六条 boot 不变量、机器记录为什么天生 O-L3，以及 flash 分层的一次夹逼实验。三天开发，全部主张可溯源至台账与会话日志。"
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

[上上篇](/blog/fable-scaling-layering/)写模型和 harness，[上一篇](/blog/skill-spiral/)写夹在中间的 skill。这一篇写第三层：**造 skill 的工厂**。对象是 [dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator)——2026-08-17 至 08-19 三天造出来的 dsh（DeepSeek Harness）制品工厂：五个受限角色子代理被确定性步进，产出 dsh skill / plugin / preset，每个出厂制品内部打着一份**机器裁定、可复验的验收证据**。执行器 [dsh-pipeline-executor](https://www.npmjs.com/package/dsh-pipeline-executor) 独立发在 npm。这篇不是新闻稿，是机制拆解：每一节讲一个子系统的工作原理、它防的那类具体伪造、以及它被真机击穿过的地方。

结论先行：

1. **多代理流水线的可信度上限，取决于有多少约束住在机械层而不是 prompt 里。** 本文逐个接缝清点：哪些是宿主强制的（toolFilter 白名单、outputSchema 校验、产物落盘权）、哪些只是嘱托（helper 派生、SEED 纪律）、错把后者当前者会发生什么——发生了，两次，其中一次在修复它的提交里。
2. **证据不可伪造不是一句口号，是一条三层哈希链 + 一个折算代数 + 三处独立重算。** 链上每个哈希防一类具体的作弊；链的一个已知时序缺口不修而是披露——因为它机械上不可修，谎称修了才是真缺口。
3. **便宜模型上桌的前提是验收不依赖模型自觉。** flash 分层是一次夹逼实验：三个阶段三个预算,把故障死因框进一个 16K token 的区间；修复后两个此前必死的派发全部首过——而同一轮里 pro 阶段偷懒被电池当场抓获压级。地板对谁都生效。

## 1. 问题定义：green-but-wrong 与证据的信任链

所有生成器类工具（skill-creator 及其同类）共享一个结构性缺陷，且与生成质量无关：**验证发生在工厂里，证据死在打包时**。生成器说"我验证过了"，这句话的信任链只有一环——生成器自己。制品到手的人无法复验，目录收录方无法复验，三个月后宿主升了版本更无法复验。这在 eval 工程里有个专名：green-but-wrong——绿灯照常亮，命题早已失效，而且没人能发现，因为验证的原始凭据根本没随制品走。

dsh-tool-creator 把优化目标从"生成得更好"换成"**让验收证据的信任链延伸到制品的整个生命周期**"。具体地，每个制品根部有一份 `acceptance-manifest.json`（结构见 §3），拿到目录的人跑：

```
node tools/reverify.mjs <artifact-dir>
```

reverify 是零依赖的（node ≥20，无 npm install），跑三段 fail-closed 检查：**shape**（schema + 语义规则 + verdict 折算重算）→ **bytes**（逐文件重哈希、盘上多出的文件即篡改、symlink 非法、rootHash 重算）→ **commands**（`execFile` 逐条跑制品自带的确定性 harness，比对 exit code，跑完把整棵树**再哈希一遍**证明命令无副作用）。顺序本身是安全设计：哈希不绿，命令一条不跑——**永不执行未验证的字节**。

这套东西为什么需要一个"工厂"而不是一个 skill 来产出？因为证据的每一环都要求生成过程本身是可审计的：谁写的文件、哪次尝试、哪个模型、门判了什么——这些字段没法事后补写，只能在生成时由一个**不经过模型转写**的机械层记录。控制流必须住在模型外面。

## 2. 执行器：受限派发的接缝解剖

执行器的核心是一次 `subagents.start` 调用。全部约束力来自这个调用的五个参数，每个参数的实际语义都在动工前用一个可行性 spike 逐条实测过（fakes 不算数，只认真机宿主）：

```js
subagents.start('spawn', {
  prompt:  [{ type: 'text', text: dispatchLine }],   // 短派发行,不携带任何产物内容
  persona: rolePackText,                             // 角色包全文作为 persona,不拼进 prompt
  toolFilter: { allow: ['read'] },                   // 白名单,宿主侧强制
  agentOptions: { provider, model, maxTokens },      // 模型按 stage 钉死
  outputSchema: schema,                              // 结构化返回,宿主校验
  signal, parent,                                    // 必传:in-process driver 进门就解引用
})
```

spike 落了十条"实现法"，捡最有分量的几条：

- **`toolFilter.restrict()` 对未知工具名直接 throw**，白名单是宿主强制的——这是真机械。但它**只遮蔽继承的工具**：宿主给每个子会话注入的 own-scope `subagent` 工具不在遮蔽范围内。翻译成安全语言：**tool-surface 级的约束是机械的，delegation 级的约束不是**——一个 `allow:['read']` 的只读子代理，仍然可以派生一个继承全局完整工具面（含 write/bash）的 helper。这个门在宿主侧，插件关不掉。项目的处理是三层：prompt 禁令（嘱托层）、battery 的会话日志审计（检测层，§4 会讲它的盲区）、以及在一切证据文档里如实降级表述（披露层）。
- **结构化返回的运行以空文本收尾**：子代理调用 `structured_output` 工具后,`run.result` 的正文是空的,产物在结构块里。这决定了一个关键设计——**产物由执行器从结构块落盘,模型从头到尾没有转写文件的机会**。上上篇实测过 v4-pro 的字节转写 5/6 不可信；这里的答案不是"提醒它小心"，是取消它的转写岗位。
- **outputSchema 只认一个关键字子集**（`type/oneOf/properties/required/additionalProperties/items/enum/const` + 注解），顶层带 `$schema` 直接被宿主拒。这条是 live 首跑撞出来的——离线 fake 全绿。
- **`reasoningEffort` 不可按派发钉**，来自部署级默认。记住这条，§7 的两具尸体都是它埋的。
- **persona 是叠加的**：harness 身份 + 工具指引仍会垫在角色包底下。角色包必须假设自己不是唯一的声音。

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
<figcaption>图 1 · 五角色流水线。控制流在声明式 manifest 里由执行器步进，模型零转写；每关一个可执行验收门（`execFile` argv,无 shell,无插值）,绿了进下一关,红了按宪章重试表最多三次,第三次仍红则整跑以 `stopped_unmet` 停机——绝不为凑一个 done 放宽任何门。flash / pro 是 L7 之后的模型分层（§7）。</figcaption>
</figure>

宪章（conductor 的 persona）里只有控制律,没有产物知识：准入门（spec 不齐立刻以 `stopped_needs_spec` 拒收,几分钟内退回,绝不让一个含糊的需求消耗一小时流水线）、目标路由（plugin/preset 关键词命中否则 skill）、重试表（attempt 1→2→3 → STOP,唯一分支依据是 gateExit）、七类错误码的处置、以及格式错误工具调用的自拦截。conductor 被刻意做笨——所有聪明都被没收,存进可校验的验证器里。

## 3. 证据链：三层哈希与一次自我逮捕

台账是执行器写的 JSONL,每次 stage 尝试落一行,长这样（字段为真实 shape）：

```json
{"ts":"2026-08-19T13:39:xx Z","pipeline":"tool-creator",
 "manifestSha256":"<pipeline.manifest.json 的 sha256>",
 "stage":"composer","attempt":1,"childSessionIds":["c3363b15…"],
 "gateExit":0,"roleModel":"deepseek-v4-flash","tokens":42581,"error":null}
```

注意 `manifestSha256`：它钉的是**流水线控制流文件本身**。这一个字段配一条装配器规则——"台账里出现 ≥2 个不同 manifestSha256 ⇒ 整跑拒绝"——构成了一个我本人亲测有效的陷阱：某次跑到一半,我顺手装了新版 preset,下一行台账的 sha 变了,装配器当场拒绝整跑的证据。**"绝不中途安装"从一条纪律变成一个被强制执行的事实**,而且抓的是作者本人。机械保证的意思就是它不认人。

<figure class="vz">
<svg viewBox="0 0 680 246" role="img" aria-label="三层哈希证据链：流水线 manifest 逐行钉进台账，台账整本哈希与制品文件树哈希进验收 manifest">
  <rect class="bx" x="8" y="18" width="212" height="56" rx="4"/>
  <text x="114" y="38" text-anchor="middle" class="tb">pipeline.manifest.json</text>
  <text x="114" y="54" text-anchor="middle" class="t2">声明式控制流 · sha256 = M</text>
  <rect class="bx" x="460" y="18" width="212" height="56" rx="4"/>
  <text x="566" y="38" text-anchor="middle" class="tb">制品文件树</text>
  <text x="566" y="54" text-anchor="middle" class="t2">逐文件 sha256 → rootHash</text>
  <line class="ar" x1="114" y1="74" x2="114" y2="106"/><polygon points="110,106 114,113 118,106" fill="var(--vz-axis)"/>
  <text x="124" y="96" class="t2">每次尝试落一行，行内钉 M</text>
  <line class="ar" x1="566" y1="74" x2="566" y2="106"/><polygon points="562,106 566,113 570,106" fill="var(--vz-axis)"/>
  <text x="380" y="96" class="t2">shasum -a 256 行格式,可用 coreutils 复核</text>
  <rect class="bx" x="8" y="114" width="300" height="72" rx="4"/>
  <text x="158" y="134" text-anchor="middle" class="tb">evidence-ledger.jsonl（append-only）</text>
  <text x="158" y="150" text-anchor="middle" class="t2">{stage, attempt, gateExit, roleModel,</text>
  <text x="158" y="164" text-anchor="middle" class="t2">manifestSha256: M, childSessionIds, tokens}</text>
  <text x="158" y="180" text-anchor="middle" class="t2">≥2 个不同 M ⇒ 装配器拒绝整跑</text>
  <line class="ar" x1="308" y1="150" x2="336" y2="150"/><polygon points="336,146 343,150 336,154" fill="var(--vz-axis)"/>
  <text x="326" y="140" class="t2">整本 sha</text>
  <rect class="bx" x="346" y="114" width="326" height="72" rx="4"/>
  <text x="509" y="134" text-anchor="middle" class="tb">acceptance-manifest.json</text>
  <text x="509" y="150" text-anchor="middle" class="t2">artifact.files + rootHash ← 文件树</text>
  <text x="509" y="164" text-anchor="middle" class="t2">evidenceLedgerSha256 ← 台账 · pipelineVersion = manifest:M</text>
  <text x="509" y="180" text-anchor="middle" class="t2">verdicts = min-fold 重算 · limits[] 披露</text>
  <text x="340" y="216" text-anchor="middle" class="t2">已知时序缺口（披露而非掩盖）：装配发生在 battery 门内，battery 自己的台账行在装配之后才落——</text>
  <text x="340" y="232" text-anchor="middle" class="t2">evidenceLedgerSha256 覆盖除装配尝试自身外的所有行；这条限制原文写进每份出厂 manifest 的 limits[]</text>
</svg>
<figcaption>图 2 · 三层哈希链。每个哈希防一类具体作弊：逐行 M 防「中途换控制流」，rootHash 防「篡改/夹带文件」（盘上多一个未列文件即判篡改，symlink 非法），evidenceLedgerSha256 防「事后改台账」。reverify 三段 fail-closed 消费这条链：shape → bytes → commands，哈希不绿不执行任何命令,命令跑完整树再哈希一遍证明无副作用。</figcaption>
</figure>

rootHash 的算法刻意选得土：把 `files` 里的路径按 UTF-8 字节序排序,每行 `<sha256>␣␣<path>`,`\n` 连接、结尾换行,对这段文本取 sha256——**正是 `shasum -a 256` 的输出格式**,所以第三方用 coreutils 就能独立复核,不需要信任 reverify 本身。信任链的最后一环留给了操作系统发行版。

## 4. verdict 代数、单向地板，与用我自己的证据反驳我

评级折算是一段小代数,三个值域一个偏序：`draft < candidate < industrial`。battery 的 verdict 先映射成一个上限：

```python
def battery_cap(battery_verdict):
    return "industrial" if battery_verdict == "clean" else "candidate"
    # breaches_found / not_run 都封顶 candidate

def min_fold(re_audit, battery):
    return min(re_audit, battery_cap(battery), key=VERDICT_ORDER.get)
```

`effective = min(re_audit, cap(battery))`。这个 fold 在**三处独立重算**：battery 门的 `validate_decision`（写入侧,synthesis 敢写一个高于折算的 effective 当场被拒——r1c 真实发生过,synthesis 低报成 draft 被门打回重试）、装配器（组装侧）、reverify（消费侧,manifest 里写的 effective 高于重算值即判伪造）。三处共用同一段算术,任何一处被绕过还有两处。

攻击轮（五个独立透镜 + SEED 门 + 交叉综合,发现先于修复提交进 git 防止修复者顺手删发现）在这段代数里抓到了整个项目唯一的 P1：

> 地板是单向的。装配器拒绝「`breaches_found` 而计数为零」（无 findings 的 breaches 是被压制的证据）,但**不拒绝「`clean` 而磁盘上躺着 P1/P2 findings」**。而 `clean` 恰是唯一把上限抬到 `industrial` 的 verdict——一个偷懒或作弊的 synthesis,把 verdict 一改,说谎的制品就顶着最高评级出厂,三处 fold 重算全部照绿,因为 fold 只检查 effective 与 verdict 的一致性,不检查 **verdict 与证据**的一致性。

修复是 repro-first：先构造说谎 manifest（`clean` + 磁盘上真 P1）证明现行代码放行,再补反向地板——**磁盘上计到 P1/P2 就强制 `breaches_found`**,同一个说谎 manifest 现在被拒,两次运行都留痕。两个设计细节值得写出来：其一,反向地板容忍 P3——`clean` 允许携带已披露的 P3 minor（计数原样进 manifest 的 `batteryFindingsCounts`）,因为把「有小瑕疵」和「有breach」折进同一个标签,只会教会上游把 P3 也藏起来；其二,计数的数据源是**磁盘上的透镜产物文件**,而这些文件是执行器从透镜的结构块落盘的,synthesis 的 toolFilter 是 `['read']`——它改不了自己被计数的证据。

至少,我当时是这么论证的。攻击者纪律要求**修复审计轮换**：一个没写过这些修复的新鲜上下文,重打修复 diff。它的头号发现让我坐了很久：

> 「synthesis 只读,物理上改不了透镜产物」——错。宿主 own-scope `subagent` 门不受 toolFilter 遮蔽（§2 第一条）,只读子代理可以派生一个**不受限** helper 去改文件。证据不用现找：**同一个提交里,你自己刚把 T-D2 的证据修正为"r1c 的 synthesis 子会话确实派生过 helper"**。

同一类错误——把嘱托当保证——在修复它的提交里复发,被独立审计用我自己修正过的数据反驳。这不是流程演习,是「修复者不能审计自己的修复」的一次亲身兑现。修正后的表述降了一级：反向地板守的是 **synthesis 的改口**（verdict 与证据不一致）,不守**证据文件本身的完整性**（那需要机械 SEED 门 + 关掉 subagent 门,排进 v0.2）；这个残余连同「空壳透镜假阴性」（电池全员不作为时,零 findings 的 clean 无法被计数抓住）一起,原文写进每份出厂 manifest 的 `limits[]`。**修机械可修的,披露修不掉的**——所谓诚实边界,就是把这句话执行到字段级。

顺带一提,decision record 本身也有 schema 级的反敷衍设计：每个门裁决必须是完整决策对象（问题、证据指针、考虑过的选项、**被拒绝的选项及其理由**——空 rejected 列表被视作未思考信号）,裁决人字段只有 `human | machine` 两个值,骗不出第三种含糊。

## 5. 六条 boot 不变量：fakes 全绿、真机爆雷的完整类目

plugin 目标的建造手册里沉淀了六条不变量,每一条都是「离线测试全绿、真宿主 boot 即崩」的实付学费。列全,因为这类知识只有清单形态才有复用价值：

1. **`Config` 必须是 Standard-Schema 对象**,普通对象宿主拒载;
2. **`lib/index.js` 里 import 的每个 `@deepseek-ai/*` 包必须出现在 `peerDependencies`**——漏一个,装的时候好好的,boot 时模块解析直接炸;
3. **每个工具的 OBJECT schema 必须显式写 `additionalProperties`**,缺省不是宽松是拒载;
4. **`@deepseek-ai/*` 绝不进 `dependencies`,「可选」依赖走条件 import**——否则宿主里出现同一包的第二实例,轻则工具全挂重则 boot 崩(这一条在另一个项目里造成过全部工具下线的事故);
5. **宿主会校验工具 execute 的返回值 against 声明的 output schema**——返回里多塞一个未声明字段,live 被拒,而离线 fake 根本不校验返回方向;
6. **宿主发回的工具结果是深冻结的,就地改写直接 TypeError**——必须 `structuredClone` 后再动。这条的发现路径最典型:capability 盖章功能 0.1.6 在全部 111 个离线用例下全绿,首次真机跑崩,因为 fakes 冻结行为与真宿主不一致;修复(clone-before-write)带着一个冻结输入回归用例进了套件,该用例经 mutation 验证——把修复改回去,用例必红。

这六条的元教训比条目本身值钱：**E-L4 类（宿主组合行为）不存在离线证明,只有 live 证明**。所以工厂给每个制品出厂的证据里,E-L4 若未实测就必须以 `not_run` 落进 limits——绿灯没亮过的层,连"绿"字都不许写。

## 6. 机器记录为什么天生 O-L3

治理字段 `capability_level` 走 O-L0（每关人判）到 O-L4（全自动+人抽查）的阶梯,教义是"从 O-L0 出厂,凭证据升级"。工厂线在这里撞上一个干净的死锁：headless 全机器记录里,每个门的 adjudicator 都是 `machine`,而校验器的机器工厂不变量**拒绝** O-L0/L1/L2（那三级都要求人在环上）——于是"从 O-L0 出厂"对这条流水线是**非法值**。R2 那次跑,模型老实写了 O-L0,被门拒,按表重试三轮,最后诚实 `stopped_unmet`——死锁的每一步都符合规则,合起来永不停机产出。

裁决:O-L3 对机器工厂不是"挣来的等级",是**结构下限**——校验器能容忍的最低值,由执行器**机械盖章**成常量,不再让模型写(模型写,就会有 R2 与 R3 各写各的非确定性)。同时把语义修正为诚实版:O-L3 读作"机器自裁定;人的否决权保留但在 headless 运行中从未行使"——**否决权是一条披露出来的限制,不是一张安全网**,因为运行中根本没有人。这条修正传播到了教义文档、schema 描述、和每份出厂 manifest 的 limits[](一条由装配器从门裁决人字段**推导**出来的机器自裁定披露——selftest 里有一个带人判门的 fixture 证明它会被正确抑制,防止披露本身沦为硬编码装饰)。

治理字段的通则:**无人在场时,治理字段的每个值都必须要么被机械强制,要么被机械披露**。既不强制也不披露的治理字段,就是 fig leaf。

## 7. L7：一次夹逼实验

L5 实测整跑 62.4 分钟:composer 8.6 + guidance 9.5 + engineer 26.5 + zipper（skill 目标才跑）+ battery 17.8。两根长杆不能动——engineer 的 26.5 分钟买的是真实现加 30 组带 golden 对的语料（B15 头对头从全败翻到 2胜1平1微负,赢的就是语料深度）,battery 刚按预算砍过 47%,再砍伤攻击面。可动的只剩三个机械阶段的模型档位,而敢动的全部理由在 §1-§4 已经铺好:**这三个阶段的输出全部经过可执行验收门,质量下限由门保证,不由模型自觉保证**。

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
<figcaption>图 3 · 同题（csv-md-table skill,请求字节级相同）三跑分阶段耗时,纵轴分钟。合计:基线 62.4 → V1 62.0 → V2 <b>59.69</b>。flash 绿次提速 composer −33% / guidance −35% / zipper −64%;V1 两次重试（+10.0 分）恰好吃掉全部提速;V2 消灭重试后 sub-60,但 0.3 分的余量小于 engineer 同模型方差（跨跑 21.2 / 26.5 / 30.2）——诚实表述是「典型 sub-60,非保证;剩余方差在 pro 阶段,与 flash 无关」。</figcaption>
</figure>

V1 判 partial:总 62.0 分 ≈ 基线,flash 四次派发死了两次,`ROLE_NO_OUTPUT`。这里是全文技术密度最高的一段——**尸检**。把两具尸体的子会话日志逐帧解开:

- **composer a1**（maxTokens 24576）:调了 10 次 `read`、1 次 `bash`,写了 1.2KB 的正文前导,然后开始流式输出 `structured_output` 调用——**流到第 22 个 tool-call delta 时被掐断**。终帧:`outputTokens 24576 == cap`,其中 reasoning 18,243;`turn/end {"kind":"max-tokens"}`。离产出只差几百 token。
- **zipper a1**（maxTokens 32768）:调了 18 次 `read`、1 次 `bash`,然后终帧 **32,768 / 32,768 全部是 reasoning**——一个自我核对循环（日志尾部:「…occurrences: none. Wait — …」）,正文与工具调用一个字节都没开始。

死因定性:**reasoning 膨胀撞 maxTokens**。flash 在部署级 `reasoningEffort=high`（§2:不可按派发下调）下,同样的任务比 pro 多产出数倍推理 token,而预算是按 pro 的行为调的。三个 flash 阶段恰好构成一次现成的夹逼:**24576 死、32768 死、40960 过**（guidance 两轮全首过）。修复因此不需要猜:composer 提到 40960（已证充足值）,zipper 提到 49152;cap 是上限不是支出,空余不计费。V2:四次 flash 派发**零死亡,五关全首过**,此前必死的两个派发分别 4.7 分、2.7 分过关。

比主线更有味道的是两个副产物:

- **死配置考古**。排查时发现 zipper 的 role 块里躺着一对 `provider/model: flash` 键——更早的优化轮写的。但执行器读模型只认 stage 级(`stage.model ?? defaults.model`),role 级这两个键**从未被读过**,也就是说此前所有跑的 zipper 一直是 pro,包括那条被我当作"flash 基线"引用过的 6.9 分。修正方式不是相信任何文档,是对账运行时台账的 `roleModel` 字段——**配置是否生效,唯一凭据是执行器读取路径上的运行时记录**。
- **门地板的双向实证**。V2 的 engineer(pro,跑间方差)把触发电池做成了形状检查:31 个用例全部 `live_run:false`、`observed:null`,没有像上一跑那样实际执行确定性激活代理。battery 的 gaming 与 reality 两个透镜**互不知情地**各自把这一点定为 P1,verdict `breaches_found`,effective 压到 `candidate`——真实的质量回归被抓住、计数、写进出厂评级。同一轮实验里,flash 的故障被门拦下重试,pro 的偷懒被电池压级:**地板不挑模型**。这就是"便宜模型是推论不是赌博"的完整证明结构。

## 8. 复盘：嘱托与保证

上一篇的判据是「说不清谁在判、凭什么判、失手了谁兜底的概念只是嘱托」。这个项目把它推进到执行层,并且被同一句话打脸过一次(§4)。留三条判据,每条都能对着任意一个多代理系统逐项检查:

> **约束住在哪一层？** 只在 prompt 里 = 嘱托,足够多采样必被击穿;击穿时有机械层当场拒绝 = 保证。headless 系统的可信度 = 保证清单的覆盖率,与 prompt 写得多恳切无关。
>
> **证据能走多远？** 验证发生时的凭据若不随制品走,「验证过」三个字的信任链只有一环。逐文件哈希 + 台账哈希 + 折算重算,信任链才延伸到任何一个拿到目录的人。
>
> **修不掉的说了没有？** 机械上修不掉的残余(宿主开着的门、同族模型的盲区、时序缺口)写没写进出厂证据?没写的那部分,才是系统真正的上限。

三天,约 ¥110–120 API 消耗,10 个 live 工作区,61 个 selftest 陷阱 + 126 个 node 用例,1 个 P1,一次被独立审计用我自己的证据反驳。仓库在 [github.com/VincentJiang06/dsh-tool-creator](https://github.com/VincentJiang06/dsh-tool-creator)(攻击台账、差异电池、L7 实测全部在 docs/evidence/),执行器在 [npm](https://www.npmjs.com/package/dsh-pipeline-executor)。下一个高地排好了:机械 SEED 门——把「验收电池自己不作为」也从嘱托搬进保证。
