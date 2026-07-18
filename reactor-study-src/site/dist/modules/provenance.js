/* REACTOR · provenance.js (generic) — flip the myth, read the archive.
   config = { cards:[{front,frontTag,back,backTag}], timeline:[[year,text],...] } */
import { mount } from "/modules/mod-kit.js?v=fccf0ac854";

mount("provenance", (body, fig, { config }) => {
  const cards = config.cards || [];
  const timeline = config.timeline || [];

  const p = document.createElement("p");
  p.className = "label"; p.style.marginBottom = "12px";
  p.textContent = config.hint || "点卡片翻面 · 流行的说法往往不是原文。";
  body.appendChild(p);

  const grid = document.createElement("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px";
  cards.forEach(cd => {
    const card = document.createElement("button");
    card.style.cssText = "position:relative;min-height:180px;border:1px solid var(--line);border-radius:4px;background:var(--card);padding:0;cursor:pointer;text-align:left;font:inherit;color:inherit;perspective:900px";
    card.innerHTML = `<div class="fc-inner" style="position:relative;width:100%;height:100%;min-height:178px;transition:transform .55s cubic-bezier(.5,0,.2,1);transform-style:preserve-3d">
      <div style="position:absolute;inset:0;backface-visibility:hidden;padding:16px;display:flex;flex-direction:column;gap:8px">
        <span class="label" style="color:var(--accent)">${cd.frontTag || ""}</span>
        <span style="font-family:var(--font-sans);font-size:.98rem;line-height:1.5">${cd.front}</span>
        <span class="label" style="margin-top:auto;opacity:.55">翻面 ▸</span></div>
      <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);padding:16px;display:flex;flex-direction:column;gap:8px;background:var(--panel);border-radius:4px">
        <span class="label" style="color:var(--accent)">${cd.backTag || "档案"}</span>
        <span style="font-size:.86rem;line-height:1.55">${cd.back}</span></div>
    </div>`;
    let f = false; const inner = card.querySelector(".fc-inner");
    card.onclick = () => { f = !f; inner.style.transform = f ? "rotateY(180deg)" : "none"; };
    grid.appendChild(card);
  });
  body.appendChild(grid);

  if (timeline.length) {
    const tl = document.createElement("div");
    tl.style.cssText = "margin-top:24px;display:flex;align-items:stretch;overflow-x:auto";
    timeline.forEach(([y, txt]) => {
      const step = document.createElement("div");
      step.style.cssText = "flex:1;min-width:150px;padding:12px 14px;border-left:2px solid var(--accent)";
      step.innerHTML = `<div class="readout" style="display:inline-block;padding:2px 8px;font-size:.9rem">${y}</div>
        <div style="font-size:.8rem;color:var(--text-2);margin-top:6px">${txt}</div>`;
      tl.appendChild(step);
    });
    body.appendChild(tl);
  }
});
