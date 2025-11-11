import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertTriangle, Star, Eye, MessageSquare, UserCheck, Users } from 'lucide-react';
import { supabase } from '../../supabase';
import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';

const HospitalityDashboard = ({ manager, onBack }) => {
  const [view, setView] = useState('main'); // 'main', 'gwap', 'servers', etc.
  const [gwapData, setGwapData] = useState({ percent: 0, count: 0 });
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
            <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              🎉 Hospitality Dashboard
            </h1>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              Excellence in Guest Experience
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              9.2%
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>GWAP</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>On Target</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              52s
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>Avg Greet</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>Exceeds</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              94%
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>5/10 Culture</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>Strong</div>
          </div>
        </div>

        {/* Tools */}
        <div className="p-4 space-y-3">
          <button
            onClick={() => setView('gwap')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(237,28,36,0.1)' }}>
                  <AlertTriangle size={24} style={{ color: colors.chiliRed }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    GWAP Tracker
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Track guest service issues
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>9.2%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>On Target</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('servers')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(255,198,11,0.1)' }}>
                  <Star size={24} style={{ color: colors.chiliYellow }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Server Excellence
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Monitor server performance
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>52s</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Avg Greet</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('five-ten')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <Eye size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    5/10 Culture Tracker
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Enforce hospitality standards
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>94%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Compliance</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('feedback')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(34,35,91,0.1)' }}>
                  <MessageSquare size={24} style={{ color: colors.chiliNavy }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Guest Feedback
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Track compliments & complaints
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliYellow }}>12</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>New Today</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('hosts')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <UserCheck size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Host Excellence
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Monitor door service
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>96%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Greeting Rate</div>
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
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(237,28,36,0.1)' }}>
                  <Users size={24} style={{ color: colors.chiliRed }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    FOH Team Development
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Training, reviews, cross-training
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliRed }}>3</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Need Reviews</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Individual tool views - placeholders for now
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => setView('main')} className="mr-4">
          <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
          {view.charAt(0).toUpperCase() + view.slice(1)}
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

export default HospitalityDashboard;
