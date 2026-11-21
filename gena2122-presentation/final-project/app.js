'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let content, nodes, econ, networks, assets, current='national', sourceTrigger;
const state={cotton:1929,pipe:1913,cigarettes:1890,cottonMode:'spindles'};
const chapters=['national','cotton','pipe','cigarettes','institutions','conclusion','sources'];
const machineIds={cotton:'northrop',pipe:'delavaud',cigarettes:'bonsack'};
const machineState={northrop:{node:'northrop',expanded:false,compare:false},bonsack:{node:'bonsack',expanded:false,compare:false},delavaud:{node:'delavaud',expanded:false,compare:false}};
const events=[]; function emit(type,detail){events.push({type,...detail});if(events.length>100)events.shift();document.dispatchEvent(new CustomEvent('exhibit:'+type,{detail}));}
function fmt(r){if(!r||r.value===null)return 'Not listed separately';const v=r.value;if(r.unit==='percent')return (['centrifugally_cast_pipe_share','american_tobacco_constituent_cigarette_share'].includes(r.metric)?'≈ ':'')+v.toLocaleString('en-US',{maximumFractionDigits:1})+'%';if(r.unit==='ratio')return v.toFixed(2)+(r.region==='South_13'?' × US':' : 1');if(r.unit==='USD_nominal')return '$'+v.toLocaleString('en-US');return r.unit==='tons_as_reported'?'≈ '+v.toLocaleString('en-US')+' tons':v.toLocaleString('en-US');}
const row=(metric,year,region)=>econ.find(r=>r.metric===metric&&r.year===year&&(!region||r.region===region));
const source=id=>content.sources.find(s=>s.id===id);
function cite(ids,locator=''){return `<div class="citations">${ids.map(id=>`<button class="citation" data-source="${esc(id)}">${esc(source(id)?.author||id)}</button>`).join(' ')}${locator?` · ${esc(locator)}`:''}</div>`;}
function btn(label,attrs=''){return `<button ${attrs}>${label}</button>`;}
function sourcePage(n,machine=null){return `<div class="source-page"><img src="${esc(n.figure)}" width="${n.figure_width}" height="${n.figure_height}" alt="Original source page: ${esc(n.locator)}">${n.bbox?`<span class="source-highlight" style="left:${n.bbox[0]*100}%;top:${n.bbox[1]*100}%;width:${n.bbox[2]*100}%;height:${n.bbox[3]*100}%"></span>`:''}${machine?scanHotspots(n,machine):''}</div>`;}
function scanHotspots(n,id){const cs=nodes.filter(x=>x.parent===n.id&&x.figure===n.figure&&x.bbox);return `<div class="scan-hotspots" role="group" aria-label="Original-page component references"><svg class="scan-leaders" aria-hidden="true"></svg>${cs.map((x,i)=>`<button data-node="${x.id}" data-machine="${id}" data-x="${x.bbox[0]+x.bbox[2]/2}" data-y="${x.bbox[1]+x.bbox[3]/2}" style="left:${(x.bbox[0]+x.bbox[2]/2)*100}%;top:${(x.bbox[1]+x.bbox[3]/2)*100}%" aria-label="${i+1}. ${esc(x.name)}" title="${esc(x.name)}" tabindex="${i===0?0:-1}">${i+1}</button>`).join('')}</div>`;}
// Resolve scan-marker collisions in image pixels, including after responsive resizing.
function placeScanMarkers(){
 $$('.scan-hotspots').forEach(group=>{
  const {width:w,height:h}=group.getBoundingClientRect();if(w<48||h<48)return;
  const placed=[],lines=[];
  $$('button',group).forEach(button=>{
   const ax=+button.dataset.x*w,ay=+button.dataset.y*h;
   const candidates=[];
   for(let radius=0;radius<=Math.max(w,h);radius+=48){
    const count=radius?Math.max(8,Math.ceil(2*Math.PI*radius/48)):1;
    for(let i=0;i<count;i++){
     const angle=2*Math.PI*i/count,x=Math.max(24,Math.min(w-24,ax+Math.cos(angle)*radius)),y=Math.max(24,Math.min(h-24,ay+Math.sin(angle)*radius));
     if(placed.every(p=>Math.hypot(p.x-x,p.y-y)>=48))candidates.push({x,y,d:Math.hypot(x-ax,y-ay)});
    }
    if(candidates.length)break;
   }
   const point=candidates.sort((a,b)=>a.d-b.d)[0]||{x:24,y:24};placed.push(point);
   button.style.left=point.x+'px';button.style.top=point.y+'px';
   if(Math.hypot(point.x-ax,point.y-ay)>8)lines.push(`<line x1="${ax}" y1="${ay}" x2="${point.x}" y2="${point.y}"/>`);
  });
  const svg=$('svg',group);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.innerHTML=lines.join('');
 });
}
const scanObserver=new ResizeObserver(placeScanMarkers);
function observeScans(){scanObserver.disconnect();$$('.scan-hotspots').forEach(x=>scanObserver.observe(x));placeScanMarkers();}
function scholarHTML(section) {
 const cards = content.scholars.filter(card => card.section === section);
 if (!cards.length) return '';
 return `<aside class="scholars" aria-label="Scholarly comparisons"><h2>In conversation with</h2>${cards.map(card => `
  <article class="scholar"><h3>${esc(card.name)}</h3>
   <p class="work">${esc(card.work)} · ${esc(card.display_year || card.year || 'n.d.')}</p>
   <p>${esc(card.position)} ${esc(card.supports)}</p>
   <details><summary>Evidence &amp; interpretation</summary><p>${esc(card.challenges)} ${esc(card.response)}</p>
    ${cite(card.source_ids || [card.source_id],card.locator)}
   </details>
  </article>`).join('')}</aside>`;
}

