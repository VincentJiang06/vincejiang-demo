'use strict';
for (const bench of document.querySelectorAll('.bench')) {
  const switches=bench.querySelector('.switches');
  const buttons=[...switches.querySelectorAll('[data-pick]')];
  const trials=[...bench.querySelectorAll('.trial')];
  function select(key) {
    for (const trial of trials) trial.hidden=trial.dataset.trial!==key;
    for (const button of buttons) button.setAttribute('aria-pressed',String(button.dataset.pick===key));
  }
  switches.addEventListener('click',event=>{
    const button=event.target.closest('button[data-pick]');
    if(button)select(button.dataset.pick);
  });
  select(buttons[0].dataset.pick);
  switches.hidden=false;
}
const zoom=document.querySelector('#magnifier');
if(zoom && typeof zoom.showModal==='function') {
  for(const button of document.querySelectorAll('.plot-panel .expand')) {
    button.hidden=false;
    button.addEventListener('click',()=>{
      const panel=button.closest('figure');
      zoom.querySelector('form strong').textContent=panel.querySelector('h4').textContent;
      zoom.querySelector('.zoom-body').replaceChildren(panel.querySelector('svg').cloneNode(true),panel.querySelector('figcaption').cloneNode(true));
      zoom.showModal();
    });
  }
  zoom.addEventListener('click',event=>{
    if(event.target===zoom){
      const r=zoom.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)zoom.close();
    }
  });
}
