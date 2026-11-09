/* Selected relationships and market observations; no quantities or complete routes inferred. */
const FLOW_CASES = {
  "nail": {
    "stages": [
      {
        "n": "1",
        "place": "Nahant",
        "work": "Gabbro flux supplied by boat."
      },
      {
        "n": "2",
        "place": "Saugus",
        "work": "Smelting, refining and slitting into rods."
      },
      {
        "n": "3",
        "place": "Boston & other settlements",
        "work": "Nail rods distributed for further work; some nails were finished at Saugus."
      }
    ],
    "numbers": {
      "flux": "1",
      "works": "2",
      "port": "3"
    },
    "edges": [
      {
        "from": "flux",
        "to": "works",
        "kind": "material",
        "bend": -20
      },
      {
        "from": "works",
        "to": "port",
        "kind": "material",
        "bend": 28
      }
    ],
    "note": "Arrows show documented material relationships, not reconstructed sailing tracks. Boston is a nail-rod distribution point, not the origin of every finished nail."
  },
  "cloth": {
    "stages": [
      {
        "n": "1",
        "place": "American South",
        "work": "Cotton grown through enslaved labor; no specific plantation traced."
      },
      {
        "n": "2",
        "place": "Lowell",
        "work": "Spinning cotton into yarn."
      },
      {
        "n": "3",
        "place": "Lowell",
        "work": "Preparing warp and weaving cloth in the mill system."
      }
    ],
    "numbers": {
      "cotton": "1",
      "mills": "2–3"
    },
    "edges": [
      {
        "from": "cotton",
        "to": "mills",
        "kind": "material",
        "bend": -22
      }
    ],
    "note": "Several stages shared Lowell as a location. Boston marks port and merchant connections; no particular 1835 cotton shipment through Boston is reconstructed here."
  },
  "can": {
    "stages": [
      {
        "n": "1",
        "place": "Midwest",
        "work": "Livestock supply region for Chicago’s wider meat industry."
      },
      {
        "n": "2",
        "place": "Chicago",
        "work": "Stockyards, slaughter and meatpacking."
      },
      {
        "n": "3",
        "place": "Chicago",
        "work": "Armour labeling documented in a 1901 film catalog; the 1893 advertised stock is not traced to this factory."
      }
    ],
    "numbers": {
      "livestock": "1",
      "packing": "2–3"
    },
    "edges": [
      {
        "from": "livestock",
        "to": "packing",
        "kind": "material",
        "bend": -30
      }
    ],
    "note": "The arrow is an industry-level supply relationship. Vacaville’s 1893 advertisement appears in Markets & users; the factory and route of those cans remain unknown."
  },
  "car": {
    "stages": [
      {
        "n": "1",
        "place": "Great Lakes · Kentucky · West Virginia",
        "work": "Minerals and coal from different supply regions."
      },
      {
        "n": "2",
        "place": "Iron Mountain",
        "work": "Wood processing supplied body firms; their intervening sites are not mapped."
      },
      {
        "n": "3",
        "place": "Rouge, Dearborn",
        "work": "Manufacturing and final assembly of the Model A in 1928."
      }
    ],
    "numbers": {
      "minerals": "1",
      "coal": "1",
      "wood": "2",
      "rouge": "3"
    },
    "edges": [
      {
        "from": "minerals",
        "to": "rouge",
        "kind": "material",
        "bend": -80
      },
      {
        "from": "coal",
        "to": "rouge",
        "kind": "material",
        "bend": 35
      },
      {
        "from": "wood",
        "to": "rouge",
        "kind": "relation",
        "bend": 30
      }
    ],
    "note": "Inputs converged from parallel branches, rather than passing through every numbered place. The dashed wood connection includes outside body suppliers. Resource histories span several years around the 1928 assembly anchor."
  },
  "tv": {
    "stages": [
      {
        "n": "1",
        "place": "Indianapolis · Marion · Lancaster",
        "work": "Components and picture tubes. Marion’s rectangular-tube tooling was announced; Lancaster was already producing them."
      },
      {
        "n": "2",
        "place": "Bloomington",
        "work": "Color receiver production. The source does not trace the parts of this illustrated set."
      }
    ],
    "numbers": {
      "components": "1",
      "marion-tubes": "1",
      "lancaster-tubes": "1",
      "receivers": "2"
    },
    "edges": [],
    "note": "The numbered places show parallel specialist roles followed by receiver production. No plant-to-plant shipment is traced here, so no transport arrows are drawn. Marion’s rectangular-tube tooling was still a plan in the June 1965 report."
  },
  "phone": {
    "stages": [
      {
        "n": "1",
        "place": "California",
        "work": "Apple’s design and organization."
      },
      {
        "n": "2",
        "place": "Component sites not identified",
        "work": "The selected records do not establish a complete supplier map for this 2007 device."
      },
      {
        "n": "3",
        "place": "China",
        "work": "Final assembly by third-party manufacturers; no factory city established."
      }
    ],
    "numbers": {
      "america": "1",
      "china": "3"
    },
    "edges": [
      {
        "from": "america",
        "to": "china",
        "kind": "relation",
        "bend": -65
      }
    ],
    "note": "The dashed arrow shows the organizational relationship between design and assembly, not a freight route. Stage 2 remains unmapped; China is country-level evidence, not a pin at a particular factory."
  }
};
const MARKET_CASES = {
  "nail": {
    "title": "Saugus nail: customers and downstream users",
    "note": "Saugus supplied several kinds of customer. Merchants and blacksmiths bought iron for further manufacture, while most nail rods were bundled for Boston and other New England settlements. Some nails were made at Saugus for local use. Boston therefore appears here as a distribution point rather than a measured concentration of final buyers. The works also traded iron products overseas, but the surviving evidence used in this exhibit does not identify those exports specifically as nails or trace individual household purchases.",
    "bounds": [
      -75,
      40,
      -65,
      48
    ],
    "countryView": false,
    "groups": [
      {
        "key": "saugus-local",
        "name": "Saugus",
        "role": "Some nails made for local use",
        "point": [
          -71.01,
          42.47
        ],
        "label": [
          120,
          245
        ],
        "color": "blue",
        "evidence": "Local use",
        "sources": [
          {
            "title": "National Park Service · Take an Industrial Site Tour (2021)",
            "url": "https://www.nps.gov/thingstodo/take-an-industrial-site-tour.htm"
          }
        ]
      },
      {
        "key": "boston-distribution",
        "name": "Boston",
        "role": "Nail-rod distribution",
        "point": [
          -71.06,
          42.36
        ],
        "label": [
          73,
          204
        ],
        "color": "orange",
        "evidence": "Distribution",
        "sources": [
          {
            "title": "National Park Service · Take an Industrial Site Tour (2021)",
            "url": "https://www.nps.gov/thingstodo/take-an-industrial-site-tour.htm"
          },
          {
            "title": "Regan & White · Hammersmith Through the Historical Texts (n.d.)",
            "url": "https://www.nps.gov/sair/learn/historyculture/upload/03Chapter2-508x.pdf"
          }
        ]
      },
      {
        "key": "new-england-downstream",
        "name": "Other New England settlements",
        "role": "Regional nail-rod destinations · individual settlements unspecified",
        "point": [
          -70.9,
          44.2
        ],
        "label": [
          300,
          80
        ],
        "color": "green",
        "evidence": "Regional evidence",
        "sources": [
          {
            "title": "National Park Service · Take an Industrial Site Tour (2021)",
            "url": "https://www.nps.gov/thingstodo/take-an-industrial-site-tour.htm"
          }
        ],
        "wash": [
          -70.9,
          44.2,
          3.3,
          3.1
        ],
        "noPin": true,
        "mapLabel": "New England"
      }
    ]
  },
  "cloth": {
    "title": "Lowell cloth: purchasers and wearers",
    "note": "Lowell cloth connected northern manufacturing to southern slavery through both materials and markets. The Lowell Manufacturing Company sold inexpensive cloth to enslavers, who supplied it to enslaved people. The people wearing it were therefore not necessarily the people choosing or purchasing it. The 1835 table identifies the product category; it does not locate individual customers. This map marks a broad southern relationship rather than a traced shipment to a particular plantation, and it keeps purchasers distinct from the people compelled to wear the cloth.",
    "bounds": [
      -100,
      24,
      -71,
      39
    ],
    "countryView": false,
    "groups": [
      {
        "key": "southern-market",
        "name": "American South",
        "role": "Purchasers: enslavers · Wearers: enslaved people",
        "point": [
          -86,
          32
        ],
        "label": [
          225,
          100
        ],
        "color": "blue",
        "evidence": "Purchasers & wearers",
        "sources": [
          {
            "title": "Lowell Manufacturing Company statistics · 1835, reproduced by NPS",
            "url": "https://www.nps.gov/lowe/learn/historyculture/images/Lowell-Co_3.png?autorotate=false&maxwidth=1300"
          },
          {
            "title": "National Park Service · Southern Ties & Northern Gospels (2020)",
            "url": "https://www.nps.gov/lowe/learn/historyculture/southern-ties-northern-gospels.htm"
          }
        ],
        "wash": [
          -86,
          32,
          8,
          3.3
        ],
        "noPin": true,
        "mapLabel": "American South"
      }
    ]
  },
  "can": {
    "title": "Armour corned beef: an advertised western outlet",
    "note": "In January 1893, J. & I. Blum advertised Armour corned beef to readers in Vacaville, California. The retailer provides a documented western sales outlet for the brand. It does not tell us how many cans were bought, who ate them, or which factory supplied this stock. Chicago’s wider meat industry reached distant markets through transport networks, but its refrigerated-meat routes should not be treated as the route of this particular canned product. The map therefore marks an advertised market, not a complete sales territory.",
    "bounds": [
      -126,
      25,
      -66,
      50
    ],
    "countryView": false,
    "groups": [
      {
        "key": "vacaville-retail",
        "name": "Vacaville, California",
        "role": "J. & I. Blum · retail advertisement",
        "point": [
          -121.99,
          38.36
        ],
        "label": [
          145,
          100
        ],
        "color": "blue",
        "evidence": "Retail advertisement",
        "sources": [
          {
            "title": "Vacaville Reporter · J. & I. Blum advertisement (28 January 1893)",
            "url": "https://www.vacavilleheritagecouncil.org/oni/lccn/sn93004521/1893-01-28/ed-1/seq-3/"
          }
        ]
      }
    ]
  },
  "car": {
    "title": "Model A: display and advertising markets",
    "note": "The Model A reached potential buyers through public display, advertising and dealer service. A January 1928 photograph documents its presentation in New York, while a Ford advertisement appeared in Hondo, Texas, that November. The advertisement addressed existing owners and promoted regular servicing, showing that the commercial relationship continued after purchase. These points identify places where the car was presented or promoted; they do not measure local ownership. Nor does the Model A’s later production total establish how many buyers lived in each region during 1928.",
    "bounds": [
      -126,
      25,
      -66,
      50
    ],
    "countryView": false,
    "groups": [
      {
        "key": "new-york-display",
        "name": "New York City",
        "role": "Ford Industrial Exposition · public display",
        "point": [
          -74.01,
          40.71
        ],
        "label": [
          353,
          56
        ],
        "color": "blue",
        "evidence": "Public display",
        "sources": [
          {
            "title": "The Henry Ford · Model A at the New York exposition (January 1928)",
            "url": "https://www.thehenryford.org/collections/explore/artifact/176600"
          }
        ]
      },
      {
        "key": "hondo-advertising",
        "name": "Hondo, Texas",
        "role": "Ford owner-service advertisement",
        "point": [
          -99.14,
          29.35
        ],
        "label": [
          208,
          221
        ],
        "color": "orange",
        "evidence": "Advertisement",
        "sources": [
          {
            "title": "Portal to Texas History · Ford advertisement (16 November 1928)",
            "url": "https://texashistory.unt.edu/ark:/67531/metapth564329/m1/3/"
          }
        ]
      }
    ]
  },
  "tv": {
    "title": "RCA color television: a local retail and service presence",
    "note": "Color television entered local markets through retailers who offered both equipment and service. In April 1965, West’s Radio & TV Service advertised RCA Victor color television in Dunn, North Carolina, beside a schedule of color programs. The page connects the receiver to what households could watch and where they could seek service. It establishes a local advertising presence, not the number or identity of buyers. National figures for color television describe the wider industry, so they cannot be used to shade this map as though they measured RCA sales by state.",
    "bounds": [
      -90,
      30,
      -70,
      42
    ],
    "countryView": false,
    "groups": [
      {
        "key": "dunn-retail",
        "name": "Dunn, North Carolina",
        "role": "West’s Radio & TV Service · RCA advertisement",
        "point": [
          -78.61,
          35.31
        ],
        "label": [
          325,
          130
        ],
        "color": "blue",
        "evidence": "Retail advertisement",
        "sources": [
          {
            "title": "DigitalNC · RCA Victor advertisement in Dunn (9 April 1965)",
            "url": "https://newspapers.digitalnc.org/lccn/sn88063132/1965-04-09/ed-1/seq-14.pdf"
          }
        ]
      }
    ]
  },
  "phone": {
    "title": "Original iPhone: announced official retail rollout",
    "note": "The first iPhone’s retail geography differed from its production network. Apple announced a U.S. launch for 29 June 2007, followed by the United Kingdom and Germany on 9 November and France on 29 November. Each market depended on designated retail channels and a carrier partnership. Colors distinguish the countries named in these announcements. The dates describe planned commercial availability; they do not measure national sales shares, identify every user, or describe a shipping route.",
    "bounds": [
      -137,
      15,
      25,
      66
    ],
    "countryView": true,
    "groups": [
      {
        "key": "us-launch",
        "name": "United States",
        "role": "29 June · Apple and selected AT&T stores",
        "point": [
          -101,
          39
        ],
        "label": [
          92,
          174
        ],
        "color": "blue",
        "evidence": "Announced official market",
        "sources": [
          {
            "title": "Apple · U.S. iPhone launch announcement (28 June 2007)",
            "url": "https://www.apple.com/newsroom/2007/06/28iPhone-Premieres-This-Friday-Night-at-Apple-Retail-Stores/"
          },
          {
            "title": "Apple · 2007 Form 10-K",
            "url": "https://d18rn0p25nwr6d.cloudfront.net/CIK-0000320193/27bb5c2a-cffc-4fe8-b28a-9ef818a1b23e.html"
          }
        ],
        "countries": [
          "United States of America"
        ],
        "noPin": true
      },
      {
        "key": "uk-launch",
        "name": "United Kingdom",
        "role": "9 November · Apple, O2 and Carphone Warehouse",
        "point": [
          -3,
          55
        ],
        "label": [
          310,
          40
        ],
        "color": "orange",
        "evidence": "Announced official market",
        "sources": [
          {
            "title": "Apple · O2 partnership in the UK (18 September 2007)",
            "url": "https://www.apple.com/newsroom/2007/09/18Apple-Chooses-O2-as-Exclusive-Carrier-for-iPhone-in-UK/"
          },
          {
            "title": "Apple · 2007 Form 10-K",
            "url": "https://d18rn0p25nwr6d.cloudfront.net/CIK-0000320193/27bb5c2a-cffc-4fe8-b28a-9ef818a1b23e.html"
          }
        ],
        "countries": [
          "United Kingdom"
        ],
        "noPin": true
      },
      {
        "key": "germany-launch",
        "name": "Germany",
        "role": "9 November · Telekom Shops and T-Mobile online",
        "point": [
          10.5,
          51
        ],
        "label": [
          424,
          90
        ],
        "color": "green",
        "evidence": "Announced official market",
        "sources": [
          {
            "title": "Apple · T-Mobile partnership in Germany (19 September 2007)",
            "url": "https://www.apple.com/newsroom/2007/09/19Apple-and-T-Mobile-Announce-Exclusive-Partnership-for-iPhone-in-Germany/"
          },
          {
            "title": "Apple · 2007 Form 10-K",
            "url": "https://d18rn0p25nwr6d.cloudfront.net/CIK-0000320193/27bb5c2a-cffc-4fe8-b28a-9ef818a1b23e.html"
          }
        ],
        "countries": [
          "Germany"
        ],
        "noPin": true
      },
      {
        "key": "france-launch",
        "name": "France",
        "role": "Announced for 29 November · Orange",
        "point": [
          2.5,
          46.5
        ],
        "label": [
          352,
          187
        ],
        "color": "purple",
        "evidence": "Announced official market",
        "sources": [
          {
            "title": "Apple · Orange partnership in France (16 October 2007)",
            "url": "https://www.apple.com/newsroom/2007/10/16Apple-Chooses-Orange-as-Exclusive-Carrier-for-iPhone-in-France/"
          },
          {
            "title": "Apple · 2007 Form 10-K",
            "url": "https://d18rn0p25nwr6d.cloudfront.net/CIK-0000320193/27bb5c2a-cffc-4fe8-b28a-9ef818a1b23e.html"
          }
        ],
        "countries": [
          "France"
        ],
        "noPin": true
      }
    ]
  }
};
