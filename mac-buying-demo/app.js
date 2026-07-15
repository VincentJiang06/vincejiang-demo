import { layoutWithLines, prepareWithSegments, setLocale } from './pretext/layout.js';

setLocale('zh-CN');

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const budgetLabels = ['极限省钱', '谨慎预算', '主流甜点', '专业预算', '拉满不后悔'];

const recommendations = {
  daily: {
    portable: '首选 13 英寸 MacBook Air M5。16GB/512GB 是能买的新机下限，24GB/1TB 是更像四五年主力机的长期配置。你买的是轻、静、续航和低维护成本；不要为了“Pro”两个字牺牲重量和钱。预算压力大时，M2/M3 Air 二手也能做日常主力，但 8GB 内存版本尽量避开。',
    desk: '固定桌面优先时，Mac mini M4 是非常干净的选择：小、安静、接口足、性价比高。日常办公不需要 M4 Pro；钱应该优先给显示器、键盘、备份硬盘和 24GB 内存。如果你没有好屏幕，MacBook Air 反而可能更省心。',
    either: '日常场景的第一原则是不要买过度性能。要带走就 Air M5；固定桌面就 mini M4；如果看到便宜的 M1/M2 Air，确认电池、16GB 内存和无 MDM 后也可以买。真正影响寿命的是内存和硬盘，不是芯片跑分。'
  },
  dev: {
    portable: '开发者首选 14 英寸 MacBook Pro M5 Pro。理由不是峰值跑分，而是风扇、XDR 屏、更多端口、长时间编译不降频，以及 24GB 起步的内存结构。轻量前端/脚本开发可以用 Air M5 24GB，但 Docker、多 IDE、多数据库、多浏览器会让 Air 的无风扇设计变成瓶颈。',
    desk: '固定开发机首选 Mac mini M4 Pro，24GB 起步，认真用建议 48GB/1TB。它比同价位笔记本更适合常驻编译、容器和多显示器；如果你已经有好显示器和键鼠，它是 M 系列里最像“生产工具”的甜点。',
    either: '如果每天移动，买 MacBook Pro M5 Pro；如果主要在桌面，买 Mac mini M4 Pro。不要被 Mac Studio 诱惑，除非你的开发伴随本地大模型、3D、视频或大型科学计算。普通开发最怕内存不够，优先级是内存 > 硬盘 > 芯片档位。'
  },
  creator: {
    portable: '创作者便携主力建议 14/16 英寸 MacBook Pro M5 Pro 或 M5 Max。照片、短视频、设计、音乐制作多数选 M5 Pro 足够；多机位 4K/8K、长时间 ProRes、AE/Blender/Resolve 重负载再上 M5 Max。Air 能剪，但不是为了长期满载而生。',
    desk: '桌面创作的漂亮答案是 Mac Studio M4 Max；如果你的项目吃超大内存、超多显示器、多路 8K 或 3D/AI 混合流，才考虑 M3 Ultra。Studio 的价值在于稳定、接口、散热和媒体引擎，不是“看起来像小主机”。',
    either: '移动创作选 MacBook Pro，桌面创作选 Mac Studio。Mac mini M4 Pro 可以做轻中度剪辑和设计，但当工作开始靠时间吃饭，Studio 的安静满载和更多 I/O 会比省下的钱更值。'
  },
  ai: {
    portable: '本地 AI 便携路线只建议 MacBook Pro M5 Max，目标 64GB 起，严肃模型工作 128GB。M5 Pro 能跑很多开发实验，但一旦模型、数据、浏览器、IDE 同时开，内存墙会比算力墙先来。',
    desk: '本地 AI / 科研桌面优先看 Mac Studio M3 Ultra，尤其是需要 256GB/512GB 统一内存、长时间满载、多个显示器或超大数据集时。M4 Max Studio 更适合创作与中等 AI；Ultra 是“内存池机器”。',
    either: 'AI 场景的核心不是“芯片数字越新越好”，而是统一内存容量、带宽、散热和软件栈。要带走选 M5 Max MacBook Pro；固定桌面选 M3 Ultra Studio；预算有限就承认边界，别指望 16GB Air 变成工作站。'
  }
};

