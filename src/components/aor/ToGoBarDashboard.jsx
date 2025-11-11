import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, DollarSign, TrendingUp, Gift, Beer, BarChart3, Users } from 'lucide-react';
import { supabase } from '../../supabase';
import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';

const ToGoBarDashboard = ({ manager, onBack }) => {
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
            <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              🍹 To-Go/Bar Dashboard
            </h1>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              Excellence in Service & Sales
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              8.2%
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>Missing Items</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>On Target</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              $12
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>Bar Incremental</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliGreen }}>Exceeds!</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliYellow }}>
              18
            </div>
            <div className="text-xs" style={{ color: colors.chiliBrown }}>MCR Sign-Ups</div>
            <div className="text-xs mt-1" style={{ color: colors.chiliYellow }}>This Week</div>
          </div>
        </div>

        {/* Tools */}
        <div className="p-4 space-y-3">
          <button
            onClick={() => setView('togo-accuracy')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <Package size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    To-Go Order Accuracy
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Track missing items
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>8.2%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>On Target</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('togo-gwap')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <DollarSign size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    To-Go GWAP Tracker
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Monitor Guest Wrong at Pickup
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>9.5%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>On Target</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('bar-sales')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(116,158,51,0.1)' }}>
                  <TrendingUp size={24} style={{ color: colors.chiliGreen }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Bar Incremental Sales
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Track upsells and add-ons
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliGreen }}>$12</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Today</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('mcr')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(255,198,11,0.1)' }}>
                  <Gift size={24} style={{ color: colors.chiliYellow }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    MCR Sign-Ups
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    My Chili's Rewards enrollment
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliYellow }}>18</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>This Week</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('bwl')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(34,35,91,0.1)' }}>
                  <Beer size={24} style={{ color: colors.chiliNavy }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    BWL Order Manager
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Beer, Wine, Liquor ordering
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliYellow }}>2 days</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Order Due</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('liquor-cos')}
            className="w-full text-left cursor-pointer"
            style={{ ...styles.card }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: 'rgba(34,35,91,0.1)' }}>
                  <BarChart3 size={24} style={{ color: colors.chiliNavy }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
                    Liquor COS Tracker
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Cost of sales analysis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliNavy }}>23.5%</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Review</div>
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
                    Team Development
                  </h3>
                  <p className="text-sm" style={{ color: colors.chiliBrown }}>
                    Training, reviews, cross-training
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: colors.chiliRed }}>2</div>
                <div className="text-xs" style={{ color: colors.chiliGray }}>Need Reviews</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Individual tool views - placeholders
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => setView('main')} className="mr-4">
          <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
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

export default ToGoBarDashboard;
