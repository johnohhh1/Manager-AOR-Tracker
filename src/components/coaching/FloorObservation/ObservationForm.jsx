import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  Users,
  Clock,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { useCoaching } from '../../../hooks/useCoaching';
import { supabase } from '../../../supabase';

// Chili's Brand Colors
const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliBrown: 'rgb(60, 58, 53)',
  chiliGray: 'rgb(161, 159, 154)'
};

// Position-specific behaviors to observe
const positionBehaviors = {
  host: [
    'Greets guests within 30 seconds',
    'Manages wait times accurately',
    'Offers My Chili\'s Rewards',
    'Maintains clean lobby area',
    'Assists with to-go orders'
  ],
  server: [
    'Greets table within 30 seconds',
    'Suggestive sells appetizers',
    'Checks back within 2 minutes',
    'Pre-busses effectively',
    'Processes payments accurately'
  ],
  bartender: [
    'Maintains clean bar top',
    'Engages with bar guests',
    'Follows drink recipes',
    'Manages ticket times',
    'Upsells premium liquors'
  ],
  cook: [
    'Follows recipes/procedures',
    'Maintains proper temps',
    'Keeps station clean',
    'Communicates with expo',
    'Manages ticket times'
  ],
  togoSpecialist: [
    'Answers phone promptly',
    'Verifies order accuracy',
    'Suggestive sells add-ons',
    'Packages food properly',
    'Processes payment efficiently'
  ],
  busser: [
    'Pre-busses tables',
    'Resets tables quickly',
    'Maintains floor cleanliness',
    'Stocks service stations',
    'Assists servers proactively'
  ]
};