const generations = [
  ['m1', 'M1', '2020–2022', 'M1：把 Mac 从“热而快”变成“冷而够快”。', 'M1 的意义不是今天还多快，而是它重新定义了 Mac 的下限。M1 Air、M1 13 英寸 Pro、M1 Mac mini 到现在仍能胜任写作、网页、轻开发、剪短视频和家庭桌面；但它的短板也很清楚：很多机型外接屏限制明显，8GB 内存版本会老得很快，老款外壳和摄像头/屏幕也不如后续设计。二手只推荐 16GB 内存、健康电池、无监管锁的机器。M1 Pro / Max 的 14/16 英寸 MacBook Pro 仍然是二手市场的硬货：屏幕、接口、散热和性能都足够体面。M1 Ultra Studio 今天更像特定工作流的二手机器，只有你明确需要大量统一内存或多媒体引擎时才值得研究。'],
  ['m2', 'M2', '2022–2023', 'M2：Air 换壳，mini Pro 化，二手甜点开始成型。', 'M2 不是革命，它是 M1 之后的成熟化。M2 Air 的价值在于新外观、MagSafe、更好的屏幕比例和更现代的日常体验；它适合学生、写作者和轻开发。M2 Pro Mac mini 是第一台特别值得长期放桌上的 Apple Silicon 小主机：它把 Pro 芯片、更多接口和相对低成本结合起来。M2 Max / Ultra Studio 依旧适合创作工作室。购买 M2 世代时，真正要看的是配置而不是代际：16GB 是底线，24GB/32GB 明显更舒服；基础 256GB SSD 的速度和空间都容易成为遗憾。'],
  ['m3', 'M3', '2023–2025', 'M3：3nm、光追、图形和能效继续补课。', 'M3 世代的关键词是 3nm、硬件光线追踪、图形能力和能效。M3 Air 是很稳的轻薄本，M3 Pro / Max MacBook Pro 适合已经错过 M1/M2 Pro 的人。更有意思的是 Mac Studio 的 M3 Ultra：它并不跟 M4/M5 的节奏完全同步，却在超大统一内存、多显示器、长时间满载和专业工作流上继续站在桌面高端。买 M3 二手时，不要被“比 M4 老一代”吓到；如果价格合适、内存足够，它可能比低配新机更合理。'],
  ['m4', 'M4', '2024–2026', 'M4：桌面小主机的黄金代，Mac mini 尤其亮。', 'M4 在 Mac mini 上特别漂亮：基础 M4 mini 已经足够强，M4 Pro mini 则是开发者、轻中度创作者、桌面多屏用户的甜点。它的优势不是“便宜 Mac”，而是你可以把钱从屏幕、键盘、存储、网络和备份系统上重新分配。Mac Studio M4 Max 则是创作者桌面主力：比笔记本安静、接口更集中、散热更从容。M4 世代买新机时，一定要防止“基础够用”的幻觉：16GB 可以日常，24GB/32GB 才像长期使用，Pro/Max 工作流尽量从 48GB/64GB 往上看。'],
  ['m5', 'M5', '2025–2026', 'M5：AI 加速和无线/存储升级，把 MacBook 推到当前主线。', '截至 2026 年 7 月，M5 的主战场在 MacBook：MacBook Air M5 适合绝大多数移动日常用户，MacBook Pro M5 / M5 Pro / M5 Max 覆盖从高性能日常到专业移动工作站。M5 Air 的重点是 153GB/s 内存带宽、Wi‑Fi 7、Bluetooth 6、512GB 起步和更强 AI/图形能力；M5 Pro/Max 的重点是更高内存带宽、Thunderbolt 5、更强本地 AI 与创作性能。桌面端仍要理性：Mac mini 还是 M4/M4 Pro，Mac Studio 是 M4 Max / M3 Ultra。不要只按数字买新，按形态和工作流买。']
].map(([id, label, years, title, text]) => ({ id, label, years, title, text }));

