'use strict';
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=0,worldData=null,statesData=null,mapGlobal=false,mapSelected=null,changeTimer=null,mapLoadState='loading';
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
window.addEventListener('resize',measureContext);
new ResizeObserver(measureContext).observe(contextRail);
placeContext();
const chapterIds=CHAPTERS.map(c=>c.id);
$('timeline').innerHTML=CHAPTERS.map((c,i)=>`<a class="time-link" href="#${c.id}" data-index="${i}"><span class="date">${c.year}</span><span class="name">${escapeHTML(c.nav)}</span></a>`).join('');
for(const [id,key] of [['intro-text','intro'],['closing-text','closing'],['method-text','method'],['contribution-text','contribution']])$(id).textContent=SITE_COPY[key];
document.querySelector('.map-footnote').textContent=SITE_COPY.mapFootnote;
function setView(view){
 const separated=view==='parts',c=CHAPTERS[active];
 if(separated&&!$('diagram').hasChildNodes())$('diagram').innerHTML=photoDiagramFor(c.id);
 $('object-stage').dataset.view=view;$('object-image').hidden=separated;$('diagram').hidden=!separated;
 $('view-whole').setAttribute('aria-pressed',String(!separated));$('view-parts').setAttribute('aria-pressed',String(separated));
 $('stage-note').textContent=SITE_COPY.wholeNote;
 $('figure-note').textContent=SITE_COPY[c.id==='nail'||c.id==='cloth'?'materialNote':'componentNote'];
 $('figure-note').hidden=!separated;
}
function updateMetric(c){
 const value=c.share;
 $('metric-value').innerHTML=value!==null?`<div class="metric-number">${value.toFixed(1)}<small>%</small></div>`:`<div class="metric-unavailable">${c.id==='nail'?'Before the republic':'Outside this series'}</div>`;
 $('metric-definition').textContent=value!==null?`${c.year} · Manufacturing share of U.S. GDP`:(c.id==='nail'?'No United States GDP denominator in 1650.':'The selected Federal Reserve historical table begins in 1950.');
 $('metric-chart').innerHTML=value!==null?`<div class="share-bar" role="img" aria-label="Manufacturing ${value}% of GDP; other industries ${(100-value).toFixed(1)}%"><div class="manufacturing" style="width:${value}%"></div><div class="rest"></div></div>`:'<div class="no-data-line">Not zero. Not estimated.</div>';
 $('metric-explainer').textContent=SITE_COPY[value!==null?'metricAvailable':'metricMissing'];
}
function renderMap(){
 if(mapLoadState!=='ready'){
  const c=CHAPTERS[active];$('map').replaceChildren();$('map-zoom').hidden=true;
  document.querySelector('.map-instruction').hidden=true;document.querySelector('.map-footnote').hidden=true;
  $('map-legend').textContent=GEO_CASES[c.id].title;
  $('map-caption').textContent=mapLoadState==='error'?'Map unavailable. Reload the page to retry; documented locations remain listed above.':'Loading map… Documented locations are listed above.';
  $('location-list').innerHTML=GEO_CASES[c.id].groups.map(g=>`<li class="location-fallback"><strong>${escapeHTML(g.name)}</strong><p>${escapeHTML(g.role)}</p></li>`).join('');
  return;
 }
 document.querySelector('.map-instruction').hidden=false;document.querySelector('.map-footnote').hidden=false;
 const c=CHAPTERS[active],map=renderGeography(c,worldData,statesData,mapGlobal,mapSelected);
 $('map').innerHTML=map.svg;$('map-zoom').hidden=c.id==='phone';$('map-zoom').textContent=mapGlobal?'Regional focus':'World context';
 $('map-caption').textContent=map.note;$('map-legend').textContent=map.title;
 const locatorOnly=mapGlobal&&c.id!=='phone';
 document.querySelector('.map-instruction').hidden=locatorOnly;
 $('location-list').innerHTML=map.groups.map(g=>`<li><button type="button" class="region-card ${mapSelected===g.key?'selected':''}" style="--region-color:${MAP_COLORS[g.color]}" data-group="${g.key}" aria-pressed="${mapSelected===g.key}"><span>${escapeHTML(g.name)}</span><small>${escapeHTML(g.role)}</small></button></li>`).join('');
 if(locatorOnly)$('location-list').innerHTML=map.groups.map(g=>`<li class="location-fallback"><strong>${escapeHTML(g.name)}</strong><p>${escapeHTML(g.role)}</p></li>`).join('');
 $('location-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.group;mapSelected=mapSelected===key?null:key;renderMap();$('location-list').querySelector(`[data-group="${key}"]`).focus({preventScroll:true})}));
}
function selectChapter(i,initial=false){
 if(i<0||i>=CHAPTERS.length)return;clearTimeout(changeTimer);
 const apply=()=>{
  active=i;mapSelected=null;mapGlobal=false;const c=CHAPTERS[i];document.body.dataset.era=c.id;document.documentElement.dataset.era=c.id;
  document.querySelector('.exhibit-argument').open=i===0;
  $('chapter-index').textContent=`${String(i+1).padStart(2,'0')} / 06`;$('chapter-period').textContent=c.periodLabel;
  $('chapter-title').innerHTML=c.headline;$('chapter-deck').textContent=c.deck;$('object-name').textContent=c.specimen;
  $('object-image').src=c.wholeImage;$('object-image').alt=c.imageAlt;$('diagram').replaceChildren();
  $('question').textContent=c.question;$('article').innerHTML=c.englishSummary.split(/\n\n+/).map(p=>`<p>${escapeHTML(p)}</p>`).join('');
  $('course-connection').textContent=c.courseConnection;$('relationship-label').textContent=c.relationship.label;$('relationship-text').textContent=c.relationship.text;
  $('closing-argument').hidden=c.id!=='phone';
  $('source-list').innerHTML=c.sources.map(s=>`<li><span class="source-type">${escapeHTML(s.type)} · ${escapeHTML(s.date||'n.d.')}</span><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.title)}</a><p class="source-note">${escapeHTML(s.note)}</p></li>`).join('');
  $('era-year').textContent=c.year;$('era-number').textContent=String(i+1).padStart(2,'0');$('era-country').textContent=c.id==='nail'?'MASSACHUSETTS BAY COLONY':c.id==='phone'?'UNITED STATES · CHINA':'THE UNITED STATES';$('era-title').textContent=c.eraTitle;$('era-summary').textContent=c.eraSummary;
  updateMetric(c);setView('whole');renderMap();
  document.querySelectorAll('.time-link').forEach((a,n)=>{a.classList.toggle('active',n===i);if(n===i)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
  $('previous').disabled=i===0;$('previous').textContent=i?`← ${CHAPTERS[i-1].nav}`:'Beginning of the exhibit';$('next').disabled=false;$('next').textContent=i<CHAPTERS.length-1?`Next: ${CHAPTERS[i+1].nav} →`:'Return to the first object ↗';
  document.title=`${c.nav} (${c.year}) — Made Across America`;$('announcement').textContent=`Chapter ${i+1}: ${c.nav}, ${c.year}`;document.body.classList.remove('changing');
  if(!initial)$('chapter-title').focus({preventScroll:true});
 };
 apply();
}
function go(i){if(i>=0&&i<CHAPTERS.length)location.hash=CHAPTERS[i].id;}
window.addEventListener('hashchange',()=>{const i=chapterIds.indexOf(location.hash.slice(1));if(i>=0){selectChapter(i);window.scrollTo({top:0,behavior:'instant'})}});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();$('exhibit').focus({preventScroll:true});$('exhibit').scrollIntoView({behavior:'instant'})});
document.querySelectorAll('.time-link,.wordmark').forEach(a=>a.addEventListener('click',()=>{if(a.hash===location.hash){$('chapter-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})}}));
$('previous').addEventListener('click',()=>go(active-1));$('next').addEventListener('click',()=>go(active===CHAPTERS.length-1?0:active+1));
$('view-whole').addEventListener('click',()=>setView('whole'));$('view-parts').addEventListener('click',()=>setView('parts'));
$('map-zoom').addEventListener('click',()=>{mapGlobal=!mapGlobal;mapSelected=null;renderMap()});
$('jump-map').addEventListener('click',()=>{$('geography').scrollIntoView({behavior:reduced?'instant':'smooth'});$('geography').focus({preventScroll:true})});
$('jump-reading').addEventListener('click',()=>{$('question').scrollIntoView({behavior:reduced?'instant':'smooth'});$('question').focus({preventScroll:true})});
selectChapter(Math.max(0,chapterIds.indexOf(location.hash.slice(1))),true);
Promise.all(['world.json','us-states.json'].map(f=>fetch('assets/'+f).then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json()}))).then(([world,states])=>{worldData=world;statesData=states;mapLoadState='ready';renderMap()}).catch(()=>{mapLoadState='error';renderMap()});
