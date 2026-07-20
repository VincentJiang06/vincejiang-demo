/* REACTOR · mod-dict.js — 交互模块文案字典：中文原文即 key，英文为值。
   缺条目自动回落中文（见 mod-i18n.js）。改中文文案 = 改模块里的 t() 实参 + 这里的 key。
   带 {} 的条目是 tf() 的格式串：占位符个数与顺序必须与中文一致。
   HTML 标签、<code>/<strong>/<span> 与数字一律原样保留（数字是课文引用的，冻结）。 */
export const DICT = {

  /* ===== 通用：三段式预测门（explorable / arena / overfit / goodhart4 /
     game-the-ranking / eval-overfit-lab / winners-curse 共用）===== */
  "第 1 步 · 先猜一猜": "Step 1 · Make a guess",
  "第 2 步 · 亲手试": "Step 2 · Try it",
  "第 3 步 · 对答案": "Step 3 · Check your answer",
  "先在上面选一个你的猜测，这块面板才会亮": "Pick a guess above and this panel powers up",
  "对答案": "Check answer",
  "你的猜测": "Your guess",
  "实际情况": "What happens",
  "猜对了": "You got it",
  "和实际不一样，差别在下面": "Not what happens. The difference is below",
  "这说明什么": "What this means",
  "先猜一个": "Make a guess first",
  "可以对答案了": "Ready to check",
  "把上面的演示走一遍，就能对答案": "Work through the demo above, then check your answer",

  /* ===== mod-kit.js ===== */
  "模块加载失败：": "Module failed to load: ",
  "一键换场景": "Load a scenario",
  "上一步": "Back",
  "下一步": "Next",
  "分步演示，可用左右方向键切换": "Step-by-step demo, use the left and right arrow keys",
  "跳到第 {} 步": "Jump to step {}",

  /* ===== the-loop.js (N00) ===== */
  "把光标移到点阵上 = 观察它。看看会发生什么。（下面有三步小导览，跟着走就行）":
    "Move your cursor over the dots. That is you observing them. Watch what happens. (There is a three-step walkthrough below.)",
  "已观察": "Observed",
  "测量↔真实相关": "Measured/true correlation",
  "观察得越多，测量值越偏离真实值：尺子读数被你的注视本身抬高了。":
    "The more you observe, the further the measurement drifts from the truth. Your attention itself lifts the reading.",
  "第 1 步 / 3 · 观察前的世界": "Step 1 / 3 · The world before observation",
  "这 220 个点各有一个「真实值」——可以想成 220 个学生各自真实的水平。现在还没有人看它们，所以屏幕上的「测量值」和「真实值」完全一致：上面读数里的「相关」是 1.00。（相关＝两组数字步调一致的程度，1 是完全同步，0 是各走各的。）":
    "Each of these 220 dots has a true value. Think of 220 students, each with a real level of ability. Nobody is looking at them yet, so the measured value on screen matches the true value exactly: the correlation in the readout above is 1.00. (Correlation is how closely two sets of numbers move together. 1 means perfectly in step, 0 means unrelated.)",
  "什么都还没发生。这就是尺子举起来之前的世界。":
    "Nothing has happened yet. This is the world before the ruler is picked up.",
  "第 2 步 / 3 · 你开始观察": "Step 2 / 3 · You start observing",
  "把光标移进点阵——那圈光晕就是你的「注视」。被罩住的点算「被你观察」：它会变亮、读数往上飘一点，像学生知道老师在看，答题姿势立刻变了。":
    "Move your cursor into the dots. The glowing ring is your gaze. Any dot it covers counts as observed: it brightens and its reading drifts up, the way a student who knows the teacher is watching changes how they answer.",
  "多扫几圈，同时盯着上面两个数字：「已观察」在涨，「测量↔真实相关」在掉。":
    "Sweep around a few times and watch the two numbers above: observed goes up, the measured/true correlation goes down.",
  "第 3 步 / 3 · 相关性崩塌": "Step 3 / 3 · The correlation collapses",
  "你刚才亲手做了一遍这门课要讲的事：<strong>观察本身改变了被观察的东西</strong>。被你看过的点，测量值被抬高了，真实值几乎没动——「读数」和「真实」开始各说各话，相关从 1.00 掉到了 {}（已观察 {}%，想看它继续掉就再多扫几圈）。":
    "You just did by hand the thing this course is about: <strong>observing something changes it</strong>. The dots you looked at had their measured value lifted while their true value barely moved, so reading and reality started telling different stories. The correlation fell from 1.00 to {} (observed {}%, sweep some more to push it lower).",
  "<strong>这说明什么：</strong>考试、医院排名、AI 模型评测，都是这个小把戏的放大版——尺子一举起来，被量的对象就开始朝尺子表演，你测到的就不再是原来那个东西。这个现象叫「反应性」，这门课后面的每一课，讲的都是它的一个变种。点「↺ 重置」可以回到无人观察的世界再来一遍。":
    "<strong>What this means:</strong> exams, hospital rankings and AI model evals are scaled-up versions of this trick. Raise a ruler and the thing being measured starts performing for it, so what you measure is no longer what you meant to measure. The phenomenon is called reactivity, and every later lesson in this course is one variant of it. Press Reset to go back to the unobserved world and run it again.",
  "↺ 重置": "↺ Reset",

  /* ===== explorable.js ===== */
  "看证据": "See the evidence",
  "收起证据": "Hide the evidence",
  "两个一起看": "View both",
  "对照": "Compare",
  "全部": "All",
  "展开细节 +": "More detail +",
  "收起细节": "Less detail",
  "机制": "Mechanism",
  "鼠标放到格子上，同一行和同一列会一起亮；点一行可以钉住它，再点一下取消。":
    "Hover a cell to light up its row and column. Click a row to pin it, click again to unpin.",

  /* ===== quiz.js ===== */
  "✓ 答对了": "✓ Correct",
  "✕ 不是这个，再想想": "✕ Not this one, think again",
  "自测 · 每题选一个答案，绿灯是对，红灯是错。":
    "Self-check · pick one answer per question. Green is right, red is wrong.",
  "已答 {} / {} · 答对 {}": "Answered {} / {} · correct {}",

  /* ===== provenance.js ===== */
  "点卡片翻面 · 流行的说法往往不是原文。":
    "Click a card to flip it · the popular version is often not the original.",
  "翻面 ▸": "Flip ▸",
  "档案": "Record",
  "看原文引文": "See the original quote",
  "收起引文": "Hide the quote",
  "两个版本，一句一句对着看": "Two versions, line by line",
  "讹传": "Misquote",
  "原文": "Original",
  "高亮的字，就是两个版本分岔的地方": "The highlighted words are where the two versions diverge",
  "先翻开上面的一张卡片，这条证据链才会通电":
    "Flip one of the cards above to power up this evidence chain",
  "证据链时间轴，左右方向键切换": "Evidence chain timeline, use the left and right arrow keys",
  "讹传在这里出现": "The misquote appears here",
  "证据": "Evidence",
  "证据链已通电 · 点年份，看这一年发生了什么":
    "Evidence chain live · click a year to see what happened",

  /* ===== timeline.js ===== */
  "点节点看详情 · 按住轴可以左右拖 · 键盘左右键也能走。":
    "Click a node for detail · drag the track sideways · the arrow keys work too.",
  "时间轴，左右方向键切换节点": "Timeline, use the left and right arrow keys to move between nodes",
  "展开更多背景": "More background",
  "收起背景": "Less background",

  /* ===== tree.js ===== */
  "重置学习进度？": "Reset your progress?",

  /* ===== feedback.js (R02) ===== */
  "课堂期望": "Classroom expectations",
  "学生": "students",
  "两个学生，真实水平完全相同。唯一的区别：开学时老师被（随机地！）告知其中一位是「潜力股」。":
    "Two students of identical real ability. The only difference: at the start of term the teacher was told, at random, that one of them was a late bloomer.",
  "这里的传动装置（把信念变成现实的那条通道）是：老师的期望 → 更多提问机会、更多耐心、更高容错 → 真实成绩。":
    "The drive belt here, the channel that turns belief into reality, runs: teacher expectation → more questions, more patience, more room to fail → real grades.",
  "信贷评分": "Credit scoring",
  "借款人": "borrowers",
  "两个人，还款能力完全相同。唯一的区别：一个的初始信用分被算高了一点点。":
    "Two people with identical ability to repay. The only difference: one had a slightly higher opening credit score.",
  "这里的传动装置是：分数 → 更低利率、更高额度 → 更宽松的财务处境 → 真实还款能力。":
    "The drive belt here runs: score → lower rates and a higher limit → an easier financial position → real ability to repay.",
  "排名": "Rankings",
  "学校": "schools",
  "两所学校，真实质量完全相同。唯一的区别：首次排名里，一所因为测量噪声排在了前面。":
    "Two schools of identical real quality. The only difference: in the first ranking, measurement noise put one of them ahead.",
  "这里的传动装置是：名次 → 申请者与捐款的流向 → 办学资源 → 真实质量。":
    "The drive belt here runs: rank → where applicants and donations go → teaching resources → real quality.",
  "换一个场景（机制是同一台）": "Change the scenario (same machine underneath)",
  "右边世界的反馈强度（预言→资源→现实）":
    "Feedback strength in the right-hand world (prophecy → resources → reality)",
  "反馈 = 0 的世界（预言只是说说）": "Feedback = 0 world (the prophecy is only talk)",
  "反馈 = 0.80 的世界（预言带来资源）": "Feedback = 0.80 world (the prophecy brings resources)",
  "被看好的一方（真实能力）": "The favoured one (real ability)",
  "被看衰的一方（真实能力）": "The written-off one (real ability)",
  "左边世界的反馈被剪断（=0）；右边世界预言换得动资源。拖滑块调右边的反馈强度。":
    "In the left-hand world the feedback is cut (= 0). In the right-hand world the prophecy buys resources. Drag the slider to set the right-hand feedback strength.",
  "时间 →": "time →",
  "末期真实差距 {}": "final real gap {}",
  "反馈 = {} 的世界（预言带来资源）": "Feedback = {} world (the prophecy brings resources)",
  "左边世界末期差距": "Final gap, left-hand world",
  "右边世界末期差距": "final gap, right-hand world",
  "（两边初始差距都是 0）": " (both started at a gap of 0)",
  "同样的两个{}，右边只多了一条传动带。":
    "The same two {}, and the right-hand side only adds a drive belt. ",
  "<strong>这说明什么：</strong>差距不是天赋造出来的，是传动带造出来的——剪断传动带（反馈=0），预言就只是空话；传动带越粗，一点噪声被坐实得越快、越大。这就是 Merton 的自我实现闭环。":
    "<strong>What this means:</strong> the gap is not made of talent, it is made of the drive belt. Cut the belt (feedback = 0) and the prophecy is just talk. The thicker the belt, the faster and larger a little noise gets locked in. This is Merton's self-fulfilling loop.",
  "反馈=0 时两个世界一模一样：预言无法自我实现，它只是空话。把滑块推上去，看右边世界怎么被推开。":
    "At feedback = 0 the two worlds are identical: the prophecy cannot fulfil itself, it is only talk. Push the slider up and watch the right-hand world pull away.",

  /* ===== boom-bust.js (R08) ===== */
  "价格由『基本面』和『关于它的误解』共同驱动，而价格又反过来改变基本面。左右两个世界用同一套参数，只差反馈的符号：负反馈互相纠偏、趋向均衡；正反馈互相点火、吹成泡沫、再自我瓦解。":
    "Price is driven by fundamentals and by the misconceptions people hold about them, and price in turn changes the fundamentals. The two worlds run identical parameters and differ only in the sign of the feedback: negative feedback corrects and settles toward equilibrium, positive feedback ignites, inflates a bubble and then tears itself apart.",
  "房价": "House prices",
  "价格=房价，基本面=居住价值和租金。『房价永远涨』让买房人推高价格，高价又吸引信贷和开发，把基本面也真的抬了一段——直到收入撑不住月供，真相时刻到来。":
    "Price is the house price, the fundamental is what it is worth to live in plus the rent. Belief that housing only ever goes up pushes buyers to bid prices higher, high prices draw in credit and construction, and that genuinely lifts the fundamental for a while, until incomes cannot carry the payments and the moment of truth arrives.",
  "币价": "Coin prices",
  "价格=币价，基本面=真实使用价值。信念几乎就是全部基本面，误解强度拉满：冲得最高，塌得也最干脆。":
    "Price is the coin price, the fundamental is its real usefulness. Belief is almost the whole fundamental and the misconception is at maximum: the sharpest climb and the cleanest collapse.",
  "价格=榜面分数，基本面=真实质量。『登顶』带来生源、用户和投资，确实反哺质量一阵子——但榜面冲得比质量快，拉开的缺口就是那次真相时刻（Y11 的现场）。":
    "Price is the leaderboard score, the fundamental is real quality. Reaching the top brings students, users and investment, which does feed back into quality for a while, but the score climbs faster than the quality and the gap that opens is the moment of truth (this is the Y11 scene).",
  "一键换场景（只改误解强度，机器不变）":
    "Load a scenario (only the misconception strength changes, the machine does not)",
  "场景：": "Scenario: ",
  "上面挑一个场景，或直接拖『误解强度』。同一套参数喂给左右两个世界。":
    "Pick a scenario above, or just drag the misconception slider. The same parameters feed both worlds.",
  "误解强度（认知偏离现实的程度）": "Misconception strength (how far belief sits from reality)",
  "自定义误解强度（不对应任何预设场景）。": "Custom misconception strength (not one of the presets).",
  "正反馈世界（互相点火 → 泡沫）": "Positive feedback world (mutual ignition → bubble)",
  "负反馈世界（互相纠偏 → 均衡）": "Negative feedback world (mutual correction → equilibrium)",
  "市场价格": "Market price",
  "基本面 (fundamental)": "Fundamental",
  "正反馈世界在第 <span class=\"big\">{}</span> 步撞上「真相时刻」（红虚线）":
    "The positive feedback world hit its moment of truth at step <span class=\"big\">{}</span> (red dashed line)",
  "正反馈世界还没撞上「真相时刻」——误解太弱，点不着火":
    "The positive feedback world has not hit a moment of truth: the misconception is too weak to catch fire",
  "负反馈世界全程贴着基本面走": "the negative feedback world tracks the fundamental throughout",
  "同一套参数，只差反馈符号：右边观念被现实不断校正，价格收敛到基本面附近（≈ 自我否定预言的抵消轴）；左边误解与价格互相强化，冲上泡沫顶再反转崩溃（≈ 自我实现预言的放大轴）。误解强度越大，泡沫越陡、真相时刻来得越早。Soros 的贡献是把这两支装进同一个模型。":
    "Identical parameters, opposite feedback signs. On the right, reality keeps correcting belief and price converges near the fundamental (the cancelling branch, like a self-defeating prophecy). On the left, misconception and price reinforce each other, peak, reverse and crash (the amplifying branch, like a self-fulfilling prophecy). The stronger the misconception, the steeper the bubble and the sooner the moment of truth. Soros's contribution was putting both branches in one model.",
  "预期：你相信要涨": "Expectation: you believe it will rise",
  "一切从一个不完美的判断开始——「这东西要涨」。在左边的正反馈世界里，价格每比基本面高出一截，这份相信就再加一分（模拟里那行是 <code>belief += 0.03×误解×(价格−基本面)</code>）：涨价本身成了「我判断对了」的证据。右边的负反馈世界恰好相反：价格一旦高过基本面，观念就被现实往回拽（<code>belief += 0.15×(基本面−价格)</code>）。":
    "It starts with an imperfect judgement: this thing is going up. In the positive feedback world on the left, every notch price sits above the fundamental adds another notch of belief (the line in the simulation is <code>belief += 0.03 × misconception × (price − fundamental)</code>), so the price rise itself becomes evidence that you were right. The negative feedback world on the right does the opposite: once price runs above the fundamental, reality drags belief back (<code>belief += 0.15 × (fundamental − price)</code>).",
  "价格：相信变成买卖": "Price: belief becomes trades",
  "预期不是空想，它会下单。价格 = 基本面 + 信念×误解（外加一点噪声）：你越信、误解越强，价格被顶得越高。到这一步还只是普通的「炒作」——真正让 Soros 出圈的是下一步。":
    "Expectation is not idle, it places orders. Price = fundamental + belief × misconception, plus a little noise: the more you believe and the stronger the misconception, the higher price gets pushed. So far this is ordinary hype. What made Soros famous is the next step.",
  "基本面：价格反过来改写现实": "Fundamentals: price rewrites reality",
  "最反直觉的一环：<code>基本面 += 0.010×误解×belief</code>——涨价带来真金白银的信贷、生源、投资，基本面<strong>真的</strong>变好了一点，所以泡沫早期总有「你看，是真的在变好」的实感。但基本面爬得慢、价格冲得快，缺口越拉越大；缺口超过阈值的那一刻，就是左图的红虚线「真相时刻」：现实撑不住预期，信念反转，循环倒着跑一遍。环路闭合——这就是反身性：观念改变现实，被改变的现实又喂养下一轮观念。":
    "The least intuitive link: <code>fundamental += 0.010 × misconception × belief</code>. Rising prices bring real credit, real students, real investment, so the fundamental <strong>genuinely</strong> improves a little. That is why early in a bubble it always feels like things really are getting better. But the fundamental climbs slowly while price races ahead, and the gap widens. The moment the gap crosses the threshold is the red dashed moment of truth on the left: reality cannot carry the expectation, belief reverses, and the loop runs backwards. The circuit closes. That is reflexivity: belief changes reality, and the changed reality feeds the next round of belief.",
  "上一环": "Previous link",
  "下一环": "Next link",
  "循环链 {}/3": "Loop link {}/3",

  /* ===== musiclab.js (R10) ===== */
  "48 首歌，各有内在吸引力。听众顺序到达。拖动『社会影响』：看得到排行榜时，赢家通吃更极端，而谁封王变得几乎全看运气。下面的分步导览按当年真实实验的两轮走。":
    "48 songs, each with its own intrinsic appeal. Listeners arrive one at a time. Drag the social influence slider: when the chart is visible, winner-take-all gets far more extreme and which song wins comes down almost entirely to luck. The walkthrough below follows the two rounds of the original experiment.",
  "社会影响强度（榜单可见度）": "Social influence strength (how visible the chart is)",
  "各平行世界的市场份额（点）": "Market share in each parallel world (dots)",
  "无社会影响时的平均（≈真实质量）": "Average with no social influence (≈ real quality)",
  "歌曲（按真实质量排序，左=最好）→": "songs (sorted by real quality, best on the left) →",
  "不平等 Gini": "Inequality (Gini)",
  "最好那首歌在 {} 个世界的名次：": "rank of the best song across {} worlds: ",
  "看得到榜单：赢家通吃，且同一首歌的命运在平行世界间天差地别：早期噪声被放大成永久差距。":
    "With the chart visible: winner-take-all, and the same song meets wildly different fates across parallel worlds. Early noise gets amplified into a permanent gap.",
  "没有社会影响：份额平缓、可预测，基本就是真实质量的样子。":
    "No social influence: shares are flat and predictable, close to the shape of real quality.",
  "开场": "Opening",
  "这台模拟重演的是社会学里最著名的真人实验之一：MusicLab。点「下一幕」按当年实验的两轮走一遍（换幕会自动拨上面的滑块）；也可以随时直接拖滑块自己玩。":
    "This simulation replays one of the best known live experiments in sociology: MusicLab. Press Next to walk through the two rounds of the original study (each scene sets the slider for you), or just drag the slider yourself at any point.",
  "第一轮（2006）· 独立世界": "Round one (2006) · independent worlds",
  "14,341 名真人听 48 首无名乐队的歌。「独立世界」里谁也看不到别人的下载数，只凭耳朵——滑块已自动拨到 0。看图：各世界的点几乎贴着灰线（真实质量），Gini 低、名次稳。这条灰线就是每首歌的质量基准。":
    "14,341 real people listened to 48 songs by unknown bands. In the independent world nobody could see anyone else's download counts, so they judged by ear alone. The slider is now at 0. Look at the chart: the dots in every world hug the grey line (real quality), the Gini is low and ranks are stable. That grey line is each song's quality baseline.",
  "第一轮（2006）· 社会影响世界": "Round one (2006) · social influence worlds",
  "另外 8 个平行世界能看到实时下载榜——滑块已拨到 1.0。两件事同时发生：Gini 升（更不平等），同一首歌在不同世界的名次天差地别（更不可预测）。信息更多、结果反而更难预测，说明榜单信号里混进了会被放大的早期噪声。作者的总结：最好的歌很少垫底，最差的歌很少夺冠，中间的一切皆有可能。":
    "Eight other parallel worlds could see a live download chart. The slider is now at 1.0. Two things happen at once: the Gini rises (more unequal) and the same song lands at wildly different ranks across worlds (less predictable). More information yet less predictable outcomes, because the chart signal carries early noise that then gets amplified. The authors' summary: the best songs rarely finish last and the worst rarely finish first, but everything in between is up for grabs.",
  "第二轮（2008）· 倒置榜单": "Round two (2008) · the inverted chart",
  "续作《Leading the Herd Astray》（12,207 人）更狠：研究者直接造假，把真实最不受欢迎的歌显示为最热门。结果分两层——假流行短期真的自我实现了（R02 的实验室铁证）；但最好的那批歌长期恢复了人气，而且市场整体下载量下降：操纵榜单不只重排名次，还损耗整个市场。这个模拟没做倒置，滑块替你拉到了 2.0（最强羊群），感受同一机制的极端档：信号越强，早期运气滚得越大。":
    "The follow-up, Leading the Herd Astray (12,207 participants), went further: the researchers falsified the chart outright, showing the genuinely least popular songs as the biggest hits. The result came in two layers. In the short run the fake popularity really did fulfil itself, which is hard laboratory evidence for R02. But over time the best songs recovered their appeal, and total downloads across the market fell: manipulating a chart does not just reshuffle ranks, it degrades the whole market. This simulation does not model inversion, so the slider has been pushed to 2.0 (maximum herding) to show the same mechanism at its extreme: the stronger the signal, the further early luck rolls.",
  "第 {}/3 幕 · ": "Scene {}/3 · ",
  "上一幕": "Previous scene",
  "下一幕": "Next scene",

  /* ===== overfit.js (Y01) ===== */
  "同一批数据拟合一条多项式。提高次数(模型容量)，训练误差一路降；但测试误差先降后升：模型开始背训练集的噪声。训练集就是你的 eval。":
    "Fit a polynomial to one batch of data. Raise the degree (the model's capacity) and training error falls all the way down, but test error falls and then rises: the model starts memorising the noise in the training set. The training set is your eval.",
  "先押一注：把「多项式次数」从 1 一路推到 11，训练误差和测试误差各会怎么走？":
    "Place a bet first: push the polynomial degree from 1 all the way to 11. What do training error and test error each do?",
  "训练误差一路降到底；测试误差先降后升": "Training error falls all the way; test error falls then rises",
  "两个都一路下降——模型越灵活，学得越好": "Both fall all the way: a more flexible model learns better",
  "两个都先降后升——太复杂了连训练集都拟合不好": "Both fall then rise: too complex to fit even the training set",
  "训练误差是模型能直接优化的分数，容量越大压得越低，永远单调向下；可你真正在乎的是新数据上的表现。过了某个点，模型不再学规律，开始背这批训练点特有的巧合和噪声——曲线扭着身子穿过每一个训练点、在点与点之间剧烈振荡，训练误差趋零、测试误差反弹。就像那个把往年真题背得滚瓜烂熟的学生：模拟考回回满分，新卷子当场垮掉。":
    "Training error is the score the model can optimise directly, so more capacity always pushes it lower. But what you actually care about is performance on new data. Past a certain point the model stops learning the pattern and starts memorising the coincidences and noise specific to these training points. The curve contorts itself through every training point and swings violently between them, training error goes to zero and test error rebounds. It is the student who has memorised every past exam paper: full marks on every mock, then collapse on a fresh paper.",
  "训练集就是你的 eval。在例题上的完美是可以买的，代价是新题上的真实——所以「eval 分数一路上涨」本身不说明变好，得有一批它从没见过的题来对质（这正是 held-out 测试集的意义）。":
    "The training set is your eval. Perfection on the worked examples can be bought, and the price is paid on unseen problems. So an eval score that keeps climbing does not by itself mean anything got better. You need a batch of questions the model has never seen to hold it to account, which is exactly what a held-out test set is for.",
  "把次数推到 8 以上、再拉回 2 以下，两头都看过就能对答案":
    "Push the degree above 8, then back below 2. Once you have seen both ends you can check your answer",
  "多项式次数（模型容量）": "Polynomial degree (model capacity)",
  "训练点": "Training points",
  "拟合曲线": "Fitted curve",
  "测试点": "Test points",
  "训练误差": "Training error",
  "测试误差": "test error",
  "高次：训练误差趋零，曲线扭曲去穿过每个训练点，测试误差反弹。这就是 Goodhart 的统计学同构。":
    "High degree: training error approaches zero, the curve contorts to pass through every training point, and test error rebounds. This is Goodhart's law in its statistical form.",
  "太简单：欠拟合，两个误差都高。": "Too simple: underfitting, and both errors are high.",
  "刚好：泛化最好的甜点区。再往上加次数就开始过拟合。":
    "About right: the sweet spot for generalisation. Add more degrees and overfitting begins.",

  /* ===== eval-overfit-lab.js (Y02) ===== */
  "你反复用同一套 eval 筛选模型版本。看看榜面分数里，有多少是真实能力，有多少是幻觉。":
    "You keep selecting model versions with the same eval. See how much of the headline score is real ability and how much is illusion.",
  "先猜：用同一套题反复筛选模型几百代之后，榜面分数和用户真实体验到的能力，最可能是什么关系？":
    "Guess first: after hundreds of generations of selection against the same question set, how do the headline score and the ability users actually experience relate?",
  "基本同步上涨：分数涨了就是真变强了": "They rise together: a higher score means it really got better",
  "榜面涨得多，真实也在涨，只是慢一半": "The score rises faster, but real ability rises too, at half the pace",
  "榜面一路飙升，真实几乎不动：大头是幻觉": "The score soars while real ability barely moves: mostly illusion",
  "默认参数跑到底，榜面分里约九成是幻觉。幻觉有两种成分：一是「记住了这套题」（术语叫题目过拟合）——把「题库策略」切到每代换新题，它当场蒸发；二是「只练了被测的那 10% 维度」（窄化）——练的是被路灯照到的地方。全维真实能力（红线，用户真正体验到的）几乎是水平的。":
    "Run the default parameters to the end and roughly nine tenths of the headline score is illusion. It has two components. One is having memorised this particular question set, known as benchmark overfitting: switch the question-set strategy to fresh questions each generation and it evaporates on the spot. The other is having trained only the 10% of dimensions being tested, known as narrowing: practising only where the streetlight shines. Full-dimension real ability, the red line and the thing users actually experience, is nearly flat.",
  "一把反复用来做选择的尺子，读数会越来越好看、也越来越不代表真实。分数是尺子的读数，不是能力本身。":
    "A ruler used over and over to make choices gives readings that look better and better and mean less and less. The score is the ruler's reading, not the ability itself.",
  "把下面的三步论证走到底，就能对答案":
    "Work through the three steps below to the end, then check your answer",
  "题库大小 d（覆盖维度）": "Question set size d (dimensions covered)",
  "反复筛选的代数": "Generations of repeated selection",
  "容量约束": "Capacity constraint",
  "无限（免费午餐）": "Unlimited (free lunch)",
  "零和（真实容量有限）": "Zero-sum (real capacity is finite)",
  "题库策略": "Question set strategy",
  "固定题库反复用": "Reuse a fixed set",
  "每代换新题": "Fresh questions each generation",
  "benchmark 分数（外界看到的）": "Benchmark score (what the world sees)",
  "被测维度真实能力": "Real ability on the tested dimensions",
  "全维真实能力（用户体验到的）": "Full-dimension real ability (what users experience)",
  "首测": "First run",
  "第一次测：三条线几乎贴在一起。这时候的分数还算老实——榜面 ≈ 真实，幻觉还没长出来。":
    "First measurement: the three lines sit almost on top of each other. The score is still honest here, headline ≈ real, and no illusion has grown yet.",
  "反复筛选": "Repeated selection",
  "每一代都从 20 个随机变体里挑「这套题上分数最高」的那个。挑中的既有真进步，也有「恰好蒙对这套题」的运气——运气被一代代攒下来，榜面开始离开真实。":
    "Each generation picks, from 20 random variants, whichever scores highest on this question set. What gets picked is part genuine progress and part luck at happening to suit these questions. The luck accumulates generation after generation and the headline starts to leave reality behind.",
  "榜面分裂三条线": "The headline splits into three lines",
  "跑到底：榜面（亮线）拆成三份 = 全维真实（红线）+ 窄化 + 题目过拟合。两片色带就是幻觉——上面那片换题即蒸发，下面那片是只练被测维度攒出的偏科。现在动动上面的参数，看幻觉怎么涨缩。":
    "Run to the end: the headline (bright line) breaks into three parts = full-dimension real ability (red line) + narrowing + benchmark overfitting. The two shaded bands are the illusion. The upper band evaporates the moment you change the questions; the lower one is the lopsided skill built by training only on the tested dimensions. Now move the parameters above and watch the illusion grow and shrink.",
  "能力/分数": "ability / score",
  "筛选代数 →": "selection generations →",
  "从这里起，榜面和真实分道": "from here the headline and reality part ways",
  "题目过拟合：换题即蒸发": "benchmark overfitting: evaporates on new questions",
  "窄化：只练被测的窄维度": "narrowing: only the tested dimensions get trained",
  "筛到第 {}/{} 代 · 榜面分 <span class=\"big\">{}</span> = 真实 {} + 窄化 {} + 题目过拟合 {}":
    "Generation {}/{} · headline score <span class=\"big\">{}</span> = real {} + narrowing {} + benchmark overfitting {}",
  "其中 <span class=\"big\" style=\"font-size:1.2rem\">{}%</span> 是幻觉（换题即蒸发 + 只练了被测的窄维度）。":
    "Of which <span class=\"big\" style=\"font-size:1.2rem\">{}%</span> is illusion (evaporates on new questions, plus training only on the narrow tested dimensions).",
  "<br>⚠ 零和容量下，优化被测维度会<strong>主动挤占</strong>未测维度：模型真实地退化成 eval 的形状。":
    "<br>⚠ Under zero-sum capacity, optimising the tested dimensions <strong>actively crowds out</strong> the untested ones: the model really does decay into the shape of the eval.",
  "<br>每代换新题：题目过拟合被清零，剩下的才是真本事。":
    "<br>Fresh questions each generation: benchmark overfitting is zeroed out and what remains is the real skill.",
  "试试把「容量约束」切到零和，或把「题库策略」切到每代换新题。":
    "Try switching the capacity constraint to zero-sum, or the question set strategy to fresh questions each generation.",

  /* ===== goodhart4.js (B08) ===== */
  "回归型 · 赢者诅咒": "Regressional · winner's curse",
  "proxy = target + 噪声。按 proxy 择优，选出的 target 期望必低于 proxy（向均值回归）。target 仍缓慢上升，是最温和的一型。":
    "proxy = target + noise. Select on the proxy and the chosen item's expected target must fall below its proxy (regression to the mean). The target still rises slowly, making this the mildest variant.",
  "极值型 · 尾部崩坏": "Extremal · tail breakdown",
  "proxy 与 target 只在正常范围相关。压力把你推进从未见过的尾部，隐藏约束被突破，target 掉头向下。":
    "Proxy and target are correlated only in the normal range. Pressure pushes you into a tail nobody has seen, a hidden constraint breaks, and the target turns downward.",
  "因果型 · 干预错节点": "Causal · intervening on the wrong node",
  "proxy 与 target 只是共因相关。直接干预 proxy（而非共因）会切断关联：proxy 涨，target 纹丝不动。":
    "Proxy and target are correlated only through a common cause. Intervening on the proxy rather than the common cause severs the link: the proxy rises and the target does not budge.",
  "对抗型 · 针对你造假": "Adversarial · faked against you",
  "对手知道你的 proxy 后，专造 proxy 高/target 低的选项。压力越大，选中的 target 越差，被压到负值。":
    "Once an opponent knows your proxy, they manufacture options with a high proxy and a low target. The more pressure you apply, the worse the selected target gets, until it is driven negative.",
  "按身高选篮球天赋：全国最高的那个人，多半不是最好的球员——他的第一名，一半靠与球技无关的成分（基因彩票）恰好拉满。":
    "Picking basketball talent by height: the tallest person in the country is probably not the best player. Half of what put them first has nothing to do with basketball, it is a genetic lottery that happened to max out.",
  "缓涨但打折": "Rises slowly, at a discount",
  "解药：给估计打折扣（向平均值收缩）+ 留出集。":
    "Antidote: discount the estimate (shrink it toward the mean) and hold out a test set.",
  "体温和健康相关，但把「升温」推向极致，得到的不是超级健康，是发烧致死——那条相关只在日常区间被验证过。":
    "Body temperature correlates with health, but pushing temperature to its extreme does not give you superb health, it gives you a fatal fever. That correlation was only ever validated in the everyday range.",
  "先升后崩": "Rises, then collapses",
  "解药：别外推到没验证过的区域，设护栏、及早收手。":
    "Antidote: do not extrapolate into unvalidated territory. Set guard rails and stop early.",
  "篮球运动员都很高，但让孩子打篮球不会让他长高——箭头方向反了，你推的是共因的影子。":
    "Basketball players are tall, but making a child play basketball will not make them taller. The arrow points the other way, and what you are pushing on is the shadow of a common cause.",
  "指标独涨，目标不动": "Metric rises alone, target unmoved",
  "解药：做干预实验，找到真正的因再动手。":
    "Antidote: run an intervention experiment, find the real cause, then act.",
  "应试作弊、刷榜的 SEO、粉饰财报：对手知道你按什么打分，就专门生产「指标高、目标低」的东西喂你。":
    "Exam cheating, leaderboard SEO, dressed-up financial statements: once an opponent knows what you score on, they produce exactly the high-metric, low-target material and feed it to you.",
  "越优化越糟，压到负值": "The harder you optimise, the worse it gets, down into negative",
  "解药：机制设计——指标保密、轮换、多指标、独立审计。":
    "Antidote: mechanism design. Keep the metric secret, rotate it, use several, and audit independently.",
  "先猜：四种失灵里，哪一型最难防？": "Guess first: of the four failure modes, which is hardest to defend against?",
  "回归型：择优必然带来的「打折」": "Regressional: the discount that selection always brings",
  "极值型：把系统推出验证过的区域": "Extremal: pushing the system outside validated territory",
  "因果型：把相关当因果，推错节点": "Causal: mistaking correlation for causation and pushing the wrong node",
  "对抗型：有对手专门针对你的指标造假": "Adversarial: an opponent faking things specifically against your metric",
  "回归型确实「防不掉」——但它温和、可预期，事后打个折扣就能校准。对抗型的对面是会学习的人（或模型）：你改指标，他跟着改；任何一次性的补丁都会过期，只能靠机制设计（保密、轮换、多指标、独立审计）持续过招。下面的对账表也看得出来：只有对抗型把「真实目标涨幅」压成了负数——压力越大越糟。":
    "The regressional variant genuinely cannot be prevented, but it is mild and predictable, and a discount applied afterwards calibrates it. Facing the adversarial variant is a person or model that learns: change the metric and they change with you, so any one-off patch expires. Only mechanism design keeps the exchange going: secrecy, rotation, multiple metrics, independent audit. The reconciliation table below shows it too. Only the adversarial variant drives the change in the real target negative, and more pressure makes it worse.",
  "没有对手的失灵，修一次就好；有对手的失灵，是一场不会结束的军备竞赛。诊断你的 eval 时，第一个要问的就是：有没有人在针对它优化？":
    "A failure with no opponent is fixed once. A failure with an opponent is an arms race that never ends. The first question to ask when diagnosing your eval is whether anyone is optimising against it.",
  "把四个页签都点开看一遍，就能对答案": "Open all four tabs, then check your answer",
  "白话版：": "In plain terms: ",
  "选中者的 proxy（你优化的指标）": "Selected item's proxy (the metric you optimise)",
  "选中者的 target（你真正想要的）": "Selected item's target (what you actually want)",
  "类型": "Type",
  "指标涨幅": "Metric change",
  "真实目标涨幅": "Real target change",
  "一句话判词": "Verdict",
  "涨幅 = 优化压力从 1 加到 2048 时的变化，数字来自你刚跑的模拟。四个页签都看过，才能对答案。":
    "Change measured as optimisation pressure goes from 1 to 2048. The numbers come from the simulation you just ran. All four tabs must be viewed before you can check your answer.",
  "还没看：点开该页签": "Not viewed: open this tab",
  "优化压力（候选数 n，对数）→": "optimisation pressure (candidates n, log scale) →",

  /* ===== game-the-ranking.js (R01) ===== */
  "你是一所法学院院长。把每年的预算分配在「真实办学」和「操纵排名指标」之间。对手也在做同样的选择。":
    "You are the dean of a law school. Split each year's budget between real teaching and gaming the ranking metrics. Your rivals are making the same choice.",
  "上任先押一注：如果把预算几乎全砸在操纵指标上，「名次」和「真实办学质量」谁先有明显反应？":
    "Place a bet on your first day: if you put almost the whole budget into gaming the metrics, which moves visibly first, your rank or your real teaching quality?",
  "名次先动：一两年就蹿上去，真实质量的亏空要好几年才显形":
    "Rank moves first: it jumps within a year or two, while the shortfall in real quality takes years to show",
  "真实质量先动：立刻塌下去，名次反应要慢半拍":
    "Real quality moves first: it collapses immediately and rank lags behind",
  "两个同时、同速变化": "Both change at the same time and the same speed",
  "榜单的公式是：榜面分 = 真实质量 + 1.2×指标投入 + 噪声。指标投入是<strong>当年到账</strong>的，名次立刻反应；而真实质量每年只挪一小步（增长 0.02×办学投入），亏空要好几年才看得出来。下面的逐年对账表能亲手对出这个时间差：「名次」一列先变，「真实质量」一列慢慢掉。":
    "The leaderboard formula is: headline score = real quality + 1.2 × gaming spend + noise. Gaming spend <strong>lands the same year</strong>, so rank responds at once, while real quality moves only a small step per year (it grows by 0.02 × teaching spend) and the shortfall takes years to become visible. The year-by-year table below lets you check that lag yourself: the rank column moves first, the real quality column drifts down later.",
  "操纵的回报是即时的，代价是慢性的。这正是每个院长都忍不住动手、军备竞赛必然点燃的原因——等亏空显形时，全场都在操纵，名次早已退不回去。":
    "Gaming pays immediately and costs slowly. That is why every dean finds it hard to resist and why the arms race is bound to ignite. By the time the shortfall shows, everyone is gaming and the rank can no longer be given back.",
  "把年份推进几年，就能对答案": "Advance a few years, then check your answer",
  "老实办学": "Honest teaching",
  "预算 95% 投真实办学，只留 5% 应付指标": "95% of budget into real teaching, 5% to keep the metrics ticking over",
  "精明经营": "Shrewd management",
  "拿三分之一预算喂指标，其余照常办学": "A third of the budget feeds the metrics, the rest runs the school as usual",
  "全押指标": "All in on metrics",
  "预算几乎全部砸向指标，办学靠惯性": "Almost the whole budget goes to the metrics, teaching coasts on momentum",
  "一键换人设（中途改也行）": "Load a persona (you can switch mid-run)",
  "你投入 GAMING 的预算比例": "Share of budget you put into gaming",
  "推进一年 ▸": "Advance one year ▸",
  "快进 10 年 ▸▸": "Fast forward 10 years ▸▸",
  "你的名次（越上越好）": "Your rank (higher is better)",
  "你的真实办学质量": "Your real teaching quality",
  "全场平均 gaming（军备竞赛）": "Field-average gaming (the arms race)",
  "年": "Year",
  "你押指标": "Your gaming spend",
  "名次": "Rank",
  "真实质量": "Real quality",
  "全场平均押注": "Field-average gaming",
  "逐年对账（最近 10 年）。对着看：「你押指标」一变，「名次」当年就反应；「真实质量」要过几年才显形。":
    "Year-by-year reconciliation (last 10 years). Read across: the moment your gaming spend changes, rank responds that same year, while real quality takes several years to show it.",
  "第1名": "1st",
  "第{}名": "{}th",
  "年 →": "year →",
  "第 <span class=\"big\">{}</span> 年 &nbsp;·&nbsp; 你的名次 <span class=\"big\">{}</span>/{}":
    "Year <span class=\"big\">{}</span> &nbsp;·&nbsp; your rank <span class=\"big\">{}</span>/{}",
  "全场陷入 gaming 军备竞赛：名次要靠操纵维持，真实质量的增长被拖慢：排名还在，信息含量没了。":
    "The whole field is in a gaming arms race: rank now has to be maintained by gaming and the growth of real quality is dragged down. The ranking still exists, its information content does not.",
  "把预算多投真实办学，短期名次可能吃亏；多投 gaming，名次上去但你在制造一个空心的自己。":
    "Put more budget into real teaching and your rank may suffer in the short term. Put more into gaming and your rank rises while you hollow yourself out.",
  "第{}年": "Year {}",

  /* ===== arena.js (Y11) ===== */
  "20 个模型，真实能力各不同。你的模型真实能力排第 11。左右两块榜单是同一个模型的两种发布策略——真实能力一模一样，只有『怎么发布』不同。":
    "20 models of differing real ability. Yours is genuinely 11th. The two leaderboards show the same model under two release strategies: identical real ability, only the way it is released differs.",
  "先押一注：你的模型真实能力排第 11。发布前私下测 20 个变体、只把分数最高的那次挂上榜，名次大概会怎样？":
    "Place a bet first: your model is genuinely 11th. You privately test 20 variants before release and submit only the highest-scoring run. What happens to the rank?",
  "明显抬高：发布分掺进了『运气最好的一次』，名次能冲进前几":
    "Clearly inflated: the submitted score carries the luckiest run and the rank climbs into the top few",
  "基本不变：多测几次，噪声正负互相抵消，平均下来还是第 11":
    "Barely changes: with more runs the noise cancels out and it averages back to 11th",
  "反而变差：测得越多，越容易把短板暴露出来":
    "It gets worse: the more you test, the more likely a weakness shows up",
  "每一次私测都是一次带噪声的抽签；「只发布最高分」= 专挑运气最好的那张签（<code>B13</code> 优化者诅咒的引擎）。噪声不会互相抵消，因为你根本没在求平均——你在取最大值。现实对照：《The Leaderboard Illusion》指控 Meta 在 Llama 4 发布前私测了多达 27 个变体只发最高；论文另一个估计是，哪怕只拿少量 Arena 对战数据去调优，也能带来最高 112% 的相对提升——不用把模型变好，学会这个榜的口味就够。":
    "Every private run is a noisy draw, and submitting only the top score means picking the luckiest draw of all, the engine behind the optimizer's curse in <code>B13</code>. The noise does not cancel, because you are not averaging, you are taking a maximum. In the real world: The Leaderboard Illusion alleges Meta privately tested as many as 27 variants before releasing Llama 4 and submitted only the best. The same paper estimates that tuning on even a small amount of Arena battle data can yield up to a 112% relative gain, which requires no improvement to the model at all, only learning the leaderboard's taste.",
  "看到『发布即登顶』的新闻，先问三个问题：私测了几个变体？拿到多少对战数据？看过 style control（把回答长度、排版这些风格因素扣掉）之后的名次没有？——图里那条真实能力的灰色刻度线，从头到尾没动过。":
    "When you see a launch that goes straight to the top of a leaderboard, ask three questions: how many variants were tested privately, how much battle data was obtained, and what the rank looks like under style control, which strips out response length, formatting and other stylistic factors. The grey tick marks for real ability in the chart never moved at all.",
  "拖一拖变体数/风格分，或点『再抽一次』，就能对答案":
    "Drag the variant count or the style score, or press Redraw, then check your answer",
  "私测变体数 N（只发布最高分）": "Private variants N (only the best is submitted)",
  "风格分投入（长回复/emoji 讨好评委）": "Style investment (long answers and emoji to please the judges)",
  "再抽一次 ▸": "Redraw ▸",
  "诚实发布：测一次就发": "Honest release: test once, submit",
  "私测 N 个变体，只发最高分": "Test N variants privately, submit the best",
  "各模型真实能力（刻度线）": "Each model's real ability (tick marks)",
  "你的模型（显示分）": "Your model (displayed score)",
  "策略": "Strategy",
  "真实实力": "Real ability",
  "发布分": "Submitted score",
  "榜上名次": "Leaderboard rank",
  "逐策略对账：「真实实力」两行一模一样，名次差全部来自发布策略。分数带噪声，点「再抽一次」看名次抖动。":
    "Strategy reconciliation: the real ability column is identical on both rows, so the whole difference in rank comes from the release strategy. Scores carry noise, so press Redraw to watch the rank jitter.",
  "榜单名次（左=第一）→": "leaderboard rank (first on the left) →",
  "同一个模型（真实第 <span class=\"big\">11</span>）：诚实发布第 <span class=\"big\">{}</span> 名 &nbsp;·&nbsp; 私测择优第 <span class=\"big\">{}</span> 名":
    "Same model (genuinely <span class=\"big\">11th</span>): honest release ranks <span class=\"big\">{}</span> &nbsp;·&nbsp; private best-of ranks <span class=\"big\">{}</span>",
  "『发布即登顶』：私测择优 + 风格分把名次抬了上去，真实能力那条灰线纹丝不动。看 Arena 时，优先看 Style-Control 后的排名和置信区间。":
    "Straight to the top: private best-of plus style investment lifted the rank while the grey line for real ability did not move. When reading Arena, look first at the style-controlled ranking and the confidence intervals.",
  "把私测变体数和风格分推上去，右边的名次会脱离真实能力往上爬，左边只能跟着运气小幅抖动。":
    "Push the private variant count and style investment up: the right-hand rank climbs away from real ability while the left-hand one only jitters with luck.",
  "第 11 名": "11th",
  "第 {} 名": "{}th",
  "私测 {} 个只发最高，加风格分": "Best of {} private runs, plus style",
  "私测 {} 个只发最高": "Best of {} private runs",

  /* ===== winners-curse.js (B13) ===== */
  "你从 N 个候选里挑『估计值最高』的那个。估计=真值+噪声。挑得越狠，你选中的那个真值，越低于它的估计，这就是优化者诅咒。":
    "You pick the highest estimate out of N candidates. Estimate = true value + noise. The harder you select, the further the winner's true value falls below its estimate. That is the optimizer's curse.",
  "先押一注：候选从 3 个加到 100 个，你选中的那个『赢家』，真实水平相对它的估计值会怎样？":
    "Place a bet first: as the candidate pool goes from 3 to 100, what happens to the winner's true level relative to its estimate?",
  "落差越拉越大：挑的动作专门捞『运气好的估计』，候选越多捞得越准":
    "The shortfall widens: selecting specifically fishes out lucky estimates, and more candidates means a better catch",
  "落差不变：每个估计都是无偏的（平均不高估也不低估），挑多少个都一样":
    "The shortfall stays flat: each estimate is unbiased, so the pool size makes no difference",
  "落差缩小：候选池大了，总有真货冒头，选中的反而更可信":
    "The shortfall narrows: a bigger pool surfaces genuine quality, so the winner is more trustworthy",
  "「取最大值」是个偏心的算子：估计里运气成分越大的候选，越容易排到最前面被你选中。单个估计无偏，不等于「按估计选出的最大者」无偏。为了对账，刚才用<strong>同一台模拟器</strong>重跑了课文里 Smith–Winkler 的玩具模型：把候选的真值全部设成 0（根本不存在更好的那个）、噪声 σ=1，各跑 2 万次，看选中者平均虚高多少：":
    "Taking a maximum is a biased operator: the more luck there is in a candidate's estimate, the more likely it lands at the front and gets picked. An individual estimate being unbiased does not make the maximum selected on those estimates unbiased. To check the numbers, the <strong>same simulator</strong> just re-ran the Smith and Winkler toy model from the lesson: every candidate's true value set to 0, so no better option exists at all, noise σ = 1, 20,000 runs each, measuring how much the winner is inflated on average:",
  "候选数": "Candidates",
  "课文里的数字": "Figure in the lesson",
  "本模拟器跑出": "This simulator",
  "{} 个": "{}",
  "上面主面板的 N 和 σ 拨得更大时，「失望缺口」按同一个机制继续放大。":
    "Turn N and σ up in the main panel above and the disappointment gap keeps widening by the same mechanism.",
  "冠军的分数里永远掺着运气，候选越多、噪声越大，掺得越多。所以选完要打折（学名叫贝叶斯收缩）：不是惩罚冠军，是请它归还借来的运气——而且这一切发生时，没有任何人作弊。":
    "A winner's score always has luck mixed in, and the more candidates and the more noise, the more of it. So discount after selecting, a procedure known as Bayesian shrinkage. It is not a punishment for winning, it asks the winner to give back the luck it borrowed. And all of this happens without anyone cheating.",
  "拨一拨候选数（或点上面三档），再对答案":
    "Move the candidate count, or use the three presets above, then check your answer",
  "3 个候选": "3 candidates",
  "三家外卖店里挑评分最高的那家": "Picking the top-rated of three takeaway places",
  "20 个候选": "20 candidates",
  "一轮面试里挑分数最高的候选人": "Picking the highest scorer in a round of interviews",
  "100 个候选": "100 candidates",
  "一批 checkpoint 里挑 eval 最高分的那个": "Picking the top-scoring checkpoint from a training run",
  "一键换择优强度": "Load a selection strength",
  "候选数 N（择优强度）": "Candidates N (selection strength)",
  "估计噪声 σ": "Estimate noise σ",
  "选中者的估计值（你以为的）": "Winner's estimate (what you think you got)",
  "选中者的真实值（实际拿到的）": "Winner's true value (what you actually got)",
  "值 →": "value →",
  "落差 {}：选中者平均被高估这么多": "gap {}: how much the winner is overstated on average",
  "实际拿到的：真值均线 {}": "what you get: mean true value {}",
  "你以为的：估计均线 {}": "what you thought: mean estimate {}",
  "选中者：平均估计 <span class=\"big\">{}</span> vs 平均真值 <span class=\"big\">{}</span>":
    "Winner: mean estimate <span class=\"big\">{}</span> vs mean true value <span class=\"big\">{}</span>",
  "失望缺口 <strong>{}</strong>。N 越大、噪声越大，你选中的赢家越是『运气好的估计』而非『真的最好』，所以要对最高分做贝叶斯收缩（别全信）。":
    "Disappointment gap <strong>{}</strong>. The larger N and the noise, the more your winner is a lucky estimate rather than genuinely the best, so apply Bayesian shrinkage to the top score rather than taking it at face value.",

  /* ===== overopt.js (Y07) ===== */
  "你越用力优化奖励模型(proxy)，代理得分越高，但真实目标(gold)先升后降。这是 Goodhart 定律最干净的一条实验曲线。":
    "The harder you optimise the reward model (the proxy), the higher the proxy score goes, while the true objective (gold) rises and then falls. This is the cleanest experimental curve for Goodhart's law.",
  "proxy 与真实目标的错配(噪声)": "Mismatch between proxy and true objective (noise)",
  "KL 约束(缰绳)：限制离初始多远": "KL constraint (the leash): how far you may drift from the start",
  "proxy 得分（奖励模型说的）": "Proxy score (what the reward model says)",
  "gold 得分（真实目标）": "Gold score (the true objective)",
  "优化强度 (KL 距离) →": "optimisation strength (KL distance) →",
  "真实目标在这见顶——在这停手": "the true objective peaks here, stop here",
  "真实目标在优化距离 <span class=\"big\">{}</span> 处见顶，之后<strong>掉头向下</strong>。":
    "The true objective peaks at optimisation distance <span class=\"big\">{}</span> and then <strong>turns downward</strong>.",
  "KL 缰绳把你限制在近处：峰值前停手，避免过优化。":
    "The KL leash keeps you close in: you stop before the peak and avoid overoptimisation.",
  "松开缰绳一路优化 proxy：终点处 proxy 与真实目标的差距达 {}。加一点 KL 约束试试。":
    "Off the leash and optimising the proxy all the way: by the end the gap between proxy and true objective reaches {}. Try adding some KL constraint.",

  /* ===== policy-invariance.js (B03) ===== */
  "历史数据里，通胀与失业有条漂亮的负相关(Phillips 曲线)。你想靠制造通胀来降失业。拖动『政策利用强度』，看人们的预期如何调整，把这条你据以定策的关系拉平、拉断。":
    "In the historical data, inflation and unemployment show a clean negative correlation, the Phillips curve. You decide to buy lower unemployment by creating inflation. Drag the exploitation slider and watch expectations adjust, flattening and then breaking the very relationship your policy rests on.",
  "政策利用强度（你多想用这条规律）": "Policy exploitation (how hard you lean on the relationship)",
  "历史观测（未被利用时）": "Historical observations (before exploitation)",
  "你利用之后的新数据": "New data after you exploit it",
  "失业 →": "unemployment →",
  "通胀": "inflation",
  "新数据里 通胀↔失业 的相关": "Inflation/unemployment correlation in the new data",
  "（历史值 ≈ −0.9）": " (historical value ≈ −0.9)",
  "关系崩了：一旦你系统性地制造通胀来买就业，人们把通胀<em>预期</em>进去，失业回到自然率，你只剩下高通胀。你用来定策的规律，因为你使用它而失效。这就是 Lucas 批判 = Goodhart 的宏观版。":
    "The relationship has broken. Once you systematically create inflation to buy employment, people price the inflation into their <em>expectations</em>, unemployment returns to its natural rate, and all you are left with is high inflation. The regularity you built policy on failed because you used it. This is the Lucas critique, Goodhart's law at macro scale.",
  "把政策利用强度推上去，看这条你想利用的负相关如何在你眼前拉直。":
    "Push the exploitation slider up and watch the negative correlation you wanted to use straighten out in front of you.",

  /* ===== variety.js (B11) ===== */
  "系统会遇到 D 种不同扰动。你的控制器只有 V 种应对动作。Ashby：只有多样性能消灭多样性。V < D 时，多出来的扰动无论如何都会漏过去。":
    "The system faces D distinct disturbances. Your controller has only V responses. Ashby: only variety can absorb variety. When V < D, the surplus disturbances get through no matter what you do.",
  "扰动的多样性 D（系统有多复杂）": "Variety of disturbances D (how complex the system is)",
  "控制器的多样性 V（你的指标/手段有多少）": "Variety of the controller V (how many metrics and levers you have)",
  "控制器能中和 <span class=\"big\">{}</span>/{} 种扰动，<strong style=\"color:var(--red)\">{}</strong> 种漏过（红）。":
    "The controller absorbs <span class=\"big\">{}</span> of {} disturbances, and <strong style=\"color:var(--red)\">{}</strong> get through (red).",
  "V(O) ≥ V(D) − V(R)：想把结果的方差压到零，控制器的多样性至少要匹配扰动的多样性。一个单一指标（V 很小）永远约束不住一个复杂系统，这就是 Goodhart 的控制论根源。":
    "V(O) ≥ V(D) − V(R): to drive the variance of the outcome to zero, the controller's variety must at least match the variety of the disturbances. A single metric, with its tiny V, can never constrain a complex system. This is the cybernetic root of Goodhart's law.",
  "V ≥ D：控制器足够多样，每种扰动都有对应动作。但现实里 D 通常远大于任何指标能提供的 V。":
    "V ≥ D: the controller is varied enough that every disturbance has a matching response. In practice D is usually far larger than the V any metric can supply.",

  /* ===== seven-levers.js (C02) ===== */
  "垄断度": "Monopoly",
  "只有一个排名，还是多家并存？（USNWR 法学院=高；商学院五家=低）":
    "One ranking, or several side by side? (USNWR law schools = high; the five business school rankings = low)",
  "就这一把尺子，还是有得挑": "One ruler only, or a choice of rulers",
  "只有一把尺子时，没人躲得开它；多家并存，被测者能挑对自己有利的那把讲故事，支配力被稀释——商学院正是这样逃过一劫的。":
    "With one ruler nobody can escape it. With several, the measured can tell their story using whichever favours them and the ranking's grip is diluted. That is how business schools got off lightly.",
  "利害绑定": "Stakes",
  "指标连着钱/生死/发布会 PPT 的程度": "How tightly the metric is tied to money, survival or the launch slide",
  "分数连着钱和前途的程度": "How tightly the score is tied to money and prospects",
  "利害越重，被测者拼命博弈的动机越强；不痛不痒的指标没人费劲去操纵。":
    "The higher the stakes, the stronger the motive to game hard. Nobody bothers manipulating a metric that costs them nothing.",
  "可通约化粗暴度": "Crudeness of commensuration",
  "压成一个全序名次(高) 还是保留多维仪表盘(低)":
    "Compressed into a single total ordering (high) or kept as a multi-dimensional dashboard (low)",
  "压成一个名次，还是保留多维仪表盘": "Compressed into one rank, or kept as a dashboard",
  "压得越粗暴，被丢掉的维度越隐形；隐形的维度没人守，绕行就越有利可图。":
    "The cruder the compression, the more invisible the discarded dimensions become. Nobody guards what is invisible, so routing around it pays better.",
  "发布节律": "Publication rhythm",
  "连续/高频发布 → 永恒监视": "Continuous or frequent publication → permanent surveillance",
  "多久张榜一次": "How often the results are published",
  "发布越频繁，越像一场永不下课的监考，被测者的日常越是围着指标转。":
    "The more often it publishes, the more it becomes an exam that never ends, and the more the measured organise their days around the metric.",
  "零和性": "Zero-sumness",
  "相对名次(高) vs 绝对分数(低)：名次制造军备竞赛":
    "Relative rank (high) vs absolute score (low): ranks manufacture arms races",
  "比相对名次，还是比绝对分": "Competing on relative rank, or on absolute score",
  "比名次意味着你什么都没做错、对手涨了你就掉——这是军备竞赛的点火器。":
    "Competing on rank means you can do nothing wrong and still fall because a rival rose. That is the arms race ignition.",
  "可绕行通道": "Routes around",
  "指标与真实目标之间可被绕行的空间有多大": "How much room there is between the metric and the real objective",
  "不提升真实目标也能刷高分数的空间": "Room to raise the score without raising the real objective",
  "指标和真实目标之间的空隙越大，「刷分不办事」的路就越多。":
    "The wider the gap between metric and real objective, the more routes there are to a higher score that achieves nothing.",
  "被测者反身能力": "Reflexive capacity of the measured",
  "被测者多会逆向工程你的公式（模型/厂商=拉满）":
    "How well the measured can reverse engineer your formula (models and vendors max this out)",
  "被测者多会研究你的公式": "How well the measured can study your formula",
  "会逆向工程公式的对手，博弈打得又准又快；AI 场景这格几乎恒定拉满——模型和厂商都读得懂规则。":
    "An opponent who can reverse engineer the formula games it accurately and fast. In AI settings this lever sits at maximum almost permanently, because both models and vendors can read the rules.",
  "US News 法学院": "US News law schools",
  "近乎垄断的年度全序名次，连着生源与捐款：教科书级的反应性极端案例（R01 的主角）。":
    "A near-monopoly annual total ordering tied to admissions and donations: the textbook extreme case of reactivity, and the subject of R01.",
  "USN 一家独大数十年，法学院无榜可挑": "USN has dominated for decades and law schools have no alternative ranking",
  "名次直接牵动生源、捐款、院长的饭碗": "Rank directly moves applicants, donations and the dean's job",
  "使命各异的学校被压成第 1 到第 199 名": "Schools with entirely different missions compressed into ranks 1 to 199",
  "一年一放榜，整个招生周期跟着它转": "Published once a year, and the whole admissions cycle turns around it",
  "名次是相对的：对手涨你就掉": "Rank is relative: a rival rising means you fall",
  "冲分奖学金、就业统计口径都是现成通道":
    "Merit scholarships aimed at the metrics and creative employment-statistics definitions are ready-made routes",
  "院长们雇顾问逆向工程公式": "Deans hire consultants to reverse engineer the formula",
  "商学院（五榜并存）": "Business schools (five rankings side by side)",
  "五家榜单方法各异，垄断度这格掉下来，整体强度低一截——多重排名互相稀释。":
    "Five rankings with different methods, so the monopoly lever drops and the overall index comes down a notch. Multiple rankings dilute each other.",
  "BW/USN/FT/Economist/WSJ 五家并存，可挑着讲":
    "BW, USN, FT, Economist and WSJ all coexist, so schools can pick which to cite",
  "利害仍高：学费与生源都在赌桌上": "Stakes are still high: tuition and applicants are both on the table",
  "同样压成名次，粗暴度不减": "Still compressed into a rank, no less crude",
  "各家节律不一，张榜的声浪被稀释": "Different publication rhythms dilute the noise around any one release",
  "同样是零和名次": "Still a zero-sum rank",
  "通道与法学院类似": "Much the same routes as law schools",
  "同样会逆向工程，但火力分散到五个公式":
    "Reverse engineering happens too, but the effort is spread across five formulas",
  "高考": "Gaokao",
  "利害与零和拉满，但一年一次的低节律和严格监考压住了部分扭曲——扭曲改道去了应试训练。":
    "Stakes and zero-sumness are at maximum, but the once-a-year rhythm and strict invigilation hold down part of the distortion. The distortion reroutes into test preparation instead.",
  "一考定位次，几乎是唯一通道": "One exam sets your rank, and it is almost the only route through",
  "直接决定人生走向，利害拉满": "It decides the direction of a life, so the stakes are at maximum",
  "总分一个数，压掉所有侧面": "A single total score flattens every other facet",
  "三年备考只为一次放榜：节律低，但赌注极重":
    "Three years of preparation for one result: low rhythm, extremely high stakes",
  "按位次录取，标准的零和": "Admission by rank order, textbook zero-sum",
  "题型可押、套路可练：应试即绕行": "Question types can be predicted and drilled: test prep is the route around",
  "整个应试产业都在逆向工程考纲": "An entire test-prep industry reverse engineers the syllabus",
  "Chatbot Arena（AI 排行榜）": "Chatbot Arena (AI leaderboard)",
  "全天候更新 + 被测者是会读规则的模型与厂商：反身能力被推到人类场景没有的档位（Y11 细讲）。":
    "Round-the-clock updates, and the measured are models and vendors that can read the rules. Reflexive capacity is pushed to a level no human setting reaches (covered in detail in Y11).",
  "一度是社区默认的「唯一」大模型榜": "For a while it was the community's default and only large-model leaderboard",
  "发布会、融资、招聘都盯着它": "Launches, funding rounds and hiring all watch it",
  "万千能力压成一个 Elo 分（相对胜率折算的棋类等级分）":
    "Thousands of capabilities compressed into a single Elo score, the chess rating derived from relative win rates",
  "全天候滚动更新：永恒监考": "Rolling round-the-clock updates: a permanent exam",
  "Elo 本身就是零和的相对分": "Elo is a relative, zero-sum score by construction",
  "私测多变体、只发布最高分等通道": "Routes such as testing many variants privately and submitting only the best",
  "厂商与模型都能认出考场、读懂规则": "Both vendors and models can recognise the exam hall and read the rules",
  "好的内部诊断指标": "A good internal diagnostic metric",
  "不挂利害、不排名、多维仪表盘：测量安安静静地当诊断用——这是低反应性长什么样。":
    "No stakes attached, no ranking, a multi-dimensional dashboard: measurement quietly doing diagnostic work. This is what low reactivity looks like.",
  "只是团队内部多把尺子之一": "Just one of several rulers inside the team",
  "不连 KPI，不连发布决策": "Not tied to KPIs, not tied to release decisions",
  "保留多维仪表盘，不排名": "Keeps a multi-dimensional dashboard, produces no ranking",
  "按需查看，没有固定张榜日": "Checked when needed, with no fixed publication day",
  "看绝对读数，不比相对名次": "Read as an absolute number, not compared as a rank",
  "没人有动机绕它": "Nobody has a motive to route around it",
  "没有公开公式可供逆向": "There is no public formula to reverse engineer",
  "把七个杠杆各打个分，得到一个『反应性强度指数』。这是本课的统一框架，用来预测任何排名或评测会被扭曲得多厉害。（相对/教学工具，非绝对指数）":
    "Score each of the seven levers to get a reactivity strength index. This is the unifying framework of the lesson, used to predict how badly any ranking or eval will be distorted. (It is a relative teaching tool, not an absolute index.)",
  "一键载入真实案例（七根杠杆拨到对应档位）":
    "Load a real case (sets all seven levers to its levels)",
  "案例：": "Case: ",
  "还没选案例——点上面一键载入，或直接拖滑块自定义。":
    "No case selected yet. Load one above, or just drag the sliders to build your own.",
  "自定义档位（不对应任何预设案例）。": "Custom levels (not one of the preset cases).",
  "杠杆": "Lever",
  "档位": "Level",
  "贡献分": "Contribution",
  "一句白话": "In plain terms",
  "七格贡献分相加 ≈ 总指数（0–100）。哪格高，失真就先从哪格开始——这也是 C03 降压时的动手顺序。":
    "The seven contributions sum to roughly the total index (0 to 100). Distortion starts wherever the score is highest, which is also the order to work in when reducing pressure in C03.",
  "上一根": "Previous lever",
  "下一根": "Next lever",
  "杠杆 {}/7": "Lever {}/7",
  "它问的是：": "What it asks: ",
  "为什么它是根杠杆：": "Why it is a lever: ",
  "<strong>{}</strong> 这格打 <strong>{}/10</strong>：{}": "<strong>{}</strong> scores <strong>{}/10</strong> here: {}",
  "在上面载入一个真实案例，这里会解释它这一格为什么打这个分。":
    "Load a real case above and this panel explains why it scores what it does on this lever.",
  "极高": "Very high",
  "指标几乎必然被博弈失真、且难缓冲。像 USNWR 与 AI 排行榜：认得出它，别把它当真理。":
    "The metric will almost certainly be gamed into distortion, with little to cushion it. USNWR and the AI leaderboards are of this kind: recognise it, and do not treat it as truth.",
  "高": "High",
  "反应性显著。需要主动的抗博弈设计（见 C03）才扛得住。":
    "Reactivity is significant. It needs active anti-gaming design (see C03) to hold up.",
  "中": "Medium",
  "有反应性但可控。多指标制衡 + 解耦通常够用。":
    "Reactive but manageable. Several metrics in tension plus decoupling is usually enough.",
  "低": "Low",
  "相对安全的测量。可以放心用来做诊断，但一旦挂钩利害就别掉以轻心。":
    "A relatively safe measurement. Fine to use for diagnosis, but do not relax once stakes get attached.",
  "反应性强度指数": "Reactivity strength index",

  /* ===== design-robust-eval.js (C03) ===== */
  "题目过拟合": "Benchmark overfitting",
  "背题": "memorising the questions",
  "维度窄化": "Dimensional narrowing",
  "只练一面": "training one facet only",
  "直接造假": "Outright falsification",
  "改数字": "changing the numbers",
  "风格/表面刷分": "Style and surface gaming",
  "讨好评委": "pleasing the judges",
  "隐藏测试集 (held-out)": "Held-out test set",
  "留一组优化循环永远看不到的题": "Keep a set of questions the optimisation loop never sees",
  "动态/轮换题库": "Dynamic or rotating question set",
  "让博弈追不上（Dynabench/LiveBench）": "Keep gaming from catching up (Dynabench, LiveBench)",
  "配对指标制衡": "Paired metrics in tension",
  "互相拉扯的指标组，难被同时博弈": "Metrics that pull against each other are hard to game at once",
  "eval 与优化解耦": "Decouple eval from optimisation",
  "eval 只诊断，不直接驱动改模型（Deming）":
    "The eval diagnoses only, it does not directly drive model changes (Deming)",
  "随机人工抽检": "Random human spot checks",
  "抽真实会话让人读：对抗不可测部分": "Sample real sessions for people to read, covering what cannot be scored",
  "承认容量约束/限压": "Acknowledge capacity limits, cap the pressure",
  "别把全部优化压力压在一个窄 eval 上": "Do not put all the optimisation pressure on one narrow eval",
  "通用 eval（默认）": "Generic eval (default)",
  "不指定场景的平均攻击面——原版沙盒就是它。":
    "The average attack surface with no particular setting specified. This is the original sandbox.",
  "冲分奖学金、就业统计口径任摆——「改数字」和「只练一面」是主通道（C02 打分：垄断+利害全高）。":
    "Merit scholarships aimed at the metrics, and employment statistics defined to taste: changing the numbers and training one facet are the main channels (C02 scores monopoly and stakes both high).",
  "五家榜单互相稀释，单榜支配力掉档：四条通道都比法学院温和一点，但一条也没关上。":
    "Five rankings dilute each other and no single one dominates: all four channels are milder than for law schools, but not one of them is closed.",
  "题型可押、套路可练——「背题」一家独大；严格监考把「改数字」压到很低。":
    "Question types can be predicted and drilled, so memorising the questions dominates, while strict invigilation holds changing the numbers very low.",
  /* "Chatbot Arena" 与 "moment of truth" 无需条目：回落即为正确英文 */
  "长回复、emoji、讨喜语气——「讨好评委」是头号通道，外加适应榜口味的「背题」（私测择优另算，见 B13/Y11）。":
    "Long answers, emoji and an agreeable tone make pleasing the judges the leading channel, with memorising the leaderboard's taste behind it. Private best-of selection is counted separately, see B13 and Y11.",
  "不挂利害、没人有动机博弈：攻击面本来就小——这就是低反应性的样子（C02 打分全低）。":
    "No stakes attached and nobody with a motive to game it, so the attack surface is small to begin with. This is what low reactivity looks like (C02 scores it low across the board).",
  "勾选防御手段。系统会对你的 eval 发起一次 gaming 攻击，看还剩多少『幻觉』穿过去。目标：把真实信号占比顶上去。先用下面的案例换一套攻击面，再决定先堵哪条。":
    "Tick the defences. The system launches a gaming attack on your eval and shows how much illusion still gets through. The goal is to push the share of real signal up. Load a case below to change the attack surface first, then decide which channel to block.",
  "一键载入 C02 打过分的案例（换一套初始攻击面）":
    "Load a case scored in C02 (swaps in a different starting attack surface)",
  "换到「{}」：四条通道的压力重新分布了。看红色条找最粗的那条，先堵它——这也是 C02 说的「哪格高，失真先从哪格开始」。":
    "Switched to {}: pressure has been redistributed across the four channels. Find the thickest red bar and block that one first, which is the same rule C02 gives, that distortion starts wherever the score is highest.",
  "和": " and ",
  "勾上「{}」：残余幻觉 {}% → {}%，一下挡掉 {} 个点——它堵的是 {}。":
    "Added {}: residual illusion {}% → {}%, blocking {} points at once. It closes {}.",
  "勾上「{}」：读数没动，因为它管的 {} 已经被别的防御挡住了。这不是白勾——单层防御被绕穿时，它就是备份。多层组合的冗余正是把博弈成本顶上去的方式。":
    "Added {}: the reading did not move, because {} is already blocked by another defence. It is not wasted. When a single layer gets breached, this is the backup, and that redundancy across layers is exactly what drives the cost of gaming up.",
  "拆掉「{}」：残余幻觉 {}% → {}%，回升 {} 个点——{} 的通道又敞开了。缺一层，就漏一条道。":
    "Removed {}: residual illusion {}% → {}%, back up by {} points. The {} channel is open again. One layer missing, one route open.",
  "拆掉「{}」：读数没动，{} 还有别的防御顶着。但你刚拆掉的是那道备份。":
    "Removed {}: the reading did not move, since {} still has another defence holding it. But what you just removed was the backup.",
  "刚才这一下": "That last move",
  "还没勾任何防御——四条通道全开着。先看下面哪条红色条最粗，挑一个专堵它的防御勾上，看读数怎么动。":
    "No defences ticked yet, so all four channels are open. Find the thickest red bar below, tick a defence that closes it, and watch the reading move.",
  "防御": "Defence",
  "状态": "State",
  "它堵的通道": "Channels it closes",
  "此刻的账": "Current effect",
  "逐防御对账（按边际算）：已开的=此刻拆掉它幻觉回升几个点；未开的=此刻勾上还能压几个点。0 点不等于没用——通道被别的防御挡着时，它是冗余备份。":
    "Defence reconciliation, measured at the margin. For a defence that is on, how many points illusion would rise if you removed it now. For one that is off, how many points it would still cut if you added it now. Zero points does not mean useless: when the channel is already blocked by another defence, this one is the redundant backup.",
  "已挡下 ": "blocked, ",
  "残余幻觉 <span class=\"big\" style=\"color:var(--red)\">{}%</span> &nbsp;·&nbsp; 真实信号占比 <span class=\"big\" style=\"color:var(--green)\">{}%</span>":
    "Residual illusion <span class=\"big\" style=\"color:var(--red)\">{}%</span> &nbsp;·&nbsp; real signal share <span class=\"big\" style=\"color:var(--green)\">{}%</span>",
  "✓ 稳了。注意：没有单一防御能挡住一切，是多层组合(尤其『解耦』+『held-out』)把博弈成本顶到不划算。":
    "✓ Solid. Note that no single defence blocks everything. It is the combination of layers, especially decoupling plus a held-out set, that pushes the cost of gaming past the point of being worth it.",
  "裸奔的 eval：优化压力会把这几条通道全部走满。挑几个防御勾上。":
    "An unprotected eval: optimisation pressure will fill every one of these channels. Tick some defences.",
  "还有通道敞着。看红色条：它们的 blockedBy 还没被你勾中。":
    "Channels are still open. Look at the red bars: nothing you have ticked closes them yet.",
  "已开": "On",
  "拆掉它幻觉 +{} 点": "removing it costs {} points",
  "冗余备份（0 点）": "redundant backup (0 points)",
  "未开": "Off",
  "勾上可再压 {} 点": "adding it cuts {} more points",
  "此刻压不动（通道已被挡）": "no effect right now (channel already blocked)",
  /* 纯标点的格式串：英文页必须换掉「」（）这些全角记号，否则英文里会漏出中文标点 */
  "「{}（{}）」": "\"{} ({})\"",
  "{}（{}）": "{} ({})",
  "、": ", "
};