const families = [
  {
    name: 'MacBook Air / Pro',
    ascii: ['╭────────────────────╮','│  M5 ░░░ pretext ░  │','│  portable compute  │','╰────────────────────╯','       ╲________╱'],
    body: 'MacBook 是“随身生产力”。Air 买轻、静、续航；Pro 买屏幕、风扇、端口和长时间性能。不要因为偶尔剪片就强行 Pro，也不要因为 Air 跑分漂亮就拿它长期满载。',
    bullets: ['学生/写作/轻办公：Air M5 16GB 起，24GB 更稳', '开发/创作：MacBook Pro M5 Pro 是甜点', '本地 AI / 3D：M5 Max，内存优先']
  },
  {
    name: 'Mac mini',
    ascii: ['  ╭────────────╮','  │ M4 mini    │','  │ ░░░░░░░░   │','  ╰────────────╯','    ●        ●'],
    body: 'Mac mini 是“固定工位的理性”。你把屏幕、键鼠、网线、硬盘都接好，它就像一台安静的工作砖。M4 基础款适合日常和轻开发；M4 Pro 是开发、多屏、轻中度创作的高性价比核心。',
    bullets: ['已有好显示器：mini 的价值暴涨', 'M4 Pro 优先 48GB/1TB', '不要忘记外置 SSD / NAS / 备份']
  },
  {
    name: 'Mac Studio',
    ascii: ['╭──────────────╮','│  STUDIO      │','│  M4 MAX      │','│  M3 ULTRA    │','╰──────────────╯','  ≋≋≋ airflow ≋'],
    body: 'Mac Studio 是“桌面工作站”。它适合靠机器吃饭的人：长时间渲染、音视频、多显示器、超大内存、本地模型、科研计算。M4 Max 偏创作甜点；M3 Ultra 偏超大内存和极限多屏。',
    bullets: ['创作主力：M4 Max Studio 很稳', '大模型/科研：M3 Ultra 看内存上限', '普通开发别过度购买 Studio']
  }
];

const models = [
  ['MacBook Air 13 / 15 · M5', ['╭────────────╮','│ AIR  M5    │','╰────────────╯','  ╲______╱'], '移动日常首选。适合学生、文字、网页、轻开发、轻剪辑和多数商务用户。', '不适合长期满载编译、重 3D、多路视频、大模型。', ['16GB 起','24GB/1TB 更长寿','无风扇','两台外接显示器']],
  ['MacBook Pro 14 / 16 · M5 Pro', ['╭────────────╮','│ PRO M5PRO  │','│ XDR 120Hz  │','╰────────────╯'], '开发者和创作者的移动甜点。屏幕、风扇、端口和性能释放比 Air 更重要。', '如果只是轻办公，它会显得贵且重。', ['24GB 起','48/64GB 推荐','Thunderbolt 5','XDR']],
  ['MacBook Pro · M5 Max', ['╭────────────╮','│ MAX :::::  │','│ AI / 8K    │','╰────────────╯'], '真正移动工作站：视频、3D、本地模型、重型多任务。', '预算紧、负载不稳定、只是“想买最好”的人会浪费很多钱。', ['36GB 起','64/128GB','高带宽','重负载']],
  ['Mac mini · M4', ['╭────────╮','│ M4     │','│ mini   │','╰────────╯'], '固定桌面日常/轻开发性价比最高。安静、小、便宜，外设可自由升级。', '没有好屏幕和键鼠时，总成本可能不如 Air 省心。', ['16/24/32GB','桌面常驻','多显示器','自备外设']],
  ['Mac mini · M4 Pro', ['╭────────╮','│ M4 PRO │','│ devbox │','╰────────╯'], '桌面开发甜点。Docker、编译、多屏、轻中度创作都很舒服。', '如果你需要 128GB+ 内存或长时间重 GPU，直接看 Studio。', ['24GB 起','48/64GB','TB5','高性价比']],
  ['Mac Studio · M4 Max / M3 Ultra', ['╭──────────╮','│ STUDIO   │','│ MAX/ULTRA│','╰──────────╯'], '专业桌面工作站。M4 Max 偏创作主力，M3 Ultra 偏超大内存和极限并行。', '普通开发和日常使用不需要 Studio。', ['36GB→512GB','多显示器','安静满载','专业 I/O']]
].map(([name, ascii, verdict, avoid, pills]) => ({ name, ascii, verdict, avoid, pills }));

