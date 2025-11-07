import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  Calendar,
  Search,
  ChevronRight,
  ChevronLeft,
  User,
  Clock,
  Star,
  Target,
  TrendingUp,
  Filter
} from 'lucide-react';
import { format, subDays, isThisWeek } from 'date-fns';
import { useCoaching } from '../../../hooks/useCoaching';

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

const OneOnOneList = ({ manager }) => {
  const navigate = useNavigate();
  const coaching = useCoaching();
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'team'
  const [oneOnOnes, setOneOnOnes] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredOneOnOnes, setFilteredOneOnOnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [stats, setStats] = useState({
    thisWeek: 0,
    overdue: 0,
    totalTeam: 0,
    averageRating: 0
  });

  useEffect(() => {
    loadData();
  }, [manager, activeTab]);

  useEffect(() => {
    filterAndSearch();
  }, [oneOnOnes, searchTerm, filterPosition]);

  const loadData = async () => {
    if (!manager) return;

    setLoading(true);
    try {
      // Load team members
      const { data: teamData } = manager.isGM
        ? await coaching.teamMembers.getAll()
        : await coaching.teamMembers.getByManagerId(manager.name);

      if (teamData) {
        setTeamMembers(teamData);
        calculateStats(teamData);
      }

      // Load 1:1s
      const { data: oneOnOneData } = await coaching.oneOnOnes.getForManager(manager.name);
      if (oneOnOneData) {
        // Filter based on active tab
        if (activeTab === 'my') {
          setOneOnOnes(oneOnOneData.filter(o => o.manager_id === manager.name));
        } else {
          setOneOnOnes(oneOnOneData); // All visible 1:1s
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = [...oneOnOnes];

    // Apply position filter
    if (filterPosition !== 'all') {
      filtered = filtered.filter(o =>
        teamMembers.find(tm => tm.id === o.team_member_id)?.position === filterPosition
      );
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(o => {
        const teamMember = teamMembers.find(tm => tm.id === o.team_member_id);
        return teamMember?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               o.focus_behavior?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredOneOnOnes(filtered);
  };

  const calculateStats = (teamData) => {
    const thisWeekCount = oneOnOnes.filter(o => isThisWeek(new Date(o.meeting_date))).length;

    // Calculate overdue (team members without 1:1 in last 7 days)
    const overdueCount = teamData.filter(tm => {
      const lastMeeting = oneOnOnes
        .filter(o => o.team_member_id === tm.id)
        .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date))[0];

      if (!lastMeeting) return true;
      const daysSince = Math.floor((new Date() - new Date(lastMeeting.meeting_date)) / (1000 * 60 * 60 * 24));
      return daysSince > 7;
    }).length;

    // Calculate average behavior rating
    let totalRatings = 0;
    let ratingCount = 0;
    oneOnOnes.forEach(o => {
      if (o.behavior_ratings) {
        Object.values(o.behavior_ratings).forEach(rating => {
          if (typeof rating === 'number') {
            totalRatings += rating;
            ratingCount++;
          }
        });
      }
    });

    setStats({
      thisWeek: thisWeekCount,
      overdue: overdueCount,
      totalTeam: teamData.length,
      averageRating: ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : 0
    });
  };

  const getPositions = () => {
    const positions = new Set();
    teamMembers.forEach(tm => positions.add(tm.position));
    return Array.from(positions);
  };

  const getLastMeetingInfo = (teamMemberId) => {
    const meetings = oneOnOnes
      .filter(o => o.team_member_id === teamMemberId)
      .sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));

    if (meetings.length === 0) return null;

    const lastMeeting = meetings[0];
    const daysSince = Math.floor((new Date() - new Date(lastMeeting.meeting_date)) / (1000 * 60 * 60 * 24));

    return {
      date: lastMeeting.meeting_date,
      daysSince,
      isOverdue: daysSince > 7
    };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/coaching')}
              className="mr-4 hover:opacity-70 transition-opacity"
            >
              <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                Weekly 1:1s
              </h1>
              <p className="text-sm" style={{ color: colors.chiliBrown }}>
                Team member development conversations
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/coaching/1on1s/new')}
            className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            style={{ backgroundColor: colors.chiliGreen }}
          >
            <Plus size={20} className="mr-2" />
            New 1:1
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div className="bg-white border-b p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliGreen }}>
                {stats.thisWeek}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                This Week
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: stats.overdue > 0 ? colors.chiliRed : colors.chiliGreen }}>
                {stats.overdue}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Overdue
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
                {stats.totalTeam}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Team Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliYellow }}>
                {stats.averageRating}
              </div>
              <div className="text-xs" style={{ color: colors.chiliBrown }}>
                Avg Rating
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="bg-white border-b p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'my'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeTab === 'my' ? { backgroundColor: colors.chiliNavy } : {}}
          >
            My 1:1s
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'team'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeTab === 'team' ? { backgroundColor: colors.chiliNavy } : {}}
          >
            Team 1:1s (All Visible)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-wrap gap-4">
          {/* Position Filter */}
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All Positions</option>
            {getPositions().map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.chiliGray }} />
            <input
              type="text"
              placeholder="Search team members or development focuses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-1 border rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg" style={{ color: colors.chiliBrown }}>
              Loading 1:1s...
            </div>
          </div>
        ) : (
          <>
            {/* Team Members Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3" style={{ color: colors.chiliNavy }}>
                Team Members
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamMembers.map(member => {
                  const lastMeeting = getLastMeetingInfo(member.id);
                  return (
                    <div
                      key={member.id}
                      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/coaching/1on1s/new?teamMemberId=${member.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold" style={{ color: colors.chiliNavy }}>
                            {member.name}
                          </h4>
                          <p className="text-sm" style={{ color: colors.chiliBrown }}>
                            {member.position}
                          </p>
                        </div>
                        {lastMeeting && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white`}
                            style={{
                              backgroundColor: lastMeeting.isOverdue ? colors.chiliRed : colors.chiliGreen
                            }}
                          >
                            {lastMeeting.daysSince}d ago
                          </div>
                        )}
                      </div>

                      {lastMeeting ? (
                        <p className="text-xs" style={{ color: colors.chiliGray }}>
                          Last 1:1: {format(new Date(lastMeeting.date), 'MMM d')}
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: colors.chiliRed }}>
                          No 1:1 recorded
                        </p>
                      )}

                      <button
                        className="mt-3 w-full py-1 text-xs font-medium rounded border hover:bg-gray-50"
                        style={{ borderColor: colors.chiliNavy, color: colors.chiliNavy }}
                      >
                        Schedule 1:1
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent 1:1s List */}
            {filteredOneOnOnes.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: colors.chiliNavy }}>
                  Recent 1:1s
                </h3>
                <div className="space-y-3">
                  {filteredOneOnOnes.map(oneOnOne => {
                    const teamMember = teamMembers.find(tm => tm.id === oneOnOne.team_member_id);
                    return (
                      <div
                        key={oneOnOne.id}
                        className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/coaching/1on1s/${oneOnOne.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold" style={{ color: colors.chiliNavy }}>
                                {teamMember?.name || 'Unknown'}
                              </h4>
                              {activeTab === 'team' && oneOnOne.manager_id !== manager.name && (
                                <span className="text-xs px-2 py-1 rounded-full" style={{
                                  backgroundColor: '#f8f9fa',
                                  color: colors.chiliBrown
                                }}>
                                  by {oneOnOne.manager_name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: colors.chiliBrown }}>
                              {format(new Date(oneOnOne.meeting_date), 'EEEE, MMM d')} • {teamMember?.position}
                            </p>
                          </div>

                          {oneOnOne.behavior_ratings && (
                            <div className="text-center">
                              <div className="text-lg font-bold" style={{ color: colors.chiliYellow }}>
                                {Object.values(oneOnOne.behavior_ratings).reduce((acc, val) =>
                                  typeof val === 'number' ? acc + val : acc, 0
                                ) / Object.values(oneOnOne.behavior_ratings).filter(val =>
                                  typeof val === 'number'
                                ).length || 0}
                              </div>
                              <div className="text-xs" style={{ color: colors.chiliGray }}>
                                Avg Rating
                              </div>
                            </div>
                          )}
                        </div>

                        {oneOnOne.focus_behavior && (
                          <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <p className="text-xs font-medium" style={{ color: colors.chiliNavy }}>
                              Development Focus:
                            </p>
                            <p className="text-sm" style={{ color: colors.chiliBrown }}>
                              {oneOnOne.focus_behavior}
                            </p>
                          </div>
                        )}

                        {oneOnOne.wins && oneOnOne.wins.length > 0 && (
                          <div className="mt-2 flex items-center">
                            <Star size={16} className="mr-1" style={{ color: colors.chiliYellow }} />
                            <span className="text-xs" style={{ color: colors.chiliBrown }}>
                              {oneOnOne.wins.length} wins recognized
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredOneOnOnes.length === 0 && !loading && (
              <div className="bg-white rounded-lg p-8 text-center">
                <Users size={48} className="mx-auto mb-4" style={{ color: colors.chiliGray }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.chiliNavy }}>
                  No 1:1s Found
                </h3>
                <p className="text-sm mb-4" style={{ color: colors.chiliBrown }}>
                  {teamMembers.length === 0
                    ? 'Add team members to start scheduling 1:1s'
                    : 'Schedule your first 1:1 with a team member'}
                </p>
                <button
                  onClick={() => navigate('/coaching/1on1s/new')}
                  className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.chiliGreen }}
                >
                  {teamMembers.length === 0 ? 'Add Team Member' : 'Schedule 1:1'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OneOnOneList;