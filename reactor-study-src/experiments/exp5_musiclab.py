"""
实验 5：MusicLab 人工文化市场——排行榜的自我实现
==================================================

对应理论：Salganik, Dodds & Watts (2006) "Experimental Study of Inequality and
Unpredictability in an Artificial Cultural Market", Science 311:854-856。
以及 Salganik & Watts (2008) 的续作（把榜单倒过来贴，垫底歌真的火了）。

原实验：14,341 名真人被试进入一个音乐下载网站的平行世界。
  - 独立条件：只看歌名，凭自己判断下载。
  - 社会影响条件：能看到"当前下载排行榜"。8 个平行世界各自演化。
发现：看得到排行榜的世界里 (1) 赢家通吃的不平等更严重；
(2) 哪首歌成为赢家在平行世界之间高度不可预测——"质量"只决定了下限和上限，
排行榜的早期噪声决定了其余一切。

本模拟：N 首歌，每首有内在吸引力 a。顺序到达的听众：
  - 独立世界：以均匀概率试听，试听后以 sigmoid(a) 概率下载。
  - 社会世界：试听概率 ∝ 当前下载排行榜位置的注意力权重（Zipf 形），
    下载概率仍由内在吸引力决定（社会影响作用于"注意力"而非"品味"——
    这已足以制造赢家通吃与世界间分化）。

观察量：
1. 不平等：市场份额的 Gini 系数（独立 vs 社会，多个世界）。
2. 不可预测性：同一首歌在 8 个平行世界的市场份额差异。
3. 质量-成功散点：社会世界里质量只松散地约束成功。

运行： .venv/bin/python experiments/exp5_musiclab.py
输出： experiments/figures/exp5_musiclab.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

plt.rcParams["font.family"] = ["Heiti TC", "Arial Unicode MS", "sans-serif"]
plt.rcParams["axes.unicode_minus"] = False

FIGDIR = Path(__file__).parent / "figures"
FIGDIR.mkdir(exist_ok=True)

N_SONGS = 48
N_LISTENERS = 6000
N_WORLDS = 8
ALPHA = 1.0          # 注意力对榜单位置的 Zipf 指数（社会影响强度）
rng_master = np.random.default_rng(2006)

appeal = rng_master.normal(0, 1, N_SONGS)          # 歌曲内在吸引力
p_download = 1 / (1 + np.exp(-(appeal - 0.5)))     # 试听后下载概率


def run_world(social: bool, seed: int):
    r = np.random.default_rng(seed)
    downloads = np.zeros(N_SONGS)
    for _ in range(N_LISTENERS):
        if social:
            # 榜单展示按当前下载数排序；注意力随名次 Zipf 衰减
            order = np.argsort(-(downloads + r.uniform(0, 1e-6, N_SONGS)))
            pos = np.empty(N_SONGS); pos[order] = np.arange(1, N_SONGS + 1)
            w = pos ** (-ALPHA)
            probs = w / w.sum()
        else:
            probs = np.full(N_SONGS, 1 / N_SONGS)
        j = r.choice(N_SONGS, p=probs)
        if r.random() < p_download[j]:
            downloads[j] += 1
    return downloads


def gini(x):
    x = np.sort(x); n = len(x)
    return (2 * np.arange(1, n + 1) - n - 1) @ x / (n * x.sum())


indep = np.array([run_world(False, s) for s in range(N_WORLDS)])
social = np.array([run_world(True, 100 + s) for s in range(N_WORLDS)])

share_i = indep / indep.sum(axis=1, keepdims=True)
share_s = social / social.sum(axis=1, keepdims=True)

fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))

# ── 1. 不平等 ────────────────────────────────────────────────
ax = axes[0]
g_i = [gini(w) for w in indep]
g_s = [gini(w) for w in social]
ax.boxplot([g_i, g_s], tick_labels=["独立世界\n(看不到榜单)", "社会世界\n(看得到榜单)"])
ax.set_title("1. 排行榜制造赢家通吃\n（市场份额 Gini 系数）")
ax.set_ylabel("Gini")
ax.grid(alpha=0.3)

# ── 2. 不可预测性 ───────────────────────────────────────────
ax = axes[1]
rank_q = np.argsort(np.argsort(-appeal))     # 质量名次（0 = 最好）
order_q = np.argsort(rank_q)
# 每首歌在 8 个世界的份额范围
for arr, color, label in [(share_i, "steelblue", "独立世界"),
                          (share_s, "crimson", "社会世界")]:
    lo, hi = arr.min(axis=0), arr.max(axis=0)
    ax.fill_between(np.arange(N_SONGS), lo[order_q] * 100, hi[order_q] * 100,
                    alpha=0.3, color=color, label=f"{label}：8 世界份额范围")
ax.set_title("2. 不可预测性：同一首歌在平行世界的命运\n（社会世界的范围宽得多——早期噪声决定命运）")
ax.set_xlabel("歌曲（按真实质量排序，左=最好）")
ax.set_ylabel("市场份额 %")
ax.legend(fontsize=9); ax.grid(alpha=0.3)

# ── 3. 质量-成功散点 ────────────────────────────────────────
ax = axes[2]
for w in range(N_WORLDS):
    ax.scatter(appeal, share_s[w] * 100, s=12, alpha=0.5, color="crimson")
ax.scatter(appeal, share_i.mean(axis=0) * 100, s=30, color="steelblue",
           zorder=5, label="独立世界均值（≈真实质量）")
ax.set_title("3. 社会世界里质量只松散约束成功\n（最好的歌很少垫底，但谁封王看运气）")
ax.set_xlabel("歌曲内在吸引力"); ax.set_ylabel("市场份额 %")
ax.legend(fontsize=9); ax.grid(alpha=0.3)

plt.suptitle("MusicLab（Salganik, Dodds & Watts 2006）复现：排行榜不只反映流行，排行榜制造流行",
             fontsize=13, y=1.02)
plt.tight_layout()
plt.savefig(FIGDIR / "exp5_musiclab.png", dpi=150, bbox_inches="tight")

# 不可预测性度量（原论文的 unpredictability：同一首歌跨世界份额的平均绝对差）
def unpredictability(share):
    diffs = []
    for i in range(N_WORLDS):
        for j in range(i + 1, N_WORLDS):
            diffs.append(np.abs(share[i] - share[j]).mean())
    return np.mean(diffs)

print("=== 实验 5 结果 ===")
print(f"Gini: 独立 {np.mean(g_i):.3f} vs 社会 {np.mean(g_s):.3f}")
print(f"不可预测性(跨世界平均绝对份额差): 独立 {unpredictability(share_i)*100:.3f}% "
      f"vs 社会 {unpredictability(share_s)*100:.3f}%")
best = np.argmax(appeal)
print(f"质量最高的歌在 8 个社会世界的名次: "
      f"{[int(np.argsort(np.argsort(-social[w]))[best])+1 for w in range(N_WORLDS)]}")
print(f"图已保存: {FIGDIR}/exp5_musiclab.png")
