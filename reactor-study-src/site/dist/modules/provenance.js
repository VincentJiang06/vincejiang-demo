/* REACTOR · provenance.js — 考证翻卡：翻的是流言，读的是档案。
   config = {
     hint?,
     cards:[{front, frontTag, back, backTag, quote?, cite?}],   // quote/cite 新增：一手来源引文，可展开
     contrast?: { label?, a:{tag?,text}, b:{tag?,text} },       // 新增：讹传/原文对照，text 里 [[词]] 标高亮
     timeline: [[year, text], ...] 或 [{y, t, html?, kind?:"myth"}]  // 老格式照用；翻开一张卡后通电成可点证据链
   }
   现有课页（cards + timeline 数组）零改动可用。 */
import { mount } from "/modules/mod-kit.js?v=4501323cdd";
import { t } from "/modules/mod-i18n.js?v=fe1fe69deb";

mount("provenance", (body, fig, { config }) => {
  const cards = config.cards || [];
  const chainData = (config.timeline || []).map(e =>
    Array.isArray(e) ? { y: e[0], t: e[1], html: null, kind: null }
                     : { y: e.y, t: e.t, html: e.html || null, kind: e.kind || null });
  let unlocked = false, chainSel = null;

  const p = document.createElement("p");
  p.className = "label"; p.style.marginBottom = "12px";
  p.textContent = config.hint || t("点卡片翻面 · 流行的说法往往不是原文。");
  body.appendChild(p);

  /* —— 翻卡 —— */
  const grid = document.createElement("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px";
  cards.forEach(cd => {
    const card = document.createElement("div");
    card.className = "prov-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `<div class="fc-inner">
      <div class="fc-face">
        <span class="label" style="color:var(--accent)">${cd.frontTag || ""}</span>
        <span class="fc-front-text">${cd.front}</span>
        <span class="label fc-flip-hint">${t("翻面 ▸")}</span></div>
      <div class="fc-face fc-back">
        <span class="label" style="color:var(--accent)">${cd.backTag || t("档案")}</span>
        <span class="fc-back-text">${cd.back}</span>
        ${cd.quote ? `<button type="button" class="fc-quote-btn">${t("看原文引文")}</button>
          <blockquote class="fc-quote">${cd.quote}${cd.cite ? `<span class="label fc-cite">${cd.cite}</span>` : ""}</blockquote>` : ""}
      </div></div>`;
    let f = false;
    const inner = card.querySelector(".fc-inner");
    const flip = () => {
      f = !f;
      inner.style.transform = f ? "rotateY(180deg)" : "none";
      card.setAttribute("aria-pressed", String(f));
      if (f) unlock();
    };
    card.addEventListener("click", e => {
      if (e.target.closest(".fc-quote-btn,.fc-quote")) return;   // 引文区的点击不翻卡
      flip();
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
    if (cd.quote) {
      const qb = card.querySelector(".fc-quote-btn");
      qb.onclick = () => { qb.textContent = card.classList.toggle("q-open") ? t("收起引文") : t("看原文引文"); };
    }
    grid.appendChild(card);
  });
  body.appendChild(grid);

  /* —— 卡尺寸以翻面后的内容为准(用户裁决):量正反两面自然高,全组取最大,杜绝内滚动 —— */
  const sizeCards = () => {
    let max = 150;
    const cs = grid.querySelectorAll(".prov-card");
    cs.forEach(c => { c.style.minHeight = ""; });
    cs.forEach(c => c.querySelectorAll(".fc-face").forEach(fc => {
      max = Math.max(max, fc.scrollHeight + 8);
    }));
    cs.forEach(c => { c.style.minHeight = max + "px"; });
  };
  requestAnimationFrame(sizeCards);
  addEventListener("resize", sizeCards);
  grid.addEventListener("click", () => requestAnimationFrame(sizeCards));  // 引文展开后重量

  /* —— 讹传/原文对照（翻开一张卡后点亮） —— */
  if (config.contrast) {
    const ct = config.contrast;
    const hl = (txt, cls) => String(txt).replace(/\[\[(.+?)\]\]/g, `<mark class="${cls}">$1</mark>`);
    const c = document.createElement("div");
    c.className = "contrast locked";
    c.innerHTML = `<div class="label" style="margin-bottom:10px">${ct.label || t("两个版本，一句一句对着看")}</div>
      <div class="contrast-row"><span class="ct-tag ct-a">${ct.a.tag || t("讹传")}</span><span>${hl(ct.a.text, "hl-a")}</span></div>
      <div class="contrast-row"><span class="ct-tag ct-b">${ct.b.tag || t("原文")}</span><span>${hl(ct.b.text, "hl-b")}</span></div>
      <div class="label ct-note">${t("高亮的字，就是两个版本分岔的地方")}</div>`;
    body.appendChild(c);
  }

  /* —— 证据链时间轴（翻开一张卡后通电，可点、可用左右键走） —— */
  if (chainData.length) {
    const chain = document.createElement("div");
    chain.className = "prov-chain locked";
    const lockNote = document.createElement("div");
    lockNote.className = "label chain-note";
    lockNote.style.marginBottom = "10px";
    lockNote.textContent = t("先翻开上面的一张卡片，这条证据链才会通电");
    const track = document.createElement("div");
    track.className = "chain-track";
    track.tabIndex = 0;
    track.setAttribute("aria-label", t("证据链时间轴，左右方向键切换"));
    const detail = document.createElement("div");
    detail.className = "chain-detail";
    let cur = -1;
    chainData.forEach((e, i) => {
      const n = document.createElement("button");
      n.type = "button";
      n.className = "chain-node" + (e.kind === "myth" ? " myth" : "");
      n.innerHTML = `<span class="led"></span><span class="cy">${e.y}</span><span class="cn-t">${e.t}</span>`;
      n.onclick = () => sel(i);
      track.appendChild(n);
    });
    function sel(i) {
      if (i === cur || i < 0 || i >= chainData.length) return;
      cur = i;
      [...track.children].forEach((c, j) => {
        c.classList.toggle("cur", j === i);
        c.classList.toggle("past", j < i);
        c.querySelector(".led").className = j <= i ? "led on" : "led";
      });
      const e = chainData[i];
      detail.innerHTML = `<span class="label" style="color:var(--accent)">${e.y} · ${e.kind === "myth" ? t("讹传在这里出现") : t("证据")}</span>
        <div class="read" style="margin-top:6px;font-size:.88rem">${e.html || e.t}</div>`;
    }
    track.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { sel(cur + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { sel(cur - 1); e.preventDefault(); }
    });
    chain.append(lockNote, track, detail);
    body.appendChild(chain);
    chainSel = sel;
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    body.querySelectorAll(".locked").forEach(el => el.classList.remove("locked"));
    const note = body.querySelector(".chain-note");
    if (note) note.textContent = t("证据链已通电 · 点年份，看这一年发生了什么");
    if (chainSel) chainSel(0);
  }
});
