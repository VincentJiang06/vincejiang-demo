# reactivity-study

排名/测量/评测的反应性（Reactivity, Espeland & Sauder）系统研究项目：
从量化社会学理论谱系，到 Goodhart 定律家族考证，到跨领域案例库，
到 AI eval 的反应性，再到五个可复现的模拟实验。

**从这里开始读：[00-SYNTHESIS-总纲.md](00-SYNTHESIS-总纲.md)**
（理论地图、概念辨析、统一框架、实验解读、六级学习路径、开放问题）

## 课程网站 `site/`（Nothing 美学 · 天赋树 · 44 节点全完成）

《当尺子开始回看你 / reactor-study》——把这套研究做成一个纯静态、无 React、
SEO/GEO 友好的交互课程网站：44 节点非线性天赋树、18+ 个原生交互模块、
明暗×四色主题、动态光条背景。策划见 [course/](course/)，构建见 [site/README.md](site/README.md)。

```bash
cd site && python ../.venv/bin/... # 见 site/README；或：
cd site && node build.mjs && cd dist && python3 -m http.server 8099   # → localhost:8099
```

## 快速运行实验

```bash
.venv/bin/python experiments/exp1_ranking_reactivity.py   # E&S 排名反应性
.venv/bin/python experiments/exp2_arena_leaderboard.py    # Arena 排行榜失真
.venv/bin/python experiments/exp3_goodhart_taxonomy.py    # Goodhart 四型
.venv/bin/python experiments/exp4_eval_overfitting.py     # Eval 过拟合分解
.venv/bin/python experiments/exp5_musiclab.py             # MusicLab 复现
```

图输出在 `experiments/figures/`。依赖：numpy, scipy, matplotlib（.venv 已装好）。

## 目录

- `research/` — 六份专题研究报告 + 三份一手考证附录（约 25 万字节，全部带来源 URL）
- `papers/` — 核心论文 PDF（E&S 2007/2009、Hacking 2007、Callon 2009、
  Chatbot Arena、Leaderboard Illusion 等）
- `experiments/` — 五个模拟实验
- `scratchpad-2007.txt` / `scratchpad-2009.txt` — 两篇核心论文的全文提取
