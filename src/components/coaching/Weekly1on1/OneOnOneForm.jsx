import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Star, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import { useCoaching } from '../../../hooks/useCoaching';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliGray: 'rgb(161, 159, 154)'
};

// Position-specific behaviors
const POSITION_BEHAVIORS = {
  'Host': [
    { key: 'greeting_30sec', label: '30-second greeting' },
    { key: 'welcome_phrase', label: 'Uses "Hi! Welcome to Chili\'s!"' },
    { key: 'energy', label: 'Energy & enthusiasm' },
    { key: 'door_arriving', label: 'Door service (arriving)' },
    { key: 'door_departing', label: 'Door service (departing)' }
  ],
  'Server': [
    { key: 'greeting_60sec', label: '60-second greeting' },
    { key: 'recommends_marg_app', label: 'Recommends marg & app' },
    { key: 'silent_refills', label: 'Silent refills' },
    { key: 'pre_bussing', label: 'Pre-bussing' },
    { key: 'regular_checkins', label: 'Regular check-ins' }
  ],
  'Runner': [
    { key: 'asks_more', label: 'Asks "What more can I get you?"' },
    { key: 'runs_drinks_quickly', label: 'Runs drinks quickly' },
    { key: 'consistent_prebussing', label: 'Consistent pre-bussing' }
  ],
  'Bartender': [
    { key: 'greeting_60sec_bar', label: '60-second bar greeting' },
    { key: 'recommends_marg_app_bar', label: 'Recommends marg & app' },
    { key: 'drinks_under_3min', label: 'Drinks under 3 minutes' },
    { key: 'frozen_marg_quality', label: 'Perfect frozen marg quality' }
  ],
  'Busser': [
    { key: 'tables_bussed_2min', label: 'Tables bussed within 2 min' },
    { key: 'wipes_spot_sweeps', label: 'Wipes AND spot sweeps' },
    { key: 'headset_communication', label: 'Headset communication' }
  ],
  'To-Go Specialist': [
    { key: 'greeting_togo', label: 'Greeting: "Hi! Welcome to Chili\'s!"' },
    { key: 'bag_chit_systematic', label: 'Works bag chit systematically' },
    { key: 'order_accuracy', label: 'Order accuracy' }
  ],
  'QA': [
    { key: 'proactive_updates', label: 'Proactive order status updates' },
    { key: 'validates_spec', label: 'Validates made-to-spec' },
    { key: 'uses_names', label: 'Uses names to expedite' }
  ],
  'Cook': [
    { key: 'made_to_spec', label: 'Orders made to spec' },
    { key: 'order_completion', label: '100% order completion' },
    { key: 'food_safety', label: 'Food safety compliance' },
    { key: 'station_cleanliness', label: 'Station cleanliness' }
  ]
};

