import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Clock } from 'lucide-react';
import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';

const SCENARIOS = [
  {
    id: 1,
    position: 'Host',
    title: 'THE RUSH - Multiple Parties Arriving',
    context: "It's Friday at 6:45 PM. You have 3 parties that just walked in within 30 seconds of each other: a couple, a family of 5, and a group of 4 friends. You're alone at the host stand.",
    managerRole: 'All three parties (rotate attention between them)',
    observe: [
      'Does host acknowledge ALL parties quickly?',
      'Exact greeting: "Hi! Welcome to Chili\'s!"',
      'Does host open the door for arriving guests?',
      'How does host manage multiple greetings?',
      'Energy level under pressure'
    ],
    coaching: [
      '"When you\'re slammed, eye contact + \'I\'ll be right with you!\' lets everyone know you see them"',
      '"Greet in order of arrival, but acknowledge everyone in the first 30 seconds"',
      'Practice the rapid greeting: Party 1 (full greeting) → Party 2 & 3 (acknowledge) → Return to Party 1 (seat)'
    ],
    excellent: '"Hi! Welcome to Chili\'s!" [to couple] "Welcome in! I\'ll be right with you!" [to family] "Be right there!" [to group of 4] → Seats couple → Returns to family with full energy'
  },
  {
    id: 2,
    position: 'Host',
    title: 'THE DISTRACTION - Phone Rings While Greeting',
    context: "You're greeting a party of 2 when the phone starts ringing. There are 2 other parties waiting to be seated, and a to-go order is at the stand ready for pickup.",
    managerRole: 'The party being greeted + phone caller (ring loudly)',
    observe: [
      'Does host finish greeting before addressing phone?',
      'How does host prioritize?',
      'Does host maintain composure?'
    ],
    coaching: [
      '"Guests in front of you come first. Phone can wait 30 seconds."',
      '"If you MUST answer, say \'Please hold one moment\' immediately, finish your greeting, then take the call"',
      '"Or better: Let another team member grab the phone"'
    ],
    excellent: 'Continues greeting without breaking eye contact with guests → Seats them → THEN addresses phone or to-go'
  },
  {
    id: 3,
    position: 'Host',
    title: 'THE DEPARTURE - Busy and Guests Leaving',
    context: "You're entering a party into the system when you notice a family of 4 is approaching the door to leave. The dining room is busy.",
    managerRole: 'The departing family',
    observe: [
      'Does host notice them leaving?',
      'Does host open the door?',
      'What does host say?'
    ],
    coaching: [
      '"Last impression = first impression. Stop what you\'re doing."',
      '"Walk to door, open it, say \'Thanks for coming in! See you next time!\'"',
      '"If you can\'t get there, at least make eye contact and wave"'
    ],
    excellent: 'Looks up from system → "Thanks so much for coming!" → Walks to door → Opens door → "See you soon!"'
  },
  {
    id: 4,
    position: 'Server',
    title: 'THE LATE GREETING - Juggling Multiple Tables',
    context: "You just sat a new table (Table 25). You're currently at Table 22 taking an order, Table 23 needs drinks delivered, and Table 24's food just came up. It's been 45 seconds since Table 25 was seated.",
    managerRole: 'Table 25 (looking around expectantly)',
    observe: [
      'Does server acknowledge Table 25 before 60 seconds?',
      'How does server communicate delay if needed?',
      'What\'s the verbal/non-verbal acknowledgment?'
    ],
    coaching: [
      '"Eye contact + hand signal buys you 30 seconds"',
      '"Or: Mouth \'I\'ll be right there!\' while finishing Table 22"',
      '"If another server is nearby, ask for a courtesy greeting"'
    ],
    excellent: '[While taking Table 22 order] Makes eye contact with Table 25 → Smiles → Holds up "one minute" finger → Finishes 22 → Goes straight to 25: "Hi! So sorry for the wait - welcome in!"'
  },
  {
    id: 5,
    position: 'Server',
    title: 'THE RECOMMENDATION - No Clue What They Want',
    context: "You approach a table of 2. They've been looking at menus but seem overwhelmed. You deliver your 60-second greeting.",
    managerRole: 'Indecisive couple: "Umm...we\'re not sure yet. What\'s good?"',
    observe: [
      'Does server give specific recommendation?',
      'Marg AND app suggested?',
      'Confidence in delivery?'
    ],
    coaching: [
      '"Never say \'everything\'s good\' - that\'s not helpful"',
      '"Pick YOUR favorites: \'I love the [Marg] and [App] - they\'re amazing!\'"',
      '"Sound excited about it. If you don\'t sell it, they won\'t buy it"'
    ],
    excellent: '"Okay so here\'s what I\'d do: Start with the Watermelon Marg - it\'s sweet and refreshing - and the Texas Cheese Fries with ranch. Honestly my favorite combo. Can I grab those for you while you decide on entrees?"'
  },
  {
    id: 6,
    position: 'Server',
    title: 'THE REFILL FAIL - Empty Drinks Unnoticed',
    context: "You're walking back from the kitchen to your section. You pass Table 28, which has two empty Coke glasses sitting there. The guests are mid-conversation.",
    managerRole: 'Guests at Table 28 (don\'t say anything, just sit with empty glasses)',
    observe: [
      'Does server notice empties?',
      'Does server proactively refill without being asked?',
      'What does server say?'
    ],
    coaching: [
      '"Silent refills = you\'re attentive and they don\'t have to ask"',
      '"Every time you walk past your section, scan for empties"',
      '"Grab them, refill, return - takes 45 seconds and makes them feel like regulars"'
    ],
    excellent: '[Notices empties] "Let me grab you fresh Cokes!" [Takes glasses] [Returns 45 seconds later] "Here you go!" [Doesn\'t wait for acknowledgment, continues moving]'
  },
  {
    id: 7,
    position: 'Server',
    title: 'THE PRE-BUS - Finished Appetizer Plate',
    context: "You're checking on Table 30's entrees. You notice their appetizer plate is empty and pushed to the side of the table.",
    managerRole: 'Guests: "Everything\'s great, thank you!"',
    observe: [
      'Does server clear the finished app plate?',
      'How smoothly is it done?',
      'Does server ask permission?'
    ],
    coaching: [
      '"Pre-bussing = clean table = elevated experience"',
      '"You don\'t need to ask every time - if it\'s clearly done, grab it"',
      '"Make it part of every table touch: Refill, clear, quality check"'
    ],
    excellent: '"Awesome! Glad you\'re enjoying." [Picks up empty app plate while talking] "I\'ll get this out of your way. Need anything else?" [Already holding plate, keeps conversation flowing]'
  },
  {
    id: 8,
    position: 'Runner',
    title: 'THE MAGIC QUESTION - Delivering Food',
    context: "You're running two entrees to Table 35. The guests look happy. You set down the plates.",
    managerRole: 'Guests: [Nod and smile]',
    observe: [
      'What does runner say when delivering?',
      'Does runner ask the magic question: "What more can I get you?"',
      'Does runner wait for a response?'
    ],
    coaching: [
      '"Never silent drop - every table touch is an opportunity"',
      '"The magic question prevents them from waiting for their server"',
      '"Common answers: ranch, refills, napkins - you can grab all that"'
    ],
    excellent: '[Sets down plates] "Here are your burgers! What more can I get you?" [Waits 2 seconds] Guest: "Could we get some ranch?" Runner: "Absolutely! Be right back!"'
  },
  {
    id: 9,
    position: 'Runner',
    title: 'THE DRINK PRIORITY - Balancing Tasks',
    context: 'You see 3 drinks sitting in the well (ready for 2 minutes). Table 40 also has a bunch of empty plates that need clearing. Both need attention.',
    managerRole: 'The situation (set up drinks and dirty table)',
    observe: [
      'What does runner prioritize?',
      'Speed of decision?',
      'Communication with team?'
    ],
    coaching: [
      '"Drinks before dishes, always"',
      '"Guests notice drink wait time more than anything"',
      '"Run drinks first, then circle back to pre-bus"'
    ],
    excellent: '[Sees both tasks] "Drinks first." [Grabs drinks, delivers to table in 30 seconds] [Returns, grabs bus tub, clears Table 40]'
  },
  {
    id: 10,
    position: 'Bartender',
    title: 'THE BAR GREETING - Swamped with Server Drinks',
    context: "You have 5 server drink tickets printing. A guest just sat at the bar. You're currently making a frozen marg.",
    managerRole: 'Bar guest (looks at menu, glances at you a few times)',
    observe: [
      'Does bartender acknowledge guest within 60 seconds?',
      'What\'s the greeting?',
      'Does bartender make guest feel prioritized?'
    ],
    coaching: [
      '"Eye contact + \'I\'ll be right with you!\' = guest knows you see them"',
      '"Even mid-pour, you can turn your head and greet"',
      '"Server drinks are important, but bar guests come first after 60 seconds"'
    ],
    excellent: '[While pouring marg] Makes eye contact with bar guest → "Hey! Welcome in - I\'ll be right with you!" → Finishes marg (15 more seconds) → Goes to guest: "Thanks for waiting! What can I get you started with?"'
  },
  {
    id: 11,
    position: 'Bartender',
    title: 'THE UPSELL - Basic Margarita Order',
    context: 'A couple sits at the bar. You greet them within 45 seconds. They say: "Can we get two margaritas?"',
    managerRole: 'Couple: "Two margaritas please."',
    observe: [
      'Does bartender recommend a specific marg?',
      'Does bartender suggest an app?',
      'Confidence and enthusiasm?'
    ],
    coaching: [
      '"Generic = missed opportunity. Specific = more sales + better experience"',
      '"Recommend your favorite + explain WHY: \'The Watermelon is sweet and refreshing\'"',
      '"Add the app: \'And have you tried our Loaded Boneless Wings? Perfect with margs!\'"'
    ],
    excellent: '"Awesome! Have you tried the Presidente Margarita? It\'s our premium one - Sauza Conmemorativo, Cointreau, fresh lime - so smooth. And honestly, the Boneless Wings pair perfectly with margs. Can I grab you both?"'
  },
  {
    id: 12,
    position: 'Busser',
    title: 'THE DIRTY TABLE - Guests Just Left',
    context: "You see a 4-top where guests just stood up and walked to the host stand to pay. The table has plates, glasses, and trash. You're currently wiping down another table.",
    managerRole: 'The situation (dirty table sitting)',
    observe: [
      'How quickly does busser notice?',
      'Does busser finish current task or pivot?',
      'Does busser communicate with host about table status?'
    ],
    coaching: [
      '"Dirty tables cost us money - every minute = lost chance to seat"',
      '"Finish what you\'re doing (10 seconds) then hit the dirty table"',
      '"Always radio the host: \'Table 42 clear and clean, ready to seat\'"'
    ],
    excellent: '[Finishes wiping current table] [Walks to dirty 4-top with bus tub] [Clears table in 60 seconds] [Wipes AND spot sweeps] [Radios:] "Table 42 ready to seat!"'
  },
  {
    id: 13,
    position: 'Busser',
    title: 'THE COMMUNICATION - Host Needs Table Status',
    context: "You're in the kitchen putting dirty dishes in the pit. Your headset crackles: \"Hey busser, is Table 38 clean yet? I have a party ready.\"",
    managerRole: 'Host on headset (urgency in voice)',
    observe: [
      'How quickly does busser respond?',
      'What does busser say?',
      'Does busser follow through?'
    ],
    coaching: [
      '"Quick response = host can make decisions"',
      '"If you don\'t know, go check immediately and report back in 30 seconds"',
      '"If it\'s not clean, give an ETA: \'I\'ll have it ready in 2 minutes\'"'
    ],
    excellent: '[Immediately responds] "Table 38 is clear but I haven\'t wiped it yet. Give me 90 seconds and it\'s ready!" [Drops dishes, goes to Table 38, cleans in 90 seconds, radios:] "Table 38 ready!"'
  },
  {
    id: 14,
    position: 'To-Go',
    title: 'THE MISSING ITEM - Guest Checking Order',
    context: 'A guest arrives to pick up their order. You hand them the bag. They open it at the counter and start looking through it: "Wait, I don\'t see my side of ranch..."',
    managerRole: 'Guest: "I ordered extra ranch but I don\'t see it."',
    observe: [
      'How does to-go specialist respond?',
      'Speed of resolution?',
      'Tone and apology?'
    ],
    coaching: [
      '"Own it immediately: \'I\'m so sorry, let me grab that for you right now\'"',
      '"Check the bag chit: Was it on there? If yes = bagging issue. If no = order entry issue"',
      '"Fix it in 30 seconds and thank them for catching it"'
    ],
    excellent: '"Oh I\'m so sorry! Let me grab that ranch for you right now." [Checks bag chit] "Looks like it got missed - my bad. Here you go, and thanks for catching that!" [Hands ranch with smile]'
  },
  {
    id: 15,
    position: 'To-Go',
    title: 'THE PERFECT PICKUP - Simple Order',
    context: 'A guest walks in. You have their to-go order ready at the stand. It\'s complete and correct.',
    managerRole: 'Guest: [Walks up to counter]',
    observe: [
      'Does specialist greet first: "Hi! Welcome to Chili\'s!"?',
      'Does specialist confirm name?',
      'Does specialist work the bag chit?',
      'What\'s the energy level?'
    ],
    coaching: [
      '"Lead with the welcome, THEN confirm the order"',
      '"Work the bag chit: \'I have your two burgers, fries, and drinks - all set!\'"',
      '"Make them feel like a guest, not a transaction"'
    ],
    excellent: '"Hi! Welcome to Chili\'s! Order for Smith?" [Guest nods] "Perfect! I have your two Oldtimers with fries, both with everything, and two Cokes. Sauces and utensils are in the bag. You\'re all set!" [Hands bag with smile] "Thanks for calling Chili\'s!"'
  },
  {
    id: 16,
    position: 'QA/HOH',
    title: 'THE SPEC CHECK - Wrong Temperature',
    context: 'An order comes up in the window: Burger ordered medium-well. You\'re about to call for the server but something looks off. You cut into it to check - it\'s rare.',
    managerRole: 'The cook who made it (standing at grill)',
    observe: [
      'Does QA catch it before sending?',
      'How does QA communicate with HOH?',
      'What\'s the tone?'
    ],
    coaching: [
      '"Every plate = eye test. If you\'re not sure, verify"',
      '"Communicate calmly: \'Hey this burger needs to go back - ticket says MW but it\'s rare\'"',
      '"Thank them for the quick refire"'
    ],
    excellent: '[Cuts burger] "Hey [Cook name], this one needs to go back - ticket says medium-well but it\'s rare. Can you refire?" Cook: "Yep, two minutes!" QA: "Thanks!"'
  },
  {
    id: 17,
    position: 'QA/HOH',
    title: 'THE PROACTIVE UPDATE - Order Running Behind',
    context: "You notice a large to-go order is taking longer than expected. It's been 8 minutes and it usually takes 6. The guest is expected to arrive in 2 minutes.",
    managerRole: 'To-Go specialist (not aware of delay yet)',
    observe: [
      'Does QA communicate proactively?',
      'Does QA give an ETA?',
      'Does QA alert the right people?'
    ],
    coaching: [
      '"Proactive communication prevents problems"',
      '"Give specific updates: \'Table 50 to-go will be 4 more minutes - guest is expected now\'"',
      '"Alert to-go specialist AND manager so they can communicate to guest"'
    ],
    excellent: '[Radios to-go] "Hey, the Smith to-go order is running about 3 minutes behind - should be ready at 6:18. Want me to call them if they arrive early?" To-go: "Yes please, thanks for the heads up!"'
  },
  {
    id: 18,
    position: 'Multi-Position',
    title: 'THE TEAM EFFORT - Busy Friday Night',
    context: "It's 7:30 PM on Friday. The restaurant is at capacity. A server's drink order has been sitting in the well for 90 seconds because the server is stuck at a table with a complicated order. A runner notices.",
    managerRole: 'The busy server + Team members stepping in',
    observe: [
      'Does anyone step in to help?',
      'How is teamwork communicated?',
      'What\'s the end result?'
    ],
    coaching: [
      '"We all own the guest experience - not just our position"',
      '"If you see drinks sitting, run them. If you see a table needs bussing, bus it"',
      '"Teamwork = everyone wins"'
    ],
    excellent: 'Runner: [Sees drinks] "Those are for Table 25, right?" [Grabs them, delivers] "Here are your drinks! [Server name] will be right over!" Server: [Returns from table] "Thanks for running those!" Runner: "No problem!"'
  }
];