function proseHTML(section) {
 const heading = section.id === 'national' ? 'h3' : 'h2';
 return `<div class="reading-grid"><div class="prose">${section.paragraphs.map(p => `
  <section><${heading}>${esc(p.heading)}</${heading}><p>${esc(p.text)}</p>${cite(p.citations)}</section>`).join('')}
 </div>${scholarHTML(section.id)}</div>${section.takeaway ? `<p class="takeaway">${esc(section.takeaway)}</p>` : ''}`;
}
function table(rows) {
 const ordered = [...rows].sort((a, b) => a.observation_year - b.observation_year);
 return `<div class="table-wrap"><table><thead><tr><th scope="col">Indicator / region</th><th scope="col">Observed</th><th scope="col">Value</th><th scope="col">Source</th></tr></thead><tbody>${ordered.map(r => `
  <tr><th scope="row">${esc(r.label_en)}<br>${esc(r.region.replaceAll('_',' '))}</th><td>${r.observation_year}</td><td class="numbers">${fmt(r)}</td>
  <td><button data-econ="${econ.indexOf(r)}" class="citation">${esc(r.locator)}</button></td></tr>`).join('')}</tbody></table></div>`;
}

const industryChoices = {
 cotton: [['spindles', 'Spindles · 1899–1929'], ['customers', 'Draper customers · 1905'], ['capital', 'Capital ties · 1881–1916']],
 pipe: [[1913, 'USCIP&F · 1913'], [1906, 'ACIPCO · 1905–06']],
 cigarettes: [[1890, 'Merger · 1890'], [1881, 'Recruitment · 1881']]
};
const spindleYears = [1899, 1909, 1919, 1929];

function evidenceChoices(choices, selected, label, section) {
 return `<div class="evidence-choices" role="group" aria-label="${label}">${choices.map(([value, title]) =>
  btn(esc(title), `${section ? `data-year="${value}" data-series="${section}"` : `data-cotton-mode="${value}"`} aria-pressed="${value === selected}" aria-controls="industry-evidence-panel"`)
 ).join('')}</div>`;
}

function industryMap(name, title, caption, evidence) {
 const height = name.startsWith('cotton-') ? 950 : name === 'textile-1905-capital' ? 1034 : 1000;
 const url = `maps/${name}.svg?v=20261121-text1`;
 return `<figure class="industry-map-figure">
  <img class="industry-map" src="${url}" width="1200" height="${height}" alt="${esc(title)}" decoding="async">
  <figcaption>
   <h3>${esc(title)}</h3>
   <p class="map-caption">${esc(caption)}</p>
   <a href="${url}" target="_blank" rel="noopener">Open full-size map (new tab)</a>
   ${evidence}
  </figcaption>
 </figure>`;
}

function spindleEvidence() {
 const year = state.cotton;
 const southeast = row('active_producing_cotton_spindles', year, 'Southeast_9');
 const england = row('active_producing_cotton_spindles', year, 'New_England');
 const ratio = row('southeast_to_new_england_spindles', year);
 const records = econ.filter(record => record.year === year && record.sync_group === 'cotton-spindles');
 const max = 20000000;
 const comparison = `<dl class="spindle-comparison">${[[southeast, 'Southeast (9 states)'], [england, 'New England']].map(([record, label]) => `
   <div class="spindle-row">
    <dt>${label}</dt>
    <dd class="evidence-value">${fmt(record)}</dd>
    <dd class="spindle-track" aria-hidden="true"><span style="width:${record.value / max * 100}%"></span></dd>
   </div>`).join('')}
  </dl>
  <p class="spindle-scale" aria-hidden="true"><span>0</span><span>20 million spindles</span></p>
  <p class="evidence-note">Southeast to New England ratio <strong>${fmt(ratio)}</strong>. Spindles count equipment.</p>`;
 return `${industryMap(`cotton-${year}`, `Active cotton spindles in ${year}`, content.maps.cotton.caption, comparison)}
  <details class="evidence-disclosure" data-evidence-disclosure="data"><summary>View counts, sources & definitions</summary>
   <p class="evidence-note">${esc(content.maps.cotton.limit)}</p>
   ${table(records)}
  </details>`;
}

function networkSources(network, scope) {
 const citations = new Map();
 for (const place of network.nodes) {
  const key = `${place.source_id}|${place.locator}`;
  if (!citations.has(key)) citations.set(key, { id: place.source_id, locator: place.locator, places: [] });
  citations.get(key).places.push(place.display_label || place.city);
 }
 return `<details class="evidence-disclosure" data-evidence-disclosure="sources">
  <summary>Scope & source references</summary>
  <ul class="evidence-source-list">${[...citations.values()].map(({id, locator, places}) =>
   `<li><strong>${esc(places.join(', '))}</strong>${cite([id], locator)}</li>`).join('')}</ul>
  <ul class="evidence-limits">${[scope, ...network.limits].filter(Boolean).map(note => `<li>${esc(note)}</li>`).join('')}</ul>
 </details>`;
}

function relationshipEvidence(section) {
 const cotton = section === 'cotton';
 const capital = cotton && state.cottonMode === 'capital';
 const name = cotton ? 'textile-1905' : `${section}-${state[section]}`;
 const base = networks.find(network => network.id === name);
 const network = capital ? base.layers[0] : base;
 const mapName = capital ? 'textile-1905-capital' : name;
 const copy = content.maps[mapName];
 const places = `<ol class="relationship-places" aria-label="Places numbered as on the map">
   ${network.nodes.map(place => `<li><strong>${esc(place.display_label || place.city)}</strong><span>${esc(place.account || place.role)}${place.documentation_year ? ` · ${place.documentation_year}` : ''}</span></li>`).join('')}
  </ol>`;
 return `${industryMap(mapName, copy.title, copy.caption, places)}
  ${networkSources(network, copy.limit)}`;
}

