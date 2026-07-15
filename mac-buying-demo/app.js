import { layoutWithLines, prepareWithSegments, setLocale } from './pretext/layout.js';

setLocale('zh-CN');

const screen = document.querySelector('#screen');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const sourceLinks = [
  'Apple Support · MacBook Air M5 Tech Specs · https://support.apple.com/en-us/126320',
  'Apple Support · MacBook Pro M5 Pro / M5 Max Tech Specs · https://support.apple.com/en-us/126318',
  'Apple Support · Mac mini 2024 Tech Specs · https://support.apple.com/en-us/121555',
  'Apple · Mac Studio Technical Specifications · https://www.apple.com/mac-studio/specs/',
  'Pretext · https://github.com/chenglou/pretext'
];

const budgetLabels = ['极限省钱', '谨慎预算', '主流甜点', '专业预算', '拉满不后悔'];
const workloads = [
  ['daily', 'D', '日常/学生'],
  ['dev', 'V', '开发/编程'],
  ['creator', 'C', '影像/创作'],
  ['ai', 'A', '本地 AI/科研']
];
const shapes = [
  ['portable', 'P', '带走'],
  ['desk', 'S', '桌面'],
  ['either', 'E', '都可']
];
const guideOrder = ['student', 'developer', 'creator', 'ai', 'used', 'config'];

const generations = [
  {
    label: 'M1',
    years: '2020–2022',
    title: 'M1：Apple Silicon 的地基，今天看仍是低功耗日常的分水岭。',
    map: [
      ['MacBook', 'M1 Air / M1 13" Pro；M1 Pro/Max 14"、16" Pro'],
      ['Mac mini', 'M1 mini：家用桌面、轻开发、媒体服务器仍可用'],
      ['Mac Studio', 'M1 Max / M1 Ultra：二手工作站，只适合明确吃内存/媒体引擎的人']
    ],
    text: 'M1 的伟大在于它重新定义了 Mac 的下限：静音、低热、续航长，基础体验突然从“能用”变成“很好用”。今天买 M1 要冷静：M1 Air / M1 mini 适合写作、网页、轻开发、轻剪辑和家庭桌面；8GB 内存版本会老得快，外接屏限制也更明显。真正值得淘的是 16GB 以上、无监管锁、健康电池的 M1 Air，或者价格合适的 M1 Pro/Max 14/16 英寸 MacBook Pro。M1 Ultra Studio 不适合普通人捡漏，它是特定工作流机器。'
  },
  {
    label: 'M2',
    years: '2022–2023',
    title: 'M2：换壳、补短板、让二手甜点开始成型。',
    map: [
      ['MacBook', 'M2 Air 新外观；M2 13" Pro 过渡；M2 Pro/Max 14"、16" Pro'],
      ['Mac mini', 'M2 mini / M2 Pro mini：第一代特别像桌面 devbox 的 mini'],
      ['Mac Studio', 'M2 Max / M2 Ultra：创作和高内存桌面的成熟代']
    ],
    text: 'M2 不是革命，而是 Apple Silicon 的成熟化。M2 Air 的价值是 MagSafe、新外观、更现代的屏幕比例和更好的日常体验；M2 Pro Mac mini 则是桌面开发者的甜点原型。购买这一代时别只看“比 M1 新”：基础 256GB SSD、8GB 内存和过低电池健康都可能把便宜变成麻烦。M2 Studio 仍有意义，但要按真实工作流买，不要因为外壳漂亮就把它当高端摆件。'
  },
  {
    label: 'M3',
    years: '2023–2025',
    title: 'M3：3nm、图形、光追和能效补课，二手高配很香。',
    map: [
      ['MacBook', 'M3 Air；M3/M3 Pro/M3 Max MacBook Pro'],
      ['Mac mini', '没有主线 M3 mini，桌面小主机跳到 M4 更值得'],
      ['Mac Studio', 'M3 Ultra Studio：高端桌面的大内存/多屏节点']
    ],
    text: 'M3 的关键词是 3nm、硬件光线追踪、图形能力和能效。M3 Air 是非常稳的轻薄本，M3 Pro/Max MacBook Pro 适合已经错过 M1/M2 Pro 的人。不要被“不是最新”吓到：当价格合适、内存足够时，高配 M3 往往比低配新机更合理。M3 Ultra Studio 则要和 M4 Max Studio 分开看：前者偏超大内存池和桌面极限，后者偏创作甜点。'
  },
  {
    label: 'M4',
    years: '2024–2026',
    title: 'M4：Mac mini 黄金代，桌面理性党的漂亮答案。',
    map: [
      ['MacBook', 'M4/M4 Pro/M4 Max MacBook Pro：上一代移动专业主力'],
      ['Mac mini', 'M4 mini / M4 Pro mini：性价比、接口、桌面性能全面成立'],
      ['Mac Studio', 'M4 Max Studio：安静满载的创作桌面主力']
    ],
    text: 'M4 在 Mac mini 上尤其漂亮：基础 M4 mini 对日常和轻开发已经很强，M4 Pro mini 是 Docker、多屏、编译、轻中度创作的高性价比核心。Mac Studio M4 Max 则适合靠机器吃饭的创作者：安静、端口集中、散热从容。M4 世代买新机时别被“基础够用”骗：16GB 能日常，24GB/32GB 更像长期主力；Pro/Max 工作流尽量从 48GB/64GB 往上看。'
  },
  {
    label: 'M5',
    years: '2025–2026',
    title: 'M5：MacBook 主线更新，AI、带宽、无线和存储下限更完整。',
    map: [
      ['MacBook', 'M5 Air；M5/M5 Pro/M5 Max MacBook Pro'],
      ['Mac mini', '截至本页日期仍看 M4/M4 Pro mini，不要硬等不存在的 M5 mini'],
      ['Mac Studio', '当前仍是 M4 Max / M3 Ultra Studio，按桌面工作流而非芯片数字买']
    ],
    text: 'M5 的主战场是 MacBook。M5 Air 适合大多数移动日常用户：轻、静、续航、512GB 起步、更强图形/AI 和无线升级。M5 Pro/Max MacBook Pro 则覆盖开发、创作、本地 AI 和移动工作站。桌面端要理性：Mac mini 仍然看 M4/M4 Pro，Mac Studio 仍然看 M4 Max / M3 Ultra。不要按数字买新，按形态、内存、散热、端口和工作流买。'
  }
];

