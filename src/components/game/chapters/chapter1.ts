import { BranchingChapter } from '../types';

/**
 * CHAPTER 1: THE AWAKENING - 5 Stages, ALL with sub-branches
 */
export const CHAPTER_1: BranchingChapter = {
  id: 1,
  title: "CHAPTER 1",
  subtitle: "The Awakening",
  startNode: "1-s1",
  nodes: {
    // ========== STAGE 1: WAKE UP ==========
    "1-s1": {
      id: "1-s1",
      type: "choice",
      text: "Your eyes snap open. Concrete ceiling. Fluorescent lights buzzing. The air tastes like salt and blood. You're in a small room - no windows, steel door, no handle inside. Your head pounds. The last thing you remember... a charity gala. Champagne. A man with perfect teeth.",
      question: "STAGE 1/5 — What do you do first?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Scream for help", nextNode: "1-s1-scream", consequence: "Someone might hear..." },
        { id: 'b', text: "Check your body for injuries", nextNode: "1-s1-check", consequence: "Assess first..." },
        { id: 'c', text: "Try to break down the door", nextNode: "1-s1-death", consequence: "Show strength..." },
        { id: 'd', text: "Stay still and listen", nextNode: "1-s1-listen", consequence: "Gather intel..." },
      ],
    },
    "1-s1-death": {
      id: "1-s1-death", type: "death",
      text: "You hurl yourself at the door. The noise echoes. Guards burst in within seconds. A taser connects with your chest. 'This one's trouble. Double sedation. Basement.' Darkness takes you.",
      deathMessage: "Too aggressive. They've moved you somewhere worse.",
    },
    // Branch A: Scream
    "1-s1-scream": {
      id: "1-s1-scream", type: "choice",
      text: "You scream until your throat is raw. Footsteps approach. A guard in black tactical gear opens the door. 'Awake already?' He studies you coldly.",
      question: "The guard is watching. How do you respond?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Demand answers", nextNode: "1-s1-scream-demand", consequence: "Assert yourself..." },
        { id: 'b', text: "Pretend to be weak", nextNode: "1-s1-scream-weak", consequence: "Underestimation..." },
        { id: 'c', text: "Attack him", nextNode: "1-s1-scream-death", consequence: "Strike now..." },
        { id: 'd', text: "Stay silent", nextNode: "1-s1-scream-silent", consequence: "Watch..." },
      ],
    },
    "1-s1-scream-death": { id: "1-s1-scream-death", type: "death", text: "You lunge. He's faster. Taser catches you mid-leap. 'Hostile. Restraint protocol.' When you wake, you're strapped to a bed.", deathMessage: "Attacking armed guards doesn't work." },
    "1-s1-scream-demand": { id: "1-s1-scream-demand", type: "narrative", text: "'Where am I?' The guard's expression doesn't change. 'Somewhere no one will find you. Cooperate and you last longer.' The door closes. They expect resistance.", nextNode: "1-s2", document: { title: "GUARD_WARNING.pdf", preview: "Cooperation extends survival...", pdfUrl: "/documents/guard-warning.pdf" } },
    "1-s1-scream-weak": { id: "1-s1-scream-weak", type: "narrative", text: "'Please... where am I?' The guard relaxes. 'Just stay calm.' He leaves without checking your restraints. They think you're broken.", nextNode: "1-s2" },
    "1-s1-scream-silent": { id: "1-s1-scream-silent", type: "narrative", text: "You say nothing. The guard shifts uncomfortably, leaves quickly. You notice: loose keycard on his belt, muddy boots, radio about 'VIP arrival 2100.'", nextNode: "1-s2", document: { title: "GUARD_OBSERVATION.pdf", preview: "Loose keycard. VIP arrival 2100...", pdfUrl: "/documents/guard-observation.pdf" } },
    // Branch B: Check body
    "1-s1-check": {
      id: "1-s1-check", type: "choice",
      text: "Zip ties on wrists - tight but professional. Clothes changed to white gown. Everything gone except... your earring with a sharp backing. A vent above. A loose spring under the cot.",
      question: "You found potential tools. What do you focus on?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Work on the earring - it's sharp", nextNode: "1-s1-check-earring", consequence: "Small but useful..." },
        { id: 'b', text: "Get the spring from under the cot", nextNode: "1-s1-check-spring", consequence: "A real edge..." },
        { id: 'c', text: "Test the zip ties for weakness", nextNode: "1-s1-check-ties", consequence: "Know your restraints..." },
        { id: 'd', text: "Try to reach the vent immediately", nextNode: "1-s1-check-death", consequence: "Escape route..." },
      ],
    },
    "1-s1-check-death": { id: "1-s1-check-death", type: "death", text: "You stand on the cot and reach for the vent. The cot tips. You crash to the floor with a loud bang. Guards rush in. 'Trying to escape already?' Taser. Darkness.", deathMessage: "Too hasty. They heard the noise." },
    "1-s1-check-earring": { id: "1-s1-check-earring", type: "narrative", text: "You carefully work the earring free. The backing is sharp - not a weapon, but a tool. You hide it in your gown's hem. Every advantage matters here.", nextNode: "1-s2" },
    "1-s1-check-spring": { id: "1-s1-check-spring", type: "narrative", text: "Silently, you slide off the cot and work the spring free. It has a jagged edge - sharp enough to cut. You hide it in your palm. Now you're armed.", nextNode: "1-s2", document: { title: "WEAPON_ACQUIRED.pdf", preview: "Makeshift blade. 3-inch edge...", pdfUrl: "/documents/weapon.pdf" } },
    "1-s1-check-ties": { id: "1-s1-check-ties", type: "narrative", text: "You test the ties carefully. Professional grade, but there's slight give if you rotate your wrists. The locking mechanism is on top - accessible with something sharp. You file this away.", nextNode: "1-s2" },
    // Branch D: Listen
    "1-s1-listen": {
      id: "1-s1-listen", type: "choice",
      text: "You force yourself still. Beyond the door: footsteps every 15 minutes. Radio chatter: '...VIP at 2100... prepare the merchandise...' Merchandise. That's you. Salt air from the vent. Island.",
      question: "You've gathered intel. What catches your attention most?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "The 15-minute patrol pattern", nextNode: "1-s1-listen-patrol", consequence: "Timing is everything..." },
        { id: 'b', text: "The VIP arrival mention", nextNode: "1-s1-listen-vip", consequence: "Who's coming?" },
        { id: 'c', text: "The salt air from the vent", nextNode: "1-s1-listen-vent", consequence: "Escape route..." },
        { id: 'd', text: "Try to hear more by pressing against the door", nextNode: "1-s1-listen-death", consequence: "Get closer..." },
      ],
    },
    "1-s1-listen-death": { id: "1-s1-listen-death", type: "death", text: "You press your ear to the door. It swings open - a guard was about to enter. You tumble into him. 'The hell?' Before you can react, you're tasered. 'Eavesdropper. Isolation protocol.'", deathMessage: "Wrong time to be at the door." },
    "1-s1-listen-patrol": { id: "1-s1-listen-patrol", type: "narrative", text: "Every 15 minutes, like clockwork. You count three cycles. Always the same boots. One guard on this hallway. Predictable. Exploitable.", nextNode: "1-s2", document: { title: "PATROL_TIMING.pdf", preview: "15-min rotation. Single guard. Predictable...", pdfUrl: "/documents/patrol.pdf" } },
    "1-s1-listen-vip": { id: "1-s1-listen-vip", type: "narrative", text: "'VIP arrival 2100. Guest quarters prepared.' Guests? This isn't just a prison. Someone important is coming tonight. Someone who pays for... you don't want to think about what.", nextNode: "1-s2" },
    "1-s1-listen-vent": { id: "1-s1-listen-vent", type: "narrative", text: "Salt air. Waves in the distance. Seabirds. You're on an island - isolated, hard to escape. But that vent... it goes somewhere. And salt corrodes metal. The screws might be weak.", nextNode: "1-s2" },

    // ========== STAGE 2: ASSESS THE ROOM ==========
    "1-s2": {
      id: "1-s2",
      type: "choice",
      text: "The room is your world now. 10x10 feet. Steel door. Concrete walls. Vent above. Metal cot. A drain in the center - why would a room need a drain? You don't want to think about that.",
      question: "STAGE 2/5 — What do you examine closely?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "The ventilation grate above", nextNode: "1-s2-vent", consequence: "Fresh air means escape..." },
        { id: 'b', text: "The metal cot and frame", nextNode: "1-s2-cot", consequence: "Find tools..." },
        { id: 'c', text: "The door and lock mechanism", nextNode: "1-s2-door", consequence: "Know the obstacle..." },
        { id: 'd', text: "The drain in the floor", nextNode: "1-s2-death", consequence: "Investigate everything..." },
      ],
    },
    "1-s2-death": { id: "1-s2-death", type: "death", text: "You pull at the drain grate. It comes loose - and gas rushes out. Sedative. Your vision blurs. 'Told you the drain trap works,' someone says as you collapse.", deathMessage: "The drain was a trap." },
    // Branch A: Vent
    "1-s2-vent": {
      id: "1-s2-vent", type: "choice",
      text: "Standing on the cot, you reach the vent. Rusted screws - salt corrosion. Through the slats: sea air, distant waves, footsteps above. Another floor. The shaft looks tight but passable.",
      question: "The vent is promising. What's your approach?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Test if the screws can be turned by hand", nextNode: "1-s2-vent-hand", consequence: "Quiet approach..." },
        { id: 'b', text: "Use your earring/spring to unscrew them", nextNode: "1-s2-vent-tool", consequence: "Use your tools..." },
        { id: 'c', text: "Try to break the grate with force", nextNode: "1-s2-vent-death", consequence: "Quick removal..." },
        { id: 'd', text: "Just observe for now - note it as an option", nextNode: "1-s2-vent-note", consequence: "Don't commit yet..." },
      ],
    },
    "1-s2-vent-death": { id: "1-s2-vent-death", type: "death", text: "You yank at the grate. Metal screeches. The cot tips. You crash down with a clatter that echoes through the building. Guards in seconds. 'Vent attempt. Third one this week.'", deathMessage: "Too loud. They were listening." },
    "1-s2-vent-hand": { id: "1-s2-vent-hand", type: "narrative", text: "The screws are corroded but stuck. You can't turn them by hand, but they're definitely weakened. With a tool and time, they'd come out. You memorize their positions.", nextNode: "1-s3" },
    "1-s2-vent-tool": { id: "1-s2-vent-tool", type: "narrative", text: "Using your tool, you work at the screws. Slowly, silently. Two come loose. You stop - can't remove the grate yet without a plan. But now you know: this is your exit.", nextNode: "1-s3", document: { title: "VENT_ACCESS.pdf", preview: "2 of 4 screws removed. Shaft passable. Upper floor accessible...", pdfUrl: "/documents/vent.pdf" } },
    "1-s2-vent-note": { id: "1-s2-vent-note", type: "narrative", text: "You step down from the cot. The vent is an option - maybe the best one - but you need to know more before you commit. Timing. Patrol patterns. What's on the other side.", nextNode: "1-s3" },
    // Branch B: Cot
    "1-s2-cot": {
      id: "1-s2-cot", type: "choice",
      text: "The cot is old, institutional. Bolts corroded. Under it - a loose spring with a jagged edge. Someone else was here before you. Someone else tried to escape.",
      question: "The cot has secrets. What interests you?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Take the loose spring as a weapon", nextNode: "1-s2-cot-spring", consequence: "Arm yourself..." },
        { id: 'b', text: "Check if the cot can be moved quietly", nextNode: "1-s2-cot-move", consequence: "Mobility matters..." },
        { id: 'c', text: "Look for any other hidden items", nextNode: "1-s2-cot-search", consequence: "What else is here..." },
        { id: 'd', text: "Try to unbolt it from the floor", nextNode: "1-s2-cot-death", consequence: "Heavy weapon..." },
      ],
    },
    "1-s2-cot-death": { id: "1-s2-cot-death", type: "death", text: "You work at the bolts. They're loud, screeching against concrete. A guard opens the door mid-screech. 'Trying to make a weapon? That's a Protocol 7.' You don't want to know what that means.", deathMessage: "Too noisy. They monitor for exactly this." },
    "1-s2-cot-spring": { id: "1-s2-cot-spring", type: "narrative", text: "You pocket the spring carefully. It's sharp, maybe 3 inches. Not much, but it could cut zip ties, pick a lock, or... defend yourself. You're not helpless anymore.", nextNode: "1-s3" },
    "1-s2-cot-move": { id: "1-s2-cot-move", type: "narrative", text: "The cot scrapes, but if you lift it slightly, it's silent. You could position it under the vent as a stepping stone. Or use it to barricade the door. Options.", nextNode: "1-s3" },
    "1-s2-cot-search": { id: "1-s2-cot-search", type: "narrative", text: "Under the mattress pad - scratched into the metal frame: 'THEY WATCH THE DRAIN. MARINA SLIP 7.' Someone left you a message. A warning. A clue.", nextNode: "1-s3", document: { title: "PREVIOUS_CAPTIVE.pdf", preview: "Message found: 'MARINA SLIP 7.' Previous escape attempt?", pdfUrl: "/documents/captive-note.pdf" } },
    // Branch C: Door
    "1-s2-door": {
      id: "1-s2-door", type: "choice",
      text: "Steel door, electronic lock. Old model card reader. A gap at the top of the frame - not enough to squeeze through, but you can see the hallway light. And hear conversations.",
      question: "The door is the obvious exit. What's your focus?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Study the card reader model", nextNode: "1-s2-door-reader", consequence: "Know the lock..." },
        { id: 'b', text: "Listen through the gap for intel", nextNode: "1-s2-door-listen", consequence: "Gather info..." },
        { id: 'c', text: "Check if the hinges are accessible", nextNode: "1-s2-door-hinges", consequence: "Alternative entry..." },
        { id: 'd', text: "Try to force the card reader open", nextNode: "1-s2-door-death", consequence: "Hack it..." },
      ],
    },
    "1-s2-door-death": { id: "1-s2-door-death", type: "death", text: "You pry at the card reader. It beeps angry red. Alarm. Guards. 'Tampering with security systems. That's a basement offense.' You're dragged away.", deathMessage: "The reader has tamper detection." },
    "1-s2-door-reader": { id: "1-s2-door-reader", type: "narrative", text: "Old model - HID ProxPoint. Vulnerable to cloning, but you'd need a keycard to copy. What you really need is to get a guard's card. Or wait for someone to open it from outside.", nextNode: "1-s3", document: { title: "LOCK_ANALYSIS.pdf", preview: "HID ProxPoint Plus. Cloning vulnerable. Card required...", pdfUrl: "/documents/lock.pdf" } },
    "1-s2-door-listen": { id: "1-s2-door-listen", type: "narrative", text: "Voices carry through the gap. '...new batch arriving Thursday...' '...Client list for tonight...' '...she's in C-7, high value...' High value. That's you. Important enough to keep alive. For now.", nextNode: "1-s3" },
    "1-s2-door-hinges": { id: "1-s2-door-hinges", type: "narrative", text: "Hinges are internal - no access from this side. But you notice: the door opens inward. If you could hide behind it when a guard enters... they wouldn't see you immediately.", nextNode: "1-s3" },

    // ========== STAGE 3: FREE YOURSELF ==========
    "1-s3": {
      id: "1-s3",
      type: "choice",
      text: "Your wrists ache from the zip ties. You've explored the room, found tools, gathered intel. Now the restraints need to go. You can't do anything while bound.",
      question: "STAGE 3/5 — How do you free yourself?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Pick at the lock with your earring", nextNode: "1-s3-earring", consequence: "Delicate work..." },
        { id: 'b', text: "Saw through with the spring edge", nextNode: "1-s3-spring", consequence: "Slow and steady..." },
        { id: 'c', text: "Dislocate your thumb to slip out", nextNode: "1-s3-dislocate", consequence: "Pain is temporary..." },
        { id: 'd', text: "Snap them with a hard motion", nextNode: "1-s3-death", consequence: "Quick and direct..." },
      ],
    },
    "1-s3-death": { id: "1-s3-death", type: "death", text: "You raise your arms and slam them down. The noise echoes. Ties don't break. Guards burst in. 'Sedation protocol.' Needle. Darkness.", deathMessage: "The noise gave you away." },
    // Branch A: Earring
    "1-s3-earring": {
      id: "1-s3-earring", type: "choice",
      text: "The earring backing is tiny but sharp. You work it into the zip tie mechanism. It's slow, delicate work. Your hands tremble. Twenty minutes pass.",
      question: "Progress is slow. How do you proceed?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Keep working - patience wins", nextNode: "1-s3-earring-patience", consequence: "Stay calm..." },
        { id: 'b', text: "Apply more force to the mechanism", nextNode: "1-s3-earring-force", consequence: "Speed it up..." },
        { id: 'c', text: "Take a break, listen for guards", nextNode: "1-s3-earring-pause", consequence: "Don't get caught..." },
        { id: 'd', text: "Give up and try a different method", nextNode: "1-s3-earring-death", consequence: "This isn't working..." },
      ],
    },
    "1-s3-earring-death": { id: "1-s3-earring-death", type: "death", text: "Frustrated, you yank at the ties. The earring snaps, embedding in your palm. You cry out. Guards hear. 'Self-harm attempt. Medical protocol.' They strap you down.", deathMessage: "Frustration got the better of you." },
    "1-s3-earring-patience": { id: "1-s3-earring-patience", type: "narrative", text: "Click. The mechanism releases. Your wrists are raw, bleeding slightly, but free. You pocket the earring - it saved you once. Might save you again.", nextNode: "1-s4" },
    "1-s3-earring-force": { id: "1-s3-earring-force", type: "narrative", text: "A bit more pressure... click! The tie releases faster than expected. Your wrists throb but you're free. The earring is bent but still usable.", nextNode: "1-s4" },
    "1-s3-earring-pause": { id: "1-s3-earring-pause", type: "narrative", text: "You freeze as footsteps pass. They don't stop. You resume, and two minutes later - click. Free. The guard never knew how close he came to catching you.", nextNode: "1-s4", document: { title: "CLOSE_CALL.pdf", preview: "Guard passed during escape attempt. Undetected...", pdfUrl: "/documents/close-call.pdf" } },
    // Branch B: Spring
    "1-s3-spring": {
      id: "1-s3-spring", type: "choice",
      text: "The spring edge bites into plastic. And your fingers. Blood mixes with sweat. The tie frays slowly, strand by strand. Progress.",
      question: "Cutting hurts but works. What's your focus?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Ignore the pain, cut faster", nextNode: "1-s3-spring-fast", consequence: "Speed matters..." },
        { id: 'b', text: "Slow and careful to avoid more cuts", nextNode: "1-s3-spring-careful", consequence: "Preserve yourself..." },
        { id: 'c', text: "Wrap something around your fingers first", nextNode: "1-s3-spring-wrap", consequence: "Protect your hands..." },
        { id: 'd', text: "Switch to sawing the other wrist tie", nextNode: "1-s3-spring-death", consequence: "Different angle..." },
      ],
    },
    "1-s3-spring-death": { id: "1-s3-spring-death", type: "death", text: "You twist to cut the other wrist. The angle is wrong. The spring slips, slices deep into your wrist. Blood. Too much blood. You cry out. Guards. Medical. Restraints.", deathMessage: "Wrong angle. Self-inflicted wound." },
    "1-s3-spring-fast": { id: "1-s3-spring-fast", type: "narrative", text: "Pain is nothing. Freedom is everything. The tie snaps. Your fingers are cut, bleeding, but you're free. You have a weapon. You're dangerous now.", nextNode: "1-s4" },
    "1-s3-spring-careful": { id: "1-s3-spring-careful", type: "narrative", text: "Slow, measured cuts. The tie weakens, weakens, breaks. Minimal damage to your hands. You'll need them in good condition for what comes next.", nextNode: "1-s4" },
    "1-s3-spring-wrap": { id: "1-s3-spring-wrap", type: "narrative", text: "You tear a strip from your gown, wrap your fingers. Then cut. Cleaner, safer. The tie breaks. You're free with minimal injury and a makeshift bandage.", nextNode: "1-s4", document: { title: "FIRST_AID.pdf", preview: "Improvised bandage. Minimal blood loss. Ready to move...", pdfUrl: "/documents/first-aid.pdf" } },
    // Branch C: Dislocate
    "1-s3-dislocate": {
      id: "1-s3-dislocate", type: "choice",
      text: "You grip your thumb. This is going to hurt. A lot. But pain fades. Freedom doesn't. You take a deep breath.",
      question: "Ready to dislocate. How do you approach it?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Quick and decisive - just do it", nextNode: "1-s3-dislocate-quick", consequence: "Rip the bandaid..." },
        { id: 'b', text: "Slowly apply pressure", nextNode: "1-s3-dislocate-slow", consequence: "Controlled pain..." },
        { id: 'c', text: "Bite your gown to muffle any scream", nextNode: "1-s3-dislocate-muffle", consequence: "Stay silent..." },
        { id: 'd', text: "Reconsider - find another way", nextNode: "1-s3-dislocate-death", consequence: "Maybe not..." },
      ],
    },
    "1-s3-dislocate-death": { id: "1-s3-dislocate-death", type: "death", text: "You hesitate. Pull back. Try again. The indecision makes it worse - partial dislocation. Agony. You scream before you can stop yourself. Guards. Medical. They reset your thumb. Under sedation.", deathMessage: "Hesitation made it worse." },
    "1-s3-dislocate-quick": { id: "1-s3-dislocate-quick", type: "narrative", text: "Wrench. Pop. White-hot pain. Your hand slides through. Tears stream but you don't scream. You force the joint back. Not perfect. You'll pay for this for weeks. But you're free.", nextNode: "1-s4" },
    "1-s3-dislocate-slow": { id: "1-s3-dislocate-slow", type: "narrative", text: "Steady pressure. You feel the joint give way, millimeter by millimeter. The pain is different this way - deep, building. Pop. Through. Reset. Manageable.", nextNode: "1-s4" },
    "1-s3-dislocate-muffle": { id: "1-s3-dislocate-muffle", type: "narrative", text: "Gown between your teeth. Wrench. You bite down so hard you taste blood. But no scream escapes. Through. Reset. Silent. They don't know you're free.", nextNode: "1-s4", document: { title: "SILENT_ESCAPE.pdf", preview: "Thumb dislocated silently. No alert triggered...", pdfUrl: "/documents/silent-escape.pdf" } },

    // ========== STAGE 4: THE GUARD ==========
    "1-s4": {
      id: "1-s4",
      type: "choice",
      text: "Footsteps. Keys jingling. Radio crackle. A guard is approaching for rounds. You have maybe thirty seconds. The room offers few options - behind the door, on the cot pretending, or under it in shadows.",
      question: "STAGE 4/5 — The guard is coming. What's your move?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Hide behind the door", nextNode: "1-s4-ambush", consequence: "Ambush position..." },
        { id: 'b', text: "Lie on the cot, pretend to be tied", nextNode: "1-s4-pretend", consequence: "Play helpless..." },
        { id: 'c', text: "Squeeze under the cot", nextNode: "1-s4-death", consequence: "Hide in shadows..." },
        { id: 'd', text: "Stand in the center and face him", nextNode: "1-s4-confront", consequence: "Bold approach..." },
      ],
    },
    "1-s4-death": { id: "1-s4-death", type: "death", text: "Under the cot. Door opens. Guard sees cut zip ties. Crouches. Flashlight finds you instantly. 'There you are.' Response team called.", deathMessage: "Too obvious a hiding spot." },
    // Branch A: Ambush
    "1-s4-ambush": {
      id: "1-s4-ambush", type: "choice",
      text: "Against the wall, door's arc covering you. It swings open. Guard steps in, flashlight sweeping. His back to you. Neck exposed.",
      question: "He doesn't see you. How do you take him down?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Chokehold from behind", nextNode: "1-s4-ambush-choke", consequence: "Silent takedown..." },
        { id: 'b', text: "Strike the back of his head", nextNode: "1-s4-ambush-strike", consequence: "Quick knockout..." },
        { id: 'c', text: "Grab his taser", nextNode: "1-s4-ambush-taser", consequence: "Use his weapon..." },
        { id: 'd', text: "Shove him and run", nextNode: "1-s4-ambush-death", consequence: "Speed over stealth..." },
      ],
    },
    "1-s4-ambush-death": { id: "1-s4-ambush-death", type: "death", text: "You shove and sprint. He catches your gown, yanks back. You hit floor. Knee on spine. 'Runner! Block C!'", deathMessage: "He was trained for runners." },
    "1-s4-ambush-choke": { id: "1-s4-ambush-choke", type: "narrative", text: "Arm around throat. He struggles, claws at you. Ten seconds. Twenty. Limp. You lower him gently. Take keycard, radio, taser. Armed and dangerous.", nextNode: "1-s5", document: { title: "GUARD_KEYCARD.pdf", preview: "Level 2 Access - J. Mendez. Block C, Medical, Marina...", pdfUrl: "/documents/keycard.pdf" } },
    "1-s4-ambush-strike": { id: "1-s4-ambush-strike", type: "narrative", text: "Elbow to skull base. He drops. Pulse steady - alive, unconscious. You take his gear. Radio crackles: 'Mendez, status?' Time is limited.", nextNode: "1-s5" },
    "1-s4-ambush-taser": { id: "1-s4-ambush-taser", type: "narrative", text: "You grab his taser, fire. He seizes and drops. Brief guilt, then you remember where you are. Keycard, radio, taser - all yours.", nextNode: "1-s5" },
    // Branch B: Pretend
    "1-s4-pretend": {
      id: "1-s4-pretend", type: "choice",
      text: "On the cot, hands behind back, eyes closed. Door opens. Footsteps approach. Guard checks pulse, breathing. He doesn't notice the missing ties in dim light.",
      question: "He's close and unsuspecting. What do you do?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Wait for him to leave", nextNode: "1-s4-pretend-wait", consequence: "Patience..." },
        { id: 'b', text: "Grab him when he turns", nextNode: "1-s4-pretend-grab", consequence: "Strike now..." },
        { id: 'c', text: "Ask him a question to distract", nextNode: "1-s4-pretend-talk", consequence: "Misdirection..." },
        { id: 'd', text: "Kick him hard in the knee", nextNode: "1-s4-pretend-death", consequence: "Disable him..." },
      ],
    },
    "1-s4-pretend-death": { id: "1-s4-pretend-death", type: "death", text: "You kick. He stumbles but doesn't fall. Training kicks in - he draws his taser mid-fall and fires. You go down convulsing.", deathMessage: "He was trained to fight while off-balance." },
    "1-s4-pretend-wait": { id: "1-s4-pretend-wait", type: "narrative", text: "He turns to leave. Something clatters - his keycard fell when he leaned over. Door closes. You grab the card. Level 2 Access.", nextNode: "1-s5" },
    "1-s4-pretend-grab": { id: "1-s4-pretend-grab", type: "narrative", text: "As he turns, you move. Arm around neck, legs wrapped around torso. He can't reach his weapons. Thirty seconds of struggling. Unconscious. Yours now.", nextNode: "1-s5" },
    "1-s4-pretend-talk": { id: "1-s4-pretend-talk", type: "narrative", text: "'Water... please...' He pauses. 'Someone will bring—' You move while he's distracted. He's down before he finishes the sentence. His kindness was his weakness.", nextNode: "1-s5", document: { title: "GUARD_PROFILE.pdf", preview: "Guard showed hesitation. Potential conscience. Exploitable...", pdfUrl: "/documents/guard-profile.pdf" } },
    // Branch D: Confront
    "1-s4-confront": {
      id: "1-s4-confront", type: "choice",
      text: "You stand free in the center when the door opens. Guard freezes, hand moving to taser. 'How did you—' Your composure throws him off.",
      question: "He's uncertain. How do you use that?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "'I want to see who's in charge'", nextNode: "1-s4-confront-boss", consequence: "Demand authority..." },
        { id: 'b', text: "'Help me and I'll make you rich'", nextNode: "1-s4-confront-bribe", consequence: "Appeal to greed..." },
        { id: 'c', text: "Stay silent, maintain eye contact", nextNode: "1-s4-confront-stare", consequence: "Intimidate..." },
        { id: 'd', text: "Charge him while he hesitates", nextNode: "1-s4-confront-death", consequence: "Strike now..." },
      ],
    },
    "1-s4-confront-death": { id: "1-s4-confront-death", type: "death", text: "You charge. Hesitation ends. Taser fires. You drop. 'Aggressive. Protocol 7.' You shouldn't have given him time to recover.", deathMessage: "You gave him time to react." },
    "1-s4-confront-boss": { id: "1-s4-confront-boss", type: "narrative", text: "'I want to see whoever's in charge.' He radios: 'C-7 wants to talk.' Response: 'Interesting. Processing.' You'll see more of this place at least.", nextNode: "1-s5" },
    "1-s4-confront-bribe": { id: "1-s4-confront-bribe", type: "narrative", text: "'Help me escape and I'll make sure you're protected. Named as a witness. Immunity.' He hesitates. Then: 'They pay better than your promises.' But he didn't call for backup immediately. Doubt planted.", nextNode: "1-s5" },
    "1-s4-confront-stare": { id: "1-s4-confront-stare", type: "narrative", text: "You say nothing. Just stare. He shifts. Uncomfortable. 'Look, just... stay there.' He backs out, forgetting to lock the door properly. Fear is a weapon.", nextNode: "1-s5", document: { title: "DOOR_UNLOCKED.pdf", preview: "Guard forgot to properly secure door. Exit accessible...", pdfUrl: "/documents/door-unlocked.pdf" } },

    // ========== STAGE 5: ESCAPE THE CELL ==========
    "1-s5": {
      id: "1-s5",
      type: "choice",
      text: "Time to leave this cell. You have a keycard and/or the door may be unsecured. The vent is an option too. Salt air from both directions. Activity through the door, silence through the vent.",
      question: "STAGE 5/5 — How do you escape this room?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Use the keycard on the door", nextNode: "1-s5-door", consequence: "Direct exit..." },
        { id: 'b', text: "Climb through the vent", nextNode: "1-s5-vent", consequence: "Hidden path..." },
        { id: 'c', text: "Wait for shift change", nextNode: "1-s5-wait", consequence: "Timing..." },
        { id: 'd', text: "Radio a fake emergency elsewhere", nextNode: "1-s5-death", consequence: "Create chaos..." },
      ],
    },
    "1-s5-death": { id: "1-s5-death", type: "death", text: "'Fire in Block A!' Alarms blare. You slip out - into guards coming FROM Block A. 'No fire in A.' They see the radio. 'Nice try.'", deathMessage: "They recognized the false alarm." },
    // Branch A: Door
    "1-s5-door": {
      id: "1-s5-door", type: "choice",
      text: "Keycard beeps green. Sterile corridor. Cameras above - one has cracked lens. Signs: PROCESSING, MEDICAL, EXIT. Through a window - palm trees, searchlights, ocean.",
      question: "You're in the hallway. Which way?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Head toward EXIT sign", nextNode: "1-s5-door-exit", consequence: "Freedom..." },
        { id: 'b', text: "Go toward MEDICAL for supplies", nextNode: "1-s5-door-medical", consequence: "Gear up..." },
        { id: 'c', text: "Follow PROCESSING to learn more", nextNode: "1-s5-door-processing", consequence: "Intel..." },
        { id: 'd', text: "Run down the corridor fast", nextNode: "1-s5-door-death", consequence: "Speed..." },
      ],
    },
    "1-s5-door-death": { id: "1-s5-door-death", type: "death", text: "You sprint. Motion sensor triggers. Alarm. Every door locks. Guards converge. 'Runner in B corridor.' Nowhere to go.", deathMessage: "Motion sensors don't care about keycards." },
    "1-s5-door-exit": { id: "1-s5-door-exit", type: "narrative", text: "Following EXIT signs, staying under the broken camera. A door at the end. You push through into salt air and darkness. You're outside Block C. Stars above. Ocean all around. An island.", nextNode: "1-complete" },
    "1-s5-door-medical": { id: "1-s5-door-medical", type: "narrative", text: "Medical is empty. Bandages, antibiotics, a scalpel. And a log book - names, dates, 'procedures.' Evidence. You photograph pages with a camera you find, then head for the exit.", nextNode: "1-complete", document: { title: "MEDICAL_LOG.pdf", preview: "Evidence of systematic abuse. Names and dates documented...", pdfUrl: "/documents/medical-log.pdf" } },
    "1-s5-door-processing": { id: "1-s5-door-processing", type: "narrative", text: "Processing is a intake area. Files on a desk. New arrivals. Photos. Ages. Prices. You grab what you can and run. This isn't just trafficking. It's an auction.", nextNode: "1-complete", document: { title: "AUCTION_FILES.pdf", preview: "Pricing sheets. Buyer preferences. International clients...", pdfUrl: "/documents/auction.pdf" } },
    // Branch B: Vent
    "1-s5-vent": {
      id: "1-s5-vent", type: "choice",
      text: "You remove the grate and pull yourself up into darkness. Tight shaft, but passable. Crawling toward fresh air. Through other grates - more cells. More prisoners.",
      question: "You see other captives below. What do you do?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Keep moving - can't save them yet", nextNode: "1-s5-vent-move", consequence: "Survive first..." },
        { id: 'b', text: "Memorize their faces and locations", nextNode: "1-s5-vent-memorize", consequence: "Come back for them..." },
        { id: 'c', text: "Whisper to them that help is coming", nextNode: "1-s5-vent-whisper", consequence: "Give them hope..." },
        { id: 'd', text: "Try to open their grates from above", nextNode: "1-s5-vent-death", consequence: "Free them now..." },
      ],
    },
    "1-s5-vent-death": { id: "1-s5-vent-death", type: "death", text: "You pry at a grate. It falls, crashing into the cell below. Screams. Alarms. Guards trace the noise to the vents. They find you in minutes.", deathMessage: "The falling grate gave you away." },
    "1-s5-vent-move": { id: "1-s5-vent-move", type: "narrative", text: "You force yourself forward. Every cell you pass is a promise: you'll come back. With police. With media. With an army. But first, you survive.", nextNode: "1-complete" },
    "1-s5-vent-memorize": { id: "1-s5-vent-memorize", type: "narrative", text: "Twelve cells. Twelve faces. You burn them into your memory. Men, women, children. When you escape, you'll know exactly who to save and where to find them.", nextNode: "1-complete", document: { title: "CAPTIVE_LOCATIONS.pdf", preview: "12 prisoners mapped. Cell numbers and descriptions...", pdfUrl: "/documents/captive-locations.pdf" } },
    "1-s5-vent-whisper": { id: "1-s5-vent-whisper", type: "narrative", text: "'Don't give up. Help is coming.' You see eyes look up. Fear becomes hope. A girl mouths 'thank you.' You keep moving, but you've given them a reason to survive.", nextNode: "1-complete" },
    // Branch C: Wait
    "1-s5-wait": {
      id: "1-s5-wait", type: "choice",
      text: "0300. Shift change. Skeleton crew. You slip out into dim emergency lighting. Signs everywhere. GUEST QUARTERS. RECREATION. PROCESSING. This place looks almost legitimate.",
      question: "The corridor is empty. What's your priority?",
      timerSeconds: 20,
      choices: [
        { id: 'a', text: "Head directly outside", nextNode: "1-s5-wait-outside", consequence: "Fresh air..." },
        { id: 'b', text: "Look for a communications room", nextNode: "1-s5-wait-comms", consequence: "Call for help..." },
        { id: 'c', text: "Find the GUEST QUARTERS to see more", nextNode: "1-s5-wait-guest", consequence: "Know the enemy..." },
        { id: 'd', text: "Check every door you pass", nextNode: "1-s5-wait-death", consequence: "Miss nothing..." },
      ],
    },
    "1-s5-wait-death": { id: "1-s5-wait-death", type: "death", text: "You try door after door. Third one opens into a guard bunk room. Four guards stare at you. 'Lost?' Taser. Restraints. Back to a cell. A different one this time.", deathMessage: "Checking random doors was gambling." },
    "1-s5-wait-outside": { id: "1-s5-wait-outside", type: "narrative", text: "You follow the salt smell. A service door. You push through into the night. Stars above. Ocean all around. Palm trees. Searchlights in the distance. You're outside Block C.", nextNode: "1-complete" },
    "1-s5-wait-comms": { id: "1-s5-wait-comms", type: "narrative", text: "A small office with a phone. You dial 911. 'Island trafficking operation. Multiple victims. Armed guards.' The operator takes it seriously. Maybe help is coming. You head outside.", nextNode: "1-complete", document: { title: "911_CALL.pdf", preview: "Emergency call placed. Location given. Response unknown...", pdfUrl: "/documents/911-call.pdf" } },
    "1-s5-wait-guest": { id: "1-s5-wait-guest", type: "narrative", text: "Guest Quarters is a wing of luxury suites. Through a window - men in robes, champagne, a girl being led in. Clients. This isn't just a prison. It's a resort for monsters. You've seen enough. You head for the exit.", nextNode: "1-complete" },

    // ========== CHAPTER 1 COMPLETE ==========
    "1-complete": {
      id: "1-complete",
      type: "chapter-end",
      text: "You've escaped Block C. Salt wind hits your face. Stars above. Ocean all around. An island compound hidden in paradise. Searchlights sweep below. A marina glints in the distance. You're not the only one trapped here. And whoever runs this place has powerful friends. The real challenge begins now.",
      chapterComplete: { chapter: 1, nextChapter: 2, summary: "You escaped your cell and learned the island's dark purpose. Now comes the compound." },
    },
  },
};