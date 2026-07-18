export default {
  id: "R02",
  blocks: [
    { t: "prose", html: `
<p>自我实现预言（self-fulfilling prophecy）是这样一种机制：一个起初为假的情境定义，通过改变人的行为，把自己变成真的。命名者 Robert Merton 1948 年用一个虚构案例讲清了它：Last National Bank 资产充裕，某天流传「它要倒闭」的谣言。谣言当下是假的，但储户不敢赌，纷纷取款；银行从不以现金持有全部资产，在挤兑面前无力兑付，于是真的倒闭了。用 Merton 的原话，这是 "a false definition of the situation evoking a new behavior which makes the originally false conception come true"：一个自信的错误，制造出它自己的虚假证实。</p>` },

    { t: "module", module: "sim:feedback", title: "预言如何坐实自己" },

    { t: "prose", html: `
<p>它的根子是社会学里最古老的一条定理，W. I. Thomas 1928 年写下：<span class="pullquote">"If men define situations as real, they are real in their consequences."<span class="src">Thomas & Thomas, The Child in America, 1928, p.572</span></span></p>
<p>Espeland 与 Sauder 发现，排名正是靠这个机制运转的，而且他们放宽了 Merton 的定义：预言不必起于虚假信念，只要一个期望「一旦被界定为真实，就放大或印证其效果」即可。一个最初只是测量噪声的排名差，会改变申请者、雇主、捐赠者的预期；预期变成真实的资源流向，最终把噪声坐实成真实差距。</p>
<p>这个机制有边界，而且边界被实验测出来了。Salganik 与 Watts 2008 年在人造音乐市场里人为反转歌曲人气（把最不受欢迎的显示为最受欢迎），多数歌曲的假人气确实变成了真人气；但市场整体没有被反转带走，因为最好的那批歌在长期恢复了排名。换句话说：质量决定可能的区间，社会影响决定区间内谁胜出。预言能坐实噪声，坐实不了任意的谎言。细节在 <code>R10</code>。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「自我实现预言就是 Thomas 定理。」</strong>复核结论：Thomas 定理是更宽的命题（信念有实在后果），涵盖信念为真、信念与结果无关的一切情形；自我实现预言只截取其中最隐蔽的一支，即假信念因被相信而变真。另一条常被当铁证的 Pygmalion 实验（随机给学生贴「潜力股」标签、成绩上扬）效应主要限于低年级、复制不稳定，Thorndike 1968 年就提出过方法学批评。引用时带上这条脚注，不要用可疑实证去撑大理论。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你的 benchmark 也会自我实现。</strong>一个被当作权威的分数，哪怕最初只是噪声，也会把资源、注意力和后续训练吸过去，让模型逐渐长成这个 benchmark 所测量的样子，事后反过来印证它的「效度」。排名确实变准了，但那是因为世界已经照着它重塑了自己。这个循环在 <code>R01</code> 出现过，<code>Y09 表演性预测</code>会给它一个带收敛条件的数学形式。</p>` },

    { t: "prose", html: `
<p>留一个问题：MusicLab 里「最好的歌会恢复」依赖一个前提，即存在可辨识的真实质量。在质量本身没有共识的场域（使命各异的法学院、目标各异的模型），恢复的力量还在吗？还是社会影响完全接管？这是把实验室结论外推到制度场域时最需要小心的边界。</p>` },

    { t: "sources", items: [
      `Merton, R. K. (1948). "The Self-Fulfilling Prophecy." <em>The Antioch Review</em> 8(2):193–210.`,
      `Thomas, W. I. & Thomas, D. S. (1928). <em>The Child in America</em>, p.572.`,
      `Salganik, M. J. & Watts, D. J. (2008). "Leading the Herd Astray." <em>Social Psychology Quarterly</em> 71(4):338–355（预言的边界实验）。`,
      `Rosenthal & Jacobson (1968) <em>Pygmalion in the Classroom</em>（注意其争议）。深化见 <code>research/deep/D1</code> §6。`
    ] }
  ]
};
