/* Vince 的 HiFi 笔记 · app.js(精简版)
   只保留三件事:主题系统(3 模式 × 5 配色)、返回顶部、图放大。
   已移除:整页 View Transition、滚动渐显、SVG 描线动画、阅读进度条、章节轨
   ——页面以静态呈现,主题切换只做轻量表层过渡,不再逐元素/逐 SVG 动画(那是之前卡顿的根源)。
   零依赖;无 JS 时页面完全可读。后续扩写只需往 index.html 加内容,通常不必动本文件。 */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- 主题:data-mode(light/neutral/dark) × data-palette(5) ---------------- */
  var MODES = ["light", "neutral", "dark"];
  var PALETTES = ["lab", "synth", "moss", "glacier", "tube"];
  var THEME_COLORS = { dark: "#0f1317", neutral: "#e6e1d6", light: "#faf9f5" };

  function getMode()    { return root.getAttribute("data-mode"); }
  function getPalette() { return root.getAttribute("data-palette"); }

  function apply(mode, palette, animate) {
    if (MODES.indexOf(mode) < 0) mode = "dark";
    if (PALETTES.indexOf(palette) < 0) palette = "lab";
    // 轻量过渡:只淡化表层容器(见 styles.css 的 html.theming),不逐元素、不动 SVG。
    if (animate && !reduced) {
      root.classList.add("theming");
      setTimeout(function () { root.classList.remove("theming"); }, 360);
    }
    root.setAttribute("data-mode", mode);
    root.setAttribute("data-palette", palette);
    try {
      localStorage.setItem("vhn-mode", mode);
      localStorage.setItem("vhn-palette", palette);
    } catch (e) {}
    var m = d.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", THEME_COLORS[mode]);
    syncThemeUI();
  }

  function syncThemeUI() {
    d.querySelectorAll(".tp-modes button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.mode === getMode()));
    });
    d.querySelectorAll(".sw").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.palette === getPalette()));
    });
  }

  /* 主题弹层 */
  var btn = d.getElementById("themeBtn"), pop = d.getElementById("themePop");
  if (btn && pop) {
    var setOpen = function (open) {
      pop.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!pop.classList.contains("open")); });
    d.addEventListener("click", function (e) { if (!pop.contains(e.target)) setOpen(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    pop.querySelectorAll(".tp-modes button").forEach(function (b) {
      b.addEventListener("click", function () { apply(b.dataset.mode, getPalette(), true); });
    });
    pop.querySelectorAll(".sw").forEach(function (b) {
      b.addEventListener("click", function () { apply(getMode(), b.dataset.palette, true); });
    });
  }
  syncThemeUI();

  /* 跟随系统模式变化(仅当用户没手动选过) */
  try {
    if (!localStorage.getItem("vhn-mode")) {
      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
        apply(e.matches ? "light" : "dark", getPalette(), true);
        localStorage.removeItem("vhn-mode");
      });
    }
  } catch (e) {}

  /* ---------------- 返回顶部 ---------------- */
  var topBtn = d.getElementById("top");
  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        topBtn.classList.toggle("show", d.documentElement.scrollTop > 1100);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- 图放大(点图看大图;用户触发,非环境动画) ---------------- */
  var lb = d.getElementById("lightbox");
  if (lb) {
    var lbIn = lb.querySelector(".lb-in");
    d.querySelectorAll(".figbox").forEach(function (box) {
      box.setAttribute("tabindex", "0");
      box.setAttribute("role", "button");
      box.setAttribute("aria-label", "放大查看图表");
      function openLB() {
        var svg = box.querySelector("svg");
        if (!svg) return;
        lbIn.innerHTML = "";
        lbIn.appendChild(svg.cloneNode(true));
        lb.classList.add("open");
        d.body.style.overflow = "hidden";
      }
      box.addEventListener("click", openLB);
      box.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(); }
      });
    });
    function closeLB() { lb.classList.remove("open"); lbIn.innerHTML = ""; d.body.style.overflow = ""; }
    lb.addEventListener("click", closeLB);
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) closeLB(); });
  }
})();
