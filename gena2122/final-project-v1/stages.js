/* Explanatory links, not recovered factory sequences or traced consignments. */
const WORK_STAGES={
 nail:[
 ['Smelt','works',['ore','pig'],'At Saugus, the blast furnace turned ore into pig iron. Refining still had to follow.'],
 ['Refine & slit','works',['bar','rod'],'The forge refined iron; rolling and slitting produced rods for nailmakers.'],
 ['Supply the furnace','flux',['ore'],'Nahant supplied gabbro used as flux. This is an input to smelting, not a detachable part of a nail.'],
 ['Distribute','port',['rod','nail'],'Boston handled iron products. Most slit rods went to Boston and other New England settlements; some nails were made at Saugus.']],
 cloth:[
 ['Grow cotton','cotton',['fiber'],'Southern cotton connected enslaved agricultural labor to northern textile manufacturing. This is a regional relationship, not a traced bale.'],
 ['Spin & weave','mills',['yarn','warp','weave'],'Lowell concentrated water-powered spinning and weaving. The material changes while the work remains within the mill system.'],
 ['Connect markets','port',['weave'],'Boston linked merchants, transport and markets. A port performed a different role from a cotton-growing region or a mill.']],
 can:[
 ['Raise livestock','livestock',['contents'],'Livestock from the Midwest supplied Chicago’s meatpacking industry. The shaded region is approximate.'],
 ['Process & pack','packing',['canbody','lid','contents','seam'],'Chicago concentrated stockyards and packing plants. The diagram separates beef, container and seal; it does not trace the tinplate’s origin.'],
 ['Reach customers','market',['canbody'],'An 1893 Vacaville advertisement places Armour Corned Beef in a California retail market. It does not document a direct shipment.']],
 car:[
 ['Gather materials','minerals',['frame','engine'],'The Great Lakes formed part of Ford’s mineral supply geography. Concentrated assembly depended on materials from outside Dearborn.'],
 ['Prepare wood','wood',['body'],'Iron Mountain’s wood processing connected to body suppliers. The route was more complex than a direct journey to final assembly.'],
 ['Supply coal','coal',['engine','frame'],'Kentucky and West Virginia supplied coal. Fuel supported production; the highlight does not mean those regions manufactured the engine or chassis.'],
 ['Assemble','rouge',['body','engine','frame','wheels'],'The 1928 Rouge assembly evidence joins the material network to a particular place and date. Components came together here.']],
 tv:[
 ['Indiana factories','indiana',['crt','chassis'],'RCA assigned different roles within Indiana: receivers at Bloomington, components at Indianapolis, and picture tubes at Marion.'],
 ['Lancaster tubes','pennsylvania',['crt'],'Lancaster, Pennsylvania also made picture tubes. Two tube locations are evidence of distributed capacity within the firm.'],
 ['The complete set',null,['cabinet','crt','chassis','speaker'],'The structural diagram includes a cabinet and loudspeaker, but the available sources do not identify their factories for this illustrated set.']],
 phone:[
 ['Design & coordinate','america',['glass','electronics','case'],'Apple’s California role differs from final assembly in China. Supplier-office information is a separate optional map layer.'],
 ['Inspect components',null,['electronics'],'The 2007 teardown shows an upper logic board and lower battery connected by soldered leads. Component markings identify firms, not precise manufacturing sites.'],
 ['Final assembly','china',['glass','electronics','case'],'The original packaging and Apple’s 2007 disclosure support China-level assembly evidence. No specific factory is established here.']]
};
function paintDiagram(stage){const groups=stage?.[2]||[];const geo=stage&&GEO_CASES[CHAPTERS[active].id].groups.find(g=>g.key===stage[1]);document.querySelectorAll('.diagram-part').forEach(p=>{const match=!stage||groups.includes(p.dataset.part);p.style.opacity=match?1:.16;p.style.color=stage&&match&&geo?MAP_COLORS[geo.color]:'';});}
function renderStageSteps(){const steps=WORK_STAGES[CHAPTERS[active].id];$('stage-steps').innerHTML=steps.map((s,i)=>{const g=GEO_CASES[CHAPTERS[active].id].groups.find(g=>g.key===s[1]);return`<button type="button" data-stage="${i}" aria-pressed="${selectedStep===i}" style="--step-color:${g?MAP_COLORS[g.color]:'var(--muted)'}"><small>0${i+1}</small>${escapeHTML(s[0])}</button>`}).join('');$('stage-steps').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{pause();focusStage(+b.dataset.stage)}));$('stage-explanation').textContent=selectedStep===null?'Choose a stage to connect the object with a place and its role. The steps explain the network; they are not a factory instruction sheet.':steps[selectedStep][3];}
function focusStage(n,unfold=true){selectedStep=n;const stage=WORK_STAGES[CHAPTERS[active].id][n];mapSelected=stage[1];if(unfold)setUnfold(100);paintDiagram(stage);renderStageSteps();renderMap();}
function clearStageFocus(){selectedStep=null;mapSelected=null;paintDiagram(null);renderStageSteps();renderMap();}
// Installed after app.js initializes the first chapter.
