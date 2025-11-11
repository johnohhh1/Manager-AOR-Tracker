import React, { useState, useEffect } from 'react';
import { ChevronLeft, Flame, CheckSquare, Shield, DollarSign, Users, Calendar, Clipboard } from 'lucide-react';
import { supabase } from '../../supabase';
import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';

const CulinaryDashboard = ({ manager, onBack }) => {
  const [view, setView] = useState('main');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // TODO: Load data from Supabase
    setLoading(false);
  };

  if (view === 'main') {
    return (
      <div style={{ ...styles.pageContainer }}>
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
          <button onClick={onBack} className="mr-4">
            <ChevronLeft size={24} style={{ color: 'white' }} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              👨‍🍳 Culinary Dashboard
            </h1>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              Excellence Through Execution & Safety
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliYellow }}>
              4/5
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>Five to Drive</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliYellow }}>1 Remaining</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              94%
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>SAFE Score</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>On Target</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliRed }}>
              28.3%
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>Food COS</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliRed }}>Review</div>
          </div>
        </div>

        {/* Tools */}
        <div className="p-4 space-y-3">
          <button
            onClick={() => setView('five-to-drive')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(237,28,36,0.1)' }}>
                  <Flame size={24} style={{ color: colors.chiliRed }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Five to Drive
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Track daily prep procedures
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliYellow }}>4/5</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Complete</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('kitchensync')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <CheckSquare size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    KitchenSync Validation
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Morning systems check
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliRed }}>Not Done</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Today</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('safe')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <Shield size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    SAFE Score Manager
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Food safety tracking
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>94%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>On Target</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('cos')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(237,28,36,0.1)' }}>
                  <DollarSign size={24} style={{ color: colors.chiliRed }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    COS Food Tracker
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Cost of sales analysis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliRed }}>28.3%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Review Needed</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('team')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(255,198,11,0.1)' }}>
                  <Users size={24} style={{ color: colors.chiliYellow }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    HOH Team Development
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Training, reviews, cross-training
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliYellow }}>3</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Need Reviews</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('schedule')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <Calendar size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    HOH Schedule
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Build and post schedules
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>Posted</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>On Time</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('connection-board')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(34,35,91,0.1)' }}>
                  <Clipboard size={24} style={{ color: colors.chiliNavy }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Connection Board
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Update daily metrics
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>Updated</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Today</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Individual tool views - placeholders
  return (
    <div style={{ ...styles.pageContainer }}>
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => setView('main')} className="mr-4">
          <ChevronLeft size={24} style={{ color: 'white' }} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
          {view.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h1>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.chiliNavy }}>
            Coming Soon!
          </h2>
          <p style={{ color: colors.chiliBrown }}>
            This tool is under construction. Check back soon!
          </p>
          <button
            onClick={() => setView('main')}
            className="mt-6"
            style={{ ...styles.buttonPrimary }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CulinaryDashboard;
