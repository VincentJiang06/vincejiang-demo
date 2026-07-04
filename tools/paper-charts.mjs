// paper-charts.mjs —— 论文模板(layout: paper)的构建时 SVG 图形渲染器。零依赖、纯函数。
// 三个入口:
//   renderChart(specJSON)   数据图表:bar / hbar / line / scatter / pie
//   renderFlow(specJSON)    结构图/流程图:分层节点 + 有向边
//   renderMindmap(text)     脑图:缩进文本树 → 左→右思维导图
// 视觉基调:学术黑白灰。系列用灰阶 + 线型 + 标记形状区分,不依赖彩色,黑白打印不丢信息。
// 出错策略:输入非法直接 throw(带上下文),由 build --check 挡在 CI。

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = "-apple-system,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif";
let UID = 0;                                    // 同页多图时 marker/clip id 去重

// 文本像素宽度估算(无 DOM,按字符类目估):CJK 全宽,拉丁按窄/宽字符近似
function textW(s, fs) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c > 0x2e7f) w += fs;                    // CJK 及全角标点
    else if (/[iIl1jft.,:;'"!|()[\] ]/.test(ch)) w += fs * 0.32;
    else if (/[A-Z@#%&mwMW_<>=+~]/.test(ch)) w += fs * 0.72;
    else w += fs * 0.56;
  }
  return w;
}
const num = (v, where) => {
  if (v === null) return null;
  const n = +v;
  if (!Number.isFinite(n)) throw new Error(`${where}: 非法数值 ${JSON.stringify(v)}`);
  return n;
};
const fmtN = v => {
  const n = +(+v).toPrecision(12);
  return Math.abs(n) >= 10000 ? n.toLocaleString('en-US') : String(n);
};

// 1-2-5 刻度
function niceScale(min, max, n = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new Error('数据域为空,无法定刻度');
  if (min === max) { max = min + (min === 0 ? 1 : Math.abs(min) * 0.1); }
  const step0 = (max - min) / n;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const norm = step0 / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toPrecision(12));
  return { lo, hi, ticks };
}

// 系列样式(打印安全):灰阶 + 线型 + 标记
const LINE_STY = [
  { stroke: '#111', dash: '', marker: 'circle', mfill: '#111' },
  { stroke: '#555', dash: '7 3.5', marker: 'square', mfill: '#fff' },
  { stroke: '#888', dash: '2 3', marker: 'triangle', mfill: '#888' },
  { stroke: '#333', dash: '9 3 2 3', marker: 'diamond', mfill: '#fff' },
  { stroke: '#777', dash: '4 3', marker: 'circle', mfill: '#fff' },
];
const BAR_FILL = ['#3a3a3a', '#8f8f8f', '#cfcfcf', '#efefef', '#616161', '#b3b3b3'];
const PIE_FILL = ['#3a3a3a', '#777', '#a6a6a6', '#cfcfcf', '#e9e9e9', '#555', '#8f8f8f'];

function marker(cx, cy, type, stroke, fill, r = 3.4) {
  switch (type) {
    case 'square': return `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
    case 'triangle': return `<path d="M${cx},${cy - r * 1.2} L${cx + r * 1.15},${cy + r} L${cx - r * 1.15},${cy + r} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
    case 'diamond': return `<path d="M${cx},${cy - r * 1.3} L${cx + r * 1.3},${cy} L${cx},${cy + r * 1.3} L${cx - r * 1.3},${cy} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
    default: return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
  }
}
const R2 = v => Math.round(v * 100) / 100;

// 图例行(水平),返回 {svg, h}
function legendRow(series, kind, x0, width, y) {
  if (series.length < 2) return { svg: '', h: 0 };
  const fs = 11, sw = 20, gap = 18, pad = 7;
  const items = series.map((s, i) => ({ name: s.name ?? `系列${i + 1}`, w: sw + 5 + textW(s.name ?? `系列${i + 1}`, fs) }));
  const total = items.reduce((a, b) => a + b.w, 0) + gap * (items.length - 1);
  let x = x0 + Math.max(0, (width - total) / 2);
  let svg = '';
  items.forEach((it, i) => {
    if (kind === 'bar') {
      svg += `<rect x="${R2(x)}" y="${y - 5}" width="${sw - 6}" height="10" fill="${BAR_FILL[i % BAR_FILL.length]}" stroke="#000" stroke-width="0.7"/>`;
    } else {
      const st = LINE_STY[i % LINE_STY.length];
      svg += `<line x1="${R2(x)}" y1="${y}" x2="${R2(x + sw)}" y2="${y}" stroke="${st.stroke}" stroke-width="1.6"${st.dash ? ` stroke-dasharray="${st.dash}"` : ''}/>`;
      if (kind !== 'noline') svg += marker(R2(x + sw / 2), y, st.marker, st.stroke, st.mfill, 3);
    }
    svg += `<text x="${R2(x + sw - (kind === 'bar' ? 6 : 0) + 5)}" y="${y + 3.8}" font-size="${fs}" fill="#111">${esc(it.name)}</text>`;
    x += it.w + gap;
  });
  return { svg, h: 20 + pad };
}

// 坐标框架:横向网格线 + 左/下轴 + y 刻度
function frame(L, T, plotW, plotH, yScale, opts = {}) {
  const { ticks, lo, hi } = yScale;
  const y = v => T + plotH - ((v - lo) / (hi - lo)) * plotH;
  let g = '';
  for (const t of ticks) {
    const yy = R2(y(t));
    if (t !== lo) g += `<line x1="${L}" y1="${yy}" x2="${L + plotW}" y2="${yy}" stroke="#d9d9d9" stroke-width="0.8" stroke-dasharray="3 3"/>`;
    g += `<line x1="${L - 4}" y1="${yy}" x2="${L}" y2="${yy}" stroke="#111" stroke-width="1"/>`;
    g += `<text x="${L - 7}" y="${yy + 3.6}" font-size="10.5" fill="#111" text-anchor="end">${fmtN(t)}</text>`;
  }
  g += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + plotH}" stroke="#111" stroke-width="1.2"/>`;
  g += `<line x1="${L}" y1="${T + plotH}" x2="${L + plotW}" y2="${T + plotH}" stroke="#111" stroke-width="1.2"/>`;
  if (opts.zero && lo < 0 && hi > 0) g += `<line x1="${L}" y1="${R2(y(0))}" x2="${L + plotW}" y2="${R2(y(0))}" stroke="#111" stroke-width="0.9"/>`;
  return { svg: g, y };
}

function svgWrap(W, H, inner, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${Math.min(W, 568)}" role="img" aria-label="${esc(label || '图')}" font-family="${FONT}">${inner}</svg>`;
}

// ---------- 数据图表 ----------
export function renderChart(spec) {
  if (!spec || typeof spec !== 'object') throw new Error('chart: 规格必须是 JSON 对象');
  const type = spec.type;
  const kinds = ['bar', 'hbar', 'line', 'scatter', 'pie'];
  if (!kinds.includes(type)) throw new Error(`chart: type 必须是 ${kinds.join('/')},收到 ${JSON.stringify(type)}`);
  const warnings = [];
  if (!spec.caption) warnings.push('chart 缺 caption(图题)');
  const W = num(spec.size?.[0] ?? 568, 'size[0]'), H = num(spec.size?.[1] ?? (type === 'pie' ? 300 : 330), 'size[1]');
  let inner = '';

  if (type === 'pie') {
    inner = pieChart(spec, W, H);
  } else if (type === 'hbar') {
    inner = hbarChart(spec, W, H);
  } else {
    inner = xyChart(spec, W, H, type);
  }
  return { svg: svgWrap(W, H, inner, spec.caption), caption: spec.caption || '', source: spec.source || '', warnings };
}

// bar / line / scatter 共用直角坐标
function xyChart(spec, W, H, type) {
  const series = spec.series;
  if (!Array.isArray(series) || !series.length) throw new Error(`chart(${type}): 缺 series 数组`);
  const stacked = !!spec.stack && type === 'bar';
  const catX = Array.isArray(spec.x);                 // 类目轴(bar 必须;line 可选)
  if (type === 'bar' && !catX) throw new Error('chart(bar): 需要 x 类目数组');

  // 收集数据域
  let ymin = Infinity, ymax = -Infinity, xmin = Infinity, xmax = -Infinity;
  const data = series.map((s, si) => {
    if (!Array.isArray(s.data)) throw new Error(`chart(${type}): series[${si}].data 必须是数组`);
    return s.data.map((d, di) => {
      if (d === null) return null;
      if (catX) {
        const v = num(d, `series[${si}].data[${di}]`);
        return { i: di, v };
      }
      if (!Array.isArray(d) || d.length < 2) throw new Error(`chart(${type}): 数值轴模式下 data 元素须为 [x,y],series[${si}].data[${di}]`);
      return { x: num(d[0], 'x'), v: num(d[1], 'y') };
    });
  });
  if (catX && stacked) {
    for (let i = 0; i < spec.x.length; i++) {
      let pos = 0, neg = 0;
      for (const sd of data) { const v = sd[i]?.v ?? 0; if (v >= 0) pos += v; else neg += v; }
      ymax = Math.max(ymax, pos); ymin = Math.min(ymin, neg, 0);
    }
    ymax = Math.max(ymax, 0);
  } else {
    for (const sd of data) for (const p of sd) {
      if (!p) continue;
      ymin = Math.min(ymin, p.v); ymax = Math.max(ymax, p.v);
      if (!catX) { xmin = Math.min(xmin, p.x); xmax = Math.max(xmax, p.x); }
    }
    if (type === 'bar') { ymin = Math.min(ymin, 0); ymax = Math.max(ymax, 0); }
  }
  if (spec.ymin != null) ymin = num(spec.ymin, 'ymin');
  if (spec.ymax != null) ymax = num(spec.ymax, 'ymax');
  const ys = niceScale(ymin, ymax, 5);
  if (spec.ymin != null) ys.lo = num(spec.ymin, 'ymin');
  if (spec.ymax != null) ys.hi = num(spec.ymax, 'ymax');
  const xs = catX ? null : niceScale(xmin, xmax, 6);

  // 布局
  const unit = spec.unit ? `(${spec.unit})` : '';
  const yTickW = Math.max(...ys.ticks.map(t => textW(fmtN(t), 10.5)));
  const L = R2(10 + (spec.ylabel ? 16 : 0) + yTickW + 8);
  const Rm = 14;
  const lg = legendRow(series, type === 'bar' ? 'bar' : type === 'scatter' ? 'noline' : 'line', 0, W, 12);
  const T = 10 + lg.h;
  const B = 26 + (spec.xlabel ? 18 : 0);
  const plotW = W - L - Rm, plotH = H - T - B;
  const fr = frame(L, T, plotW, plotH, ys, { zero: true });
  let g = lg.svg + fr.svg;

  // x 轴刻度/标签
  const xPos = i => L + plotW * (i + 0.5) / spec.x.length;
  const xNum = v => L + ((v - xs.lo) / (xs.hi - xs.lo)) * plotW;
  if (catX) {
    const maxLbl = Math.max(...spec.x.map(c => textW(String(c), 10.5)));
    const rot = maxLbl > plotW / spec.x.length - 8;
    spec.x.forEach((c, i) => {
      const xx = R2(xPos(i));
      g += `<line x1="${xx}" y1="${T + plotH}" x2="${xx}" y2="${T + plotH + 4}" stroke="#111" stroke-width="1"/>`;
      g += rot
        ? `<text x="${xx}" y="${T + plotH + 8}" font-size="10.5" fill="#111" text-anchor="end" transform="rotate(-32 ${xx} ${T + plotH + 8})">${esc(c)}</text>`
        : `<text x="${xx}" y="${T + plotH + 16}" font-size="10.5" fill="#111" text-anchor="middle">${esc(c)}</text>`;
    });
  } else {
    for (const t of xs.ticks) {
      const xx = R2(xNum(t));
      if (xx < L - 0.5 || xx > L + plotW + 0.5) continue;
      g += `<line x1="${xx}" y1="${T + plotH}" x2="${xx}" y2="${T + plotH + 4}" stroke="#111" stroke-width="1"/>`;
      g += `<text x="${xx}" y="${T + plotH + 16}" font-size="10.5" fill="#111" text-anchor="middle">${fmtN(t)}</text>`;
    }
  }
  // 轴题
  if (spec.xlabel) g += `<text x="${L + plotW / 2}" y="${H - 6}" font-size="11" fill="#111" text-anchor="middle">${esc(spec.xlabel)}${catX ? esc(unit && !spec.ylabel ? unit : '') : ''}</text>`;
  if (spec.ylabel) g += `<text transform="rotate(-90 12 ${T + plotH / 2})" x="12" y="${T + plotH / 2 + 4}" font-size="11" fill="#111" text-anchor="middle">${esc(spec.ylabel)}${esc(unit)}</text>`;

  // 数据
  if (type === 'bar') {
    const n = spec.x.length, k = series.length;
    const groupW = plotW / n * 0.66;
    const barW = stacked ? groupW : groupW / k;
    const acc = spec.x.map(() => ({ pos: 0, neg: 0 }));
    data.forEach((sd, si) => {
      const fill = BAR_FILL[si % BAR_FILL.length];
      sd.forEach(p => {
        if (!p) return;
        const cx = xPos(p.i);
        let x0, y0, y1;
        if (stacked) {
          x0 = cx - barW / 2;
          const a = acc[p.i];
          if (p.v >= 0) { y0 = fr.y(a.pos + p.v); y1 = fr.y(a.pos); a.pos += p.v; }
          else { y0 = fr.y(a.neg); y1 = fr.y(a.neg + p.v); a.neg += p.v; }
        } else {
          x0 = cx - groupW / 2 + si * barW;
          y0 = Math.min(fr.y(0), fr.y(p.v)); y1 = Math.max(fr.y(0), fr.y(p.v));
        }
        g += `<rect x="${R2(x0)}" y="${R2(y0)}" width="${R2(Math.max(1, barW - (stacked ? 0 : 1.5)))}" height="${R2(Math.max(0.5, y1 - y0))}" fill="${fill}" stroke="#000" stroke-width="0.7"/>`;
        if (spec.values && !stacked) g += `<text x="${R2(x0 + barW / 2 - 0.75)}" y="${R2((p.v >= 0 ? y0 : y1 + 9) - 3)}" font-size="9.5" fill="#111" text-anchor="middle">${fmtN(p.v)}</text>`;
      });
    });
  } else {
    data.forEach((sd, si) => {
      const st = LINE_STY[si % LINE_STY.length];
      if (type === 'line') {
        let dPath = '', pen = false;
        sd.forEach((p, i) => {
          if (!p) { pen = false; return; }
          const xx = R2(catX ? xPos(p.i ?? i) : xNum(p.x)), yy = R2(fr.y(p.v));
          dPath += (pen ? 'L' : 'M') + xx + ',' + yy; pen = true;
        });
        g += `<path d="${dPath}" fill="none" stroke="${st.stroke}" stroke-width="1.7"${st.dash ? ` stroke-dasharray="${st.dash}"` : ''}/>`;
      }
      sd.forEach((p, i) => {
        if (!p) return;
        const xx = R2(catX ? xPos(p.i ?? i) : xNum(p.x)), yy = R2(fr.y(p.v));
        g += marker(xx, yy, st.marker, st.stroke, st.mfill, type === 'scatter' ? 3.8 : 3.2);
      });
    });
  }
  return g;
}

// 横向条形图(类目名长时用)
function hbarChart(spec, W, H) {
  if (!Array.isArray(spec.x)) throw new Error('chart(hbar): 需要 x 类目数组');
  const series = spec.series;
  if (!Array.isArray(series) || !series.length) throw new Error('chart(hbar): 缺 series');
  let vmin = 0, vmax = -Infinity;
  const data = series.map((s, si) => s.data.map((d, i) => d === null ? null : num(d, `series[${si}].data[${i}]`)));
  for (const sd of data) for (const v of sd) { if (v == null) continue; vmin = Math.min(vmin, v); vmax = Math.max(vmax, v); }
  if (spec.xmax != null) vmax = num(spec.xmax, 'xmax');
  const vs = niceScale(vmin, vmax, 5);
  const catW = Math.max(...spec.x.map(c => textW(String(c), 10.5)));
  const L = R2(10 + catW + 8), Rm = 16 + (spec.values ? 26 : 0);
  const lg = legendRow(series, 'bar', 0, W, 12);
  const T = 8 + lg.h, B = 26 + (spec.xlabel ? 18 : 0);
  const plotW = W - L - Rm, plotH = H - T - B;
  const vx = v => L + ((v - vs.lo) / (vs.hi - vs.lo)) * plotW;
  let g = lg.svg;
  for (const t of vs.ticks) {
    const xx = R2(vx(t));
    if (t !== vs.lo) g += `<line x1="${xx}" y1="${T}" x2="${xx}" y2="${T + plotH}" stroke="#d9d9d9" stroke-width="0.8" stroke-dasharray="3 3"/>`;
    g += `<line x1="${xx}" y1="${T + plotH}" x2="${xx}" y2="${T + plotH + 4}" stroke="#111" stroke-width="1"/>`;
    g += `<text x="${xx}" y="${T + plotH + 16}" font-size="10.5" fill="#111" text-anchor="middle">${fmtN(t)}</text>`;
  }
  g += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + plotH}" stroke="#111" stroke-width="1.2"/>`;
  g += `<line x1="${L}" y1="${T + plotH}" x2="${L + plotW}" y2="${T + plotH}" stroke="#111" stroke-width="1.2"/>`;
  const n = spec.x.length, k = series.length;
  const rowH = plotH / n, groupH = rowH * 0.62, barH = groupH / k;
  spec.x.forEach((c, i) => {
    const cy = T + rowH * (i + 0.5);
    g += `<text x="${L - 7}" y="${R2(cy + 3.6)}" font-size="10.5" fill="#111" text-anchor="end">${esc(c)}</text>`;
  });
  data.forEach((sd, si) => {
    const fill = BAR_FILL[si % BAR_FILL.length];
    sd.forEach((v, i) => {
      if (v == null) return;
      const cy = T + rowH * (i + 0.5);
      const y0 = cy - groupH / 2 + si * barH;
      const x0 = Math.min(vx(0), vx(v)), x1 = Math.max(vx(0), vx(v));
      g += `<rect x="${R2(x0)}" y="${R2(y0)}" width="${R2(Math.max(0.5, x1 - x0))}" height="${R2(Math.max(1, barH - 1.5))}" fill="${fill}" stroke="#000" stroke-width="0.7"/>`;
      if (spec.values) g += `<text x="${R2(x1 + 4)}" y="${R2(y0 + barH / 2 + 3)}" font-size="9.5" fill="#111">${fmtN(v)}</text>`;
    });
  });
  if (spec.xlabel) g += `<text x="${L + plotW / 2}" y="${H - 6}" font-size="11" fill="#111" text-anchor="middle">${esc(spec.xlabel)}${esc(spec.unit ? `(${spec.unit})` : '')}</text>`;
  return g;
}

// 饼图(占比):灰阶扇区 + 外部标签
function pieChart(spec, W, H) {
  const data = spec.data;
  if (!Array.isArray(data) || !data.length) throw new Error('chart(pie): 缺 data 数组 [{label,value}]');
  const total = data.reduce((a, d) => a + num(d.value, `data.${d.label}`), 0);
  if (total <= 0) throw new Error('chart(pie): 数值之和须 > 0');
  const cx = W / 2, cy = H / 2 + 4, R = Math.min(W, H) / 2 - 58;
  let a0 = -Math.PI / 2, g = '';
  data.forEach((d, i) => {
    const frac = d.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    g += `<path d="M${cx},${cy} L${R2(x0)},${R2(y0)} A${R},${R} 0 ${large} 1 ${R2(x1)},${R2(y1)} Z" fill="${PIE_FILL[i % PIE_FILL.length]}" stroke="#000" stroke-width="0.8"/>`;
    const am = (a0 + a1) / 2;
    const lx = cx + (R + 12) * Math.cos(am), ly = cy + (R + 12) * Math.sin(am);
    const anchor = Math.cos(am) >= 0 ? 'start' : 'end';
    g += `<line x1="${R2(cx + R * Math.cos(am))}" y1="${R2(cy + R * Math.sin(am))}" x2="${R2(lx)}" y2="${R2(ly)}" stroke="#666" stroke-width="0.8"/>`;
    g += `<text x="${R2(lx + (anchor === 'start' ? 3 : -3))}" y="${R2(ly + 3.5)}" font-size="10.5" fill="#111" text-anchor="${anchor}">${esc(d.label)} ${(frac * 100).toFixed(1)}%</text>`;
    a0 = a1;
  });
  return g;
}

// ---------- 结构图(flow) ----------
export function renderFlow(spec) {
  if (!spec || typeof spec !== 'object') throw new Error('flow: 规格必须是 JSON 对象');
  if (!Array.isArray(spec.ranks) || !spec.ranks.length) throw new Error('flow: 缺 ranks(二维数组,每行一层节点)');
  const warnings = [];
  if (!spec.caption) warnings.push('flow 缺 caption(图题)');
  const LR = spec.direction === 'LR';
  const fs = 12.5, lh = 17;

  // 节点归一化 + 尺寸
  const nodes = new Map();
  spec.ranks.forEach((rank, ri) => {
    if (!Array.isArray(rank)) throw new Error(`flow: ranks[${ri}] 必须是数组`);
    rank.forEach(nd => {
      const n = typeof nd === 'string' ? { id: nd, label: nd } : { ...nd };
      if (!n.id) throw new Error(`flow: ranks[${ri}] 存在缺 id 的节点`);
      if (nodes.has(n.id)) throw new Error(`flow: 节点 id 重复 ${n.id}`);
      n.label = n.label ?? n.id;
      n.lines = String(n.label).split('\n');
      n.w = Math.max(64, Math.max(...n.lines.map(l => textW(l, fs))) + 26);
      n.h = n.lines.length * lh + 17;
      if (n.shape === 'diamond') { n.w += 26; n.h += 16; }
      n.rank = ri;
      nodes.set(n.id, n);
    });
  });
  const edges = (spec.edges || []).map((e, i) => {
    const o = Array.isArray(e) ? { from: e[0], to: e[1], ...(typeof e[2] === 'string' ? { label: e[2] } : e[2] || {}) } : { ...e };
    if (!nodes.has(o.from)) throw new Error(`flow: edges[${i}] 未知节点 ${o.from}`);
    if (!nodes.has(o.to)) throw new Error(`flow: edges[${i}] 未知节点 ${o.to}`);
    return o;
  });

  // 布局(主轴 = TB 的 y / LR 的 x)
  const GAP_IN = 30, GAP_RANK = 52;
  const rankSizes = spec.ranks.map((rank, ri) => {
    const list = rank.map(nd => nodes.get(typeof nd === 'string' ? nd : nd.id));
    const cross = list.reduce((a, n) => a + (LR ? n.h : n.w), 0) + GAP_IN * (list.length - 1);
    const main = Math.max(...list.map(n => (LR ? n.w : n.h)));
    return { list, cross, main };
  });
  const maxCross = Math.max(...rankSizes.map(r => r.cross));
  const hasBack = edges.some(e => nodes.get(e.to).rank <= nodes.get(e.from).rank && nodes.get(e.to).rank !== nodes.get(e.from).rank);
  const loopPad = hasBack ? 40 : 0;
  let mainPos = 6;
  rankSizes.forEach(rs => {
    let c = loopPad + (maxCross - rs.cross) / 2 + 6;
    rs.list.forEach(n => {
      if (LR) { n.x = mainPos; n.y = c; c += n.h + GAP_IN; }
      else { n.y = mainPos; n.x = c; c += n.w + GAP_IN; }
      // 主轴方向上居中对齐本层
      if (LR) n.x += (rs.main - n.w) / 2; else n.y += (rs.main - n.h) / 2;
    });
    mainPos += rs.main + GAP_RANK;
  });
  const W = R2(LR ? mainPos - GAP_RANK + 12 : maxCross + loopPad + 12);
  const H = R2(LR ? maxCross + loopPad + 12 : mainPos - GAP_RANK + 12);

  const mid = 'ah' + (++UID);
  let g = `<defs><marker id="${mid}" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><path d="M0,0 L8,3.5 L0,7 Z" fill="#2a2a2a"/></marker></defs>`;

  // 边
  for (const e of edges) {
    const A = nodes.get(e.from), B = nodes.get(e.to);
    let d, lx, ly;
    if (B.rank > A.rank) {
      const x1 = LR ? A.x + A.w : A.x + A.w / 2, y1 = LR ? A.y + A.h / 2 : A.y + A.h;
      const x2 = LR ? B.x : B.x + B.w / 2, y2 = LR ? B.y + B.h / 2 : B.y;
      d = LR
        ? `M${R2(x1)},${R2(y1)} C${R2((x1 + x2) / 2)},${R2(y1)} ${R2((x1 + x2) / 2)},${R2(y2)} ${R2(x2)},${R2(y2)}`
        : `M${R2(x1)},${R2(y1)} C${R2(x1)},${R2((y1 + y2) / 2)} ${R2(x2)},${R2((y1 + y2) / 2)} ${R2(x2)},${R2(y2)}`;
      lx = (x1 + x2) / 2; ly = (y1 + y2) / 2;
    } else if (B.rank === A.rank) {
      const leftFirst = (LR ? A.y : A.x) < (LR ? B.y : B.x);
      const x1 = LR ? A.x + A.w / 2 : (leftFirst ? A.x + A.w : A.x), y1 = LR ? (leftFirst ? A.y + A.h : A.y) : A.y + A.h / 2;
      const x2 = LR ? B.x + B.w / 2 : (leftFirst ? B.x : B.x + B.w), y2 = LR ? (leftFirst ? B.y : B.y + B.h) : B.y + B.h / 2;
      d = `M${R2(x1)},${R2(y1)} L${R2(x2)},${R2(y2)}`;
      lx = (x1 + x2) / 2; ly = (y1 + y2) / 2 - 4;
    } else {
      // 回边:绕左(TB)/绕上(LR)
      const x1 = LR ? A.x + A.w / 2 : A.x, y1 = LR ? A.y : A.y + A.h / 2;
      const x2 = LR ? B.x + B.w / 2 : B.x, y2 = LR ? B.y : B.y + B.h / 2;
      const off = LR ? 14 : 14;
      d = LR
        ? `M${R2(x1)},${R2(y1)} C${R2(x1)},${R2(off)} ${R2(x2)},${R2(off)} ${R2(x2)},${R2(y2)}`
        : `M${R2(x1)},${R2(y1)} C${R2(off)},${R2(y1)} ${R2(off)},${R2(y2)} ${R2(x2)},${R2(y2)}`;
      lx = LR ? (x1 + x2) / 2 : off + 10; ly = LR ? off + 10 : (y1 + y2) / 2;
    }
    g += `<path d="${d}" fill="none" stroke="#2a2a2a" stroke-width="1.2"${e.dash ? ' stroke-dasharray="5 4"' : ''} marker-end="url(#${mid})"/>`;
    if (e.label) {
      const tw = textW(e.label, 10.5);
      g += `<rect x="${R2(lx - tw / 2 - 4)}" y="${R2(ly - 8)}" width="${R2(tw + 8)}" height="15" fill="#fff"/>`;
      g += `<text x="${R2(lx)}" y="${R2(ly + 3.5)}" font-size="10.5" fill="#333" text-anchor="middle">${esc(e.label)}</text>`;
    }
  }
  // 节点
  for (const n of nodes.values()) {
    const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
    const fill = n.em ? '#efefef' : '#fff';
    if (n.shape === 'diamond') {
      g += `<path d="M${R2(cx)},${R2(n.y)} L${R2(n.x + n.w)},${R2(cy)} L${R2(cx)},${R2(n.y + n.h)} L${R2(n.x)},${R2(cy)} Z" fill="${fill}" stroke="#2a2a2a" stroke-width="1.2"/>`;
    } else {
      const rx = n.shape === 'stadium' ? n.h / 2 : n.shape === 'round' ? 8 : 0;
      g += `<rect x="${R2(n.x)}" y="${R2(n.y)}" width="${R2(n.w)}" height="${R2(n.h)}" rx="${rx}" fill="${fill}" stroke="#2a2a2a" stroke-width="${n.em ? 1.8 : 1.2}"/>`;
    }
    n.lines.forEach((ln, li) => {
      g += `<text x="${R2(cx)}" y="${R2(cy - ((n.lines.length - 1) / 2 - li) * lh + 4.3)}" font-size="${fs}" fill="#111" text-anchor="middle" font-family="${FONT}">${esc(ln)}</text>`;
    });
  }
  return { svg: svgWrap(W, H, g, spec.caption), caption: spec.caption || '', source: spec.source || '', warnings };
}

// ---------- 脑图(mindmap) ----------
// 输入:缩进文本树(可选首行 "caption: 图题")。单一根节点,左→右布局。
export function renderMindmap(text) {
  const warnings = [];
  let caption = '';
  const rawLines = String(text).split('\n').filter(l => l.trim() !== '');
  if (rawLines.length && /^\s*(caption|图题)\s*[::]/.test(rawLines[0])) {
    caption = rawLines.shift().replace(/^\s*(caption|图题)\s*[::]\s*/, '').trim();
  }
  if (!caption) warnings.push('mindmap 缺 caption(首行 "caption: 图题")');
  if (!rawLines.length) throw new Error('mindmap: 内容为空');

  // 缩进 → 深度(制表符=1 级;空格按首个缩进步长归一)
  let unit = 0;
  const items = rawLines.map((l, i) => {
    const m = l.match(/^[\t ]*/)[0];
    const spaces = m.replace(/\t/g, '  ').length;
    if (spaces > 0 && unit === 0) unit = spaces;
    const depth = unit ? Math.round(spaces / unit) : 0;
    return { depth, label: l.trim(), children: [], line: i + 1 };
  });
  if (items[0].depth !== 0) throw new Error('mindmap: 首个节点必须无缩进(根节点)');
  const root = items[0];
  const stack = [root];
  for (let i = 1; i < items.length; i++) {
    const it = items[i];
    if (it.depth === 0) throw new Error(`mindmap: 只允许一个根节点(第 ${it.line} 行出现第二个无缩进节点)`);
    if (it.depth > stack.length) throw new Error(`mindmap: 第 ${it.line} 行缩进跳级`);
    stack.length = it.depth;
    stack[stack.length - 1].children.push(it);
    stack.push(it);
  }

  // 尺寸与布局
  const FS = [14.5, 13, 12, 11.5, 11.5, 11.5];
  const size = n => {
    n.fs = FS[Math.min(n.depth, FS.length - 1)];
    n.w = textW(n.label, n.fs) + (n.depth === 0 ? 26 : n.depth === 1 ? 22 : 16);
    n.h = n.fs + (n.depth <= 1 ? 15 : 11);
    n.children.forEach(size);
  };
  size(root);
  const SLOT = 34, GAPX = 44;
  const colW = [];
  (function cw(n) { colW[n.depth] = Math.max(colW[n.depth] || 0, n.w); n.children.forEach(cw); })(root);
  const colX = [4];
  for (let d = 1; d < colW.length; d++) colX[d] = colX[d - 1] + colW[d - 1] + GAPX;
  let leafI = 0;
  (function place(n) {
    n.x = colX[n.depth];
    if (!n.children.length) { n.cy = leafI * SLOT + SLOT / 2 + 4; leafI++; }
    else { n.children.forEach(place); n.cy = (n.children[0].cy + n.children[n.children.length - 1].cy) / 2; }
  })(root);
  const W = R2(colX[colW.length - 1] + colW[colW.length - 1] + 6);
  const H = R2(leafI * SLOT + 10);

  let g = '';
  (function draw(n) {
    for (const c of n.children) {
      const x1 = n.x + n.w, y1 = n.cy, x2 = c.x, y2 = c.cy;
      g += `<path d="M${R2(x1)},${R2(y1)} C${R2(x1 + GAPX * 0.55)},${R2(y1)} ${R2(x2 - GAPX * 0.55)},${R2(y2)} ${R2(x2)},${R2(y2)}" fill="none" stroke="#9a9a9a" stroke-width="1.1"/>`;
      draw(c);
    }
    const y0 = n.cy - n.h / 2;
    if (n.depth === 0) {
      g += `<rect x="${R2(n.x)}" y="${R2(y0)}" width="${R2(n.w)}" height="${R2(n.h)}" rx="7" fill="#1a1a1a"/>`;
      g += `<text x="${R2(n.x + n.w / 2)}" y="${R2(n.cy + n.fs * 0.36)}" font-size="${n.fs}" font-weight="bold" fill="#fff" text-anchor="middle">${esc(n.label)}</text>`;
    } else if (n.depth === 1) {
      g += `<rect x="${R2(n.x)}" y="${R2(y0)}" width="${R2(n.w)}" height="${R2(n.h)}" rx="6" fill="#fff" stroke="#1a1a1a" stroke-width="1.2"/>`;
      g += `<text x="${R2(n.x + n.w / 2)}" y="${R2(n.cy + n.fs * 0.36)}" font-size="${n.fs}" font-weight="600" fill="#111" text-anchor="middle">${esc(n.label)}</text>`;
    } else if (n.depth === 2) {
      g += `<rect x="${R2(n.x)}" y="${R2(y0)}" width="${R2(n.w)}" height="${R2(n.h)}" rx="5" fill="#f2f2f2" stroke="#aaa" stroke-width="0.9"/>`;
      g += `<text x="${R2(n.x + n.w / 2)}" y="${R2(n.cy + n.fs * 0.36)}" font-size="${n.fs}" fill="#111" text-anchor="middle">${esc(n.label)}</text>`;
    } else {
      g += `<text x="${R2(n.x + 8)}" y="${R2(n.cy + n.fs * 0.36)}" font-size="${n.fs}" fill="#222">${esc(n.label)}</text>`;
      g += `<line x1="${R2(n.x)}" y1="${R2(n.cy + n.h / 2)}" x2="${R2(n.x + n.w)}" y2="${R2(n.cy + n.h / 2)}" stroke="#bbb" stroke-width="0.9"/>`;
    }
  })(root);
  return { svg: svgWrap(W, H, `<g font-family="${FONT}">${g}</g>`, caption), caption, source: '', warnings };
}