function fixedIndustryEvidence(section) {
 if (section === 'cotton') return `<details class="evidence-disclosure fixed-evidence">
  <summary>Textile employment and patents · 1870 and 1910</summary>
  <p class="evidence-note">${esc(content.maps.cotton.data_note)}</p>
  ${table(econ.filter(record => record.metric.startsWith('textile_')))}
 </details>`;

 const rows = econ.filter(record => record.section === section);
 const pipe = section === 'pipe';
 const main = row(pipe ? 'centrifugally_cast_pipe_share' : 'american_tobacco_constituent_cigarette_share', pipe ? 1926 : 1890);
 const label = pipe ? 'of US pipe tonnage was centrifugally cast in 1926' : 'of US cigarette production came from the five merging firms in 1890';
 const figures = pipe ? 'US pipe output by tonnage · 1926' : 'American Tobacco and Duke advertising · 1889–90';
 return `<details class="evidence-disclosure fixed-evidence"><summary>${figures}</summary>
   <p class="evidence-note"><strong>${fmt(main)}</strong> ${label}.</p>
   ${table(rows)}
   <p class="evidence-note">${esc(content.maps[`${section}-${state[section]}`].data_note)}</p>
  </details>`;
}

function industryPanel(section) {
 return section === 'cotton' && state.cottonMode === 'spindles' ? spindleEvidence() : relationshipEvidence(section);
}

function mapHTML(section) {
 const cotton = section === 'cotton';
 const choiceLabel = cotton ? 'Cotton evidence' : section === 'pipe' ? 'Pipe company' : 'Cigarette industry evidence';
 const choice = cotton ? state.cottonMode : state[section];
 return `<section class="industry-evidence" aria-labelledby="industry-evidence-heading">
  <h2 id="industry-evidence-heading">Industry maps and evidence</h2>
  ${evidenceChoices(industryChoices[section], choice, choiceLabel, cotton ? null : section)}
  ${cotton ? `<div class="spindle-years" ${choice === 'spindles' ? '' : 'hidden'}>${evidenceChoices(spindleYears.map(year => [year, year]), state.cotton, 'Spindle census year', section)}</div>` : ''}
  <p class="sr-only" role="status" id="industry-evidence-status"></p>
  <div class="industry-evidence-panel" id="industry-evidence-panel">${industryPanel(section)}</div>
  ${fixedIndustryEvidence(section)}
 </section>`;
}
function warpDiagram(){return `<svg class="warp-diagram" viewBox="0 0 680 280" role="img" aria-label="Schematic from text, Draper page 65. A broken warp lets its steel heddle fall, blocking the vibrator and stopping the loom."><rect x="20" y="20" width="640" height="240" fill="#f3f7f4"/><g stroke="#315b65" stroke-width="4" fill="none"><path d="M120 45V215M240 45V215M360 45V150M360 180V240"/><path d="M90 100H420M90 220H420"/><rect x="108" y="70" width="24" height="135"/><rect x="228" y="70" width="24" height="135"/><rect x="348" y="110" width="24" height="135"/><path d="M300 240H470" stroke="#9b5c20"/></g><g fill="#203b40" font-family="Arial" font-size="17"><text x="450" y="85">Steel heddles</text><text x="450" y="120">Supporting bar</text><text x="450" y="180">Broken warp: heddle falls</text><text x="450" y="235">Vibrator blocked → stop</text></g></svg>`;}
const anchors={northrop:[[39,51],[21,20],[50,30],[51,56],[58,66],[85,67]],bonsack:[[49,56],[36,37],[59,16],[67,39],[38,62],[20,69]],delavaud:[[34,32],[13,68],[76,45],[35,12]],'northrop-shuttle':[[48,53],[83,50],[53,42],[16,52]],'bonsack-forming':[[28,50],[70,50],[49,69]],'delavaud-shell':[[56,29],[18,50],[9,59],[28,73],[29,36],[86,50]]};
function hotspots(n,id){const points=anchors[n.id];if(!points)return '';const cs=nodes.filter(x=>x.parent===n.id&&(n.level===1||x.chain));return `<div class="hotspots" role="group" aria-label="Illustration navigation markers">${cs.map((x,i)=>points[i]?`<button data-node="${x.id}" data-machine="${id}" style="left:${points[i][0]}%;top:${points[i][1]}%" aria-label="${i+1}. ${esc(x.name)}" title="${esc(x.name)}" tabindex="${i===0?0:-1}">${i+1}</button>`:'').join('')}</div>`;}
function explosion(n,id,parts,expanded){
 const slots=parts.length<=3?[[15,18],[85,18],[50,83]]:parts.length<=4?[[15,18],[85,18],[15,82],[85,82]]:[[14,16],[86,16],[14,49],[86,49],[32,83],[68,83]];
 const pts=anchors[n.id]||[];
 return `<div class="assembly-view ${expanded?'is-expanded':''}" data-assembly="${n.id}"><div class="exploded-scene"><svg class="explosion-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${parts.map((x,i)=>{const a=pts[i]||[50,50],b=slots[i];return `<line x1="${50+(a[0]-50)*.40}" y1="${46+(a[1]-50)*.30}" x2="${b[0]}" y2="${b[1]}"/><circle cx="${50+(a[0]-50)*.40}" cy="${46+(a[1]-50)*.30}" r=".6"/>`;}).join('')}</svg><div class="explosion-center"><img src="${n.asset}" alt="Interpretive reconstruction of ${esc(n.name)}"><span>${esc(n.name)}</span></div><div class="assembly-parts" id="${id}-core-parts" ${expanded?'':'inert'}>${parts.map((x,i)=>`<button class="part orbit-part" data-node="${x.id}" data-machine="${id}" style="--part-x:${slots[i][0]}%;--part-y:${slots[i][1]}%;--from-x:${50-slots[i][0]}cqw;--from-y:${(46-slots[i][1])*5.6}px"><img ${x.id==='northrop-shuttle-body'?'class="rotate"':''} src="${x.asset}" alt=""><span>${i+1}. ${esc(x.name)}</span></button>`).join('')}</div></div><span class="evidence-badge">Interpretive reconstruction</span><p class="caption explosion-note" ${expanded?'':'hidden'}>Offsets and leader endpoints are illustrative, not assembly geometry. Select a part to inspect its source.</p></div>`;
}
function machineCanCompare(node) {
 return Boolean(node.asset) || node.render === 'SCH';
}

