// Study pages share this preference. Set it before the first style sheet is read.
(() => {
  const key = 'vince-study-theme';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const offline = location.protocol === 'file:';
  const explicit = value => value === 'light' || value === 'dark';
  let preference;
  try { preference = localStorage.getItem(key); } catch {}
  if (offline) {
    const carried = new URL(location.href).searchParams.get('theme');
    if (explicit(carried)) preference = carried;
  }
  function apply() {
    const dark = explicit(preference) ? preference === 'dark' : media.matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#000000' : '#ffffff';
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.hidden = false;
      toggle.querySelector('span').textContent = dark ? '切换白底' : '切换黑底';
    }
  }
  apply();
  media.addEventListener('change', apply);
  addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = event.newValue;
      apply();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-theme-toggle]');
    apply();
    toggle.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch {}
      if (offline) {
        const url = new URL(location.href);
        url.searchParams.set('theme', preference);
        try { history.replaceState(history.state, '', url); } catch {}
      }
      apply();
    });
    if (offline) {
      // file URLs can have separate storage per HTML file. Carry the choice across chapters.
      const carry = event => {
        const link = event.target.closest('a[href]');
        if (!link || !explicit(preference) || link.getAttribute('href').startsWith('#')) return;
        const target = new URL(link.href);
        if (target.protocol === 'file:' && target.pathname.endsWith('.html')) {
          target.searchParams.set('theme', preference);
          link.href = target.href;
        }
      };
      document.addEventListener('click', carry, true);
      document.addEventListener('auxclick', carry, true);
    }
  });
})();
