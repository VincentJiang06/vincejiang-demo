"""
实验 2：Chatbot Arena 式排行榜的失真机制模拟
=============================================

对应理论与文献：
  - Espeland & Sauder 的 reactivity：排行榜不只测量模型，还改变厂商行为。
  - "The Leaderboard Illusion" (Singh et al., 2025) 指控的两个机制在此复现：
    (a) best-of-N 私测：厂商私下测 N 个变体，只公开发布分数最高的那个
        —— 这是对随机噪声的择优，会系统性抬高期望名次；
    (b) 采样不对称：大厂模型获得更多对战场次 → 置信区间更窄 → 排名更稳定。
  - 第三个机制是 Goodhart/gaming：模型不提升真实能力，而是迎合评委偏好
    （长回复、列表、emoji —— 即"风格分"），复现 style bias。

模型设定
--------
每个模型有真实能力 S。人类投票是带噪声的 Bradley-Terry 过程：
    P(i 胜 j) = sigmoid(  (S_i + style_i) - (S_j + style_j)  )
其中 style 是"评委可感知但不等于能力"的表面吸引力。
排行榜用标准 Bradley-Terry MLE 从对战记录中估计分数。

三个子实验：
  A. best-of-N 私测发布：同一真实能力，N=1 vs N=10 私测变体，看期望名次差。
  B. 采样不对称：一半模型场次是另一半的 10 倍，看名次方差与偏差。
  C. style hacking：一个中等能力模型把预算投入 style，看它能"买"到几名。

运行： .venv/bin/python experiments/exp2_arena_leaderboard.py
输出： experiments/figures/exp2_*.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

plt.rcParams["font.family"] = ["Heiti TC", "Arial Unicode MS", "sans-serif"]
plt.rcParams["axes.unicode_minus"] = False

rng = np.random.default_rng(7)
FIGDIR = Path(__file__).parent / "figures"
FIGDIR.mkdir(exist_ok=True)


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


def simulate_battles(strength, n_battles, weights=None, r=rng):
    """随机配对对战，返回胜负记录 (i, j, i_wins)。weights 控制各模型被抽中的概率。"""
    n = len(strength)
    p = np.ones(n) / n if weights is None else weights / weights.sum()
    battles = []
    for _ in range(n_battles):
        i, j = r.choice(n, size=2, replace=False, p=p)
        win = r.random() < sigmoid(strength[i] - strength[j])
        battles.append((i, j, win))
    return battles


def bt_scores(n, battles, iters=200):
    """Bradley-Terry 极大似然（简单 MM 算法），返回对数能力分。"""
    wins = np.zeros((n, n))
    for i, j, w in battles:
        if w:
            wins[i, j] += 1
        else:
            wins[j, i] += 1
    gamma = np.ones(n)
    total = wins + wins.T
    for _ in range(iters):
        W = wins.sum(axis=1)
        denom = (total / (gamma[:, None] + gamma[None, :])).sum(axis=1)
        gamma = np.where(denom > 0, W / np.maximum(denom, 1e-12), gamma)
        gamma /= np.exp(np.mean(np.log(np.maximum(gamma, 1e-12))))
    return np.log(np.maximum(gamma, 1e-12))


# ---------- 子实验 A：best-of-N 私测发布 ----------
def exp_a(n_models=20, n_variants=10, battles_per_eval=2000, trials=40):
    """所有模型真实能力相同(=0)。'大厂'私测 n_variants 个同能力变体，发布最高分者。"""
    ranks_honest, ranks_bestofn = [], []
    for t in range(trials):
        r = np.random.default_rng(t)
        S = np.zeros(n_models)
        # 私测：对 model 0 采 n_variants 次独立评估，取最高的那次的"运气"
        # 等价建模：其发布分数 = max of N 次评估噪声
        est = bt_scores(n_models, simulate_battles(S, battles_per_eval, r=r))
        ranks_honest.append(np.argsort(np.argsort(-est))[0])
        best_lucky = est[0]
        for _ in range(n_variants - 1):
            est2 = bt_scores(n_models, simulate_battles(S, battles_per_eval, r=r))
            best_lucky = max(best_lucky, est2[0])
        est_pub = est.copy()
        est_pub[0] = best_lucky
        ranks_bestofn.append(np.argsort(np.argsort(-est_pub))[0])
    return np.array(ranks_honest), np.array(ranks_bestofn)


# ---------- 子实验 B：采样不对称 ----------
def exp_b(n_models=20, n_battles=20000, trials=30):
    """前 10 个模型（'大厂'）被抽中的概率是后 10 个的 10 倍。真实能力随机但固定。"""
    r0 = np.random.default_rng(99)
    S = np.sort(r0.normal(0, 1, n_models))[::-1]          # 递减，真实名次 = index
    w = np.array([10.0] * 10 + [1.0] * 10)
    err_big, err_small = [], []
    for t in range(trials):
        r = np.random.default_rng(t)
        est = bt_scores(n_models, simulate_battles(S, n_battles, weights=w, r=r))
        est_rank = np.argsort(np.argsort(-est))
        err = np.abs(est_rank - np.arange(n_models))
        err_big.append(err[:10].mean())
        err_small.append(err[10:].mean())
    return S, np.array(err_big), np.array(err_small)


# ---------- 子实验 C：style hacking ----------
def exp_c(n_models=20, n_battles=20000, style_boost=np.linspace(0, 1.5, 7)):
    """模型 idx=10（真实能力第 11 名）把 style 加到感知分上，看排行榜名次。"""
    r0 = np.random.default_rng(5)
    S = np.sort(r0.normal(0, 1, n_models))[::-1]
    hacker = 10
    ranks = []
    for b in style_boost:
        perceived = S.copy()
        perceived[hacker] += b       # 评委看到的 = 能力 + 风格
        r = np.random.default_rng(int(b * 1000))
        est = bt_scores(n_models, simulate_battles(perceived, n_battles, r=r))
        ranks.append(np.argsort(np.argsort(-est))[hacker] + 1)
    return style_boost, np.array(ranks)


ra_h, ra_b = exp_a()
S_b, err_big, err_small = exp_b()
boosts, hacker_ranks = exp_c()

fig, axes = plt.subplots(1, 3, figsize=(16, 4.5))

ax = axes[0]
ax.hist([ra_h + 1, ra_b + 1], bins=np.arange(1, 22) - 0.5,
        label=[f"诚实发布 (均值 {ra_h.mean()+1:.1f})",
               f"私测10个变体择优 (均值 {ra_b.mean()+1:.1f})"],
        color=["steelblue", "crimson"], alpha=0.85)
ax.set_title("A. best-of-N 私测：20 个能力完全相同的模型\n其中一个私测择优后的名次分布")
ax.set_xlabel("发布后名次"); ax.set_ylabel("次数")
ax.legend(); ax.grid(alpha=0.3)

ax = axes[1]
ax.bar(["大厂\n(10倍场次)", "小厂\n(1倍场次)"],
       [err_big.mean(), err_small.mean()],
       yerr=[err_big.std(), err_small.std()],
       color=["crimson", "steelblue"], capsize=6)
ax.set_title("B. 采样不对称：名次估计的平均误差")
ax.set_ylabel("|估计名次 - 真实名次|")
ax.grid(alpha=0.3, axis="y")

ax = axes[2]
ax.plot(boosts, hacker_ranks, "o-", color="crimson")
ax.axhline(11, ls="--", color="gray", label="真实能力名次 = 11")
ax.invert_yaxis()
ax.set_title("C. Style hacking：迎合评委风格偏好\n能把第 11 名'买'到第几名")
ax.set_xlabel("style 加成（相对能力差单位）"); ax.set_ylabel("排行榜名次")
ax.legend(); ax.grid(alpha=0.3)

plt.tight_layout()
plt.savefig(FIGDIR / "exp2_arena.png", dpi=150)

print("=== 实验 2 结果 ===")
print(f"A. 同等能力下，诚实发布平均名次 {ra_h.mean()+1:.1f}，私测10变体择优 {ra_b.mean()+1:.1f}（共20名）")
print(f"B. 大厂名次平均误差 {err_big.mean():.2f} vs 小厂 {err_small.mean():.2f}")
print(f"C. style 加成从 0 → {boosts[-1]:.1f} 时，第11名模型的榜上名次: {hacker_ranks.tolist()}")
print(f"图已保存: {FIGDIR}/exp2_arena.png")