function machineHTML(id) {
 const view = machineState[id];
 const selected = nodes.find(node => node.id === view.node);
 const root = nodes.find(node => node.id === id);
 const parent = nodes.find(node => node.id === selected.parent);
 const branch = selected.level === 3 ? parent : selected;
 const groups = nodes.filter(node => node.parent === id);
 const components = selected.level === 1 ? [] : nodes.filter(node => node.parent === branch.id);
 const core = groups.find(node => node.chain);
 const coreParts = branch === core ? components.filter(node => node.chain && node.asset) : [];
 const explodedView = selected === core && coreParts.length > 0;
 const comparisonAvailable = machineCanCompare(selected);
 const comparing = view.compare && comparisonAvailable;
 const copy = content.component_copy.find(item => item.node_id === selected.id);
 const machine = content.machines[id];
 const schematic = selected.render === 'SCH';
 const textOnly = selected.render === 'TXT';
 const sourceLabel = selected.evidence_type === 'catalog' ? 'Catalog illustration' :
  selected.evidence_type === 'text' ? 'Original source text' : 'Patent drawing';
 const option = (node, title = node.name) => `<option value="${node.id}" ${node === selected ? 'selected' : ''}>${esc(title)}</option>`;
 const pickers = `<div class="machine-picker">
  <label for="${id}-group">Assembly group<select id="${id}-group" data-machine-picker="${id}">${option(root, 'Whole machine')}${groups.map(node => `<option value="${node.id}" ${node === branch ? 'selected' : ''}>${esc(node.name)}</option>`).join('')}</select></label>
  ${components.length ? `<label for="${id}-part">Component<select id="${id}-part" data-machine-picker="${id}">${option(branch, 'Group overview')}${components.map(node => option(node)).join('')}</select></label>` : ''}
 </div>`;
 let art = '';
 if (comparing) {
  art = `<div class="compare-grid">
   <div><p class="machine-view-label">${schematic ? 'Schematic from text' : 'Interpretive reconstruction'}</p>${schematic ? warpDiagram() : `<img ${selected.id === 'northrop-shuttle-body' ? 'class="rotate"' : ''} src="${selected.asset}" alt="Interpretive reconstruction of ${esc(selected.name)}">`}</div>
   <div><p class="machine-view-label">${sourceLabel}</p>${sourcePage(selected,id)}<p class="caption">${esc(selected.highlight_note)}</p></div>
  </div>`;
 } else if (explodedView) {
  art = explosion(selected,id,coreParts,view.expanded);
 } else if (schematic) {
  art = `<span class="evidence-badge">Schematic from text, p.65</span><div class="art-frame">${warpDiagram()}</div>`;
 } else if (selected.asset) {
  const ratio = selected.image_width / selected.image_height;
  art = `<span class="evidence-badge">Interpretive reconstruction</span><div class="art-frame">
   <img ${selected.id === 'northrop-shuttle-body' ? 'class="rotate"' : ''} src="${selected.asset}" alt="Interpretive reconstruction of ${esc(selected.name)}">
   <div class="image-overlay" style="--image-ratio:${ratio};aspect-ratio:${ratio}">${hotspots(selected,id)}</div>
  </div>`;
 } else if (!textOnly) {
  art = `<span class="evidence-badge">${sourceLabel}</span><div class="scan-view">${sourcePage(selected,id)}</div><p class="caption scan-note">${esc(selected.highlight_note)}</p>`;
 }
 const machineNodes = nodes.filter(node => node.id === id || node.id.startsWith(id + '-'));
 return `<section class="machine" id="machine-${id}" data-selected-node="${selected.id}">
  <h2>${esc(machine.title)}</h2>
  <p class="machine-intro">${esc(machine.historical_reading)}</p>
  <details class="machine-context"><summary>About this reconstruction</summary><p class="caption">${esc(machine.caption)} ${esc(machine.variant_note)}</p></details>
  <div class="machine-navigation">${pickers}</div>
  <div class="machine-layout${!art ? ' no-machine-art' : ''}">
   <div class="node-detail">
    <h3 tabindex="-1" class="node-heading">${esc(selected.name)}</h3>
    <p class="node-function">${esc(copy?.function || '')}</p>
    <div class="machine-toolbar">
     ${selected.level === 1 && core ? btn('Explore ' + esc(core.name), `data-node="${core.id}" data-machine="${id}"`) : ''}
     ${explodedView && !comparing ? btn(view.expanded ? 'Collapse parts' : 'Explode parts', `data-explode="${id}" aria-expanded="${view.expanded}" aria-controls="${id}-core-parts"`) : ''}
     ${comparisonAvailable ? btn('Compare with original', `data-compare="${id}" aria-pressed="${comparing}"`) : ''}
     ${btn('Open original page', `data-node-source="${selected.id}"`)}
    </div>
    ${textOnly ? '<p class="caption">Documented in the source text.</p>' : ''}
    ${copy?.source_note ? `<p class="caption">${esc(copy.source_note)}</p>` : ''}
    ${schematic ? '<p class="caption">Each steel heddle hangs from a supporting bar. A broken warp thread lets its heddle drop into the vibrator’s path. Once the vibrator is blocked, the loom stops (Draper 1905, 65).</p>' : ''}
    ${selected.variant_note && selected.variant_note !== copy?.source_note ? `<p class="caption">${esc(selected.variant_note)}</p>` : ''}
    <p class="caption">${esc(selected.locator)}</p>
    ${cite([selected.source_id])}
   </div>
   <div class="machine-stage"><div class="machine-visual">${art}</div></div>
  </div>
  <details class="registry">
   <summary>View all ${machineNodes.length} nodes as a table</summary>
   <div class="table-wrap"><table><thead><tr><th scope="col">Level</th><th scope="col">Component</th><th scope="col">Function and evidence</th><th scope="col">Source location</th></tr></thead><tbody>
    ${machineNodes.map(node => {
     const entry = content.component_copy.find(item => item.node_id === node.id);
     return `<tr><td>L${node.level}</td><th scope="row"><button data-node="${node.id}" data-machine="${id}">${esc(node.name)}</button></th><td>${esc([entry.function, entry.source_note].filter(Boolean).join(' '))}</td><td><button data-node-source="${node.id}">${esc(node.locator)}</button></td></tr>`;
    }).join('')}
   </tbody></table></div>
  </details>
  <p class="caption machine-limit">Each assembly groups parts by the work they perform. An image ID identifies an interpretive reconstruction. Exploded positions and highlighted areas are approximate. Whole-page views supply no position for an individual part. Dimensions, hidden geometry and factory installations require separate evidence.</p>
 </section>`;
}
function nationalEvidenceHTML() {
 const records = econ.filter(r => r.section === 'national');
 const wage = records.filter(r => r.metric === 'manufacturing_wage_earner_share').sort((a,b) => a.year - b.year);
 const value = wage.map(r => row('manufacturing_nominal_product_value_share',r.year,'South_13'));
 const ratios = wage.map(r => row('relative_nominal_product_value_per_wage_earner',r.year,'South_13'));
 const first = wage[0].year, last = wage.at(-1).year;
 const tickStep = 4, maximum = Math.ceil(Math.max(...wage.concat(value).map(r => r.value))/tickStep)*tickStep;
 const x = year => (year-first)/(last-first)*100;
 const y = share => 100-share/maximum*100;
 const ticks = Array.from({length:maximum/tickStep+1},(_,i) => i*tickStep);
 const series = (rows,name) => `<polyline class="trend-line ${name}" points="${rows.map(r => `${x(r.year)},${y(r.value)}`).join(' ')}"/>`;
 const markers = (rows,name) => rows.map(r => `<span class="trend-point ${name}" style="left:${x(r.year)}%;top:${y(r.value)}%"></span>`).join('');
 const exact = r => r.unit === 'ratio' ? r.value.toFixed(2) : fmt(r);
 const sourceButton = `<button class="citation" data-econ="${econ.indexOf(wage.at(-1))}">Poulton 1947, 7, table 2 (PDF 13)</button>`;
 return `<figure class="national-evidence" aria-labelledby="trend-title">
  <div class="trend-figure">
   <h3 id="trend-title">Southern shares of US manufacturing</h3>
   <ul class="trend-legend"><li><span class="wages"></span>Wage earners</li><li><span class="value"></span>Nominal product value</li></ul>
   <div class="trend-chart" aria-hidden="true">
    <div class="trend-grid">${ticks.map(v => `<span style="top:${y(v)}%"><span>${v}%</span></span>`).join('')}</div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">${series(wage,'wages')}${series(value,'value')}</svg>
    ${markers(wage,'wages')}${markers(value,'value')}
    <div class="trend-years">${[1860,1880,1899,1919,1929].map(year => `<span style="left:${x(year)}%">${year}</span>`).join('')}</div>
   </div>
  </div>
  <div class="trend-snapshot">
   <h4>${last} census</h4>
   <dl>
    <div><dt>Share of US wage earners</dt><dd>${fmt(wage.at(-1))}</dd></div>
    <div><dt>Share of US nominal product value</dt><dd>${fmt(value.at(-1))}</dd></div>
    <div><dt>Nominal product value per wage earner relative to US</dt><dd>${fmt(ratios.at(-1))}</dd></div>
   </dl>
  </div>
  <figcaption class="trend-caption">
   <p>Eight census dates for the thirteen-state South. ${sourceButton}</p>
   <details class="trend-data"><summary>View all eight census years</summary>
    <p class="caption">${esc(content.maps.national.caption)}</p>
    <table aria-label="BLS 13-state South, manufacturing census observations">
     <thead><tr><th scope="col">Year</th><th scope="col">Southern share of US wage earners</th><th scope="col">Southern share of US nominal product value</th><th scope="col">Southern value per wage earner (US = 1.00)</th></tr></thead>
     <tbody>${wage.map((r,i) => `<tr><th scope="row">${r.year}</th><td>${exact(r)}</td><td>${exact(value[i])}</td><td>${exact(ratios[i])}</td></tr>`).join('')}</tbody>
    </table>
    <p class="caption">${esc(content.maps.national.limit)}</p>
   </details>
  </figcaption>
 </figure>`;
}

