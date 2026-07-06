---
title: 工业级 Agent Skills —— 给 Claude Code / Codex 的 16 个技能
description: 给 Claude Code、Codex 和其他 agent runtime 用的工业级 agent skills:每个都自带确定性校验器 + 红绿 eval + 独立测试组。16 个正式技能之外,文末另有 stupidskills 附录,不计入总数。
tags: [agent, claude-code, skills]
date: 2026-07-03
---

> 这篇是 [github.com/VincentJiang06/skills](https://github.com/VincentJiang06/skills) 的说明页,原 `/skills` 页面已并入此文。正式计数仍为 **16 个 skill**;文末的 **stupidskills** 是实验/旁路工具,不计入总数。

给 Claude Code / Codex / 其他 agent runtime 用的一套 **agent skills**——每个正式 skill 都自带**确定性校验器** + **红绿 eval** + 一个专门想把它弄坏的**独立测试组**。小而专、范围锋利、中英双语。仓库直链:[github.com/VincentJiang06/skills](https://github.com/VincentJiang06/skills)。

一行装好(用 skills CLI,自动发现并装入 `~/.claude/skills/`):

```bash
npx skills add VincentJiang06/skills
```

16 个正式 skill,几乎全部由仓库自带的流水线 + 循环造出。每个 skill 的细节看它自己文件夹里的 README。stupidskills 只放在页面最底部,明确标记,不进入这个数字。

## 一个 skill 长什么样

统一的目录结构:

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

入口 `SKILL.md` 的 frontmatter 写名字、版本、触发词,正文写「锁定决策 + 分步流程」。要点:

- **scripts/** 确定性校验器,只用标准库——无需 npm / pip;
- **rules/** 把判断标准写死成可复用规则,降随机性;
- **schemas/** 用 JSON Schema 校验中间产物,做红绿 gate;
- **README · .en** 中英双语,各 skill 细节看自己的 README。

## 这一版更新了什么

- **流水线 v2 化**:guidance / engineer / conductor / zipper 共用可执行 gate;spec、build report、trigger eval、held-out、red log 都能被重跑,不靠口头承诺。
- **循环工程分层**:`loop-constructor` 设计通用 loop;文末的 stupidskills 里另放 `loop-constructor-codex`,把同一套 loop 工程映射到 `codex exec`、磁盘状态和 fresh evaluator。
- **独立性成为一等公民**:`attacker`、`reorganize-logic`、`test-driven-development` 都围绕「写答案的人不要同时判答案」重做过。
- **模型 / effort sizing 显式化**:文末的 `model-pyramid` 只在 subagent fan-out 前给出可审计的 `rule=<id> tier=<tier> effort=<notch>`,不做模型购物,也不负责 spawn。
- **知识库随 skill 走**:`skill-principle` 和 `loop-principle` 内置到对应 skill,安装时一起带上。

## 16 个正式 skill,按用途分组

### 成品(拿来即用)

- **[album-review](https://github.com/VincentJiang06/skills/tree/main/skills/album-review)** —— 「主创署名 + 专辑名」→ 一篇万字、可溯源、覆盖每个音乐维度的中文乐评。
- **[hifi-review](https://github.com/VincentJiang06/skills/tree/main/skills/hifi-review)** —— 客观 HiFi 器材评价:风格由频响得出、素质由测量得出,每条结论追溯到证据。
- **[course-study](https://github.com/VincentJiang06/skills/tree/main/skills/course-study)** —— 课程材料 → 全覆盖、费曼式、可应试的复习笔记。
- **[fact-check](https://github.com/VincentJiang06/skills/tree/main/skills/fact-check)** —— 对事实性问题给出快速、有出处的 BLUF 回答(≤2 / ≤5 分钟)。
- **[humanizer-academic](https://github.com/VincentJiang06/skills/tree/main/skills/humanizer-academic)** —— 重写 AI 生成的严肃文本(中 / 英 / 混合):去 AI 痕迹同时保留体裁腔调。
- **[mp-cli-sup](https://github.com/VincentJiang06/skills/tree/main/skills/mp-cli-sup)** —— 通过 `vince-mp` CLI 调试实时运行的微信小程序:持久会话、uid 稳定、免扫码。
- **[mp-groundline](https://github.com/VincentJiang06/skills/tree/main/skills/mp-groundline)** —— 微信小程序 Skyline→WebView 迁移,一致性优先,配只读扫描器 + 迁移地图。

### 编码纪律(写代码时自动触发)

- **[test-driven-development](https://github.com/VincentJiang06/skills/tree/main/skills/test-driven-development)** —— 对非平凡行为做 TDD:先写会失败的测试,把测试套件当成当前目标的活规格。
- **[neat](https://github.com/VincentJiang06/skills/tree/main/skills/neat)** —— 会话收尾时把文档 + 跨会话记忆对着代码对账,让知识不腐烂。

### 循环 & 对抗(工程化自跑)

- **[loop-constructor](https://github.com/VincentJiang06/skills/tree/main/skills/loop-constructor)** —— 为中大型任务设计工程化循环:分解成带 gate 的子循环树,落盘成可照跑的 runbook。
- **[attacker](https://github.com/VincentJiang06/skills/tree/main/skills/attacker)** —— 攻击产品的真实可观测行为:独立 subagent 只记可复现的破坏,与 loop-constructor 配对。
- **[reorganize-logic](https://github.com/VincentJiang06/skills/tree/main/skills/reorganize-logic)** —— 以代码为唯一事实源重建设计契约层(架构 + 结构 + 接口),删除遗留走评审门。

### 流水线(造 skill 的 skill)

- **[skill-conductor](https://github.com/VincentJiang06/skills/tree/main/skills/skill-conductor)** —— 端到端驱动 guidance → engineer → zipper;门禁直接跑阶段脚本,最终验收用 `min(复审,独立测试组)` 防注水。
- **[skill-guidance](https://github.com/VincentJiang06/skills/tree/main/skills/skill-guidance)** —— 审计 skill / 仓库并产出 handoff spec,用 `validate_spec.mjs` 自 gate。
- **[skill-engineer](https://github.com/VincentJiang06/skills/tree/main/skills/skill-engineer)** —— 从 spec 红-绿-重构构建并测试 skill,用 `validate_report.mjs` 当场重跑 harness。
- **[skill-zipper](https://github.com/VincentJiang06/skills/tree/main/skills/skill-zipper)** —— 为 token 效率、可靠性、触发准确度无损重构现有 skill,并带可移植性清单。

## 怎么用

装好后自然语言触发,或 `/<skill-name>` 显式调用:

- 「查一下:埃菲尔铁塔夏天会变高吗?」→ **fact-check**
- 「写一篇这张专辑的深度乐评」→ **album-review**
- 「把这个想法做成一个工业级 skill」→ **skill-conductor**

## stupidskills(不计入 16 个正式 skill)

这两张卡只放在页面最下面,是实验/旁路工具。它们可以安装和使用,但**不计入我的 skill 个数记录**。

- **[loop-constructor-codex](https://github.com/VincentJiang06/skills/tree/main/skills/loop-constructor-codex)** —— `loop-constructor` 的 Codex CLI 变体:把同一套 loop 工程落到单 agent、多次 `codex exec`、磁盘状态和 fresh evaluator 上。
- **[model-pyramid](https://github.com/VincentJiang06/skills/tree/main/skills/model-pyramid)** —— fan-out 前给每个 subagent 右配模型层级 + reasoning effort:peer 保持、search 降 effort、大规模廉价查找降一层模型,永远守住 medium floor。它只负责 sizing,不负责 spawn。

仓库:[VincentJiang06/skills](https://github.com/VincentJiang06/skills)。made with ☕ & 🤖 by 小蒋。
