import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cake, Calendar, Gift, Phone, Mail, Download, Search, Sparkles, PartyPopper, Zap } from 'lucide-react';
import { supabase } from '../supabase';
import { colors, styles, radius, spacing, shadows } from '../styles/design-system';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const BirthdayTracker = ({ manager }) => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All');
  const [viewMode, setViewMode] = useState('upcoming');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [celebrateMode, setCelebrateMode] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const positions = ['All', 'Server', 'Host', 'Runner', 'Busser', 'Bartender', 'To-Go', 'QA', 'Kitchen', 'Dishwasher', 'Shift Leader', 'Manager'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    loadTeamMembers();
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

    if (dateOfBirth.startsWith('--')) {
      const parts = dateOfBirth.split('-');
      const month = parseInt(parts[2]) - 1;
      const day = parseInt(parts[3]);
      return { month, day };
    } else if (dateOfBirth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = dateOfBirth.split('-');
      const month = parseInt(parts[1]) - 1;
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
  const hasUpcomingBirthdays = stats.thisWeek > 0 || stats.thisMonth > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.bgDark} 0%, ${colors.bgDarkAlt} 50%, ${colors.chiliNavy} 100%)`,
      padding: window.innerWidth < 768 ? spacing.md : spacing.lg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* FULL SCREEN CONFETTI */}
      {celebrateMode && (hasTodayBirthdays || hasUpcomingBirthdays) && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={300}
          colors={[colors.chiliRed, colors.chiliYellow, colors.chiliGreen, '#FFD700', '#FF69B4']}
          gravity={0.3}
        />
      )}

      {/* MEGA VISIBLE FLOATING PARTICLES */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              borderRadius: '50%',
              background: i % 3 === 0 ? colors.chiliRed : i % 3 === 1 ? colors.chiliYellow : colors.chiliGreen,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4 + Math.random() * 0.4,
              boxShadow: `0 0 ${20 + Math.random() * 30}px currentColor`
            }}
            animate={{
              y: [0, -50 - Math.random() * 50, 0],
              x: [-20 + Math.random() * 40, 20 - Math.random() * 40, -20 + Math.random() * 40],
              scale: [1, 1.3 + Math.random() * 0.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header with MEGA animation */}
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          style={{ ...styles.header, position: 'relative', overflow: 'visible' }}
        >
          {/* Sparkle burst around header */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '20px'
              }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 100,
                y: Math.sin((i / 8) * Math.PI * 2) * 100,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <Sparkles size={20} style={{ color: colors.chiliYellow }} />
            </motion.div>
          ))}

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.2, rotate: -20 }}
                  whileTap={{ scale: 0.8, rotate: 20 }}
                  onClick={() => navigate('/dashboard')}
                  className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <div>
                  <motion.h1
                    className="text-2xl md:text-3xl font-bold mb-1"
                    animate={{
                      scale: [1, 1.05, 1],
                      textShadow: [
                        `0 0 10px ${colors.chiliYellow}`,
                        `0 0 30px ${colors.chiliRed}`,
                        `0 0 10px ${colors.chiliYellow}`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎂 BIRTHDAY TRACKER 🎉
                  </motion.h1>
                  <p className="text-yellow-100 text-sm md:text-base">Celebrate Your Team!</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: celebrateMode
                    ? ['0 0 20px rgba(237, 28, 36, 0.8)', '0 0 60px rgba(255, 198, 11, 1)', '0 0 20px rgba(237, 28, 36, 0.8)']
                    : '0 4px 12px rgba(0,0,0,0.3)',
                  scale: celebrateMode ? [1, 1.02, 1] : 1
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                onClick={() => setCelebrateMode(!celebrateMode)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-base md:text-lg"
                style={{
                  background: celebrateMode
                    ? `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliYellow} 50%, ${colors.chiliGreen} 100%)`
                    : `linear-gradient(135deg, ${colors.chiliYellow} 0%, ${colors.chiliGreen} 100%)`,
                  color: 'white'
                }}
              >
                <motion.div
                  animate={{ rotate: celebrateMode ? 360 : 0 }}
                  transition={{ duration: 1, repeat: celebrateMode ? Infinity : 0 }}
                >
                  <PartyPopper size={20} />
                </motion.div>
                <span className="whitespace-nowrap">{celebrateMode ? 'CELEBRATING! 🎊' : 'CELEBRATE NOW!'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colors.chiliGreen} 0%, ${colors.chiliGreenBright} 100%)`,
                  color: 'white',
                  boxShadow: shadows.green
                }}
              >
                <Download size={18} />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* MEGA Animated Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: '🎉 TODAY', value: stats.today, color: colors.chiliRed, delay: 0 },
            { label: '📅 THIS WEEK', value: stats.thisWeek, color: colors.chiliYellow, delay: 0.1 },
            { label: '🎂 THIS MONTH', value: stats.thisMonth, color: colors.chiliGreen, delay: 0.2 },
            { label: '👥 TOTAL TEAM', value: stats.total, color: colors.textLight, delay: 0.3 }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 100, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: stat.delay, type: 'spring', bounce: 0.6 }}
              whileHover={{
                scale: window.innerWidth < 768 ? 1.05 : 1.15,
                boxShadow: `0 20px 60px ${stat.color}80`,
                y: window.innerWidth < 768 ? -5 : -15,
                rotateZ: stat.value > 0 && idx === 0 ? [0, -5, 5, 0] : 0
              }}
              style={{
                ...styles.card,
                borderLeft: `6px solid ${stat.color}`,
                textAlign: 'center',
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${colors.whiteAlpha(0.15)} 0%, ${colors.whiteAlpha(0.05)} 100%)`
              }}
            >
              <motion.div
                className="text-3xl md:text-5xl font-black mb-2"
                style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}80` }}
                animate={stat.value > 0 && idx === 0 ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs md:text-sm font-bold tracking-wider" style={{ color: colors.textLight }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Mode & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  style={viewMode === mode ? {
                    ...styles.pillActive,
                    boxShadow: `0 8px 25px ${colors.chiliRed}60`
                  } : styles.pillInactive}
                  className="cursor-pointer"
                >
                  <Icon size={16} className="inline mr-1" />
                  {label}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              <div className="relative flex-1">
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
                    width: '100%',
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
                  width: '100%',
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
                    width: '100%',
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

        {/* Birthday Cards with INSANE animations */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...styles.card, textAlign: 'center', padding: '60px' }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Zap size={64} style={{ color: colors.chiliYellow }} />
            </motion.div>
            <div className="text-2xl mt-4 font-bold" style={{ color: colors.textLight }}>
              Loading birthdays...
            </div>
          </motion.div>
        ) : filteredMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ ...styles.card, textAlign: 'center', padding: '60px' }}
          >
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cake size={80} style={{ color: colors.textMuted, margin: '0 auto 20px' }} />
            </motion.div>
            <div className="text-2xl font-bold mb-2" style={{ color: colors.textLight }}>
              No Birthdays Found
            </div>
            <div style={{ color: colors.textMuted }}>
              {viewMode === 'upcoming' ? 'No birthdays in the next 60 days' : 'Try adjusting your filters'}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {filteredMembers.map((member, index) => {
                const daysUntil = getDaysUntilBirthday(member.date_of_birth);
                const urgencyColor = getUrgencyColor(daysUntil);
                const urgencyLabel = getUrgencyLabel(daysUntil);
                const parsed = parseMonthDay(member.date_of_birth);
                const isToday = daysUntil === 0;
                const isSoon = daysUntil <= 7;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 100, scale: 0.7, rotateY: -90 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.7, rotateY: 90 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 80
                    }}
                    whileHover={{
                      scale: window.innerWidth < 768 ? 1.02 : 1.08,
                      boxShadow: `0 30px 80px ${urgencyColor}80, 0 0 60px ${urgencyColor}40`,
                      y: window.innerWidth < 768 ? -5 : -15,
                      rotateZ: window.innerWidth < 768 ? 0 : [-2, 2, -2]
                    }}
                    style={{
                      ...styles.card,
                      borderLeft: `8px solid ${urgencyColor}`,
                      position: 'relative',
                      overflow: 'visible',
                      cursor: 'pointer',
                      background: isToday
                        ? `linear-gradient(135deg, ${colors.chiliRed}40 0%, ${colors.whiteAlpha(0.12)} 100%)`
                        : `linear-gradient(135deg, ${colors.whiteAlpha(0.15)} 0%, ${colors.whiteAlpha(0.08)} 100%)`
                    }}
                  >
                    {/* MEGA Sparkle effect for soon birthdays */}
                    {isSoon && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            style={{
                              position: 'absolute',
                              top: `${20 + Math.random() * 60}%`,
                              left: `${20 + Math.random() * 60}%`,
                              zIndex: 10
                            }}
                            animate={{
                              rotate: [0, 360],
                              scale: [0, 1.5, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2 + Math.random(),
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                          >
                            <Sparkles size={20} style={{ color: colors.chiliYellow }} />
                          </motion.div>
                        ))}
                      </>
                    )}

                    {/* Urgency Badge with MEGA pulse */}
                    {isSoon && (
                      <motion.div
                        animate={{
                          scale: isToday ? [1, 1.3, 1] : [1, 1.15, 1],
                          rotate: isToday ? [0, 10, -10, 0] : 0,
                          boxShadow: [
                            `0 4px 20px ${urgencyColor}60`,
                            `0 8px 40px ${urgencyColor}`,
                            `0 4px 20px ${urgencyColor}60`
                          ]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: `${spacing.xs} ${spacing.md}`,
                          borderRadius: radius.full,
                          backgroundColor: urgencyColor,
                          color: 'white',
                          fontSize: window.innerWidth < 768 ? '11px' : '14px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          zIndex: 20
                        }}
                      >
                        {urgencyLabel}
                      </motion.div>
                    )}

                    {/* Member Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={isToday ? {
                              rotate: [0, 30, -30, 0],
                              scale: [1, 1.3, 1]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Cake size={28} style={{ color: urgencyColor }} />
                          </motion.div>
                          <h3 className="text-lg md:text-xl font-bold" style={{
                            color: colors.textLight,
                            textShadow: isSoon ? `0 0 10px ${urgencyColor}60` : 'none'
                          }}>
                            {member.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          style={{
                            padding: `${spacing.xs} ${spacing.md}`,
                            borderRadius: radius.full,
                            backgroundColor: colors.chiliGreen,
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}
                        >
                          {member.position}
                        </motion.span>
                      </div>

                      {/* Birthday Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2" style={{ color: colors.textLight, fontSize: '16px' }}>
                          <Calendar size={20} />
                          <span className="font-semibold">
                            {parsed ? `${months[parsed.month]} ${parsed.day}` : 'N/A'}
                          </span>
                        </div>
                        {daysUntil > 7 && (
                          <div className="flex items-center gap-2" style={{ color: colors.textMuted }}>
                            <Gift size={18} />
                            <span>{urgencyLabel}</span>
                          </div>
                        )}
                      </div>

                      {/* MEGA Countdown Flip Card */}
                      {daysUntil > 0 && (
                        <motion.div
                          className="flex items-center justify-center gap-2 py-3 px-4 md:py-4 md:px-6 rounded-xl mb-4"
                          style={{
                            background: `linear-gradient(135deg, ${urgencyColor}30 0%, ${colors.whiteAlpha(0.1)} 100%)`,
                            border: `2px solid ${urgencyColor}`,
                            boxShadow: `0 0 30px ${urgencyColor}40`
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            key={daysUntil}
                            initial={{ rotateX: -90, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            style={{
                              fontSize: window.innerWidth < 768 ? '36px' : '48px',
                              fontWeight: '900',
                              color: urgencyColor,
                              textShadow: `0 0 30px ${urgencyColor}, 0 4px 8px ${colors.blackAlpha(0.5)}`
                            }}
                          >
                            {daysUntil}
                          </motion.div>
                          <div style={{ color: colors.textLight, fontSize: window.innerWidth < 768 ? '14px' : '16px', fontWeight: '600' }}>
                            day{daysUntil !== 1 ? 's' : ''}<br/>until birthday
                          </div>
                        </motion.div>
                      )}

                      {/* Contact Buttons */}
                      <motion.div
                        className="flex gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {member.phone && member.phone !== '-' && (
                          <motion.a
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: colors.whiteAlpha(0.3),
                              boxShadow: `0 8px 25px ${colors.chiliGreen}60`
                            }}
                            whileTap={{ scale: 0.95 }}
                            href={`tel:${member.phone}`}
                            style={{
                              ...styles.buttonGhost,
                              padding: `${spacing.md} ${spacing.lg}`,
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: spacing.sm,
                              textDecoration: 'none',
                              flex: 1,
                              justifyContent: 'center',
                              fontWeight: '600'
                            }}
                          >
                            <Phone size={16} />
                            Call
                          </motion.a>
                        )}
                        {member.email && member.email !== '-' && (
                          <motion.a
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: colors.whiteAlpha(0.3),
                              boxShadow: `0 8px 25px ${colors.chiliGreen}60`
                            }}
                            whileTap={{ scale: 0.95 }}
                            href={`mailto:${member.email}`}
                            style={{
                              ...styles.buttonGhost,
                              padding: `${spacing.md} ${spacing.lg}`,
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: spacing.sm,
                              textDecoration: 'none',
                              flex: 1,
                              justifyContent: 'center',
                              fontWeight: '600'
                            }}
                          >
                            <Mail size={16} />
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

export default BirthdayTracker;