function methodHTML() {
 return content.method_notes.map(n => `<details><summary>${esc(n.title)}</summary><p>${esc(n.text)}</p></details>`).join('');
}

function institutionsHTML() {
 return `<section class="institution-evidence" aria-labelledby="institution-evidence-title">
  <h2 id="institution-evidence-title">Compare institutions</h2>
  ${content.institution_rows.map(r => `<details class="institution-entry">
   <summary>${esc(r.institution)}</summary>
   <dl>
    <div><dt>Mechanism</dt><dd>${esc(r.mechanism)}</dd></div>
    <div><dt>Comparison</dt><dd>${esc(r.comparison)}</dd></div>
    <div><dt>Limit</dt><dd>${esc(r.limit)}</dd></div>
   </dl>
   ${cite(r.source_ids,r.locator)}
  </details>`).join('')}
 </section>`;
}

function bibliographyEntry(s) {
 if (!s.italic_title) return esc(s.reference);
 const [before, after] = s.reference.split(s.italic_title);
 return esc(before) + '<i>' + esc(s.italic_title) + '</i>' + esc(after);
}

function sourcesHTML() {
 const originals = {draper1905:'northrop',bonsack1881:'bonsack',delavaud1916:'delavaud'};
 return `<h1 class="section-heading" tabindex="-1">Sources & data</h1>
  <p class="deck">Follow a claim to its source. Component views distinguish the original drawing from an interpretive reconstruction.</p>
  <section class="source-method"><details><summary>Project explanation</summary>
   ${content.project_explanation.map(text => `<p>${esc(text)}</p>`).join('')}
  </details></section>
  <section class="data-section">
   <h2>Economic data</h2>
   <div class="data-downloads"><a href="data/economic-indicators.csv" download>Download CSV</a><a href="data/economic-indicators.json" download>Download JSON</a></div>
   <details><summary>View all ${econ.length} economic observations</summary>${table(econ)}</details>
  </section>
  <section class="source-method"><h2>Method & definitions</h2>${methodHTML()}</section>
  <section><h2>Bibliography</h2><ol class="bibliography">${content.sources.map(s => `<li id="source-${s.id}">
   <p class="reference">${bibliographyEntry(s)}</p>
   <p>${esc({primary:'Firsthand source',secondary:'Secondary source',mixed:'Census tables and secondary analysis'}[s.type])} · ${esc(s.locator)}</p>
   <a href="${esc(s.reference_url)}" target="_blank" rel="noopener">Open external source</a>
   ${originals[s.id] ? btn('View original page',`data-node-source="${originals[s.id]}"`) : ''}
  </li>`).join('')}</ol></section>
  <section class="source-method"><h2>Course materials</h2>${content.course_materials.map(text => `<p>${esc(text)}</p>`).join('')}
   <details><summary>AI assistance</summary>${content.assistance.map(text => `<p>${esc(text)}</p>`).join('')}</details>
  </section>`;
}

