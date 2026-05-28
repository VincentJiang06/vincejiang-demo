// ---- data (虚构演示数据) ----
const MACS = [
  { id:'air13', name:'MacBook Air 13"', tag:'最便携', price:9499, uses:['study','dev'],
    perf:42, specs:['M4 · 8 核','16GB 统一内存','超轻 1.24kg','无风扇静音'] },
  { id:'air15', name:'MacBook Air 15"', tag:'大屏便携', price:11499, uses:['study','creative'],
    perf:46, specs:['M4 · 10 核','24GB 统一内存','15.3" 大屏','全天续航'] },
  { id:'mini', name:'Mac mini', tag:'性价比', price:7999, uses:['study','dev'],
    perf:55, specs:['M4 Pro 可选','桌面常驻','接口丰富','需自备显示器'] },
  { id:'mbp14', name:'MacBook Pro 14"', tag:'开发首选', price:16999, uses:['dev','creative'],
    perf:78, specs:['M4 Pro · 12 核','36GB 内存','XDR 屏','强散热'] },
  { id:'imac', name:'iMac 24"', tag:'一体机', price:13499, uses:['study','creative'],
    perf:48, specs:['M4 · 10 核','4.5K 屏','一体设计','多彩配色'] },
  { id:'studio', name:'Mac Studio', tag:'桌面专业', price:32999, uses:['creative','pro'],
    perf:95, specs:['M4 Max','64GB+ 内存','多路 8K','极致散热'] },
];
const USE_LABEL = {study:'学习/办公', dev:'编程开发', creative:'剪辑/设计', pro:'专业生产力'};

// ---- render cards ----
const cardsEl = document.getElementById('cards');
cardsEl.innerHTML = MACS.map(m => `
  <article class="mac-card" data-id="${m.id}" data-perf="${m.perf}" data-price="${m.price}" data-uses="${m.uses.join(',')}">
    <span class="tag">${m.tag}</span>
    <h3>${m.name}</h3>
    <div class="price">¥${m.price.toLocaleString()}</div>
    <ul>${m.specs.map(s=>`<li>· ${s}</li>`).join('')}</ul>
  </article>`).join('');

// ---- render spec bars ----
const barsEl = document.getElementById('bars');
barsEl.innerHTML = [...MACS].sort((a,b)=>b.perf-a.perf).map(m => `
  <div class="bar-row">
    <span>${m.name}</span>
    <div class="bar-track"><div class="bar-fill" data-w="${m.perf}"></div></div>
    <span class="val">${m.perf}</span>
  </div>`).join('');

// ---- render FAQ ----
const FAQ = [
  ['统一内存买多大?', '日常 16GB 够用;编程/多开建议 24–36GB;4K 剪辑与多任务上 36GB 起;3D / 大模型本地推理直接 64GB+。'],
  ['Air 还是 Pro?', '只要不长时间高负载,Air 的 M 芯片足够且无风扇更安静;持续编译、长时间渲染选 Pro,散热让它能长时间满血。'],
  ['台式还是笔记本?', '固定工位预算有限选 Mac mini 自配屏;要颜值一体机选 iMac;追求桌面极限性能选 Mac Studio。'],
  ['二手 / 教育优惠?', '本 demo 仅演示选购逻辑,价格为虚构示例;真实购买请以官网教育商店与正规渠道为准。'],
];
const accEl = document.getElementById('acc');
accEl.innerHTML = FAQ.map(([q,a])=>`
  <div class="acc-item">
    <button class="acc-q">${q}<span class="plus">+</span></button>
    <div class="acc-a"><p>${a}</p></div>
  </div>`).join('');
accEl.querySelectorAll('.acc-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item = btn.parentElement, a = item.querySelector('.acc-a');
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
  });
});

// ---- scroll reveal (IntersectionObserver) ----
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add('in');
    if(e.target.classList.contains('bars')){
      e.target.querySelectorAll('.bar-fill').forEach(f=>{ f.style.width = f.dataset.w + '%'; });
    }
    io.unobserve(e.target);
  });
},{threshold:.18});
document.querySelectorAll('.reveal, .bars').forEach(el=>io.observe(el));

// ---- nav shadow on scroll ----
const nav = document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled', scrollY>40));

// ---- cursor glow ----
const glow = document.querySelector('.cursor-glow');
addEventListener('mousemove',e=>{ glow.style.opacity=1; glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px'; });
addEventListener('mouseleave',()=>glow.style.opacity=0);

// ---- 3D tilt on cards ----
cardsEl.querySelectorAll('.mac-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateY(-4px)`;
    card.style.boxShadow='0 24px 60px rgba(0,0,0,.5)';
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; card.style.boxShadow=''; });
});

// ---- chooser logic ----
let activeUse=null;
const budget=document.getElementById('budget'), budgetOut=document.getElementById('budgetOut');
const reco=document.getElementById('reco'), recoName=document.getElementById('recoName'), recoWhy=document.getElementById('recoWhy');

function fmt(n){return '¥'+Number(n).toLocaleString()}
budget.addEventListener('input',()=>{ budgetOut.textContent=fmt(budget.value); update(); });

document.querySelectorAll('.use').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.use').forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');
    activeUse=b.dataset.use; update();
  });
});

function update(){
  const cap=Number(budget.value);
  const cards=[...cardsEl.querySelectorAll('.mac-card')];
  // dim cards that don't fit use/budget
  let pool=[];
  cards.forEach(c=>{
    const uses=c.dataset.uses.split(',');
    const price=Number(c.dataset.price);
    const fit=(!activeUse||uses.includes(activeUse)) && price<=cap;
    c.classList.toggle('dim',!fit);
    if(fit) pool.push(c);
  });
  if(!activeUse){ reco.hidden=true; return; }
  // pick best: highest perf within budget & use; fallback cheapest matching use
  let best=null;
  pool.forEach(c=>{ if(!best||Number(c.dataset.perf)>Number(best.dataset.perf)) best=c; });
  reco.hidden=false;
  if(best){
    const m=MACS.find(x=>x.id===best.dataset.id);
    recoName.textContent=m.name+' — '+fmt(m.price);
    recoWhy.textContent=`针对「${USE_LABEL[activeUse]}」且预算 ≤ ${fmt(cap)},这是性能最强的合适之选(${m.specs[0]})。`;
    best.scrollIntoView({behavior:'smooth',block:'center'});
  }else{
    recoName.textContent='没有完全匹配的型号';
    recoWhy.textContent=`「${USE_LABEL[activeUse]}」在 ${fmt(cap)} 预算内没有理想选择,可适当提高预算或更换用途。`;
  }
}
