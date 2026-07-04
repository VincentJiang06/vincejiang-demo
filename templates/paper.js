// paper.js —— 论文模板前端脚本(构建时内联)。
// 单张连续长纸,自然滚动阅读(不做屏上 A4 分页,避免硬裁切)。
// 只负责:打印按钮、窄屏抽屉目录、左侧大纲滚动高亮(scroll-spy)、hash 定位。
(function () {
  'use strict';
  var flow = document.getElementById('flow');
  var side = document.getElementById('side');
  var toc = document.getElementById('toc');

  var pb = document.getElementById('printbtn');
  if (pb) pb.addEventListener('click', function () { window.print(); });
  var tg = document.getElementById('stoggle');
  if (tg && side) tg.addEventListener('click', function () { side.classList.toggle('open'); });
  if (toc && side) toc.addEventListener('click', function (e) { if (e.target.closest('a')) side.classList.remove('open'); });

  // 回到顶部:滚动过一屏后出现
  var totop = document.getElementById('totop');
  if (totop) {
    totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    var tt = false;
    window.addEventListener('scroll', function () {
      if (!tt) { tt = true; requestAnimationFrame(function () { tt = false; totop.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop) > 400); }); }
    }, { passive: true });
  }

  // 大纲滚动高亮:观察正文里的章节标题
  function spy() {
    if (!toc || !flow) return;
    var links = [].slice.call(toc.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var hs = [].slice.call(flow.querySelectorAll('[id^="sec-"],#paper-top'))
      .filter(function (h) { return map[h.id]; });
    if (!hs.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var cur = null;
      for (var i = 0; i < hs.length; i++) {
        if (hs[i].getBoundingClientRect().top <= 120) cur = hs[i]; else break;
      }
      links.forEach(function (a) { a.classList.remove('on'); });
      if (cur) map[cur.id].classList.add('on');
      else if (links[0]) links[0].classList.add('on');
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  spy();
  if (location.hash) {
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) t.scrollIntoView();
  }
})();