function render() {
 if (!content) return;
 const main = $('#main');
 current = chapterFromHash();
 const s = content.sections.find(s => s.id === current);
 const machine = machineIds[current];
 let html = '';
 if (current === 'sources') {
  html = sourcesHTML();
 } else {
  const national = current === 'national';
  html = `<div class="chapter-heading">
   <h1 class="${national ? 'hero-title ' : ''}section-heading" tabindex="-1">${esc(national ? content.title : s.title)}</h1>
   <p class="deck">${esc(national ? content.subtitle : s.deck)}</p>
   ${national ? `<p class="thesis">${esc(content.thesis)}</p>` : ''}
   ${machine ? `<div class="case-jumps">
    <a href="#${current}/evidence">Maps and evidence</a><a href="#${current}/machine">Explore the machine</a>
   </div>` : ''}
  </div>`;
  if (national) html += `<section class="national-section"><h2>${esc(s.title)}</h2><p class="deck">${esc(s.deck)}</p>${nationalEvidenceHTML()}</section>`;
  if (machine) html += `<div id="case-evidence" tabindex="-1"><div id="map-host">${mapHTML(current)}</div></div>`;
  html += proseHTML(s);
  if (machine) html += `<div id="machine-host" tabindex="-1">${machineHTML(machine)}</div>`;
  if (current === 'institutions') html += institutionsHTML();
  if (national || current === 'institutions') {
   html += `<details class="method"><summary>What these measures can—and cannot—show</summary>
    ${content.method_notes.map(n => `<h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>`).join('')}
   </details>`;
  }
 }
 main.innerHTML = html + chapterNavigationHTML(current);
 $$('.chapter-nav a').forEach(a => {
  if (a.hash === '#'+current) a.setAttribute('aria-current','page');
  else a.removeAttribute('aria-current');
 });
 document.title = (current === 'national' ? content.title : (s?.title || 'Sources & data'))+' — Made Across America';
 observeScans();
 emit('sectionEnter',{section:current});
}
function showSource(trigger){
 const dialog=$('#source-dialog'), {source:sourceId,nodeSource,econ:econIndex}=trigger.dataset;
 if(dialog.open)return;
 const n=nodeSource?nodes.find(n=>n.id===nodeSource):null;
 const r=econIndex!==undefined?econ[Number(econIndex)]:null;
 const id=sourceId||n?.source_id||r?.source_id, s=source(id);
 sourceTrigger=trigger;
 $('#source-heading').textContent=n?.name||r?.label_en||s?.title||'Source';
 let figure='';
 if(n)figure=sourcePage(n)+`<p class="caption">${esc(n.highlight_note)}</p>`;
 if(r?.source_id==='bls1947'){
  const path=assets['sources/figures/'+(r.metric.includes('spindles')?'bls-015.png':'bls-013.png')];
  if(path)figure=`<div class="source-page"><img src="${path}" width="1247" height="1800" alt="BLS original table page"></div>`;
 }
 const original=s?.url||r?.source, page=n&&/\.pdf(?:$|\?)/i.test(original||'')?n.pdf_page:null;
 const metadata=r?`<p><strong>${fmt(r)}</strong> · Observed: ${r.observation_year} · ${esc(r.region.replaceAll('_',' '))}</p><p>${esc(r.limits)}</p>${r.denominator && r.denominator !== 'not applicable' ? `<p>${esc(r.denominator)}</p>` : ''}`:'';
 const originalLink=original?`<a href="${esc(original)}${page?'#page='+page:''}" target="_blank" rel="noopener">Open external original${page?' · PDF page '+page:''}</a>`:'';
 const relatedLinks=n?.also_pdf_pages?.map(p=>`<a href="${esc(original)}#page=${p}" target="_blank" rel="noopener">Related PDF page ${p}</a>`).join('')||'';
 $('#source-body').innerHTML=`${metadata}<p>${esc(s?.author||'')} · ${esc(s?.year||'n.d.')}</p><p>${esc(n?.locator||r?.locator||s?.locator||'')}</p><div class="source-actions">${originalLink}${relatedLinks}<a href="#sources">All sources &amp; data</a></div>${figure}`;
 dialog.showModal();
 dialog.scrollTop=0;
 emit('sourceOpen',{source:id});
}
// Keep the assembly mounted when toggling its parts so the motion can reverse.
function refreshMachine(id, focusTarget = '.node-heading') {
 const host = $('#machine-host');
 const previous = $('.machine', host);
 const template = document.createElement('template');
 template.innerHTML = machineHTML(id);
 const next = template.content.querySelector('.machine');
 if (previous) {
  previous.dataset.selectedNode = next.dataset.selectedNode;
  const oldPicker = $('.machine-picker', previous);
  const newPicker = $('.machine-picker', next);
  const oldGroup = $('select', oldPicker);
  const newGroup = $('select', newPicker);
  oldGroup.value = newGroup.value;
  const oldPart = $('select#' + id + '-part', oldPicker);
  const newPart = $('select#' + id + '-part', newPicker);
  if (oldPart && newPart && oldPart.options[0].value === newPart.options[0].value) {
   oldPart.value = newPart.value;
  } else {
   oldPart?.closest('label').remove();
   if (newPart) oldPicker.append(newPart.closest('label'));
  }
  const oldDetail = $('.node-detail', previous);
  const newDetail = $('.node-detail', next);
  if (oldDetail.innerHTML !== newDetail.innerHTML) oldDetail.replaceChildren(...newDetail.childNodes);
  const layout = $('.machine-layout', previous);
  layout.className = $('.machine-layout', next).className;
  const oldVisual = $('.machine-visual', previous);
  const newVisual = $('.machine-visual', next);
  const oldAssembly = $('[data-assembly]', oldVisual);
  const newAssembly = $('[data-assembly]', newVisual);
  if (oldAssembly && newAssembly && oldAssembly.dataset.assembly === newAssembly.dataset.assembly) {
   const expanded = machineState[id].expanded;
   oldAssembly.classList.toggle('is-expanded', expanded);
   $('.assembly-parts', oldAssembly).inert = !expanded;
   $('.explosion-note', oldAssembly).hidden = !expanded;
  } else {
   oldVisual.replaceChildren(...newVisual.childNodes);
  }
 } else {
  host.replaceChildren(next);
 }
 observeScans();
 const target = $(focusTarget, host);
 if (target) {
  target.focus({preventScroll:true});
  target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
 }
}