const families = [
  {
    name: 'MacBook Air / Pro',
    art: ['╭────────────────────╮', '│  M5 ░ portable ░   │', '│  quiet / xdr / fan │', '╰────────────────────╯', '        ╲______╱'],
    text: 'MacBook 是“随身生产力”。Air 买轻、静、续航和低维护；Pro 买屏幕、风扇、端口和持续性能。不要因为偶尔剪视频就强行 Pro，也不要因为 Air 跑分漂亮就拿它长期满载。学生和文字工作从 Air M5 16GB 起；开发/创作优先 M5 Pro；本地 AI、3D 和多路视频再看 M5 Max。'
  },
  {
    name: 'Mac mini',
    art: ['   ╭────────────╮', '   │ M4 mini    │', '   │ devbox ::: │', '   ╰────────────╯', '     ●        ●'],
    text: 'Mac mini 是“固定工位的理性”。如果你有好显示器、键盘、网线、备份盘，它的价值会暴涨。M4 基础款适合日常和轻开发；M4 Pro 是开发、多屏、轻中度创作的甜点。别忘了总成本：没有显示器和外设时，Air 可能更省心。'
  },
  {
    name: 'Mac Studio',
    art: ['╭──────────────╮', '│  STUDIO      │', '│  M4 MAX      │', '│  M3 ULTRA    │', '╰──────────────╯', '  ≋≋ airflow ≋≋'],
    text: 'Mac Studio 是“桌面工作站”。它适合靠机器吃饭的人：长时间渲染、音视频、多显示器、超大内存、本地模型、科研计算。M4 Max 偏创作甜点；M3 Ultra 偏超大统一内存和极限并行。普通开发别过度购买 Studio。'
  }
];

