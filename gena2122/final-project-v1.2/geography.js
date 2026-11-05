/* Colour encodes selected geographic roles, never output shares or complete sourcing territories. */
const MAP_COLORS={blue:'#356e9a',orange:'#be582f',green:'#3f7d69',gold:'#aa7b23',purple:'#80619a'};
const GEO_CASES={
  "nail": {
    "bounds": [
      -73.6,
      41,
      -69.2,
      43.7
    ],
    "title": "Massachusetts Bay · local production",
    "note": "Modern state outline for orientation. England supplied investment; this close view follows the local material network.",
    "groups": [
      {
        "key": "works",
        "color": "orange",
        "name": "Saugus",
        "role": "Smelting, refining and slitting iron",
        "states": [
          "Massachusetts"
        ],
        "point": [
          -71.01,
          42.47
        ],
        "label": [
          145,
          79
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
          352,
          156
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
          135,
          221
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
    "note": "Regional cotton evidence; no traced plantation. Canal freight preceded the 1835 public railway; an 1836 account, transmitted through a later railway history, still described merchandise arrangements as developing.",
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
        "role": "Water-powered textile mills",
        "states": [
          "Massachusetts"
        ],
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
      -126,
      24,
      -66,
      51.5
    ],
    "title": "Processing & retail · separate evidence",
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
          223,
          63
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
        "states": [
          "Illinois"
        ],
        "point": [
          -87.63,
          41.88
        ],
        "label": [
          363,
          119
        ],
        "locs": [
          "Chicago"
        ]
      },
      {
        "key": "market",
        "color": "green",
        "name": "Vacaville, California",
        "role": "1893 Armour retail advertisement",
        "states": [
          "California"
        ],
        "point": [
          -121.99,
          38.36
        ],
        "label": [
          91,
          207
        ],
        "locs": [
          "Vacaville"
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
    "note": "Selected Rouge resource connections, not all Model A assembly sites or suppliers. Distance does not identify ownership; Richmond’s 1931 assembly plant is later context.",
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
          -88,
          46
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
          182,
          119
        ],
        "locs": [
          "Iron Mountain"
        ]
      },
      {
        "key": "rouge",
        "color": "orange",
        "name": "Rouge, Dearborn",
        "role": "Manufacturing and final assembly",
        "states": [
          "Michigan"
        ],
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
        ]
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
    "title": "Indiana & Pennsylvania · factory roles",
    "note": "Selected RCA capacity, not this set’s component origins. Lancaster already made rectangular tubes; Marion’s tooling was announced. Cabinet origin is unknown.",
    "groups": [
      {
        "key": "indiana",
        "color": "orange",
        "name": "Indiana",
        "detail": "Bloomington · Indianapolis · Marion",
        "role": "Receivers (Bloomington) · components (Indianapolis) · picture tubes (Marion)",
        "states": [
          "Indiana"
        ],
        "point": [
          -86.4,
          40.1
        ],
        "label": [
          130,
          57
        ],
        "locs": [
          "Bloomington",
          "Indianapolis",
          "Marion"
        ]
      },
      {
        "key": "pennsylvania",
        "color": "blue",
        "name": "Lancaster, Pennsylvania",
        "role": "Picture tubes",
        "states": [
          "Pennsylvania"
        ],
        "point": [
          -76.31,
          40.04
        ],
        "label": [
          362,
          163
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
        "countries": [
          "United States of America"
        ],
        "point": [
          -122,
          37.3
        ],
        "label": [
          119,
          91
        ],
        "locs": [
          "California",
          "Marvell"
        ]
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
        ]
      },
      {
        "key": "europe",
        "color": "purple",
        "name": "Germany & United Kingdom",
        "role": "Infineon and CSR offices · not factories",
        "countries": [
          "Germany",
          "United Kingdom"
        ],
        "point": [
          7,
          51
        ],
        "label": [
          235,
          36
        ],
        "locs": [
          "Infineon",
          "CSR"
        ],
        "supplier": true
      },
      {
        "key": "korea",
        "color": "green",
        "name": "South Korea",
        "role": "Samsung headquarters · not a factory",
        "countries": [
          "South Korea"
        ],
        "point": [
          127,
          37
        ],
        "label": [
          407,
          82
        ],
        "locs": [
          "Samsung"
        ],
        "supplier": true
      }
    ]
  }
};
function renderGeography(c,world,states,globalContext,selected=null){
 const config=GEO_CASES[c.id],W=480,H=280,global=c.id==='phone'||globalContext;
 const bounds=global?[-180,-60,180,85]:config.bounds;
 const groups=config.groups.filter(g=>!g.supplier);
 const xy=(lon,lat)=>[(lon-bounds[0])/(bounds[2]-bounds[0])*W,(bounds[3]-lat)/(bounds[3]-bounds[1])*H];
 // Unwrap each polygon before projecting, so dateline crossings never paint across the world.
 const path=geometry=>(geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates).map(poly=>{
  const rings=poly.map(ring=>{let previous=ring[0][0];return ring.map(([lon,lat],i)=>{if(i){while(lon-previous>180)lon-=360;while(lon-previous< -180)lon+=360;}previous=lon;return[lon,lat];});});
  const xs=rings[0].map(p=>p[0]),lo=Math.min(...xs),hi=Math.max(...xs);
  return [-360,0,360].filter(offset=>hi+offset>=bounds[0]&&lo+offset<=bounds[2]).map(offset=>rings.map(ring=>ring.map(([lon,lat],i)=>{const[x,y]=xy(lon+offset,lat);return`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join('')+'Z').join('')).join('');
 }).join('');
 const groupAttr=g=>`data-map-group="${g.key}" style="--region-color:${MAP_COLORS[g.color]};opacity:${selected&&selected!==g.key?.45:1}"`;
 let shapes=(world?.features||[]).filter(f=>f.properties.name!=='Antarctica').map(f=>{const g=groups.find(g=>(g.countries||[]).includes(f.properties.name));return`<path class="geo-land ${g?'geo-colour':''}" ${g?groupAttr(g):''} d="${path(f.geometry)}"/>`}).join('');
 if(!global)shapes+=(states?.features||[]).filter(f=>!['Alaska','Hawaii'].includes(f.properties.name)).map(f=>{const g=groups.find(g=>(g.states||[]).includes(f.properties.name));return`<path class="geo-state ${g?'geo-colour':''}" ${g?groupAttr(g):''} d="${path(f.geometry)}"><title>${escapeHTML(f.properties.name)}</title></path>`}).join('');
 if(!global)shapes+=groups.filter(g=>g.wash).map(g=>{const[x,y]=xy(g.wash[0],g.wash[1]),rx=g.wash[2]/(bounds[2]-bounds[0])*W,ry=g.wash[3]/(bounds[3]-bounds[1])*H;return`<ellipse class="geo-wash" ${groupAttr(g)} cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`}).join('');
 const lines=name=>name.includes(', ')?name.split(', '):name==='Kentucky & West Virginia'?['Kentucky &','West Virginia']:[name];
 let labels='';
 for(const g of groups){const[x,y]=xy(...g.point);if(x<0||x>W||y<0||y>H)continue;
  let[lx,ly]=g.label;if(global&&c.id!=='phone'){lx=352;ly=44+groups.indexOf(g)*60;}
  const names=lines(g.name),half=Math.max(...names.map(s=>s.length))*4.2;
  lx=Math.max(half+4,Math.min(W-half-4,lx));ly=Math.max(20,Math.min(H-18*(names.length-1)-8,ly));
  labels+=`<g class="geo-label-group" ${groupAttr(g)}><path class="geo-leader" d="M${x},${y}L${lx},${ly-9}"/><circle class="geo-pin" cx="${x}" cy="${y}" r="4.5"/><text class="geo-label" x="${lx}" y="${ly}" text-anchor="middle">${names.map((s,i)=>`<tspan x="${lx}" dy="${i?18:0}">${escapeHTML(s)}</tspan>`).join('')}</text></g>`;
 }
 const svg=`<svg viewBox="-16 -16 512 312" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escapeHTML(config.title+'. '+groups.map(g=>g.name+': '+g.role).join('; '))}"><defs><clipPath id="map-crop"><rect width="480" height="280" rx="3"/></clipPath></defs><g clip-path="url(#map-crop)">${shapes}</g>${labels}</svg>`;
 return{svg,groups,title:config.title,note:config.note};
}
