import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cake, Calendar, Gift, Phone, Mail, Download, Search, Sparkles, PartyPopper } from 'lucide-react';
import { supabase } from '../supabase';
import { colors, styles, radius, spacing, shadows } from '../styles/design-system';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiBoom from 'react-confetti-boom';

const BirthdayTrackerCool = ({ manager }) => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All');
  const [viewMode, setViewMode] = useState('upcoming');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [celebrateMode, setCelebrateMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

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
      setTeamMembers((data || []).filter(m => m.date_of_birth));
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const parseMonthDay = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    // Handle both formats: '--MM-DD' (month-day only) and 'YYYY-MM-DD' (full date)
    if (dateOfBirth.startsWith('--')) {
      // Month-day format: '--02-04'
      const parts = dateOfBirth.split('-'); // ['', '', '02', '04']
      const month = parseInt(parts[2]) - 1; // Month is 0-indexed
      const day = parseInt(parts[3]);
      return { month, day };
    } else if (dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Full date format: '2004-02-04'
      const parts = dateOfBirth.split('-'); // ['2004', '02', '04']
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const day = parseInt(parts[2]);
      return { month, day };
    }

    return null;
  };

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

  const getUrgencyColor = (daysUntil) => {
    if (daysUntil === 0) return colors.chiliRed;
    if (daysUntil <= 7) return colors.chiliYellow;
    if (daysUntil <= 30) return colors.chiliGreen;
    return colors.chiliGray;
  };

  const getUrgencyLabel = (daysUntil) => {
    if (daysUntil === 0) return '🎉 TODAY!';
    if (daysUntil === 1) return '🎂 Tomorrow';
    if (daysUntil <= 7) return `This Week (${daysUntil}d)`;
    if (daysUntil <= 30) return `This Month (${daysUntil}d)`;
    return `${daysUntil} days`;
  };

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
          return matchesSearch && matchesPosition && daysUntil <= 60;
        }

        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        const daysA = getDaysUntilBirthday(a.date_of_birth);
        const daysB = getDaysUntilBirthday(b.date_of_birth);
        return daysA - daysB;
      });
  };

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
  const hasTodayBirthdays = stats.today > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.bgDark} 0%, ${colors.bgDarkAlt} 100%)`,
      padding: spacing.lg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: `rgba(${237 + Math.random() * 18}, ${28 + Math.random() * 170}, ${36 + Math.random() * 219}, ${0.1 + Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Confetti for today's birthdays */}
      {hasTodayBirthdays && celebrateMode && (
        <ConfettiBoom
          particleCount={200}
          effectCount={3}
          colors={[colors.chiliRed, colors.chiliYellow, colors.chiliGreen, '#FFD700']}
          shapeSize={12}
          effectInterval={2000}
          mode="boom"
        />
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ ...styles.header }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/dashboard')}
                className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <motion.h1
                  className="text-3xl font-bold mb-1"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎂 Birthday Tracker
                </motion.h1>
                <p className="text-yellow-100">Celebrate Your Team!</p>
              </div>
            </div>
            <div className="flex gap-2">
              {hasTodayBirthdays && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCelebrateMode(!celebrateMode)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                  style={{
                    background: celebrateMode
                      ? `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliYellow} 100%)`
                      : `linear-gradient(135deg, ${colors.chiliYellow} 0%, ${colors.chiliGreen} 100%)`,
                    color: 'white',
                    boxShadow: celebrateMode ? shadows.red : shadows.green
                  }}
                  animate={{
                    boxShadow: celebrateMode
                      ? ['0 0 20px rgba(237, 28, 36, 0.5)', '0 0 40px rgba(237, 28, 36, 0.8)', '0 0 20px rgba(237, 28, 36, 0.5)']
                      : shadows.green
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <PartyPopper size={20} />
                  {celebrateMode ? 'CELEBRATING!' : 'Celebrate'}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Animated Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '🎉 Today', value: stats.today, color: colors.chiliRed, delay: 0 },
            { label: '📅 This Week', value: stats.thisWeek, color: colors.chiliYellow, delay: 0.1 },
            { label: '🎂 This Month', value: stats.thisMonth, color: colors.chiliGreen, delay: 0.2 },
            { label: '👥 Total Team', value: stats.total, color: colors.textLight, delay: 0.3 }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay, type: 'spring' }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 10px 40px ${stat.color}40`,
                y: -5
              }}
              style={{
                ...styles.card,
                borderLeft: `4px solid ${stat.color}`,
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <motion.div
                className="text-4xl font-bold mb-1"
                style={{ color: stat.color }}
                animate={stat.value > 0 && idx === 0 ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm font-medium" style={{ color: colors.textMuted }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Mode & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ ...styles.card, marginBottom: spacing.lg }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {[
                { mode: 'upcoming', icon: Gift, label: 'Upcoming' },
                { mode: 'calendar', icon: Calendar, label: 'By Month' },
                { mode: 'all', icon: Cake, label: 'All Birthdays' }
              ].map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  style={viewMode === mode ? styles.pillActive : styles.pillInactive}
                  className="cursor-pointer"
                >
                  <Icon size={16} className="inline mr-1" />
                  {label}
                </motion.button>
              ))}
            </div>

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
        </motion.div>

        {/* Birthday Cards with Staggered Animation */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...styles.card, textAlign: 'center', padding: '60px' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Sparkles size={48} style={{ color: colors.chiliYellow }} />
            </motion.div>
            <div className="text-xl mt-4" style={{ color: colors.textMuted }}>
              Loading birthdays...
            </div>
          </motion.div>
        ) : filteredMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ ...styles.card, textAlign: 'center', padding: '60px' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cake size={64} style={{ color: colors.textMuted, margin: '0 auto 20px' }} />
            </motion.div>
            <div className="text-xl font-bold mb-2" style={{ color: colors.textLight }}>
              No Birthdays Found
            </div>
            <div style={{ color: colors.textMuted }}>
              {viewMode === 'upcoming' ? 'No birthdays in the next 60 days' : 'Try adjusting your filters'}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredMembers.map((member, index) => {
                const daysUntil = getDaysUntilBirthday(member.date_of_birth);
                const urgencyColor = getUrgencyColor(daysUntil);
                const urgencyLabel = getUrgencyLabel(daysUntil);
                const parsed = parseMonthDay(member.date_of_birth);
                const isToday = daysUntil === 0;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: `0 20px 60px ${urgencyColor}40`,
                      y: -8
                    }}
                    onClick={() => setSelectedCard(selectedCard === member.id ? null : member.id)}
                    style={{
                      ...styles.card,
                      borderLeft: `4px solid ${urgencyColor}`,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: isToday
                        ? `linear-gradient(135deg, ${colors.whiteAlpha(0.12)} 0%, ${colors.whiteAlpha(0.08)} 100%)`
                        : colors.whiteAlpha(0.08)
                    }}
                  >
                    {/* Sparkle effect for today's birthdays */}
                    {isToday && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          zIndex: 1
                        }}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                      >
                        <Sparkles size={24} style={{ color: colors.chiliYellow }} />
                      </motion.div>
                    )}

                    {/* Urgency Badge with pulse */}
                    {daysUntil <= 7 && (
                      <motion.div
                        animate={isToday ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
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
                          boxShadow: `0 4px 20px ${urgencyColor}60`,
                          zIndex: 2
                        }}
                      >
                        {urgencyLabel}
                      </motion.div>
                    )}

                    {/* Member Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={isToday ? { rotate: [0, 20, -20, 0] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Cake size={20} style={{ color: urgencyColor }} />
                          </motion.div>
                          <h3 className="text-lg font-bold" style={{ color: colors.textLight }}>
                            {member.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: radius.full,
                            backgroundColor: colors.chiliGreen,
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        >
                          {member.position}
                        </motion.span>
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

                      {/* Countdown Flip Card */}
                      {daysUntil > 0 && (
                        <motion.div
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg mb-4"
                          style={{
                            background: `linear-gradient(135deg, ${colors.whiteAlpha(0.1)} 0%, ${colors.whiteAlpha(0.05)} 100%)`,
                            border: `1px solid ${colors.whiteAlpha(0.2)}`
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.div
                            key={daysUntil}
                            initial={{ rotateX: -90, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            style={{
                              fontSize: '32px',
                              fontWeight: '800',
                              color: urgencyColor,
                              textShadow: `0 0 20px ${urgencyColor}60`
                            }}
                          >
                            {daysUntil}
                          </motion.div>
                          <div style={{ color: colors.textMuted, fontSize: '14px' }}>
                            day{daysUntil !== 1 ? 's' : ''} until birthday
                          </div>
                        </motion.div>
                      )}

                      {/* Contact Buttons with animation */}
                      <motion.div
                        className="flex gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {member.phone && member.phone !== '-' && (
                          <motion.a
                            whileHover={{ scale: 1.05, backgroundColor: colors.whiteAlpha(0.2) }}
                            whileTap={{ scale: 0.95 }}
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
                          </motion.a>
                        )}
                        {member.email && member.email !== '-' && (
                          <motion.a
                            whileHover={{ scale: 1.05, backgroundColor: colors.whiteAlpha(0.2) }}
                            whileTap={{ scale: 0.95 }}
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
                          </motion.a>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayTrackerCool;
