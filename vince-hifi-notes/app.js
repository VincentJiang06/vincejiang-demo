/* Vince 的 HiFi 笔记 · app.js
   零依赖。所有增强均可降级:无 JS / reduced-motion 时页面完全可读。 */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- 主题 ---------------- */
  var MODES = ["light", "neutral", "dark"];
  var PALETTES = ["lab", "synth", "moss", "glacier", "tube"];
  var THEME_COLORS = { dark: "#0f1317", neutral: "#e6e1d6", light: "#faf9f5" };

  function getMode()    { return root.getAttribute("data-mode"); }
  function getPalette() { return root.getAttribute("data-palette"); }

  function apply(mode, palette, animate) {
    if (MODES.indexOf(mode) < 0) mode = "dark";
    if (PALETTES.indexOf(palette) < 0) palette = "lab";
    var run = function () {
      root.setAttribute("data-mode", mode);
      root.setAttribute("data-palette", palette);
    };
    if (animate && !reduced) {
      if (d.startViewTransition) {           // 现代浏览器:整页交叉淡化
        d.startViewTransition(run);
      } else {                               // 退化:颜色属性过渡
        root.classList.add("theming");
        run();
        setTimeout(function () { root.classList.remove("theming"); }, 450);
      }
    } else run();
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

  /* 弹层 */
  var btn = d.getElementById("themeBtn"), pop = d.getElementById("themePop");
  if (btn && pop) {
    var setOpen = function (open) {
      pop.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!pop.classList.contains("open"));
    });
    d.addEventListener("click", function (e) {
      if (!pop.contains(e.target)) setOpen(false);
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    pop.querySelectorAll(".tp-modes button").forEach(function (b) {
      b.addEventListener("click", function () { apply(b.dataset.mode, getPalette(), true); });
    });
    pop.querySelectorAll(".sw").forEach(function (b) {
      b.addEventListener("click", function () { apply(getMode(), b.dataset.palette, true); });
    });
  }
  syncThemeUI();

  /* 跟随系统模式变化(仅当用户未手动选择过) */
  try {
    if (!localStorage.getItem("vhn-mode")) {
      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
        apply(e.matches ? "light" : "dark", getPalette(), true);
        localStorage.removeItem("vhn-mode"); // 保持"跟随系统"状态
      });
    }
  } catch (e) {}

  /* ---------------- 动效开关 ---------------- */
  if (!reduced) root.classList.add("anim");

  /* ---------------- 顶部阅读进度 ---------------- */
  var prog = d.getElementById("prog"), ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = d.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      if (prog) prog.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
      if (topBtn) topBtn.classList.toggle("show", h.scrollTop > 1100);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- 返回顶部 ---------------- */
  var topBtn = d.getElementById("top");
  if (topBtn) topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  /* ---------------- 滚动显现 ---------------- */
  if (!reduced && "IntersectionObserver" in window) {
    var sel = "section > p, section > h3, section > figure, section > table, " +
              "section > .note, section > .formula, section > ul, section > ol, " +
              ".tldr, nav.toc, .part-head, .card, .divider";
    var els = d.querySelectorAll(sel), n = 0;
    els.forEach(function (el) {
      el.classList.add("rv");
      el.style.setProperty("--d", (n++ % 4) * 60 + "ms");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 左侧章节轨 scrollspy ---------------- */
  var rail = d.getElementById("rail");
  if (rail && "IntersectionObserver" in window) {
    var links = {}, cur = null;
    rail.querySelectorAll("a").forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (cur) cur.classList.remove("on");
          cur = links[en.target.id];
          if (cur) cur.classList.add("on");
        }
      });
    }, { rootMargin: "-18% 0px -66% 0px" });
    d.querySelectorAll("section[id]").forEach(function (s) {
      if (links[s.id]) spy.observe(s);
    });
  }

  /* ---------------- 图放大 ---------------- */
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
    function closeLB() {
      lb.classList.remove("open");
      lbIn.innerHTML = "";
      d.body.style.overflow = "";
    }
    lb.addEventListener("click", closeLB);
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) closeLB();
    });
  }
})();
