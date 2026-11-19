"use strict";
(() => {
  const one=(s,root=document)=>root.querySelector(s), all=(s,root=document)=>[...root.querySelectorAll(s)];
  const online=location.protocol!=="file:";
  if(!online)all("[data-online],[data-download]").forEach(x=>x.hidden=true);
  const unit=document.body.dataset.unit;
  if(!unit){
    const legacy=location.hash.match(/^#read\/l(\d\d)(?:\/|$)/);
    const ids=["overview","overview","syscalls","syscalls","syscalls","filesystem","devices","cpu","cpu","memory","memory","memory","memory","threads","sync","sync"];
    if(legacy&&ids[Number(legacy[1])])location.replace(ids[Number(legacy[1])]+".html");
    const aliases={"#read/start":"overview.html","#read/tutorials":"index.html#labs","#lab/0":"cpu.html#workbench","#lab/1":"memory.html#workbench","#lab/2":"threads.html#workbench","#lab/3":"filesystem.html#workbench","#lab/4":"memory.html#workbench","#read/route":"index.html#catalog","#lab":"index.html#labs","#index":"index.html#catalog","#resources":"index.html#download"};
    if(aliases[location.hash])location.replace(aliases[location.hash]);
  }
  for(const trace of all("[data-trace]")){
    const frames=all(".frame",trace),tools=one(".trace-tools",trace);tools.hidden=false;
    const prev=one("[data-prev]",trace),next=one("[data-next]",trace),toggle=one("[data-all]",trace),position=one("[data-position]",trace);
    let n=0,expanded=false;position.setAttribute("aria-live","polite");
    function draw(){frames.forEach((f,i)=>f.hidden=!expanded&&i!==n);position.textContent=expanded?frames.length+" 个状态":"状态 "+(n+1)+" / "+frames.length;prev.disabled=expanded||n===0;next.disabled=expanded||n===frames.length-1;toggle.textContent=expanded?"逐步阅读":"展开全部";toggle.setAttribute("aria-expanded",String(expanded));}
    prev.onclick=()=>{n--;draw();};next.onclick=()=>{n++;draw();};toggle.onclick=()=>{expanded=!expanded;draw();};draw();
  }
  for(const form of all(".quiz")){
    const correct=Number(form.dataset.answer),buttons=all("[data-option]",form),feedback=one(".feedback",form);
    buttons.forEach((b,i)=>b.onclick=()=>{buttons.forEach(x=>{x.classList.remove("correct","incorrect");x.setAttribute("aria-pressed","false");});b.classList.add(i===correct?"correct":"incorrect");b.setAttribute("aria-pressed","true");feedback.textContent=i===correct?"答对了。对照下面的推导，检查你的理由。":"再看一次图中的初始条件。可以重选，也可以展开推导。";if(i===correct)one("details",form).open=true;});
  }
  if(unit){
    document.documentElement.classList.add("js-book");
    const lessons=all("[data-lesson]"),links=all("[data-goto]"),side=one(".side details"),narrow=matchMedia("(max-width:740px)");
    if(narrow.matches)side.open=false;
    function show(scroll){
      let key;try{key=decodeURIComponent(location.hash.slice(1));}catch{key="";}
      const skip=key==="main";
      const current=(skip?lessons.find(l=>!l.hidden):lessons.find(l=>l.id===key))||lessons[0];lessons.forEach(l=>l.hidden=l!==current);
      links.forEach(a=>{if(a.dataset.goto===current.id)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
      if(narrow.matches)side.open=false;
      document.title=(one("h1,h2",current)?.textContent||"操作系统图解课堂")+" · CSCI3150";
      if(skip){const main=one("#main");main.tabIndex=-1;main.focus();}
      else if(scroll){current.tabIndex=-1;current.focus({preventScroll:true});window.scrollTo(0,0);}
      window.dispatchEvent(new Event("lessonchange"));
    }
    window.addEventListener("hashchange",()=>show(true));show(false);
    if(location.hash)requestAnimationFrame(()=>window.scrollTo(0,0));
  }
  const dlg=one("#finder"),q=one("#lookup"),matches=one("#matches"),launch=one("[data-search-open]");
  if(dlg&&typeof dlg.showModal==="function"){
    launch.hidden=false;
    function search(){const terms=q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      matches.replaceChildren();if(!terms.length)return;
      const found=(window.lessonIndex||[]).map(([part,name,url,body])=>{const title=(part+" "+name).toLowerCase(), hay=title+" "+body.toLowerCase();return {part,name,url,score:terms.every(t=>hay.includes(t))?terms.reduce((s,t)=>s+(title.includes(t)?5:1),0):0};}).filter(x=>x.score).sort((a,b)=>b.score-a.score).slice(0,18);
      if(!found.length){matches.textContent="没有找到匹配的小课。可试试中英文术语，例如「页表」或「TLB」。";return;}
      found.forEach(({part,name,url})=>{const a=document.createElement("a"),small=document.createElement("small");a.href=url;a.textContent=name;small.textContent=part;a.append(small);a.onclick=()=>dlg.close();matches.append(a);});
    }
    function open(){if(!dlg.open)dlg.showModal();q.focus();q.select();search();}
    launch.onclick=open;q.oninput=search;
    document.addEventListener("keydown",e=>{if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!/input|textarea|select/i.test(e.target.tagName)){e.preventDefault();open();}});
  }
})();
