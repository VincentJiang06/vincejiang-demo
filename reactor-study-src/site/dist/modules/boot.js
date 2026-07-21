/* REACTOR · boot.js — shared: theme/accent switching, progress, boot lines */
const root = document.documentElement;
const LS = { theme: "reactor.theme", done: "reactor.done" };

/* ---- 配色三态：auto（跟随系统）/ light / dark ----
   只有明暗两套色，但"跟随系统"必须是可回去的状态：一旦写死 light|dark，
   用户就再也没法把选择权交还给系统了。<head> 里的内联脚本已经先落好 data-theme。*/
localStorage.removeItem("reactor.accent"); // 清掉旧版留下的强调色
const MODES = ["auto", "light", "dark"];
/* 主题按钮标签随页面语种走(英文页不该出现中文「自动」) */
const IS_EN = (document.documentElement.lang || "zh").toLowerCase().startsWith("en");
const MODE_LABEL = IS_EN
  ? { auto: "Auto", light: "Light", dark: "Dark" }
  : { auto: "自动", light: "亮", dark: "暗" };
const mq = matchMedia("(prefers-color-scheme: light)");
let mode = MODES.includes(localStorage.getItem(LS.theme)) ? localStorage.getItem(LS.theme) : "auto";

function resolved() { return mode === "auto" ? (mq.matches ? "light" : "dark") : mode; }
function applyTheme(repaint) {
  root.setAttribute("data-theme", resolved());
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.querySelector(".tt-label").textContent = MODE_LABEL[mode];
    const nextMode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    btn.setAttribute("aria-label", IS_EN
      ? `Theme: ${MODE_LABEL[mode]}${mode === "auto" ? " (follows system)" : ""}. Click to switch to ${MODE_LABEL[nextMode]}`
      : `配色：${MODE_LABEL[mode]}${mode === "auto" ? "（跟随系统）" : ""}。点击切换到${MODE_LABEL[nextMode]}`);
  });
  // canvas 是位图：主题换了 CSS 变量跟着换，但已经画上去的像素不会。
  // 各模块都监听 resize 重绘，借这个事件让它们用新调色板重画一遍。
  if (repaint) window.dispatchEvent(new Event("resize"));
}
document.querySelectorAll("[data-theme-toggle]").forEach(btn =>
  btn.addEventListener("click", () => {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    localStorage.setItem(LS.theme, mode);
    applyTheme(true);
  }));
mq.addEventListener("change", () => { if (mode === "auto") applyTheme(true); });
applyTheme(false);

/* ---- progress API (shared via localStorage) ---- */
export const progress = {
  get() { try { return new Set(JSON.parse(localStorage.getItem(LS.done) || "[]")); } catch { return new Set(); } },
  add(id) { const s = this.get(); s.add(id); localStorage.setItem(LS.done, JSON.stringify([...s])); },
  clear() { localStorage.removeItem(LS.done); }
};

/* ---- mark current lesson complete on scroll-to-bottom ---- */
const lessonId = document.querySelector("main[data-branch] .nameplate .tag")?.textContent?.trim();
if (lessonId && /^[NRBYC]\d/.test(lessonId) && document.querySelector("article.stack")) {
  const foot = document.querySelector(".site-foot");
  // 光是"页脚在视口里"不够：大屏或短课文一加载页脚就已经可见，
  // 于是没读一行就被标记完成，还会连带解锁后继节点。要求真的滚动过。
  const done = () => progress.add(lessonId);
  const room = () => document.documentElement.scrollHeight - innerHeight;
  if (room() < 240) {
    // 整篇本来就装得下（大屏 / 短课文）：没有"滚到底"这个动作可用，
    // 拿停留时长兜底。之前只认滚动，这类页面永远标不完，后继节点也就永远解不开。
    setTimeout(done, 20000);
  } else {
    let scrolled = false;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && scrolled) { done(); io.disconnect(); }
    }));
    addEventListener("scroll", () => {
      if (scrolled || scrollY < Math.min(200, room() * 0.5)) return;
      scrolled = true;
      if (foot) { io.disconnect(); io.observe(foot); }
    }, { passive: true });
  }
}

/* ---- 「接下来去哪」推荐:标了 data-rec-filter="explored" 的组(同层同色),
   把已读过的节点隐掉;整组读完则整组消失。无 JS 时全部照常显示(渐进增强)。---- */
(() => {
  const done = progress.get();
  if (!done.size) return;
  document.querySelectorAll('.rec-group[data-rec-filter="explored"]').forEach(g => {
    let left = 0;
    g.querySelectorAll(".rec-item[data-node]").forEach(a => {
      if (done.has(a.dataset.node)) a.hidden = true; else left++;
    });
    if (!left) g.hidden = true;
  });
})();

/* ---- lazily boot the talent tree if present（首页全屏树 / 课程页导轨迷你树）---- */
if (document.querySelector(".tree-viewport")) import("/modules/tree.js?v=a53da7f3fa");

/* ---- respect reduced motion for typing bootlines ---- */
if (matchMedia("(prefers-reduced-motion: reduce)").matches)
  document.querySelectorAll(".bootline.typing").forEach(el => el.classList.remove("typing"));


/* 语言切换:点一下记住选择(localStorage),但绝不做首屏自动重定向——
   自动跳转会伤 SEO 也惹恼用户。记忆只用于将来可能的「回到上次语种」提示。 */
document.querySelector("[data-lang-switch]")?.addEventListener("click", () => {
  try { localStorage.setItem("reactor.lang", document.documentElement.lang.startsWith("en") ? "zh" : "en"); } catch {}
});