function selectNode(id, nodeId, focusTarget) {
 const view = machineState[id];
 const selected = nodes.find(node => node.id === nodeId);
 if (!view || !selected || !(nodeId === id || nodeId.startsWith(id + '-'))) return;
 if (view.node === nodeId) return;
 view.node = nodeId;
 refreshMachine(id, focusTarget);
 emit('nodeSelect', {id:nodeId, level:selected.level});
}
function refreshMap(section) {
 const host = $('#map-host');
 const panel = $('#industry-evidence-panel', host);
 const years = $('.spindle-years', host);
 if (years) years.hidden = state.cottonMode !== 'spindles';
 $$('[data-year]', host).forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.year) === state[section]));
 $$('[data-cotton-mode]', host).forEach(button => button.setAttribute('aria-pressed', button.dataset.cottonMode === state.cottonMode));
 const open = new Set($$('[data-evidence-disclosure][open]', panel).map(details => details.dataset.evidenceDisclosure));
 panel.innerHTML = industryPanel(section);
 $$('[data-evidence-disclosure]', panel).forEach(details => details.open = open.has(details.dataset.evidenceDisclosure));
 $('#industry-evidence-status').textContent = $('h3', panel).textContent;
}
function toggleExplosion(id) {
 const view = machineState[id];
 const assembly = $('[data-assembly]');
 if (!assembly || assembly.dataset.assembly !== view.node) return;
 view.expanded = !view.expanded;
 refreshMachine(id, '[data-explode]');
 emit(view.expanded ? 'nodeExpand' : 'nodeCollapse', {id:view.node});
}

function toggleMachineComparison(id) {
 const view = machineState[id];
 const node = nodes.find(item => item.id === view.node);
 if (!machineCanCompare(node)) return;
 view.compare = !view.compare;
 refreshMachine(id, '[data-compare]');
 emit('compareToggle', {id});
}

document.addEventListener('change', e => {
 const picker = e.target.closest('[data-machine-picker]');
 if (picker) selectNode(picker.dataset.machinePicker, picker.value, '#' + picker.id);
});
document.addEventListener('click',e=>{
 if(e.defaultPrevented)return;
 const a=e.target.closest('a[href^="#"]');
 if(a&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){
  if(a.classList.contains('skip')){
   e.preventDefault();
   focusChapterTarget($('#main'));
   $('#main').scrollIntoView({block:'start'});
   return;
  }
  if(isChapterHash(a.hash)){
   e.preventDefault();
   navigateChapter(a.hash);
   return;
  }
 }
 const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if ('year' in d && state[d.series] !== Number(d.year)) {
  state[d.series] = Number(d.year);
  refreshMap(d.series);
  emit('yearChange', {series:d.series, year:state[d.series]});
 }
 if (d.cottonMode && d.cottonMode !== state.cottonMode) {
  state.cottonMode = d.cottonMode;
  refreshMap('cotton');
  emit('layerToggle', {layer:d.cottonMode});
 }
 if(d.node)selectNode(d.machine,d.node);
 if(d.explode)toggleExplosion(d.explode);
 if(d.compare)toggleMachineComparison(d.compare);
 if(d.nodeSource||'econ'in d||d.source)showSource(b);
 if(b.id==='close-source')$('#source-dialog').close();
});
document.addEventListener('keydown',e=>{
 if($('#source-dialog').open)return;
 const group=e.target.closest('.hotspots,.scan-hotspots,.assembly-parts');
 if(group&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)){
  const bs=$$('button',group);let i=bs.indexOf(e.target);if(i<0)return;e.preventDefault();
  i=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+bs.length)%bs.length;
  bs.forEach((b,j)=>b.tabIndex=i===j?0:-1);bs[i].focus({preventScroll:true});bs[i].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
 }
 if(e.key==='Escape'&&!e.defaultPrevented&&!e.target.closest('select')&&e.target.closest('.machine')){
  const id=machineIds[current],view=machineState[id],node=nodes.find(item=>item.id===view.node);
  if(view.compare&&machineCanCompare(node)){e.preventDefault();toggleMachineComparison(id);}
  else if(view.expanded&&$('[data-assembly]')){e.preventDefault();toggleExplosion(id);}
  else if(node.parent){e.preventDefault();selectNode(id,node.parent);}
 }
});
$('#source-dialog').addEventListener('close',e=>{
 if(e.currentTarget.open)return;
 if(sourceTrigger?.isConnected)sourceTrigger.focus({preventScroll:true});
 sourceTrigger=null;
});
document.addEventListener('toggle',e=>{if(e.target.matches?.('details'))emit('tableViewToggle',{open:e.target.open});},true);

