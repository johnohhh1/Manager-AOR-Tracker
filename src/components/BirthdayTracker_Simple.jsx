import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cake, Calendar, Gift, Phone, Mail, Download, Search } from 'lucide-react';
import { supabase } from '../supabase';
import { colors, styles, radius, spacing, shadows } from '../styles/design-system';
import * as XLSX from 'xlsx';

const BirthdayTracker = ({ manager }) => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All');
  const [viewMode, setViewMode] = useState('upcoming');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const positions = ['All', 'Server', 'Host', 'Runner', 'Busser', 'Bartender', 'To-Go', 'QA', 'Kitchen', 'Dishwasher', 'Shift Leader', 'Manager'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeamMembers((data || []).filter(m => m.date_of_birth)); // Only show members with birthdays
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Parse month/day from --MM-DD format (no year for privacy)
  const parseMonthDay = (dateOfBirth) => {
    if (!dateOfBirth || !dateOfBirth.startsWith('--')) return null;
    const [_, month, day] = dateOfBirth.split('-');
    return { month: parseInt(month) - 1, day: parseInt(day) };
  };

  // Calculate days until next birthday (month/day only)
  const getDaysUntilBirthday = (dateOfBirth) => {
    const parsed = parseMonthDay(dateOfBirth);
    if (!parsed) return null;

    const today = new Date();
    const thisYearBirthday = new Date(today.getFullYear(), parsed.month, parsed.day);

    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = thisYearBirthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get urgency color
  const getUrgencyColor = (daysUntil) => {
    if (daysUntil === 0) return colors.chiliRed;
    if (daysUntil <= 7) return colors.chiliYellow;
    if (daysUntil <= 30) return colors.chiliGreen;
    return colors.chiliGray;
  };

  // Get urgency label
  const getUrgencyLabel = (daysUntil) => {
    if (daysUntil === 0) return '🎉 TODAY!';
    if (daysUntil === 1) return '🎂 Tomorrow';
    if (daysUntil <= 7) return `This Week (${daysUntil}d)`;
    if (daysUntil <= 30) return `This Month (${daysUntil}d)`;
    return `${daysUntil} days`;
  };

  // Filter and sort members
  const getFilteredMembers = () => {
    return teamMembers
      .filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPosition = filterPosition === 'All' || member.position === filterPosition;

        if (viewMode === 'calendar') {
          const parsed = parseMonthDay(member.date_of_birth);
          return matchesSearch && matchesPosition && parsed && parsed.month === selectedMonth;
        }

        if (viewMode === 'upcoming') {
          const daysUntil = getDaysUntilBirthday(member.date_of_birth);
          return matchesSearch && matchesPosition && daysUntil <= 60; // Next 60 days
        }

        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        const daysA = getDaysUntilBirthday(a.date_of_birth);
        const daysB = getDaysUntilBirthday(b.date_of_birth);
        return daysA - daysB;
      });
  };

  // Get birthday stats
  const getBirthdayStats = () => {
    const today = teamMembers.filter(m => getDaysUntilBirthday(m.date_of_birth) === 0).length;
    const thisWeek = teamMembers.filter(m => {
      const days = getDaysUntilBirthday(m.date_of_birth);
      return days > 0 && days <= 7;
    }).length;
    const thisMonth = teamMembers.filter(m => {
      const days = getDaysUntilBirthday(m.date_of_birth);
      return days > 0 && days <= 30;
    }).length;
    const total = teamMembers.length;

    return { today, thisWeek, thisMonth, total };
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = getFilteredMembers().map(member => {
      const parsed = parseMonthDay(member.date_of_birth);
      return {
        Name: member.name,
        Position: member.position,
        Birthday: parsed ? `${months[parsed.month]} ${parsed.day}` : 'N/A',
        'Days Until': getDaysUntilBirthday(member.date_of_birth),
        Phone: member.phone,
        Email: member.email
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Birthdays');
    XLSX.writeFile(wb, `Team-Birthdays-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const stats = getBirthdayStats();
  const filteredMembers = getFilteredMembers();

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.bgDark} 0%, ${colors.bgDarkAlt} 100%)`,
      padding: spacing.lg
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ ...styles.header }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold mb-1">🎂 Birthday Tracker</h1>
                <p className="text-yellow-100">Celebrate Your Team!</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
              style={{
                background: `linear-gradient(135deg, ${colors.chiliGreen} 0%, ${colors.chiliGreenBright} 100%)`,
                color: 'white',
                boxShadow: shadows.green
              }}
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div style={{
            ...styles.card,
            borderLeft: `4px solid ${colors.chiliRed}`,
            textAlign: 'center'
          }}>
            <div className="text-4xl font-bold mb-1" style={{ color: colors.chiliRed }}>
              {stats.today}
            </div>
            <div className="text-sm font-medium" style={{ color: colors.textMuted }}>
              🎉 Today
            </div>
          </div>

          <div style={{
            ...styles.card,
            borderLeft: `4px solid ${colors.chiliYellow}`,
            textAlign: 'center'
          }}>
            <div className="text-4xl font-bold mb-1" style={{ color: colors.chiliYellow }}>
              {stats.thisWeek}
            </div>
            <div className="text-sm font-medium" style={{ color: colors.textMuted }}>
              📅 This Week
            </div>
          </div>

          <div style={{
            ...styles.card,
            borderLeft: `4px solid ${colors.chiliGreen}`,
            textAlign: 'center'
          }}>
            <div className="text-4xl font-bold mb-1" style={{ color: colors.chiliGreen }}>
              {stats.thisMonth}
            </div>
            <div className="text-sm font-medium" style={{ color: colors.textMuted }}>
              🎂 This Month
            </div>
          </div>

          <div style={{
            ...styles.card,
            borderLeft: `4px solid ${colors.textLight}`,
            textAlign: 'center'
          }}>
            <div className="text-4xl font-bold mb-1" style={{ color: colors.textLight }}>
              {stats.total}
            </div>
            <div className="text-sm font-medium" style={{ color: colors.textMuted }}>
              👥 Total Team
            </div>
          </div>
        </div>

        {/* View Mode & Filters */}
        <div style={{ ...styles.card, marginBottom: spacing.lg }}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* View Mode Tabs */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setViewMode('upcoming')}
                style={viewMode === 'upcoming' ? styles.pillActive : styles.pillInactive}
                className="cursor-pointer"
              >
                <Gift size={16} className="inline mr-1" />
                Upcoming
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                style={viewMode === 'calendar' ? styles.pillActive : styles.pillInactive}
                className="cursor-pointer"
              >
                <Calendar size={16} className="inline mr-1" />
                By Month
              </button>
              <button
                onClick={() => setViewMode('all')}
                style={viewMode === 'all' ? styles.pillActive : styles.pillInactive}
                className="cursor-pointer"
              >
                <Cake size={16} className="inline mr-1" />
                All Birthdays
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.textMuted
                }} />
                <input
                  type="text"
                  placeholder="Search names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    ...styles.input,
                    paddingLeft: '40px',
                    minWidth: '200px',
                    backgroundColor: colors.whiteAlpha(0.1),
                    border: `2px solid ${colors.whiteAlpha(0.2)}`,
                    color: colors.textLight
                  }}
                />
              </div>

              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                style={{
                  ...styles.input,
                  minWidth: '150px',
                  backgroundColor: colors.whiteAlpha(0.1),
                  border: `2px solid ${colors.whiteAlpha(0.2)}`,
                  color: colors.textLight
                }}
              >
                {positions.map(pos => (
                  <option key={pos} value={pos} style={{ backgroundColor: colors.chiliNavy }}>
                    {pos}
                  </option>
                ))}
              </select>

              {viewMode === 'calendar' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  style={{
                    ...styles.input,
                    minWidth: '150px',
                    backgroundColor: colors.whiteAlpha(0.1),
                    border: `2px solid ${colors.whiteAlpha(0.2)}`,
                    color: colors.textLight
                  }}
                >
                  {months.map((month, idx) => (
                    <option key={idx} value={idx} style={{ backgroundColor: colors.chiliNavy }}>
                      {month}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Birthday Cards */}
        {loading ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px' }}>
            <div className="text-xl" style={{ color: colors.textMuted }}>
              Loading birthdays...
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px' }}>
            <Cake size={64} style={{ color: colors.textMuted, margin: '0 auto 20px' }} />
            <div className="text-xl font-bold mb-2" style={{ color: colors.textLight }}>
              No Birthdays Found
            </div>
            <div style={{ color: colors.textMuted }}>
              {viewMode === 'upcoming' ? 'No birthdays in the next 60 days' : 'Try adjusting your filters'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const daysUntil = getDaysUntilBirthday(member.date_of_birth);
              const urgencyColor = getUrgencyColor(daysUntil);
              const urgencyLabel = getUrgencyLabel(daysUntil);
              const parsed = parseMonthDay(member.date_of_birth);

              return (
                <div
                  key={member.id}
                  style={{
                    ...styles.card,
                    borderLeft: `4px solid ${urgencyColor}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Urgency Badge */}
                  {daysUntil <= 7 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: `${spacing.xs} ${spacing.md}`,
                      borderRadius: radius.full,
                      backgroundColor: urgencyColor,
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      boxShadow: shadows.md
                    }}>
                      {urgencyLabel}
                    </div>
                  )}

                  {/* Member Info */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cake size={20} style={{ color: urgencyColor }} />
                        <h3 className="text-lg font-bold" style={{ color: colors.textLight }}>
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span style={{
                        padding: `${spacing.xs} ${spacing.md}`,
                        borderRadius: radius.full,
                        backgroundColor: colors.chiliGreen,
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {member.position}
                      </span>
                    </div>

                    {/* Birthday Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2" style={{ color: colors.textMuted }}>
                        <Calendar size={16} />
                        <span className="text-sm">
                          {parsed ? `${months[parsed.month]} ${parsed.day}` : 'N/A'}
                        </span>
                      </div>
                      {daysUntil > 7 && (
                        <div className="flex items-center gap-2" style={{ color: colors.textMuted }}>
                          <Gift size={16} />
                          <span className="text-sm">{urgencyLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2">
                      {member.phone && member.phone !== '-' && (
                        <a
                          href={`tel:${member.phone}`}
                          style={{
                            ...styles.buttonGhost,
                            padding: `${spacing.sm} ${spacing.md}`,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                            textDecoration: 'none',
                            flex: 1,
                            justifyContent: 'center'
                          }}
                        >
                          <Phone size={14} />
                          Call
                        </a>
                      )}
                      {member.email && member.email !== '-' && (
                        <a
                          href={`mailto:${member.email}`}
                          style={{
                            ...styles.buttonGhost,
                            padding: `${spacing.sm} ${spacing.md}`,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                            textDecoration: 'none',
                            flex: 1,
                            justifyContent: 'center'
                          }}
                        >
                          <Mail size={14} />
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayTracker;
