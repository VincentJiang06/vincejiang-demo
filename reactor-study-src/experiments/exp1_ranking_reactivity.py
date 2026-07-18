"""
实验 1：排名反应性（Reactivity）的多主体模拟
=============================================

对应理论：Espeland & Sauder (2007) 的两大机制
  - Self-fulfilling prophecy（自我实现预言）：排名影响申请者/雇主的选择，
    这些选择又反过来改变学校的未来指标，使初始排名"变成真的"。
  - Goal displacement / gaming：学校把资源从"真实质量"转向"排名指标优化"。

模型设定
--------
N 所学校，各有一个不可直接观测的"真实质量" Q（缓慢演化）。
排名机构每期发布 rank，依据的是可观测指标 M：
    M = a*Q + b*G + c*R + noise
其中 G 是学校投入的"指标操纵/应试"努力，R 是声誉（滞后的排名本身——
同行评议分数实际上就是上一期排名的回声，这是 E&S 论文里的实证发现）。

每所学校有固定预算，在"提升真实质量"和"操纵指标"之间分配。
学校的 gaming 倾向是异质的（各校"底线/能力"不同——这是关键：
若所有学校同步 gaming，指标只是整体平移，排序不变、信息含量不降；
真实世界里正是 gaming 的不均匀性摧毁了排名的信息含量）。

排名还通过录取市场反馈到质量本身：名次高 → 吸引更好生源/教师 → Q 上升。
这就是自我实现预言的闭环。

四个观察量（对应四个子图）
------------------------
1. 福利代价：反应性开启后，全体学校平均真实质量的增长被 gaming 军备竞赛拖慢。
2. 信息代价：rank 与真实质量 Q 的 Spearman 相关随时间下降（异质 gaming 搅乱排序）。
3. Matthew 效应：初始质量几乎相同的学校因早期排名噪声而路径分化。
4. 锁定效应（排名制造现实的定量版）：反馈强度越大，最终排名越是被
   "初始排名（含噪声）"而非"初始真实质量"决定——预言自我实现的程度可调。

运行： .venv/bin/python experiments/exp1_ranking_reactivity.py
输出： experiments/figures/exp1_*.png
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams["font.family"] = ["Heiti TC", "Arial Unicode MS", "sans-serif"]
plt.rcParams["axes.unicode_minus"] = False
from scipy import stats
from pathlib import Path

FIGDIR = Path(__file__).parent / "figures"
FIGDIR.mkdir(exist_ok=True)

N = 50          # 学校数
T = 120         # 期数
BUDGET = 1.0    # 每期总努力预算

# 指标构成权重：可观测指标 = a*质量 + b*gaming + c*声誉(滞后排名)
# 声誉权重 0.4 对齐 USN 的现实权重（reputation 占总分 40%）
A_QUALITY, B_GAMING, C_REPUTATION = 0.5, 0.8, 0.4
NOISE_SD = 0.15
REP_EMA = 0.95     # 声誉的记忆长度（现实中声誉以十年为尺度衰减）

Q_EFF = 0.02       # 单位质量努力对 Q 的边际贡献
DECAY = 0.010      # 质量自然折旧
LEARN = 0.15       # 学校调整 gaming 投入的学习率
INIT_NOISE = 1.0   # 初始排名的噪声（第一年的测量方法粗糙——符合 USN 史实）


def run(reactive: bool, feedback: float = 0.020, seed: int = 1):
    r = np.random.default_rng(seed)
    Q = r.normal(0, 1, N)                    # 真实质量
    Q0 = Q.copy()
    gaming = np.full(N, 0.1)                 # gaming 投入占比（初始 10%）
    # 异质性：各校 gaming 上限（伦理底线/操纵能力）不同
    gaming_cap = r.uniform(0.05, 0.9, N)
    prev_rank = np.argsort(np.argsort(-(Q + r.normal(0, INIT_NOISE, N))))
    rank0 = prev_rank.copy()                 # 初始排名（含大量任意噪声！）
    # 声誉从初始排名出发——同行评议是上期排名的回声（Stake 2006 的实证发现）
    reputation = 1 - prev_rank / (N - 1)

    hist_corr, hist_gaming, hist_rank, hist_meanQ = [], [], [], []
    for t in range(T):
        quality_effort = BUDGET * (1 - gaming)
        gaming_effort = BUDGET * gaming

        # 质量演化：投入 + 排名带来的生源/资源反馈 - 折旧
        top_bonus = feedback * (1 - prev_rank / (N - 1))
        Q = Q + Q_EFF * quality_effort + top_bonus - DECAY * Q

        # 可观测指标与排名
        M = (A_QUALITY * Q + B_GAMING * gaming_effort
             + C_REPUTATION * reputation + r.normal(0, NOISE_SD, N))
        rank = np.argsort(np.argsort(-M))
        reputation = REP_EMA * reputation + (1 - REP_EMA) * (1 - rank / (N - 1))

        if reactive:
            # 名次下降 → 向自己的上限增加 gaming；上升 → 略微松懈
            dropped = rank > prev_rank
            gaming = np.clip(
                gaming + LEARN * np.where(dropped, 0.08, -0.01),
                0.0, gaming_cap)

        prev_rank = rank
        hist_corr.append(stats.spearmanr(-Q, rank).statistic)
        hist_gaming.append(gaming.mean())
        hist_rank.append(rank.copy())
        hist_meanQ.append(Q.mean())

    return dict(corr=np.array(hist_corr), gaming=np.array(hist_gaming),
                ranks=np.array(hist_rank), meanQ=np.array(hist_meanQ),
                Q=Q, Q0=Q0, rank0=rank0, final_rank=prev_rank)


on = run(reactive=True)
off = run(reactive=False)

fig, axes = plt.subplots(2, 2, figsize=(13, 9.5))

# ── 1. 福利代价 ──────────────────────────────────────────────
ax = axes[0, 0]
ax.plot(on["meanQ"], color="crimson", label="反应性开启（学校追逐排名）")
ax.plot(off["meanQ"], color="steelblue", label="对照组（学校无视排名）")
ax.set_title("福利代价：全体学校平均真实质量")
ax.set_xlabel("期"); ax.set_ylabel("平均 Q")
ax.legend(); ax.grid(alpha=0.3)

# ── 2. 信息代价 ──────────────────────────────────────────────
ax = axes[0, 1]
ax.plot(on["corr"], color="crimson", label="反应性开启")
ax.plot(off["corr"], color="steelblue", label="对照组")
ax.set_title("信息代价：排名与真实质量的 Spearman 相关\n（异质 gaming 摧毁排序的信息含量）")
ax.set_xlabel("期"); ax.set_ylabel("ρ(质量, 排名)")
ax.legend(); ax.grid(alpha=0.3)

# ── 3. Matthew 效应 ─────────────────────────────────────────
ax = axes[1, 0]
hi_fb = run(reactive=True, feedback=0.05, seed=3)   # 高反馈世界，锁定更明显
mid = np.argsort(np.abs(hi_fb["Q0"] - np.median(hi_fb["Q0"])))[:6]
W = 15  # 滑动平均窗口，滤掉期间噪声看趋势
for i in mid:
    smoothed = np.convolve(hi_fb["ranks"][:, i], np.ones(W) / W, mode="valid")
    ax.plot(smoothed, alpha=0.85, lw=1.8)
ax.invert_yaxis()
ax.set_title("初始质量几乎相同的 6 所学校的名次分化\n（自我实现预言 / Matthew 效应；15期滑动平均）")
ax.set_xlabel("期"); ax.set_ylabel("名次（越上越好）")
ax.grid(alpha=0.3)

# ── 4. 锁定效应：预言自我实现的强度可调 ──────────────────────
ax = axes[1, 1]
feedbacks = np.linspace(0, 0.08, 9)
lock_rank, lock_quality = [], []
for fb in feedbacks:
    cr, cq = [], []
    for seed in range(12):
        w = run(reactive=True, feedback=fb, seed=seed)
        # E&S：锁定效应集中在质量相近的学校之间（"cusp schools"）。
        # 取初始质量居中 50% 的学校带，在带内把初始排名对初始质量残差化，
        # 只留下"纯任意噪声"成分，看它能否预测最终排名。
        lo, hi = np.percentile(w["Q0"], [25, 75])
        band = (w["Q0"] >= lo) & (w["Q0"] <= hi)
        rq = stats.rankdata(-w["Q0"][band])
        b1, b0 = np.polyfit(rq, w["rank0"][band], 1)
        noise_part = w["rank0"][band] - (b1 * rq + b0)
        cr.append(stats.spearmanr(noise_part, w["final_rank"][band]).statistic)
        cq.append(stats.spearmanr(-w["Q0"], w["final_rank"]).statistic)
    lock_rank.append(np.mean(cr)); lock_quality.append(np.mean(cq))
ax.plot(feedbacks, lock_rank, "o-", color="crimson",
        label="质量居中带内：ρ(初始排名纯噪声, 最终排名)")
ax.plot(feedbacks, lock_quality, "s-", color="steelblue",
        label="全体：ρ(初始质量, 最终排名)")
ax.set_title("锁定效应：质量相近的学校之间（cusp schools），\n反馈越强，第一年的『纯噪声』越决定最终命运")
ax.set_xlabel("自我实现反馈强度 (排名→资源→质量)")
ax.set_ylabel("Spearman ρ")
ax.legend(fontsize=9); ax.grid(alpha=0.3)

plt.tight_layout()
plt.savefig(FIGDIR / "exp1_reactivity.png", dpi=150)

print("=== 实验 1 结果 ===")
print(f"末期平均真实质量: 反应性开启 {on['meanQ'][-1]:.2f} vs 对照 {off['meanQ'][-1]:.2f}"
      f"  (福利损失 {off['meanQ'][-1]-on['meanQ'][-1]:.2f})")
print(f"末期 排名-质量相关: 开启 {on['corr'][-1]:.3f} vs 对照 {off['corr'][-1]:.3f}")
print(f"末期 平均 gaming 占比: 开启 {on['gaming'][-1]*100:.1f}% vs 对照 {off['gaming'][-1]*100:.1f}%")
print(f"锁定效应: 反馈=0 时 ρ(初始排名,最终排名)={lock_rank[0]:.2f}；"
      f"反馈={feedbacks[-1]:.2f} 时 ={lock_rank[-1]:.2f}")
print(f"图已保存: {FIGDIR}/exp1_reactivity.png")
