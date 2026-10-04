// Inlined before styles so the first paint uses the saved Study preference.
(() => {
 const key = 'vince-study-theme';
 const media = matchMedia('(prefers-color-scheme: dark)');
 const valid = value => ['light', 'dark', 'system'].includes(value) ? value : 'system';
 let preference = 'system';
 try { preference = valid(localStorage.getItem(key)); } catch {}
 const apply = () => {
  document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  const select = document.querySelector('#study-theme');
  if (select) select.value = preference;
 };
 apply();
 media.addEventListener('change', apply);
 addEventListener('storage', event => {
  if (event.key === key || event.key === null) {
   preference = valid(event.newValue);
   apply();
  }
 });
 document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('#study-theme');
  if (!select) return;
  apply();
  select.addEventListener('change', () => {
   preference = valid(select.value);
   try { localStorage.setItem(key, preference); } catch {}
   apply();
  });
 });
})();
