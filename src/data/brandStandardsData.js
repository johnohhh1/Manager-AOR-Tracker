// brandStandardsData.js
// Complete Brand Standards Validation checklist data

export const brandStandardsData = {
  'food-safety': {
    name: 'Food Safety',
    icon: '🛡️',
    critical: true,
    aor: 'all',
    referencePhotos: [
      { url: '/images/brand-standards/image1.png', caption: 'Chili\'s Purpose' },
      { url: '/images/brand-standards/image2.png', caption: 'Food Safety Standards' }
    ],
    items: [
      {
        id: 'fs-1',
        category: 'CRITICALS',
        text: 'Digital Quality Line Check completed shiftly',
        details: 'QLC must be completed at the start of every shift'
      },
      {
        id: 'fs-2',
        category: 'CRITICALS',
        text: 'Digital Critical Checklist completed shiftly',
        details: 'All critical food safety items documented'
      },
      {
        id: 'fs-3',
        category: 'CRITICALS',
        text: 'Testing strips are taped to Daily Pull Thaw sheet',
        details: 'Sanitizer concentration test strips must be present'
      },
      {
        id: 'fs-4',
        category: 'CRITICALS',
        text: 'Cooling Log is reviewed and verified each week',
        details: 'Manager sign-off on cooling procedures required'
      },
      {
        id: 'fs-5',
        category: 'PRACTICES',
        text: 'Follow posted Hand Washing Procedure as mandated',
        details: 'Observe team members using proper handwashing technique'
      },
      {
        id: 'fs-6',
        category: 'PRACTICES',
        text: 'Gloves must always be worn when handling Ready To Eat Food',
        details: 'No bare-hand contact with RTE foods'
      },
      {
        id: 'fs-7',
        category: 'PRACTICES',
        text: 'When handling burgers (on the Cook Line), use Burger mitts 100% of the time',
        details: 'Dedicated burger mitts required for food safety'
      },
      {
        id: 'fs-8',
        category: 'PRACTICES',
        text: 'Hat/hairnet worn 100% of the time by all HOH TMs, including Manager(s) and QA',
        details: 'All HOH staff must wear proper head covering at all times'
      },
      {
        id: 'fs-9',
        category: 'PRACTICES',
        text: 'Beard net MUST be worn 100% of the time (if applicable) including Manager(s)',
        details: 'All facial hair must be properly covered'
      },
      {
        id: 'fs-10',
        category: 'PRACTICES',
        text: 'Hat/hairnet/beard guards MUST be stocked and hung outside the office door',
        details: 'Proper hair restraint supplies accessible to all staff'
      },
      {
        id: 'fs-11',
        category: 'PRACTICES',
        text: 'Shoulder length or longer hair: pulled back in ponytail or bun, hair away from face, with no loose strands',
        details: 'HOH TMs and QA MUST also wear hat and/or hairnet'
      },
      {
        id: 'fs-12',
        category: 'PRACTICES',
        text: 'Prep items ONLY in proper designated areas',
        details: 'Follow prep area protocols - never prep in inappropriate locations'
      },
      {
        id: 'fs-13',
        category: 'PRACTICES',
        text: 'Any TM exhibiting signs of foodborne illness may NOT work',
        details: 'Common symptoms include: Vomiting, diarrhea, jaundice and sore throat with fever'
      },
      {
        id: 'fs-14',
        category: 'PRACTICES',
        text: 'TMs MUST properly cover infected/exposed wounds, lesions, cuts or boils with double barrier protection',
        details: 'Double barrier example: band-aid covered by clothing/gloves'
      },
      {
        id: 'fs-15',
        category: 'PRACTICES',
        text: 'Manager ServSafe certified',
        details: 'Current ServSafe certification required'
      },
      {
        id: 'fs-16',
        category: 'PRACTICES',
        text: 'TMs certified based on state regulations',
        details: 'All required food handler certifications current'
      },
      {
        id: 'fs-17',
        category: 'PEST CONTROL',
        text: 'Immediately enter any pest sighting in SSP every day seen',
        details: 'Document all pest activity same-day in SSP system'
      }
    ]
  },

  'host-stand': {
    name: 'Host Stand',
    icon: '🚪',
    critical: false,
    aor: 'hospitality',
    referencePhotos: [
      { url: '/images/brand-standards/image3.png', caption: 'Host Stand Setup' }
    ],
    items: [
      {
        id: 'hs-1',
        category: 'HOST BEHAVIORS',
        text: 'Greet every Guest (menus in hand) as soon as they walk through our doors',
        details: 'Standard greeting: "Hi! Welcome to Chili\'s!"'
      },
      {
        id: 'hs-2',
        category: 'HOST BEHAVIORS',
        text: 'When possible, open the door for arriving/departing Guests',
        details: 'Proactive door service demonstrates hospitality'
      },
      {
        id: 'hs-3',
        category: 'HOST BEHAVIORS',
        text: 'Deliver kid silverware when seating Guests with kids',
        details: 'Anticipate family needs proactively'
      },
      {
        id: 'hs-4',
        category: 'HOST BEHAVIORS',
        text: 'Always honor/accommodate Guest seating requests, including large parties',
        details: 'Make every effort to seat Guests where they prefer'
      },
      {
        id: 'hs-5',
        category: 'HOST SET UP',
        text: 'Host stand is organized, clutter-free and perpendicular to the front door (if applicable)',
        details: 'Professional appearance sets tone for Guest experience'
      },
      {
        id: 'hs-6',
        category: 'HOST SET UP',
        text: 'No business cards',
        details: 'Remove all business cards from host stand area'
      },
      {
        id: 'hs-7',
        category: 'HOST SET UP',
        text: 'No TM belongings',
        details: 'Personal items must be stored in designated areas'
      },
      {
        id: 'hs-8',
        category: 'HOST SET UP',
        text: 'No brooms, no dust pans',
        details: 'Cleaning supplies not visible at host stand'
      },
      {
        id: 'hs-9',
        category: 'HOST SET UP',
        text: 'NoWait iPad present and working',
        details: 'Verify iPad is charged, functional, and accessible'
      },
      {
        id: 'hs-10',
        category: 'HOST SET UP',
        text: 'Menus clean, organized and in Brand Standard menu holder',
        details: 'Proper menu presentation and organization'
      },
      {
        id: 'hs-11',
        category: 'HOST SET UP',
        text: 'Every menu has a feature card',
        details: 'Current promotional inserts in all adult menus'
      },
      {
        id: 'hs-12',
        category: 'HOST SET UP',
        text: 'Kid menus are staged flat, NEVER folded and crayons are NEVER reused',
        details: 'Fresh kid menus and new crayons for every child'
      },
      {
        id: 'hs-13',
        category: 'HOST SET UP',
        text: 'Braille menus (and Spanish menus if applicable) are stored within Host Stand',
        details: 'Accessibility menus readily available'
      },
      {
        id: 'hs-14',
        category: 'HOST SET UP',
        text: 'Kid silverware stored at Host Stand',
        details: 'Kid utensils accessible for seating with families'
      },
      {
        id: 'hs-15',
        category: 'HOST SET UP',
        text: 'High chairs/booster seats are in good condition, must be clean after every use',
        details: 'Stored in appropriate location (varies by restaurant)'
      },
      {
        id: 'hs-16',
        category: 'HOST SET UP',
        text: 'Door mats present ONLY when it rains/snows and store when not in use',
        details: 'Weather mats deployed only as needed'
      },
      {
        id: 'hs-17',
        category: 'HOST SET UP',
        text: 'No trash cans present',
        details: 'Trash receptacles not visible at host stand'
      },
      {
        id: 'hs-18',
        category: 'ATMOSPHERE',
        text: 'Inviting, clean fresh smell, clutter-free',
        details: 'First impression area must be welcoming'
      },
      {
        id: 'hs-19',
        category: 'ATMOSPHERE',
        text: 'To be pest-free eliminate excess benches and minimize storage usage',
        details: 'Reduce pest harborage opportunities'
      },
      {
        id: 'hs-20',
        category: 'ATMOSPHERE',
        text: 'No stationary hand sanitizer (unless health codes mandate otherwise)',
        details: 'Scrub wall to remove residue if required'
      },
      {
        id: 'hs-21',
        category: 'ATMOSPHERE',
        text: 'Hosts are NOT hiding behind the Host Stand; present and in front of Guests at all times',
        details: 'Active engagement and visibility required'
      },
      {
        id: 'hs-22',
        category: 'ATMOSPHERE',
        text: 'Everyone owns greeting Guests when a Host is not present',
        details: 'Coach TMs for best practices during shift change/no Host hour'
      }
    ]
  },

  'dining-room': {
    name: 'Dining Room',
    icon: '🍽️',
    critical: false,
    aor: 'hospitality',
    referencePhotos: [
      { url: '/images/brand-standards/image4.png', caption: 'Clean Dining Room' },
      { url: '/images/brand-standards/image5.png', caption: 'Server Station Setup' }
    ],
    items: [
      {
        id: 'dr-1',
        category: 'MANAGER PRESENCE',
        text: 'During the shift, Manager is ALWAYS present on the floor engaging with Guests',
        details: 'Observing/coaching TM hospitality and service behaviors'
      },
      {
        id: 'dr-2',
        category: 'OVERALL AREA',
        text: 'Inviting, clutter-free and organized',
        details: 'Professional dining atmosphere maintained'
      },
      {
        id: 'dr-3',
        category: 'OVERALL AREA',
        text: 'Dust-free, high-dusting from ceiling to the floor',
        details: 'Complete high-dusting maintenance schedule'
      },
      {
        id: 'dr-4',
        category: 'OVERALL AREA',
        text: 'Temperature set to 68° on heat or 72° on cool',
        details: 'Set to Guest comfort - adjust as needed'
      },
      {
        id: 'dr-5',
        category: 'OVERALL AREA',
        text: 'Music level between 65-70 (SPLNFFT Noise Meter App)',
        details: 'Use app to verify proper sound levels'
      },
      {
        id: 'dr-6',
        category: 'OVERALL AREA',
        text: 'Lighting is bright, no burned out bulbs',
        details: 'ONLY order bulbs through FSG'
      },
      {
        id: 'dr-7',
        category: 'OVERALL AREA',
        text: 'No brooms/dust pans visible',
        details: 'Reference Brooms, Pans, Mops & Cans for staging locations'
      },
      {
        id: 'dr-8',
        category: 'OVERALL AREA',
        text: 'Doors unlocked at 10:45 a.m.',
        details: 'Standard opening time preparation'
      },
      {
        id: 'dr-9',
        category: 'ATMOSPHERE',
        text: 'Manager validates swept floors, clean booths, tables and chairs with flashlight at EOD',
        details: 'Trust but verify - EOD quality check required'
      },
      {
        id: 'dr-10',
        category: 'ATMOSPHERE',
        text: 'Pest-free: Immediately enter any pest sighting in SSP every day seen',
        details: 'Same-day pest documentation required'
      },
      {
        id: 'dr-11',
        category: 'ATMOSPHERE',
        text: 'Clean from ceiling to the floor: high-dust areas',
        details: 'Air balance can be a cause of dust - check air flow'
      },
      {
        id: 'dr-12',
        category: 'ATMOSPHERE',
        text: 'Floors are clear of debris, build up etc.',
        details: 'Ensure floors/corners are being mopped AND scrubbed'
      },
      {
        id: 'dr-13',
        category: 'ATMOSPHERE',
        text: 'All paint is in good condition, touch up as needed',
        details: 'Reference Interior Paint Guidelines on BWeb'
      },
      {
        id: 'dr-14',
        category: 'ATMOSPHERE',
        text: 'All interior wood rot entered in Corrigo',
        details: 'Document and request repair for all wood damage'
      },
      {
        id: 'dr-15',
        category: 'ATMOSPHERE',
        text: 'Uniform lighting – all LED, all fluorescent, no burned bulbs',
        details: 'Light shield clean and consistent lighting throughout'
      },
      {
        id: 'dr-16',
        category: 'BLINDS',
        text: 'All blinds are functional and clean',
        details: 'Blinds operational and in good condition'
      },
      {
        id: 'dr-17',
        category: 'BLINDS',
        text: 'Blinds are ALWAYS open',
        details: 'Default position is open for natural light'
      },
      {
        id: 'dr-18',
        category: 'BLINDS',
        text: 'Individual blinds can be lowered upon Guest request due to sun',
        details: 'Return to open once the sun goes down'
      },
      {
        id: 'dr-19',
        category: 'SERVER STATION',
        text: 'Clean organized, clutter-free and cleaning products stored but NOT visible to Guests',
        details: 'Professional server station appearance'
      },
      {
        id: 'dr-20',
        category: 'SERVER STATION',
        text: 'Server Stations ONLY have authorized items: Sugar caddies, salt/pepper, napkins, straws, to-go lids, condiment bottles',
        details: 'Limited to approved items only'
      },
      {
        id: 'dr-21',
        category: 'SERVER BEHAVIORS',
        text: 'Servers use Team Member Handhelds 100% of the time',
        details: 'Mandatory handheld usage for all orders'
      },
      {
        id: 'dr-22',
        category: 'SERVER BEHAVIORS',
        text: 'Immediately ring in and send each meal segment of an order on handheld',
        details: 'Drinks "send"; apps "send"; entrees "send"; desserts "send"'
      },
      {
        id: 'dr-23',
        category: 'BUSSING',
        text: 'Coach proper cleaning procedures - ALWAYS use bus tubs',
        details: 'NEVER stage bus tubs in dining room'
      },
      {
        id: 'dr-24',
        category: 'SILVERWARE',
        text: 'Bagging is done in the HOH - NEVER in Guest\'s view',
        details: 'Adult: fork, knife, straw. Kid: fork, spoon, straw'
      },
      {
        id: 'dr-25',
        category: 'REFILL PROCEDURE',
        text: 'Teas and waters: use pitchers to refill at the table',
        details: 'Coffee: bring fresh cup in new mug. Other beverages: bring fresh drink'
      },
      {
        id: 'dr-26',
        category: 'BIRTHDAY PROCEDURES',
        text: 'Birthday song sung upon request',
        details: 'Standard song: "Happy happy birthday, from the Chili\'s crew..."'
      },
      {
        id: 'dr-27',
        category: 'CASH HANDLING',
        text: 'Servers are responsible for having their own cash bank',
        details: 'NEVER handle cash on the floor or in front of Guests'
      },
      {
        id: 'dr-28',
        category: 'CASH HANDLING',
        text: 'TMs are prohibited from accepting payment/tips via personal payment apps',
        details: 'No Cash App, Zelle, Venmo etc. on phones'
      }
    ]
  },

  'bar': {
    name: 'Bar',
    icon: '🍹',
    critical: false,
    aor: 'togoBar',
    referencePhotos: [
      { url: '/images/brand-standards/image6.png', caption: 'Bar Setup Standards' }
    ],
    items: [
      {
        id: 'bar-1',
        category: 'LIQUOR BOTTLE SETUP',
        text: 'Group like liquors, ONLY call liquors and above are to be showcased',
        details: 'Proper liquor organization and display'
      },
      {
        id: 'bar-2',
        category: 'LIQUOR BOTTLE SETUP',
        text: 'All pour spouts face to the left when looking at the label',
        details: 'Consistent pour spout orientation'
      },
      {
        id: 'bar-3',
        category: 'LIQUOR BOTTLE SETUP',
        text: 'All display lights working',
        details: 'Backbar lighting functional and attractive'
      },
      {
        id: 'bar-4',
        category: 'BEER/KEG PROCEDURES',
        text: 'Shake each keg at the beginning of every shift (a.m. AND p.m.)',
        details: 'Verify keg levels twice daily'
      },
      {
        id: 'bar-5',
        category: 'BEER/KEG PROCEDURES',
        text: 'Double margarita machines are reserved for Classic Frozen Margaritas and Margarita of the Month',
        details: 'Dedicated marg machine usage only'
      },
      {
        id: 'bar-6',
        category: 'BEER/KEG PROCEDURES',
        text: 'Empty beer kegs must be kept in the security cage',
        details: 'Helps prevent theft - secure empty kegs'
      },
      {
        id: 'bar-7',
        category: 'CLOSING PROCEDURES',
        text: 'Last call is called 15 minutes prior to close by Bartender',
        details: 'No drinks ordered or made past closing time'
      },
      {
        id: 'bar-8',
        category: 'SERVING RESPONSIBLY',
        text: 'When serving alcoholic drinks, ALWAYS use your Responsible Alcohol Service training',
        details: 'Serve responsibly at all times'
      },
      {
        id: 'bar-9',
        category: 'SERVING RESPONSIBLY',
        text: 'Drinks are served one at a time: be aware not to over-serve',
        details: 'Monitor Guest consumption levels'
      },
      {
        id: 'bar-10',
        category: 'SERVING RESPONSIBLY',
        text: 'NEVER serve alcohol to a Guest who is showing signs of intoxication',
        details: 'Refuse service if Guest appears intoxicated'
      },
      {
        id: 'bar-11',
        category: 'SERVING RESPONSIBLY',
        text: 'If alcoholic drink is ordered for a kid, NEVER serve until adult verifies it is for them',
        details: 'Verify adult authorization for all alcohol orders'
      },
      {
        id: 'bar-12',
        category: 'ATMOSPHERE',
        text: 'No foul smells - clean bars, floors and drains thoroughly',
        details: 'If smell persists after cleaning, enter in Corrigo'
      },
      {
        id: 'bar-13',
        category: 'ATMOSPHERE',
        text: 'Bar top clean and organized',
        details: 'Professional appearance maintained'
      },
      {
        id: 'bar-14',
        category: 'ATMOSPHERE',
        text: 'Glassware sparkling clean, no spots',
        details: 'Properly washed and stored'
      }
    ]
  },

  'restroom': {
    name: 'Restroom',
    icon: '🚻',
    critical: false,
    aor: 'hospitality',
    items: [
      {
        id: 'rr-1',
        category: 'CLEANLINESS',
        text: 'Restrooms clean and odor-free',
        details: 'Fresh smell, no unpleasant odors'
      },
      {
        id: 'rr-2',
        category: 'CLEANLINESS',
        text: 'Toilets clean and functional',
        details: 'Flushing properly, no clogs'
      },
      {
        id: 'rr-3',
        category: 'CLEANLINESS',
        text: 'Sinks clean, faucets working',
        details: 'Hot and cold water available'
      },
      {
        id: 'rr-4',
        category: 'SUPPLIES',
        text: 'Paper towels/soap fully stocked',
        details: 'Dispensers functional and filled'
      },
      {
        id: 'rr-5',
        category: 'CLEANLINESS',
        text: 'Floors clean and dry',
        details: 'No puddles, properly mopped'
      },
      {
        id: 'rr-6',
        category: 'CLEANLINESS',
        text: 'Mirrors clean and streak-free',
        details: 'No spots or smudges visible'
      },
      {
        id: 'rr-7',
        category: 'CLEANLINESS',
        text: 'Trash cans emptied, not overflowing',
        details: 'Liner in place and proper capacity'
      },
      {
        id: 'rr-8',
        category: 'DOCUMENTATION',
        text: 'Restroom check log current',
        details: 'Signed off every 30 minutes throughout shift'
      },
      {
        id: 'rr-9',
        category: 'RESPONSIBILITY',
        text: 'All TMs responsible for checking restroom any time they use one',
        details: 'Report any issues to Manager/QA immediately'
      },
      {
        id: 'rr-10',
        category: 'ATMOSPHERE',
        text: 'Foul smells = dirty restrooms - reinforce importance of restroom checks',
        details: 'If smell persists after thorough cleaning, enter in Corrigo'
      }
    ]
  },

  'dish-area': {
    name: 'Dish Area',
    icon: '🧼',
    critical: false,
    aor: 'culinary',
    items: [
      {
        id: 'dish-1',
        category: 'CLEANLINESS',
        text: 'Dish area clean and organized',
        details: 'Professional HOH appearance maintained'
      },
      {
        id: 'dish-2',
        category: 'EQUIPMENT',
        text: 'Dish machine operational and properly sanitizing',
        details: 'Test strips verify sanitizer levels'
      },
      {
        id: 'dish-3',
        category: 'CLEANLINESS',
        text: 'Dish tables clean and clear of debris',
        details: 'Work surfaces sanitized regularly'
      },
      {
        id: 'dish-4',
        category: 'ORGANIZATION',
        text: 'Clean dishes properly stored and organized',
        details: 'Stacked neatly in designated locations'
      },
      {
        id: 'dish-5',
        category: 'CLEANLINESS',
        text: 'Floors clean, no standing water',
        details: 'Slip hazards eliminated'
      },
      {
        id: 'dish-6',
        category: 'WASTE',
        text: 'Trash/recycling properly managed',
        details: 'Receptacles not overflowing'
      },
      {
        id: 'dish-7',
        category: 'SAFETY',
        text: 'Proper PPE available and used',
        details: 'Gloves, aprons accessible to dish team'
      },
      {
        id: 'dish-8',
        category: 'ATMOSPHERE',
        text: 'Area free of foul odors',
        details: 'Drains clean and flowing properly'
      }
    ]
  },

  'office': {
    name: 'Office',
    icon: '💼',
    critical: false,
    aor: 'all',
    items: [
      {
        id: 'office-1',
        category: 'SECURITY',
        text: 'Remains closed and locked at all times',
        details: 'NEVER prop office door open'
      },
      {
        id: 'office-2',
        category: 'CLEANLINESS',
        text: 'Free of debris, painted, can properly close and lock',
        details: 'Reference Chili\'s Postings Checklist'
      },
      {
        id: 'office-3',
        category: 'SECURITY',
        text: 'Safe must ALWAYS be locked, in working order',
        details: 'Must have lockable inner compartment for armored car carrier only'
      },
      {
        id: 'office-4',
        category: 'SECURITY',
        text: 'No cash left in office unsecured',
        details: 'All cash must be in locked safe'
      },
      {
        id: 'office-5',
        category: 'ORGANIZATION',
        text: 'Office clutter-free and organized',
        details: 'Less is more - avoid harboring pests'
      },
      {
        id: 'office-6',
        category: 'ATMOSPHERE',
        text: 'Office door is NEVER propped open',
        details: 'Trust but verify - check throughout shift'
      },
      {
        id: 'office-7',
        category: 'DOCUMENTATION',
        text: 'Required postings current and visible',
        details: 'Labor law posters, licenses up to date'
      },
      {
        id: 'office-8',
        category: 'EQUIPMENT',
        text: 'Office equipment functional',
        details: 'Computer, printer, phone in working order'
      }
    ]
  },

  'back-dock': {
    name: 'Back Dock',
    icon: '🚚',
    critical: false,
    aor: 'culinary',
    items: [
      {
        id: 'dock-1',
        category: 'SECURITY',
        text: 'The back door and security cage are NEVER propped open OR open at the same time',
        details: 'Includes during deliveries - one or the other'
      },
      {
        id: 'dock-2',
        category: 'SECURITY',
        text: 'The back door is NOT allowed to be opened one hour prior to or after close',
        details: 'Security protocol for opening/closing'
      },
      {
        id: 'dock-3',
        category: 'CLEANLINESS',
        text: 'Clean, odor/clutter-free and organized',
        details: 'Professional receiving area maintained'
      },
      {
        id: 'dock-4',
        category: 'ORGANIZATION',
        text: 'If using for storage of paperwork, must be sealed and dated',
        details: 'Boxes sealed to prevent pest harborage'
      },
      {
        id: 'dock-5',
        category: 'ATMOSPHERE',
        text: 'No old equipment stored on dock',
        details: 'Remove unused/broken equipment promptly'
      },
      {
        id: 'dock-6',
        category: 'CLEANLINESS',
        text: 'Linen bags tied before putting in bin',
        details: 'Proper linen management procedures'
      },
      {
        id: 'dock-7',
        category: 'SHED',
        text: 'Shed - items labeled/organized and clean',
        details: 'If shed present, maintain organization'
      },
      {
        id: 'dock-8',
        category: 'ATTIC',
        text: 'Clean and organized - NEVER use for storage',
        details: 'If attic present, must remain empty'
      }
    ]
  },

  'pest-control': {
    name: 'Pest Control',
    icon: '🐛',
    critical: false,
    aor: 'culinary',
    items: [
      {
        id: 'pest-1',
        category: 'DOCUMENTATION',
        text: 'Immediately enter any pest sighting in SSP every day seen',
        details: 'Same-day documentation required for all sightings'
      },
      {
        id: 'pest-2',
        category: 'EQUIPMENT',
        text: 'Working fly lights: at least two - one by back door and one near/in To-Go',
        details: 'Verify fly lights operational'
      },
      {
        id: 'pest-3',
        category: 'EQUIPMENT',
        text: 'Air curtain must be working',
        details: 'Creates barrier at entry points'
      },
      {
        id: 'pest-4',
        category: 'EQUIPMENT',
        text: 'Door sweeps present and in good condition',
        details: 'No gaps at bottom of doors'
      },
      {
        id: 'pest-5',
        category: 'EQUIPMENT',
        text: 'Bait traps against walls',
        details: 'Proper placement of rodent stations'
      },
      {
        id: 'pest-6',
        category: 'EQUIPMENT',
        text: 'Working fly panels: two total in BOH',
        details: 'Verify fly panel functionality'
      },
      {
        id: 'pest-7',
        category: 'SECURITY',
        text: 'Remove chains; Detex system is engaged/armed during operating hours',
        details: 'Proper emergency exit security'
      }
    ]
  },

  'mop-sink': {
    name: 'Mop Sink/Chemicals',
    icon: '🧹',
    critical: false,
    aor: 'culinary',
    items: [
      {
        id: 'mop-1',
        category: 'SAFETY EQUIPMENT',
        text: 'Safety equipment accessible to all TMs',
        details: 'Reference Chemical Safety Poster for proper handling'
      },
      {
        id: 'mop-2',
        category: 'ORGANIZATION',
        text: 'Mop sink clean and organized',
        details: 'Professional cleaning station appearance'
      },
      {
        id: 'mop-3',
        category: 'CHEMICAL STORAGE',
        text: 'ONLY Managers are allowed to have keys to chemical boxes',
        details: 'Controlled chemical access'
      },
      {
        id: 'mop-4',
        category: 'CHEMICAL STORAGE',
        text: 'Inspect correct chemicals are in the correct boxes',
        details: 'Proper chemical organization and labeling'
      },
      {
        id: 'mop-5',
        category: 'CLEANLINESS',
        text: 'Mop heads clean and properly stored',
        details: 'Hang mops to dry, never on floor'
      },
      {
        id: 'mop-6',
        category: 'CLEANLINESS',
        text: 'Buckets clean and stored properly',
        details: 'Empty and clean after each use'
      },
      {
        id: 'mop-7',
        category: 'ATMOSPHERE',
        text: 'Area free of chemical spills',
        details: 'Clean any spills immediately per safety protocols'
      }
    ]
  }
};

// Helper function to get section by ID
export const getBrandStandardsSection = (sectionId) => {
  return brandStandardsData[sectionId] || null;
};

// Helper function to get all items for a section
export const getBrandStandardsItems = (sectionId) => {
  return brandStandardsData[sectionId]?.items || [];
};

// Helper function to get sections by AOR
export const getSectionsByAOR = (aor) => {
  return Object.entries(brandStandardsData)
    .filter(([_, section]) => section.aor === 'all' || section.aor === aor)
    .map(([id, section]) => ({ id, ...section }));
};

// Helper function to get all critical sections
export const getCriticalSections = () => {
  return Object.entries(brandStandardsData)
    .filter(([_, section]) => section.critical)
    .map(([id, section]) => ({ id, ...section }));
};
