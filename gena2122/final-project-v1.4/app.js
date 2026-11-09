'use strict';
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=0,worldData=null,statesData=null,mapGlobal=false,mapMode='production',mapSelected=null,changeTimer=null,mapLoadState='loading',artworkRequest=0;
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motionPreference.matches;
motionPreference.addEventListener('change',e=>{reduced=e.matches});
const compact=window.matchMedia('(max-width:760px)');
const contextRail=document.querySelector('.context-rail'),metric=document.querySelector('.metric');
function placeContext(){
 if(compact.matches){$('mobile-context').append(contextRail);$('mobile-metric').append(metric)}
 else {document.querySelector('.atlas').append(contextRail);contextRail.append(metric)}
 measureContext();
}
function measureContext(){
 const topBar=innerWidth<=1150?document.querySelector('.timeline-rail').getBoundingClientRect().height:0;
 document.documentElement.style.setProperty('--header-offset',`${topBar+20}px`);
 const mapHeadingTop=document.querySelector('.geography').offsetTop;
 contextRail.style.setProperty('--context-top',`${Math.max(topBar+20-mapHeadingTop,Math.min(topBar,innerHeight-contextRail.offsetHeight))}px`);
}
compact.addEventListener('change',placeContext);
window.addEventListener('resize',()=>{measureContext();if(mapLoadState==='ready')renderMap()});
new ResizeObserver(measureContext).observe(contextRail);
placeContext();
const chapterIds=CHAPTERS.map(c=>c.id);
$('timeline').innerHTML=CHAPTERS.map((c,i)=>`<a class="time-link" href="#${c.id}" data-index="${i}"><span class="date">${escapeHTML(c.displayYear||c.year)}</span><span class="name">${escapeHTML(c.nav)}</span></a>`).join('');
for(const [id,key] of [['intro-text','intro'],['closing-text','closing']])$(id).textContent=SITE_COPY[key];
document.querySelector('.map-footnote').textContent=SITE_COPY.mapFootnote;
async function setView(view){
 const request=++artworkRequest,separated=view==='parts',c=CHAPTERS[active];
 if(separated&&!$('diagram').hasChildNodes())$('diagram').innerHTML=photoDiagramFor(c.id);
 $('object-stage').dataset.view=view;$('object-stage').setAttribute('aria-busy','true');
 $('object-image').hidden=true;$('diagram').hidden=true;
 $('artwork-status').hidden=false;$('artwork-status').textContent='Loading illustration…';
 $('view-whole').setAttribute('aria-pressed',String(!separated));$('view-parts').setAttribute('aria-pressed',String(separated));
 $('stage-note').textContent=SITE_COPY.wholeNote;
 $('figure-note').textContent=SITE_COPY[c.id==='nail'||c.id==='cloth'?'materialNote':'componentNote'];
 $('figure-note').hidden=!separated;
 try{
  const images=separated?[...$('diagram').querySelectorAll('img')]:[$('object-image')];
  await Promise.all(images.map(image=>image.decode()));
  if(request!==artworkRequest)return;
  $('object-image').hidden=separated;$('diagram').hidden=!separated;$('artwork-status').hidden=true;
 }catch(error){
  if(request!==artworkRequest)return;
  $('artwork-status').textContent='The illustration could not load. Reload the page to retry.';
 }
 if(request===artworkRequest)$('object-stage').setAttribute('aria-busy','false');
}
function updateMetric(c){
 const value=c.share;
 $('metric-value').innerHTML=value!==null?`<div class="metric-number">${value.toFixed(1)}<small>%</small></div>`:`<div class="metric-unavailable">${c.id==='nail'?'Before the republic':'Outside this series'}</div>`;
 $('metric-definition').textContent=value!==null?`${c.year} · Manufacturing share of U.S. GDP`:(c.id==='nail'?'No United States GDP denominator in 1650.':'The selected Federal Reserve historical table begins in 1950.');
 $('metric-chart').innerHTML=value!==null?`<div class="share-bar" role="img" aria-label="Manufacturing ${value}% of GDP; other industries ${(100-value).toFixed(1)}%"><div class="manufacturing" style="width:${value}%"></div><div class="rest"></div></div>`:'<div class="no-data-line">Not zero. Not estimated.</div>';
 $('metric-explainer').textContent=SITE_COPY[value!==null?'metricAvailable':'metricMissing'];
}
function renderMap(){
 const c=CHAPTERS[active],config=mapConfigFor(c.id,mapMode),production=mapMode==='production';
 $('map-production').setAttribute('aria-pressed',String(production));$('map-markets').setAttribute('aria-pressed',String(!production));
 const flow=production?FLOW_CASES[c.id]:null;
 $('map-stages').hidden=!production;
 $('map-stages').innerHTML=flow?flow.stages.map(s=>`<li><span class="flow-number">${escapeHTML(s.n)}</span><div><strong>${escapeHTML(s.place)}</strong><p>${escapeHTML(s.work)}</p></div></li>`).join(''):'';
 $('map-evidence').hidden=production;
 if($('map-locations').dataset.mode!==mapMode){$('map-locations').dataset.mode=mapMode;$('map-locations').open=!production}
 $('map-locations-heading').textContent=production?'Highlight individual places':'Documented markets & users';
 if(!production){
  const sources=new Map();
  for(const g of config.groups)for(const source of g.sources){
   if(!sources.has(source.url))sources.set(source.url,{...source,places:[]});
   sources.get(source.url).places.push(g.name);
  }
  $('map-source-list').innerHTML=[...sources.values()].map(s=>`<div><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.title)} ↗</a><p>${escapeHTML([...new Set(s.places)].join(' · '))}</p></div>`).join('');
 }
 if(mapLoadState!=='ready'){
  $('map').replaceChildren();$('map-zoom').hidden=true;$('map-locations').open=true;
  document.querySelector('.map-instruction').hidden=true;document.querySelector('.map-footnote').hidden=true;
  $('map-legend').textContent=config.title;
  $('map-caption').textContent=mapLoadState==='error'?'Map unavailable. Reload to retry; documented places and roles remain listed here.':'Loading map… Documented places and roles are listed below.';
  $('location-list').innerHTML=config.groups.map(g=>`<li class="location-fallback"><strong>${escapeHTML(g.name)}</strong><p>${escapeHTML(g.role)}</p></li>`).join('');
  return;
 }
 const map=renderGeography(c,worldData,statesData,mapGlobal,mapSelected,mapMode,Math.max(1,512/Math.max(1,$('map').clientWidth)));
 $('map').innerHTML=map.svg;$('map-zoom').hidden=!map.canZoom;$('map-zoom').setAttribute('aria-pressed',String(mapGlobal));$('map-zoom').textContent=mapGlobal?'Regional focus':'World context';
 $('map-caption').textContent=map.note;$('map-legend').textContent=map.title;
 document.querySelector('.map-footnote').hidden=map.locatorOnly;
 document.querySelector('.map-footnote').innerHTML=production?'<span class="arrow-key solid" aria-hidden="true">⟶</span> Solid: material connection. <span class="arrow-key dashed" aria-hidden="true">⇢</span> Dashed: role relationship. Numbers match the stages below; thin gray dotted lines point to labels. Modern borders orient the view.':'Colors distinguish selected markets or uses, not sales volumes. City dots mark observations; shaded regions and countries retain broader evidence. Modern borders orient the view.';
 document.querySelector('.map-instruction').hidden=true;document.querySelector('.map-how').hidden=map.locatorOnly;
 $('location-list').innerHTML=map.groups.map(g=>map.locatorOnly?`<li class="location-fallback"><strong>${escapeHTML(g.name)}</strong><p>${escapeHTML(g.role)}</p></li>`:`<li><button type="button" class="region-card ${mapSelected===g.key?'selected':''}" style="--region-color:${MAP_COLORS[g.color]}" data-group="${g.key}" aria-pressed="${mapSelected===g.key}"><span>${g.stage?`<b class="region-stage">${escapeHTML(g.stage)}</b>`:''}${escapeHTML(g.name)}</span>${g.evidence?`<em class="evidence-type">${escapeHTML(g.evidence)}</em>`:''}<small>${escapeHTML(g.role)}</small></button></li>`).join('');
 $('location-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.group;mapSelected=mapSelected===key?null:key;renderMap();$('location-list').querySelector(`[data-group="${key}"]`).focus({preventScroll:true})}));
}
function selectChapter(i,initial=false){
 if(i<0||i>=CHAPTERS.length)return;clearTimeout(changeTimer);
 const apply=()=>{
  active=i;mapSelected=null;mapGlobal=false;mapMode='production';$('map-evidence').open=false;$('map-locations').open=false;const c=CHAPTERS[i];document.body.dataset.era=c.id;document.documentElement.dataset.era=c.id;
  showCase();
  $('chapter-index').textContent=`${String(i+1).padStart(2,'0')} / 06`;$('chapter-period').textContent=c.periodLabel;
  $('chapter-title').innerHTML=c.headline;$('chapter-deck').textContent=c.deck;$('object-name').textContent=c.specimen;
  $('object-image').src=c.wholeImage;$('object-image').alt=c.imageAlt;$('diagram').replaceChildren();
  $('question').textContent=c.question;$('article').innerHTML=c.englishSummary.split(/\n\n+/).map(p=>`<p>${escapeHTML(p)}</p>`).join('');
  $('course-connection').textContent=c.courseConnection;$('relationship-label').textContent=c.relationship.label;$('relationship-text').textContent=c.relationship.text;
  $('source-list').innerHTML=c.sources.map(s=>`<li><span class="source-type">${escapeHTML(s.type)} · ${escapeHTML(s.date||'n.d.')}</span><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.title)}</a><p class="source-note">${escapeHTML(s.note)}</p></li>`).join('');
  $('era-year').textContent=c.displayYear||c.year;$('era-number').textContent=String(i+1).padStart(2,'0');$('era-country').textContent=c.id==='nail'?'MASSACHUSETTS BAY COLONY':c.id==='phone'?'UNITED STATES · CHINA':'THE UNITED STATES';$('era-title').textContent=c.eraTitle;$('era-summary').textContent=c.eraSummary;
  updateMetric(c);setView('whole');renderMap();
  syncNavigation(c.id);
  $('previous').disabled=false;$('previous').textContent=i?`← ${CHAPTERS[i-1].nav}`:'← Overview';$('next').disabled=false;$('next').textContent=i<CHAPTERS.length-1?`Next: ${CHAPTERS[i+1].nav} →`:'Read the conclusion →';
  document.title=`${c.nav} (${c.displayYear||c.year}) — Made Across America`;$('announcement').textContent=`Chapter ${i+1}: ${c.nav}, ${c.displayYear||c.year}`;document.body.classList.remove('changing');
  if(!initial)$('chapter-title').focus({preventScroll:true});
 };
 apply();
}
function go(i){location.hash=i<0?'overview':i>=CHAPTERS.length?'conclusion':CHAPTERS[i].id;}
function syncNavigation(id){document.querySelectorAll('.time-link,.bookend-nav a').forEach(a=>{const selected=a.hash==='#'+id;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function showCase(){document.querySelector('.atlas').dataset.page='case';$('case-view').hidden=false;$('overview-view').hidden=true;$('conclusion-view').hidden=true;contextRail.hidden=false;}
function showBookend(id,initial=false){
 document.body.dataset.era=id;document.documentElement.dataset.era=id;document.querySelector('.atlas').dataset.page=id;
 $('case-view').hidden=true;$('overview-view').hidden=id!=='overview';$('conclusion-view').hidden=id!=='conclusion';contextRail.hidden=true;
 if(id==='overview'&&!$('object-index').hasChildNodes())$('object-index').innerHTML=CHAPTERS.map(c=>`<a class="index-object" href="#${c.id}" data-object="${c.id}"><span class="index-year">${escapeHTML(c.displayYear||c.year)}</span><img src="${c.wholeImage}" alt="${escapeHTML(c.imageAlt)}" loading="eager" decoding="async"><span class="index-name">${escapeHTML(c.nav)} <span aria-hidden="true">↗</span></span><span class="index-period">${escapeHTML(c.periodLabel)}</span></a>`).join('');
 if(id==='overview'){$('object-index').setAttribute('aria-busy','true');Promise.allSettled([...$('object-index').querySelectorAll('img')].map(image=>image.decode())).then(()=>$('object-index').setAttribute('aria-busy','false'))}
 if(id==='conclusion'&&!$('comparison-rows').hasChildNodes())$('comparison-rows').innerHTML=CHAPTERS.map(c=>`<div class="comparison-row" role="row" data-object="${c.id}"><a role="cell" href="#${c.id}"><span class="comparison-year">${escapeHTML(c.displayYear||c.year)}</span>${escapeHTML(c.nav)} ↗</a><span role="cell" class="comparison-pattern">${escapeHTML(c.comparisonPattern)}</span><span role="cell" class="comparison-relationship">${escapeHTML(c.relationship.label)}</span></div>`).join('');
 syncNavigation(id);document.title=`${id==='overview'?'Overview':'Conclusion'} — Made Across America`;$('announcement').textContent=id==='overview'?'Exhibit overview':'Exhibit conclusion';
 if(!initial)$(id+'-title').focus({preventScroll:true});
}
function renderPage(initial=false){const id=location.hash.slice(1)||'overview',i=chapterIds.indexOf(id);if(i>=0)selectChapter(i,initial);else showBookend(id==='conclusion'?'conclusion':'overview',initial);}
function activeTitle(){const page=document.querySelector('.atlas').dataset.page;return $(page==='case'?'chapter-title':page+'-title');}
window.addEventListener('hashchange',()=>{renderPage();window.scrollTo({top:0,behavior:'instant'})});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();$('exhibit').focus({preventScroll:true});$('exhibit').scrollIntoView({behavior:'instant'})});
document.querySelectorAll('.time-link,.wordmark,.bookend-nav a').forEach(a=>a.addEventListener('click',()=>{if(a.hash===location.hash){activeTitle().focus({preventScroll:true});window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})}}));
$('previous').addEventListener('click',()=>go(active-1));$('next').addEventListener('click',()=>go(active+1));
$('view-whole').addEventListener('click',()=>setView('whole'));$('view-parts').addEventListener('click',()=>setView('parts'));
for(const mode of ['production','markets'])$('map-'+mode).addEventListener('click',()=>{mapMode=mode;mapGlobal=false;mapSelected=null;$('map-evidence').open=false;renderMap()});
$('map-zoom').addEventListener('click',()=>{mapGlobal=!mapGlobal;mapSelected=null;renderMap()});
$('jump-map').addEventListener('click',()=>{$('geography').scrollIntoView({behavior:reduced?'instant':'smooth'});$('geography').focus({preventScroll:true})});
$('jump-reading').addEventListener('click',()=>{$('question').scrollIntoView({behavior:reduced?'instant':'smooth'});$('question').focus({preventScroll:true})});
renderPage(true);
Promise.all(['world.json','us-states.json'].map(f=>fetch('assets/'+f+'?v=1.4.2').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json()}))).then(([world,states])=>{worldData=world;statesData=states;mapLoadState='ready';renderMap()}).catch(()=>{mapLoadState='error';renderMap()});
