import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, Award, CheckCircle } from 'lucide-react';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliGray: 'rgb(161, 159, 154)'
};

const GUIDE_DATA = {
  overview: {
    purpose: 'To make everyone feel special through a fun atmosphere, delicious food and drinks with ChiliHead Hospitality.',
    when: [
      { title: 'Pre-Shift', desc: 'Set expectations for the shift' },
      { title: 'During Shift', desc: 'Real-time feedback (positive reinforcement & corrections)' },
      { title: 'Post-Shift', desc: 'Review observations and development areas' },
      { title: 'Weekly 1:1s', desc: 'Deep dive on patterns and growth' }
    ],
    how: [
      'OBSERVE: Watch the behavior in action',
      'RECOGNIZE or REDIRECT: Immediate feedback',
      'EXPLAIN WHY: Connect to guest experience',
      'PRACTICE: Role-play if needed',
      'FOLLOW-UP: Check progress next shift'
    ]
  },
  positions: {
    Host: {
      motto: 'WELCOME ALL GUESTS TO THE PARTY',
      behaviors: [
        { title: 'GREETING', items: ['Smiles and makes eye contact within 30 seconds', 'Uses exact phrase: "Hi! Welcome to Chili\'s!"', 'Enthusiastic tone (not robotic)'] },
        { title: 'DOOR SERVICE', items: ['Opens door for ALL arriving guests', 'Opens door for ALL departing guests', 'Assists with coats, strollers, packages'] }
      ],
      scenarios: [
        { title: 'Host on Phone When Guests Enter', see: 'Host finishing text, guests waiting 45 seconds', coach: 'Our 30-second greeting creates first impression. Step to back for phone so guests get full attention.', practice: 'Let\'s practice: I\'m a guest walking in, show me your best welcome!' },
        { title: 'Weak Greeting Energy', see: 'Monotone "welcome to chili\'s" without smile', coach: 'Guests decide in 7 seconds if they want to be here. Your energy sets tone for their whole experience.', practice: 'Greet me 3 times with increasing energy' },
        { title: 'Forgot Door for Departing Guests', see: 'Guests pushing door open themselves', coach: 'Last impression = first impression. Walk to door, open it, say "Thanks for coming in! See you next time!"', practice: null }
      ],
      recognition: ['just greeted 3 tables in a row with perfect energy!', 'proactively opened the door for that mom with the stroller']
    },
    Server: {
      motto: 'MAKE EVERY GUEST FEEL LIKE THEY\'RE A REGULAR',
      behaviors: [
        { title: '60-SECOND GREETING', items: ['Arrives at table within 60 seconds', 'Recommends a marg and app', 'Takes drink order'] },
        { title: 'ATTENTIVENESS', items: ['Regular check-ins (not just 2-minute, 2-bite)', 'Silent refills without being asked', 'Pre-bussing finished plates promptly'] }
      ],
      scenarios: [
        { title: 'Late Table Greeting (Over 2 Minutes)', see: 'Server hasn\'t greeted new table for 2:30', coach: 'Eye contact + mouth "I\'ll be right there!" acknowledges them. If this happens again, flag another server for courtesy greeting.', practice: null },
        { title: 'No Recommendation Given', see: 'Server asks "What can I get you?" without suggesting', coach: 'Guests want to be told what\'s great. "The Watermelon Marg and Texas Cheese Fries are amazing" makes them feel like regulars.', practice: 'Greet me right now with your favorite marg and app combo' },
        { title: 'Drinks Empty at Table', see: 'Walking past table with two empty Cokes', coach: 'Every time you pass your section, scan for empties. Silent refills make guests feel taken care of without saying a word.', practice: null }
      ],
      recognition: ['turned a 4-top into regulars with recommendations and energy!', 'guest just asked for them by name for next visit']
    },
    Runner: {
      motto: 'ELEVATE THE GUEST EXPERIENCE',
      behaviors: [
        { title: 'PROACTIVE ENGAGEMENT', items: ['Asks "What more can I get you?" at every delivery', 'Runs drinks/apps quickly and consistently', 'Pre-busses empty plates and glasses'] }
      ],
      scenarios: [
        { title: 'Silent Food Drop', see: 'Runner delivers food, says nothing, walks away', coach: 'The magic question is "What more can I get you?" - it prevents guests from waiting for their server.', practice: 'Let\'s try again - I\'m the table, deliver this to me' },
        { title: 'Slow Drink Running', see: 'Drinks sitting in well 3+ minutes while runner clears table', coach: 'Drinks before dishes, always. Guests notice wait time on drinks more than anything.', practice: null },
        { title: 'Excellent Pre-Bussing', see: 'Runner clearing multiple tables without being asked', coach: '🔥 Yes! You\'re pre-bussing like a pro. That takes pressure off servers and keeps restaurant clean!', practice: null }
      ],
      recognition: ['Runner hustle award - cleared 6 tables this hour and kept drinks moving!', 'caught a missing side ranch before guest had to ask']
    },
    Bartender: {
      motto: 'MAKE EVERY GUEST FEEL LIKE THEY\'RE A REGULAR',
      behaviors: [
        { title: '60-SECOND GREETING', items: ['Greets bar guests within 60 seconds', 'Recommends a marg and app', 'Takes drink order'] },
        { title: 'DRINK QUALITY & SPEED', items: ['Makes and delivers drinks in under 3 minutes', 'Perfect frozen margarita consistency and presentation'] }
      ],
      scenarios: [
        { title: 'Bar Guest Waiting for Greeting', see: 'Guest sits, bartender making server drinks, 90 seconds pass', coach: 'Eye contact and "I\'ll be right with you!" in first 60 seconds keeps them happy. They know you see them.', practice: null },
        { title: 'Slow Drink Times (Over 5 Minutes)', see: 'Server waiting 4:30 for 2 margaritas', coach: 'Three-minute standard keeps servers moving and guests happy. Let\'s talk workflow - are you batching? Mise en place set?', practice: 'Work side-by-side for 15 minutes' },
        { title: 'Perfect Marg Presentation', see: 'Perfectly layered, correctly garnished frozen marg with smile', coach: '🔥 THAT is a perfect marg. Show new bartender exactly what you just made!', practice: null }
      ],
      recognition: ['Bar speed leader with 2:15 average ticket time!', 'recommended the Mango Marg and Queso to first-timer and made them feel like a regular']
    },
    Busser: {
      motto: 'TAKE PRIDE IN A CLEAN RESTAURANT',
      behaviors: [
        { title: 'BUS TUB MANAGEMENT', items: ['Runs tables within 2 minutes of guests leaving', 'Wipes down tables AND spot sweeps floors', 'Keeps tub in back, not visible to guests'] },
        { title: 'COMMUNICATION', items: ['Uses headset to communicate table status', 'Alerts servers to refills/needs while bussing'] }
      ],
      scenarios: [
        { title: 'Dirty Table Sitting 5+ Minutes', see: 'Guests left, dirty table untouched, busser folding napkins', coach: 'Dirty tables cost money. Every minute = lost chance to seat new guests. Bussing comes before side work.', practice: 'Let\'s create a scan pattern - what order do you check sections?' },
        { title: 'Floor Not Swept After Bussing', see: 'Table clean but fries and crumbs on floor', coach: 'Spot sweep isn\'t optional. Guests notice clean floors more than you think.', practice: 'Show me your full bus routine: clear, wipe, sweep' },
        { title: 'Proactive Headset Communication', see: 'Busser radios "Table 15 clear and clean" without being asked', coach: '🔥 That headset call was perfect! You helped us seat faster because host knew right away!', practice: null }
      ],
      recognition: ['Cleanest sections - not a single dirty table over 2 minutes!', 'spot-sweeping every table - that\'s pride in action']
    },
    'To-Go': {
      motto: 'MAKE EVERY GUEST FEEL LIKE THEY\'RE A REGULAR',
      behaviors: [
        { title: 'GREETING & ACCURACY', items: ['Greets with smile: "Hi! Welcome to Chili\'s!"', 'Works bag chit systematically', 'Prevents missing items'] }
      ],
      scenarios: [
        { title: 'Missing Items Over 9%', see: 'Weekly report shows 12% missing items', coach: 'The bag chit is your checklist. Check each item off as you bag it. If not ready, ask HOH for ETA before guest arrives.', practice: 'Let\'s bag this order together. Show me your system.' },
        { title: 'Weak Guest Greeting', see: 'Specialist says "Order for Smith?" without welcome first', coach: 'Lead with welcome, THEN confirm name. "Hi! Welcome to Chili\'s! Order for Smith?" makes them feel like guests, not transactions.', practice: null },
        { title: 'Perfect Order Handoff', see: 'Specialist greets warmly, confirms accuracy, thanks by name', coach: '🔥 That handoff was perfect! You made that guest feel special. That\'s how we build regulars!', practice: null }
      ],
      recognition: ['To-Go accuracy winner with 4% missing items this week!', 'caught a missing side before guest left']
    },
    'QA/HOH': {
      motto: 'ENSURE SAFETY AND QUALITY / CREATE CONSISTENTLY DELICIOUS FOOD',
      behaviors: [
        { title: 'MADE TO SPEC', items: ['All orders to exact specifications', 'Every plate 100% complete', 'No missing items, wrong temps, incorrect portions'] },
        { title: 'COMMUNICATION & SAFETY', items: ['Proactive order status updates', 'Food safety measures followed', 'Chili\'s Clean standards maintained'] }
      ],
      scenarios: [
        { title: 'Incorrect Cook Temp', see: 'Burger sent medium when ordered medium-well', coach: 'Ticket says medium-well. Our temps matter - that\'s how guests measure quality. Use thermometer when in doubt.', practice: 'Show me your temp check process' },
        { title: 'Order Sitting in Window', see: 'Complete order in window 2+ minutes', coach: 'Hot food going out fast is #1 job. If server\'s not there, call their name on headset. Quality drops every second it sits.', practice: null },
        { title: 'Perfect Plate Presentation', see: 'Cook sends perfectly plated, garnished, portioned dish', coach: '🔥 THAT is Chili\'s quality! Perfect plate. Take a picture for the spec board!', practice: null }
      ],
      recognition: ['Zero returned orders during shift - made to spec every time!', 'caught an incorrect side before it left expo']
    },
    Manager: {
      motto: 'HOST AND COACH THE PARTY',
      behaviors: [
        { title: 'PROACTIVE ENGAGEMENT', items: ['Engages with all guests and team on floor', 'Not behind desk during peak'] },
        { title: 'COACHING IN THE MOMENT', items: ['Praises and coaches behaviors in real-time', '5/10 Rule: 5 ft = smile, eye contact, greeting | 10 ft = smile, eye contact'] },
        { title: 'DAILY SELF-CHECK', items: ['80% of peak time on floor', '5+ specific positive recognitions', '2+ behaviors coached real-time', 'Connected with 10+ guests by name'] }
      ],
      scenarios: [
        { title: 'Manager in Office During Peak', see: 'Dining room slammed, manager at desk doing paperwork', coach: 'Peak times = floor time. Paperwork can wait. Guests and team need to see you coaching, helping, connecting.', practice: 'Put on headset and let\'s take a lap together' },
        { title: 'Walks Past Issue Without Addressing', see: 'Manager sees dirty table 5+ minutes, keeps walking', coach: 'You caught it but didn\'t act. We either fix it or coach someone to fix it in the moment. That\'s leadership.', practice: 'Go back and either bus it or find busser and coach them' },
        { title: 'Strong Floor Presence', see: 'Manager greeting guests, praising server, helping runner', coach: '🔥 THAT is hosting the party! You\'re everywhere the team needs you!', practice: null }
      ],
      recognition: ['coached 3 team members, ran food, greeted 8 tables in 20 minutes', 'stopped everything to help a struggling server']
    }
  }
};

