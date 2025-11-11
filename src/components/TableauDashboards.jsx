import React, { useState } from 'react';
import { ChevronLeft, BarChart3, TrendingUp, DollarSign, Users, Award, ExternalLink } from 'lucide-react';
import { colors, styles } from '../styles/design-system';

const dashboards = [
  {
    id: 'rap',
    name: 'RAP Portal',
    icon: BarChart3,
    description: 'Restaurant Action Plan - Main performance overview',
    url: 'https://tab.brinker.com/views/RapPortal-Chilis_0305/RAPPortalNew/18e73d77-6049-4b1d-adba-934301016765/b01afee0-b7d2-43c3-965d-75390bb2f2a3',
    category: 'all'
  },
  {
    id: 'gwap',
    name: 'GWAP Dine-In',
    icon: Users,
    description: 'Guest Wait at Present tracking for dine-in service (Target: <2.3%)',
    url: 'https://tab.brinker.com/views/HospitalityGEMDashboard-Nav/TopScores/209cfc8e-dd23-43e8-8bee-06911f449411/5b121e51-7036-488e-a1f1-1eba9a4311fc',
    category: 'hospitality'
  },
  {
    id: 'pnl',
    name: 'P&L Report',
    icon: DollarSign,
    description: 'Profit & Loss statement with labor, food cost, and other operational metrics',
    url: 'https://tab.brinker.com/views/PnLReport/PnLDashboard/3893e830-e15f-4f2b-88ab-8f10050e6933/b9a8b466-63dd-4faf-93f9-849b45927e9c',
    category: 'all'
  },
  {
    id: 'comps',
    name: 'Comps',
    icon: Award,
    description: 'Complimentary items tracking and expense analysis',
    url: 'https://tab.brinker.com/views/CompsDashboard_New_Nav/CompExpByCategory',
    category: 'all'
  },
  {
    id: 'scorecard',
    name: 'Server Scorecard',
    icon: TrendingUp,
    description: 'Individual server performance metrics and hospitality scores',
    url: 'https://tab.brinker.com/views/HospitalityGEMDashboard-Nav/Scorecard',
    category: 'hospitality'
  }
];

const TableauDashboards = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDashboards = selectedCategory === 'all' 
    ? dashboards 
    : dashboards.filter(d => d.category === selectedCategory);

  return (
    <div style={{ ...styles.pageContainer }}>
      {/* Header */}
      <div style={{ ...styles.header }}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="bg-white bg-opacity-20 p-2 rounded-md mr-3 hover:bg-opacity-30 transition-all"
              style={{ cursor: 'pointer' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-1">📊 Analytics Dashboard</h1>
              <p className="text-yellow-100">Chili's #605 - Auburn Hills, MI</p>
            </div>
          </div>
        </div>
        <p className="text-center text-yellow-100 text-lg font-medium">
          Real-Time Performance Metrics
        </p>
      </div>

      {/* Category Filter */}
      <div className="p-6 pb-2">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className="transition-all duration-300"
            style={{
              ...styles.pill,
              ...(selectedCategory === 'all' ? {
                backgroundColor: colors.chiliRed,
                color: colors.cream,
                borderColor: colors.chiliRed,
                boxShadow: '0 4px 12px rgba(237, 28, 36, 0.5)',
                transform: 'translateY(-2px)'
              } : {
                backgroundColor: colors.chiliNavy,
                color: colors.cream,
                borderColor: colors.chiliRed,
              }),
              cursor: 'pointer',
              padding: '12px 24px'
            }}
          >
            All Dashboards
          </button>
          <button
            onClick={() => setSelectedCategory('hospitality')}
            className="transition-all duration-300"
            style={{
              ...styles.pill,
              ...(selectedCategory === 'hospitality' ? {
                backgroundColor: colors.chiliRed,
                color: colors.cream,
                borderColor: colors.chiliRed,
                boxShadow: '0 4px 12px rgba(237, 28, 36, 0.5)',
                transform: 'translateY(-2px)'
              } : {
                backgroundColor: colors.chiliNavy,
                color: colors.cream,
                borderColor: colors.chiliRed,
              }),
              cursor: 'pointer',
              padding: '12px 24px'
            }}
          >
            Hospitality
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <button
                key={dashboard.id}
                onClick={() => window.open(dashboard.url, '_blank')}
                className="text-left transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: `2px solid ${colors.chiliRed}`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div 
                      className="p-3 rounded-lg mr-3"
                      style={{ backgroundColor: colors.chiliNavy }}
                    >
                      <Icon size={28} style={{ color: colors.cream }} />
                    </div>
                    <div>
                      <h3 
                        className="text-xl font-bold mb-1"
                        style={{ color: colors.chiliNavy }}
                      >
                        {dashboard.name}
                      </h3>
                    </div>
                  </div>
                  <ExternalLink 
                    size={20} 
                    style={{ color: colors.chiliRed, flexShrink: 0 }} 
                  />
                </div>

                {/* Description */}
                <p 
                  className="text-sm mb-4"
                  style={{ color: colors.chiliBrown }}
                >
                  {dashboard.description}
                </p>

                {/* Open Button */}
                <div 
                  className="inline-flex items-center text-sm font-semibold"
                  style={{ color: colors.chiliRed }}
                >
                  Open Dashboard →
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="px-6 pb-6">
        <div 
          className="rounded-lg p-4"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${colors.chiliYellow}`
          }}
        >
          <h3 
            className="font-semibold mb-2"
            style={{ color: colors.cream }}
          >
            💡 Dashboard Access:
          </h3>
          <ul className="text-sm space-y-1" style={{ color: colors.cream }}>
            <li>• Dashboards open in a new tab with full Tableau functionality</li>
            <li>• Must be on Brinker network or VPN to access</li>
            <li>• Use filters and drill-downs for detailed analysis</li>
            <li>• Bookmark dashboards you use frequently</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TableauDashboards;
