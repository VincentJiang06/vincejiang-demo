/* Colour encodes selected geographic roles, never output shares or complete sourcing territories. */
const MAP_COLORS={blue:'#356e9a',orange:'#be582f',green:'#3f7d69',gold:'#aa7b23',purple:'#80619a'};
const GEO_CASES={
  "nail": {
    "bounds": [
      -71.22,
      42.28,
      -70.78,
      42.56
    ],
    "title": "Massachusetts Bay · local production",
    "note": "Modern state outline for orientation. English and colonial investors supported the works; this close view follows the local material network.",
    "groups": [
      {
        "key": "works",
        "color": "orange",
        "name": "Saugus",
        "role": "Smelting, refining and slitting iron",
        "point": [
          -71.01,
          42.47
        ],
        "label": [
          190,
          50
        ],
        "locs": [
          "Saugus"
        ]
      },
      {
        "key": "flux",
        "color": "blue",
        "name": "Nahant",
        "role": "Gabbro flux · supplied by boat",
        "point": [
          -70.92,
          42.43
        ],
        "label": [
          370,
          133
        ],
        "locs": [
          "Nahant"
        ]
      },
      {
        "key": "port",
        "color": "green",
        "name": "Boston",
        "role": "Warehouse and distribution",
        "point": [
          -71.06,
          42.36
        ],
        "label": [
          100,
          234
        ],
        "locs": [
          "Boston"
        ]
      }
    ]
  },
  "cloth": {
    "bounds": [
      -97,
      26,
      -66,
      47.5
    ],
    "title": "South & New England · different work",
    "note": "Regional cotton evidence; no traced plantation. Canal freight preceded the 1835 public railway; an 1836 account, transmitted through a later railway history, still described regular merchandise arrangements as developing, alongside small private-car shipments.",
    "groups": [
      {
        "key": "cotton",
        "color": "blue",
        "name": "American South",
        "role": "Raw cotton · regional evidence",
        "wash": [
          -87,
          33.2,
          7,
          3
        ],
        "point": [
          -87,
          33.2
        ],
        "label": [
          151,
          204
        ],
        "locs": [
          "American South"
        ]
      },
      {
        "key": "mills",
        "color": "orange",
        "name": "Lowell, Massachusetts",
        "mapLabel": "Lowell",
        "role": "Water-powered textile mills",
        "point": [
          -71.32,
          42.63
        ],
        "label": [
          335,
          42
        ],
        "locs": [
          "Lowell"
        ]
      },
      {
        "key": "port",
        "color": "green",
        "name": "Boston, Massachusetts",
        "mapLabel": "Boston",
        "role": "Port, merchants and transport",
        "point": [
          -71.06,
          42.36
        ],
        "label": [
          351,
          105
        ],
        "locs": [
          "Boston"
        ]
      }
    ]
  },
  "can": {
    "bounds": [
      -108,
      32,
      -79,
      49
    ],
    "title": "Midwest supply · Chicago processing",
    "note": "Midwest livestock and Chicago processing are industry-level evidence. The manufacturing origin and metal supplier of the cans advertised in Vacaville are unknown.",
    "groups": [
      {
        "key": "livestock",
        "color": "blue",
        "name": "Midwest",
        "role": "Livestock supply region",
        "wash": [
          -97,
          42,
          7,
          5
        ],
        "point": [
          -97,
          42
        ],
        "label": [
          145,
          60
        ],
        "locs": [
          "Midwest"
        ]
      },
      {
        "key": "packing",
        "color": "orange",
        "name": "Chicago, Illinois",
        "role": "Stockyards and meatpacking",
        "point": [
          -87.63,
          41.88
        ],
        "label": [
          354,
          160
        ],
        "locs": [
          "Chicago"
        ]
      }
    ]
  },
  "car": {
    "bounds": [
      -96,
      35,
      -73,
      50
    ],
    "title": "The Rouge & its material regions",
    "note": "Selected Rouge resource connections, not all Model A assembly sites or suppliers. Distance does not identify ownership; Richmond’s 1931 assembly plant is later context. The assembly anchor is 1928; selected resource relationships come from histories spanning several years.",
    "groups": [
      {
        "key": "minerals",
        "color": "blue",
        "name": "Great Lakes",
        "role": "Mineral supply region",
        "wash": [
          -88,
          46,
          4.9,
          2.1
        ],
        "point": [
          -90.5,
          46.6
        ],
        "label": [
          119,
          44
        ],
        "locs": [
          "Great Lakes"
        ]
      },
      {
        "key": "wood",
        "color": "green",
        "name": "Iron Mountain, Michigan",
        "role": "Wood processing → body suppliers",
        "point": [
          -88.06,
          45.82
        ],
        "label": [
          169,
          147
        ],
        "locs": [
          "Iron Mountain"
        ],
        "mapLabel": "Iron Mountain"
      },
      {
        "key": "rouge",
        "color": "orange",
        "name": "Rouge, Dearborn",
        "role": "Manufacturing and final assembly",
        "point": [
          -83.17,
          42.31
        ],
        "label": [
          359,
          146
        ],
        "locs": [
          "Rouge"
        ],
        "mapLabel": "Rouge · Dearborn"
      },
      {
        "key": "coal",
        "color": "gold",
        "name": "Kentucky & West Virginia",
        "role": "Coal supply regions",
        "states": [
          "Kentucky",
          "West Virginia"
        ],
        "point": [
          -83.4,
          37.6
        ],
        "label": [
          312,
          248
        ],
        "locs": [
          "Kentucky",
          "West Virginia"
        ]
      }
    ]
  },
  "tv": {
    "bounds": [
      -91,
      36.5,
      -74,
      43.8
    ],
    "title": "Four cities · three production roles",
    "note": "Selected RCA capacity, not this set’s component origins. Lancaster already made rectangular tubes; Marion’s tooling was announced. Cabinet origin is unknown.",
    "groups": [
      {
        "key": "receivers",
        "color": "orange",
        "name": "Bloomington, Indiana",
        "mapLabel": "Bloomington",
        "role": "Color receiver production",
        "point": [
          -86.5264,
          39.1653
        ],
        "label": [
          90,
          218
        ],
        "locs": [
          "Bloomington"
        ]
      },
      {
        "key": "components",
        "color": "green",
        "name": "Indianapolis, Indiana",
        "mapLabel": "Indianapolis",
        "role": "Television components",
        "point": [
          -86.1581,
          39.7684
        ],
        "label": [
          85,
          119
        ],
        "locs": [
          "Indianapolis"
        ]
      },
      {
        "key": "marion-tubes",
        "color": "blue",
        "name": "Marion, Indiana",
        "mapLabel": "Marion",
        "role": "Picture tubes; rectangular-tube tooling announced",
        "point": [
          -85.6591,
          40.5584
        ],
        "label": [
          200,
          55
        ],
        "locs": [
          "Marion"
        ]
      },
      {
        "key": "lancaster-tubes",
        "color": "blue",
        "name": "Lancaster, Pennsylvania",
        "mapLabel": "Lancaster",
        "role": "Picture tubes; rectangular tubes already in production",
        "point": [
          -76.3055,
          40.0379
        ],
        "label": [
          374,
          190
        ],
        "locs": [
          "Lancaster"
        ]
      }
    ]
  },
  "phone": {
    "bounds": [
      -180,
      -50,
      180,
      80
    ],
    "title": "A global product · evidence at two levels",
    "note": "California identifies Apple’s design location; China identifies final assembly at country level. These places do not establish the origin of each component or the location of every supplier factory.",
    "groups": [
      {
        "key": "america",
        "color": "blue",
        "name": "California, United States",
        "role": "Apple design and organization",
        "countries": [],
        "point": [
          -122,
          37.3
        ],
        "label": [
          56,
          162
        ],
        "locs": [
          "California"
        ],
        "states": [
          "California"
        ],
        "mapLabel": "California",
        "noPin": true
      },
      {
        "key": "china",
        "color": "orange",
        "name": "China",
        "role": "Final assembly · country-level evidence",
        "countries": [
          "China"
        ],
        "point": [
          105,
          34
        ],
        "label": [
          363,
          157
        ],
        "locs": [
          "China"
        ],
        "noPin": true
      }
    ],
    "global": true
  }
};
function mapConfigFor(id,mode){return mode==='markets'?MARKET_CASES[id]:GEO_CASES[id]}
function renderGeography(c,world,states,globalContext,selected=null,mode='production',labelScale=1){
 const config=mapConfigFor(c.id,mode),flow=mode==='production'?FLOW_CASES[c.id]:null,W=480,H=280,global=!!config.global||globalContext;
 const locatorOnly=global&&!config.global,bounds=global?[-180,-60,180,85]:config.bounds;
 const groups=config.groups.filter(g=>!g.supplier).map(g=>({...g,stage:flow?.numbers[g.key]}));
 const xy=(lon,lat)=>[(lon-bounds[0])/(bounds[2]-bounds[0])*W,(bounds[3]-lat)/(bounds[3]-bounds[1])*H];
 // Unwrap polygons before projection so dateline crossings never fill the whole world.
 const path=geometry=>(geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates).map(poly=>{
  const rings=poly.map(ring=>{let previous=ring[0][0];return ring.map(([lon,lat],i)=>{if(i){while(lon-previous>180)lon-=360;while(lon-previous< -180)lon+=360;}previous=lon;return[lon,lat];});});
  const xs=rings[0].map(p=>p[0]),lo=Math.min(...xs),hi=Math.max(...xs);
  return [-360,0,360].filter(offset=>hi+offset>=bounds[0]&&lo+offset<=bounds[2]).map(offset=>rings.map(ring=>ring.map(([lon,lat],i)=>{const[x,y]=xy(lon+offset,lat);return`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join('')+'Z').join('')).join('');
 }).join('');
 groups.sort((a,b)=>Number.parseInt(a.stage||'99')-Number.parseInt(b.stage||'99'));
 const groupAttr=g=>`data-map-group="${g.key}" style="--region-color:${MAP_COLORS[g.color]};opacity:${selected&&selected!==g.key?.35:1}"`;
 let shapes=(world?.features||[]).filter(f=>f.properties.name!=='Antarctica'&&!(c.id==='nail'&&!global&&mode==='production')).map(f=>{const g=groups.find(g=>(g.countries||[]).includes(f.properties.name));return`<path class="geo-land ${g?'geo-colour':''}" ${g?groupAttr(g):''} d="${path(f.geometry)}"/>`}).join('');
 if(!global&&!config.countryView)shapes+=(states?.features||[]).filter(f=>!['Alaska','Hawaii'].includes(f.properties.name)).map(f=>{const g=groups.find(g=>(g.states||[]).includes(f.properties.name));return`<path class="geo-state ${g?'geo-colour':''}" ${g?groupAttr(g):''} d="${path(f.geometry)}"><title>${escapeHTML(f.properties.name)}</title></path>`}).join('');
 if(global&&config.global)shapes+=(states?.features||[]).filter(f=>f.properties.name==='California').map(f=>`<path class="geo-state geo-colour" ${groupAttr(groups[0])} d="${path(f.geometry)}"/>`).join('');
 if(!global)shapes+=groups.filter(g=>g.wash).map(g=>{const[x,y]=xy(g.wash[0],g.wash[1]),rx=g.wash[2]/(bounds[2]-bounds[0])*W,ry=g.wash[3]/(bounds[3]-bounds[1])*H;return`<ellipse class="geo-wash" ${groupAttr(g)} cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`}).join('');
 let arrows='';
 if(flow&&!locatorOnly)for(const edge of flow.edges){
  const from=groups.find(g=>g.key===edge.from),to=groups.find(g=>g.key===edge.to);
  if(!from||!to)continue;
  const a=xy(...from.point),b=xy(...to.point),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
  const bend=edge.bend||0,q=[(a[0]+b[0])/2-dy/length*bend,(a[1]+b[1])/2+dx/length*bend];
  const trim=(p,t,d)=>{const l=Math.hypot(t[0]-p[0],t[1]-p[1]);return[p[0]+(t[0]-p[0])*d/l,p[1]+(t[1]-p[1])*d/l]};
  const start=trim(a,q,8),end=trim(b,q,10),d=`M${start}Q${q} ${end}`;
  const opacity=selected&&selected!==from.key&&selected!==to.key?.25:1;
  arrows+=`<g class="geo-connection" style="opacity:${opacity}"><path class="geo-arrow-halo" d="${d}"/><path class="geo-arrow ${edge.kind==='relation'?'relation':''}" d="${d}" marker-end="url(#flow-arrow)"><title>${escapeHTML(from.name+' → '+to.name+(edge.kind==='relation'?' · role relationship, not a traced shipment':' · material relationship, schematic route'))}</title></path></g>`;
 }
 const lines=name=>name.includes(', ')?name.split(', '):name==='Kentucky & West Virginia'?['Kentucky &','West Virginia']:[name];
 let labels='';
 for(const g of groups){const[x,y]=xy(...g.point);if(x<0||x>W||y<0||y>H)continue;
  let[lx,ly]=g.label;
  const names=lines(g.mapLabel||g.name);if(g.stage)names[0]=g.stage+' · '+names[0];
  const half=Math.max(...names.map(s=>s.length))*4.8*labelScale;
  lx=Math.max(half+5,Math.min(W-half-5,lx));ly=Math.max(20,Math.min(H-18*(names.length-1)-8,ly));
  labels+=`<g class="geo-label-group" ${groupAttr(g)}><path class="geo-leader" d="M${x},${y}L${lx},${ly-9}"/>${g.noPin?'':mode==='markets'?`<rect class="geo-pin" x="${x-4.5}" y="${y-4.5}" width="9" height="9"/>`:`<circle class="geo-pin" cx="${x}" cy="${y}" r="5"/>`}<text class="geo-label" style="font-size:${14*labelScale}px" x="${lx}" y="${ly}" text-anchor="middle">${names.map((s,i)=>`<tspan x="${lx}" dy="${i?18:0}">${escapeHTML(s)}</tspan>`).join('')}</text></g>`;
 }
 if(locatorOnly){
  const [left,top]=xy(config.bounds[0],config.bounds[3]),[right,bottom]=xy(config.bounds[2],config.bounds[1]);
  labels=`<g><rect x="${left}" y="${top}" width="${Math.max(8,right-left)}" height="${Math.max(8,bottom-top)}" fill="none" stroke="var(--accent)" stroke-width="2"/><text class="geo-label" style="font-size:${14*labelScale}px" x="${Math.max(62,(left+right)/2)}" y="${bottom+25}" text-anchor="middle">Case region</text></g>`;
 }
 const svg=`<svg viewBox="-16 -16 512 312" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeHTML(config.title+'. '+groups.map(g=>(g.stage?'Stage '+g.stage+'. ':'')+g.name+': '+g.role).join('; '))}"><defs><clipPath id="map-crop"><rect width="480" height="280" rx="3"/></clipPath><marker id="flow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L7 3.5L0 7Z" fill="var(--ink)"/></marker></defs><g clip-path="url(#map-crop)">${shapes}</g>${arrows}${labels}</svg>`;
 return{svg,groups,title:config.title,locatorOnly,canZoom:!config.global,flow,note:locatorOnly?'World locator. Return to Regional focus for named places and their roles; the box is a locator, not a supply or sales boundary.':flow?flow.note:config.note};
}
