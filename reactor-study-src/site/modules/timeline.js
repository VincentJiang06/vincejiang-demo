/* REACTOR · timeline.js (generic) — config = { events:[{date,title,html}] } */
import { mount } from "/modules/mod-kit.js";

mount("timeline", (body, fig, { config }) => {
  const events = config.events || [];
  const hint = document.createElement("p");
  hint.className = "label"; hint.style.marginBottom = "14px";
  hint.textContent = config.hint || "点节点看详情。";
  body.appendChild(hint);

  const track = document.createElement("div");
  track.style.cssText = "position:relative;display:flex;gap:0;overflow-x:auto;padding:0 0 12px;border-bottom:1px solid var(--line)";
  const detail = document.createElement("div");
  detail.className = "glass bolted"; detail.style.marginTop = "16px"; detail.style.minHeight = "90px";

  events.forEach((e, i) => {
    const node = document.createElement("button");
    node.style.cssText = "flex:0 0 auto;min-width:120px;text-align:left;background:transparent;border:0;cursor:pointer;padding:6px 14px 6px 0;font:inherit;color:var(--text-2);position:relative";
    node.innerHTML = `<span class="led" style="position:absolute;left:0;bottom:-19px"></span>
      <div style="font-family:var(--font-mono);font-size:.8rem;color:var(--accent)">${e.date}</div>
      <div style="font-size:.78rem;margin-top:4px;max-width:150px">${e.title}</div>`;
    node.onclick = () => sel(i);
    track.appendChild(node);
  });
  function sel(i) {
    [...track.children].forEach((c, j) => c.querySelector(".led").className = j === i ? "led on" : (j < i ? "led on" : "led"));
    const e = events[i];
    detail.innerHTML = `<div class="label" style="color:var(--accent);margin-bottom:8px">${e.date} · ${e.title}</div><div class="read">${e.html}</div>`;
  }
  body.append(track, detail); sel(0);
});
