const CHAPTERS = [
  {
    "id": "nail",
    "title": "铁钉与殖民地生产网络",
    "year": 1650,
    "period": "1646–1670 / focus: 1650s",
    "englishTitle": "A small nail, a wider network",
    "englishSummary": "At Saugus in the Massachusetts Bay Colony, concentrated iron processing supplied work beyond the ironworks. Workers smelted bog ore with charcoal and a mineral flux brought from Nahant. Refining produced wrought-iron bars; rolling and slitting turned some of those bars into nail rods. [S1, S3, S6]\n\nMost rods went to Boston and other New England settlements, although some nails were made at Saugus. The intermediate material could therefore leave the works before becoming a finished object. Water supported both mechanical power and transport, while English investment connected the works to an Atlantic commercial world. [S1, S7]\n\nThe nail represents a production network around 1650, before the United States existed. It makes the division between concentrated iron processing and dispersed finishing visible; no surviving specimen is traced through that network.",
    "document": "01-铁钉与殖民地生产网络.md",
    "objectStatus": "Interpretive nail and nail rod; not a uniquely provenanced surviving nail",
    "process": [
      {
        "name": "Gather materials",
        "description": "Local bog ore, charcoal, and gabbro shipped from nearby Nahant supply the works.",
        "sources": [
          "S3"
        ]
      },
      {
        "name": "Smelt",
        "description": "Charcoal and water-powered bellows help turn ore into pig iron.",
        "sources": [
          "S3"
        ]
      },
      {
        "name": "Refine and hammer",
        "description": "Further treatment produces workable wrought-iron merchant bars.",
        "sources": [
          "S5"
        ]
      },
      {
        "name": "Roll flat",
        "description": "Heated bars pass between water-powered rollers.",
        "sources": [
          "S6"
        ]
      },
      {
        "name": "Slit nail rods",
        "description": "Some flats are cut lengthwise into narrow intermediate products.",
        "sources": [
          "S6"
        ]
      },
      {
        "name": "Ship and forge nails",
        "description": "Nail rods reach Boston and other New England settlements for further work; some nails are made at Saugus.",
        "sources": [
          "S1"
        ]
      }
    ],
    "locations": [
      {
        "name": "Saugus, Massachusetts Bay Colony",
        "lat": 42.468,
        "lon": -71.008,
        "role": "Smelting, refining, rolling and slitting",
        "evidenceSource": "S1/S3/S6",
        "precision": "site vicinity",
        "mapKind": "production"
      },
      {
        "name": "Nahant",
        "lat": 42.426,
        "lon": -70.919,
        "role": "Gabbro flux supplied by boat",
        "evidenceSource": "S3",
        "precision": "locality, not a verified quarry coordinate",
        "mapKind": "production"
      },
      {
        "name": "Boston",
        "lat": 42.36,
        "lon": -71.059,
        "role": "Warehouse and distribution; destination for nail rods",
        "evidenceSource": "S1/S4",
        "precision": "city",
        "mapKind": "production"
      },
      {
        "name": "England",
        "lat": 52.0,
        "lon": -1.0,
        "role": "Investment connection, not a material shipment",
        "evidenceSource": "S2/S7",
        "precision": "region label",
        "mapKind": "office"
      }
    ],
    "connections": [
      {
        "from": "Nahant",
        "to": "Saugus, Massachusetts Bay Colony",
        "label": "Gabbro by boat",
        "type": "material",
        "source": "S3"
      },
      {
        "from": "Saugus, Massachusetts Bay Colony",
        "to": "Boston",
        "label": "Nail rods and iron goods",
        "type": "product",
        "source": "S1/S4"
      },
      {
        "from": "England",
        "to": "Saugus, Massachusetts Bay Colony",
        "label": "Investment connection",
        "type": "capital",
        "source": "S2/S7"
      }
    ],
    "animationNotes": "Show material transformations, not detachable head/shaft/tip. Label reconstruction. Do not imply a surviving nail has this documented individual itinerary.",
    "eraSummary": "In a British Atlantic colony, concentrated water-powered processing supplied smaller workshops and settlements.",
    "metricNote": "No comparable U.S. manufacturing share: United States not yet established.",
    "sources": [
      {
        "id": "S1",
        "title": "Take an Industrial Site Tour",
        "url": "https://www.nps.gov/thingstodo/take-an-industrial-site-tour.htm",
        "type": "secondary",
        "date": "2021-07-17"
      },
      {
        "id": "S2",
        "title": "Records of the iron works at Lynn, Mass., 1650–1686",
        "url": "https://hollisarchives.lib.harvard.edu/catalog/bak00269",
        "type": "primary collection; catalog only inspected",
        "date": "1650–1686"
      },
      {
        "id": "S3",
        "title": "Iron Making: Smelting",
        "url": "https://www.nps.gov/articles/000/iron-making-smelting.htm",
        "type": "secondary",
        "date": "2021-08-26"
      },
      {
        "id": "S4",
        "title": "Hammersmith Through the Historical Texts",
        "url": "https://www.nps.gov/sair/learn/historyculture/upload/03Chapter2-508x.pdf",
        "type": "secondary",
        "pages": "27–28"
      },
      {
        "id": "S5",
        "title": "The Forge and Slitting Mill",
        "url": "https://www.nps.gov/sair/learn/historyculture/upload/07Chapter6-2-508x.pdf",
        "type": "secondary with primary archaeological evidence",
        "pages": "137, 168"
      },
      {
        "id": "S6",
        "title": "Iron Making: Making Flats and Nail Rod",
        "url": "https://www.nps.gov/articles/000/iron-making-making-flats-and-nail-rod.htm",
        "type": "secondary",
        "date": "2021-11-30"
      },
      {
        "id": "S7",
        "title": "Management — Saugus Iron Works",
        "url": "https://home.nps.gov/sair/learn/management/index.htm",
        "type": "secondary",
        "date": "2022-03-14"
      }
    ],
    "processNote": "These stages organize the explanation; they are not a recovered factory instruction sheet.",
    "courseConnection": "Lecture 2, pp. 12–13: British colonies and commercial ties. Saugus supplies an independently researched material example. Lecture 1, pp. 25–26 informs the distinction between mapped evidence and inference.",
    "nav": "The iron nail",
    "headline": "A small nail.<br>A wider world.",
    "deck": "Follow a piece of iron through the places that made a colony.",
    "periodLabel": "A colonial production network",
    "specimen": "Hand-forged nail · Saugus network",
    "imageAlt": "Interpretive illustration of a hand-forged colonial iron nail",
    "question": "Why did a simple nail need more than one place?",
    "eraTitle": "Water, woodland & workshops",
    "mapCaption": "New England production, with an Atlantic investment connection.",
    "share": null,
    "researchUrl": "research/early/01-铁钉与殖民地生产网络.html"
  },
  {
    "id": "cloth",
    "title": "棉布与南北制造分工",
    "year": 1835,
    "period": "1830–1850 / anchor: 1835",
    "englishTitle": "Cotton from the South, cloth from Lowell",
    "englishSummary": "Lowell's northern mills depended on southern cotton produced through enslaved labor. Waterpower and investment concentrated processing in Massachusetts, while merchants and transport connected the mills to a wider economy. The Middlesex Canal carried materials and goods; the Boston and Lowell Railroad added a connection in 1835. [L1, L3, L6, L7]\n\nAn 1835 company table lists coarse clothing material among Lowell Manufacturing Company's products. The National Park Service identifies sales of such cloth to enslavers. These sources establish an economic connection between northern manufacturing and the plantation economy, without tracing one batch from cotton field to finished clothing. [L2, L3]\n\nRegional difference thus coexisted with dependence. The factory's location cannot separate its history from the coercion involved in supplying its raw material. The illustration follows fiber, yarn and woven cloth; it does not establish the exact composition of every textile in the company table.",
    "document": "02-棉布与南北制造分工.md",
    "objectStatus": "Interpretive cotton cloth; 1835 company table anchors industry, not a single SKU or fiber composition",
    "process": [
      {
        "name": "Prepare and ship cotton",
        "description": "Cotton from the American South enters a wider commercial and transport network.",
        "sources": [
          "L1"
        ]
      },
      {
        "name": "Open and clean",
        "description": "Loosen fiber and remove debris inside the mill.",
        "sources": [
          "L5"
        ]
      },
      {
        "name": "Card and draw",
        "description": "Align and combine fibers into sliver, then prepare roving.",
        "sources": [
          "L5"
        ]
      },
      {
        "name": "Spin yarn",
        "description": "Draw and twist roving into yarn wound on bobbins.",
        "sources": [
          "L5"
        ]
      },
      {
        "name": "Warp and weave",
        "description": "Prepare lengthwise warp threads and interlace crosswise yarn.",
        "sources": [
          "L5"
        ]
      },
      {
        "name": "Inspect and distribute",
        "description": "Finished cloth enters markets; finishing varies by product. Do not add dyeing as a universal step.",
        "sources": [
          "L1",
          "L2"
        ]
      }
    ],
    "locations": [
      {
        "name": "American South — cotton-growing region",
        "lat": 33.0,
        "lon": -88.0,
        "role": "Raw cotton region; label anchor, not a verified supplier location",
        "evidenceSource": "L1/L3",
        "precision": "regional label",
        "mapKind": "region"
      },
      {
        "name": "Boston",
        "lat": 42.36,
        "lon": -71.059,
        "role": "Port, investment and transport connection",
        "evidenceSource": "L1/L6/L7",
        "precision": "city",
        "mapKind": "production"
      },
      {
        "name": "Lowell, Massachusetts",
        "lat": 42.645,
        "lon": -71.309,
        "role": "Water-powered textile processing",
        "evidenceSource": "L1/L4/L5",
        "precision": "city",
        "mapKind": "production"
      }
    ],
    "connections": [
      {
        "from": "American South — cotton-growing region",
        "to": "Lowell, Massachusetts",
        "label": "Raw cotton: regional connection, exact route varies",
        "type": "regional material connection",
        "source": "L1/L3"
      },
      {
        "from": "Boston",
        "to": "Lowell, Massachusetts",
        "label": "Middlesex Canal; railway from 1835",
        "type": "transport corridor",
        "source": "L6/L7"
      },
      {
        "from": "Lowell, Massachusetts",
        "to": "American South — cotton-growing region",
        "label": "Some coarse clothing material sold to enslavers",
        "type": "regional market connection",
        "source": "L3"
      }
    ],
    "animationNotes": "Enlarge warp/weft and animate fiber-to-yarn-to-cloth. Not an exploded mechanical assembly. Distinguish transport canal from power canals; diagram links are not a verified shipment itinerary.",
    "eraSummary": "Waterpower and capital concentrated textile processing in Massachusetts while transport sustained links to distant raw-material regions and markets.",
    "metricNote": "Do not infer national manufacturing share from Lowell company output.",
    "sources": [
      {
        "id": "L1",
        "title": "Building America's Industrial Revolution: The Boott Cotton Mills of Lowell, Massachusetts",
        "url": "https://www.nps.gov/articles/building-america-s-industrial-revolution-the-boott-cotton-mills-of-lowell-massachusetts-teaching-with-historic-places.htm",
        "type": "secondary"
      },
      {
        "id": "L2",
        "title": "Lowell company statistics, 1835 — excerpt reproduced by NPS",
        "url": "https://www.nps.gov/lowe/learn/historyculture/images/Lowell-Co_3.png?autorotate=false&maxwidth=1300",
        "type": "primary image, inspected",
        "date": "1835",
        "localEvidence": "evidence/lowell-1835-statistics.png"
      },
      {
        "id": "L3",
        "title": "Southern Ties & Northern Gospels",
        "url": "https://www.nps.gov/lowe/learn/historyculture/southern-ties-northern-gospels.htm",
        "type": "secondary",
        "date": "2020-09-22"
      },
      {
        "id": "L4",
        "title": "Seeds of Industry",
        "url": "https://www.nps.gov/articles/lowell-handbook-seeds-of-industry.htm",
        "type": "secondary"
      },
      {
        "id": "L5",
        "title": "Making Textiles",
        "url": "https://www.nps.gov/articles/lowell-handbook-making-textiles.htm",
        "type": "secondary",
        "date": "2018-06-15"
      },
      {
        "id": "L6",
        "title": "Middlesex Canal",
        "url": "https://www.asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/middlesex-canal/",
        "type": "secondary"
      },
      {
        "id": "L7",
        "title": "The Boston & Lowell Rail Road — Summer Saunterings excerpt",
        "url": "https://libguides.uml.edu/early_lowell/Boston_and_Lowell_RR",
        "type": "primary retrospective text via university transcription",
        "date": "1885"
      },
      {
        "id": "L8",
        "title": "NPS Lowell historical development report, p.49",
        "url": "https://pubs.nps.gov/eTIC/LAMR-MANA/LOWE_475_131864_0001_of_0569.pdf",
        "type": "secondary; excerpt only inspected",
        "pages": "49"
      },
      {
        "id": "L9",
        "title": "Decline and Recovery — Lowell",
        "author": "National Park Service",
        "type": "secondary public history",
        "url": "https://www.nps.gov/lowe/learn/photosmultimedia/decline.htm",
        "date": "Undated; accessed 2026-11-04",
        "locator": "Industrial decline and relocation paragraphs",
        "verified": "Relevant paragraphs read; later context, not evidence of 1835 factory conditions."
      }
    ],
    "processNote": "These stages organize the explanation; they are not a recovered factory instruction sheet.",
    "courseConnection": "Lecture 3, slides 4–6: sectional identity and slavery. Lecture 4, slide 4 offers a later comparison with southern textile industrialization; it is not evidence about Lowell in 1835.",
    "nav": "Cotton cloth",
    "headline": "Two regions.<br>One fabric.",
    "deck": "The distance between a cotton field and a water-powered mill.",
    "periodLabel": "The early industrial republic",
    "specimen": "Coarse woven cloth · Lowell network",
    "imageAlt": "Interpretive illustration of folded coarse, unbleached woven cloth",
    "question": "How did distant regions become economically connected?",
    "eraTitle": "The geography of waterpower",
    "mapCaption": "Cotton-growing regions, Boston connections and Lowell mills.",
    "share": null,
    "researchUrl": "research/early/02-棉布与南北制造分工.html"
  },
  {
    "id": "can",
    "title": "一罐牛肉里的全国市场",
    "year": 1901,
    "period": "1893–1901",
    "englishTitle": "A nation in a can",
    "object": "Armour Corned Beef",
    "objectStatus": "Product name verified in 1893 retail advertisement; can geometry is schematic, not an authenticated package reconstruction.",
    "englishSummary": "Chicago's meatpacking industry concentrated processing where railways brought livestock from the Midwest. Around the Union Stock Yard, specialized work converted animals into meat and packaged products. Transport connected the processing center to both its material supply and distant customers. [M3, M4]\n\nArmour Corned Beef appeared in a Vacaville, California newspaper advertisement in 1893. An AFI catalog entry records can labeling at Armour's Chicago plant in 1901. The advertisement establishes a retail market; the catalog establishes a documented industrial activity. Neither traces the journey of an individual can. [M1, M2]\n\nSchwaab's 1890 handbook describes cooking, deboning and packing corned beef. It supports the process explanation at industry level, without supplying an Armour factory recipe. Canning and refrigerated fresh-beef transport were distinct preservation systems. The can brings the relationship between regional livestock, urban processing and national markets into view. [M5, p. 113]",
    "question": "Why did meatpacking concentrate in Chicago?",
    "process": [
      {
        "name": "Receive livestock",
        "description": "Railways bring livestock from the Midwest to Chicago’s stockyards.",
        "sources": [
          "M3",
          "M4"
        ]
      },
      {
        "name": "Slaughter and divide",
        "description": "Packing plants divide the animal into meat and other material streams.",
        "sources": [
          "M3"
        ]
      },
      {
        "name": "Prepare and cook",
        "description": "An 1890 industry handbook describes corned beef cooked before removal from the bone; not an Armour factory recipe.",
        "sources": [
          "M5"
        ]
      },
      {
        "name": "Bone and pack",
        "description": "Prepared meat is packed tightly into cans.",
        "sources": [
          "M5"
        ]
      },
      {
        "name": "Seal and process",
        "description": "Period canning combines capping, exhausting, closing the vent and heat processing. No exact Armour parameters are claimed.",
        "sources": [
          "M5"
        ]
      },
      {
        "name": "Label and distribute",
        "description": "A 1901 catalogue records Armour’s Chicago labeling department; a California advertisement identifies a distant market.",
        "sources": [
          "M1",
          "M2"
        ]
      }
    ],
    "components": [
      {
        "name": "Tinplate shell",
        "kind": "schematic"
      },
      {
        "name": "Packed beef",
        "kind": "schematic"
      },
      {
        "name": "Sealed lid",
        "kind": "schematic"
      },
      {
        "name": "Paper label",
        "kind": "schematic"
      }
    ],
    "locations": [
      {
        "name": "Midwest livestock region",
        "lat": 41.7,
        "lon": -94,
        "role": "Regional livestock supply; illustrative label anchor, not a traced ranch",
        "evidenceSource": "M4",
        "precision": "region",
        "mapKind": "region"
      },
      {
        "name": "Chicago / Union Stock Yard",
        "lat": 41.82,
        "lon": -87.65,
        "role": "Livestock receiving and meat processing",
        "evidenceSource": "M2, M3, M4",
        "precision": "district",
        "mapKind": "production"
      },
      {
        "name": "Vacaville, California",
        "lat": 38.3566,
        "lon": -121.9877,
        "role": "1893 retail advertisement; no direct shipping route established",
        "evidenceSource": "M1",
        "precision": "city",
        "mapKind": "retail"
      }
    ],
    "connections": [
      {
        "from": "Midwest livestock region",
        "to": "Chicago / Union Stock Yard",
        "kind": "regional-material-flow",
        "label": "Livestock by rail; no exact batch traced"
      },
      {
        "from": "Chicago / Union Stock Yard",
        "to": "Vacaville, California",
        "kind": "market-context",
        "label": "Distant retail evidence; route and manufacturing batch unverified"
      }
    ],
    "eraSummary": "Railways and food processing allowed industrial cities to connect dispersed agricultural regions with distant customers.",
    "limits": [
      "Do not conflate canned beef with refrigerated fresh-beef distribution.",
      "Do not use a Chicago company label as proof of the manufacturing address of any individual can.",
      "Industry handbook methods are not a recovered Armour operating manual."
    ],
    "sources": [
      {
        "id": "M1",
        "title": "Vacaville Reporter, January 28, 1893, page 3",
        "url": "https://www.vacavilleheritagecouncil.org/oni/lccn/sn93004521/1893-01-28/ed-1/seq-3/",
        "type": "primary",
        "date": "1893-01-28"
      },
      {
        "id": "M2",
        "title": "Labeling Cans, AFI Catalog record",
        "url": "https://catalog.afi.com/Film/30841-LABELING-CANS",
        "type": "secondary catalogue",
        "date": "Modern catalogue of a 1901 film",
        "verified": "Catalogue consulted; original film not viewed."
      },
      {
        "id": "M3",
        "title": "Meatpacking, Encyclopedia of Chicago",
        "url": "https://encyclopedia.chicagohistory.org/pages/804.html",
        "type": "secondary",
        "date": "2005"
      },
      {
        "id": "M4",
        "title": "Stockyards & Industry, Chicago History Museum",
        "url": "https://www.chicagohistory.org/app/uploads/2023/08/English.Stockyards-Industry-Video-Script-FINAL.pdf",
        "type": "secondary",
        "date": null
      },
      {
        "id": "M5",
        "title": "Ernest F. Schwaab, The Secrets of Canning, p.113",
        "url": "https://tile.loc.gov/storage-services/public/gdcmassbookdig/secretsofcanning00schw/secretsofcanning00schw.pdf",
        "type": "primary",
        "date": "1890"
      },
      {
        "id": "M6",
        "title": "Warshaw Collection, Meat: finding aid",
        "url": "https://sova.si.edu/components/nmah.ac.0060.s01.01.meat",
        "type": "finding-aid",
        "date": null
      }
    ],
    "researchFile": "03-肉罐头-铁路如何把食物变成全国性工业品.md",
    "processNote": "These stages organize the explanation; they are not a recovered factory instruction sheet.",
    "courseConnection": "Lecture 4, slides 6–7: rail expansion, concentrated capital and industrial labor. Slide 15 supplies the later context of food regulation; the 1901 case predates those reforms.",
    "nav": "Canned beef",
    "headline": "A continent<br>inside a can.",
    "deck": "How a railway city turned distant livestock into a travelling product.",
    "periodLabel": "The age of national markets",
    "specimen": "Corned beef tin · Armour case, 1893–1901",
    "imageAlt": "Interpretive illustration of a period corned beef tin, not an original Armour label",
    "eraTitle": "Railways make a national market",
    "mapCaption": "Regional livestock, Chicago processing and distant retail evidence.",
    "share": null,
    "researchUrl": "research/middle/03-肉罐头-铁路如何把食物变成全国性工业品.html"
  },
  {
    "id": "car",
    "title": "一座工厂背后的多地网络",
    "year": 1928,
    "period": "1928–1931",
    "englishTitle": "The factory beyond its gates",
    "object": "Ford Model A",
    "objectStatus": "1928–1931 family; illustration must be labeled schematic until exact body style is tied to an artifact.",
    "englishSummary": "A photograph dated February 8, 1928 records Model A assembly at Ford's Rouge complex. It anchors the case to a specific production arrangement, after Rouge had previously supplied Model T engines and parts for assembly elsewhere. [F1, F5]\n\nRouge depended on resources beyond Dearborn. Coal came from Kentucky and West Virginia; Great Lakes resources and wood processing in Michigan's Upper Peninsula belonged to a wider network. Ships and railways connected external supplies with the complex, and rail transport also moved materials within it. Iron Mountain's wooden body parts passed through other Ford suppliers. [F3, F4]\n\nAssembly brought several production streams together. It did not make the factory territorially self-sufficient. Dates limit the reconstruction: Ford made safety glass at Rouge by 1930, so that arrangement cannot be assigned to every 1928 car. The illustrated body, frame, engine and wheels explain major systems rather than a verified factory assembly order. [F5, F7]",
    "question": "Could one enormous factory ever stand alone?",
    "process": [
      {
        "name": "Receive materials",
        "description": "Ships and railways bring ore, limestone and coal to the Rouge complex.",
        "sources": [
          "F2",
          "F3"
        ]
      },
      {
        "name": "Smelt and roll",
        "description": "Metallurgical plants prepare iron and steel for automotive manufacturing.",
        "sources": [
          "F5"
        ]
      },
      {
        "name": "Cast and machine",
        "description": "Casting and machining prepare engine and other components; exact workstation times are not established.",
        "sources": [
          "F5",
          "F6"
        ]
      },
      {
        "name": "Prepare components",
        "description": "Body, glass and other components are prepared in parallel, including work outside Rouge.",
        "sources": [
          "F4",
          "F5"
        ]
      },
      {
        "name": "Assemble chassis",
        "description": "Component streams meet in Model A assembly, documented in a February 1928 factory photograph.",
        "sources": [
          "F1"
        ]
      },
      {
        "name": "Join and finish",
        "description": "Body and chassis become a finished automobile; outbound routes varied and are not reconstructed here.",
        "sources": [
          "F1"
        ]
      }
    ],
    "components": [
      {
        "name": "Body",
        "kind": "schematic"
      },
      {
        "name": "Chassis",
        "kind": "schematic"
      },
      {
        "name": "Four-cylinder engine",
        "kind": "schematic"
      },
      {
        "name": "Wheels",
        "kind": "schematic"
      },
      {
        "name": "Glazing",
        "kind": "schematic"
      }
    ],
    "locations": [
      {
        "name": "Rouge, Dearborn",
        "lat": 42.303,
        "lon": -83.158,
        "role": "Integrated manufacturing and Model A final assembly",
        "evidenceSource": "F1, F2",
        "precision": "industrial-site",
        "mapKind": "production"
      },
      {
        "name": "Great Lakes resource region",
        "lat": 46.5,
        "lon": -87.5,
        "role": "Regional mineral supply; no single mine or batch assigned",
        "evidenceSource": "F5",
        "precision": "region",
        "mapKind": "region"
      },
      {
        "name": "Kentucky coal region",
        "lat": 37.5,
        "lon": -83.5,
        "role": "Coal supply region in museum account",
        "evidenceSource": "F3",
        "precision": "region",
        "mapKind": "region"
      },
      {
        "name": "West Virginia coal region",
        "lat": 38.5,
        "lon": -81,
        "role": "Coal supply region in museum account",
        "evidenceSource": "F3",
        "precision": "region",
        "mapKind": "region"
      },
      {
        "name": "Iron Mountain, Michigan",
        "lat": 45.82,
        "lon": -88.06,
        "role": "Wood processing and components sent to body suppliers; not necessarily direct to Rouge",
        "evidenceSource": "F4",
        "precision": "city",
        "mapKind": "production"
      }
    ],
    "connections": [
      {
        "from": "Great Lakes resource region",
        "to": "Rouge, Dearborn",
        "kind": "regional-material-flow",
        "label": "Great Lakes materials; regional schematic"
      },
      {
        "from": "Kentucky coal region",
        "to": "Rouge, Dearborn",
        "kind": "regional-material-flow",
        "label": "Coal; specific mines not assigned"
      },
      {
        "from": "West Virginia coal region",
        "to": "Rouge, Dearborn",
        "kind": "regional-material-flow",
        "label": "Coal; specific mines not assigned"
      },
      {
        "from": "Iron Mountain, Michigan",
        "to": "Rouge, Dearborn",
        "kind": "network-context",
        "label": "Wood parts via body suppliers; schematic, not a direct route"
      }
    ],
    "eraSummary": "Industrial integration concentrated many operations at Rouge while retaining connections to remote resources and outside suppliers.",
    "limits": [
      "1930 in-house safety-glass production must not be backdated to 1928.",
      "Rouge tire manufacture began in 1937, outside the case period.",
      "Do not present a 1940 factory flowchart as a 1928 production plan."
    ],
    "sources": [
      {
        "id": "F1",
        "title": "Ford Model A Assembly Line, Rouge, February 8, 1928",
        "url": "https://www.thehenryford.org/collections/explore/artifact/22694",
        "type": "primary",
        "date": "1928-02-08"
      },
      {
        "id": "F2",
        "title": "Charles Sheeler, Boat Slip at Ford Rouge Plant",
        "url": "https://www.thehenryford.org/collections/explore/artifact/160247?AssetId=THF118362",
        "type": "primary",
        "date": "1927"
      },
      {
        "id": "F3",
        "title": "Ford Rouge Railroad, The Henry Ford",
        "url": "https://www.thehenryford.org/collections/explore/sets/detail/ford-rouge-railroad",
        "type": "secondary",
        "date": null
      },
      {
        "id": "F4",
        "title": "Matt Anderson, Building Ford Station Wagons at Iron Mountain",
        "url": "https://www.thehenryford.org/collections/explore/sets/detail/building-ford-station-wagons-at-iron-mountain",
        "type": "secondary",
        "date": null
      },
      {
        "id": "F5",
        "title": "Ford Rouge Factory Tour: History & Timeline",
        "url": "https://www.thehenryford.org/collections/explore/popular-research-topics/ford-rouge-factory-tour-history-and-timeline",
        "type": "secondary",
        "date": "2025-12-12"
      },
      {
        "id": "F6",
        "title": "Engine and Foundry production records finding aid, Accession 417",
        "url": "https://findingaids.thehenryford.org/xtf/data/pdf/417_EngineAndFoundryDivisionProductionProgramAndControlDepartmentRecordsSeries.pdf",
        "type": "finding-aid",
        "date": "1954-07-27"
      },
      {
        "id": "F7",
        "title": "Advertisement Collection chronology, p.40",
        "url": "https://findingaids.thehenryford.org/xtf/data/pdf/19_AdvertisementCollection.pdf",
        "type": "finding-aid",
        "date": null
      },
      {
        "id": "F8",
        "title": "Ford, From Source to Service advertisement",
        "url": "https://www.thehenryford.org/collections/explore/artifact/372070?AssetId=THF95516",
        "type": "primary",
        "date": "1924"
      }
    ],
    "researchFile": "04-Model-A-一座工厂背后的多地网络.md",
    "processNote": "These stages organize the explanation; they are not a recovered factory instruction sheet. Component preparation can occur in parallel; the numbered list does not imply one global serial line.",
    "courseConnection": "Lecture 5, slide 10: automobiles and manufacturing in the 1920s. Slide 12 places northern industrial jobs within the Great Migration; it does not identify the workers in the photographed assembly line.",
    "nav": "The Model A",
    "headline": "One factory.<br>Many places.",
    "deck": "Behind the Rouge’s enormous gates lay a much larger production network.",
    "periodLabel": "The integrated industrial complex",
    "specimen": "Ford Model A · 1928–1931 family illustration",
    "imageAlt": "Interpretive illustration of a Model A sedan; not a factory drawing of a particular 1928 vehicle",
    "eraTitle": "Industrial concentration",
    "mapCaption": "Resources converged on Rouge; some parts passed through other suppliers.",
    "share": null,
    "researchUrl": "research/middle/04-Model-A-一座工厂背后的多地网络.html"
  },
  {
    "id": "tv",
    "title": "RCA彩色电视机：区域工厂的协作",
    "year": 1965,
    "period": "1965",
    "englishTitle": "Color, made across cities",
    "object": "RCA color television, CTC-16-era schematic",
    "englishSummary": "In June 1965, Broadcasting described RCA's expanding color-television operations. Bloomington made receivers; Indianapolis supplied components; Marion and Lancaster made picture tubes. One finished set depended on specialized production across several American cities. [R1, pp. 28–29]\n\nThe report also exposed a constraint: suitable picture tubes limited the number of sets the industry could supply. Moving from round to rectangular tubes required investment and production adjustments. Additional assembly capacity alone could not resolve that problem. Forecasts and announced expansion remain distinct from completed capacity. [R1, pp. 28–29]\n\nThe cabinet, picture tube, electronic chassis and speaker make these functions visible. Their separation is interpretive: the sources do not identify a factory for every part of this illustrated cabinet. The map records selected RCA plant roles. It supports comparison with Apple's coordination of external manufacturers, while providing a different kind of geographical evidence. [R1, R2]",
    "chapterFile": "05-RCA彩色电视机-区域工厂网络.md",
    "question": "Why did one television depend on several industrial cities?",
    "eraSummary": "Specialized components and receiver assembly formed an interconnected US manufacturing network.",
    "processNote": "Six-stage teaching reconstruction, not a factory station plan. Components may be made in parallel. Component preparation can occur in parallel; the numbered list does not imply one global serial line.",
    "process": [
      {
        "name": "Picture tube",
        "description": "Specialized plants manufacture the image-forming tube.",
        "source": [
          "R1"
        ],
        "evidence": "Documented plant role; detailed sequence not reconstructed"
      },
      {
        "name": "Components",
        "description": "Prepare electronic components and chassis assemblies.",
        "source": [
          "R1",
          "R2"
        ],
        "evidence": "Documented component role and structural references"
      },
      {
        "name": "Circuit assembly",
        "description": "Connect the circuits on the receiver chassis.",
        "source": [
          "R2"
        ],
        "evidence": "Structural inference, not exact production order"
      },
      {
        "name": "Cabinet & controls",
        "description": "Prepare the enclosure, speaker and controls.",
        "source": [
          "R2"
        ],
        "evidence": "Teaching reconstruction; specific cabinet factory not established"
      },
      {
        "name": "Receiver assembly",
        "description": "Bring the picture tube, chassis and enclosure together.",
        "source": [
          "R1",
          "R2"
        ],
        "evidence": "Documented receiver role; individual batch not traced"
      },
      {
        "name": "Adjustment",
        "description": "Check and adjust the picture and color circuits.",
        "source": [
          "R2"
        ],
        "evidence": "Service procedures establish adjustment needs, not factory SOP"
      }
    ],
    "parts": [
      "Cabinet",
      "Picture tube",
      "Electronic chassis",
      "Speaker",
      "Controls"
    ],
    "locations": [
      {
        "name": "Bloomington, Indiana",
        "lat": 39.1653,
        "lon": -86.5264,
        "role": "Color receiver production",
        "evidenceSource": "R1",
        "precision": "city",
        "certainty": "documented 1965 plant function",
        "mapKind": "production"
      },
      {
        "name": "Indianapolis, Indiana",
        "lat": 39.7684,
        "lon": -86.1581,
        "role": "Television components",
        "evidenceSource": "R1",
        "precision": "city",
        "certainty": "documented 1965 plant function",
        "mapKind": "production"
      },
      {
        "name": "Marion, Indiana",
        "lat": 40.5584,
        "lon": -85.6591,
        "role": "Color picture tubes",
        "evidenceSource": "R1",
        "precision": "city",
        "certainty": "documented 1965 plant function",
        "mapKind": "production"
      },
      {
        "name": "Lancaster, Pennsylvania",
        "lat": 40.0379,
        "lon": -76.3055,
        "role": "Color picture tubes",
        "evidenceSource": "R1/R4",
        "precision": "city",
        "certainty": "documented 1965 plant function",
        "mapKind": "production"
      }
    ],
    "mapNote": "City-level production roles. Lines are schematic connections, not verified freight routes or a serial-number bill of materials.",
    "sources": [
      {
        "id": "R1",
        "title": "Broadcasting, 21 June 1965: RCA Expansion / Tube Expansion",
        "date": "1965-06-21",
        "type": "primary",
        "url": "https://device.report/m/f6d8e80e9bcc56abc09058c692502ce3de14da6fb193f40cd1704b4e8bf0f054.pdf",
        "locator": "Printed pp. 28–29",
        "verified": "Relevant PDF text read via browser; direct download blocked"
      },
      {
        "id": "R2",
        "title": "RCA Television [service-department bulletin], Volume XVI, Issue 1: CTC16X",
        "date": "1965-08-27",
        "type": "primary",
        "url": "https://device.report/m/375c47200a245bb59ba492fdce5a4b9ae4612a703c72164e5ac3f8a927cbc9d4",
        "locator": "First bulletin, PDF pp.1–2",
        "verified": "Manufacturer bulletin text read"
      },
      {
        "id": "R4",
        "title": "Hagley: David Sarnoff Library Collections, RCA/Thomson Lancaster records",
        "date": null,
        "type": "secondary_catalog",
        "url": "https://www.hagley.org/david-sarnoff-library-collections",
        "locator": "Accession 2464.74",
        "verified": "Catalog read, archival documents not all inspected"
      },
      {
        "id": "R5",
        "title": "Jefferson Cowie, Capital Moves: Introduction",
        "date": "1999",
        "type": "secondary",
        "url": "https://ecommons.cornell.edu/entities/publication/4c5a39de-e388-42b0-9621-443567f0d81c",
        "locator": "Introduction pp.1–8; downloaded excerpt from later New Press edition",
        "verified": "Excerpt downloaded/read, not complete book"
      }
    ],
    "limitations": [
      "Exact cabinet model not locked; illustration must say schematic.",
      "1956 Monticello cabinet evidence is not reused as a 1965 claim.",
      "1966 Memphis expansion is later context, not a 1965 production node."
    ],
    "courseConnection": "Lecture 6, slide 8: postwar suburban growth and changing regional opportunities. RCA's particular factory network comes from outside research; the lecture does not establish these plant assignments.",
    "nav": "Color television",
    "headline": "Color, made<br>across cities.",
    "deck": "One living-room cabinet. Several cities of industrial expertise.",
    "periodLabel": "The postwar consumer economy",
    "specimen": "RCA color television · CTC-16-era schematic",
    "imageAlt": "Interpretive illustration of a 1960s wooden color television, not a verified cabinet model",
    "eraTitle": "Specialized factories, shared products",
    "mapCaption": "Documented 1965 RCA production roles, not traced freight routes.",
    "share": 25.8,
    "connections": [
      {
        "from": "Indianapolis, Indiana",
        "to": "Bloomington, Indiana",
        "label": "Documented RCA plant roles; connection schematic, no freight itinerary",
        "type": "production roles"
      },
      {
        "from": "Marion, Indiana",
        "to": "Bloomington, Indiana",
        "label": "Documented RCA plant roles; connection schematic, no freight itinerary",
        "type": "production roles"
      },
      {
        "from": "Lancaster, Pennsylvania",
        "to": "Bloomington, Indiana",
        "label": "Documented RCA plant roles; connection schematic, no freight itinerary",
        "type": "production roles"
      }
    ],
    "researchUrl": "research/late/05-RCA彩色电视机-区域工厂网络.html"
  },
  {
    "id": "phone",
    "title": "第一代iPhone：设计、制造与总装的跨国分工",
    "year": 2007,
    "period": "2007",
    "englishTitle": "Designed here. Assembled elsewhere.",
    "object": "Apple iPhone A1203, first generation, 8GB",
    "englishSummary": "The original iPhone's packaging identifies California as the design region and China as the assembly country. Apple's 2007 annual report confirms third-party assembly in China for its portable products, including the iPhone. These sources establish different contributions to one product without identifying a specific assembly plant. [I1, I4]\n\nThe 2007 8GB teardown, consulted in a later-revised version, identifies specialized components. Paired with company records, it supports an optional map of supplier organizations in South Korea, Germany, Britain and California. Those locations are offices or organizational centers, not established factories for the components inside this phone. [I3, I6–I9]\n\nThe internal structure joins a bonded front display to an upper logic board, a battery below it with soldered leads, and a rear enclosure. The illustration preserves those relationships. The case shows how an American firm's product organization could coordinate specialized companies across borders. Later repair guidance informs the illustration; later supply-chain disclosures are dated separately. [I3, I10]",
    "chapterFile": "06-iPhone-全球生产网络.md",
    "question": "Which places perform which tasks in a global product?",
    "eraSummary": "A US product organization coordinated specialized suppliers and final assembly overseas.",
    "processNote": "Teaching reconstruction based on physical structure and corporate disclosures, not a 2007 factory SOP. Component preparation can occur in parallel; the numbered list does not imply one global serial line.",
    "process": [
      {
        "name": "Specialized parts",
        "description": "Suppliers produce electronic, display, battery and mechanical parts.",
        "source": [
          "I3",
          "I4"
        ],
        "evidence": "Supplier roles and physical parts; factories not all known"
      },
      {
        "name": "Circuit modules",
        "description": "Components are connected into the logic-board system.",
        "source": [
          "I3"
        ],
        "evidence": "Structural inference from teardown"
      },
      {
        "name": "Display assembly",
        "description": "Prepare a bonded glass/touch/LCD front display assembly.",
        "source": [
          "I3",
          "I10"
        ],
        "evidence": "Physical structure; exact manufacturing order unverified"
      },
      {
        "name": "Integration",
        "description": "Connect the upper board, camera, lower battery and antennas; the original battery uses soldered wires.",
        "source": [
          "I3"
        ],
        "evidence": "Connections observed; sequence reconstructed"
      },
      {
        "name": "Enclosure",
        "description": "Secure the assemblies within the metal and plastic case.",
        "source": [
          "I3"
        ],
        "evidence": "Physical structure; factory order unverified"
      },
      {
        "name": "Release",
        "description": "Complete checks, software preparation and packaging for distribution.",
        "source": [
          "I2",
          "I4"
        ],
        "evidence": "General production stage; exact test stations and transport not documented"
      }
    ],
    "parts": [
      "Bonded front display assembly",
      "Upper stacked logic board",
      "Lower solder-connected battery",
      "Rear enclosure",
      "Lower antenna section"
    ],
    "locations": [
      {
        "name": "California, United States",
        "lat": 37.323,
        "lon": -122.0322,
        "role": "Apple product design and coordination; Cupertino headquarters anchor",
        "evidenceSource": "I1/I4",
        "precision": "region",
        "certainty": "design region documented; marker is not every design location",
        "mapKind": "office"
      },
      {
        "name": "China",
        "lat": 35.0,
        "lon": 105.0,
        "role": "Final assembly by third-party manufacturers",
        "evidenceSource": "I1/I4",
        "precision": "country",
        "certainty": "country verified; marker is not a factory",
        "mapKind": "region"
      }
    ],
    "mapNote": "Two layers: California design and China country-level assembly; hollow supplier-company nodes in Korea, Germany, Britain and California. Supplier headquarters are not component factories. Connections indicate participation, never traced freight routes.",
    "supplierIdentityNote": "Contemporary teardown identifies markings from Samsung, Wolfson, Marvell, CSR and Infineon; identities are not factory geolocation. Early uncertain identifications remain uncertain.",
    "sources": [
      {
        "id": "I1",
        "title": "The Henry Ford: iPhone, 2007, A1203 8GB and packaging",
        "date": "2007",
        "type": "primary_artifact_secondary_catalog",
        "url": "https://www.thehenryford.org/collections/explore/artifact/359642",
        "locator": "Object 2008.146.1",
        "verified": "Catalog and packaging transcription read"
      },
      {
        "id": "I2",
        "title": "Apple: iPhone Premieres This Friday Night at Apple Retail Stores",
        "date": "2007-06-28",
        "type": "primary",
        "url": "https://www.apple.com/newsroom/2007/06/28iPhone-Premieres-This-Friday-Night-at-Apple-Retail-Stores/",
        "locator": "Pricing and Availability",
        "verified": "Official announcement read"
      },
      {
        "id": "I3",
        "title": "Luke Soules et al.: iPhone 1st Generation Teardown",
        "date": "2007-06-29",
        "type": "primary_observation_revised",
        "url": "https://www.ifixit.com/Teardown/iPhone+1st+Generation+Teardown/599",
        "locator": "Steps 7–13,20–26; saved PDF draft 2020-04-08",
        "verified": "Web/PDF read; not frozen 2007 version"
      },
      {
        "id": "I4",
        "title": "Apple Inc. 2007 Form 10-K",
        "date": "2007",
        "type": "primary",
        "url": "https://www.annualreports.com/HostedData/AnnualReportArchive/a/NASDAQ_AAPL_2007.pdf",
        "locator": "Printed pp.11–12,16–17,23",
        "verified": "Downloaded/text checked"
      },
      {
        "id": "I5",
        "title": "Dedrick, Kraemer and Linden: The distribution of value in the mobile phone supply chain",
        "date": "2011",
        "type": "secondary",
        "url": "https://escholarship.org/uc/item/70w6s39x",
        "locator": "Telecommunications Policy35,505–521; methods pp.507–508",
        "verified": "Methods read; not treated as original iPhone BOM"
      },
      {
        "id": "I6",
        "title": "Samsung Electronics, Annual Report 2007",
        "date": "2007",
        "type": "primary",
        "url": "https://images.samsung.com/is/content/samsung/p5/za/aboutsamsung/2017/pdf/about-us-sustainability-report-and-policy-annual-report-2007-en.pdf",
        "locator": "Printed p.133 / PDF p.135, Global Network: Headquarters",
        "verified": "同期公司年报，第一手；核验首尔总部，不能据此推断原代 iPhone 闪存具体工厂。"
      },
      {
        "id": "I7",
        "title": "Infineon Technologies AG, Form 20-F for fiscal year ended September 30, 2007",
        "date": "2007",
        "type": "primary",
        "url": "https://www.sec.gov/Archives/edgar/data/1107457/000132693207000503/f01842e20vf.htm",
        "locator": "Cover: incorporation and principal executive offices",
        "verified": "同期法定披露，第一手；德国注册地和 Neubiberg 行政办公地。"
      },
      {
        "id": "I8",
        "title": "CSR plc, Chairman Succession",
        "date": "2007-02-22",
        "type": "primary",
        "url": "https://media.corporate-ir.net/media_files/irol/17/177117/press/2007-02-22c.pdf",
        "locator": "p.2, About CSR",
        "verified": "同期公司公告，第一手；Cambridge UK 总部与 BlueCore 平台能力。"
      },
      {
        "id": "I9",
        "title": "Marvell Introduces World's First Ultra Low-Power 90nm WLAN Single Chip Solution",
        "date": "2005-07-20",
        "type": "primary",
        "url": "https://www.marvell.com/company/newsroom/marvell-introduces-worlds-first-ultra-low-power-90nm-wlan-single-chip-solution.html",
        "locator": "About the Marvell 88W8686; Availability; About Marvell",
        "verified": "同期公司公告，第一手；产品平台与开发支持，及子公司 MSI 的 Sunnyvale 总部。并非声称整个集团法律注册于美国。"
      },
      {
        "id": "I10",
        "title": "iFixit, iPhone Gen 1 Screen",
        "date": null,
        "type": "modern technical description",
        "url": "https://www.ifixit.com/products/iphone-gen-1-screen",
        "locator": "Description; A1203 4GB/8GB/16GB compatibility",
        "verified": "Replacement-parts description; not counted as contemporaneous historical evidence."
      }
    ],
    "limitations": [
      "No later iPhone supplier list or modern component inserted.",
      "No unverified Shenzhen factory coordinate.",
      "BOM costs are not national value added, wages or net profit.",
      "iFixit document has later revisions; exact sample structure not all shipments."
    ],
    "animationNotes": {
      "depthOrder": [
        "Bonded front display assembly",
        "Electronics: upper logic board and lower battery, not two full-height slabs",
        "Rear enclosure with black lower antenna region"
      ],
      "connections": [
        "Battery wires soldered to logic board: keep a visible link or disclose schematic separation",
        "Front glass / touch and LCD move as one assembly",
        "Upper camera and lower antenna region retain their positions"
      ],
      "evidence": [
        "I3 steps 9–12,19–22; page8 photos inspected",
        "I10 description of bonded display replacement"
      ],
      "scope": "Exaggerated structural explosion, not reversible servicing instructions or factory sequence"
    },
    "supplierNetwork": [
      {
        "name": "Samsung — Seoul, South Korea",
        "country": "South Korea",
        "lat": 37.5665,
        "lon": 126.978,
        "role": "Memory supplier; 2007 global headquarters",
        "identityEvidence": "I3 step25",
        "geographyEvidence": "I6 printed p.133",
        "evidenceSource": "I3/I6",
        "kind": "supplier-company",
        "notFactory": true,
        "precision": "city",
        "certainty": "Component identity and company headquarters independently documented"
      },
      {
        "name": "Infineon — Neubiberg, Germany",
        "country": "Germany",
        "lat": 48.077,
        "lon": 11.615,
        "role": "PMB8876 S-Gold2 supplier; principal executive offices",
        "identityEvidence": "I3 step26",
        "geographyEvidence": "I7 cover",
        "evidenceSource": "I3/I7",
        "kind": "supplier-company",
        "notFactory": true,
        "precision": "city",
        "certainty": "Company office, not fabrication location"
      },
      {
        "name": "CSR — Cambridge, United Kingdom",
        "country": "United Kingdom",
        "lat": 52.2053,
        "lon": 0.1218,
        "role": "BlueCore4-ROM Bluetooth supplier; corporate headquarters",
        "identityEvidence": "I3 step26",
        "geographyEvidence": "I8 p.2",
        "evidenceSource": "I3/I8",
        "kind": "supplier-company",
        "notFactory": true,
        "precision": "city",
        "certainty": "Company headquarters, not fabrication location"
      },
      {
        "name": "Marvell Semiconductor — Sunnyvale, California",
        "country": "United States",
        "lat": 37.3688,
        "lon": -122.0363,
        "role": "Wireless networking supplier; MSI design/development organization",
        "identityEvidence": "I3 step26",
        "geographyEvidence": "I9 About Marvell",
        "evidenceSource": "I3/I9",
        "kind": "supplier-company",
        "notFactory": true,
        "precision": "city",
        "certainty": "MSI subsidiary headquarters in 2005; not whole-group incorporation or factory"
      }
    ],
    "courseConnection": "Lecture 6, slide 19: globalization and the growing importance of internet devices. The 2007 phone extends that context through independently sourced evidence; a separately dated 2025 epilogue provides the present-day connection.",
    "nav": "The first iPhone",
    "headline": "Designed here.<br>Made across borders.",
    "deck": "A pocket-sized object reveals the reach of a global production network.",
    "periodLabel": "Global production, 2007",
    "specimen": "Apple iPhone · first generation, A1203",
    "imageAlt": "Interpretive illustration of a first-generation 2007 iPhone",
    "eraTitle": "A network beyond national borders",
    "mapCaption": "Verified design region and assembly country; not a complete factory map.",
    "share": 12.8,
    "connections": [
      {
        "from": "California, United States",
        "to": "China",
        "label": "Design / final assembly relationship, not a shipping route",
        "type": "organizational"
      }
    ],
    "researchUrl": "research/late/06-iPhone-全球生产网络.html"
  }
];
