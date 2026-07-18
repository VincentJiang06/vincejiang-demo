"""
实验 3：Goodhart 定律四变体的最小可复现实验
=============================================

对应理论：Manheim & Garrabrant (2018) "Categorizing Variants of Goodhart's Law"
(arXiv:1803.04585)。四种机制上完全不同的"指标失效"：

  1. Regressional（回归型 / 温和 Goodhart）
     proxy = target + 噪声。按 proxy 选优，选出的 target 期望必然低于 proxy
     （向均值回归 / 赢者诅咒）。优化压力越大，proxy 与 target 的差距越大，
     但 target 本身仍在缓慢上升——这是最温和的一型。

  2. Extremal（极值型）
     proxy 与 target 的相关关系只在"正常范围"内成立，极端区域相关结构崩坏。
     优化压力把你推进从未见过数据的尾部区域，target 掉头向下。

  3. Causal（因果型）
     proxy 与 target 只是共因相关（X → proxy, X → target）。
     直接干预 proxy（而非 X）会切断这条相关：proxy 涨、target 纹丝不动。
     ——"让学生背题库提高分数"不会提高能力，因为分数与能力只是共因关联。

  4. Adversarial（对抗型）
     对手知道你的 proxy 后，专门制造 proxy 高/target 低的选项喂给你。
     你的优化压力越大，选中的 target 越差——不只是不涨，是被压到负值。

运行： .venv/bin/python experiments/exp3_goodhart_taxonomy.py
输出： experiments/figures/exp3_goodhart.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

plt.rcParams["font.family"] = ["Heiti TC", "Arial Unicode MS", "sans-serif"]
plt.rcParams["axes.unicode_minus"] = False

rng = np.random.default_rng(42)
FIGDIR = Path(__file__).parent / "figures"
FIGDIR.mkdir(exist_ok=True)

TRIALS = 4000                       # 每个压力水平的重复次数
PRESSURES = np.unique(np.round(np.logspace(0, 3.3, 24)).astype(int))
# 优化压力 = 从 n 个候选中挑 proxy 最大者。n 越大压力越大。

fig, axes = plt.subplots(2, 2, figsize=(13, 9.5))


def selected_stats(gen, n, trials=TRIALS):
    """gen(n*trials) -> (proxy, target)。返回按 proxy 选优后的均值。"""
    proxy, target = gen(n * trials)
    proxy = proxy.reshape(trials, n)
    target = target.reshape(trials, n)
    idx = proxy.argmax(axis=1)
    rows = np.arange(trials)
    return proxy[rows, idx].mean(), target[rows, idx].mean()


# ── 1. Regressional ─────────────────────────────────────────
def gen_regressional(m):
    t = rng.normal(0, 1, m)
    p = t + rng.normal(0, 1, m)      # proxy = target + 等量噪声
    return p, t

px, tx = zip(*[selected_stats(gen_regressional, n) for n in PRESSURES])
ax = axes[0, 0]
ax.plot(PRESSURES, px, "o-", color="darkorange", label="选中者的 proxy")
ax.plot(PRESSURES, tx, "s-", color="seagreen", label="选中者的 target")
ax.set_xscale("log")
ax.set_title("1. Regressional：赢者诅咒\nproxy 一路飙升，target 增长不断放缓（但不下降）")
ax.set_xlabel("优化压力（候选数 n）"); ax.set_ylabel("选中者的期望值")
ax.legend(); ax.grid(alpha=0.3)

# ── 2. Extremal ─────────────────────────────────────────────
def gen_extremal(m):
    x = rng.normal(0, 1, m)
    p = x + rng.normal(0, 0.3, m)
    # 正常区域 target≈x；越过阈值后结构崩坏（隐藏约束被突破）
    t = x - 1.2 * np.maximum(0, x - 2.0) ** 2
    return p, t

px, tx = zip(*[selected_stats(gen_extremal, n) for n in PRESSURES])
ax = axes[0, 1]
ax.plot(PRESSURES, px, "o-", color="darkorange", label="选中者的 proxy")
ax.plot(PRESSURES, tx, "s-", color="seagreen", label="选中者的 target")
ax.set_xscale("log")
ax.axhline(0, color="gray", lw=0.6)
ax.set_title("2. Extremal：尾部结构崩坏\n压力把你推进相关关系失效的极端区域，target 掉头向下")
ax.set_xlabel("优化压力（候选数 n）"); ax.set_ylabel("选中者的期望值")
ax.legend(); ax.grid(alpha=0.3)

# ── 3. Causal ───────────────────────────────────────────────
# 共因结构：X -> proxy, X -> target。两种策略各花同样"努力预算" e：
#   干预 X（提升共因，如真实学习）  vs  直接干预 proxy（如背题库）
efforts = np.linspace(0, 3, 13)
t_via_x, t_via_p, p_via_p = [], [], []
M = 20000
for e in efforts:
    x = rng.normal(0, 1, M)
    # 策略 A：努力加在共因上
    xa = x + e
    t_via_x.append((xa + rng.normal(0, 0.3, M)).mean())
    # 策略 B：努力直接加在 proxy 上（target 只由 x 决定）
    p_via_p.append((x + rng.normal(0, 0.3, M) + e).mean())
    t_via_p.append((x + rng.normal(0, 0.3, M)).mean())
ax = axes[1, 0]
ax.plot(efforts, p_via_p, "o-", color="darkorange", label="干预 proxy：proxy 值")
ax.plot(efforts, t_via_p, "s-", color="crimson", label="干预 proxy：target 值（纹丝不动）")
ax.plot(efforts, t_via_x, "^-", color="seagreen", label="干预共因 X：target 值")
ax.set_title("3. Causal：干预错了节点\nproxy 与 target 是共因相关，抬 proxy 不动 target")
ax.set_xlabel("努力预算 e"); ax.set_ylabel("期望值")
ax.legend(fontsize=9); ax.grid(alpha=0.3)

# ── 4. Adversarial ──────────────────────────────────────────
# 对手生成候选：把自己的预算 b 全砸进"只涨 proxy 不涨 target"的通道，
# 并且随你的筛选压力 n 增大而加大伪装投入（学习你的筛选强度）。
def gen_adversarial_factory(n):
    b = 0.5 * np.log1p(n)            # 对手投入随你的压力增长
    def gen(m):
        real = rng.normal(0, 1, m)               # 真实质量通道
        fake = b * np.abs(rng.normal(1, 0.3, m)) # 纯伪装通道
        p = real + fake + rng.normal(0, 0.3, m)
        t = real - 0.4 * fake                    # 伪装还挤占真实质量
        return p, t
    return gen

px, tx = zip(*[selected_stats(gen_adversarial_factory(n), n) for n in PRESSURES])
ax = axes[1, 1]
ax.plot(PRESSURES, px, "o-", color="darkorange", label="选中者的 proxy")
ax.plot(PRESSURES, tx, "s-", color="seagreen", label="选中者的 target")
ax.set_xscale("log")
ax.axhline(0, color="gray", lw=0.6)
ax.set_title("4. Adversarial：对手针对你的指标造假\n压力越大，选中的 target 越差（被压到负值）")
ax.set_xlabel("优化压力（候选数 n）"); ax.set_ylabel("选中者的期望值")
ax.legend(); ax.grid(alpha=0.3)

plt.suptitle("Goodhart 定律四变体（Manheim & Garrabrant 2018）：同一句格言，四种完全不同的机制",
             fontsize=13, y=1.00)
plt.tight_layout()
plt.savefig(FIGDIR / "exp3_goodhart.png", dpi=150, bbox_inches="tight")

print("=== 实验 3 结果（优化压力 n=1 → n=2000 时选中者的 target 变化）===")
labels = ["Regressional", "Extremal", "Causal(见图)", "Adversarial"]
print(f"图已保存: {FIGDIR}/exp3_goodhart.png")
