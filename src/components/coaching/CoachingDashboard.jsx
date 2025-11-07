import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Eye,
  Users,
  PlayCircle,
  Book,
  BarChart3,
  Calendar,
  ClipboardCheck,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { useCoaching } from '../../hooks/useCoaching';

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

const CoachingDashboard = ({ manager }) => {
  const navigate = useNavigate();
  const coaching = useCoaching();
  const [recentActivity, setRecentActivity] = useState([]);
  const [coachingMetrics, setCoachingMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [manager]);

  const loadDashboardData = async () => {
    if (!manager) return;

    setLoading(true);
    try {
      // Get recent activity
      const { data: activityData } = await coaching.activity.getRecent(manager.name, 5);
      if (activityData) setRecentActivity(activityData);

      // Get current week metrics
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

      const { data: metricsData } = await coaching.activity.getMetrics(
        manager.name,
        format(startOfWeek, 'yyyy-MM-dd'),
        format(endOfWeek, 'yyyy-MM-dd')
      );
      if (metricsData) setCoachingMetrics(metricsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      id: 'observations',
      icon: <Eye size={32} />,
      title: 'Floor Observations',
      description: 'Track behaviors and coaching during shifts',
      route: '/coaching/observations',
      color: colors.chiliRed,
      stats: coachingMetrics?.total_observations || 0,
      statsLabel: 'This Week'
    },
    {
      id: '1on1s',
      icon: <Users size={32} />,
      title: 'Weekly 1:1s',
      description: 'Conduct and view team member development conversations',
      route: '/coaching/1on1s',
      color: colors.chiliNavy,
      stats: coachingMetrics?.total_one_on_ones || 0,
      statsLabel: 'This Week'
    },
    {
      id: 'scenarios',
      icon: <PlayCircle size={32} />,
      title: 'Training Scenarios',
      description: '18 role-play exercises for pre-shift practice',
      route: '/coaching/scenarios',
      color: colors.chiliGreen,
      stats: coachingMetrics?.total_scenarios || 0,
      statsLabel: 'Practiced'
    },
    {
      id: 'guide',
      icon: <Book size={32} />,
      title: 'Coaching Guide',
      description: 'Searchable coaching manual and resources',
      route: '/coaching/guide',
      color: colors.chiliYellow,
      stats: null,
      statsLabel: null
    },
    {
      id: 'quick-ref',
      icon: <ClipboardCheck size={32} />,
      title: 'Quick Reference',
      description: '5-Step model and position-specific tips',
      route: '/coaching/quick-reference',
      color: colors.chiliBrown,
      stats: null,
      statsLabel: null
    },
    {
      id: 'analytics',
      icon: <BarChart3 size={32} />,
      title: 'Analytics',
      description: 'View coaching trends and team development',
      route: '/coaching/analytics',
      color: colors.chiliRed,
      stats: coachingMetrics?.team_members_coached || 0,
      statsLabel: 'Team Members'
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'floor_observation': return <Eye size={16} />;
      case '1on1': return <Users size={16} />;
      case 'scenario': return <PlayCircle size={16} />;
      case 'recognition': return <Award size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const getActivityLabel = (type) => {
    switch(type) {
      case 'floor_observation': return 'Floor Observation';
      case '1on1': return 'Weekly 1:1';
      case 'scenario': return 'Scenario Practice';
      case 'recognition': return 'Recognition Given';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div
        className="text-white p-6"
        style={{
          background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`
        }}
      >
        <div className="flex items-center mb-4">
          <GraduationCap size={32} className="mr-3" />
          <div>
            <h1 className="text-2xl font-bold">ChiliHead Hospitality Coaching Tools</h1>
            <p className="text-yellow-100">Develop Excellence Through Consistent Coaching</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {!loading && coachingMetrics && (
        <div className="bg-white border-b p-4">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center">
              <TrendingUp size={20} style={{ color: colors.chiliGreen }} className="mr-2" />
              <span className="text-sm" style={{ color: colors.chiliBrown }}>
                This Week: {coachingMetrics.total_observations + coachingMetrics.total_one_on_ones} Coaching Activities
              </span>
            </div>
            <div className="flex items-center">
              <Users size={20} style={{ color: colors.chiliNavy }} className="mr-2" />
              <span className="text-sm" style={{ color: colors.chiliBrown }}>
                {coachingMetrics.team_members_coached} Team Members Coached
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => (
            <div
              key={tool.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate(tool.route)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div style={{ color: tool.color }}>
                    {tool.icon}
                  </div>
                  {tool.stats !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: tool.color }}>
                        {tool.stats}
                      </div>
                      <div className="text-xs" style={{ color: colors.chiliGray }}>
                        {tool.statsLabel}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-2" style={{ color: colors.chiliNavy }}>
                  {tool.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: colors.chiliBrown }}>
                  {tool.description}
                </p>

                <div className="flex items-center justify-end">
                  <span className="text-sm mr-1" style={{ color: tool.color }}>
                    Open
                  </span>
                  <ChevronRight size={16} style={{ color: tool.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="mx-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
              Recent Coaching Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="mr-3" style={{ color: colors.chiliNavy }}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm" style={{ color: colors.chiliNavy }}>
                        {getActivityLabel(activity.activity_type)}
                      </span>
                      <span className="text-xs" style={{ color: colors.chiliGray }}>
                        {format(new Date(activity.activity_date), 'MMM d')}
                      </span>
                    </div>
                    {activity.team_member && (
                      <span className="text-xs" style={{ color: colors.chiliBrown }}>
                        {activity.team_member.name} - {activity.team_member.position}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/coaching/analytics')}
              className="mt-4 w-full py-2 text-center text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: colors.chiliNavy,
                color: 'white'
              }}
            >
              View All Activity
            </button>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mx-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-3" style={{ color: colors.chiliNavy }}>
            Daily Coaching Focus
          </h3>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="mr-2" style={{ color: colors.chiliRed }}>•</span>
              <span className="text-sm" style={{ color: colors.chiliBrown }}>
                Catch someone doing something right - document it!
              </span>
            </div>
            <div className="flex items-start">
              <span className="mr-2" style={{ color: colors.chiliRed }}>•</span>
              <span className="text-sm" style={{ color: colors.chiliBrown }}>
                One coaching conversation per shift minimum
              </span>
            </div>
            <div className="flex items-start">
              <span className="mr-2" style={{ color: colors.chiliRed }}>•</span>
              <span className="text-sm" style={{ color: colors.chiliBrown }}>
                Follow up on yesterday's coaching priorities
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingDashboard;