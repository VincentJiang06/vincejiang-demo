/* Each component is an independently generated, intact image. No sprite windows. */
const PHOTO_PARTS={
 nail:{parts:[['ore','Bog ore'],['pig','Pig iron'],['bar','Wrought bar'],['rod','Nail rod'],['nail','Forged nail']]},
 cloth:{parts:[['fiber','Raw fiber'],['yarn','Spun yarn'],['warp','Warp yarns · arranged'],['weave','Woven cloth']]},
 can:{parts:[['canbody','Tinplate body'],['lid','Lid'],['contents','Cooked beef'],['seam','Soldered seam · detail']]},
 car:{parts:[['body','Body shell'],['frame','Chassis frame'],['engine','Engine'],['wheels','Wire wheel']]},
 tv:{parts:[['cabinet','Cabinet'],['crt','Picture tube'],['chassis','Electronic chassis'],['speaker','Speaker']]},
 phone:{parts:[['glass','Bonded display'],['electronics','Board + battery'],['case','Rear enclosure']]}
};
const MATERIAL_PLACES={nail:['Local inputs','Saugus','Saugus','Saugus','Dispersed workshops; some at Saugus'],cloth:['American South','Lowell','Lowell','Lowell']};
function photoDiagramFor(id){return `<div class="photo-explosion ${id}">${PHOTO_PARTS[id].parts.map(([part,label],i)=>`<figure class="photo-part" style="--order:${i}"><img src="assets/parts/${id}-${part}.png" alt="${label}; AI-generated historical interpretation" decoding="async"><figcaption class="diagram-label">${label}${MATERIAL_PLACES[id]?`<small class="material-place">${MATERIAL_PLACES[id][i]}</small>`:''}</figcaption></figure>`).join('')}</div>`;}
