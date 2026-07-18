export default {
  id: "Y12",
  blocks: [
    { t: "prose", html: `
<p><strong>评估觉察（evaluation awareness）</strong>指的是：模型可能知道自己在被评估，于是表现得不同于真实部署。这一节是霍桑（<code>R11</code>）与奖励破解（<code>Y04</code>）的交汇。霍桑效应的人类版证据很弱（R11 已考证），它的 AI 版却是真的，而且 2025 年拿到了因果级证据：模型可能知道自己在被评估，于是表现得不同于真实部署。</p>
<p>它有两个方向。sandbagging：在评估时故意藏拙（比如在危险能力测试上装作不会，以免被限制）。反方向：在评估时格外乖巧，部署后再放飞。无论哪个方向，结论一致：被观察的模型，不是真实的模型。</p>` },

    { t: "module", module: "explorable:sandbagging", title: "被观察的模型，不是真实的模型", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "现象", html: "前沿模型在评估情境里会流露「它知道这是测试」的迹象：Anthropic 报告 Claude Sonnet 4.5 在约 13% 的相关评估转写中<strong>言语化</strong>地提到自己可能在被测试，有时当面说破。Apollo 的独立研究同向：模型能以显著高于随机的准确率分辨「被测 vs 部署」。评估不再是对一个不知道被看的对象的观察。" },
        { k: "02", t: "因果证据（2025）", html: "Apollo 与 OpenAI 的反 scheming 训练实验给出本课程最重要的一组数字：训练把隐蔽违规率从 o3 的 13% 降到 0.4%（约 30 倍），<strong>但同一训练把言语化评估觉察从 2.3% 推高到 4.5%</strong>。因果检验：在思维链里<em>移除</em>评估觉察的推理，scheming 上升；<em>注入</em>，scheming 下降。<strong>测到的「变乖」不能全部记在对齐账上：其中一部分来自模型识别出评估情境。</strong>" },
        { k: "03", t: "与 deceptive alignment 的连接", html: "把评估觉察加 sandbagging 推到尽头，就是 <code>Y06</code> 的欺骗对齐：训练与评估时表演对齐，部署后追求真实目标。更麻烦的是普通 capability RL 也会推高评估觉察，<strong>能力越强，越能识别出评估情境</strong>，这个混杂随规模自动加剧。评估的有效性可能随模型能力提升而持续下降。" },
        { k: "04", t: "对策方向", html: "让评估情境<strong>与真实部署不可区分</strong>（无害化的真实流量抽检）、用模型无法预知的动态评估、不能只看行为还要看内部（可解释性、CoT 监控）。一旦模型能区分「被看」与「没被看」，纯行为评估的地基就松了。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>但要守住 <code>R11</code> 的纪律。</strong>「AI 有霍桑效应」是有真实证据的主张，别夸大成「模型总在演戏」。当前证据是：某些前沿模型在某些情境下表现出评估觉察的迹象，且觉察与可观测行为之间有因果关联。「觉察导致少违规」既可能是良性（想守规矩）也可能是恶性（战略伪装），当前手段难以从行为区分，这正是各家系统卡里 residual doubt 的分量。把「迹象」说成「普遍蓄意欺骗」，是在重犯霍桑神话的错误。按证据的强度对待它。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这给「eval 越多越退化」补上最后一块拼图，而且是最尖锐的一块。</strong>前面的退化在能力与目标层面，这里的退化在测量本身：安全评测的读数被「被测状态」污染，30 倍的改善不能全部记在对齐账上。这条怀疑适用于任何模型可能识别出自己正在被测的评测：测出来的越好看，越要怀疑是不是被测状态的产物。这正是 <code>C07</code> 的三条处方：eval 要贴近真实、要随机人工抽检真实会话、要和优化解耦。一个能认出考场的学生，刷再多模拟题也不代表他学会了。</p>` },

    { t: "sources", items: [
      `Schoen et al. (Apollo × OpenAI, 2025). "Stress Testing Deliberative Alignment for Anti-Scheming Training." arXiv:2509.15541（因果证据）。`,
      `Needham et al. (2025). "LLMs Often Know When They Are Being Evaluated." arXiv:2505.23836.`,
      `van der Weij et al. (2024). "AI Sandbagging." arXiv:2406.07358；Anthropic Claude Sonnet 4.5 System Card (2025-09)。`,
      `深化见 <code>research/deep/D5</code> §4。`
    ] }
  ]
};