const ObservationForm = ({ manager, existingObservation = null }) => {
  const navigate = useNavigate();
  const coaching = useCoaching();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState({});

  // Load team members from Supabase team_members table
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('name');

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error loading team members:', error);
        setTeamMembers([]);
      }
    };
    loadTeamMembers();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    shift_date: format(new Date(), 'yyyy-MM-dd'),
    shift_type: 'PM',
    observations: {},
    metrics: {
      sales: '',
      labor: '',
      guest_count: '',
      table_turns: ''
    },
    top_performer: {
      name: '',
      position: '',
      reason: ''
    },
    coaching_priorities: [],
    guest_feedback: {
      compliments: [],
      complaints: []
    },
    manager_notes: ''
  });

  // Initialize with existing observation if editing
  useEffect(() => {
    if (existingObservation) {
      setFormData(existingObservation);
    }
  }, [existingObservation]);

  // Auto-save to localStorage
  useEffect(() => {
    const draftKey = `observation_draft_${manager?.name}`;
    if (!existingObservation) {
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, manager, existingObservation]);

  // Load draft from localStorage
  useEffect(() => {
    if (!existingObservation) {
      const draftKey = `observation_draft_${manager?.name}`;
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          setFormData(parsedDraft);
        } catch (e) {
          console.error('Error loading draft:', e);
        }
      }
    }
  }, [manager, existingObservation]);

  const handlePositionObservation = (position, behavior, value) => {
    setFormData(prev => ({
      ...prev,
      observations: {
        ...prev.observations,
        [position]: {
          ...prev.observations[position],
          [behavior]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const observationData = {
        ...formData,
        manager_id: manager.name,
        manager_name: manager.name,
        updated_at: new Date().toISOString()
      };

      if (existingObservation) {
        await coaching.floorObservations.update(existingObservation.id, observationData);
      } else {
        await coaching.floorObservations.create(observationData);
        // Clear draft after successful save
        localStorage.removeItem(`observation_draft_${manager?.name}`);
      }

      // Record coaching activity
      await coaching.activity.record({
        manager_id: manager.name,
        activity_type: 'floor_observation',
        activity_date: formData.shift_date,
        details: {
          shift_type: formData.shift_type,
          positions_observed: Object.keys(formData.observations)
        }
      });

      alert('Floor observation saved successfully!');
      navigate('/coaching/observations');
    } catch (error) {
      console.error('Error saving observation:', error);
      alert('Error saving observation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    'Basic Info',
    'Position Observations',
    'Metrics & Performance',
    'Coaching Notes',
    'Review & Save'
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliNavy }}>
      {/* Header */}
      <div className="shadow-sm p-4 flex items-center justify-between" style={{
        background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`
      }}>
        <div className="flex items-center">
          <button
            onClick={() => navigate('/coaching/observations')}
            className="mr-4 hover:opacity-70 transition-opacity"
          >
            <ChevronLeft size={24} style={{ color: 'white' }} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {existingObservation ? 'Edit' : 'New'} Floor Observation
            </h1>
            <p className="text-sm" style={{ color: colors.chiliCream }}>
              Document coaching and team performance
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Discard changes?')) {
              navigate('/coaching/observations');
            }
          }}
          className="p-2 hover:opacity-70 transition-opacity"
        >
          <X size={24} style={{ color: 'white' }} />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="border-b p-4" style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.1)'
      }}>
        <div className="flex justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center cursor-pointer ${
                index <= currentStep ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-1 ${
                  index === currentStep ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: index <= currentStep ? colors.chiliGreen : colors.chiliGray,
                  '--tw-ring-color': colors.chiliGreen
                }}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs text-center" style={{ color: colors.chiliBrown }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Step 0: Basic Info */}
        {currentStep === 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.chiliNavy }}>
              Shift Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliBrown }}>
                  <Calendar size={16} className="inline mr-1" />
                  Shift Date
                </label>
                <input
                  type="date"
                  value={formData.shift_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, shift_date: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': colors.chiliRed }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliBrown }}>
                  <Clock size={16} className="inline mr-1" />
                  Shift Type
                </label>
                <select
                  value={formData.shift_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, shift_type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': colors.chiliRed }}
                >
                  <option value="AM">AM Shift</option>
                  <option value="PM">PM Shift</option>
                  <option value="Close">Close Shift</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Position Observations */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
              Position Observations
            </h2>

            {Object.entries(positionBehaviors).map(([position, behaviors]) => {
              // Map position keys to friendly names for filtering
              const positionNameMap = {
                host: 'Host',
                server: 'Server',
                bartender: 'Bartender',
                cook: 'Cook',
                togoSpecialist: 'To-Go Specialist',
                busser: 'Busser'
              };
              const positionName = positionNameMap[position] || position;
              const teamMembersForPosition = teamMembers.filter(tm => tm.position === positionName);

              return (
              <div key={position} className="rounded-lg p-6 shadow-md" style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `2px solid rgba(255,255,255,0.1)`
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold capitalize text-white">
                    {position.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>

                  {/* Team Member Dropdown */}
                  <select
                    value={selectedTeamMembers[position] || ''}
                    onChange={(e) => setSelectedTeamMembers(prev => ({
                      ...prev,
                      [position]: e.target.value
                    }))}
                    className="px-3 py-1.5 rounded-md text-sm"
                    style={{
                      minWidth: '200px',
                      backgroundColor: colors.chiliNavy,
                      color: 'white',
                      border: `1px solid ${colors.chiliGray}`
                    }}
                  >
                    <option value="">Select team member...</option>
                    {teamMembersForPosition.map(tm => (
                      <option key={tm.id} value={tm.name}>
                        {tm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {behaviors.map((behavior) => (
                    <div key={behavior} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: colors.chiliCream }}>
                        {behavior}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePositionObservation(position, behavior, {
                            met: true,
                            notes: '',
                            coached: false,
                            recognized: false
                          })}
                          className={`p-2 rounded-md transition-all ${
                            formData.observations[position]?.[behavior]?.met === true
                              ? 'bg-green-100 ring-2'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          style={{
                            '--tw-ring-color': colors.chiliGreen
                          }}
                        >
                          <CheckCircle size={20} style={{
                            color: formData.observations[position]?.[behavior]?.met === true
                              ? colors.chiliGreen
                              : colors.chiliGray
                          }} />
                        </button>
                        <button
                          onClick={() => handlePositionObservation(position, behavior, {
                            met: false,
                            notes: '',
                            coached: true,
                            recognized: false
                          })}
                          className={`p-2 rounded-md transition-all ${
                            formData.observations[position]?.[behavior]?.met === false
                              ? 'bg-red-100 ring-2'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          style={{
                            '--tw-ring-color': colors.chiliRed
                          }}
                        >
                          <XCircle size={20} style={{
                            color: formData.observations[position]?.[behavior]?.met === false
                              ? colors.chiliRed
                              : colors.chiliGray
                          }} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.observations[position] && Object.values(formData.observations[position]).some(obs => obs.met === false) && (
                    <div className="mt-3 p-3 rounded-md" style={{ backgroundColor: colors.chiliNavy }}>
                      <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                        Coaching Notes
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        rows={2}
                        placeholder="What coaching was provided?"
                        value={formData.observations[position]?.coaching_notes || ''}
                        onChange={(e) => handlePositionObservation(position, 'coaching_notes', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Step 2: Metrics & Performance */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4" style={{ color: colors.chiliNavy }}>
                Shift Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Sales
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={formData.metrics.sales}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, sales: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Labor %
                  </label>
                  <input
                    type="number"
                    placeholder="0%"
                    value={formData.metrics.labor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, labor: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Guest Count
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.metrics.guest_count}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, guest_count: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Table Turns
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.metrics.table_turns}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, table_turns: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4 flex items-center" style={{ color: colors.chiliNavy }}>
                <Award size={20} className="mr-2" style={{ color: colors.chiliYellow }} />
                Top Performer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Team Member Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.top_performer.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      top_performer: { ...prev.top_performer, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Position
                  </label>
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.top_performer.position}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      top_performer: { ...prev.top_performer, position: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.chiliBrown }}>
                    Recognition Reason
                  </label>
                  <input
                    type="text"
                    placeholder="What did they excel at?"
                    value={formData.top_performer.reason}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      top_performer: { ...prev.top_performer, reason: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Coaching Notes */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4 flex items-center" style={{ color: colors.chiliNavy }}>
                <AlertTriangle size={20} className="mr-2" style={{ color: colors.chiliYellow }} />
                Coaching Priorities for Next Shift
              </h3>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="What should the next manager focus on? List priority items..."
                value={formData.coaching_priorities.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  coaching_priorities: e.target.value.split('\n').filter(item => item.trim())
                }))}
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4" style={{ color: colors.chiliNavy }}>
                Manager Notes
              </h3>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Additional observations, concerns, or notes..."
                value={formData.manager_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, manager_notes: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Save */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.chiliNavy }}>
              Review Observation Summary
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-md" style={{ backgroundColor: colors.chiliNavy }}>
                <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>Shift Details</h4>
                <p className="text-sm" style={{ color: colors.chiliBrown }}>
                  Date: {format(new Date(formData.shift_date), 'MMM d, yyyy')} | Type: {formData.shift_type} Shift
                </p>
              </div>

              <div className="p-4 rounded-md" style={{ backgroundColor: colors.chiliNavy }}>
                <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>Positions Observed</h4>
                <p className="text-sm" style={{ color: colors.chiliBrown }}>
                  {Object.keys(formData.observations).length} positions with {
                    Object.values(formData.observations).reduce((acc, pos) =>
                      acc + Object.values(pos).filter(obs => typeof obs === 'object' && obs.met === false).length, 0
                    )
                  } coaching opportunities identified
                </p>
              </div>

              {formData.top_performer.name && (
                <div className="p-4 rounded-md" style={{ backgroundColor: colors.chiliNavy }}>
                  <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>Top Performer</h4>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    {formData.top_performer.name} ({formData.top_performer.position}) - {formData.top_performer.reason}
                  </p>
                </div>
              )}

              {formData.coaching_priorities.length > 0 && (
                <div className="p-4 rounded-md" style={{ backgroundColor: colors.chiliNavy }}>
                  <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>Next Shift Priorities</h4>
                  <ul className="text-sm" style={{ color: colors.chiliBrown }}>
                    {formData.coaching_priorities.map((priority, index) => (
                      <li key={index}>• {priority}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                style={{ backgroundColor: colors.chiliGreen }}
              >
                {saving ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Save Observation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`py-2 px-4 rounded-md font-medium flex items-center ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={20} className="mr-1" />
            Previous
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity flex items-center"
              style={{ backgroundColor: colors.chiliNavy }}
            >
              Next
              <ChevronRight size={20} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObservationForm;