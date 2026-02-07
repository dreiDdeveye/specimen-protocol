import { Chapter } from './types';

export const TIMER_SECONDS = 300; // 5 minutes per chapter

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "CHAPTER 1",
    subtitle: "The Awakening",
    stages: [
      {
        id: 1,
        text: "Your eyes snap open. Concrete ceiling. Fluorescent lights buzzing. The air tastes like salt and something metallic - blood? You're in a small room. No windows. A steel door with no handle on the inside.",
        question: "What's the first thing you should do?",
        choices: [
          { id: 'a', text: "Scream for help", isCorrect: false },
          { id: 'b', text: "Check your body for injuries", isCorrect: true },
          { id: 'c', text: "Try to break down the door", isCorrect: false },
          { id: 'd', text: "Go back to sleep", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "You check yourself. Zip ties on wrists and ankles. Professional. Tight but not cutting circulation. Someone wanted you restrained but alive. Your clothes are different - a plain white gown. Your phone, wallet, everything is gone.",
        question: "How do you try to free yourself?",
        choices: [
          { id: 'a', text: "Bite through the zip ties", isCorrect: false },
          { id: 'b', text: "Look for something sharp in the room", isCorrect: true },
          { id: 'c', text: "Slam your wrists against the wall", isCorrect: false },
          { id: 'd', text: "Wait for someone to come", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Under the metal cot, you find a loose spring. It takes time, but you work it free. The edge is sharp enough. As you cut, fragments return: A charity gala. Champagne. A man with perfect teeth saying 'You have to see the island.' Then... nothing.",
        question: "The zip ties are off. What now?",
        choices: [
          { id: 'a', text: "Hide under the bed and wait", isCorrect: false },
          { id: 'b', text: "Examine the room thoroughly", isCorrect: true },
          { id: 'c', text: "Start banging on the door", isCorrect: false },
          { id: 'd', text: "Try to pick the lock with the spring", isCorrect: false },
        ],
        document: {
          title: "GALA_INVITATION.pdf",
          preview: "You're cordially invited to the Paradise Foundation annual gala...",
          pdfUrl: "/documents/gala-invitation.pdf"
        }
      },
      {
        id: 4,
        text: "The room is 10x10 feet. Steel door with electronic lock. A drain in the center of the floor - why would a room need a drain? Above: a ventilation grate, rusted at the corners. The cot is bolted down but the bolts are old.",
        question: "You hear footsteps approaching. What's your move?",
        choices: [
          { id: 'a', text: "Hide behind the door to ambush", isCorrect: false },
          { id: 'b', text: "Pretend to still be tied up", isCorrect: true },
          { id: 'c', text: "Try to escape through the vent now", isCorrect: false },
          { id: 'd', text: "Start screaming", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "You arrange yourself on the cot, hands behind your back, eyes closed. The door opens. Radio static: 'Block C, new arrival confirmed. Prep for tonight. VIPs arriving at 2100.' A guard checks you briefly, doesn't notice the cut ties. The door closes.",
        question: "The guard left something behind - a keycard on the floor. How do you retrieve it?",
        choices: [
          { id: 'a', text: "Jump up immediately and grab it", isCorrect: false },
          { id: 'b', text: "Wait 5 minutes, then carefully move", isCorrect: true },
          { id: 'c', text: "Crawl on the floor loudly", isCorrect: false },
          { id: 'd', text: "Ignore it - could be a trap", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "You have the keycard. The vent is loose enough to remove. The door has a card reader. You can hear multiple footsteps in the corridor now - shift change maybe. Through the vent, you smell salt air. The keycard might work but you don't know what's outside.",
        question: "How do you escape this room?",
        choices: [
          { id: 'a', text: "Use the keycard on the door", isCorrect: false },
          { id: 'b', text: "Wait for the corridor to quiet down", isCorrect: false },
          { id: 'c', text: "Climb through the ventilation shaft", isCorrect: true },
          { id: 'd', text: "Start a fire to trigger alarms", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "CHAPTER 2",
    subtitle: "The Tunnels",
    stages: [
      {
        id: 1,
        text: "The vent leads to a network of maintenance tunnels. Emergency lighting casts everything in hellish red. Water drips somewhere. The air is thick with humidity and something else - fear. You can go left toward the smell of ocean, or right toward distant machinery.",
        question: "Which direction do you choose?",
        choices: [
          { id: 'a', text: "Left toward the ocean smell", isCorrect: true },
          { id: 'b', text: "Right toward machinery", isCorrect: false },
          { id: 'c', text: "Stay in the vent and hide", isCorrect: false },
          { id: 'd', text: "Go back to the room", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "The tunnel curves. A map is bolted to the wall, covered in dust. Most areas marked 'RESTRICTED'. You trace the layout - this island is bigger than you thought. There's a marina on the north end. Service tunnels connect to it but are marked 'EMERGENCY ONLY'.",
        question: "You hear dogs barking in the distance. What do you do?",
        choices: [
          { id: 'a', text: "Run as fast as you can", isCorrect: false },
          { id: 'b', text: "Find water to mask your scent", isCorrect: true },
          { id: 'c', text: "Hide and don't move", isCorrect: false },
          { id: 'd', text: "Try to befriend the dogs", isCorrect: false },
        ],
        document: {
          title: "ISLAND_MAP.pdf",
          preview: "Facility layout showing restricted zones and emergency routes...",
          pdfUrl: "/documents/island-map.pdf"
        }
      },
      {
        id: 3,
        text: "A drainage pipe runs along the tunnel floor. Ankle-deep water, cold but manageable. You wade through it, hoping it masks your trail. The barking grows distant. Ahead, the tunnel splits - one path has flickering lights, the other is pitch black.",
        question: "Which path do you take?",
        choices: [
          { id: 'a', text: "The lit path - you need to see", isCorrect: false },
          { id: 'b', text: "The dark path - harder to be spotted", isCorrect: true },
          { id: 'c', text: "Wait at the junction", isCorrect: false },
          { id: 'd', text: "Go back through the water", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Your eyes adjust to the darkness. You move by touch, one hand on the wall. Suddenly - voices ahead. Two guards talking: 'Third one this month trying to run. They never make it past the dogs.' 'This one's different. VIP wants her personally.'",
        question: "The guards are blocking your path. What do you do?",
        choices: [
          { id: 'a', text: "Attack them by surprise", isCorrect: false },
          { id: 'b', text: "Create a distraction and slip past", isCorrect: true },
          { id: 'c', text: "Surrender and beg for help", isCorrect: false },
          { id: 'd', text: "Scream to alert others", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "You find a loose pipe and throw it down a side tunnel. The clang echoes. 'What was that?' Both guards move to investigate. You have maybe 30 seconds. Beyond them, you see a ladder leading up and a door marked 'STAFF ONLY'.",
        question: "Which exit do you take?",
        choices: [
          { id: 'a', text: "The ladder going up", isCorrect: true },
          { id: 'b', text: "The staff door", isCorrect: false },
          { id: 'c', text: "Follow the guards quietly", isCorrect: false },
          { id: 'd', text: "Hide where you are", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "The ladder leads to a hatch. You push it open slowly - moonlight floods in. You're outside. Palm trees. Ocean breeze. But also: searchlights sweeping the grounds, a watchtower in the distance, and the sound of a helicopter approaching.",
        question: "Where do you go from here?",
        choices: [
          { id: 'a', text: "Run toward the beach", isCorrect: false },
          { id: 'b', text: "Hide in the palm trees and observe", isCorrect: true },
          { id: 'c', text: "Wave at the helicopter for rescue", isCorrect: false },
          { id: 'd', text: "Go back down the hatch", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "CHAPTER 3",
    subtitle: "The Compound",
    stages: [
      {
        id: 1,
        text: "From the trees, you observe the compound. Several buildings - a main mansion lit up with activity, smaller guest houses, and a strange domed structure that hums with electricity. Guards patrol in pairs. The helicopter lands near the mansion.",
        question: "You need information to escape. Where do you investigate first?",
        choices: [
          { id: 'a', text: "The main mansion", isCorrect: false },
          { id: 'b', text: "The domed structure", isCorrect: true },
          { id: 'c', text: "A guest house", isCorrect: false },
          { id: 'd', text: "Follow the helicopter passengers", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "The dome is a surveillance center. Through a window, you see monitors showing every inch of the island - bedrooms, bathrooms, the beach, even underwater cameras. Everything is being recorded. A guard inside is distracted by his phone.",
        question: "How do you get inside?",
        choices: [
          { id: 'a', text: "Knock on the door", isCorrect: false },
          { id: 'b', text: "Wait for the guard to leave", isCorrect: true },
          { id: 'c', text: "Break the window", isCorrect: false },
          { id: 'd', text: "Set off an alarm elsewhere", isCorrect: false },
        ],
        document: {
          title: "SURVEILLANCE_LOG.pdf",
          preview: "Recording schedule and archive access codes...",
          pdfUrl: "/documents/surveillance-log.pdf"
        }
      },
      {
        id: 3,
        text: "The guard gets a radio call and leaves. Inside, you find years of recordings labeled by date and 'guest name'. Some names you recognize from news, politics, entertainment. A leather book lists arrivals and departures. USB drives in a safe - the door is ajar.",
        question: "What do you take?",
        choices: [
          { id: 'a', text: "Everything you can carry", isCorrect: false },
          { id: 'b', text: "Just the USB drives and leather book", isCorrect: true },
          { id: 'c', text: "Nothing - too risky", isCorrect: false },
          { id: 'd', text: "Try to destroy the recordings", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "You pocket the evidence. On the monitors, you see yourself in the dome - there's a camera you missed. An alarm starts blaring. Red lights flash. 'Security breach in the Temple. All units respond.'",
        question: "How do you escape the dome?",
        choices: [
          { id: 'a', text: "Out the front door", isCorrect: false },
          { id: 'b', text: "Through the ventilation system", isCorrect: false },
          { id: 'c', text: "Cut the power first, then run", isCorrect: true },
          { id: 'd', text: "Hide inside and wait", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "You kill the power. The island goes dark for 10 seconds before backup generators kick in. In those 10 seconds, you're out and running. The darkness is your friend. You hear screaming from the mansion - a girl's voice: 'Please! Help me!'",
        question: "Do you investigate the screaming?",
        choices: [
          { id: 'a', text: "Yes - you can't ignore it", isCorrect: true },
          { id: 'b', text: "No - focus on escape", isCorrect: false },
          { id: 'c', text: "Call out to her", isCorrect: false },
          { id: 'd', text: "Report it to guards as distraction", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "You find a side entrance to the mansion. Inside, chaos - staff running, guests in robes looking confused. You follow the sound of crying to a locked room. Through the keyhole, you see a young girl, maybe 15, chained to a bed. A man in a suit stands over her.",
        question: "How do you help her?",
        choices: [
          { id: 'a', text: "Burst in and attack the man", isCorrect: false },
          { id: 'b', text: "Pull the fire alarm nearby", isCorrect: true },
          { id: 'c', text: "Try to pick the lock quietly", isCorrect: false },
          { id: 'd', text: "Find a weapon first", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "CHAPTER 4",
    subtitle: "The Rescue",
    stages: [
      {
        id: 1,
        text: "The fire alarm screams. Sprinklers activate. The man in the suit curses and runs out a back door. In the confusion, you kick open the door. The girl looks at you with terrified eyes. 'Who are you?' 'Someone who's getting you out of here.'",
        question: "How do you free her from the chains?",
        choices: [
          { id: 'a', text: "Look for keys in the room", isCorrect: true },
          { id: 'b', text: "Try to break the chains", isCorrect: false },
          { id: 'c', text: "Leave her and get help", isCorrect: false },
          { id: 'd', text: "Call for the guards", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "Keys hang on a hook - the man was careless. You free her. She can barely walk, drugged and weak. 'My name is Sofia. I've been here three weeks. There are others.' She points down the hall. 'More rooms. More girls.'",
        question: "What do you do?",
        choices: [
          { id: 'a', text: "Try to free everyone", isCorrect: false },
          { id: 'b', text: "Get Sofia out first, then return", isCorrect: true },
          { id: 'c', text: "Leave them - can't save everyone", isCorrect: false },
          { id: 'd', text: "Tell Sofia to free them while you escape", isCorrect: false },
        ],
        document: {
          title: "VICTIM_LIST.pdf",
          preview: "Names, ages, and acquisition dates of detainees...",
          pdfUrl: "/documents/victim-list.pdf"
        }
      },
      {
        id: 3,
        text: "You support Sofia as you move through the mansion. Staff are evacuating - they think it's a real fire. You blend in with the chaos. A guard spots you: 'Hey! Stop!' He reaches for his radio.",
        question: "How do you handle the guard?",
        choices: [
          { id: 'a', text: "Run with Sofia", isCorrect: false },
          { id: 'b', text: "Push him and grab his radio", isCorrect: true },
          { id: 'c', text: "Beg him for help", isCorrect: false },
          { id: 'd', text: "Let Sofia distract him", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "You grab his radio and push him down. You hear chatter: 'Two females heading east wing. One is the new arrival, other is Asset 7. Do not harm Asset 7 - she's promised to the Senator.' Sofia whispers: 'That's me. Asset 7.'",
        question: "You need to change direction. Where do you go?",
        choices: [
          { id: 'a', text: "West wing toward the kitchen", isCorrect: true },
          { id: 'b', text: "Upstairs to hide", isCorrect: false },
          { id: 'c', text: "Basement", isCorrect: false },
          { id: 'd', text: "Keep going east as decoy", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "The kitchen is empty - staff fled. A door leads outside to a service road. Golf carts are parked nearby. Through the window, you see the marina in the distance - boats mean escape. But there's open ground to cross.",
        question: "How do you cross the open ground?",
        choices: [
          { id: 'a', text: "Sprint across in the open", isCorrect: false },
          { id: 'b', text: "Take a golf cart", isCorrect: false },
          { id: 'c', text: "Wait for searchlights to pass, then move", isCorrect: true },
          { id: 'd', text: "Create a distraction first", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "You time the searchlights. Move. Stop. Move. Stop. Sofia is stronger now, the drugs wearing off. You reach the marina. Three boats: a speedboat, a large yacht with crew aboard, and a small fishing skiff hidden in the reeds.",
        question: "Which boat offers the best escape?",
        choices: [
          { id: 'a', text: "The speedboat - fastest", isCorrect: false },
          { id: 'b', text: "The yacht - biggest", isCorrect: false },
          { id: 'c', text: "The fishing skiff - least noticeable", isCorrect: true },
          { id: 'd', text: "Swim instead", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "CHAPTER 5",
    subtitle: "The Ocean",
    stages: [
      {
        id: 1,
        text: "The skiff is old but functional. A small outboard motor, half tank of fuel. You push off quietly, using oars until you're away from the dock. Only then do you start the motor. The island shrinks behind you. Sofia cries silently.",
        question: "Which direction do you head?",
        choices: [
          { id: 'a', text: "Due west toward the sunset", isCorrect: false },
          { id: 'b', text: "Follow the stars north", isCorrect: true },
          { id: 'c', text: "Circle around the island", isCorrect: false },
          { id: 'd', text: "Let the current take you", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "You navigate by the North Star. After 20 minutes, you hear it - engines. Fast ones. Lights appear behind you. The speedboat is coming, and it's gaining fast. 'They're coming,' Sofia whispers.",
        question: "What's your strategy?",
        choices: [
          { id: 'a', text: "Gun the motor and try to outrun them", isCorrect: false },
          { id: 'b', text: "Kill the engine and drift silently", isCorrect: true },
          { id: 'c', text: "Head toward their lights", isCorrect: false },
          { id: 'd', text: "Jump overboard and swim", isCorrect: false },
        ],
        document: {
          title: "COAST_FREQUENCIES.pdf",
          preview: "Emergency maritime radio channels and protocols...",
          pdfUrl: "/documents/coast-frequencies.pdf"
        }
      },
      {
        id: 3,
        text: "You cut the engine. In the darkness, you're nearly invisible. The speedboat roars past, searchlight sweeping the water 100 yards to your left. You hold your breath. They don't see you. But they're between you and the mainland now.",
        question: "How do you proceed?",
        choices: [
          { id: 'a', text: "Wait until they move on", isCorrect: true },
          { id: 'b', text: "Try to slip past them now", isCorrect: false },
          { id: 'c', text: "Signal them and negotiate", isCorrect: false },
          { id: 'd', text: "Head in a different direction", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "An hour passes. The speedboat circles but gradually moves away, searching elsewhere. Storm clouds build on the horizon, lightning flickering inside them. The weather could be cover - or death. Your fuel is running low.",
        question: "Do you risk the storm?",
        choices: [
          { id: 'a', text: "Yes - it will hide you", isCorrect: true },
          { id: 'b', text: "No - wait for it to pass", isCorrect: false },
          { id: 'c', text: "Try to go around it", isCorrect: false },
          { id: 'd', text: "Head back toward the island", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "The storm hits like a wall. Rain, wind, waves crashing over the bow. You bail water while Sofia steers. Lightning reveals a rocky outcrop ahead - a small island with what looks like an old lighthouse. The mainland is still miles away.",
        question: "Do you shelter at the lighthouse?",
        choices: [
          { id: 'a', text: "Yes - ride out the storm there", isCorrect: true },
          { id: 'b', text: "No - push through to mainland", isCorrect: false },
          { id: 'c', text: "Anchor and wait in the boat", isCorrect: false },
          { id: 'd', text: "Let the storm push you where it will", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "You beach the skiff and drag Sofia to the lighthouse. It's abandoned but dry. From the top, you can see the storm raging, but also - at dawn - the lights of a coastal town maybe 5 miles away. You've made it through the night.",
        question: "As dawn breaks, how do you reach the mainland?",
        choices: [
          { id: 'a', text: "Take the skiff across the calming waters", isCorrect: true },
          { id: 'b', text: "Wait for a passing boat to flag down", isCorrect: false },
          { id: 'c', text: "Swim for it", isCorrect: false },
          { id: 'd', text: "Stay at the lighthouse and wait", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "CHAPTER 6",
    subtitle: "The Mainland",
    stages: [
      {
        id: 1,
        text: "You reach a small fishing village at sunrise. Exhausted, salt-crusted, traumatized. The locals stare. A fisherman approaches: 'You girls okay? You look like you've been through hell.' He has kind eyes, but you can't trust anyone.",
        question: "What do you tell him?",
        choices: [
          { id: 'a', text: "Everything - beg for help", isCorrect: false },
          { id: 'b', text: "Your boat capsized, you need a phone", isCorrect: true },
          { id: 'c', text: "Nothing - run away", isCorrect: false },
          { id: 'd', text: "You're being chased by bad people", isCorrect: false },
        ],
      },
      {
        id: 2,
        text: "The fisherman gives you his phone. Who do you call? The police could be compromised - you saw a photo of the local sheriff on that island. FBI? Journalists? Sofia has family but calling them might put them in danger.",
        question: "Who do you contact first?",
        choices: [
          { id: 'a', text: "Local police", isCorrect: false },
          { id: 'b', text: "FBI tip line", isCorrect: true },
          { id: 'c', text: "A journalist", isCorrect: false },
          { id: 'd', text: "Sofia's family", isCorrect: false },
        ],
        document: {
          title: "FBI_TIPLINE.pdf",
          preview: "Federal Bureau of Investigation reporting procedures...",
          pdfUrl: "/documents/fbi-tipline.pdf"
        }
      },
      {
        id: 3,
        text: "The FBI puts you on hold, transfers you, asks questions. They seem skeptical. 'An island? Trafficking? Ma'am, we get a lot of prank calls.' You realize you need proof. You have the USB drives, the book. But showing them means trusting someone.",
        question: "How do you convince them?",
        choices: [
          { id: 'a', text: "Describe the evidence you have", isCorrect: true },
          { id: 'b', text: "Hang up and try journalists instead", isCorrect: false },
          { id: 'c', text: "Send them a photo of the documents", isCorrect: false },
          { id: 'd', text: "Give up on the FBI", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "The mention of 'a leather book with names' gets their attention. 'Stay where you are. Agents will be there in two hours.' But two hours is a long time. A black SUV has been circling the village. They found you faster than the FBI.",
        question: "What do you do while waiting?",
        choices: [
          { id: 'a', text: "Stay visible in public", isCorrect: true },
          { id: 'b', text: "Hide in the fisherman's house", isCorrect: false },
          { id: 'c', text: "Run to the next town", isCorrect: false },
          { id: 'd', text: "Confront the SUV", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "You sit in the village square, surrounded by morning shoppers. Safety in witnesses. The SUV parks nearby. Two men in suits get out. They don't approach, just watch. Then one makes a phone call, looking directly at you. Your phone buzzes - unknown number.",
        question: "Do you answer the call?",
        choices: [
          { id: 'a', text: "Yes - hear what they want", isCorrect: false },
          { id: 'b', text: "No - ignore it completely", isCorrect: true },
          { id: 'c', text: "Answer and threaten them", isCorrect: false },
          { id: 'd', text: "Give the phone to a local", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "FBI vehicles arrive - you recognize them from TV. The black SUV speeds away. Agents swarm you, asking questions, photographing the evidence. One agent, a woman, takes your hand: 'You're safe now. You're going to help us bring them down.'",
        question: "What's your priority now?",
        choices: [
          { id: 'a', text: "Make sure Sofia is protected", isCorrect: true },
          { id: 'b', text: "Demand immunity in writing", isCorrect: false },
          { id: 'c', text: "Ask about the other girls on the island", isCorrect: false },
          { id: 'd', text: "Request to speak to media", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "CHAPTER 7",
    subtitle: "The Investigation",
    stages: [
      {
        id: 1,
        text: "Three weeks in FBI protection. Safe house in Virginia. Sofia is with her family under protection too. You've given hundreds of hours of testimony. The USB drives contained years of recordings. The leather book had 500+ names.",
        question: "Prosecutors want you to testify publicly. How do you respond?",
        choices: [
          { id: 'a', text: "Agree immediately", isCorrect: false },
          { id: 'b', text: "Ask about witness protection first", isCorrect: true },
          { id: 'c', text: "Refuse - too dangerous", isCorrect: false },
          { id: 'd', text: "Demand money for testimony", isCorrect: false },
        ],
        document: {
          title: "WITNESS_PROTECTION.pdf",
          preview: "U.S. Marshals Service protection program details...",
          pdfUrl: "/documents/witness-protection.pdf"
        }
      },
      {
        id: 2,
        text: "The case goes public. Media frenzy. Your name is leaked despite protection. Death threats pour in. But the evidence is overwhelming - raids on multiple properties, dozens of arrests, victims coming forward worldwide.",
        question: "A journalist wants your exclusive story. Do you agree?",
        choices: [
          { id: 'a', text: "Yes - the world needs to know", isCorrect: true },
          { id: 'b', text: "No - stay silent", isCorrect: false },
          { id: 'c', text: "Only for payment", isCorrect: false },
          { id: 'd', text: "Write your own book instead", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "Your interview airs. Millions watch. The response is overwhelming - support but also attacks. Powerful people are implicated. Some are arrested, some flee the country, some... die under mysterious circumstances. Including the man who ran the island.",
        question: "How do you react to his death?",
        choices: [
          { id: 'a', text: "Celebrate publicly", isCorrect: false },
          { id: 'b', text: "Stay silent - let justice speak", isCorrect: true },
          { id: 'c', text: "Demand investigation into his death", isCorrect: false },
          { id: 'd', text: "Claim it was murder", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "The trial begins. You're the star witness. Defense attorneys try to discredit you - your past, your story, everything. They suggest you're making it up for fame. The courtroom is tense. All eyes on you.",
        question: "How do you handle the cross-examination?",
        choices: [
          { id: 'a', text: "Stay calm and stick to facts", isCorrect: true },
          { id: 'b', text: "Get emotional and angry", isCorrect: false },
          { id: 'c', text: "Break down crying", isCorrect: false },
          { id: 'd', text: "Refuse to answer their questions", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "Your testimony is devastating. The evidence speaks for itself. Video, documents, the leather book. Name after name confirmed. The defense has nothing. The jury deliberates for only 4 hours. Guilty on all counts.",
        question: "After the verdict, what do you do?",
        choices: [
          { id: 'a', text: "Hold a press conference", isCorrect: false },
          { id: 'b', text: "Visit Sofia and other survivors", isCorrect: true },
          { id: 'c', text: "Disappear from public life", isCorrect: false },
          { id: 'd', text: "Start a foundation immediately", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "You reunite with Sofia. She's healing, slowly. So are you. Other survivors reach out - there were over 100 victims across two decades. They thank you. They say you gave them courage. The fight isn't over, but you've won a battle.",
        question: "What's your next step?",
        choices: [
          { id: 'a', text: "Advocate for other survivors", isCorrect: true },
          { id: 'b', text: "Return to normal life", isCorrect: false },
          { id: 'c', text: "Write a book deal", isCorrect: false },
          { id: 'd', text: "Leave the country", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 8,
    title: "FINAL CHAPTER",
    subtitle: "The Truth",
    stages: [
      {
        id: 1,
        text: "One year later. You've started a foundation for trafficking survivors. The trials continue - more names from the book, more arrests. But powerful people are still free. The system protects them. Money buys silence.",
        question: "You receive a flash drive from an anonymous source. What do you do?",
        choices: [
          { id: 'a', text: "Turn it over to FBI immediately", isCorrect: false },
          { id: 'b', text: "View its contents first", isCorrect: true },
          { id: 'c', text: "Destroy it - too dangerous", isCorrect: false },
          { id: 'd', text: "Give it to journalists", isCorrect: false },
        ],
        document: {
          title: "ANONYMOUS_FILES.pdf",
          preview: "Additional evidence from inside source...",
          pdfUrl: "/documents/anonymous-files.pdf"
        }
      },
      {
        id: 2,
        text: "The drive contains everything - flight logs, financial records, photos that were never in the original evidence. Names that were protected. Connections to governments, intelligence agencies. This goes deeper than anyone knew.",
        question: "This evidence could bring down governments. What do you do?",
        choices: [
          { id: 'a', text: "Release it all at once publicly", isCorrect: false },
          { id: 'b', text: "Verify it carefully first", isCorrect: true },
          { id: 'c', text: "Sell it to highest bidder", isCorrect: false },
          { id: 'd', text: "Bury it - too dangerous", isCorrect: false },
        ],
      },
      {
        id: 3,
        text: "You work with trusted journalists to verify every document. It takes months. The evidence is real. The implications are terrifying. Some of these people are still in power. They know the evidence exists. They know you have it.",
        question: "They offer you $10 million to destroy it. Your response?",
        choices: [
          { id: 'a', text: "Accept - you've done enough", isCorrect: false },
          { id: 'b', text: "Refuse and release immediately", isCorrect: false },
          { id: 'c', text: "Refuse and continue building the case", isCorrect: true },
          { id: 'd', text: "Negotiate for more money", isCorrect: false },
        ],
      },
      {
        id: 4,
        text: "Threats escalate. A car follows you. Your foundation office is broken into. Sofia receives a threatening letter. The FBI says they can't prove who's behind it. You're running out of safe options.",
        question: "How do you protect the evidence?",
        choices: [
          { id: 'a', text: "Keep it all in one secure location", isCorrect: false },
          { id: 'b', text: "Distribute copies to multiple trusted people", isCorrect: true },
          { id: 'c', text: "Upload it to the dark web", isCorrect: false },
          { id: 'd', text: "Give it all to one journalist", isCorrect: false },
        ],
      },
      {
        id: 5,
        text: "The evidence is distributed. Copies exist in 10 different countries with trusted people. If anything happens to you, it all goes public automatically. You've created a dead man's switch. They can't silence you now.",
        question: "You're invited to testify before Congress. Do you accept?",
        choices: [
          { id: 'a', text: "Yes - under oath, on camera", isCorrect: true },
          { id: 'b', text: "No - too exposed", isCorrect: false },
          { id: 'c', text: "Only if closed session", isCorrect: false },
          { id: 'd', text: "Send written testimony instead", isCorrect: false },
        ],
      },
      {
        id: 6,
        text: "You testify before the world. Every name. Every crime. Every cover-up. The evidence streams online simultaneously. Arrests follow in real-time. It's the largest exposure of organized trafficking in history. And it started with you refusing to be a victim.",
        question: "As you leave Congress, a reporter asks: 'What now?' Your answer?",
        choices: [
          { id: 'a', text: "The fight continues until every survivor has justice", isCorrect: true },
          { id: 'b', text: "I'm retiring from public life", isCorrect: false },
          { id: 'c', text: "I'm running for office", isCorrect: false },
          { id: 'd', text: "No comment", isCorrect: false },
        ],
      },
    ],
  },
];