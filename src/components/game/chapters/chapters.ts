import { BranchingChapter } from '../types';

/**
 * CHAPTER 1: THE AWAKENING - 5 Stages
 */
export const CHAPTER_1: BranchingChapter = {
  id: 1,
  title: "CHAPTER 1",
  subtitle: "The Awakening",
  startNode: "1-s1",
  nodes: {
    // STAGE 1: WAKE UP
    "1-s1": {
      id: "1-s1",
      type: "choice",
      text: "Your eyes snap open. Concrete ceiling. Fluorescent lights buzzing. The air tastes like salt and blood. You're in a small room - no windows, steel door, no handle inside. Your head pounds. The last thing you remember... a charity gala. Champagne. A man with perfect teeth.",
      question: "STAGE 1/5 — What do you do first?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Scream for help", nextNode: "1-s1-scream", consequence: "Someone might hear..." },
        { id: 'b', text: "Check your body for injuries", nextNode: "1-s1-check", consequence: "Assess first..." },
        { id: 'c', text: "Try to break down the door", nextNode: "1-s1-death", consequence: "Show strength..." },
        { id: 'd', text: "Stay still and listen", nextNode: "1-s1-listen", consequence: "Gather intel..." },
      ],
    },
    "1-s1-death": {
      id: "1-s1-death",
      type: "death",
      text: "You hurl yourself at the door. The noise echoes. Guards burst in within seconds. A taser connects with your chest. 'This one's trouble. Double sedation. Basement.' Darkness takes you.",
      deathMessage: "Too aggressive. They've moved you somewhere worse.",
    },
    "1-s1-scream": {
      id: "1-s1-scream",
      type: "choice",
      text: "You scream until your throat is raw. Footsteps approach. A guard in black tactical gear opens the door. 'Awake already?' He studies you coldly.",
      question: "The guard is watching. How do you respond?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Demand answers", nextNode: "1-s1-scream-demand", consequence: "Assert yourself..." },
        { id: 'b', text: "Pretend to be weak and confused", nextNode: "1-s1-scream-weak", consequence: "Underestimation..." },
        { id: 'c', text: "Attack him while he's close", nextNode: "1-s1-scream-death", consequence: "Strike now..." },
        { id: 'd', text: "Stay silent and observe", nextNode: "1-s1-scream-silent", consequence: "Watch..." },
      ],
    },
    "1-s1-scream-death": {
      id: "1-s1-scream-death",
      type: "death",
      text: "You lunge. He's faster. Taser catches you mid-leap. 'Hostile. Restraint protocol.' When you wake, you're strapped to a bed with an IV in your arm.",
      deathMessage: "Attacking an armed guard while restrained doesn't work.",
    },
    "1-s1-scream-demand": {
      id: "1-s1-scream-demand",
      type: "narrative",
      text: "'Where am I?' The guard's expression doesn't change. 'Somewhere no one will find you. The ones who cooperate last longer.' The door closes. They expect resistance.",
      nextNode: "1-s2",
      document: { title: "GUARD_WARNING.pdf", preview: "Cooperation extends survival. Resistance triggers Protocol 7...", pdfUrl: "/documents/guard-warning.pdf" }
    },
    "1-s1-scream-weak": {
      id: "1-s1-scream-weak",
      type: "narrative",
      text: "'Please... where am I?' The guard relaxes. 'Just stay calm.' He leaves without checking your restraints properly. They think you're broken.",
      nextNode: "1-s2",
    },
    "1-s1-scream-silent": {
      id: "1-s1-scream-silent",
      type: "narrative",
      text: "You say nothing. The guard shifts uncomfortably, leaves quickly. You notice: loose keycard on his belt, muddy boots, radio chatter about 'VIP arrival at 2100.'",
      nextNode: "1-s2",
      document: { title: "GUARD_OBSERVATION.pdf", preview: "Loose keycard. VIP arrival 2100. Block C...", pdfUrl: "/documents/guard-observation.pdf" }
    },
    "1-s1-check": {
      id: "1-s1-check",
      type: "narrative",
      text: "Zip ties on wrists - tight but professional. Clothes changed to white gown. Everything gone except... your earring. Sharp backing. You notice a vent above and a loose spring under the cot.",
      nextNode: "1-s2",
    },
    "1-s1-listen": {
      id: "1-s1-listen",
      type: "narrative",
      text: "Footsteps every 15 minutes. Radio: '...VIP arrival at 2100... prepare the merchandise...' You're merchandise. Draft from above - ventilation. Salt air. You're on an island.",
      nextNode: "1-s2",
      document: { title: "SCHEDULE_INTEL.pdf", preview: "Guard rotation: 15 min. VIP: 2100. Island compound...", pdfUrl: "/documents/schedule-intel.pdf" }
    },

    // STAGE 2: ASSESS THE ROOM
    "1-s2": {
      id: "1-s2",
      type: "choice",
      text: "The room: 10x10 feet. Steel door. Concrete walls. Vent above. Metal cot. A drain in the center - why would a room need a drain?",
      question: "STAGE 2/5 — What do you examine?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "The ventilation grate", nextNode: "1-s2-vent", consequence: "Fresh air means escape..." },
        { id: 'b', text: "The metal cot frame", nextNode: "1-s2-cot", consequence: "Find tools..." },
        { id: 'c', text: "The door mechanism", nextNode: "1-s2-door", consequence: "Know the obstacle..." },
        { id: 'd', text: "The drain in the floor", nextNode: "1-s2-death", consequence: "Investigate..." },
      ],
    },
    "1-s2-death": {
      id: "1-s2-death",
      type: "death",
      text: "You pull at the drain grate. Gas rushes out - sedative. Your vision blurs. 'Told you the drain trap works,' someone says as you collapse.",
      deathMessage: "The drain was a trap for curious captives.",
    },
    "1-s2-vent": {
      id: "1-s2-vent",
      type: "narrative",
      text: "Standing on the cot, you reach the vent. Rusted screws - salt corrosion. You could remove it. Sea air. Footsteps above. The shaft is tight but passable.",
      nextNode: "1-s3",
      document: { title: "VENT_ASSESSMENT.pdf", preview: "Rusted screws. Upper floor accessible. Shaft: 18 inches...", pdfUrl: "/documents/vent-assessment.pdf" }
    },
    "1-s2-cot": {
      id: "1-s2-cot",
      type: "narrative",
      text: "Under the cot - a loose spring with a sharp edge. Someone else tried to escape. You pocket it. Not much of a weapon, but something.",
      nextNode: "1-s3",
    },
    "1-s2-door": {
      id: "1-s2-door",
      type: "narrative",
      text: "Steel door, electronic lock. Old model - maybe vulnerable. A gap at the top of the frame. You can hear conversations outside.",
      nextNode: "1-s3",
    },

    // STAGE 3: FREE YOURSELF
    "1-s3": {
      id: "1-s3",
      type: "choice",
      text: "Time to free yourself from the zip ties. Your wrists are raw. Options: earring backing, spring edge, or brute force.",
      question: "STAGE 3/5 — How do you free yourself?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Pick at the lock with the earring", nextNode: "1-s3-earring", consequence: "Delicate work..." },
        { id: 'b', text: "Saw through with the spring", nextNode: "1-s3-spring", consequence: "Slow but sure..." },
        { id: 'c', text: "Dislocate your thumb to slip out", nextNode: "1-s3-dislocate", consequence: "Pain is temporary..." },
        { id: 'd', text: "Snap the ties with force", nextNode: "1-s3-death", consequence: "Quick and direct..." },
      ],
    },
    "1-s3-death": {
      id: "1-s3-death",
      type: "death",
      text: "You slam your arms down. The noise echoes. The ties don't break. Guards burst in. 'Sedation protocol.' The needle comes fast.",
      deathMessage: "The noise gave you away.",
    },
    "1-s3-earring": {
      id: "1-s3-earring",
      type: "narrative",
      text: "Twenty minutes of micro-movements. Click. The tie loosens. Wrists raw but free. You pocket the earring.",
      nextNode: "1-s4",
    },
    "1-s3-spring": {
      id: "1-s3-spring",
      type: "narrative",
      text: "The spring cuts your fingers too, but after forever, the tie snaps. You're free with a makeshift blade.",
      nextNode: "1-s4",
      document: { title: "MAKESHIFT_WEAPON.pdf", preview: "Spring blade acquired. 3-inch edge...", pdfUrl: "/documents/makeshift-weapon.pdf" }
    },
    "1-s3-dislocate": {
      id: "1-s3-dislocate",
      type: "narrative",
      text: "You wrench your thumb sideways. The pop is sickening. Pain blinds you. But your hand slides through. You're free.",
      nextNode: "1-s4",
    },

    // STAGE 4: THE GUARD
    "1-s4": {
      id: "1-s4",
      type: "choice",
      text: "Footsteps approaching. Keys jingling. The guard is coming. You have seconds. Behind the door, on the cot pretending, or under it?",
      question: "STAGE 4/5 — The guard is coming. What's your move?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Hide behind the door to ambush", nextNode: "1-s4-ambush", consequence: "Strike first..." },
        { id: 'b', text: "Pretend to still be tied up", nextNode: "1-s4-pretend", consequence: "Play helpless..." },
        { id: 'c', text: "Squeeze under the cot", nextNode: "1-s4-death", consequence: "Stay hidden..." },
        { id: 'd', text: "Stand and face him directly", nextNode: "1-s4-confront", consequence: "Bold move..." },
      ],
    },
    "1-s4-death": {
      id: "1-s4-death",
      type: "death",
      text: "You squeeze under the cot. The guard sees the cut ties, crouches. Flashlight finds you instantly. 'There you are.' Response team called.",
      deathMessage: "Under the cot was too obvious.",
    },
    "1-s4-ambush": {
      id: "1-s4-ambush",
      type: "choice",
      text: "You flatten against the wall. The door opens. Guard steps in, back to you. Neck exposed.",
      question: "How do you take him down?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Chokehold - silent takedown", nextNode: "1-s4-ambush-choke", consequence: "Cut his air..." },
        { id: 'b', text: "Strike the back of his head", nextNode: "1-s4-ambush-strike", consequence: "Quick knockout..." },
        { id: 'c', text: "Grab his taser and use it", nextNode: "1-s4-ambush-taser", consequence: "His weapon..." },
        { id: 'd', text: "Shove him and run past", nextNode: "1-s4-ambush-death", consequence: "Speed..." },
      ],
    },
    "1-s4-ambush-death": {
      id: "1-s4-ambush-death",
      type: "death",
      text: "You shove and sprint. He catches your gown, yanks back. You hit the floor. His knee pins your spine. 'Runner! Block C!'",
      deathMessage: "He was trained for runners.",
    },
    "1-s4-ambush-choke": {
      id: "1-s4-ambush-choke",
      type: "narrative",
      text: "Arm around his throat. He struggles, claws at you. Ten seconds. Twenty. He goes limp. Unconscious. You take his keycard, radio, taser. Armed now.",
      nextNode: "1-s5",
      document: { title: "GUARD_KEYCARD.pdf", preview: "Level 2 Access - J. Mendez. Block C, Medical, Marina...", pdfUrl: "/documents/guard-keycard.pdf" }
    },
    "1-s4-ambush-strike": {
      id: "1-s4-ambush-strike",
      type: "narrative",
      text: "Elbow to skull base. He drops. Quick check - alive, unconscious. You take keycard and taser. Radio crackles: 'Mendez, status?' Time is short.",
      nextNode: "1-s5",
    },
    "1-s4-ambush-taser": {
      id: "1-s4-ambush-taser",
      type: "narrative",
      text: "You grab his taser, fire. He goes down seizing. Brief guilt, then you remember where you are. Keycard, radio, taser - all yours now.",
      nextNode: "1-s5",
    },
    "1-s4-pretend": {
      id: "1-s4-pretend",
      type: "narrative",
      text: "You fake being tied up. Guard checks your pulse, turns to leave. Clatter - his keycard falls. He doesn't notice. Door closes. You grab the card.",
      nextNode: "1-s5",
    },
    "1-s4-confront": {
      id: "1-s4-confront",
      type: "narrative",
      text: "You stand free in the center. Guard freezes. 'I want to see whoever's in charge.' Something in your eyes gives him pause. 'Bringing her to processing.' You'll see more of this place.",
      nextNode: "1-s5",
    },

    // STAGE 5: ESCAPE THE CELL
    "1-s5": {
      id: "1-s5",
      type: "choice",
      text: "Time to escape. The keycard should work on the door. The vent is loose. Salt air from both. Distant activity through the door. Silence through the vent.",
      question: "STAGE 5/5 — How do you escape this room?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Use the keycard - walk out", nextNode: "1-s5-door", consequence: "Direct approach..." },
        { id: 'b', text: "Climb through the vent", nextNode: "1-s5-vent", consequence: "Hidden path..." },
        { id: 'c', text: "Wait for the corridor to clear", nextNode: "1-s5-wait", consequence: "Patience..." },
        { id: 'd', text: "Radio a fake emergency elsewhere", nextNode: "1-s5-death", consequence: "Create chaos..." },
      ],
    },
    "1-s5-death": {
      id: "1-s5-death",
      type: "death",
      text: "'Fire in Block A!' Alarms blare. You slip out - into three guards coming FROM Block A. 'There's no fire in A.' They see the radio. The unconscious guard. 'Nice try.'",
      deathMessage: "They recognized the false alarm instantly.",
    },
    "1-s5-door": {
      id: "1-s5-door",
      type: "narrative",
      text: "Keycard beeps green. Sterile corridor. Cameras, but one's lens is cracked. Signs: PROCESSING, MEDICAL, EXIT. Through a window - palm trees, searchlights, ocean. An island compound.",
      nextNode: "1-complete",
    },
    "1-s5-vent": {
      id: "1-s5-vent",
      type: "narrative",
      text: "The grate comes free. Claustrophobic shaft. Crawling toward fresh air. Through other grates you see more cells. More prisoners. You're not alone here.",
      nextNode: "1-complete",
      document: { title: "OTHER_CAPTIVES.pdf", preview: "12+ prisoners observed. Various ages. This is bigger than one person...", pdfUrl: "/documents/other-captives.pdf" }
    },
    "1-s5-wait": {
      id: "1-s5-wait",
      type: "narrative",
      text: "0300. Shift change. Skeleton crew. You slip into dim emergency lighting. Signs: GUEST QUARTERS, RECREATION. This place is designed to look legitimate. A resort hiding horrors.",
      nextNode: "1-complete",
    },

    // CHAPTER 1 COMPLETE
    "1-complete": {
      id: "1-complete",
      type: "chapter-end",
      text: "You've escaped Block C. Salt wind hits your face. Stars above. Ocean all around. An island compound hidden in paradise. Searchlights sweep below. A marina glints in the distance. You're not the only one trapped here. And whoever runs this place has powerful friends.",
      chapterComplete: { chapter: 1, nextChapter: 2, summary: "You escaped your cell. The compound awaits." },
    },
  },
};

