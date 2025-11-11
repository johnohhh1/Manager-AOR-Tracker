# Design System Implementation Guide

## Problem
Components have inconsistent styling:
- Some pages have full navy backgrounds (dark mode)
- Some have white backgrounds
- Colors are defined inline in every component
- No consistent spacing, shadows, or rounded corners

## Solution
Centralized design system in `/src/styles/design-system.js`

---

## ✅ Correct Pattern (Modern & Consistent)

### Import the design system
```javascript
import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';
```

### Page Container (Light gradient background)
```javascript
<div style={{ ...styles.pageContainer }}>
  {/* Your content */}
</div>
```

### Header (Red gradient with white text)
```javascript
<div style={{ ...styles.header, marginBottom: spacing.xl }}>
  <h1 style={{ color: colors.white }}>Your Title</h1>
</div>
```

### White Cards (Main content cards)
```javascript
<div style={{ ...styles.card }}>
  <h2 style={{ color: colors.chiliRed }}>Card Title</h2>
  <p style={{ color: colors.textSecondary }}>Card content</p>
</div>
```

### Card with Border Accent
```javascript
<div style={{
  ...styles.card,
  borderLeft: `4px solid ${colors.chiliGreen}`
}}>
  Content
</div>
```

### Buttons - Primary (Red)
```javascript
<button style={{ ...styles.buttonPrimary }}>
  Click Me
</button>
```

### Buttons - Secondary (Green)
```javascript
<button style={{ ...styles.buttonSecondary }}>
  Save
</button>
```

### Pills/Tabs - Active
```javascript
<button style={isActive ? styles.pillActive : styles.pillInactive}>
  Tab Name
</button>
```

### Stat Cards (Top of dashboards)
```javascript
<div style={{
  ...styles.statCard,
  borderLeftColor: colors.chiliRed
}}>
  <div style={{ ...styles.statNumber, color: colors.chiliRed }}>
    42
  </div>
  <div style={{ ...styles.statLabel, color: colors.textMuted }}>
    Tasks Completed
  </div>
</div>
```

---

## ❌ Wrong Pattern (Inconsistent - Don't Do This)

### ❌ Full Navy Background (Dark Mode)
```javascript
// DON'T DO THIS
<div style={{ backgroundColor: colors.chiliNavy, minHeight: '100vh' }}>
```

### ❌ Dark Glass Cards
```javascript
// DON'T DO THIS
<div style={{
  backgroundColor: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
}}>
```

### ❌ Inline Color Definitions
```javascript
// DON'T DO THIS
const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  // ... etc
};
```

### ❌ White Text on Dark Background (Except Headers)
```javascript
// DON'T DO THIS (unless in header)
<p style={{ color: 'rgba(255,255,255,0.7)' }}>Text</p>

// DO THIS INSTEAD
<p style={{ color: colors.textSecondary }}>Text</p>
```

---

## 🎨 Color Usage Guide

### When to use each color:

**chiliRed** - Primary actions, headings, important stats
**chiliNavy** - Subheadings, secondary text
**chiliGreen** - Success states, positive metrics
**chiliYellow** - Warnings, highlights
**chiliCream** - Subtle backgrounds (rarely needed now)
**textPrimary** (navy) - Main body text
**textSecondary** (brown) - Secondary body text
**textMuted** (gray) - Labels, metadata
**white** - Card backgrounds, light areas

---

## 📐 Spacing Scale

Use the spacing object for consistent margins/padding:

```javascript
spacing.xs    // 8px
spacing.sm    // 12px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing['2xl'] // 48px
spacing['3xl'] // 64px
```

Example:
```javascript
<div style={{ padding: spacing.xl, marginBottom: spacing.lg }}>
```

---

## 🔘 Border Radius

```javascript
radius.sm    // 8px - small elements
radius.md    // 12px - buttons, inputs
radius.lg    // 16px - cards (most common)
radius.xl    // 20px - large cards
radius.full  // 9999px - pills/tabs
```

---

## 🌫️ Shadows

```javascript
shadows.sm    // Subtle shadow
shadows.md    // Card shadow (default)
shadows.lg    // Hover state
shadows.xl    // Headers, modals
shadows.red   // Red button shadow
shadows.green // Green button shadow
```

---

## 🔄 Migration Checklist

For each component file:

1. ✅ Remove local `const colors = {...}` definition
2. ✅ Add import: `import { colors, styles, radius, spacing, shadows } from '../../styles/design-system';`
3. ✅ Replace page background: `style={{ backgroundColor: colors.chiliNavy }}` → `style={{ ...styles.pageContainer }}`
4. ✅ Update header to red gradient: Use `styles.header`
5. ✅ Convert dark glass cards to white cards: Use `styles.card`
6. ✅ Change text colors from `rgba(255,255,255,...)` to `colors.textSecondary`
7. ✅ Update buttons to use predefined styles
8. ✅ Update pills/tabs to use predefined styles

---

## 📝 Example: Before & After

### BEFORE (Inconsistent)
```javascript
const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
};

return (
  <div style={{ backgroundColor: colors.chiliNavy, minHeight: '100vh', padding: '20px' }}>
    <h1 style={{ color: colors.chiliGreen }}>Title</h1>
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px'
    }}>
      <p style={{ color: 'rgba(255,255,255,0.9)' }}>Content</p>
    </div>
  </div>
);
```

### AFTER (Consistent)
```javascript
import { colors, styles, spacing } from '../../styles/design-system';

return (
  <div style={{ ...styles.pageContainer }}>
    <div style={{ ...styles.header, marginBottom: spacing.xl }}>
      <h1 style={{ color: colors.white }}>Title</h1>
    </div>
    <div style={{ ...styles.card }}>
      <p style={{ color: colors.textSecondary }}>Content</p>
    </div>
  </div>
);
```

---

## 🎯 Design Principles

1. **Light backgrounds** - Light gray gradient for pages, white cards for content
2. **Dark accents** - Navy for text, red/green for highlights
3. **Rounded corners** - 16px for cards (modern look)
4. **Consistent shadows** - Elevate cards with subtle shadows
5. **Red gradient headers** - All pages have red-to-yellow gradient headers with white text
6. **Clean hierarchy** - Red for primary, Navy for secondary, Gray for tertiary

---

## 📂 Files Already Updated

✅ `/src/styles/design-system.js` - Central design system
✅ `/src/components/coaching/CoachingGuide.jsx` - Fully migrated
✅ `/src/components/coaching/Analytics.jsx` - Header updated (needs card updates)
✅ `/src/modern-chilis.css` - CSS variables updated

---

## 🚀 Next Steps

Apply this pattern to remaining components:
- All AOR dashboards (Culinary, Hospitality, ToGo/Bar)
- Coaching components (TrainingScenarios, QuickReference, FloorObservation, Weekly1on1)
- Main App/Home components
- TeamManagement

**Goal**: Every page should feel like it's part of the same app - consistent backgrounds, headers, cards, buttons, and text colors.