const guideTexts = {
  student: ['student.md', '学生、写作者、轻办公用户最容易被“性能焦虑”骗。你真正需要的是轻、安静、续航、屏幕舒服、键盘好、摄像头够用、系统稳定。M5 MacBook Air 13 英寸是默认答案；如果你经常分屏、写论文、开文献、上网课和视频，15 英寸 Air 很舒服，但便携性会下降。配置上，16GB/512GB 是可以购买的新机下限，24GB/1TB 是我认为更像四五年主力机的组合。二手 M2/M3 Air 也值得看，但 8GB 内存不建议当长期主力。Mac mini 适合宿舍/家里已有显示器的人，但它不是一台“随时带去图书馆”的电脑。'],
  developer: ['developer.md', '开发者买 Mac 的关键不是单次 benchmark，而是“持续负载 + 多任务 + 内存”。如果你写前端、脚本、轻后端，Air M5 24GB 可以很好用；但只要你长期 Docker、多 IDE、数据库、本地服务、浏览器几十个 tab、移动端模拟器同时开，MacBook Pro M5 Pro 或 Mac mini M4 Pro 会明显更稳。桌面开发我更喜欢 mini M4 Pro 48GB/1TB：便宜、安静、端口足、可以接好屏幕长期当 devbox。移动开发则选 14 英寸 MacBook Pro M5 Pro。不要为了省钱买 16GB Pro，也不要为了“未来可能 AI”盲目买 Max；先把内存买对。'],
  creator: ['creator.md', '创作者要先判断瓶颈：照片和设计吃屏幕、内存和存储；剪辑吃媒体引擎、内存、硬盘和散热；3D/动效吃 GPU 和长时间性能。轻量创作可以 Air M5 24GB，但它不适合全天满载。移动主力选 MacBook Pro M5 Pro，预算充足且多机位/8K/复杂 AE/DaVinci/Blender 再上 M5 Max。固定桌面选 Mac Studio M4 Max，会比同级笔记本更安静、更稳定、更像工作室设备。M3 Ultra Studio 不是给“剪点视频”的人，而是给超大工程、超多显示器、超大统一内存和长时间并行工作的人。'],
  ai: ['local-ai.md', '本地 AI 购买逻辑和普通电脑完全不同：统一内存容量往往比芯片新旧更关键。16GB 适合体验，24/32GB 能跑不少小模型和开发工具，64GB 开始像认真干活，128GB 以上才进入“本地模型工作站”的舒适区。移动选 MacBook Pro M5 Max，尽量 64GB 起；固定桌面看 Mac Studio，M4 Max 适合中等 AI + 创作混合，M3 Ultra 适合大内存池、多模型、多数据、多显示器。不要把 Mac 当成 CUDA 服务器；它强在统一内存、低噪音、集成体验和本地开发便利，不强在所有深度学习生态。'],
  used: ['used-market.md', '二手 Mac 的价值顺序是：无监管锁/MDM > 无进水维修 > 电池健康 > 内存容量 > 硬盘容量 > 芯片代际 > 外观。M1 Air 16GB 仍可买，8GB 谨慎；M1 Pro/Max 14/16 英寸如果价格合理，是二手高性能甜点；M2 Air 适合喜欢新外观的人；M2/M3/M4 Pro 机型要看价格差，低配新机不一定比高配旧机好。Mac mini 二手要确认电源、接口、硬盘寿命和是否来自公司资产；Mac Studio 二手要确认长期满载史、保修、风扇噪音和是否真需要它。看到“便宜顶配”不要兴奋，先查序列号、激活锁、MDM、维修记录。'],
  config: ['configuration.md', '配置建议可以粗暴一点：日常 16GB 是底线，24GB 更长寿；开发 24GB 起，48GB 舒服；创作 36/48GB 起，复杂视频/3D 上 64GB；本地 AI 64GB 起，严肃模型 128GB 以上。硬盘方面，512GB 是新机下限，1TB 是主力甜点，2TB 适合创作和开发，4TB+ 只在素材/项目真的本地常驻时买。Apple 内存不能后加，硬盘虽然可外接但系统盘太小会持续烦你。预算不够时，我通常建议“降芯片、升内存”，而不是买最高芯片配最小内存。']
};