const sectionLinks=$$('.chapter-nav a');
const chapterSelect=$('#chapter-select');
const chapterTargets={evidence:'#case-evidence',machine:'#machine-host'};
const readingPositions=new Map();
let nextEntry=0, activeHash=location.hash, activeEntry;

function chapterFromHash(hash=location.hash){
 const chapter=hash.slice(1).split('/')[0];
 return chapters.includes(chapter)?chapter:'national';
}

function isChapterHash(hash){
 const [chapter,target,...rest]=hash.slice(1).split('/');
 return chapters.includes(chapter)&&(!target||(Object.hasOwn(machineIds,chapter)&&Object.hasOwn(chapterTargets,target)))&&!rest.length;
}

function chapterNavigationHTML(chapter){
 const index=chapters.indexOf(chapter);
 const chapterLink=(anchor,label,position)=>anchor?`<a class="${position}" href="${anchor.hash}"><span>${label} chapter</span><strong>${esc(anchor.textContent)}</strong></a>`:'';
 return `<nav class="chapter-trail" aria-label="Previous and next chapters">${chapterLink(sectionLinks[index-1],'Previous','chapter-previous')}${chapterLink(sectionLinks[index+1],'Next','chapter-next')}</nav>`;
}

function focusChapterTarget(target){
 if(!target.hasAttribute('tabindex'))target.tabIndex=-1;
 target.focus({preventScroll:true});
}

function revealChapterTarget(restoreScroll,focus=true){
 const targetName=location.hash.split('/')[1];
 const target=Object.hasOwn(chapterTargets,targetName)?$(chapterTargets[targetName]):null;
 const main=$('#main'), heading=$('.section-heading',main)||main;
 if(focus){
  const focusTarget=restoreScroll>0?main:target?$('h1,h2',target)||target:heading;
  focusChapterTarget(focusTarget);
 }
 if(restoreScroll!==undefined)window.scrollTo(0,restoreScroll);
 else if(target)target.scrollIntoView({block:'start'});
 else if(focus)window.scrollTo(0,0);
}

function chapterDisclosures(){
 const counts=new Map();
 return $$('#main details').map(detail=>{
  const label=$('summary',detail).textContent.trim();
  const count=counts.get(label)||0;
  counts.set(label,count+1);
  return {detail,key:count+':'+label};
 });
}

function rememberChapterLocation(){
 const open=new Set(chapterDisclosures().filter(({detail})=>detail.open).map(({key})=>key));
 readingPositions.set(activeEntry,{scroll:window.scrollY,open});
}

function applyChapterLocation(position,focus=true){
 sourceTrigger=null;
 const dialog=$('#source-dialog');
 if(dialog.open)dialog.close();
 const nextChapter=chapterFromHash();
 chapterSelect.value=nextChapter;
 if(!content)return;
 if(current!==nextChapter)render();
 if(position?.open){
  for(const {detail,key} of chapterDisclosures())detail.open=position.open.has(key);
 }
 revealChapterTarget(position?.scroll,focus);
}

const entryId=()=>`${Date.now()}-${++nextEntry}`;
function identifyHistoryEntry(){
 if(history.state?.exhibitionEntry)return history.state.exhibitionEntry;
 const entry=entryId();
 history.replaceState({...history.state,exhibitionEntry:entry},'');
 return entry;
}

function navigateChapter(hash,{keepFocus=false}={}){
 const currentHash=location.hash||'#national';
 if(hash!==currentHash){
  rememberChapterLocation();
  activeEntry=entryId();
  history.pushState({exhibitionEntry:activeEntry},'',hash);
  activeHash=location.hash;
 }
 applyChapterLocation(keepFocus?{scroll:0}:undefined,!keepFocus);
}

function restoreChapterLocation(){
 if(location.hash===activeHash&&history.state?.exhibitionEntry===activeEntry)return;
 rememberChapterLocation();
 activeEntry=identifyHistoryEntry();
 activeHash=location.hash;
 applyChapterLocation(readingPositions.get(activeEntry));
}

history.scrollRestoration='manual';
activeEntry=identifyHistoryEntry();
window.addEventListener('popstate',restoreChapterLocation);
window.addEventListener('hashchange',restoreChapterLocation);
chapterSelect.replaceChildren(...sectionLinks.map(link=>new Option(link.textContent,link.hash.slice(1))));
chapterSelect.value=chapterFromHash();
$('.chapter-picker').hidden=false;
chapterSelect.addEventListener('change',()=>navigateChapter('#'+chapterSelect.value,{keepFocus:true}));

Promise.all(['content','nodes','economic-indicators','industry-networks','asset-map'].map(n=>fetch(`data/${n}.json?v=20261121-text1`,{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(n+' '+r.status);return r.json();}))).then(([c,n,e,net,a])=>{
 content=c;nodes=n;econ=e;networks=net;assets=a;
 render();
 revealChapterTarget(undefined,false);
}).catch(e=>{$('#main').innerHTML='<div class="error"><h1>The exhibition could not load</h1><p>Reload this page to try again, or <a href="data/economic-indicators.csv">download the economic data</a>.</p></div>';console.error(e);});