const CoachingGuide = ({ manager }) => {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState('overview');

  const positions = ['overview', 'Host', 'Server', 'Runner', 'Bartender', 'Busser', 'To-Go', 'QA/HOH', 'Manager'];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.chiliRed }}>
          Purpose
        </h2>
        <p className="text-lg" style={{ color: colors.chiliGray }}>
          {GUIDE_DATA.overview.purpose}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
          When to Coach
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {GUIDE_DATA.overview.when.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border-l-4" style={{ borderColor: colors.chiliRed }}>
              <h4 className="font-bold mb-1" style={{ color: colors.chiliNavy }}>{item.title}</h4>
              <p className="text-sm" style={{ color: colors.chiliGray }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
          How to Coach
        </h3>
        <div className="bg-white p-6 rounded-lg">
          <ol className="space-y-3">
            {GUIDE_DATA.overview.how.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: colors.chiliRed }}
                >
                  {index + 1}
                </div>
                <span className="pt-1" style={{ color: colors.chiliGray }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  const renderPosition = (positionKey) => {
    const data = GUIDE_DATA.positions[positionKey];

    return (
      <div className="space-y-6">
        <div className="text-center py-6 bg-white rounded-lg">
          <h2 className="text-3xl font-bold" style={{ color: colors.chiliRed }}>
            {positionKey}
          </h2>
          <p className="text-lg mt-2" style={{ color: colors.chiliNavy }}>
            "{data.motto}"
          </p>
        </div>

        {/* Observable Behaviors */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliNavy }}>
            <Target size={24} />
            Observable Behaviors
          </h3>
          <div className="space-y-4">
            {data.behaviors.map((behavior, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h4 className="font-bold mb-2" style={{ color: colors.chiliRed }}>✅ {behavior.title}</h4>
                <ul className="space-y-1">
                  {behavior.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: colors.chiliGreen }}>•</span>
                      <span style={{ color: colors.chiliGray }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching Scenarios */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliNavy }}>
            <BookOpen size={24} />
            Coaching Scenarios
          </h3>
          <div className="space-y-4">
            {data.scenarios.map((scenario, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow">
                <h4 className="font-bold mb-3" style={{ color: colors.chiliRed }}>
                  Scenario {index + 1}: {scenario.title}
                </h4>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold" style={{ color: colors.chiliNavy }}>WHAT YOU SEE: </span>
                    <span style={{ color: colors.chiliGray }}>{scenario.see}</span>
                  </div>

                  <div>
                    <span className="font-semibold" style={{ color: colors.chiliNavy }}>COACHING: </span>
                    <span style={{ color: colors.chiliGray }}>{scenario.coach}</span>
                  </div>

                  {scenario.practice && (
                    <div>
                      <span className="font-semibold" style={{ color: colors.chiliNavy }}>PRACTICE: </span>
                      <span style={{ color: colors.chiliGray }}>{scenario.practice}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recognition Examples */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliNavy }}>
            <Award size={24} />
            Recognition Examples
          </h3>
          <div className="bg-white p-5 rounded-lg space-y-2">
            {data.recognition.map((rec, index) => (
              <div key={index} className="flex items-start gap-2">
                <span style={{ color: colors.chiliGreen }}>🔥</span>
                <span style={{ color: colors.chiliGray }}>
                  <strong>[Name]</strong> {rec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/coaching')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
            Coaching Guide
          </h1>

          <div style={{ width: '120px' }}></div>
        </div>

        {/* Position Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className="px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium"
              style={{
                backgroundColor: selectedPosition === pos ? colors.chiliRed : 'white',
                color: selectedPosition === pos ? 'white' : colors.chiliNavy,
                border: `2px solid ${selectedPosition === pos ? colors.chiliRed : colors.chiliGray}`
              }}
            >
              {pos === 'overview' ? '📋 Overview' : pos}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {selectedPosition === 'overview' ? renderOverview() : renderPosition(selectedPosition)}
        </div>

        {/* Coaching Tips Footer */}
        <div className="mt-8 bg-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.chiliRed }}>
            Coaching Best Practices
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: colors.chiliGreen }}>
                <CheckCircle size={18} />
                DO:
              </h4>
              <ul className="space-y-1 text-sm" style={{ color: colors.chiliGray }}>
                <li>• Coach in private, praise in public</li>
                <li>• Focus on behavior, not person</li>
                <li>• Ask questions first: "What happened?"</li>
                <li>• Role-play new behaviors immediately</li>
                <li>• Follow up next shift</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: colors.chiliRed }}>
                DON'T:
              </h4>
              <ul className="space-y-1 text-sm" style={{ color: colors.chiliGray }}>
                <li>• Wait until after shift to address issues</li>
                <li>• Coach in front of guests</li>
                <li>• Assume they know why it matters</li>
                <li>• Give feedback without solutions</li>
                <li>• Forget to recognize when they improve</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingGuide;
