---
title: 工业级 Agent Skills —— 给 Claude Code / Codex 的 16 个技能
description: 给 Claude Code、Codex 和其他 agent runtime 用的工业级 agent skills：每个都自带确定性校验器 + 红绿 eval + 独立测试组。16 个正式技能之外，文末另有 stupidskills 附录，不计入总数。
tags: [agent, claude-code, skills]
date: 2026-07-03
updated: 2026-08-02
---

> 这篇是 [github.com/VincentJiang06/skills](https://github.com/VincentJiang06/skills) 的说明页，原 `/skills` 页面已并入此文。正式计数仍为 **16 个 skill**；文末的 **stupidskills** 是实验/旁路工具，不计入总数。

给 Claude Code / Codex / 其他 agent runtime 用的一套 **agent skills**——每个正式 skill 都自带**确定性校验器** + **红绿 eval** + 一个专门想把它弄坏的**独立测试组**。小而专、范围锋利、中英双语。仓库直链：[github.com/VincentJiang06/skills](https://github.com/VincentJiang06/skills)。

一行装好（用 skills CLI，自动发现并装入 `~/.claude/skills/`）：

```bash
npx skills add VincentJiang06/skills
```

16 个正式 skill，几乎全部由仓库自带的流水线 + 循环造出。每个 skill 的细节看它自己文件夹里的 README。stupidskills 只放在页面最底部，明确标记，不进入这个数字。

数字没变，名单换过：2026-07-14 起旧四 skill 流水线退役移除、`skill-creator-max` 与 `paper-writer` 计入；07-22 起新增 `logic-pacer`；07-27 起新增 `workspace-backup`。

## 一个 skill 长什么样

统一的目录结构：

```text
album-review/
├─ SKILL.md        # 入口 + 流程
├─ rules/          # 确定性规则
├─ scripts/        # 校验器 (.py/.mjs)
├─ schemas/        # JSON Schema
├─ references/     # 参考资料
├─ assets/         # 模板 / 示例
├─ README.md       # 中文说明
├─ README.en.md    # English
└─ CHANGELOG.md    # 版本记录
```

入口 `SKILL.md` 的 frontmatter 写名字、版本、触发词，正文写「锁定决策 + 分步流程」。要点：

- **scripts/** 确定性校验器，只用标准库——无需 npm / pip;
- **rules/** 把判断标准写死成可复用规则，降随机性；
- **schemas/** 用 JSON Schema 校验中间产物，做红绿 gate;
- **README · .en** 中英双语，各 skill 细节看自己的 README。

## 这一版更新了什么

- **构建链路收进一个 skill**:`skill-creator-max` 取代旧四 skill 流水线——薄指挥官逐角色派全新子代理、只认类型化工件、确定性 L0 门 + 独立电池；spec、trigger holdout、红绿 harness 都能被重跑，不靠口头承诺。
- **循环工程分层**:`loop-constructor` 设计通用 loop；文末的 stupidskills 里另放 `loop-constructor-codex`，把同一套 loop 工程映射到 `codex exec`、磁盘状态和 fresh evaluator。
- **独立性成为一等公民**:`attacker`、`reorganize-logic`、`test-driven-development` 都围绕「写答案的人不要同时判答案」重做过。
- **模型 / effort sizing 显式化**：文末的 `model-pyramid` 把定档收敛成两条轴——拿到上下文还是做错 = 能力缺口 → 换 model；跳过文件、没跑测试 = 彻底度缺口 → 换 effort——覆盖会话、每个子代理和要不要挂 advisor。它不做模型购物，`check_plan.mjs` 也不替你决定，只校验确定性可判的部分。
- **知识库随 skill 走——或干脆不需要**:`loop-principle` 内置在 `loop-constructor` 里随装随走；新流水线 `skill-creator-max` 运行时不依赖任何 KB（`skill-philosophy` 只是仓库外的设计期出处，不随仓库分发）。

## 16 个正式 skill，按用途分组

### 成品（拿来即用）

- **[album-review](https://github.com/VincentJiang06/skills/tree/main/skills/album-review)** —— 「主创署名 + 专辑名」→ 一篇万字、可溯源、覆盖每个音乐维度的中文乐评。
- **[hifi-review](https://github.com/VincentJiang06/skills/tree/main/skills/hifi-review)** —— 客观 HiFi 器材评价：风格由频响得出、素质由测量得出，每条结论追溯到证据。
- **[course-study](https://github.com/VincentJiang06/skills/tree/main/skills/course-study)** —— 课程材料 → 全覆盖、费曼式、可应试的复习笔记。
- **[fact-check](https://github.com/VincentJiang06/skills/tree/main/skills/fact-check)** —— 对事实性问题给出快速、有出处的 BLUF 回答（≤2 / ≤5 分钟）。
- **[humanizer-academic](https://github.com/VincentJiang06/skills/tree/main/skills/humanizer-academic)** —— 重写 AI 生成的严肃文本（中 / 英 / 混合）：去 AI 痕迹同时保留体裁腔调。
- **[paper-writer](https://github.com/VincentJiang06/skills/tree/main/skills/paper-writer)** —— 从需求（字数 / 引用风格 / 章节）和 / 或选题写出一篇新的、完整合规的论文：绝不编造引用、绝不抄袭，查不到的来源标 `[SOURCE NEEDED]` 而非发明。
- **[logic-pacer](https://github.com/VincentJiang06/skills/tree/main/skills/logic-pacer)** —— 把已经写好、你也喜欢的说理文改得逻辑步长更小、每步都跟得上：不动文风、不降词汇、不改事实立场，净长 ≤~1.3x。
- **[mp-cli-sup](https://github.com/VincentJiang06/skills/tree/main/skills/mp-cli-sup)** —— 通过 `vince-mp` CLI 调试实时运行的微信小程序：持久会话、uid 稳定、免扫码。
- **[mp-groundline](https://github.com/VincentJiang06/skills/tree/main/skills/mp-groundline)** —— 微信小程序 Skyline→WebView 迁移，一致性优先，配只读扫描器 + 迁移地图。
- **[workspace-backup](https://github.com/VincentJiang06/skills/tree/main/skills/workspace-backup)** —— 纯本地工作区备份：镜像到本机固定目录 + 外置硬盘两处，带记忆化台账所以第二次跑是增量、中断能续。不碰 git、不碰云、从不删除源。

### 编码纪律（写代码时自动触发）

- **[test-driven-development](https://github.com/VincentJiang06/skills/tree/main/skills/test-driven-development)** —— 对非平凡行为做 TDD：先写会失败的测试，把测试套件当成当前目标的活规格。
- **[neat](https://github.com/VincentJiang06/skills/tree/main/skills/neat)** —— 会话收尾时把文档 + 跨会话记忆对着代码对账，让知识不腐烂。

### 循环 & 对抗（工程化自跑）

- **[loop-constructor](https://github.com/VincentJiang06/skills/tree/main/skills/loop-constructor)** —— 为中大型任务设计工程化循环：分解成带 gate 的子循环树，落盘成可照跑的 runbook。
- **[attacker](https://github.com/VincentJiang06/skills/tree/main/skills/attacker)** —— 攻击产品的真实可观测行为：独立 subagent 只记可复现的破坏，与 loop-constructor 配对。
- **[reorganize-logic](https://github.com/VincentJiang06/skills/tree/main/skills/reorganize-logic)** —— 以代码为唯一事实源重建设计契约层（架构 + 结构 + 接口），删除遗留走评审门。

### 流水线（造 skill 的 skill）

- **[skill-creator-max](https://github.com/VincentJiang06/skills/tree/main/skills/skill-creator-max)** —— 仓库现行的造 skill 流水线，一个 skill 装下整条链路。SKILL.md 本体是一个**薄指挥官**：自己不做任何职能，只逐角色派出全新子代理跑 composer（决策规格）→ guidance（结构契约）→ engineer（红绿构建）→ zipper（压缩）→ O5 独立电池，按类型化工件把关、逐门路由。薄常驻体 + 五个按需 role-pack + 六厂交集 schema + 只查结构的 L0 门；运行时不依赖任何 KB。

它取代了已退役移除的旧四 skill 流水线（[skill-conductor](https://github.com/VincentJiang06/skills/tree/main/archive/skill-conductor-v1) / [skill-guidance](https://github.com/VincentJiang06/skills/tree/main/archive/skill-guidance-v1) / [skill-engineer](https://github.com/VincentJiang06/skills/tree/main/archive/skill-engineer-v1) / [skill-zipper](https://github.com/VincentJiang06/skills/tree/main/archive/skill-zipper-v1)），上一代冻结在 `archive/`，不可安装、不维护。

## 怎么用

装好后自然语言触发，或 `/<skill-name>` 显式调用：

- 「查一下：埃菲尔铁塔夏天会变高吗？」→ **fact-check**
- 「写一篇这张专辑的深度乐评」→ **album-review**
- 「把这个想法做成一个工业级 skill」→ **skill-creator-max**

## stupidskills（不计入 16 个正式 skill）

这两张卡只放在页面最下面，是实验/旁路工具。它们可以安装和使用，但**不计入我的 skill 个数记录**。

- **[loop-constructor-codex](https://github.com/VincentJiang06/skills/tree/main/skills/loop-constructor-codex)** —— `loop-constructor` 的 Codex CLI 变体：把同一套 loop 工程落到单 agent、多次 `codex exec`、磁盘状态和 fresh evaluator 上。
- **[model-pyramid](https://github.com/VincentJiang06/skills/tree/main/skills/model-pyramid)** —— 给会话和每个 subagent 右配 model + reasoning effort，并判断要不要挂 advisor:peer 继承、搜索继承或调高（effort 管的是含工具调用在内的全部 token，降它买到的是「不再继续找」的代理）、大规模廉价查找降一层模型。没有硬下限。它只负责 sizing，不负责 spawn。

仓库：[VincentJiang06/skills](https://github.com/VincentJiang06/skills)。made with ☕ & 🤖 by 小蒋。