const models = [
  {
    name: 'MacBook Air M5 13/15',
    art: ['╭──────────────╮', '│ AIR   M5     │', '│ fanless      │', '╰──────────────╯'],
    text: '移动日常首选。适合学生、写作、网页、轻开发、轻剪辑和多数商务用户。16GB/512GB 是新机下限，24GB/1TB 更像四五年主力。不适合长期满载编译、重 3D、多路视频和严肃本地模型。'
  },
  {
    name: 'MacBook Pro M5 Pro',
    art: ['╭──────────────╮', '│ PRO  M5 PRO  │', '│ XDR + TB5    │', '╰──────────────╯'],
    text: '开发者和创作者的移动甜点。你买的是 XDR 屏、风扇、端口、长时间性能和更稳的内存结构。轻办公会嫌贵嫌重；Docker、多 IDE、移动端模拟器、Resolve、AE 和大型照片库会觉得它刚好。'
  },
  {
    name: 'MacBook Pro M5 Max',
    art: ['╭──────────────╮', '│ MAX >>>>>>>  │', '│ AI / 8K / 3D │', '╰──────────────╯'],
    text: '真正移动工作站。视频、3D、本地模型、重型多任务、外接多屏和大工程才值得。预算紧、负载偶发、只是想买最好的人会浪费钱；如果买，优先 64GB/128GB 内存，而不是只看芯片名。'
  },
  {
    name: 'Mac mini M4',
    art: ['╭────────╮', '│ M4     │', '│ mini   │', '╰────────╯'],
    text: '固定桌面日常/轻开发性价比最高。小、安静、便宜、外设自由。适合家用桌面、办公室工位、轻服务和低噪音常驻机。没有好屏幕和键鼠时总成本会上去。'
  },
  {
    name: 'Mac mini M4 Pro',
    art: ['╭────────╮', '│ M4 PRO │', '│ devbox │', '╰────────╯'],
    text: '桌面开发甜点。Docker、编译、多屏、轻中度创作都很舒服。认真用建议 48GB/1TB；如果需要 128GB+ 内存、长时间重 GPU 或大量专业 I/O，直接看 Studio。'
  },
  {
    name: 'Mac Studio M4 Max / M3 Ultra',
    art: ['╭──────────╮', '│ STUDIO   │', '│ MAX/ULTRA│', '╰──────────╯'],
    text: '专业桌面工作站。M4 Max 偏创作主力，M3 Ultra 偏超大内存和极限并行。它的价值是安静满载、接口、散热、媒体引擎和统一内存上限，不是“看起来高级”。'
  }
];

const guideTexts = {
  student: ['学生 / 日常', '学生、写作者、轻办公用户最容易被“性能焦虑”骗。你真正需要的是轻、安静、续航、屏幕舒服、键盘好、摄像头够用、系统稳定。M5 MacBook Air 13 英寸是默认答案；经常分屏、写论文、开文献、上网课和视频，15 英寸 Air 很舒服但便携性会下降。配置上，16GB/512GB 是可以购买的新机下限，24GB/1TB 是我认为更像四五年主力机的组合。二手 M2/M3 Air 也值得看，但 8GB 内存不建议当长期主力。Mac mini 适合宿舍/家里已有显示器的人，但它不是一台能随时带去图书馆的电脑。'],
  developer: ['开发者', '开发者买 Mac 的关键不是单次 benchmark，而是持续负载、多任务和内存。轻前端、脚本、轻后端可以 Air M5 24GB；长期 Docker、多 IDE、数据库、本地服务、浏览器几十个 tab、移动端模拟器同时开，MacBook Pro M5 Pro 或 Mac mini M4 Pro 会明显更稳。桌面开发我更喜欢 mini M4 Pro 48GB/1TB：便宜、安静、端口足、可以接好屏幕长期当 devbox。移动开发选 14 英寸 MacBook Pro M5 Pro。不要为了省钱买 16GB Pro，也不要为了“未来可能 AI”盲目买 Max；先把内存买对。'],
  creator: ['创作者', '创作者要先判断瓶颈：照片和设计吃屏幕、内存和存储；剪辑吃媒体引擎、硬盘和散热；3D/动效吃 GPU 和长时间性能。轻量创作可以 Air M5 24GB，但它不适合全天满载。移动主力选 MacBook Pro M5 Pro，预算充足且多机位 4K/8K、复杂 AE、DaVinci、Blender 再上 M5 Max。固定桌面选 Mac Studio M4 Max，会比同级笔记本更安静、更稳定、更像工作室设备。M3 Ultra Studio 不是给“剪点视频”的人，而是给超大工程、超多显示器、超大统一内存和长时间并行工作的人。'],
  ai: ['本地 AI / 科研', '本地 AI 购买逻辑和普通电脑不同：统一内存容量往往比芯片新旧更关键。16GB 适合体验，24/32GB 能跑不少小模型和开发工具，64GB 开始像认真干活，128GB 以上才进入“本地模型工作站”的舒适区。移动选 MacBook Pro M5 Max，尽量 64GB 起；固定桌面看 Mac Studio，M4 Max 适合中等 AI + 创作混合，M3 Ultra 适合大内存池、多模型、多数据、多显示器。不要把 Mac 当成 CUDA 服务器；它强在统一内存、低噪音、集成体验和本地开发便利，不强在所有深度学习生态。'],
  used: ['二手与避坑', '二手 Mac 的价值顺序是：无监管锁/MDM > 无进水维修 > 电池健康 > 内存容量 > 硬盘容量 > 芯片代际 > 外观。M1 Air 16GB 仍可买，8GB 谨慎；M1 Pro/Max 14/16 英寸如果价格合理，是二手高性能甜点；M2 Air 适合喜欢新外观的人；M2/M3/M4 Pro 机型要看价格差，低配新机不一定比高配旧机好。Mac mini 二手要确认电源、接口、硬盘寿命和是否来自公司资产；Mac Studio 二手要确认长期满载史、保修、风扇噪音和是否真需要它。看到“便宜顶配”不要兴奋，先查序列号、激活锁、MDM、维修记录。'],
  config: ['内存 / 硬盘配置', '配置建议可以粗暴一点：日常 16GB 是底线，24GB 更长寿；开发 24GB 起，48GB 舒服；创作 36/48GB 起，复杂视频/3D 上 64GB；本地 AI 64GB 起，严肃模型 128GB 以上。硬盘方面，512GB 是新机下限，1TB 是主力甜点，2TB 适合创作和开发，4TB+ 只在素材/项目真的本地常驻时买。Apple 内存不能后加，硬盘虽然可外接但系统盘太小会持续烦你。预算不够时，我通常建议降芯片、升内存，而不是买最高芯片配最小内存。']
};

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

