// ========================================
// CHILI'S DESIGN SYSTEM - DARK MODE
// Modern dark theme with colored accents
// ========================================

export const colors = {
  // Brand Colors (from README)
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliBrown: 'rgb(60, 58, 53)',
  chiliGray: 'rgb(161, 159, 154)',

  // Extended Palette
  chiliRedDark: 'rgb(199, 24, 32)',
  chiliNavyDark: 'rgb(23, 37, 75)',
  chiliNavyLight: 'rgb(45, 46, 110)',
  chiliGreenBright: 'rgb(108, 192, 74)',

  // Functional Colors for DARK MODE
  bgDark: 'rgb(34, 35, 91)',
  bgDarkAlt: 'rgb(23, 37, 75)',
  textLight: 'rgba(255, 255, 255, 0.95)',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textSubtle: 'rgba(255, 255, 255, 0.5)',

  // Transparencies
  navyAlpha: (opacity) => `rgba(34, 35, 91, ${opacity})`,
  redAlpha: (opacity) => `rgba(237, 28, 36, ${opacity})`,
  whiteAlpha: (opacity) => `rgba(255, 255, 255, ${opacity})`,
  blackAlpha: (opacity) => `rgba(0, 0, 0, ${opacity})`,
};

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export const shadows = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
  md: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.5)',
  inner: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  red: '0 4px 16px rgba(237, 28, 36, 0.5)',
  green: '0 4px 16px rgba(116, 158, 51, 0.4)',
  glow: '0 0 20px rgba(237, 28, 36, 0.3)',
};

// ========================================
// COMPONENT STYLES (Dark Theme)
// ========================================

export const styles = {
  // Page container - DARK navy background
  pageContainer: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.bgDark} 0%, ${colors.bgDarkAlt} 100%)`,
    padding: spacing.lg,
  },

  // Header with red gradient
  header: {
    background: `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliRedDark} 50%, ${colors.chiliYellow} 100%)`,
    color: 'white',
    padding: `${spacing.lg} ${spacing.xl}`,
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
    boxShadow: `${shadows.xl}, ${shadows.inner}`,
    position: 'relative',
    overflow: 'hidden',
  },

  // Glassmorphism card (DARK with transparency)
  card: {
    backgroundColor: colors.whiteAlpha(0.08),
    backdropFilter: 'blur(12px)',
    borderRadius: radius.xl,
    padding: spacing.xl,
    boxShadow: `${shadows.md}, ${shadows.inner}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${colors.whiteAlpha(0.1)}`,
  },

  // Card with hover effect
  cardHover: {
    backgroundColor: colors.whiteAlpha(0.08),
    backdropFilter: 'blur(12px)',
    borderRadius: radius.xl,
    padding: spacing.xl,
    boxShadow: `${shadows.md}, ${shadows.inner}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${colors.whiteAlpha(0.1)}`,
    cursor: 'pointer',
  },

  // Solid colored card for emphasis
  cardSolid: {
    backgroundColor: colors.navyAlpha(0.6),
    backdropFilter: 'blur(12px)',
    borderRadius: radius.xl,
    padding: spacing.xl,
    boxShadow: `${shadows.md}, ${shadows.inner}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${colors.whiteAlpha(0.15)}`,
  },

  // Primary button (red)
  buttonPrimary: {
    background: `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliRedDark} 100%)`,
    color: 'white',
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: radius.lg,
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9375rem',
    boxShadow: shadows.red,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Secondary button (green)
  buttonSecondary: {
    background: `linear-gradient(135deg, ${colors.chiliGreen} 0%, ${colors.chiliGreenBright} 100%)`,
    color: 'white',
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: radius.lg,
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9375rem',
    boxShadow: shadows.green,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Ghost button (transparent with border)
  buttonGhost: {
    backgroundColor: colors.whiteAlpha(0.1),
    color: 'white',
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: radius.lg,
    border: `2px solid ${colors.whiteAlpha(0.2)}`,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9375rem',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Tab/Pill button (active)
  pillActive: {
    background: `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliRedDark} 100%)`,
    color: 'white',
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: radius.full,
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    boxShadow: `${shadows.red}, ${shadows.inner}`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Tab/Pill button (inactive)
  pillInactive: {
    backgroundColor: colors.whiteAlpha(0.1),
    color: colors.textMuted,
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: radius.full,
    border: `2px solid ${colors.whiteAlpha(0.15)}`,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Stat card (top of dashboards)
  statCard: {
    backgroundColor: colors.whiteAlpha(0.08),
    backdropFilter: 'blur(12px)',
    borderRadius: radius.lg,
    padding: spacing.xl,
    boxShadow: `${shadows.md}, ${shadows.inner}`,
    borderLeft: `4px solid ${colors.chiliRed}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${colors.whiteAlpha(0.1)}`,
  },

  // Large number in stat card
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: '1',
    marginBottom: spacing.sm,
    color: colors.textLight,
  },

  // Label in stat card
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: colors.textMuted,
  },

  // Input field (dark mode)
  input: {
    width: '100%',
    padding: spacing.md,
    borderRadius: radius.md,
    border: `2px solid ${colors.whiteAlpha(0.15)}`,
    backgroundColor: colors.whiteAlpha(0.05),
    color: colors.textLight,
    fontSize: '0.9375rem',
    transition: 'all 0.2s',
  },

  // Textarea (dark mode)
  textarea: {
    width: '100%',
    padding: spacing.md,
    borderRadius: radius.md,
    border: `2px solid ${colors.whiteAlpha(0.15)}`,
    backgroundColor: colors.whiteAlpha(0.05),
    color: colors.textLight,
    fontSize: '0.9375rem',
    minHeight: '120px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },

  // Badge (small colored label)
  badge: {
    display: 'inline-block',
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: radius.full,
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Progress bar container (dark)
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: colors.whiteAlpha(0.15),
    borderRadius: radius.full,
    overflow: 'hidden',
    boxShadow: shadows.inner,
  },

  // Progress bar fill
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 0 10px currentColor`,
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

export const mergeStyles = (...styleObjects) => {
  return Object.assign({}, ...styleObjects);
};

export default {
  colors,
  spacing,
  radius,
  shadows,
  styles,
  mergeStyles,
};
