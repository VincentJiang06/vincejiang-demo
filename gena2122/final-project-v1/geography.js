/* Colour encodes selected geographic roles, never output shares or complete sourcing territories. */
const MAP_COLORS={blue:'#356e9a',orange:'#be582f',green:'#3f7d69',gold:'#aa7b23',purple:'#80619a'};
const GEO_CASES={
 nail:{bounds:[-73.6,41,-69.2,43.7],title:'Massachusetts Bay · local production',note:'Modern state outline for orientation. England supplied investment; this close view follows the local material network.',groups:[
 {key:'works',color:'orange',name:'Saugus',role:'Smelt, refine and cut iron',states:['Massachusetts'],point:[-71.01,42.47],label:[145,79],locs:['Saugus']},
 {key:'flux',color:'blue',name:'Nahant',role:'Gabbro flux · boat supply',point:[-70.92,42.43],label:[352,156],locs:['Nahant']},
 {key:'port',color:'green',name:'Boston',role:'Warehouse and distribution',point:[-71.06,42.36],label:[135,221],locs:['Boston']}]},
 cloth:{bounds:[-97,26,-66,47.5],title:'South & New England · different work',note:'The blue wash is an approximate regional cue, not a plantation map or the boundaries of a traced supply area.',groups:[
 {key:'cotton',color:'blue',name:'American South',role:'Raw cotton · regional evidence',wash:[-87,33.2,7,3],point:[-87,33.2],label:[151,204],locs:['American South']},
 {key:'mills',color:'orange',name:'Lowell, Massachusetts',role:'Water-powered textile mills',states:['Massachusetts'],point:[-71.32,42.63],label:[335,42],locs:['Lowell']},
 {key:'port',color:'green',name:'Boston, Massachusetts',role:'Port, merchants and transport',point:[-71.06,42.36],label:[351,105],locs:['Boston']}]},
 can:{bounds:[-126,24,-66,51.5],title:'A national network · three distinct roles',note:'The Midwest wash is schematic. Vacaville is a retail evidence point, not a documented direct shipment from Chicago.',groups:[
 {key:'livestock',color:'blue',name:'Midwest',role:'Livestock supply region',wash:[-97,42,7,5],point:[-97,42],label:[223,63],locs:['Midwest']},
 {key:'packing',color:'orange',name:'Chicago, Illinois',role:'Stockyards and meatpacking',states:['Illinois'],point:[-87.63,41.88],label:[363,119],locs:['Chicago']},
 {key:'market',color:'green',name:'Vacaville, California',role:'1893 Armour retail advertisement',states:['California'],point:[-121.99,38.36],label:[91,207],locs:['Vacaville']}]},
 car:{bounds:[-96,35,-73,50],title:'The Rouge & its material regions',note:'Resource washes show broad regional context. Wood components passed through body suppliers; no precise freight route is asserted.',groups:[
 {key:'minerals',color:'blue',name:'Great Lakes',role:'Mineral supply region',wash:[-88,46,4.9,2.1],point:[-88,46],label:[119,44],locs:['Great Lakes']},
 {key:'wood',color:'green',name:'Iron Mountain, Michigan',role:'Wood processing → body suppliers',point:[-88.06,45.82],label:[182,119],locs:['Iron Mountain']},
 {key:'rouge',color:'orange',name:'Rouge, Dearborn',role:'Manufacturing and final assembly',states:['Michigan'],point:[-83.17,42.31],label:[359,146],locs:['Rouge']},
 {key:'coal',color:'gold',name:'Kentucky & West Virginia',role:'Coal supply regions',states:['Kentucky','West Virginia'],point:[-83.4,37.6],label:[312,248],locs:['Kentucky','West Virginia']}]},
 tv:{bounds:[-91,36.5,-74,43.8],title:'Indiana & Pennsylvania · factory roles',note:'State colour locates the documented factories; it does not mean the whole state performed one task. No cabinet factory is established.',groups:[
 {key:'indiana',color:'orange',name:'Indiana',detail:'Bloomington · Indianapolis · Marion',role:'Bloomington: receivers · Indianapolis: components · Marion: picture tubes',states:['Indiana'],point:[-86.4,40.1],label:[130,57],locs:['Bloomington','Indianapolis','Marion']},
 {key:'pennsylvania',color:'blue',name:'Lancaster, Pennsylvania',role:'Lancaster: picture tubes',states:['Pennsylvania'],point:[-76.31,40.04],label:[362,163],locs:['Lancaster']}]},
 phone:{bounds:[-180,-50,180,80],title:'A global product · evidence at two levels',note:'Country colours locate documented organizations and assembly evidence. Supplier offices do not establish where a component was manufactured.',groups:[
 {key:'america',color:'blue',name:'California, United States',role:'Apple design · Marvell organization',countries:['United States of America'],point:[-122,37.3],label:[119,91],locs:['California','Marvell']},
 {key:'china',color:'orange',name:'China',role:'Final assembly · country-level evidence',countries:['China'],point:[105,34],label:[363,157],locs:['China']},
 {key:'europe',color:'purple',name:'Germany & United Kingdom',role:'Infineon and CSR offices · not factories',countries:['Germany','United Kingdom'],point:[7,51],label:[235,36],locs:['Infineon','CSR'],supplier:true},
 {key:'korea',color:'green',name:'South Korea',role:'Samsung headquarters · not a factory',countries:['South Korea'],point:[127,37],label:[407,82],locs:['Samsung'],supplier:true}]}
};
function renderGeography(c,world,states,globalContext,showSuppliers,selected=null){
 const config=GEO_CASES[c.id],W=480,H=280,global=c.id==='phone'||globalContext;
 const bounds=global?[-180,-50,180,80]:config.bounds;
 const groups=config.groups.filter(g=>!g.supplier||showSuppliers).map(g=>c.id==='phone'&&g.key==='america'&&!showSuppliers?{...g,role:'Apple design and organization'}:g);
 const xy=(lon,lat)=>[(lon-bounds[0])/(bounds[2]-bounds[0])*W,(bounds[3]-lat)/(bounds[3]-bounds[1])*H];
 const path=geometry=>(geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates).map(poly=>poly.map(ring=>ring.map(([lon,lat],i)=>{const[x,y]=xy(lon,lat);return`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join('')+'Z').join('')).join('');
 const groupAttr=g=>`data-map-group="${g.key}" style="--region-color:${MAP_COLORS[g.color]};opacity:${selected && selected !== g.key ? .18 : 1}"`;
 let shapes=(world?.features||[]).filter(f=>f.properties.name!=='Antarctica').map(f=>{const g=groups.find(g=>(g.countries||[]).includes(f.properties.name));return`<path class="geo-land ${g?'geo-colour':''}" ${g?groupAttr(g):''} d="${path(f.geometry)}"/>`}).join('');
 if(!global)shapes+=(states?.features||[]).filter(f=>!['Alaska','Hawaii'].includes(f.properties.name)).map(f=>{const g=groups.find(g=>(g.states||[]).includes(f.properties.name));return`<path class="geo-state ${g?'geo-colour':''}" ${g?groupAttr(g):''} d="${path(f.geometry)}"><title>${escapeHTML(f.properties.name)}</title></path>`}).join('');
 if(!global)shapes+=groups.filter(g=>g.wash).map(g=>{const[x,y]=xy(g.wash[0],g.wash[1]),rx=g.wash[2]/(bounds[2]-bounds[0])*W,ry=g.wash[3]/(bounds[3]-bounds[1])*H;return`<ellipse class="geo-wash" ${groupAttr(g)} cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`}).join('');
 let labels='';
 for(const g of groups){const[x,y]=xy(...g.point);if(x<0||x>W||y<0||y>H)continue;let[lx,ly]=g.label;if(global&&c.id!=='phone'){lx=335;ly=55+groups.indexOf(g)*48;}labels+=`<g class="geo-label-group" ${groupAttr(g)}><path class="geo-leader" d="M${x},${y}L${lx},${ly-9}"/><circle class="geo-pin" cx="${x}" cy="${y}" r="4.5"/><text class="geo-label" x="${lx}" y="${ly}" text-anchor="middle">${escapeHTML(g.name)}</text>${g.detail?`<text class="geo-detail" x="${lx}" y="${ly+18}" text-anchor="middle">${escapeHTML(g.detail)}</text>`:''}</g>`;}
 const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHTML(config.title+'. '+groups.map(g=>g.name+': '+g.role).join('; '))}"><defs><clipPath id="map-crop"><rect width="480" height="280" rx="3"/></clipPath></defs><g clip-path="url(#map-crop)">${shapes}${labels}</g></svg>`;
 return{svg,groups,title:config.title,note:config.note};
}
