export default {
  id: "N00",
  blocks: [
    { t: "prose", html: `
<p>Put a number on something that can respond. Grade a student, rank a hospital, run a benchmark on an AI model. You think you are standing off to the side reading a dial. You have already reached in and touched the thing.</p>
<p>Measuring something that can respond is never passive reading. It is an intervention. That sentence runs against intuition, and everything else here is built on it.</p>` },

    { t: "prose", html: `
<p>You want to know how well a class has learned, so you write an exam. You assume this works like putting a ruler against a table: the table does not get longer because you measured it, and whatever you read off is the answer. But students are not tables. They know they are being tested, so they start studying for the test, guessing what you will ask, drilling the kind of answer you reward. The ruler goes up and the thing being measured moves. What you end up measuring is no longer "how well they learned" but "how well they handle your exam." The two are related. They are not the same thing.</p>` },

    { t: "module", module: "explorable:the-loop", title: "观察会改变被观察的东西" },

    { t: "prose", html: `
<p>The dots in the module are the true values. Moving your cursor over them is observing them. Watch what happens: dots the cursor sweeps across brighten and drift upward, as if leaning toward your gaze. At the same time, the agreement between the "measured value" the screen reports and the "true value" gets worse the more you look. The harder you look, the more false what you see becomes. The program is not cheating you. That is the machine, in its smallest form.</p>
<p>The phenomenon has a plain name: <strong>reactivity</strong>. In everyday terms, the thing being measured changes because it is being measured. The word is not new. The sociologist Donald Campbell defined it back in 1957: a reactive measure changes the very phenomenon it set out to measure. A physical instrument disturbing the system it probes is already trouble enough. The social case is harder, because people read your ruler back and then remake themselves to fit it.</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>Correlated is not identical.</strong> The reason a ruler is worth using at all is that the dimension it measures correlates with what you actually care about: exam scores correlate with learning, rankings with quality, benchmark scores with whether a model is any good. Most of the failures collected here trace back to one thing. The moment you start <em>rewarding</em> that correlated number, effort drifts from "do the thing well" to "make the dial read higher," and the cheapest route to a higher dial is usually not doing the thing well. Optimization pressure pulls on the correlation until it snaps.</p>` },

    { t: "prose", html: `
<p>One machine, run into from three directions by three sets of people who did not know about each other, and studied by a fourth set trying to defend against it. That is why this tree splits into colors, which is what you see in the navigation:</p>
<ul>
<li><strong>Red - the sociological line</strong>: how rankings and quantification remake society. The subjects are law schools, hospitals, nation states, and the conclusion is that a ranking does not only reflect reality, it takes part in producing it.</li>
<li><strong>Blue - laws and formal results</strong>: economists and cyberneticians compressed the same thing into laws, and eventually into provable theorems. Goodhart, Campbell, multitask agency models, and the wave of machine learning work after 2022 that turned these aphorisms into mathematics.</li>
<li><strong>Yellow - machines and the frontier</strong>: in machine learning, the thing being measured is for the first time the optimizer itself, and the same machine runs two orders of magnitude faster. Overfitting, reward hacking, leaderboard illusions. If you build AI systems, this is the wall you hit first.</li>
<li><strong>Green - defense and design</strong>: given that any metric will be gamed, how do you design one that holds up. Honest signals, decoupling, held-out test sets, strategyproof mechanisms. This is the constructive branch, the one about what to do.</li>
</ul>
<p>Two more bands sit outside the colors. The neutral-toned <strong>case band</strong> puts real incidents from different fields side by side, from U.S. News to the World Bank to fake e-commerce orders, so you can see the scars the same machine leaves on different materials. The white <strong>convergence nodes</strong> are where things pull back together, taking the scattered threads and reweaving them into something you can use. <code>N00</code>, what you are reading now, is the root of the whole tree, and the last lesson <code>C07</code> closes it off.</p>
<p>The three colored branches each stand on their own, but they describe one mechanism appearing three times in three materials: in society the thing measured is people, in markets it is theories, in machines it is the optimizer itself. The material changes, the mechanism does not. So if you read the red branch and then turn to the yellow one, you will probably feel you have seen this before. That is not deja vu. It is the same machine wearing a different skin, except that inside the machine it runs two orders of magnitude faster, fast enough to watch the whole loop close within a single model generation.</p>` },

    { t: "prose", html: `
<p>Every lesson reads the same way, so learning one means learning all of them. The main text works through one thing from beginning to end, story first, mechanism second, without ceremony. Three kinds of card are threaded through it, each with a job. <strong>Intuition cards</strong> take one intuition and land it in a paragraph. <strong>Correction cards</strong> fix a popular misattribution and give the actual source, and getting straight who really said what is a house specialty here. <strong>Applied cards</strong> are written for you if you are building an eval or reading a leaderboard, and say what the lesson means in practice. Every lesson ends with "One open question" and "The one-line takeaway": the first is a genuinely unsettled question in the field, the second is a summary small enough to carry. The sources at the foot list the origins, and anywhere a year or a number appears you can follow it back to the original.</p>
<p>Nodes have an order. Each lesson names its prerequisites at the top, and those are worth reading first. The assumption is only that you have read a lesson's prerequisites, not the whole tree, so whenever a concept comes up that has not been covered, the text explains it on the spot in plain language and attaches a link like <code>R01</code>. Click through if you want to dig, keep reading if you do not. You do not have to go front to back. Following any one branch's color downward works fine, and you can double back for a prerequisite when you hit one you are missing.</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>If you write evals:</strong> the experience of "model performance is identical before and after the eval, it just mechanically fit the eval" has a theoretical name, and the name is reactivity. What you ran into is not your own oversight. It is a structural phenomenon with decades of literature behind it, running from sociology to AI safety. Having a name means someone has studied what to do about it: the entire yellow branch and several green and white nodes are answers to exactly this.</p>` },

    { t: "prose", html: `
<p>Carry one habit as you read on. Whenever you see a number used to hand out money, reputation, degrees, or a slide at a model launch, ask one more question: how much of this reading is real, and how much of it was lifted by the act of looking? Every broken ruler still in service is still setting a price on somebody, or on some model. Learning to spot them is the thing you take away.</p>` },

    { t: "prose", html: `
<p>One open question: can reactivity ever be eliminated? Traditional methodology long treated it as contamination to be scrubbed out. Espeland and Sauder turned that around in 2007: since people are beings that respond, reactivity cannot be removed at all, so make it the object of study instead. Which raises the question of whether some measurement could be designed so that reactivity helps rather than hurts. The green branch is trying to answer that, and the general answer does not exist yet.</p>
<p><strong>The one-line takeaway:</strong> you think you are reading the dial, but the dial is reading you. Measuring something that can respond has already changed it.</p>` },

    { t: "sources", items: [
      `Campbell, D. T. (1957). "Factors Relevant to the Validity of Experiments in Social Settings." <em>Psychological Bulletin</em> 54:297–312.`,
      `Espeland, W. N. & Sauder, M. (2007). "Rankings and Reactivity: How Public Measures Recreate Social Worlds." <em>AJS</em> 113(1):1–40.`,
      `Project synthesis in <code>00-SYNTHESIS-总纲.md</code>; overview of the three research rounds in <code>research/deep/D0</code>.`
    ] }
  ]
};
