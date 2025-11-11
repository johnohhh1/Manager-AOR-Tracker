import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, MessageCircle, Target, CheckSquare, Award, AlertCircle } from 'lucide-react';
import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';

const QuickReference = ({ manager }) => {
  const navigate = useNavigate();

  const positions = [
    { icon: '🚪', name: 'HOST', items: ['30-second greeting with "Hi! Welcome to Chili\'s!"', 'Door service (arriving & departing)', 'Energy and enthusiasm'] },
    { icon: '🍽️', name: 'SERVER', items: ['60-second greeting + marg/app recommendation', 'Silent refills & pre-bussing', 'Regular check-ins (not just 2/2)'] },
    { icon: '🏃', name: 'RUNNER', items: ['"What more can I get you?" every delivery', 'Drinks before dishes (speed matters)', 'Proactive pre-bussing'] },
    { icon: '🍸', name: 'BARTENDER', items: ['60-second greeting + marg/app recommendation', 'Drinks under 3 minutes', 'Perfect frozen marg consistency'] },
    { icon: '🧹', name: 'BUSSER', items: ['Tables bussed within 2 min of guests leaving', 'Wipe AND spot sweep', 'Headset communication (table status)'] },
    { icon: '📦', name: 'TO-GO', items: ['Warm greeting: "Hi! Welcome to Chili\'s!"', 'Work bag chit systematically', 'Missing items under 9%'] },
    { icon: '👨\u200d🍳', name: 'QA', items: ['Proactive order status updates', 'Validate made-to-spec before sending', 'Use names to expedite'] },
    { icon: '👨\u200d🍳', name: 'HOH', items: ['100% order accuracy (spec, temp, complete)', 'Food safety compliance', 'Chili\'s Clean standards (station pride)'] }
  ];

  const scenarios = [
    { issue: 'Late greeting (>60 sec)', fix: 'Eye contact + "I\'ll be right there!" buys time' },
    { issue: 'No recommendation given', fix: 'Tell them what\'s great, don\'t make them guess' },
    { issue: 'Empty drinks at table', fix: 'Scan for empties every time you pass your section' },
    { issue: 'Silent food drop', fix: 'Every table touch: "What more can I get you?"' },
    { issue: 'Dirty table sitting 5+ min', fix: 'Dirty table = lost revenue. Priority 1.' },
    { issue: 'Missing items (To-Go)', fix: 'Bag chit is your checklist. Check as you pack.' },
    { issue: 'Order in window 2+ min', fix: 'Hot food, fast. Call server name on headset.' },
    { issue: 'Wrong temp/spec', fix: 'Ticket check twice: build it, send it.' }
  ];

  const coachingPhrases = {
    positive: [
      'That was perfect! Show [new TM] what you just did.',
      '🔥 You\'re crushing it - keep that energy!',
      'I love how you [specific behavior]. That\'s the standard!'
    ],
    redirect: [
      'Hey [Name], I noticed [behavior]. What happened?',
      'Quick fix: [specific action]. Let me see you try it.',
      'Walk me through your process. Where can we improve?'
    ],
    development: [
      'You\'re doing great at [X]. Let\'s level up [Y].',
      'What would make that interaction even better?',
      'Here\'s the why: [explain guest impact].'
    ]
  };

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
            Quick Reference Card
          </h1>

          <div style={{ width: '120px' }}></div>
        </div>

        {/* 5-Step Model */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliRed }}>
            <Target size={24} />
            5-Step Coaching Model
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {['OBSERVE', 'RECOGNIZE or REDIRECT', 'EXPLAIN WHY', 'PRACTICE', 'FOLLOW-UP'].map((step, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2"
                  style={{ backgroundColor: colors.chiliRed }}
                >
                  {index + 1}
                </div>
                <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Position-Specific Focus */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <Eye size={24} />
            Position-Specific Coaching Focus
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {positions.map((pos, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow">
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.chiliRed }}>
                  <span className="text-2xl">{pos.icon}</span>
                  {pos.name}
                </h3>
                <ul className="space-y-2">
                  {pos.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckSquare size={16} style={{ color: colors.chiliGreen, flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: colors.textSecondary }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Coaching Starters */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <MessageCircle size={24} />
            Coaching Starters
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.chiliGreen }}>
                👍 Positive Coaching
              </h3>
              <ul className="space-y-2 text-sm">
                {coachingPhrases.positive.map((phrase, i) => (
                  <li key={i} style={{ color: colors.textSecondary }}>• {phrase}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.chiliYellow }}>
                🔄 Redirective Coaching
              </h3>
              <ul className="space-y-2 text-sm">
                {coachingPhrases.redirect.map((phrase, i) => (
                  <li key={i} style={{ color: colors.textSecondary }}>• {phrase}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5 shadow">
              <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: colors.chiliNavy }}>
                🎯 Developmental Coaching
              </h3>
              <ul className="space-y-2 text-sm">
                {coachingPhrases.development.map((phrase, i) => (
                  <li key={i} style={{ color: colors.textSecondary }}>• {phrase}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Common Scenarios */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <AlertCircle size={24} />
            Common Coaching Scenarios
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y">
              {scenarios.map((scenario, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1">
                      <span className="font-semibold" style={{ color: colors.chiliRed }}>
                        {scenario.issue}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        → {scenario.fix}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Manager Self-Check */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <CheckSquare size={24} />
            Daily Manager Self-Check
          </h2>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="space-y-3">
              {[
                'Spent 80% of peak period on floor',
                'Gave 5+ specific positive recognitions',
                'Coached 2+ behaviors in real-time',
                'Connected with 10+ guests',
                'Followed 5/10 Rule with every person',
                'Addressed any off-standard behaviors immediately'
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded"
                    style={{ accentColor: colors.chiliGreen }}
                  />
                  <span style={{ color: colors.textSecondary }}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Recognition Tips & Dos/Don'ts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliGreen }}>
              <Award size={20} />
              Recognition Tips
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckSquare size={16} style={{ color: colors.chiliGreen, flexShrink: 0 }} />
                <span><strong>SPECIFIC</strong> → Name the exact behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare size={16} style={{ color: colors.chiliGreen, flexShrink: 0 }} />
                <span><strong>IMMEDIATE</strong> → Right when you see it</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare size={16} style={{ color: colors.chiliGreen, flexShrink: 0 }} />
                <span><strong>PUBLIC</strong> → Loud enough for others to hear</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckSquare size={16} style={{ color: colors.chiliGreen, flexShrink: 0 }} />
                <span><strong>AUTHENTIC</strong> → Mean it!</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-bold mb-4" style={{ color: colors.chiliNavy }}>
              Coaching Dos & Don'ts
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: colors.chiliGreen }}>DO ✓</h4>
                <ul className="space-y-1" style={{ color: colors.textSecondary }}>
                  <li>• Coach privately</li>
                  <li>• Praise publicly</li>
                  <li>• Ask questions first</li>
                  <li>• Role-play immediately</li>
                  <li>• Follow up next shift</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: colors.chiliRed }}>DON'T ✗</h4>
                <ul className="space-y-1" style={{ color: colors.textSecondary }}>
                  <li>• Wait until after shift</li>
                  <li>• Coach in front of guests</li>
                  <li>• Assume they know why</li>
                  <li>• Give feedback without solutions</li>
                  <li>• Forget to recognize improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Remember Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white text-center shadow-lg">
          <p className="text-lg font-semibold">
            📌 REMEMBER: Every behavior connects to making guests feel special.<br />
            Coach the WHY and they'll own the WHAT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickReference;
