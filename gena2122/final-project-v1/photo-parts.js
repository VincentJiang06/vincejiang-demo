/* Generated interpretive images, not archival photographs. Original plates are
   preserved; CSS windows show separate material stages/components. */
const PHOTO_PARTS={
 nail:{ratio:1983/793,parts:[['ore','Bog ore'],['pig','Pig iron'],['bar','Wrought bar'],['rod','Slitting stock'],['nail','Forged nail']]},
 cloth:{ratio:3,parts:[['fiber','Raw fiber'],['yarn','Spun yarn'],['warp','Warp yarns'],['weave','Woven cloth']]},
 can:{ratio:3,parts:[['canbody','Tinplate body'],['lid','Lid'],['contents','Cooked beef'],['seam','Seam detail']]},
 car:{ratio:3,parts:[['body','Body shell'],['frame','Chassis frame'],['engine','Engine'],['wheels','Wire wheels']]},
 tv:{ratio:3,parts:[['cabinet','Cabinet'],['crt','Picture tube'],['chassis','Electronic chassis'],['speaker','Speaker']]},
 phone:{ratio:1.5,parts:[['glass','Bonded display'],['electronics','Board + battery'],['case','Rear enclosure']]}
};
function photoDiagramFor(id){
 const p=PHOTO_PARTS[id],n=p.parts.length;
 return `<div class="photo-explosion ${id}" style="--parts:${n};--plate-ratio:${p.ratio}" aria-label="Interpretive ${id==='nail'||id==='cloth'?'material stages':'component study'}">${p.parts.map(([part,label],i)=>`<div class="diagram-part photo-part" data-part="${part}" data-order="${i}" style="--order:${i}"><div class="part-window" style="aspect-ratio:${p.ratio/n}"><img src="assets/exploded/${id}.png" alt="${label}; generated educational reconstruction" style="width:${n*100}%;left:${-i*100}%" decoding="async"></div><span class="diagram-label"><small>${String(i+1).padStart(2,'0')}</small>${label}</span></div>`).join('')}</div>`;
}
