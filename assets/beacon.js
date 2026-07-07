/* First-party lightweight analytics for vincejiang.com and UniWild.
   No cookies, no third-party runtime. Sends pageview/interaction summary to /_a/e. */
(function () {
  "use strict";
  var ENDPOINT = "/_a/e";
  var doc = document, root = doc.documentElement, nav = navigator;
  function rid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  var PV = rid(), t0 = Date.now(), interacted = false, maxScroll = 0;

  function autoFlags() {
    var f = [];
    try { if (nav.webdriver) f.push("webdriver"); } catch (e) {}
    try { if (window._phantom || window.callPhantom || window.__nightmare) f.push("phantom"); } catch (e) {}
    try { if (/HeadlessChrome/.test(nav.userAgent || "")) f.push("headless"); } catch (e) {}
    try { if (nav.languages && nav.languages.length === 0) f.push("nolang"); } catch (e) {}
    try { if (window.outerWidth === 0 && window.outerHeight === 0) f.push("noouter"); } catch (e) {}
    return f.join(",");
  }
  function payload(type, extra) {
    var p = {
      t: type, pv: PV,
      path: location.pathname,
      pt: root.getAttribute("data-page") || "",
      ref: doc.referrer || "",
      sw: screen.width || 0, sh: screen.height || 0, vw: window.innerWidth || 0,
      lang: (nav.languages && nav.languages.join(",")) || nav.language || "",
      tz: (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { return ""; } })(),
      af: autoFlags(),
      ic: interacted ? 1 : 0,
      dwell: Math.round((Date.now() - t0) / 1000),
      ms: maxScroll
    };
    if (extra) for (var k in extra) p[k] = extra[k];
    return p;
  }
  function send(type, extra) {
    var body = JSON.stringify(payload(type, extra));
    try { if (nav.sendBeacon && nav.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }))) return; } catch (e) {}
    try { var x = new XMLHttpRequest(); x.open("POST", ENDPOINT, true); x.setRequestHeader("Content-Type", "application/json"); x.send(body); } catch (e) {}
  }

  function pv() { send("pv"); }
  if (doc.readyState === "complete") setTimeout(pv, 0);
  else window.addEventListener("load", function () { setTimeout(pv, 0); });

  function mark() { interacted = true; }
  ["pointerdown", "keydown", "touchstart", "mousemove", "scroll"].forEach(function (ev) {
    window.addEventListener(ev, function once() { mark(); window.removeEventListener(ev, once, true); }, true);
  });
  window.addEventListener("scroll", function () {
    var h = root, sc = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    maxScroll = Math.max(maxScroll, Math.min(100, Math.round(sc * 100)));
  }, { passive: true });

  if (window.IntersectionObserver) {
    var seen = {};
    var io = new IntersectionObserver(function (ents) {
      for (var i = 0; i < ents.length; i++) {
        var e = ents[i];
        if (e.isIntersecting) {
          var g = e.target.getAttribute("data-gate");
          if (g && !seen[g]) { seen[g] = 1; send("gate", { gate: g }); }
        }
      }
    }, { threshold: 0.4 });
    var obs = function () { var els = doc.querySelectorAll("[data-gate]"); for (var i = 0; i < els.length; i++) io.observe(els[i]); };
    if (doc.readyState !== "loading") obs(); else window.addEventListener("DOMContentLoaded", obs);
  }

  window.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.card, a.modlink, a.work, article a");
    if (!a) return;
    var mod = a.getAttribute("data-module") || a.getAttribute("href") || "";
    if (mod) send("card", { module: mod.slice(0, 60), slug: (a.getAttribute("data-slug") || a.textContent || "").trim().slice(0, 120) });
  }, true);

  var sentEnd = false;
  function bye() { if (sentEnd) return; sentEnd = true; send("end"); }
  window.addEventListener("visibilitychange", function () { if (doc.visibilityState === "hidden") bye(); });
  window.addEventListener("pagehide", bye);
})();