const blockState = new WeakMap();
const pretextBlocks = new Set();
let metrics = { blocks: 0, lines: 0, width: 0 };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function getFont(el) {
  const style = getComputedStyle(el);
  return `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

function setPretext(el, text) {
  if (!el) return;
  el.dataset.text = text;
  pretextBlocks.add(el);
  renderPretext(el);
  observe(el);
}

function renderPretext(el) {
  const text = el.dataset.text || '';
  const font = getFont(el);
  const width = Math.max(180, Math.floor(el.clientWidth - 2));
  const key = `${font}\n${width}\n${text}`;
  let state = blockState.get(el);
  if (!state || state.key !== key) {
    state = { key, prepared: prepareWithSegments(text, font, { wordBreak: 'normal' }) };
    blockState.set(el, state);
  }
  const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 26;
  const result = layoutWithLines(state.prepared, width, lineHeight);
  el.innerHTML = result.lines.map((line) => `<span class="pretext-line">${escapeHtml(line.text)}</span>`).join('');
  metrics = {
    blocks: pretextBlocks.size,
    lines: [...pretextBlocks].reduce((sum, block) => sum + block.children.length, 0),
    width
  };
  $('#metricBlocks').textContent = metrics.blocks;
  $('#metricLines').textContent = metrics.lines;
  $('#metricWidth').textContent = metrics.width;
}

const resizeObserver = new ResizeObserver((entries) => entries.forEach((entry) => renderPretext(entry.target)));
function observe(el) {
  if (!el.dataset.observed) {
    el.dataset.observed = '1';
    resizeObserver.observe(el);
  }
}

function renderGenerations() {
  const rail = $('#generationRail');
  rail.innerHTML = generations.map((gen) => `
    <button class="generation-button ${gen.id === 'm5' ? 'active' : ''}" data-generation="${gen.id}">
      <b>${gen.label}</b><span>${gen.years}</span>
    </button>`).join('');
  rail.addEventListener('click', (event) => {
    const button = event.target.closest('.generation-button');
    if (!button) return;
    $$('.generation-button').forEach((item) => item.classList.toggle('active', item === button));
    selectGeneration(button.dataset.generation);
  });
  selectGeneration('m5');
}

function selectGeneration(id) {
  const gen = generations.find((item) => item.id === id) || generations.at(-1);
  $('#generationTitle').textContent = `${gen.label.toLowerCase()}-generation.log`;
  setPretext($('#generationNarrative'), `${gen.title} ${gen.text}`);
}

function renderFamilies() {
  $('#familyGrid').innerHTML = families.map((family) => `
    <article class="family-card">
      <pre aria-hidden="true">${family.ascii.join('\n')}</pre>
      <h3>${escapeHtml(family.name)}</h3>
      <p>${escapeHtml(family.body)}</p>
      <ul>${family.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </article>`).join('');
}

function renderModels() {
  $('#modelGrid').innerHTML = models.map((model) => `
    <article class="model-card">
      <pre class="model-ascii" aria-hidden="true">${model.ascii.join('\n')}</pre>
      <div>
        <h3>${escapeHtml(model.name)}</h3>
        <p><b>适合：</b>${escapeHtml(model.verdict)}</p>
        <p><b>不适合：</b>${escapeHtml(model.avoid)}</p>
        <div class="pill-row">${model.pills.map((pill) => `<span class="pill">${escapeHtml(pill)}</span>`).join('')}</div>
      </div>
    </article>`).join('');
}

function formState() {
  const data = new FormData($('#chooserForm'));
  return {
    workload: data.get('workload') || 'daily',
    shape: data.get('shape') || 'portable',
    budget: Number($('#budget').value),
    pains: data.getAll('pain')
  };
}

function painLabel(value) {
  return ({ noise: '噪音', ports: '接口', screen: '屏幕', aging: '寿命' })[value] || value;
}

function asciiFor(state) {
  if (state.shape === 'desk' && state.workload === 'ai') return ['      ╭──────────────╮','      │  MAC STUDIO  │','      │  M3 ULTRA    │','      │  MEM >>> GPU │','      ╰──────────────╯','        ══╤════╤══','          │    │'].join('\n');
  if (state.shape === 'desk') return ['       ╭──────────╮','       │ MAC MINI │','       │  M4 PRO  │','       ╰──────────╯','      ●          ●'].join('\n');
  if (state.workload === 'daily') return ['  ╭────────────────╮','  │ MacBook Air M5 │','  │  light / quiet │','  ╰────────────────╯','       ╲______╱'].join('\n');
  return ['  ╭────────────────╮','  │ MacBook Pro M5 │','  │ Pro / Max core │','  ╰────────────────╯','       ╲______╱'].join('\n');
}

function updateRecommendation() {
  const state = formState();
  $('#budgetOut').textContent = budgetLabels[state.budget - 1];
  const base = recommendations[state.workload][state.shape] || recommendations[state.workload].either;
  const pain = state.pains.length
    ? ` 你特别在意「${state.pains.map(painLabel).join('、')}」，所以配置上要更保守：宁可升内存/接口/屏幕形态，也不要只追芯片名。`
    : ' 如果预算摇摆，先把内存和硬盘定对，再决定芯片档位。';
  $('#asciiMac').textContent = asciiFor(state);
  setPretext($('#recommendationText'), base + pain);
}

function renderGuide(id) {
  const [title, text] = guideTexts[id] || guideTexts.student;
  $('#guideTitle').textContent = title;
  setPretext($('#guideText'), text);
}

function bindControls() {
  $('#chooserForm').addEventListener('input', updateRecommendation);
  $$('.guide-nav button').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.guide-nav button').forEach((item) => item.classList.toggle('active', item === button));
      renderGuide(button.dataset.guide);
    });
  });
}

function drawChipField(time = 0) {
  const target = $('#chipField');
  if (!target) return;
  const cols = innerWidth < 700 ? 44 : 70;
  const rows = innerWidth < 700 ? 24 : 34;
  const chars = ' .·:+*#%@';
  const labels = ['M1', 'M2', 'M3', 'M4', 'M5', 'AIR', 'PRO', 'MAX', 'ULTRA', 'MINI', 'STUDIO'];
  const t = time / 600;
  const out = [];
  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < cols; x++) {
      const cx = x - cols / 2;
      const cy = y - rows / 2;
      const ring = Math.sin(Math.hypot(cx * 1.4, cy * 2.2) / 2.2 - t);
      const wave = Math.sin((x + t * 2) * .32) + Math.cos((y - t) * .44);
      const die = x > cols * .25 && x < cols * .75 && y > rows * .22 && y < rows * .78;
      let idx = Math.floor(((ring + wave + 4) / 6) * (chars.length - 1));
      if (die && (x % 7 === 0 || y % 5 === 0)) idx = chars.length - 2;
      line += chars[Math.max(0, Math.min(chars.length - 1, idx))];
    }
    out.push(line);
  }
  labels.forEach((label, i) => {
    const y = 3 + (i * 3) % (rows - 6);
    const x = 4 + (i * 11) % Math.max(12, cols - 14);
    out[y] = out[y].slice(0, x) + label + out[y].slice(x + label.length);
  });
  target.textContent = out.join('\n');
  if (!reducedMotion) requestAnimationFrame(drawChipField);
}

function pulseAscii() {
  if (reducedMotion) return;
  let tick = 0;
  setInterval(() => {
    tick++;
    $$('.family-card pre, .model-ascii').forEach((pre, index) => {
      pre.style.filter = `hue-rotate(${(tick * 8 + index * 30) % 360}deg)`;
      pre.style.opacity = String(.78 + Math.sin((tick + index) / 4) * .18);
    });
  }, 260);
}

function init() {
  renderGenerations();
  renderFamilies();
  renderModels();
  bindControls();
  updateRecommendation();
  renderGuide('student');
  drawChipField();
  pulseAscii();
  if (document.fonts?.ready) document.fonts.ready.then(() => pretextBlocks.forEach(renderPretext)).catch(() => {});
}

init();