const state = {
  generation: 4,
  workload: 'dev',
  shape: 'portable',
  budget: 3,
  family: 0,
  model: 1,
  guide: 1,
  help: false,
  frame: 0,
  cols: 110,
  charPx: 8,
  linePx: 16,
  font: ''
};

const hotspots = [];
const preparedCache = new Map();
const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' });

function styleFont() {
  const style = getComputedStyle(screen);
  return `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

function measureTerminal() {
  const font = styleFont();
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = font;
  state.font = font;
  state.charPx = Math.max(6, probe.measureText('0').width || 8);
  state.linePx = Number.parseFloat(getComputedStyle(screen).lineHeight) || 16;
  const inner = Math.max(320, screen.clientWidth - 8);
  state.cols = Math.max(74, Math.min(132, Math.floor(inner / state.charPx)));
}

function graphemes(text) {
  return [...segmenter.segment(String(text))].map((part) => part.segment);
}

function cellWidth(text) {
  let width = 0;
  for (const g of graphemes(text)) {
    const cp = g.codePointAt(0) || 0;
    if (g === '\n') continue;
    if (cp <= 0x1f || (cp >= 0x7f && cp <= 0x9f)) continue;
    if (
      cp >= 0x1100 &&
      (cp <= 0x115f || cp === 0x2329 || cp === 0x232a ||
        (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f) ||
        (cp >= 0xac00 && cp <= 0xd7a3) ||
        (cp >= 0xf900 && cp <= 0xfaff) ||
        (cp >= 0xfe10 && cp <= 0xfe19) ||
        (cp >= 0xfe30 && cp <= 0xfe6f) ||
        (cp >= 0xff00 && cp <= 0xff60) ||
        (cp >= 0xffe0 && cp <= 0xffe6) ||
        (cp >= 0x1f300 && cp <= 0x1faff))
    ) width += 2;
    else width += 1;
  }
  return width;
}

function sliceCells(text, max) {
  let out = '';
  let width = 0;
  for (const g of graphemes(text)) {
    const w = cellWidth(g);
    if (width + w > max) break;
    out += g;
    width += w;
  }
  return out;
}

function pad(text, width, align = 'left') {
  const value = cellWidth(text) > width ? sliceCells(text, Math.max(0, width - 1)) + '…' : text;
  const gap = Math.max(0, width - cellWidth(value));
  if (align === 'right') return ' '.repeat(gap) + value;
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    return ' '.repeat(left) + value + ' '.repeat(gap - left);
  }
  return value + ' '.repeat(gap);
}

function repeatPattern(pattern, width, offset = 0) {
  let out = '';
  while (cellWidth(out) < width + cellWidth(pattern)) out += pattern;
  return sliceCells(out.slice(offset % pattern.length) + out, width);
}

function wrap(text, cols, options = {}) {
  const widthPx = Math.max(40, cols * state.charPx);
  const key = `${state.font}\n${widthPx}\n${options.wordBreak || 'normal'}\n${text}`;
  let prepared = preparedCache.get(key);
  if (!prepared) {
    prepared = prepareWithSegments(text, state.font, { wordBreak: options.wordBreak || 'normal' });
    preparedCache.set(key, prepared);
  }
  const result = layoutWithLines(prepared, widthPx, state.linePx);
  const lines = result.lines.map((line) => pad(line.text.trimEnd(), cols));
  return lines.length ? lines : [' '.repeat(cols)];
}

function blank(lines, n = 1) {
  for (let i = 0; i < n; i++) lines.push('');
}

function box(title, bodyLines, width, options = {}) {
  const fill = options.fill || ' ';
  const topLabel = ` ${title} `;
  const top = '╭' + topLabel + repeatPattern('─', Math.max(0, width - cellWidth(topLabel) - 2), state.frame) + '╮';
  const bottom = '╰' + repeatPattern('─', width - 2, state.frame + 3) + '╯';
  const rows = [top];
  for (const line of bodyLines) {
    const content = pad(line, width - 4);
    rows.push('│ ' + (fill === ' ' ? content : content.replace(/ /g, fill)) + ' │');
  }
  rows.push(bottom);
  return rows;
}

function columns(left, right, width, gap = 3) {
  const leftWidth = Math.floor((width - gap) * .52);
  const rightWidth = width - gap - leftWidth;
  const leftRows = left(leftWidth);
  const rightRows = right(rightWidth);
  const height = Math.max(leftRows.length, rightRows.length);
  const rows = [];
  for (let i = 0; i < height; i++) {
    rows.push(pad(leftRows[i] || '', leftWidth) + ' '.repeat(gap) + pad(rightRows[i] || '', rightWidth));
  }
  return rows;
}

function addHotspot(row, col, width, height, action, label) {
  hotspots.push({ row, col, width, height, action, label });
}

function pushRows(lines, rows) {
  const start = lines.length;
  for (const row of rows) lines.push(row);
  return start;
}

function header(width) {
  const t = state.frame;
  const left = 'vincejiang.com/gallery :: PRETEXT TEXT-MODE MAC ATLAS';
  const right = `${new Date().toISOString().slice(0, 10)} :: frame ${String(t % 10000).padStart(4, '0')}`;
  const spark = repeatPattern('·░▒▓▒░', width, t);
  return [
    spark,
    pad(left, Math.max(0, width - cellWidth(right) - 1)) + ' ' + right,
    repeatPattern('─', width, t + 2)
  ];
}

function chipField(width, height = 18) {
  const labels = ['M1', 'M2', 'M3', 'M4', 'M5', 'AIR', 'PRO', 'MAX', 'ULTRA', 'MINI', 'STUDIO', 'PRETEXT'];
  const chars = ' .·:;+=x#%@';
  const rows = [];
  const t = state.frame / 4.5;
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const cx = x - width / 2;
      const cy = (y - height / 2) * 2.2;
      const die = x > width * .20 && x < width * .80 && y > height * .22 && y < height * .76;
      const lanes = die && (x % 9 === 0 || y % 4 === 0);
      const wave = Math.sin(Math.hypot(cx, cy) / 4.4 - t) + Math.cos((x + t * 2) / 8) + Math.sin((y - t) / 3);
      const idx = lanes ? chars.length - 2 : Math.max(0, Math.min(chars.length - 1, Math.floor((wave + 3) / 6 * chars.length)));
      line += chars[idx] || '.';
    }
    rows.push(line);
  }
  labels.forEach((label, i) => {
    const y = 2 + ((i * 3 + Math.floor(t)) % Math.max(3, height - 4));
    const x = 3 + ((i * 13 + Math.floor(t * 2)) % Math.max(4, width - label.length - 4));
    rows[y] = rows[y].slice(0, x) + label + rows[y].slice(x + label.length);
  });
  const headline = ' M-SERIES BUYING GUIDE RENDERED AS TEXT ';
  const mid = Math.floor(height / 2);
  const start = Math.max(0, Math.floor((width - cellWidth(headline)) / 2));
  rows[mid] = rows[mid].slice(0, start) + headline + rows[mid].slice(start + headline.length);
  return rows;
}

function commandButton(key, label, active) {
  return `${active ? '▶' : ' '}[${key}] ${label}`;
}

function controls(width, lines) {
  const rows = [];
  const workloadLine = workloads.map(([id, key, label]) => commandButton(key, label, state.workload === id)).join('   ');
  const shapeLine = shapes.map(([id, key, label]) => commandButton(key, label, state.shape === id)).join('   ');
  const budgetTrack = Array.from({ length: 5 }, (_, i) => i + 1 === state.budget ? '●' : '○').join(' ');
  const guide = guideTexts[guideOrder[state.guide]][0];
  rows.push(pad('keyboard-only UI; mouse clicks are mapped to character cells, not HTML buttons.', width - 4));
  rows.push(pad(workloadLine, width - 4));
  rows.push(pad(`${shapeLine}   [B] 预算 ${budgetTrack} ${budgetLabels[state.budget - 1]}   [G] 建议章节 ${guide}`, width - 4));
  rows.push(pad(`[1-5] M 世代：${generations[state.generation].label}   [F] 产品族：${families[state.family].name}   [M] 机型：${models[state.model].name}   [?] 帮助   [R] 重置`, width - 4));
  const start = lines.length;
  const out = box('TEXT CONTROLS / no form elements', rows, width);
  pushRows(lines, out);
  const baseRow = start + 2;
  const allControls = [
    ...workloads.map(([id, key]) => [key, () => { state.workload = id; render(); }]),
    ...shapes.map(([id, key]) => [key, () => { state.shape = id; render(); }]),
    ['B', () => { state.budget = state.budget % 5 + 1; render(); }],
    ['G', () => { state.guide = (state.guide + 1) % guideOrder.length; render(); }],
    ['F', () => { state.family = (state.family + 1) % families.length; render(); }],
    ['M', () => { state.model = (state.model + 1) % models.length; render(); }],
    ['?', () => { state.help = !state.help; render(); }],
    ['R', reset]
  ];
  for (const [key, action] of allControls) addHotspot(baseRow, 0, width, 4, action, key);
}

function recommendationText() {
  const base = recommendations[state.workload][state.shape] || recommendations[state.workload].either;
  const budget = [
    '当前预算档是“极限省钱”：优先二手/教育优惠，但不要牺牲内存底线。',
    '当前预算档是“谨慎预算”：可以降芯片，不要降到 8GB 或太小系统盘。',
    '当前预算档是“主流甜点”：把钱放在 24/48GB 内存与 1TB 系统盘上。',
    '当前预算档是“专业预算”：Pro/Max/Studio 可以考虑，但仍要按负载买。',
    '当前预算档是“拉满不后悔”：先确认你真的吃满内存、GPU、端口和散热。'
  ][state.budget - 1];
  return `${base} ${budget}`;
}

function asciiMachine() {
  if (state.shape === 'desk' && state.workload === 'ai') return ['        ╭──────────────╮', '        │  MAC STUDIO  │', '        │  MEM >>> GPU │', '        │  M3 ULTRA    │', '        ╰──────────────╯', '          ══╤════╤══', '            │    │'];
  if (state.shape === 'desk') return ['          ╭──────────╮', '          │ MAC MINI │', '          │  M4 PRO  │', '          ╰──────────╯', '        ●            ●'];
  if (state.workload === 'daily') return ['     ╭────────────────╮', '     │ MacBook Air M5 │', '     │ light / quiet  │', '     ╰────────────────╯', '          ╲______╱'];
  return ['     ╭────────────────╮', '     │ MacBook Pro M5 │', '     │ Pro / Max core │', '     ╰────────────────╯', '          ╲______╱'];
}

function renderIntro(width, lines) {
  const left = (w) => box('PRETEXT IS THE PAGE ENGINE', [
    ...wrap('上一版的问题是：HTML/CSS 在负责视觉结构，Pretext 只是帮几段文字换行。现在这个页面反过来：DOM 只提供一个 <pre> 屏幕，所有可见结构都由 JavaScript 生成字符帧；Pretext 负责测量中文/英文混排、按像素宽度断行，然后把结果装进 ASCII 面板。',
      w - 4),
    '',
    ...wrap('也就是说，背景、标题、按钮、芯片场、推荐器、世代表、机型卡和长文建议都不再是 HTML card。它们只是文本。CSS 只保留字体、颜色和屏幕承载。',
      w - 4)
  ], w);
  const right = (w) => box('LIVE TEXT CHIP FIELD', chipField(w - 4, 19), w);
  pushRows(lines, columns(left, right, width));
}

function renderRecommendation(width, lines) {
  const left = (w) => box('CURRENT RECOMMENDATION', [
    ...asciiMachine().map((row) => pad(row, w - 4, 'center')),
    '',
    ...wrap(recommendationText(), w - 4)
  ], w);
  const right = (w) => box('PRETEXT METRICS', [
    pad(`screen columns     ${state.cols}`, w - 4),
    pad(`prepared cache     ${preparedCache.size} text layouts`, w - 4),
    pad(`generation         ${generations[state.generation].label}`, w - 4),
    pad(`workload           ${workloads.find(([id]) => id === state.workload)?.[2]}`, w - 4),
    pad(`shape              ${shapes.find(([id]) => id === state.shape)?.[2]}`, w - 4),
    pad(`budget             ${budgetLabels[state.budget - 1]}`, w - 4),
    '',
    ...wrap('这些数字不是装饰：每次窗口宽度、章节或选购状态变化，页面都会重新通过 Pretext 计算文本行，再拼成新的字符帧。', w - 4)
  ], w);
  pushRows(lines, columns(left, right, width));
}

function renderGeneration(width, lines) {
  const gen = generations[state.generation];
  const rail = generations.map((item, index) => index === state.generation ? `▶${index + 1}:${item.label}` : ` ${index + 1}:${item.label}`).join('  ');
  const mapRows = gen.map.flatMap(([family, desc]) => wrap(`${family.padEnd(10, ' ')} :: ${desc}`, width - 6));
  const body = [
    pad(rail, width - 4),
    '',
    ...wrap(`${gen.label} / ${gen.years} / ${gen.title}`, width - 4),
    '',
    ...mapRows,
    '',
    ...wrap(gen.text, width - 4)
  ];
  const start = lines.length;
  pushRows(lines, box('M1 → M5 GENERATION MAP / press 1-5', body, width));
  addHotspot(start, 0, width, body.length + 2, () => {
    state.generation = (state.generation + 1) % generations.length;
    render();
  }, 'generation');
}

function renderFamilyAndModel(width, lines) {
  const family = families[state.family];
  const model = models[state.model];
  const left = (w) => box(`FORM FACTOR ${state.family + 1}/${families.length} / press F`, [
    ...family.art.map((row) => pad(row, w - 4, 'center')),
    '',
    ...wrap(`${family.name}：${family.text}`, w - 4)
  ], w);
  const right = (w) => box(`MODEL ${state.model + 1}/${models.length} / press M`, [
    ...model.art.map((row) => pad(row, w - 4, 'center')),
    '',
    ...wrap(`${model.name}：${model.text}`, w - 4)
  ], w);
  const start = lines.length;
  pushRows(lines, columns(left, right, width));
  addHotspot(start, 0, Math.floor(width / 2), 14, () => { state.family = (state.family + 1) % families.length; render(); }, 'family');
  addHotspot(start, Math.floor(width / 2), Math.floor(width / 2), 14, () => { state.model = (state.model + 1) % models.length; render(); }, 'model');
}

function renderGuide(width, lines) {
  const id = guideOrder[state.guide];
  const [title, text] = guideTexts[id];
  const tabs = guideOrder.map((key, i) => i === state.guide ? `▶${i + 1}.${guideTexts[key][0]}` : ` ${i + 1}.${guideTexts[key][0]}`).join('  ');
  const rows = [
    pad(tabs, width - 4),
    '',
    ...wrap(text, width - 4)
  ];
  const start = lines.length;
  pushRows(lines, box(`LONG BUYING NOTES / ${title} / press G`, rows, width));
  addHotspot(start, 0, width, rows.length + 2, () => { state.guide = (state.guide + 1) % guideOrder.length; render(); }, 'guide');
}

function renderFullAtlas(width, lines) {
  const rows = [];
  rows.push(pad('ALL-GENERATION QUICK TABLE: each row is generated as text and wrapped by Pretext, not by HTML table layout.', width - 4));
  blank(rows);
  for (const gen of generations) {
    rows.push(pad(`${gen.label} ${gen.years}`, width - 4));
    for (const [family, desc] of gen.map) {
      for (const line of wrap(`  ${family}: ${desc}`, width - 6)) rows.push('  ' + sliceCells(line, width - 6));
    }
    rows.push('');
  }
  pushRows(lines, box('COMPLETE M-SERIES FAMILY MATRIX', rows, width));
}

function renderSources(width, lines) {
  const body = [
    ...wrap('页面写于 2026-07-15。新机状态、地区售价、教育优惠和电商活动会变化；本文把“选型逻辑”放在第一位，价格只做预算档位参考。二手价格尤其波动，购买前请重新查当地行情、保修、电池循环、监管锁/MDM、进水维修史。',
      width - 4),
    '',
    ...sourceLinks.flatMap((link) => wrap(`· ${link}`, width - 4))
  ];
  pushRows(lines, box('SOURCES / copyable text links', body, width));
}

function renderHelp(width, lines) {
  if (!state.help) return;
  pushRows(lines, box('HELP', [
    ...wrap('1-5 切换 M1-M5。D/V/C/A 切换日常、开发、创作、本地 AI。P/S/E 切换带走、桌面、都可。B 循环预算。F 循环产品族。M 循环机型。G 循环长文建议。R 重置。鼠标点击控制面板、世代、产品族、机型、长文面板时，会按字符坐标触发对应逻辑；页面没有 HTML button、form、card 视觉结构。', width - 4)
  ], width));
}

function scanline(width) {
  const a = repeatPattern('░· ', width, state.frame);
  const b = repeatPattern('  ·▒', width, state.frame + 1);
  return state.frame % 2 ? a : b;
}

function render() {
  measureTerminal();
  hotspots.length = 0;
  const width = state.cols;
  const lines = [];
  pushRows(lines, header(width));
  blank(lines);
  controls(width, lines);
  blank(lines);
  renderIntro(width, lines);
  blank(lines);
  renderRecommendation(width, lines);
  blank(lines);
  renderGeneration(width, lines);
  blank(lines);
  renderFamilyAndModel(width, lines);
  blank(lines);
  renderGuide(width, lines);
  blank(lines);
  renderFullAtlas(width, lines);
  blank(lines);
  renderSources(width, lines);
  blank(lines);
  renderHelp(width, lines);
  blank(lines);
  lines.push(scanline(width));
  lines.push(pad('ASCII only · Pretext layout · one visible <pre> · CSS is only the phosphor tube', width, 'center'));
  screen.textContent = lines.join('\n');
}

function reset() {
  state.generation = 4;
  state.workload = 'dev';
  state.shape = 'portable';
  state.budget = 3;
  state.family = 0;
  state.model = 1;
  state.guide = 1;
  state.help = false;
  render();
}

function handleKey(event) {
  const key = event.key.toLowerCase();
  if (/^[1-5]$/.test(key)) state.generation = Number(key) - 1;
  else if (key === 'd') state.workload = 'daily';
  else if (key === 'v') state.workload = 'dev';
  else if (key === 'c') state.workload = 'creator';
  else if (key === 'a') state.workload = 'ai';
  else if (key === 'p') state.shape = 'portable';
  else if (key === 's') state.shape = 'desk';
  else if (key === 'e') state.shape = 'either';
  else if (key === 'b') state.budget = state.budget % 5 + 1;
  else if (key === 'g') state.guide = (state.guide + 1) % guideOrder.length;
  else if (key === 'f') state.family = (state.family + 1) % families.length;
  else if (key === 'm') state.model = (state.model + 1) % models.length;
  else if (key === '?') state.help = !state.help;
  else if (key === 'r') return reset();
  else return;
  event.preventDefault();
  render();
}

function handlePointer(event) {
  const rect = screen.getBoundingClientRect();
  const style = getComputedStyle(screen);
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padTop = Number.parseFloat(style.paddingTop) || 0;
  const x = Math.floor((event.clientX - rect.left + screen.scrollLeft - padLeft) / state.charPx);
  const y = Math.floor((event.clientY - rect.top + screen.scrollTop - padTop) / state.linePx);
  const hit = hotspots.find((spot) => y >= spot.row && y < spot.row + spot.height && x >= spot.col && x < spot.col + spot.width);
  if (hit) {
    event.preventDefault();
    hit.action();
  }
}

function tick() {
  state.frame += 1;
  render();
  if (!reducedMotion) window.setTimeout(tick, 180);
}

screen.addEventListener('keydown', handleKey);
screen.addEventListener('pointerdown', handlePointer);
screen.addEventListener('click', () => screen.focus());
window.addEventListener('resize', () => render());
if (document.fonts?.ready) document.fonts.ready.then(render).catch(render);
screen.focus({ preventScroll: true });
render();
if (!reducedMotion) tick();
