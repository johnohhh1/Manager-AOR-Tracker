import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, FileText, ChevronLeft, Calendar } from 'lucide-react';
import { colors, styles, radius, spacing } from '../../styles/design-system';
import { useBrandStandards } from '../../hooks/useBrandStandards';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import ValidationWalkthrough from './ValidationWalkthrough';
import ValidationHistory from './ValidationHistory';
import ActionItemsList from './ActionItemsList';

const BrandStandardsDashboard = ({ manager, onBack }) => {
  const [view, setView] = useState('main'); // 'main', 'validation', 'history', 'actions'
  const [currentValidation, setCurrentValidation] = useState(null);
  const [stats, setStats] = useState({
    totalValidations: 0,
    completedValidations: 0,
    openActionItems: 0,
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);

  const brandStandards = useBrandStandards();

  useEffect(() => {
    if (manager && view === 'main') {
      loadStats();
    }
  }, [manager, view]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Get stats for current week
      const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

      const { data, error } = await brandStandards.stats.getStats(
        manager.name,
        weekStart,
        weekEnd
      );

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewValidation = async () => {
    try {
      const currentHour = new Date().getHours();
      const shift = currentHour < 16 ? 'AM' : 'PM';

      const { data, error } = await brandStandards.validations.create({
        manager_id: manager.name,
        validation_date: format(new Date(), 'yyyy-MM-dd'),
        shift: shift,
        status: 'in_progress'
      });

      if (data) {
        setCurrentValidation(data);
        setView('validation');
      } else {
        alert('Error creating validation session. Please try again.');
      }
    } catch (error) {
      console.error('Error starting validation:', error);
      alert('Error creating validation session. Please try again.');
    }
  };

  const handleValidationComplete = () => {
    setCurrentValidation(null);
    setView('main');
    loadStats(); // Refresh stats
  };

  // Render different views
  if (view === 'validation' && currentValidation) {
    return (
      <ValidationWalkthrough
        validation={currentValidation}
        manager={manager}
        onComplete={handleValidationComplete}
        onBack={() => {
          setCurrentValidation(null);
          setView('main');
        }}
      />
    );
  }

  if (view === 'history') {
    return (
      <ValidationHistory
        manager={manager}
        onBack={() => setView('main')}
      />
    );
  }

  if (view === 'actions') {
    return (
      <ActionItemsList
        manager={manager}
        onBack={() => setView('main')}
      />
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliNavy}, ${colors.chiliRed})`,
        color: 'white',
        padding: '1.5rem'
      }}>
        <button
          onClick={onBack}
          className="mb-3 bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold mb-2">🛡️ Brand Standards Validation</h1>
        <p className="opacity-90">Comprehensive Walkthrough & Action Tracking</p>
        {manager && (
          <p className="text-sm mt-2 text-yellow-100">Manager: {manager.name}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-3xl font-bold" style={{ color: colors.chiliGreen }}>
            {stats.completedValidations}
          </div>
          <div className="text-sm" style={{ color: colors.chiliBrown }}>
            This Week
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-3xl font-bold" style={{ color: colors.chiliRed }}>
            {stats.openActionItems}
          </div>
          <div className="text-sm" style={{ color: colors.chiliBrown }}>
            Open Actions
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <div className="text-3xl font-bold" style={{ color: colors.chiliYellow }}>
            {stats.complianceRate}%
          </div>
          <div className="text-sm" style={{ color: colors.chiliBrown }}>
            Compliance
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={startNewValidation}
          className="w-full bg-white rounded-lg p-6 text-left shadow-md border-2 hover:shadow-lg transition-shadow cursor-pointer"
          style={{ borderColor: colors.chiliNavy }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                Start New Validation
              </h3>
              <p className="text-sm" style={{ color: colors.chiliBrown }}>
                Begin comprehensive walkthrough
              </p>
            </div>
            <CheckCircle size={32} style={{ color: colors.chiliGreen }} />
          </div>
        </button>

        <button
          onClick={() => setView('history')}
          className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                Validation History
              </h3>
              <p className="text-sm" style={{ color: colors.chiliBrown }}>
                View past validations & trends
              </p>
            </div>
            <FileText size={32} style={{ color: colors.chiliNavy }} />
          </div>
        </button>

        <button
          onClick={() => setView('actions')}
          className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                Open Action Items
              </h3>
              <p className="text-sm" style={{ color: colors.chiliBrown }}>
                Track outstanding issues ({stats.openActionItems})
              </p>
            </div>
            <AlertTriangle size={32} style={{ color: colors.chiliRed }} />
          </div>
        </button>
      </div>

      {/* Info Card */}
      <div className="mx-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: colors.chiliNavy }}>
          <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>
            📋 About Brand Standards Validations
          </h4>
          <p className="text-sm" style={{ color: colors.chiliBrown }}>
            This tool replaces paper checklists with an interactive digital validation system.
            Take photos of issues, create action items, and track compliance over time.
          </p>
          <ul className="text-sm mt-2 space-y-1" style={{ color: colors.chiliBrown }}>
            <li>✓ 10 validation sections with detailed checklists</li>
            <li>✓ Photo capture with auto-compression</li>
            <li>✓ Action item tracking with owners & due dates</li>
            <li>✓ Historical trend analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandStandardsDashboard;
