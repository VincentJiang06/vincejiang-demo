const mobile = matchMedia('(max-width: 760px)');
const compact = matchMedia('(max-width: 1200px)');
function navigationLayout() {
 document.querySelectorAll('.course-nav').forEach(el => el.open = !mobile.matches);
 document.querySelectorAll('.toc').forEach(el => el.open = !compact.matches);
}
navigationLayout();
mobile.addEventListener('change', navigationLayout);
compact.addEventListener('change', navigationLayout);
const search = document.querySelector('.search input');
search?.addEventListener('input', () => {
 const query = search.value.trim().toLocaleLowerCase();
 let count = 0;
 document.querySelectorAll('.note-list li').forEach(li => {
  li.hidden = !li.textContent.toLocaleLowerCase().includes(query);
  if (!li.hidden) count++;
 });
 document.querySelectorAll('.note-group').forEach(group => group.hidden = ![...group.querySelectorAll('li')].some(li => !li.hidden));
 document.querySelector('#filter-status').textContent = query ? `${count} 份匹配笔记${count ? '' : '，试试其他讲次或主题。'}` : '';
});