/**
 * CHAPTER 2: THE COMPOUND - 5 Stages
 */
export const CHAPTER_2: BranchingChapter = {
  id: 2,
  title: "CHAPTER 2",
  subtitle: "The Compound",
  startNode: "2-s1",
  nodes: {
    // STAGE 1: OUTSIDE
    "2-s1": {
      id: "2-s1",
      type: "choice",
      text: "Outside Block C. Massive compound - buildings, gardens, like a luxury resort. Searchlights sweep. Guards patrol in pairs. A mansion lit up, a domed structure humming with electricity, a distant marina.",
      question: "STAGE 1/5 — Where do you go?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Head straight for the marina", nextNode: "2-s1-death", consequence: "Boats mean freedom..." },
        { id: 'b', text: "Investigate the domed structure", nextNode: "2-s1-dome", consequence: "What's that hum?" },
        { id: 'c', text: "Sneak toward the mansion", nextNode: "2-s1-mansion", consequence: "Know your enemy..." },
        { id: 'd', text: "Find cover and observe patrol patterns", nextNode: "2-s1-observe", consequence: "Patience first..." },
      ],
    },
    "2-s1-death": {
      id: "2-s1-death",
      type: "death",
      text: "You sprint across open ground toward the marina. Searchlight catches you. Alarms. Dogs. Guards converge. 'Went straight for the boats. They always do.'",
      deathMessage: "The direct approach was too predictable.",
    },
    "2-s1-dome": {
      id: "2-s1-dome",
      type: "choice",
      text: "Surveillance center. Rows of monitors showing every inch of the island. Bedrooms, bathrooms, beach. Everything recorded. A bored guard scrolls his phone.",
      question: "The surveillance hub. Your approach?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Find a service entrance", nextNode: "2-s1-dome-service", consequence: "Another way in..." },
        { id: 'b', text: "Watch the guard's routine", nextNode: "2-s1-dome-watch", consequence: "Learn patterns..." },
        { id: 'c', text: "Try the main door while he's distracted", nextNode: "2-s1-dome-death", consequence: "He's not watching..." },
        { id: 'd', text: "Note it and move on for now", nextNode: "2-s1-dome-note", consequence: "Come back later..." },
      ],
    },
    "2-s1-dome-death": {
      id: "2-s1-dome-death",
      type: "death",
      text: "UNAUTHORIZED ACCESS. Every screen flashes red. 'Caught another one,' the guard says, bored. 'They always think I'm not watching.' Motion sensors.",
      deathMessage: "The surveillance center has the best security on the island.",
    },
    "2-s1-dome-service": {
      id: "2-s1-dome-service",
      type: "narrative",
      text: "Service panel around back. Old lock pops with your blade. Cables, circuit breakers, a maintenance shaft. You can see the server room. A USB port blinks green.",
      nextNode: "2-s2",
      document: { title: "SURVEILLANCE_ACCESS.pdf", preview: "Service entrance viable. Server USB accessible...", pdfUrl: "/documents/surveillance-access.pdf" }
    },
    "2-s1-dome-watch": {
      id: "2-s1-dome-watch",
      type: "narrative",
      text: "Twenty minutes watching. Bathroom break every hour - exactly 4 minutes. Motion sensors on, but he rewinds to check for movement. Lazy. Exploitable.",
      nextNode: "2-s2",
    },
    "2-s1-dome-note": {
      id: "2-s1-dome-note",
      type: "narrative",
      text: "Northeast corner, 50 meters from mansion. Evidence lives here. Years of recordings. You'll need it eventually.",
      nextNode: "2-s2",
    },
    "2-s1-mansion": {
      id: "2-s1-mansion",
      type: "narrative",
      text: "Through windows - a party. Expensive suits, gowns, champagne. Not guards. Clients. You recognize a senator. A tech billionaire. They're not prisoners. They're customers.",
      nextNode: "2-s2",
      document: { title: "CLIENT_FACES.pdf", preview: "Senator identified. CEO identified. High-profile clients...", pdfUrl: "/documents/client-faces.pdf" }
    },
    "2-s1-observe": {
      id: "2-s1-observe",
      type: "narrative",
      text: "One hour watching. Guards rotate every 20 minutes. Searchlight gap on eastern path - 15 seconds. Kitchen delivery truck barely checked. Guard smoke breaks behind tool shed.",
      nextNode: "2-s2",
      document: { title: "PATROL_ANALYSIS.pdf", preview: "20-min rotation. East gap: 15 sec. Kitchen: weak...", pdfUrl: "/documents/patrol-analysis.pdf" }
    },

    // STAGE 2: THE SCREAM
    "2-s2": {
      id: "2-s2",
      type: "choice",
      text: "A scream. Girl's voice from a cottage near the mansion. 'Please! Someone help me!' Cut off abruptly. Young. Terrified. Like you were.",
      question: "STAGE 2/5 — Do you investigate?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Yes - you have to help", nextNode: "2-s2-investigate", consequence: "Can't ignore it..." },
        { id: 'b', text: "No - escape and bring back help", nextNode: "2-s2-escape", consequence: "Save yourself first..." },
        { id: 'c', text: "Get closer and assess", nextNode: "2-s2-recon", consequence: "Don't rush in..." },
        { id: 'd', text: "Run directly to help", nextNode: "2-s2-death", consequence: "Every second counts..." },
      ],
    },
    "2-s2-death": {
      id: "2-s2-death",
      type: "death",
      text: "You sprint to the cottage, grab the handle. Two guards from the shadows. 'Going somewhere?' The scream was a recording. Motion-activated trap. 'Works every time.'",
      deathMessage: "The scream was bait. They know escapees try to help others.",
    },
    "2-s2-investigate": {
      id: "2-s2-investigate",
      type: "narrative",
      text: "Through a window - a girl, maybe 15, chained to a bed. A man in an expensive suit adjusts his cufflinks. Fire extinguisher in the hall. You can hear his voice: 'Don't worry. It'll be over soon.'",
      nextNode: "2-s3",
    },
    "2-s2-escape": {
      id: "2-s2-escape",
      type: "narrative",
      text: "The hardest thing you've ever done - turning away. But you're one against an army. You memorize everything. The girl's location. Building layout. You WILL come back.",
      nextNode: "2-s3",
    },
    "2-s2-recon": {
      id: "2-s2-recon",
      type: "narrative",
      text: "Multiple cottages. Through windows - four girls in different rooms. All young. All restrained. External fire alarm on the wall. Guard rotation gap - 3 minutes every half hour.",
      nextNode: "2-s3",
      document: { title: "COTTAGE_INTEL.pdf", preview: "4+ victims. Fire alarm accessible. Guard gap: 3 min...", pdfUrl: "/documents/cottage-intel.pdf" }
    },

    // STAGE 3: RESOURCES
    "2-s3": {
      id: "2-s3",
      type: "choice",
      text: "You need resources. Can't do anything with just a blade and keycard. Maintenance shed, staff building, medical clinic - each might have something useful.",
      question: "STAGE 3/5 — Where do you search?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "The maintenance shed", nextNode: "2-s3-shed", consequence: "Tools and equipment..." },
        { id: 'b', text: "The staff quarters", nextNode: "2-s3-staff", consequence: "Communication devices..." },
        { id: 'c', text: "The medical clinic", nextNode: "2-s3-clinic", consequence: "Supplies and intel..." },
        { id: 'd', text: "Skip resources - go now", nextNode: "2-s3-death", consequence: "Time is running out..." },
      ],
    },
    "2-s3-death": {
      id: "2-s3-death",
      type: "death",
      text: "Straight for the marina. No supplies, no plan. Dogs catch your scent halfway. Razor wire slices your palms as you try to climb. 'No weapons, no plan. What did you think would happen?'",
      deathMessage: "Escaping without resources was never going to work.",
    },
    "2-s3-shed": {
      id: "2-s3-shed",
      type: "narrative",
      text: "Unlocked - why secure gardening tools? Rope, wire cutters, flashlight, wrench heavy enough as a weapon. Also: irrigation map showing underground pipes. One leads outside the perimeter.",
      nextNode: "2-s4",
      document: { title: "COMPOUND_MAP.pdf", preview: "Underground access: northeast corner. Pipe: 24 inches...", pdfUrl: "/documents/compound-map.pdf" }
    },
    "2-s3-staff": {
      id: "2-s3-staff",
      type: "narrative",
      text: "Window into break room. Landline phone. A wallet with cash and boat key - 'MARIA - SLIP 7.' Best: a staff uniform that fits.",
      nextNode: "2-s4",
    },
    "2-s3-clinic": {
      id: "2-s3-clinic",
      type: "narrative",
      text: "Keycard works. Bandages, antibiotics, sedatives. And a medical log. Dates, names, procedures. 'Subject preparation.' 'Client requests.' You photograph pages, pocket a scalpel.",
      nextNode: "2-s4",
      document: { title: "MEDICAL_EVIDENCE.pdf", preview: "200+ entries. Names, dates. Evidence of systematic abuse...", pdfUrl: "/documents/medical-evidence.pdf" }
    },

    // STAGE 4: GUARD ENCOUNTER
    "2-s4": {
      id: "2-s4",
      type: "choice",
      text: "Two guards round a corner ahead. Haven't seen you yet. Minimal cover - fountain left, planter right. Flashlights sweeping. Seconds to act.",
      question: "STAGE 4/5 — Guards approaching. What do you do?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Duck behind the fountain", nextNode: "2-s4-fountain", consequence: "Stone cover..." },
        { id: 'b', text: "Slip behind the planter", nextNode: "2-s4-planter", consequence: "Vegetation..." },
        { id: 'c', text: "Walk past confidently", nextNode: "2-s4-death", consequence: "Act like you belong..." },
        { id: 'd', text: "Throw something to distract them", nextNode: "2-s4-distract", consequence: "Misdirect..." },
      ],
    },
    "2-s4-death": {
      id: "2-s4-death",
      type: "death",
      text: "'Badge?' You don't have one. 'Subject escape. Grid 7.' Taser drops you before you make ten steps. 'Staff doesn't wander at 3 AM.'",
      deathMessage: "Bluffing doesn't work during active searches.",
    },
    "2-s4-fountain": {
      id: "2-s4-fountain",
      type: "narrative",
      text: "Behind the fountain. Flashlights pass inches away. '...Block C runner?' 'Third this month.' 'Think she'll make it?' 'They never do.' They move on. You breathe again.",
      nextNode: "2-s5",
    },
    "2-s4-planter": {
      id: "2-s4-planter",
      type: "narrative",
      text: "Behind the planter. One lights a cigarette. 'Senator client?' 'Sick bastard. Even by our standards.' 'Money's money.' They laugh and move on. Even guards have limits.",
      nextNode: "2-s5",
      document: { title: "GUARD_DISCONTENT.pdf", preview: "Guards have moral concerns. Senator mentioned. Potential ally?", pdfUrl: "/documents/guard-discontent.pdf" }
    },
    "2-s4-distract": {
      id: "2-s4-distract",
      type: "narrative",
      text: "Stone into bushes. 'What was that?' They investigate. Cat bolts out - perfect cover. You slip away. Too close.",
      nextNode: "2-s5",
    },

    // STAGE 5: THE CHOICE
    "2-s5": {
      id: "2-s5",
      type: "choice",
      text: "Dawn approaches. Marina accessible - small boat, maybe not tracked. Surveillance dome vulnerable during bathroom break. The girl needs help. You can't do everything.",
      question: "STAGE 5/5 — What's your priority?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Escape via marina", nextNode: "2-s5-marina", consequence: "Get out, bring help..." },
        { id: 'b', text: "Steal evidence from the dome", nextNode: "2-s5-dome", consequence: "Footage to expose them..." },
        { id: 'c', text: "Rescue the girl", nextNode: "2-s5-rescue", consequence: "Can't leave her..." },
        { id: 'd', text: "Confront the clients in the mansion", nextNode: "2-s5-death", consequence: "Make them see..." },
      ],
    },
    "2-s5-death": {
      id: "2-s5-death",
      type: "death",
      text: "You storm into the mansion. 'You're all monsters!' Security tackles you instantly. Guests don't even look disturbed - just annoyed. 'Another one. Can't they keep them contained?'",
      deathMessage: "The clients aren't allies. They're customers.",
    },
    "2-s5-marina": {
      id: "2-s5-marina",
      type: "narrative",
      text: "Slip 7. The Maria. Small fishing boat, manual, no GPS. Key works. You push off. Island shrinks behind you. You're escaping. You'll be back with an army.",
      nextNode: "2-complete",
    },
    "2-s5-dome": {
      id: "2-s5-dome",
      type: "narrative",
      text: "Guard's bathroom break. Through the service panel. USB drives - years of footage. You grab as many as possible. Alarm trips on exit. Run. Evidence clutched to your chest.",
      nextNode: "2-complete",
      document: { title: "EVIDENCE_SECURED.pdf", preview: "6 USB drives. 10+ years footage. Names, faces, proof...", pdfUrl: "/documents/evidence-secured.pdf" }
    },
    "2-s5-rescue": {
      id: "2-s5-rescue",
      type: "narrative",
      text: "Fire alarm. Chaos. Window smash. The girl screams until she sees you're not one of them. 'I'm getting you out.' Her name is Sofia. She's 15. She's coming with you.",
      nextNode: "2-complete",
    },

    // CHAPTER 2 COMPLETE
    "2-complete": {
      id: "2-complete",
      type: "chapter-end",
      text: "Dawn breaks. Whatever you chose, you've taken action. The truth of this place - wealthy clients, trapped victims, paradise hiding hell. This isn't over. They know someone got out.",
      chapterComplete: { chapter: 2, nextChapter: 3, summary: "You explored the compound and made your choice. Now comes the escape." },
    },
  },
};

