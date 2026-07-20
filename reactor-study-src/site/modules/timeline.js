/* REACTOR · timeline.js — 可拖动时间轴
   config = { hint?, events:[{date, title, html, more?}] }
   more 为新增可选字段：详情面板里可再展开的一段补充背景。
   交互：点节点看详情 · 鼠标按住轴左右拖 · 键盘左右键/Home/End · 当前节点高亮。 */
import { mount } from "/modules/mod-kit.js";
import { t } from "/modules/mod-i18n.js";

mount("timeline", (body, fig, { config }) => {
  const events = config.events || [];
  if (!events.length) return;

  const head = document.createElement("div");
  head.style.cssText = "display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:14px";
  const hint = document.createElement("p");
  hint.className = "label"; hint.style.margin = "0";
  hint.textContent = config.hint || t("点节点看详情 · 按住轴可以左右拖 · 键盘左右键也能走。");
  const counter = document.createElement("span");
  counter.className = "mono";
  counter.style.cssText = "font-size:.72rem;color:var(--accent);flex:none";
  head.append(hint, counter);
  body.appendChild(head);

  const track = document.createElement("div");
  track.className = "tl-track";
  track.tabIndex = 0;
  track.setAttribute("aria-label", t("时间轴，左右方向键切换节点"));
  const detail = document.createElement("div");
  detail.className = "glass bolted";
  detail.style.marginTop = "16px";
  detail.style.minHeight = "90px";

  let cur = -1, dragging = false, dragMoved = false, x0 = 0, s0 = 0, pid = null;

  events.forEach((e, i) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "tl-node";
    node.innerHTML = `<span class="led"></span>
      <div class="tl-date">${e.date}</div>
      <div class="tl-title">${e.title}</div>`;
    node.addEventListener("click", () => { if (!dragMoved) sel(i); });
    track.appendChild(node);
  });

  function sel(i) {
    if (i === cur || i < 0 || i >= events.length) return;   // 值没变就不动 DOM
    cur = i;
    [...track.children].forEach((c, j) => {
      c.classList.toggle("cur", j === i);
      c.classList.toggle("past", j < i);
      c.querySelector(".led").className = j <= i ? "led on" : "led";
    });
    counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(events.length).padStart(2, "0")}`;
    const e = events[i];
    detail.innerHTML = `<div class="label" style="color:var(--accent);margin-bottom:8px">${e.date} · ${e.title}</div><div class="read">${e.html}</div>`
      + (e.more ? `<div class="tl-more"><button type="button" class="btn tl-more-btn">${t("展开更多背景")}</button><div class="tl-more-body">${e.more}</div></div>` : "");
    if (e.more) {
      const box = detail.querySelector(".tl-more");
      const tg = detail.querySelector(".tl-more-btn");
      tg.onclick = () => { tg.textContent = box.classList.toggle("open") ? t("收起背景") : t("展开更多背景"); };
    }
    ensureVisible(i);
  }

  /* 选中的节点保持在可视区里（只改 scrollLeft，不做动画） */
  function ensureVisible(i) {
    const n = track.children[i]; if (!n) return;
    const L = n.offsetLeft, R = L + n.offsetWidth;
    if (L < track.scrollLeft) track.scrollLeft = Math.max(0, L - 20);
    else if (R > track.scrollLeft + track.clientWidth) track.scrollLeft = R - track.clientWidth + 20;
  }

  /* 鼠标拖动浏览。触屏走原生滚动，不掺和；
     超过阈值才捕获指针，这样普通点击不受影响。 */
  track.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    dragging = true; dragMoved = false;
    x0 = e.clientX; s0 = track.scrollLeft; pid = e.pointerId;
  });
  track.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - x0;
    if (!dragMoved && Math.abs(dx) > 5) {
      dragMoved = true;
      track.classList.add("dragging");
      try { track.setPointerCapture(pid); } catch {}
    }
    if (dragMoved) track.scrollLeft = s0 - dx;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("dragging");
    setTimeout(() => { dragMoved = false; }, 0);   // 让本次拖动结束后的 click 先被拦下
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { sel(cur + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { sel(cur - 1); e.preventDefault(); }
    else if (e.key === "Home") { sel(0); e.preventDefault(); }
    else if (e.key === "End") { sel(events.length - 1); e.preventDefault(); }
  });

  body.append(track, detail);
  sel(0);
});
