/* REACTOR · quiz.js (generic) — LED self-check.
   config = { questions:[{ q, options:[{t, ok}], explain }] } */
import { mount } from "/modules/mod-kit.js";

mount("quiz", (body, fig, { config }) => {
  const qs = config.questions || [];
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "12px";
  intro.textContent = config.hint || "自检 · 选一个，LED 会告诉你对不对。";
  body.appendChild(intro);

  qs.forEach((q, qi) => {
    const block = document.createElement("div");
    block.style.cssText = "margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--line)";
    block.innerHTML = `<div style="font-family:var(--font-sans);font-size:1rem;margin-bottom:10px">${qi + 1}. ${q.q}</div>`;
    const opts = document.createElement("div");
    opts.style.cssText = "display:flex;flex-direction:column;gap:6px";
    const expl = document.createElement("div");
    expl.style.cssText = "margin-top:10px;font-size:.84rem;color:var(--text-2);display:none";
    q.options.forEach(o => {
      const b = document.createElement("button");
      b.style.cssText = "display:flex;align-items:center;gap:10px;text-align:left;font:inherit;color:var(--text);background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:9px 12px;cursor:pointer;transition:.15s";
      b.innerHTML = `<span class="led"></span><span style="font-size:.9rem">${o.t}</span>`;
      b.onclick = () => {
        opts.querySelectorAll("button").forEach(x => { x.style.borderColor = "var(--line)"; x.querySelector(".led").className = "led"; });
        const led = b.querySelector(".led");
        if (o.ok) { b.style.borderColor = "var(--green)"; led.className = "led on"; led.style.setProperty("--accent", "var(--green)"); led.style.setProperty("--accent-glow", "var(--green-glow)"); }
        else { b.style.borderColor = "var(--red)"; led.style.background = "var(--red)"; led.style.boxShadow = "0 0 6px var(--red-glow),0 0 14px var(--red-glow)"; }
        expl.style.display = "block";
        expl.innerHTML = `<span class="mono" style="color:${o.ok ? "var(--green)" : "var(--red)"}">${o.ok ? "✓ 正确" : "✕ 再想想"}</span> — ${q.explain}`;
      };
      opts.appendChild(b);
    });
    block.append(opts, expl); body.appendChild(block);
  });
});
