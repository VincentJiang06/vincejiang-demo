/* ============================================================
   REACTOR · tree-layout.mjs — 知识树排版算法 v4
   规格见 course/TREE-LAYOUT-ALGORITHM.md。
   Sugiyama 分层框架的定制实现：
     S1 分层(最长路径+松弛下沉)  S2 虚拟节点  S3 barycenter 排序+transpose
     S4 中位数对齐坐标分配       S5(走线车道在 tree.js 运行时做)
   纯函数、确定性、零依赖。违反硬不变量直接 throw（宁可 build 失败不可上线烂图）。
   ============================================================ */

const THEORY = new Set(["root", "red", "blue", "yellow"]);
const CLUSTER_ORDER = ["red", "blue", "yellow"];   // 理论区三纵簇左→右

export function layoutTree(nodes, C = {}) {
  const CHIP_W = C.chipW ?? 190;
  const GAP_X = C.gapX ?? 40;                       // 芯片水平最小缝(-23%,用户裁决)
  const ROW_H = C.rowH ?? 196;                      // 行距(统一芯片高 134+走廊 62,纵向-50%)
  const GUTTER = C.gutter ?? 104;                   // 簇间隔
  const BAND_GAP = C.bandGap ?? 0.45;               // 区与区之间的额外行距倍数(南区贴近主树)
  const CAP_W = C.capW ?? 300;                      // 汇流舱横条卡宽
  const MIN_SEP = CHIP_W + GAP_X;

  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const dependents = {};                            // id -> 依赖它的节点
  for (const n of nodes) for (const p of n.prereqs) (dependents[p] ||= []).push(n.id);

  const region = n =>
    THEORY.has(n.branch) ? "theory" :
    n.branch === "case" ? "case" :
    n.branch === "green" ? "green" : "cap";

  /* ================= S1 分层 ================= */
  // 理论区：最长路径
  const layer = {};
  const downL = id => {
    if (layer[id] !== undefined) return layer[id];
    const n = byId[id];
    const ps = n.prereqs.filter(p => region(byId[p]) === "theory");
    return layer[id] = ps.length ? 1 + Math.max(...ps.map(downL)) : 0;
  };
  const theoryNodes = nodes.filter(n => region(n) === "theory");
  theoryNodes.forEach(n => downL(n.id));
  // 容量平衡·最小移动原则：所有节点先钉在最长路径下界(最紧凑);
  // 只有当某簇某层超过 CAP 张卡时,才把该层里弹性最大的节点迁到
  // 自身合法区间 [down, up] 内最近的未满层(优先向下=贴近消费者)。
  // 入门桥无需特殊处理:最长路径分层天然把它们放在首个消费者上一层。
  const CAP = 4;
  const downBound = { ...layer };
  const upBound = id => {
    const deps = (dependents[id] || []).map(d => byId[d]).filter(d => region(d) === "theory");
    return deps.length ? Math.min(...deps.map(d => layer[d.id])) - 1 : Infinity;
  };
  for (let pass = 0; pass < 12; pass++) {
    const o = {};
    for (const n of theoryNodes) if (n.branch !== "root")
      (o[n.branch + ":" + layer[n.id]] ??= []).push(n);
    let moved = false;
    for (const [key, arr] of Object.entries(o)) {
      if (arr.length <= CAP) continue;
      const cur = +key.split(":")[1], branch = key.split(":")[0];
      const flex = arr
        .map(n => ({ n, lo: downBound[n.id], hi: upBound(n.id) }))
        .filter(f => f.hi > f.lo)
        .sort((a, b) => (b.hi - b.lo) - (a.hi - a.lo)
          || (dependents[a.n.id] || []).length - (dependents[b.n.id] || []).length
          || b.n.id.localeCompare(a.n.id));   // 高编号(桥/旁支)先下沉,主线留浅层
      let excess = arr.length - CAP;
      for (const f of flex) {
        if (!excess) break;
        // 最近未满层:先向下再向上
        let target = null;
        for (let d = 1; d <= 8 && !target; d++) {
          for (const l of [cur + d, cur - d])
            if (l >= f.lo && l <= f.hi && l !== cur
                && (o[branch + ":" + l]?.length || 0) < CAP) { target = l; break; }
        }
        if (target !== null) {
          layer[f.n.id] = target;
          (o[branch + ":" + target] ??= []).push(f.n);
          moved = true; excess--;
        }
      }
    }
    if (!moved) break;
  }
  // 终检:任何簇层不得超 CAP
  {
    const o = {};
    for (const n of theoryNodes) if (n.branch !== "root")
      o[n.branch + ":" + layer[n.id]] = (o[n.branch + ":" + layer[n.id]] || 0) + 1;
    for (const [k, v] of Object.entries(o))
      if (v > CAP) throw new Error(`层容量违规 ${k}: ${v} > ${CAP}`);
  }
  const T = Math.max(...theoryNodes.map(n => layer[n.id]));

  // 带区分层(簇内最长路径;单节点层向上合并=容忍带内横边)
  function bandRows(band) {
    const ns = nodes.filter(n => n.branch === band);
    const lr = {};
    const dl = id => {
      if (lr[id] !== undefined) return lr[id];
      const ps = byId[id].prereqs.filter(p => byId[p].branch === band);
      return lr[id] = ps.length ? 1 + Math.max(...ps.map(dl)) : 0;
    };
    ns.forEach(n => dl(n.id));
    let rows = [];
    ns.forEach(n => (rows[lr[n.id]] ||= []).push(n));
    rows = rows.filter(Boolean);
    for (let i = rows.length - 1; i > 0; i--)      // 单节点层并入上一行
      if (rows[i].length === 1 && rows[i - 1].length < 6) { rows[i - 1].push(...rows[i]); rows.splice(i, 1); }
    return rows;
  }
  const caseRows = bandRows("case");
  const greenRows = bandRows("green");
  const capRow = [nodes.filter(n => region(n) === "cap")
    .sort((a, b) => (a.slot ?? 99) - (b.slot ?? 99) || a.id.localeCompare(b.id))];

  /* 全局行号与 y；区间隙 + 分层线 */
  const rowY = {};                                  // key: region:rowIndex → y
  const levels = [];
  let y = 0;
  for (let i = 0; i <= T; i++) { rowY["theory:" + i] = y; y += ROW_H; }
  // 理论区内的难度分割线(入门 1-2 | 进阶 3-4 | 深水区 5+),画在走廊正中
  const cut = (afterRow, label) => {
    if (afterRow < T) levels.push({ y: rowY["theory:" + afterRow] + ROW_H / 2 + 56, label });
  };
  levels.push({ y: rowY["theory:1"] - ROW_H / 2 + 20, label: "LEVEL 01 · 入门" });
  cut(2, "LEVEL 02 · 进阶"); cut(4, "LEVEL 03 · 深水区");
  // y 此刻 = 下一行应放置的位置。带间隙 = 额外 0.28 行(行内 1 行距的基础上),
  // 保证不同带相邻两行间距 = 1.28×ROW_H,恒大于芯片高,物理上不可能叠卡。
  const openBand = (rows, key, label) => {
    y += ROW_H * 0.28;
    levels.push({ y: y - ROW_H * 0.42, label });
    rows.forEach((r, i) => { rowY[key + ":" + i] = y; y += ROW_H; });
  };
  openBand(caseRows, "case", "LEVEL 04 · 案例带");
  openBand(greenRows, "green", "LEVEL 05 · 防御与设计");
  openBand(capRow, "cap", "LEVEL 06 · 汇流");

  /* ================= S2+S3 簇内排序 ================= */
  // 每簇每层的节点列表(含跨层长边的虚拟节点)
  function clusterLayers(branch) {
    const ns = theoryNodes.filter(n => n.branch === branch);
    const L = {};
    ns.forEach(n => (L[layer[n.id]] ||= []).push({ id: n.id, real: true }));
    // 簇内长边插 dummy
    for (const n of ns) for (const p of n.prereqs) {
      const pn = byId[p];
      if (pn.branch !== branch) continue;
      for (let l = layer[p] + 1; l < layer[n.id]; l++)
        (L[l] ||= []).push({ id: `~${p}→${n.id}@${l}`, real: false, from: p, to: n.id });
    }
    return L;
  }
  // 层内排序:median 启发式(比 barycenter 稳,防聚堆)+ transpose 相邻交换至收敛,
  // 全程保留交叉数最优的快照(文献:Gansner 1993 / dagre)
  function orderCluster(L) {
    const layersIdx = Object.keys(L).map(Number).sort((a, b) => a - b);
    const idx = {};
    const renumber = l => L[l].forEach((v, i) => idx[v.id] = i);
    layersIdx.forEach(renumber);
    const chainNbr = (v, dir) => {
      const l = +v.id.split("@")[1] + dir;
      const cand = `~${v.from}→${v.to}@${l}`;
      return (L[l] || []).some(x => x.id === cand) ? cand : (dir < 0 ? v.from : v.to);
    };
    const nbrs = (v, dir) => v.real
      ? (dir < 0 ? byId[v.id].prereqs : (dependents[v.id] || []))
      : [chainNbr(v, dir)];
    const medianOf = (v, dir) => {
      const xs = nbrs(v, dir).map(m => idx[m]).filter(x => x !== undefined).sort((a, b) => a - b);
      if (!xs.length) return null;                 // 无邻居:保持原位
      const m = xs.length >> 1;
      return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2;
    };
    // 两层间交叉数 = 边端点序位的逆序对
    const crossBetween = (lo, hi) => {
      const es = [];
      for (const v of L[hi] || []) for (const m of nbrs(v, -1))
        if (idx[m] !== undefined && (L[lo] || []).some(x => x.id === m))
          es.push([idx[m], idx[v.id]]);
      es.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      let c = 0;
      for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++)
        if (es[j][1] < es[i][1]) c++;
      return c;
    };
    const totalCross = () => layersIdx.slice(1).reduce((s, l, i) => s + crossBetween(layersIdx[i], l), 0);
    let best = null, bestC = Infinity;
    const snap = () => Object.fromEntries(layersIdx.map(l => [l, L[l].map(v => v.id)]));
    for (let iter = 0; iter < 8; iter++) {
      const dir = iter % 2 === 0 ? -1 : 1;
      const seq = dir < 0 ? layersIdx : [...layersIdx].reverse();
      for (const l of seq) {
        const keyed = L[l].map(v => ({ v, k: medianOf(v, dir) }));
        keyed.sort((a, b) => (a.k ?? idx[a.v.id]) - (b.k ?? idx[b.v.id])
          || (byId[a.v.id]?.slot ?? 99) - (byId[b.v.id]?.slot ?? 99)
          || a.v.id.localeCompare(b.v.id));
        L[l] = keyed.map(x => x.v); renumber(l);
      }
      // transpose:相邻互换若严格减少局部交叉则采纳,扫到无交换为止
      let changed = true, guard = 0;
      while (changed && guard++ < 12) {
        changed = false;
        for (let li = 0; li < layersIdx.length; li++) {
          const l = layersIdx[li];
          for (let i = 0; i + 1 < L[l].length; i++) {
            const before = (li > 0 ? crossBetween(layersIdx[li - 1], l) : 0)
              + (li + 1 < layersIdx.length ? crossBetween(l, layersIdx[li + 1]) : 0);
            [L[l][i], L[l][i + 1]] = [L[l][i + 1], L[l][i]]; renumber(l);
            const after = (li > 0 ? crossBetween(layersIdx[li - 1], l) : 0)
              + (li + 1 < layersIdx.length ? crossBetween(l, layersIdx[li + 1]) : 0);
            if (after >= before) { [L[l][i], L[l][i + 1]] = [L[l][i + 1], L[l][i]]; renumber(l); }
            else changed = true;
          }
        }
      }
      const c = totalCross();
      if (c < bestC) { bestC = c; best = snap(); }
      if (c === 0) break;
    }
    // 回滚到最优快照
    for (const l of layersIdx) {
      const order = best[l];
      L[l].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      renumber(l);
    }
    return idx;
  }

  /* ================= S4 坐标分配：簇内 4 列格点吸附 =================
     连续坐标会漂出不均匀空隙;改为每簇固定 CAP 列的格点:
     节点列号 = 同簇父辈列号中位数,行内按排序结果占列(严格递增,总代价最小),
     单父链自动同列=笔直脊柱;簇宽恒定,整树紧凑且行行对齐。 */
  const X = {}, Y = {};
  const COLS = CAP;
  const clusterW = (COLS - 1) * MIN_SEP + CHIP_W;
  const clusterGeo = {};
  for (const branch of CLUSTER_ORDER) {
    const L = clusterLayers(branch);
    orderCluster(L);
    const layersIdx = Object.keys(L).map(Number).sort((a, b) => a - b);
    const col = {};
    const assignRow = (arr, desire) => {
      // 在 0..COLS-1 中给 arr(已排序)选严格递增列,最小化 Σ|col-期望|
      const k = arr.length;
      let best = null, bestCost = Infinity;
      const combo = (start, picked) => {
        if (picked.length === k) {
          const cost = picked.reduce((s, c, i) => s + Math.abs(c - desire[i]), 0);
          if (cost < bestCost) { bestCost = cost; best = [...picked]; }
          return;
        }
        for (let c = start; c <= COLS - (k - picked.length); c++) combo(c + 1, [...picked, c]);
      };
      combo(0, []);
      arr.forEach((v, i) => col[v.id] = best[i]);
    };
    const desireOf = (v, dir) => {
      const ms = (v.real ? (dir < 0 ? byId[v.id].prereqs : dependents[v.id] || [])
        : [dir < 0 ? v.from : v.to]).filter(m => col[m] !== undefined);
      if (!ms.length) return null;
      const xs = ms.map(m => col[m]).sort((a, b) => a - b);
      return xs[Math.floor((xs.length - 1) / 2)];
    };
    // 格点只给真实芯片;dummy 不占列,取自身邻链插值(引导吸附、可与任意列重叠)
    const reals = l => L[l].filter(v => v.real);
    const setDummies = l => L[l].filter(v => !v.real).forEach(v => {
      const a = col[v.from], b = col[v.to];
      col[v.id] = a !== undefined && b !== undefined ? (a + b) / 2
        : a !== undefined ? a : b !== undefined ? b : (COLS - 1) / 2;
    });
    // 首行均匀铺开,随后每行向父辈列吸附;再一轮自底向上回拉,终扫定稿
    layersIdx.forEach(l => {
      const arr = reals(l);
      const desire = arr.map((v, i) => {
        const d = desireOf(v, -1);
        return d === null ? (i * (COLS - 1)) / Math.max(1, arr.length - 1) : d;
      });
      assignRow(arr, desire); setDummies(l);
    });
    for (const l of [...layersIdx].reverse()) {
      const arr = reals(l);
      const desire = arr.map(v => {
        const d = desireOf(v, +1);
        return d === null ? col[v.id] : (d + col[v.id]) / 2;   // 兼顾已有位置,防震荡
      });
      assignRow(arr, desire); setDummies(l);
    }
    layersIdx.forEach(l => {
      const arr = reals(l);
      const desire = arr.map(v => { const d = desireOf(v, -1); return d === null ? col[v.id] : d; });
      assignRow(arr, desire); setDummies(l);
    });
    clusterGeo[branch] = { L, col };
  }
  // 拼接三簇(等宽)
  const clusterLeft = {};
  CLUSTER_ORDER.forEach((b, i) => clusterLeft[b] = i * (clusterW + GUTTER));
  const totalW = CLUSTER_ORDER.length * clusterW + (CLUSTER_ORDER.length - 1) * GUTTER;
  for (const branch of CLUSTER_ORDER) {
    const { L, col } = clusterGeo[branch];
    for (const arr of Object.values(L)) for (const v of arr) {
      if (!v.real) continue;
      X[v.id] = clusterLeft[branch] + CHIP_W / 2 + col[v.id] * MIN_SEP;
      Y[v.id] = rowY["theory:" + layer[v.id]];
    }
  }
  const rootN = theoryNodes.find(n => n.branch === "root");
  X[rootN.id] = totalW / 2; Y[rootN.id] = rowY["theory:0"];

  // 带区:期望位=前置绝对 x 均值,左右扫保最小间距,整行在全宽内居中约束
  const placeBand = (rows, key, minSep) => rows.forEach((row, i) => {
    const want = n => {
      const xs = n.prereqs.map(p => X[p]).filter(x => x !== undefined);
      return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : totalW / 2;
    };
    const arr = [...row].sort((a, b) => (a.slot ?? 99) - (b.slot ?? 99) || want(a) - want(b) || a.id.localeCompare(b.id));
    const xs = arr.map(want);
    for (let k = 1; k < xs.length; k++) xs[k] = Math.max(xs[k], xs[k - 1] + minSep);
    for (let k = xs.length - 2; k >= 0; k--) xs[k] = Math.min(xs[k], xs[k + 1] - minSep);
    const mid = (xs[0] + xs[xs.length - 1]) / 2;    // 整行轻推回画面中心,防跑偏
    const shift = (totalW / 2 - mid) * 0.35;
    arr.forEach((n, k) => { X[n.id] = xs[k] + shift; Y[n.id] = rowY[key + ":" + i]; });
  });
  placeBand(caseRows, "case", MIN_SEP);
  placeBand(greenRows, "green", MIN_SEP);
  placeBand(capRow, "cap", CAP_W + GAP_X);

  /* ================= 硬不变量断言 ================= */
  const rows = {};
  nodes.forEach(n => (rows[Y[n.id]] ||= []).push(n));
  for (const [ry, arr] of Object.entries(rows)) {
    const sep = arr.some(n => region(n) === "cap") ? CAP_W + GAP_X - 1 : MIN_SEP - 1;
    const s = [...arr].sort((a, b) => X[a.id] - X[b.id]);
    for (let i = 1; i < s.length; i++)
      if (X[s[i].id] - X[s[i - 1].id] < sep)
        throw new Error(`I2 间隙违规 @y=${ry}: ${s[i - 1].id}↔${s[i].id} = ${(X[s[i].id] - X[s[i - 1].id]).toFixed(0)}px < ${sep + 1}px`);
  }
  for (const n of theoryNodes) for (const p of n.prereqs)
    if (region(byId[p]) === "theory" && Y[p] >= Y[n.id] && byId[p].branch !== "root")
      throw new Error(`I4 理论区边不向下: ${p}→${n.id}`);

  const xsAll = nodes.map(n => X[n.id]), ysAll = nodes.map(n => Y[n.id]);
  return {
    pos: Object.fromEntries(nodes.map(n => [n.id, { x: X[n.id], y: Y[n.id] }])),
    levels,
    bounds: {
      minX: Math.min(...xsAll) - CAP_W / 2 - 40, maxX: Math.max(...xsAll) + CAP_W / 2 + 40,
      minY: Math.min(...ysAll) - 110, maxY: Math.max(...ysAll) + 130
    }
  };
}
