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
  Filter,
  X
} from 'lucide-react';
import { format, subDays, isThisWeek } from 'date-fns';
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
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
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
      // Load team members from the new team_members table
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (teamError) {
        console.error('Error loading team members:', teamError);
      } else if (teamData) {
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
    <>
      <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
      <div className="min-h-screen" style={{ backgroundColor: colors.chiliNavy }}>
      {/* Team Member Selection Modal */}
      {showTeamMemberModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: colors.chiliNavy,
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: `3px solid ${colors.chiliGreen}`
          }}>
            <div style={{
              padding: '20px',
              borderBottom: `2px solid ${colors.chiliGreen}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                Select Team Member
              </h2>
              <button
                onClick={() => setShowTeamMemberModal(false)}
                style={{ color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {teamMembers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                    No team members found. Please add team members first.
                  </p>
                  <button
                    onClick={() => {
                      setShowTeamMemberModal(false);
                      navigate('/team');
                    }}
                    style={{
                      backgroundColor: colors.chiliGreen,
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Team Management
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {teamMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setShowTeamMemberModal(false);
                        navigate(`/coaching/1on1s/new?teamMemberId=${member.id}&teamMemberName=${encodeURIComponent(member.name)}&position=${encodeURIComponent(member.position)}`);
                      }}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: `2px solid rgba(255,255,255,0.2)`,
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.borderColor = colors.chiliGreen;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                            {member.name}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                            {member.position}
                          </div>
                        </div>
                        <ChevronRight size={20} style={{ color: colors.chiliGreen }} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="shadow-sm p-4" style={{
        background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/coaching')}
              className="bg-white bg-opacity-20 p-2 rounded-md mr-3 hover:bg-opacity-30 transition-all cursor-pointer"
            >
              <ChevronLeft size={20} style={{ color: 'white' }} />
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'white' }}>
                Weekly 1:1s
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Team member development conversations
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTeamMemberModal(true)}
            className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            style={{ backgroundColor: colors.chiliGreen }}
          >
            <Plus size={20} className="mr-2" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div className="p-4" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliGreen }}>
                {stats.thisWeek}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                This Week
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: stats.overdue > 0 ? colors.chiliRed : colors.chiliGreen }}>
                {stats.overdue}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Overdue
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
                {stats.totalTeam}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Team Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors.chiliYellow }}>
                {stats.averageRating}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg Rating
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="p-4" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('my')}
            className="px-4 py-2 rounded-md font-medium transition-all"
            style={activeTab === 'my'
              ? { backgroundColor: colors.chiliRed, color: 'white' }
              : { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)' }
            }
          >
            My 1:1s
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className="px-4 py-2 rounded-md font-medium transition-all"
            style={activeTab === 'team'
              ? { backgroundColor: colors.chiliRed, color: 'white' }
              : { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)' }
            }
          >
            Team 1:1s (All Visible)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="flex flex-wrap gap-4">
          {/* Position Filter */}
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-1 rounded-md text-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            <option value="all" style={{ backgroundColor: colors.chiliNavy }}>All Positions</option>
            {getPositions().map(pos => (
              <option key={pos} value={pos} style={{ backgroundColor: colors.chiliNavy }}>{pos}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
            <input
              type="text"
              placeholder="Search team members or development focuses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-1 rounded-md text-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading 1:1s...
            </div>
          </div>
        ) : (
          <>
            {/* Team Members Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                Team Members
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamMembers.map(member => {
                  const lastMeeting = getLastMeetingInfo(member.id);
                  return (
                    <div
                      key={member.id}
                      className="rounded-lg p-4 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onClick={() => navigate(`/coaching/1on1s/new?teamMemberId=${member.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold" style={{ color: 'white' }}>
                            {member.name}
                          </h4>
                          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
                        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Last 1:1: {format(new Date(lastMeeting.date), 'MMM d')}
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: colors.chiliRed }}>
                          No 1:1 recorded
                        </p>
                      )}

                      <button
                        className="mt-3 w-full py-1 text-xs font-medium rounded border transition-colors"
                        style={{
                          borderColor: colors.chiliGreen,
                          color: colors.chiliGreen,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.chiliGreen;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.chiliGreen;
                        }}
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
                <h3 className="text-lg font-bold mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Recent 1:1s
                </h3>
                <div className="space-y-3">
                  {filteredOneOnOnes.map(oneOnOne => {
                    const teamMember = teamMembers.find(tm => tm.id === oneOnOne.team_member_id);
                    return (
                      <div
                        key={oneOnOne.id}
                        className="rounded-lg p-4 transition-all cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={() => navigate(`/coaching/1on1s/${oneOnOne.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold" style={{ color: 'white' }}>
                                {teamMember?.name || 'Unknown'}
                              </h4>
                              {activeTab === 'team' && oneOnOne.manager_id !== manager.name && (
                                <span className="text-xs px-2 py-1 rounded-full" style={{
                                  backgroundColor: colors.chiliNavy,
                                  color: 'white'
                                }}>
                                  by {oneOnOne.manager_name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
                              <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Avg Rating
                              </div>
                            </div>
                          )}
                        </div>

                        {oneOnOne.focus_behavior && (
                          <div className="mt-3 p-2 rounded" style={{ backgroundColor: colors.chiliRed }}>
                            <p className="text-xs font-medium" style={{ color: 'white' }}>
                              Development Focus:
                            </p>
                            <p className="text-sm" style={{ color: 'white' }}>
                              {oneOnOne.focus_behavior}
                            </p>
                          </div>
                        )}

                        {oneOnOne.wins && oneOnOne.wins.length > 0 && (
                          <div className="mt-2 flex items-center">
                            <Star size={16} className="mr-1" style={{ color: colors.chiliYellow }} />
                            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
              <div className="rounded-lg p-8 text-center" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <Users size={48} className="mx-auto mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: 'white' }}>
                  No 1:1s Found
                </h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
    </>
  );
};

export default OneOnOneList;