/**
 * CHAPTER 3: THE ESCAPE - 5 Stages
 */
export const CHAPTER_3: BranchingChapter = {
  id: 3,
  title: "CHAPTER 3",
  subtitle: "The Escape",
  startNode: "3-s1",
  nodes: {
    // STAGE 1: CHASE BEGINS
    "3-s1": {
      id: "3-s1",
      type: "choice",
      text: "Alarms blaring. Searchlights sweeping. Dogs barking, getting closer. Helicopter spinning up. They're throwing everything at finding you. Northern cliffs ahead, marina below.",
      question: "STAGE 1/5 — How do you proceed?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Sprint for the marina", nextNode: "3-s1-death", consequence: "Speed is key..." },
        { id: 'b', text: "Climb down the cliffs", nextNode: "3-s1-cliffs", consequence: "Unexpected route..." },
        { id: 'c', text: "Circle through jungle to marina", nextNode: "3-s1-jungle", consequence: "Stay in cover..." },
        { id: 'd', text: "Sabotage the helicopter first", nextNode: "3-s1-heli", consequence: "Remove air support..." },
      ],
    },
    "3-s1-death": {
      id: "3-s1-death",
      type: "death",
      text: "Full sprint across open ground. Searchlight finds you at 200 yards. Dogs, guards, tasers. 'Fastest capture we've had. Under three minutes.'",
      deathMessage: "Running in the open during full alert was suicide.",
    },
    "3-s1-cliffs": {
      id: "3-s1-cliffs",
      type: "narrative",
      text: "50 feet down, weathered rock with handholds. Helicopter passes overhead as you descend. Salt spray. Below - a cove with kayaks. Staff recreation. Your exit.",
      nextNode: "3-s2",
      document: { title: "CLIFF_ROUTE.pdf", preview: "50ft descent. Cove with watercraft. Guards don't patrol here...", pdfUrl: "/documents/cliff-route.pdf" }
    },
    "3-s1-jungle": {
      id: "3-s1-jungle",
      type: "narrative",
      text: "Into the jungle. Branches tear. Pursuit fades behind. Through gaps - marina lights, guards checking boats. But a jet ski, hidden behind a shed. Keys in ignition.",
      nextNode: "3-s2",
    },
    "3-s1-heli": {
      id: "3-s1-heli",
      type: "choice",
      text: "Helipad. Pilot doing pre-flight, back turned. Fuel line accessible. Tail rotor exposed. Or something more subtle.",
      question: "How do you sabotage it?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Cut the fuel line", nextNode: "3-s1-heli-fuel", consequence: "No fuel, no flight..." },
        { id: 'b', text: "Damage the tail rotor", nextNode: "3-s1-heli-rotor", consequence: "Unsafe to fly..." },
        { id: 'c', text: "Sever a control cable", nextNode: "3-s1-heli-cable", consequence: "Subtle failure..." },
        { id: 'd', text: "Knock out pilot and steal it", nextNode: "3-s1-heli-death", consequence: "Take control..." },
      ],
    },
    "3-s1-heli-death": {
      id: "3-s1-heli-death",
      type: "death",
      text: "Ex-military pilot. Helicopters have mirrors. He spins, catches your arm, flips you. 'Nice try. Most go for the fuel line.' Guards converge.",
      deathMessage: "The pilot was combat-trained.",
    },
    "3-s1-heli-fuel": {
      id: "3-s1-heli-fuel",
      type: "narrative",
      text: "Blade through fuel line. Aviation fuel spills. Pilot curses, kills engine. 'Fuel leak! Ground it!' Eye in the sky - closed.",
      nextNode: "3-s2",
    },
    "3-s1-heli-rotor": {
      id: "3-s1-heli-rotor",
      type: "narrative",
      text: "Blade jammed in tail rotor mechanism. Pilot lifts off, gets 100 feet. Alarms blare. Hard landing. 'Mechanical failure!' Grounded for hours.",
      nextNode: "3-s2",
    },
    "3-s1-heli-cable": {
      id: "3-s1-heli-cable",
      type: "narrative",
      text: "Control cable partially severed. Pilot lifts off. Count to thirty. Helicopter lurches, yaws wildly. Emergency landing. 'Controls shot! Grounded!' Damage looks like metal fatigue.",
      nextNode: "3-s2",
      document: { title: "HELI_SABOTAGE.pdf", preview: "Control cable severed. Grounded indefinitely...", pdfUrl: "/documents/heli-sabotage.pdf" }
    },

    // STAGE 2: WATER
    "3-s2": {
      id: "3-s2",
      type: "choice",
      text: "Waterline. Ocean stretches dark and choppy. Mainland lights 5 miles out. Kayak in the cove, jet ski near marina, sailboat moored further out.",
      question: "STAGE 2/5 — How do you cross?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Kayak - silent, untrackable", nextNode: "3-s2-kayak", consequence: "Quiet but slow..." },
        { id: 'b', text: "Jet ski - speed is survival", nextNode: "3-s2-jetski", consequence: "Fast but loud..." },
        { id: 'c', text: "Swim to the sailboat", nextNode: "3-s2-sail", consequence: "Better vessel..." },
        { id: 'd', text: "Wait and signal a passing boat", nextNode: "3-s2-death", consequence: "Someone might help..." },
      ],
    },
    "3-s2-death": {
      id: "3-s2-death",
      type: "death",
      text: "You wave at an approaching boat. It slows. Island security patrol logo. 'Our missing guest.' They pull you aboard before you can run.",
      deathMessage: "That wasn't rescue. Island patrol.",
    },
    "3-s2-kayak": {
      id: "3-s2-kayak",
      type: "narrative",
      text: "Light, quick. No engine noise. Searchlights sweep everywhere but here. Paddle into darkness. Island shrinks. Mainland grows. One stroke at a time.",
      nextNode: "3-s3",
    },
    "3-s2-jetski": {
      id: "3-s2-jetski",
      type: "narrative",
      text: "Engine roars. Spray flies. Shots fired - wide. Speedboat gives chase. But jet skis are maneuverable. Through rock formations they can't follow. Clean lead.",
      nextNode: "3-s3",
      document: { title: "PURSUIT_EVADED.pdf", preview: "Jet ski escape successful. Clean break...", pdfUrl: "/documents/pursuit-evaded.pdf" }
    },
    "3-s2-sail": {
      id: "3-s2-sail",
      type: "narrative",
      text: "Brutal swim. Cold, strong current. You haul aboard a 30-footer. Unlocked - rich people. Engine starts. Below deck: food, water, first aid, flare gun.",
      nextNode: "3-s3",
    },

    // STAGE 3: PURSUIT
    "3-s3": {
      id: "3-s3",
      type: "choice",
      text: "Speedboat in your wake. Armed figures. Mainland 3 miles away. Storm clouds on the horizon. You can't outrun them straight.",
      question: "STAGE 3/5 — How do you lose them?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Head into the storm", nextNode: "3-s3-storm", consequence: "They might not follow..." },
        { id: 'b', text: "Cut engine and drift - go dark", nextNode: "3-s3-drift", consequence: "Lose visual contact..." },
        { id: 'c', text: "Send a mayday", nextNode: "3-s3-mayday", consequence: "Call for help..." },
        { id: 'd', text: "Turn and confront them", nextNode: "3-s3-death", consequence: "Surprise them..." },
      ],
    },
    "3-s3-death": {
      id: "3-s3-death",
      type: "death",
      text: "You turn to face them. Bigger boat, armed crew, professionals. They pull alongside before you can react. 'Brave. Stupid.' Zip ties. Back to the island.",
      deathMessage: "Your vessel vs armed speedboat was never going to work.",
    },
    "3-s3-storm": {
      id: "3-s3-storm",
      type: "narrative",
      text: "Into the storm. Rain like bullets. Waves toss you like a toy. The speedboat hesitates, slows, turns back. You fight the sea for an hour. Storm passes. Island distant. Mainland close.",
      nextNode: "3-s4",
    },
    "3-s3-drift": {
      id: "3-s3-drift",
      type: "narrative",
      text: "Everything off. Drift in darkness. Speedboat passes 100 yards left. Hold breath. 'Lost visual. Expanding search.' Wrong direction. Ten minutes. Restart. Run.",
      nextNode: "3-s4",
      document: { title: "EVASION_TACTICS.pdf", preview: "Drift technique successful. Mainland approach: northeast...", pdfUrl: "/documents/evasion-tactics.pdf" }
    },
    "3-s3-mayday": {
      id: "3-s3-mayday",
      type: "narrative",
      text: "'Mayday. Kidnapping victim. Armed pursuers.' Static. 'Coast Guard Steadfast. Give position.' You read GPS. 'Help coming.' The speedboat veers away - they heard too.",
      nextNode: "3-s4",
    },

    // STAGE 4: LANDFALL
    "3-s4": {
      id: "3-s4",
      type: "choice",
      text: "Less than a mile. Town lights, fishing pier, police station sign. Exhausted, maybe hypothermic. Need help. Question is how.",
      question: "STAGE 4/5 — How do you make landfall?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Head for police station pier", nextNode: "3-s4-police", consequence: "Official help..." },
        { id: 'b', text: "Land at fishing pier", nextNode: "3-s4-pier", consequence: "Less visible..." },
        { id: 'c', text: "Beach it and run", nextNode: "3-s4-beach", consequence: "Land first..." },
        { id: 'd', text: "Circle back to check for pursuit", nextNode: "3-s4-death", consequence: "Make sure you're clear..." },
      ],
    },
    "3-s4-death": {
      id: "3-s4-death",
      type: "death",
      text: "You turn to check behind - second speedboat appears from the coastline. Flanking. They bracket you. 'Got this close. That's the cruelest part.' They tow you back.",
      deathMessage: "Second boat was waiting. Should have kept going.",
    },
    "3-s4-police": {
      id: "3-s4-police",
      type: "narrative",
      text: "Police pier. Stumble onto dock. Collapse into officer's arms. 'Trafficking... island... help...' Darkness. Wake in hospital. FBI waiting. They've suspected that island for years. Now they have a witness.",
      nextNode: "3-s5",
    },
    "3-s4-pier": {
      id: "3-s4-pier",
      type: "narrative",
      text: "Old fisherman looks up. 'Need to call FBI.' He doesn't ask questions. Hands phone. Tip line. Island, coordinates, names. Police cars arriving. Someone believed you.",
      nextNode: "3-s5",
      document: { title: "FBI_CONTACT.pdf", preview: "Tip filed. Case assigned. Protection requested...", pdfUrl: "/documents/fbi-contact.pdf" }
    },
    "3-s4-beach": {
      id: "3-s4-beach",
      type: "narrative",
      text: "Beach the vessel. Collapse on sand. Sunrise. Alive. Jogger calls 911. Paramedics arrive. You demand FBI, not local. Trust no one until you know who's clean.",
      nextNode: "3-s5",
    },

    // STAGE 5: SAFETY
    "3-s5": {
      id: "3-s5",
      type: "choice",
      text: "Hospital. Guarded room. FBI took initial statement. Lawyer warns: powerful people want you silenced. How do you proceed?",
      question: "STAGE 5/5 — How do you protect yourself?",
      timerSeconds: 300,
      choices: [
        { id: 'a', text: "Trust the FBI completely", nextNode: "3-s5-fbi", consequence: "Let them handle it..." },
        { id: 'b', text: "Demand witness protection first", nextNode: "3-s5-witsec", consequence: "Secure safety..." },
        { id: 'c', text: "Contact a journalist", nextNode: "3-s5-media", consequence: "Go public..." },
        { id: 'd', text: "Try to disappear on your own", nextNode: "3-s5-death", consequence: "Trust no one..." },
      ],
    },
    "3-s5-death": {
      id: "3-s5-death",
      type: "death",
      text: "Slip out of hospital. Three blocks later, black car pulls up. 'Your presence has been requested.' Not FBI. You made yourself vulnerable. Won't get another chance.",
      deathMessage: "Running alone made you an easy target.",
    },
    "3-s5-fbi": {
      id: "3-s5-fbi",
      type: "narrative",
      text: "Everything. Names, locations, what you saw. Lead agent's face grows grim. 'This is bigger than we thought. Your testimony - enough for warrants. To raid. To bring them down.'",
      nextNode: "3-complete",
    },
    "3-s5-witsec": {
      id: "3-s5-witsec",
      type: "narrative",
      text: "'Witness protection. New identity. Before another word.' Agents exchange looks. 'Done. Paperwork in 24 hours. Until then, you don't leave. We don't leave.'",
      nextNode: "3-complete",
      document: { title: "WITSEC_INITIATED.pdf", preview: "Witness Security approved. New identity in process...", pdfUrl: "/documents/witsec.pdf" }
    },
    "3-s5-media": {
      id: "3-s5-media",
      type: "narrative",
      text: "Journalist at bedside with recorder. 'Once public, they can't touch you. Too many eyes.' Story breaks next morning. ISLAND OF HORRORS. Too visible to disappear now.",
      nextNode: "3-complete",
    },

    // CHAPTER 3 COMPLETE
    "3-complete": {
      id: "3-complete",
      type: "chapter-end",
      text: "You made it. Escaped the island, crossed the ocean, evaded pursuit, reached safety. FBI mobilizing. Media circling. Powerful people very nervous. The fight isn't over - trial, testimony, threats ahead. But you're alive. Free. And the truth is coming out.",
      chapterComplete: { chapter: 3, nextChapter: 4, summary: "You escaped. Now comes justice." },
    },
  },
};