const OneOnOneForm = ({ manager }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { oneOnOnes, teamMembers } = useCoaching();

  const [loading, setLoading] = useState(false);
  const [teamMembersList, setTeamMembersList] = useState([]);
  const [formData, setFormData] = useState({
    team_member_id: '',
    meeting_date: new Date().toISOString().split('T')[0],
    fiscal_week: '',
    fiscal_period: '',

    // Metrics
    metrics: {},

    // Wins & Recognition
    wins: [''],
    manager_recognition: [''],
    peer_shoutouts: [''],
    guest_compliments: [''],

    // Behavior Ratings
    behavior_ratings: {},

    // Development
    focus_behavior: '',
    action_plan: {
      success_looks_like: '',
      support_needed: '',
      measurement: [],
      training_needed: []
    },

    // Cross-Training
    cross_training_status: {
      positions: [],
      interested_in: '',
      target_date: ''
    },

    // Schedule
    schedule_notes: '',
    enough_hours: true,
    avg_hours: '',

    // Feedback
    open_feedback: '',
    manager_feedback: '',
    manager_action_items: [''],

    // Commitments
    team_member_commits: ['', '', ''],
    manager_commits: ['', '', ''],

    // Follow-up
    next_meeting_date: '',
    follow_up_items: [],

    // Visibility
    visible_to: []
  });

  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    loadTeamMembers();
    if (id) {
      loadExisting();
    }
  }, [id]);

  const loadTeamMembers = async () => {
    try {
      const members = await teamMembers.getList({ manager_id: manager.id });
      setTeamMembersList(members || []);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const loadExisting = async () => {
    try {
      const data = await oneOnOnes.getById(id);
      if (data) {
        setFormData(data);
        const member = teamMembersList.find(m => m.id === data.team_member_id);
        setSelectedTeamMember(member);
      }
    } catch (error) {
      console.error('Error loading 1:1:', error);
    }
  };

  const handleTeamMemberChange = (e) => {
    const memberId = e.target.value;
    const member = teamMembersList.find(m => m.id === memberId);
    setSelectedTeamMember(member);
    setFormData(prev => ({
      ...prev,
      team_member_id: memberId
    }));

    // Initialize behavior ratings for this position
    if (member) {
      const behaviors = POSITION_BEHAVIORS[member.position] || [];
      const ratings = {};
      behaviors.forEach(b => {
        ratings[b.key] = { self: 3, manager: 3, notes: '' };
      });
      setFormData(prev => ({
        ...prev,
        behavior_ratings: ratings
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        manager_id: manager.id,
        manager_name: manager.name,
        visible_to: [manager.id]
      };

      if (id) {
        await oneOnOnes.update(id, dataToSave);
      } else {
        await oneOnOnes.create(dataToSave);
      }

      navigate('/coaching/1on1s');
    } catch (error) {
      console.error('Error saving 1:1:', error);
      alert('Error saving 1:1. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateMetric = (key, value) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [key]: value
      }
    }));
  };

  const updateBehaviorRating = (behaviorKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      behavior_ratings: {
        ...prev.behavior_ratings,
        [behaviorKey]: {
          ...(prev.behavior_ratings[behaviorKey] || {}),
          [field]: value
        }
      }
    }));
  };

  const steps = [
    { title: 'Team Member', icon: Users },
    { title: 'Metrics & Wins', icon: TrendingUp },
    { title: 'Behaviors', icon: Star },
    { title: 'Development', icon: TrendingUp },
    { title: 'Schedule & Feedback', icon: Users },
    { title: 'Commitments', icon: Save }
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex items-center" style={{ flex: 1 }}>
            <div className="flex flex-col items-center" style={{ flex: 1 }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === currentStep
                    ? 'ring-2 ring-offset-2'
                    : ''
                }`}
                style={{
                  backgroundColor: index <= currentStep ? colors.chiliRed : colors.chiliGray,
                  color: 'white',
                  ringColor: colors.chiliRed
                }}
              >
                <Icon size={20} />
              </div>
              <span
                className="text-xs mt-1 text-center"
                style={{
                  color: index === currentStep ? colors.chiliNavy : colors.chiliGray,
                  fontWeight: index === currentStep ? 'bold' : 'normal'
                }}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="h-0.5"
                style={{
                  flex: 1,
                  backgroundColor: index < currentStep ? colors.chiliRed : colors.chiliGray
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep0 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
        Select Team Member
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliNavy }}>
          Team Member *
        </label>
        <select
          value={formData.team_member_id}
          onChange={handleTeamMemberChange}
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: colors.chiliGray }}
          required
        >
          <option value="">Select a team member...</option>
          {teamMembersList.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} - {member.position}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliNavy }}>
            Meeting Date *
          </label>
          <input
            type="date"
            value={formData.meeting_date}
            onChange={(e) => setFormData(prev => ({ ...prev, meeting_date: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            style={{ borderColor: colors.chiliGray }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliNavy }}>
            Fiscal Period/Week
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="P5"
              value={formData.fiscal_period}
              onChange={(e) => setFormData(prev => ({ ...prev, fiscal_period: e.target.value }))}
              className="w-1/2 px-4 py-2 border rounded-lg"
              style={{ borderColor: colors.chiliGray }}
            />
            <input
              type="text"
              placeholder="W3"
              value={formData.fiscal_week}
              onChange={(e) => setFormData(prev => ({ ...prev, fiscal_week: e.target.value }))}
              className="w-1/2 px-4 py-2 border rounded-lg"
              style={{ borderColor: colors.chiliGray }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
        Metrics & Wins
      </h3>

      {/* Metrics */}
      <div>
        <h4 className="font-semibold mb-3" style={{ color: colors.chiliNavy }}>Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Sales/Performance Score</label>
            <input
              type="text"
              value={formData.metrics.performance || ''}
              onChange={(e) => updateMetric('performance', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="82%"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Attendance</label>
            <input
              type="text"
              value={formData.metrics.attendance || ''}
              onChange={(e) => updateMetric('attendance', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="100%"
            />
          </div>
        </div>
      </div>

      {/* Wins */}
      <div>
        <h4 className="font-semibold mb-3" style={{ color: colors.chiliNavy }}>Team Member Wins</h4>
        {formData.wins.map((win, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={win}
              onChange={(e) => updateArrayItem('wins', index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="What went well this week?"
            />
            {formData.wins.length > 1 && (
              <button
                onClick={() => removeArrayItem('wins', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('wins')}
          className="text-sm px-3 py-1 rounded"
          style={{ color: colors.chiliRed }}
        >
          + Add Win
        </button>
      </div>

      {/* Manager Recognition */}
      <div>
        <h4 className="font-semibold mb-3" style={{ color: colors.chiliNavy }}>Manager Recognition</h4>
        {formData.manager_recognition.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayItem('manager_recognition', index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Specific recognition..."
            />
            {formData.manager_recognition.length > 1 && (
              <button
                onClick={() => removeArrayItem('manager_recognition', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('manager_recognition')}
          className="text-sm px-3 py-1 rounded"
          style={{ color: colors.chiliRed }}
        >
          + Add Recognition
        </button>
      </div>

      {/* Guest Compliments */}
      <div>
        <h4 className="font-semibold mb-3" style={{ color: colors.chiliNavy }}>Guest Compliments</h4>
        {formData.guest_compliments.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayItem('guest_compliments', index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Guest feedback..."
            />
            {formData.guest_compliments.length > 1 && (
              <button
                onClick={() => removeArrayItem('guest_compliments', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('guest_compliments')}
          className="text-sm px-3 py-1 rounded"
          style={{ color: colors.chiliRed }}
        >
          + Add Compliment
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (!selectedTeamMember) {
      return <div>Please select a team member first</div>;
    }

    const behaviors = POSITION_BEHAVIORS[selectedTeamMember.position] || [];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
          ChiliHead Hospitality Behaviors - {selectedTeamMember.position}
        </h3>

        <div className="text-sm mb-4" style={{ color: colors.chiliGray }}>
          <strong>Rating Scale:</strong> 1 = Needs Improvement | 2 = Below Standard | 3 = Meets Standard | 4 = Exceeds | 5 = Role Model
        </div>

        {behaviors.map(behavior => (
          <div key={behavior.key} className="border rounded-lg p-4" style={{ borderColor: colors.chiliGray }}>
            <h4 className="font-semibold mb-3" style={{ color: colors.chiliNavy }}>
              {behavior.label}
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1">Self-Rating</label>
                <select
                  value={formData.behavior_ratings[behavior.key]?.self || 3}
                  onChange={(e) => updateBehaviorRating(behavior.key, 'self', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1">Manager Rating</label>
                <select
                  value={formData.behavior_ratings[behavior.key]?.manager || 3}
                  onChange={(e) => updateBehaviorRating(behavior.key, 'manager', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1">Notes</label>
                <input
                  type="text"
                  value={formData.behavior_ratings[behavior.key]?.notes || ''}
                  onChange={(e) => updateBehaviorRating(behavior.key, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Discussion notes..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
        Development Focus
      </h3>

      <div>
        <label className="block font-medium mb-2">Focus Behavior for This Week</label>
        <input
          type="text"
          value={formData.focus_behavior}
          onChange={(e) => setFormData(prev => ({ ...prev, focus_behavior: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="One behavior to level up..."
        />
      </div>

      <div>
        <label className="block font-medium mb-2">What does success look like?</label>
        <textarea
          value={formData.action_plan.success_looks_like}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            action_plan: { ...prev.action_plan, success_looks_like: e.target.value }
          }))}
          className="w-full px-4 py-2 border rounded-lg"
          rows="3"
          placeholder="Define success criteria..."
        />
      </div>

      <div>
        <label className="block font-medium mb-2">What support do you need?</label>
        <textarea
          value={formData.action_plan.support_needed}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            action_plan: { ...prev.action_plan, support_needed: e.target.value }
          }))}
          className="w-full px-4 py-2 border rounded-lg"
          rows="2"
          placeholder="Support needed from manager..."
        />
      </div>

      {/* Cross-Training */}
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-3" style={{ color: colors.chiliNavy }}>Cross-Training</h4>

        <div>
          <label className="block text-sm mb-2">Interested in which position?</label>
          <input
            type="text"
            value={formData.cross_training_status.interested_in}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              cross_training_status: { ...prev.cross_training_status, interested_in: e.target.value }
            }))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Position name..."
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm mb-2">Target Certification Date</label>
          <input
            type="date"
            value={formData.cross_training_status.target_date}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              cross_training_status: { ...prev.cross_training_status, target_date: e.target.value }
            }))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
        Schedule & Open Feedback
      </h3>

      {/* Schedule */}
      <div>
        <h4 className="font-semibold mb-3">Schedule</h4>

        <div className="flex items-center gap-4 mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enough_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, enough_hours: e.target.checked }))}
              className="mr-2"
            />
            Getting enough hours
          </label>

          <div className="flex items-center gap-2">
            <label className="text-sm">Avg hours/week:</label>
            <input
              type="number"
              value={formData.avg_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, avg_hours: e.target.value }))}
              className="w-20 px-2 py-1 border rounded"
              placeholder="30"
            />
          </div>
        </div>

        <textarea
          value={formData.schedule_notes}
          onChange={(e) => setFormData(prev => ({ ...prev, schedule_notes: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          rows="2"
          placeholder="Schedule preferences or availability changes..."
        />
      </div>

      {/* Open Feedback */}
      <div>
        <h4 className="font-semibold mb-3">Open Feedback</h4>
        <label className="block text-sm mb-2">What's on your mind?</label>
        <textarea
          value={formData.open_feedback}
          onChange={(e) => setFormData(prev => ({ ...prev, open_feedback: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          rows="4"
          placeholder="Team member questions, concerns, feedback..."
        />
      </div>

      {/* Manager Feedback */}
      <div>
        <label className="block text-sm mb-2">Manager Feedback & Action Items</label>
        <textarea
          value={formData.manager_feedback}
          onChange={(e) => setFormData(prev => ({ ...prev, manager_feedback: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          rows="3"
          placeholder="Manager response and action items..."
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
        Goals & Commitments
      </h3>

      {/* Team Member Commits */}
      <div>
        <h4 className="font-semibold mb-3">Team Member Commits To:</h4>
        {formData.team_member_commits.map((commit, index) => (
          <div key={index} className="mb-2">
            <label className="block text-xs mb-1">{index + 1}.</label>
            <input
              type="text"
              value={commit}
              onChange={(e) => updateArrayItem('team_member_commits', index, e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder={`Commitment ${index + 1}...`}
            />
          </div>
        ))}
      </div>

      {/* Manager Commits */}
      <div>
        <h4 className="font-semibold mb-3">Manager Commits To:</h4>
        {formData.manager_commits.map((commit, index) => (
          <div key={index} className="mb-2">
            <label className="block text-xs mb-1">{index + 1}.</label>
            <input
              type="text"
              value={commit}
              onChange={(e) => updateArrayItem('manager_commits', index, e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder={`Commitment ${index + 1}...`}
            />
          </div>
        ))}
      </div>

      {/* Next Meeting */}
      <div>
        <label className="block font-medium mb-2">Next 1:1 Date</label>
        <input
          type="date"
          value={formData.next_meeting_date}
          onChange={(e) => setFormData(prev => ({ ...prev, next_meeting_date: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/coaching/1on1s')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white"
          >
            <ArrowLeft size={20} />
            <span>Back to 1:1s</span>
          </button>

          <h1 className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
            {id ? 'Edit' : 'New'} Weekly 1:1
          </h1>

          <button
            onClick={handleSave}
            disabled={loading || !formData.team_member_id}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-white disabled:opacity-50"
            style={{ backgroundColor: colors.chiliRed }}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStepIndicator()}

          <div className="mt-8">
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-lg disabled:opacity-50"
              style={{
                backgroundColor: currentStep === 0 ? colors.chiliGray : colors.chiliNavy,
                color: 'white'
              }}
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1 || !formData.team_member_id}
              className="px-6 py-2 rounded-lg disabled:opacity-50"
              style={{
                backgroundColor: currentStep === steps.length - 1 ? colors.chiliGray : colors.chiliRed,
                color: 'white'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneOnOneForm;
