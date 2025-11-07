import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Award, Calendar, BarChart3 } from 'lucide-react';
import { useCoaching } from '../../hooks/useCoaching';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliGray: 'rgb(161, 159, 154)'
};

const Analytics = ({ manager }) => {
  const navigate = useNavigate();
  const { oneOnOnes, floorObservations, activity } = useCoaching();

  const [dateRange, setDateRange] = useState('week');
  const [stats, setStats] = useState({
    observations: 0,
    oneOnOnes: 0,
    teamMembersCoached: 0,
    recognitions: 0,
    coachingPriorities: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, manager]);

  const getDateRange = () => {
    const today = new Date();
    switch (dateRange) {
      case 'week':
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case 'month':
        return { start: subDays(today, 30), end: today };
      case 'quarter':
        return { start: subDays(today, 90), end: today };
      default:
        return { start: startOfWeek(today), end: endOfWeek(today) };
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();

      // Load observations
      const obsData = await floorObservations.getList({
        manager_id: manager.id,
        start_date: format(start, 'yyyy-MM-dd'),
        end_date: format(end, 'yyyy-MM-dd')
      });

      // Load 1:1s
      const oneOnOneData = await oneOnOnes.getList({
        manager_id: manager.id,
        start_date: format(start, 'yyyy-MM-dd'),
        end_date: format(end, 'yyyy-MM-dd')
      });

      // Calculate stats
      const uniqueTeamMembers = new Set();
      let recognitionsCount = 0;
      let prioritiesCount = 0;

      (obsData || []).forEach(obs => {
        if (obs.top_performer) recognitionsCount++;
        if (obs.coaching_priorities) prioritiesCount += (obs.coaching_priorities.length || 0);
      });

      (oneOnOneData || []).forEach(meeting => {
        uniqueTeamMembers.add(meeting.team_member_id);
        if (meeting.manager_recognition) recognitionsCount += (meeting.manager_recognition.length || 0);
      });

      setStats({
        observations: (obsData || []).length,
        oneOnOnes: (oneOnOneData || []).length,
        teamMembersCoached: uniqueTeamMembers.size,
        recognitions: recognitionsCount,
        coachingPriorities: prioritiesCount
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: BarChart3, label: 'Floor Observations', value: stats.observations, color: colors.chiliRed },
    { icon: Users, label: 'Weekly 1:1s', value: stats.oneOnOnes, color: colors.chiliNavy },
    { icon: Users, label: 'Team Members Coached', value: stats.teamMembersCoached, color: colors.chiliGreen },
    { icon: Award, label: 'Recognitions Given', value: stats.recognitions, color: colors.chiliYellow },
    { icon: TrendingUp, label: 'Coaching Priorities', value: stats.coachingPriorities, color: colors.chiliRed }
  ];

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
            Coaching Analytics
          </h1>

          <div style={{ width: '120px' }}></div>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2 mb-6">
          {['week', 'month', 'quarter'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: dateRange === range ? colors.chiliRed : 'white',
                color: dateRange === range ? 'white' : colors.chiliNavy,
                border: `2px solid ${dateRange === range ? colors.chiliRed : colors.chiliGray}`
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p style={{ color: colors.chiliGray }}>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={28} style={{ color: card.color }} />
                      <div
                        className="text-3xl font-bold"
                        style={{ color: card.color }}
                      >
                        {card.value}
                      </div>
                    </div>
                    <div className="text-sm font-medium" style={{ color: colors.chiliGray }}>
                      {card.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Manager Performance */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliNavy }}>
                <TrendingUp size={24} />
                Manager Performance
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium" style={{ color: colors.chiliNavy }}>Floor Observations</span>
                    <span style={{ color: colors.chiliGray }}>
                      {stats.observations} / {dateRange === 'week' ? '5' : dateRange === 'month' ? '20' : '60'} target
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${Math.min(100, (stats.observations / (dateRange === 'week' ? 5 : dateRange === 'month' ? 20 : 60)) * 100)}%`,
                        backgroundColor: colors.chiliGreen
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium" style={{ color: colors.chiliNavy }}>Weekly 1:1s</span>
                    <span style={{ color: colors.chiliGray }}>
                      {stats.oneOnOnes} / {dateRange === 'week' ? '3' : dateRange === 'month' ? '12' : '36'} target
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${Math.min(100, (stats.oneOnOnes / (dateRange === 'week' ? 3 : dateRange === 'month' ? 12 : 36)) * 100)}%`,
                        backgroundColor: colors.chiliNavy
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium" style={{ color: colors.chiliNavy }}>Team Recognition</span>
                    <span style={{ color: colors.chiliGray }}>
                      {stats.recognitions} given
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${Math.min(100, (stats.recognitions / (dateRange === 'week' ? 10 : dateRange === 'month' ? 40 : 120)) * 100)}%`,
                        backgroundColor: colors.chiliYellow
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.chiliNavy }}>
                <Calendar size={24} />
                Insights & Recommendations
              </h2>

              <div className="space-y-4">
                {stats.observations === 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.chiliCream }}>
                    <span style={{ color: colors.chiliRed }}>📊</span>
                    <div>
                      <p className="font-semibold" style={{ color: colors.chiliNavy }}>No Floor Observations Yet</p>
                      <p className="text-sm" style={{ color: colors.chiliGray }}>
                        Start documenting your daily observations to track team behaviors and coaching opportunities.
                      </p>
                    </div>
                  </div>
                )}

                {stats.oneOnOnes === 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.chiliCream }}>
                    <span style={{ color: colors.chiliNavy }}>👥</span>
                    <div>
                      <p className="font-semibold" style={{ color: colors.chiliNavy }}>Schedule Weekly 1:1s</p>
                      <p className="text-sm" style={{ color: colors.chiliGray }}>
                        Regular 1:1 meetings help build relationships and drive individual development.
                      </p>
                    </div>
                  </div>
                )}

                {stats.recognitions > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.chiliCream }}>
                    <span style={{ color: colors.chiliGreen }}>🔥</span>
                    <div>
                      <p className="font-semibold" style={{ color: colors.chiliNavy }}>Great Recognition!</p>
                      <p className="text-sm" style={{ color: colors.chiliGray }}>
                        You've given {stats.recognitions} recognition{stats.recognitions !== 1 ? 's' : ''} this {dateRange}. Keep celebrating wins!
                      </p>
                    </div>
                  </div>
                )}

                {stats.coachingPriorities > 5 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.chiliCream }}>
                    <span style={{ color: colors.chiliYellow }}>⚠️</span>
                    <div>
                      <p className="font-semibold" style={{ color: colors.chiliNavy }}>Multiple Coaching Priorities</p>
                      <p className="text-sm" style={{ color: colors.chiliGray }}>
                        You have {stats.coachingPriorities} open coaching priorities. Focus on 1-2 behaviors per team member for best results.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
