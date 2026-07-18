"""
实验 4：Eval 反应性——"模型被塑造成 eval 的形状"
=================================================

对应理论：
  - 自适应过拟合（adaptive overfitting）：Blum & Hardt (2015) "The Ladder"、
    Dwork et al. 可重用 holdout。同一个测试集被反复用于模型选择时，
    选择过程本身把测试集的特异性"学"进了模型——即使从不直接训练在测试集上。
  - Gao, Schulman et al. (2023) reward model overoptimization 的曲线形状。
  - Espeland & Sauder 的 reactivity 在 ML 中的对应：eval 不只是测量模型，
    eval 通过"开发者的选择行为"重新制造模型。

模型设定
--------
能力空间 D=200 个潜在任务维度。模型状态 = (θ, q)：
  θ ∈ R^D  真实能力向量（"真实能力" = θ 全维平均 ≈ 真实用户体验）
  q ∈ R^d  对**这套具体题目**的特异性适应（记住题面套路、prompt 巧合、
           数据污染……对新题一文不值）
benchmark 覆盖 d 个维度、每维一道具体题目；
    benchmark 分数 = mean(θ[被测维度]) + mean(q)
每代开发者生成 K 个候选（θ、q 同时扰动），保留 benchmark 得分最高者。
——选择压力无法区分"真提升"与"题目适应"，于是两个通道同时被爬升。

由此把"分数虚高"干净地分解为三个成分：
  A. 题目过拟合 mean(q)         —— 纯虚假，换题即归零
  B. 维度窄化 mean(θ[被测]) - mean(θ) —— 合法但片面（只练被测的 10%）
  C. 真实挤占（仅当容量零和）    —— 未测维度被主动拉低，真实伤害

四个子图
--------
1. 分数虚高的解剖：benchmark 分 / 被测维度真实能力 / 全维真实能力 三条曲线。
2. 形状退化（核心）：零和容量下，未测维度能力被真实拉低。
3. 题目过拟合量随『自适应查询次数』增长、随题库大小 d 收缩（Ladder 理论的定性形状）。
4. 防御对比：固定题库 / 大题库 / 题库轮换 / 每代全新题。

运行： .venv/bin/python experiments/exp4_eval_overfitting.py
输出： experiments/figures/exp4_eval_overfit.png
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

D = 200          # 潜在任务维度总数
STEP = 0.05      # 每代扰动幅度（θ 与 q 相同——现实里"适应题目"往往还更容易）
K = 20           # 每代候选数
G = 300          # 代数
EVAL_NOISE = 0.02


def evolve(d=20, zero_sum=False, fresh_each_gen=False, rotate_pool=0,
           seed=0, G=G):
    r = np.random.default_rng(seed)
    theta = np.zeros(D)
    if rotate_pool:
        pool_dims = [r.choice(D, d, replace=False) for _ in range(rotate_pool)]
        pool_q = [np.zeros(d) for _ in range(rotate_pool)]
    else:
        bench_dims = r.choice(D, d, replace=False)
        q = np.zeros(d)

    hist = dict(bench=[], true=[], true_bench_dims=[], overfit=[],
                meas=[], unmeas=[])
    covered = np.zeros(D, bool)
    if not rotate_pool and not fresh_each_gen:
        covered[bench_dims] = True

    for g in range(G):
        if fresh_each_gen:
            bench_dims = r.choice(D, d, replace=False)
            q = np.zeros(d)            # 新题：旧的题目适应一文不值
        elif rotate_pool:
            idx = g % rotate_pool
            bench_dims, q = pool_dims[idx], pool_q[idx]

        dtheta = r.normal(0, STEP, (K, D))
        if zero_sum:
            dtheta -= dtheta.mean(axis=1, keepdims=True)   # 容量守恒
        dq = r.normal(0, STEP, (K, d))

        scores = ((theta + dtheta)[:, bench_dims].mean(axis=1)
                  + (q + dq).mean(axis=1)
                  + r.normal(0, EVAL_NOISE, K))
        best = scores.argmax()
        theta = theta + dtheta[best]
        q = q + dq[best]
        if rotate_pool:
            pool_q[g % rotate_pool] = q

        hist["bench"].append(theta[bench_dims].mean() + q.mean())
        hist["true"].append(theta.mean())
        hist["true_bench_dims"].append(theta[bench_dims].mean())
        hist["overfit"].append(q.mean())
        if covered.any():
            hist["meas"].append(theta[covered].mean())
            hist["unmeas"].append(theta[~covered].mean())

    return {k: np.array(v) for k, v in hist.items()}


fig, axes = plt.subplots(2, 2, figsize=(13, 9.5))

# ── 1. 分数虚高的解剖 ────────────────────────────────────────
ax = axes[0, 0]
fix = evolve(d=20, seed=1)
fresh = evolve(d=20, fresh_each_gen=True, seed=1)
gens = np.arange(G)
ax.plot(fix["bench"], color="darkorange", label="benchmark 分数（外界看到的）")
ax.plot(fix["true_bench_dims"], color="goldenrod", ls="--",
        label="被测维度的真实能力")
ax.plot(fix["true"], color="crimson", label="全维真实能力（用户体验到的）")
ax.plot(fresh["true"], color="seagreen", label="对照：每代换新题时的真实能力")
ax.fill_between(gens, fix["true_bench_dims"], fix["bench"],
                color="orange", alpha=0.18, label="A. 题目过拟合（换题归零）")
ax.fill_between(gens, fix["true"], fix["true_bench_dims"],
                color="red", alpha=0.10, label="B. 维度窄化")
ax.set_title("1. 分数虚高的解剖：同一套 eval 反复用于模型选择")
ax.set_xlabel("代"); ax.set_ylabel("能力 / 分数")
ax.legend(fontsize=8); ax.grid(alpha=0.3)

# ── 2. 形状退化（核心图）─────────────────────────────────────
ax = axes[0, 1]
free = evolve(d=20, zero_sum=False, seed=2)
zs = evolve(d=20, zero_sum=True, seed=2)
ax.plot(zs["meas"], color="darkorange", label="零和容量：被 eval 覆盖的维度")
ax.plot(zs["unmeas"], color="crimson", label="零和容量：未覆盖维度（被挤占 ↓）")
ax.plot(free["meas"], color="darkorange", ls="--", alpha=0.6, label="无约束：被覆盖维度")
ax.plot(free["unmeas"], color="gray", ls="--", alpha=0.6, label="无约束：未覆盖维度（仅漂移）")
ax.axhline(0, color="gray", lw=0.6)
ax.set_title("2. 形状退化：容量有限时，优化被测维度\n主动挤占未测维度——模型退化成 eval 的形状")
ax.set_xlabel("代"); ax.set_ylabel("维度组平均能力")
ax.legend(fontsize=8); ax.grid(alpha=0.3)

# ── 3. 题目过拟合的标度行为 ──────────────────────────────────
ax = axes[1, 0]
for d, color in [(10, "crimson"), (50, "darkorange"), (200, "seagreen")]:
    Gs = [30, 100, 300, 1000]
    ofs = []
    for g_run in Gs:
        runs = [evolve(d=d, seed=s, G=g_run) for s in range(4)]
        ofs.append(np.mean([r_["overfit"][-1] for r_ in runs]))
    ax.plot(np.array(Gs) * K, ofs, "o-", color=color, label=f"题库大小 d={d}")
ax.set_xscale("log")
ax.set_title("3. 纯题目过拟合量：随自适应查询次数增长，随题库大小收缩\n（Ladder / 可重用 holdout 理论的定性形状）")
ax.set_xlabel("累计自适应查询次数（代数×候选数）"); ax.set_ylabel("末代 mean(q)")
ax.legend(); ax.grid(alpha=0.3)

# ── 4. 防御对比 ─────────────────────────────────────────────
ax = axes[1, 1]
settings = [
    ("小题库\n反复用\n(d=20)", dict(d=20)),
    ("大题库\n反复用\n(d=100)", dict(d=100)),
    ("题库轮换\n(5×d=20)", dict(d=20, rotate_pool=5)),
    ("每代\n全新题\n(d=20)", dict(d=20, fresh_each_gen=True)),
]
finals, gaps = [], []
for name, kw in settings:
    runs = [evolve(seed=s, **kw) for s in range(6)]
    finals.append(np.mean([r_["true"][-1] for r_ in runs]))
    gaps.append(np.mean([r_["bench"][-1] - r_["true"][-1] for r_ in runs]))
x = np.arange(len(settings))
ax.bar(x - 0.2, finals, 0.4, color="seagreen", label="最终真实能力")
ax.bar(x + 0.2, gaps, 0.4, color="darkorange", label="虚高 gap（分数−真实）")
ax.set_xticks(x); ax.set_xticklabels([s[0] for s in settings], fontsize=9)
ax.set_title("4. 防御手段对比")
ax.legend(); ax.grid(alpha=0.3, axis="y")

plt.suptitle("Eval 的反应性：评测不只测量模型，评测（通过开发者的选择）重新制造模型",
             fontsize=13, y=1.00)
plt.tight_layout()
plt.savefig(FIGDIR / "exp4_eval_overfit.png", dpi=150, bbox_inches="tight")

print("=== 实验 4 结果 ===")
print(f"固定题库 {G} 代: benchmark 分 {fix['bench'][-1]:.3f}"
      f" = 全维真实 {fix['true'][-1]:.3f}"
      f" + 维度窄化 {fix['true_bench_dims'][-1]-fix['true'][-1]:.3f}"
      f" + 题目过拟合 {fix['overfit'][-1]:.3f}")
print(f"每代换新题: 真实能力 {fresh['true'][-1]:.3f}（题目过拟合被清零）")
print(f"零和容量: 未测维度末代 {zs['unmeas'][-1]:.3f}（负=真实退化）; "
      f"无约束时 {free['unmeas'][-1]:.3f}")
print("防御对比 [真实能力 | 虚高]: " +
      "; ".join(f"{s[0].replace(chr(10),'')} {f:.2f}|{g:.2f}"
                for s, f, g in zip(settings, finals, gaps)))
print(f"图已保存: {FIGDIR}/exp4_eval_overfit.png")