/**
 * CHAPTERS 4-6: COMING SOON
 */
export const CHAPTER_4: BranchingChapter = {
  id: 4, title: "CHAPTER 4", subtitle: "The Investigation", startNode: "4-soon",
  nodes: { "4-soon": { id: "4-soon", type: "chapter-end", text: "🚧 CHAPTER 4: THE INVESTIGATION — COMING SOON 🚧\n\nFBI investigation launched. Warrants prepared. But powerful people don't go down easy. Lawyers, threats, compromised agents. Can you survive the pressure?", noTimer: true, chapterComplete: { chapter: 4, nextChapter: 5, summary: "Coming soon..." } } },
};

export const CHAPTER_5: BranchingChapter = {
  id: 5, title: "CHAPTER 5", subtitle: "The Trial", startNode: "5-soon",
  nodes: { "5-soon": { id: "5-soon", type: "chapter-end", text: "🚧 CHAPTER 5: THE TRIAL — COMING SOON 🚧\n\nThe case goes to court. Defendants, lawyers, media circus. Can you hold your nerve on the witness stand? Will the jury believe you?", noTimer: true, chapterComplete: { chapter: 5, nextChapter: 6, summary: "Coming soon..." } } },
};

export const CHAPTER_6: BranchingChapter = {
  id: 6, title: "CHAPTER 6", subtitle: "The Truth", startNode: "6-soon",
  nodes: { "6-soon": { id: "6-soon", type: "chapter-end", text: "🚧 CHAPTER 6: THE TRUTH — COMING SOON 🚧\n\nThe final chapter. All secrets revealed. All scores settled. The complete truth about the island and the people who profited from human misery.", noTimer: true, chapterComplete: { chapter: 6, nextChapter: 7, summary: "Finale awaits..." } } },
};