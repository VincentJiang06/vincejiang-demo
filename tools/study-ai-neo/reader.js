"use strict";

(() => {
  if (location.protocol === "file:") {
    for (const link of document.querySelectorAll("[data-online], [data-download]")) {
      link.hidden = true;
    }
  }

  const mast = document.querySelector('.mast');
  const measureMast = () => document.documentElement.style.setProperty('--mast-height', mast.offsetHeight + 'px');
  measureMast();
  if (window.ResizeObserver) new ResizeObserver(measureMast).observe(mast);

  // The contents follow the reading position. Anchors and browser history stay native.
  const sections = Array.from(document.querySelectorAll(".unit-section[data-unit]"));
  if (!sections.length && document.body.dataset.unit) sections.push(document.body);
  const outlines = [];
  const lessons = [];

  for (const section of sections) {
    const details = section.querySelector(".side details");
    if (!details) continue;
    const links = new Map(Array.from(details.querySelectorAll("a[data-goto]"),
      link => [link.dataset.goto, link]));
    let sectionStart = section.querySelector(".unit-band");
    for (const article of section.querySelectorAll(".desk > article.lesson[id]")) {
      const link = links.get(article.id);
      if (!link) continue;
      lessons.push({ startElement: sectionStart || article, link, details });
      sectionStart = null;
    }
    outlines.push(details);
  }

  if (lessons.length) {
    document.documentElement.classList.add("has-outline");
    const narrow = matchMedia("(max-width: 740px)");
    const setMenuSize = () => {
      for (const details of outlines) details.open = !narrow.matches;
    };
    setMenuSize();
    narrow.addEventListener("change", setMenuSize);

    let currentLink = null;
    function markCurrent({ details, link }) {
      if (currentLink === link) return;
      if (currentLink) currentLink.removeAttribute("aria-current");
      link.setAttribute("aria-current", "location");
      currentLink = link;

      // Keep long outlines legible using their own scrollbar.
      const nav = link.closest("nav");
      if (!details.open || !nav) return;
      const bounds = nav.getBoundingClientRect();
      const item = link.getBoundingClientRect();
      if (item.top < bounds.top) nav.scrollTop += item.top - bounds.top;
      else if (item.bottom > bounds.bottom) nav.scrollTop += item.bottom - bounds.bottom;
    }

    let anchorInset;
    function measureInset() {
      anchorInset = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 1;
    }
    function updateOutline() {
      // Ordered article positions allow even a long jump to need only a few layout reads.
      let start = 0;
      let end = lessons.length;
      while (start < end) {
        const mid = Math.floor((start + end) / 2);
        if (lessons[mid].startElement.getBoundingClientRect().top <= anchorInset + 48) start = mid + 1;
        else end = mid;
      }
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      markCurrent(lessons[atEnd ? lessons.length - 1 : Math.max(0, start - 1)]);
    }
    let scheduled = false;
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        updateOutline();
      });
    }
    for (const details of outlines) {
      details.addEventListener("click", event => {
        if (narrow.matches && event.target.closest("a[data-goto]")) details.open = false;
      });
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", () => { measureInset(); scheduleUpdate(); });
    window.addEventListener("pageshow", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    measureInset();
    scheduleUpdate();
  }

  const dialog = document.querySelector("#finder");
  const query = document.querySelector("#lookup");
  const matches = document.querySelector("#matches");
  const launch = document.querySelector("[data-search-open]");
  if (!dialog || typeof dialog.showModal !== "function" || !query || !matches || !launch) return;
  launch.hidden = false;

  function search() {
    const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    matches.replaceChildren();
    if (!terms.length) return;
    const results = [];
    for (const [part, name, url, body] of window.lessonIndex || []) {
      const title = (part + " " + name).toLowerCase();
      const content = title + " " + body.toLowerCase();
      if (terms.every(term => content.includes(term))) {
        const score = terms.reduce((total, term) => total + (title.includes(term) ? 5 : 1), 0);
        results.push({ part, name, url, score });
      }
    }
    results.sort((a, b) => b.score - a.score);
    if (!results.length) {
      matches.textContent = "没有找到匹配的小课。可试试中英文术语，例如「梯度」或「attention」。";
    }
    for (const { part, name, url } of results.slice(0, 18)) {
      const link = document.createElement("a");
      const label = document.createElement("small");
      link.href = url;
      link.textContent = name;
      label.textContent = part;
      link.append(label);
      link.addEventListener("click", () => dialog.close());
      matches.append(link);
    }
  }
  function openSearch() {
    if (!dialog.open) dialog.showModal();
    query.focus();
    query.select();
    search();
  }
  launch.addEventListener("click", openSearch);
  query.addEventListener("input", search);
  document.addEventListener("keydown", event => {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;
    event.preventDefault();
    openSearch();
  });
})();