const TrainingScenarios = ({ manager }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [selectedScenario, setSelectedScenario] = useState(null);

  const positions = ['All', 'Host', 'Server', 'Runner', 'Bartender', 'Busser', 'To-Go', 'QA/HOH', 'Multi-Position'];

  const filteredScenarios = filter === 'All'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.position === filter);

  return (
    <div style={{ ...styles.pageContainer }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/coaching')}
            style={{ ...styles.buttonOutline, display: 'flex', alignItems: 'center', gap: spacing.sm }}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Training Scenarios
          </h1>

          <div style={{ width: '120px' }}></div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.chiliRed }}>
            How to Use These Scenarios
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} style={{ color: colors.chiliRed }} />
                <strong>Setup (2 min)</strong>
              </div>
              <ul className="text-sm space-y-1" style={{ color: colors.chiliGray }}>
                <li>• Choose relevant scenario</li>
                <li>• Assign roles</li>
                <li>• Explain context</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={16} style={{ color: colors.chiliRed }} />
                <strong>Execute (3 min)</strong>
              </div>
              <ul className="text-sm space-y-1" style={{ color: colors.chiliGray }}>
                <li>• Run the scenario</li>
                <li>• Let TM respond naturally</li>
                <li>• Don't interrupt</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} style={{ color: colors.chiliRed }} />
                <strong>Debrief (5 min)</strong>
              </div>
              <ul className="text-sm space-y-1" style={{ color: colors.chiliGray }}>
                <li>• Ask how it felt</li>
                <li>• Give specific feedback</li>
                <li>• Identify 1 improvement</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={16} style={{ color: colors.chiliRed }} />
                <strong>Repeat (3 min)</strong>
              </div>
              <ul className="text-sm space-y-1" style={{ color: colors.chiliGray }}>
                <li>• Try with improvement</li>
                <li>• Switch roles</li>
                <li>• Have top performers demo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className="whitespace-nowrap"
              style={filter === pos ? { ...styles.pillActive } : { ...styles.pillInactive }}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Scenario Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredScenarios.map(scenario => (
            <div
              key={scenario.id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedScenario(scenario)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: colors.chiliRed }}>
                    {scenario.position}
                  </div>
                  <h3 className="font-bold" style={{ color: colors.textPrimary }}>
                    Scenario {scenario.id}: {scenario.title}
                  </h3>
                </div>
                <Play size={20} style={{ color: colors.chiliRed }} />
              </div>
              <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                {scenario.context}
              </p>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Click to view full details →
              </div>
            </div>
          ))}
        </div>

        {/* Scenario Modal */}
        {selectedScenario && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedScenario(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-6 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold mb-1" style={{ color: colors.chiliRed }}>
                      {selectedScenario.position} • Scenario {selectedScenario.id}
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                      {selectedScenario.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedScenario(null)}
                    className="text-2xl font-bold hover:opacity-70"
                    style={{ color: colors.textMuted }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Context */}
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Context
                  </h3>
                  <p style={{ color: colors.textSecondary }}>{selectedScenario.context}</p>
                </div>

                {/* Manager Role */}
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Manager Plays
                  </h3>
                  <p style={{ color: colors.chiliGray }}>{selectedScenario.managerRole}</p>
                </div>

                {/* What to Observe */}
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    What to Observe
                  </h3>
                  <ul className="space-y-1">
                    {selectedScenario.observe.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span style={{ color: colors.chiliRed }}>•</span>
                        <span style={{ color: colors.textSecondary }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coaching Focus */}
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Coaching Focus
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.coaching.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span style={{ color: colors.chiliRed }}>•</span>
                        <span style={{ color: colors.textSecondary }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excellent Looks Like */}
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2" style={{ color: colors.chiliGreen }}>
                    ✓ Excellent Looks Like
                  </h3>
                  <p className="italic" style={{ color: colors.textSecondary }}>
                    {selectedScenario.excellent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingScenarios;
