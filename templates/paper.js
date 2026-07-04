// paper.js —— 论文模板前端脚本(构建时内联):A4 分页连排、页眉页码、缩放、大纲高亮、抽屉目录。
// 原则:#flow(服务端渲染的连续版)永远是事实源 —— 打印用它、无 JS 时显示它;
// 屏显把 #flow 的顶层块逐个克隆进 793×1123 的 .sheet,块级粒度分页,失败则静默退回连续版。
(function () {
  'use strict';
  var flow = document.getElementById('flow');
  var sheets = document.getElementById('sheets');
  var deck = document.getElementById('deck');
  var side = document.getElementById('side');
  var toc = document.getElementById('toc');
  var SHORT = document.body.getAttribute('data-short') || document.title;

  var pb = document.getElementById('printbtn');
  if (pb) pb.addEventListener('click', function () { window.print(); });
  var tg = document.getElementById('stoggle');
  if (tg) tg.addEventListener('click', function () { side.classList.toggle('open'); });
  if (toc) toc.addEventListener('click', function (e) { if (e.target.closest('a')) side.classList.remove('open'); });

  var svgUid = 0;
  function cloneBlock(el) {
    var c = el.cloneNode(true);
    // SVG marker 等内部 id 在克隆里重写,避免与 #flow 原件冲突(原件供打印,引用不能破坏)
    if (c.querySelector && c.querySelector('svg defs [id]')) {
      var n = ++svgUid;
      c.innerHTML = c.innerHTML.replace(/(\bid="|\burl\(#)(ah\d+)/g, '$1$2c' + n);
    }
    return c;
  }

  function paginate() {
    var kids = [].slice.call(flow.children);
    if (!kids.length) return;
    sheets.innerHTML = '';
    var sheet, body;
    function newSheet() {
      sheet = document.createElement('div'); sheet.className = 'sheet';
      body = document.createElement('div'); body.className = 'sheet-body pp';
      sheet.appendChild(body); sheets.appendChild(sheet);
    }
    newSheet();
    var HMAX = 931; // 1123 - 2×96 版心高
    kids.forEach(function (k) {
      if (k.classList && k.classList.contains('pagebreak')) {
        if (body.childElementCount) newSheet();
        return;
      }
      var c = cloneBlock(k);
      body.appendChild(c);
      if (body.scrollHeight > HMAX + 1) {
        if (body.childElementCount === 1) {           // 单块超页:独占一页,允许纸张变长
          sheet.className = 'sheet tall';
          newSheet();
          return;
        }
        body.removeChild(c);
        var carry = [c];                              // 标题避免孤悬页尾:随后文一起搬走(至多带两级)
        var moved = 0;
        while (moved < 2 && body.childElementCount > 1 && /^H[2-4]$/.test(body.lastElementChild.tagName)) {
          carry.unshift(body.removeChild(body.lastElementChild)); moved++;
        }
        newSheet();
        carry.forEach(function (m) { body.appendChild(m); });
        if (body.scrollHeight > HMAX + 1) sheet.className = 'sheet tall';
      }
    });
    if (!body.childElementCount) sheets.removeChild(sheet);

    var all = sheets.children, total = all.length;
    for (var i = 0; i < total; i++) {
      if (i > 0) {
        var rh = document.createElement('div'); rh.className = 'running'; rh.textContent = SHORT;
        all[i].insertBefore(rh, all[i].firstChild);
      }
      var pn = document.createElement('div'); pn.className = 'pageno';
      pn.textContent = (i + 1) + ' / ' + total;
      all[i].appendChild(pn);
    }
    // 连续版让位:去掉会与克隆冲突的锚点 id(打印不需要;SVG 内部 id 保留)
    [].forEach.call(flow.querySelectorAll('[id]'), function (n) {
      if (/^(sec-|ref-|paper-top)/.test(n.id)) n.removeAttribute('id');
    });
    document.body.classList.add('paged');
  }

  function fit() {
    var avail = deck.clientWidth - 36;
    var z = Math.min(1, avail / 794);
    sheets.style.setProperty('--z', z.toFixed(4));
  }

  // 大纲高亮(scroll-spy)
  function spy() {
    var links = toc ? [].slice.call(toc.querySelectorAll('a[href^="#"]')) : [];
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var hs = [].slice.call(sheets.querySelectorAll('[id^="sec-"],#paper-top'))
      .filter(function (h) { return map[h.id]; });
    var ticking = false;
    function update() {
      ticking = false;
      var cur = null;
      for (var i = 0; i < hs.length; i++) {
        if (hs[i].getBoundingClientRect().top <= 150) cur = hs[i]; else break;
      }
      links.forEach(function (a) { a.classList.remove('on'); });
      if (cur) {
        map[cur.id].classList.add('on');
      } else if (links[0]) links[0].classList.add('on');
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function boot() {
    try {
      fit();
      paginate();
      spy();
      if (location.hash) {
        var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView();
      }
    } catch (e) {
      document.body.classList.remove('paged');   // 任一步失败:退回连续版,不留半成品
      if (window.console) console.error('paper paginate failed:', e);
    }
    window.addEventListener('resize', fit);
  }

  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var loaded = (document.readyState === 'complete')
    ? Promise.resolve()
    : new Promise(function (r) { window.addEventListener('load', r); });
  Promise.all([fontsReady, loaded]).then(boot);
})();
