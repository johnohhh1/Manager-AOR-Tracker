# 🎨 ChiliHead Manager Tracker - Style Guide

**The definitive design system for this app**
All new features MUST follow these rules. No exceptions.

---

## 🌟 Design Philosophy

This app is **visually stunning** - not a boring enterprise tool. We took inspiration from:
- **chilis.com** - Bold colors, unique shadows, pill-shaped buttons
- **Modern glassmorphism** - Depth, blur, transparency
- **Dark mode first** - Navy backgrounds, bright accents, high contrast

**Key Principle**: If it looks like a typical business app, you're doing it wrong.

---

## 🎨 Color System

### Official Chili's Brand Colors

```javascript
// From chilis.com (official)
chiliRed: '#E81B23'
chiliRedDark: '#C01118'
chiliNavy: '#22235B'
chiliNavyDark: '#171742'
chiliNavyDarker: '#0F1230'
chiliYellow: '#FFC60B'
chiliGreen: '#74B831'
chiliGreenBright: '#8DD645'
```

### Functional Colors

```javascript
// Dark Mode Backgrounds
bgDark: 'linear-gradient(135deg, #22235B 0%, #171742 50%, #0F1230 100%)'
bgCardGlass: 'rgba(255, 255, 255, 0.08)'
bgCardHover: 'rgba(255, 255, 255, 0.12)'

// Text (Always White/Light on Dark Backgrounds)
textLight: 'rgba(255, 255, 255, 0.95)'
textMuted: 'rgba(255, 255, 255, 0.75)'
textSubtle: 'rgba(255, 255, 255, 0.55)'
```

### ⚠️ NEVER USE
- ❌ `#ffffff` solid white backgrounds
- ❌ `#f8f9fa` cream/off-white backgrounds
- ❌ Dark text on white backgrounds
- ❌ Plain gray cards

### ✅ ALWAYS USE
- ✅ Dark navy gradient backgrounds
- ✅ Glassmorphic semi-transparent cards
- ✅ White/light text on dark surfaces
- ✅ Bold colored accents (red, yellow, green)

---

## 🖼️ Layout & Structure

### Page Container
```javascript
// Every page MUST start with this
<div style={styles.pageContainer}>
  {/* Content */}
</div>

// Which equals:
{
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #22235B 0%, #171742 50%, #0F1230 100%)',
  backgroundAttachment: 'fixed',
  padding: spacing.lg
}
```

### Headers
```javascript
// All pages use the same header style
<div style={{ ...styles.header }}>
  <div className="flex justify-between items-start mb-4">
    <div className="flex items-center">
      <button
        onClick={onBack}
        className="bg-white bg-opacity-20 p-2 rounded-md mr-3 hover:bg-opacity-30 transition-all cursor-pointer">
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1 className="text-2xl font-bold mb-1">🌶️ Page Title</h1>
        <p className="text-yellow-100">Subtitle text</p>
      </div>
    </div>
  </div>
  <p className="text-center text-yellow-100 text-lg font-medium">Tagline</p>
</div>
```

**Header Style** (from design-system.js):
```javascript
header: {
  background: 'linear-gradient(135deg, #E81B23 0%, #C01118 40%, #FFC60B 100%)',
  color: 'white',
  padding: '1.5rem 2rem',
  borderRadius: '20px',
  marginBottom: '2rem',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
}
```

---

## 🃏 Cards

### Basic Card Structure
```javascript
// ALWAYS use this for cards
<div className="bg-white rounded-lg p-6 shadow-md">
  {/* Content */}
</div>
```

**The CSS automatically transforms `.bg-white` into:**
```css
.bg-white {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
  border: 2px solid rgba(255, 255, 255, 0.15) !important;
}
```

### Card with Colored Left Border
```javascript
<div className="bg-white rounded-lg p-6 shadow-md border-l-4"
     style={{ borderColor: colors.chiliRed }}>
  <h3 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
    Title
  </h3>
  <p style={{ color: colors.chiliBrown }}>Content</p>
</div>
```

### Card with Hover Animation (Gradient Bar)
```javascript
<div
  className="bg-white rounded-lg p-6 shadow-md border-l-4 transition-all relative overflow-hidden"
  style={{ borderColor: colors.chiliRed }}
  onMouseEnter={(e) => {
    const gradient = e.currentTarget.querySelector('.gradient-bar');
    if (gradient) gradient.style.opacity = '1';
  }}
  onMouseLeave={(e) => {
    const gradient = e.currentTarget.querySelector('.gradient-bar');
    if (gradient) gradient.style.opacity = '0';
  }}>

  {/* Cool gradient bar that appears on hover */}
  <div className="gradient-bar" style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(180deg, #E81B23, #FFC60B, #74B831)',
    opacity: 0,
    transition: 'opacity 0.3s',
    boxShadow: '0 0 20px currentColor'
  }} />

  {/* Card content */}
</div>
```

---

## 🔘 Buttons

### Primary Button (Red)
```javascript
<button
  onClick={handleClick}
  style={styles.buttonPrimary}>
  Button Text
</button>

// Which equals:
{
  background: 'linear-gradient(135deg, #E81B23 0%, #C01118 100%)',
  color: 'white',
  padding: '1rem 2rem',
  borderRadius: '100px', // Pill shape!
  border: 'none',
  cursor: 'pointer',
  fontWeight: '800',
  fontSize: '0.9375rem',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  boxShadow: '-4px 4px 0px 0px rgba(0, 0, 0, 0.25), 0 0 30px rgba(232, 27, 35, 0.5)'
}
```

### Secondary Button (Green)
```javascript
<button style={styles.buttonSecondary}>
  Button Text
</button>

// Same as primary but:
background: 'linear-gradient(135deg, #74B831 0%, #8DD645 100%)',
boxShadow: '-4px 4px 0px 0px rgba(0, 0, 0, 0.25), 0 0 30px rgba(116, 184, 49, 0.4)'
```

### Ghost Button (Transparent)
```javascript
<button
  className="bg-white bg-opacity-20 px-4 py-2 rounded-md hover:bg-opacity-30 transition-all">
  Button Text
</button>
```

### Pill Tabs (Active/Inactive)
```javascript
// Active
<button
  className="px-6 py-2 rounded-full font-bold text-sm"
  style={{
    backgroundColor: colors.chiliRed,
    color: 'white',
    border: 'none'
  }}>
  Active Tab
</button>

// Inactive
<button
  className="px-6 py-2 rounded-full font-bold text-sm transition-all"
  style={{
    backgroundColor: 'transparent',
    color: 'white',
    border: `2px solid rgba(255, 255, 255, 0.3)`
  }}>
  Inactive Tab
</button>
```

### ⚠️ Button Rules
- **ALWAYS** use `border-radius: 100px` for primary/secondary buttons (pill shape)
- **ALWAYS** use the Chili's signature shadow: `-4px 4px 0px 0px rgba(0, 0, 0, 0.25)`
- **ALWAYS** uppercase text with `text-transform: 'uppercase'`
- **NEVER** use square corners on action buttons
- **NEVER** use plain `#fff` or `#000` - use gradients

---

## 📝 Typography

### Font Family
```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Headings
```javascript
// H1 - Page Titles
<h1 style={{
  fontSize: '2.5rem',
  fontWeight: '900',
  textTransform: 'uppercase',
  color: 'white',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  letterSpacing: '-0.01em'
}}>
  Title
</h1>

// H2 - Section Titles
<h2 style={{
  fontSize: '2rem',
  fontWeight: '900',
  textTransform: 'uppercase',
  color: 'white',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
}}>
  Section
</h2>

// H3 - Card Titles (on dark cards, use white; on light sections, use navy)
<h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
  Card Title
</h3>
```

### Body Text
```javascript
// Primary body text
<p style={{
  color: 'rgba(255, 255, 255, 0.95)',
  fontSize: '1rem',
  fontWeight: '500',
  lineHeight: '1.6'
}}>
  Content
</p>

// Secondary/muted text
<p style={{
  color: 'rgba(255, 255, 255, 0.75)',
  fontSize: '0.875rem'
}}>
  Supporting text
</p>
```

### ⚠️ Typography Rules
- **H1/H2** = ALWAYS uppercase, always white on dark backgrounds
- **H3** = Title case, navy on light sections, white on dark
- **Body** = ALWAYS white/light on dark backgrounds
- **NEVER** use dark text on dark backgrounds
- **ALWAYS** add `textShadow` to headings for depth

---

## 🎭 Shadows & Effects

### Chili's Signature Shadow
```css
/* The unique offset shadow from chilis.com */
box-shadow: -4px 4px 0px 0px rgba(0, 0, 0, 0.25);

/* On hover */
box-shadow: -6px 6px 0px 0px rgba(0, 0, 0, 0.3);
```

### Card Shadows
```css
/* Default card */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);

/* Hover state */
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

### Glow Effects
```css
/* Red glow (buttons, active states) */
box-shadow: 0 0 30px rgba(232, 27, 35, 0.5);

/* Green glow (success, completed) */
box-shadow: 0 0 30px rgba(116, 184, 49, 0.4);

/* Yellow glow (warnings, highlights) */
box-shadow: 0 0 30px rgba(255, 198, 11, 0.4);
```

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 2px solid rgba(255, 255, 255, 0.15);
```

---

## ✨ Animations & Transitions

### Hover Transform (Cards)
```javascript
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
  e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0) scale(1)';
  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
}}
```

### Hover Transform (Buttons with Chili's Shadow)
```javascript
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translate(-2px, -2px)';
  e.currentTarget.style.filter = 'brightness(1.1)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translate(0, 0)';
  e.currentTarget.style.filter = 'brightness(1)';
}}
```

### Progress Bar Shimmer
```css
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Apply to progress fill::after */
animation: shimmer 2s infinite;
```

---

## 📐 Spacing & Sizing

### Spacing Scale (from design-system.js)
```javascript
spacing.xs  = '0.5rem'   // 8px
spacing.sm  = '0.75rem'  // 12px
spacing.md  = '1rem'     // 16px
spacing.lg  = '1.5rem'   // 24px
spacing.xl  = '2rem'     // 32px
spacing.xxl = '3rem'     // 48px
```

### Border Radius
```javascript
radius.sm   = '12px'
radius.md   = '16px'
radius.lg   = '20px'
radius.xl   = '24px'
radius.pill = '100px'  // For buttons!
radius.full = '9999px'
```

### Button Heights
```javascript
// Pill buttons (tabs, toggles)
height: '52px'

// Primary action buttons
padding: '1rem 2rem' // Auto height from padding
```

---

## 🎯 Specific Components

### Search Bars
```javascript
<div className="relative">
  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-12 pr-12 py-3.5 text-lg rounded-lg border-2 focus:outline-none transition-all shadow-lg font-medium"
    style={{
      borderColor: isActive ? colors.chiliRed : 'white',
      background: 'white'
    }}
  />
  {value && (
    <button
      onClick={onClear}
      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700">
      <X size={20} />
    </button>
  )}
</div>
```

### Progress Bars
```javascript
<div className="w-full bg-gray-200 rounded-full h-3">
  <div
    className="h-full rounded-full transition-all"
    style={{
      width: `${percentage}%`,
      backgroundColor: colors.chiliGreen
    }}
  />
</div>
```

### Numbered Lists (Procedures, Steps)
```javascript
<ol className="space-y-2">
  {steps.map((step, idx) => (
    <li key={idx} className="flex items-start text-sm">
      <span className="font-bold mr-2 flex-shrink-0"
            style={{ color: colors.chiliRed }}>
        {idx + 1}.
      </span>
      <span className="flex-1" style={{ color: colors.chiliBrown }}>
        {step}
      </span>
    </li>
  ))}
</ol>
```

### Warning/Alert Boxes
```javascript
<div className="p-3 rounded-lg" style={{
  backgroundColor: `${colors.chiliYellow}40`,
  borderLeft: `3px solid ${colors.chiliYellow}`
}}>
  <p className="text-xs font-bold" style={{ color: '#92400e' }}>
    ⚠️ Warning message
  </p>
</div>
```

---

## 🚫 What NOT to Do

### ❌ WRONG
```javascript
// Plain white card
<div style={{ background: '#fff', padding: '20px' }}>

// Dark text on dark background
<p style={{ color: '#333', background: '#22235B' }}>

// Square buttons
<button style={{ borderRadius: '4px' }}>

// No shadow on cards
<div className="bg-white" style={{ boxShadow: 'none' }}>

// Cream/off-white backgrounds
<div style={{ background: '#f8f9fa' }}>
```

### ✅ CORRECT
```javascript
// Glassmorphic card
<div className="bg-white rounded-lg p-6 shadow-md">

// White text on dark background
<p style={{ color: 'rgba(255, 255, 255, 0.95)' }}>

// Pill-shaped button
<button style={{ borderRadius: '100px', ...styles.buttonPrimary }}>

// Card with proper shadows
<div className="bg-white rounded-lg shadow-md">

// Dark gradient background
<div style={styles.pageContainer}>
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first */
@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}
```

### Grid Layouts
```javascript
// Always use responsive grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## 🎨 Quick Reference

### Import Design System
```javascript
import { colors, styles, radius, spacing, shadows } from './styles/design-system';
```

### Common Patterns
```javascript
// Page
<div style={styles.pageContainer}>
  <div style={styles.header}>
    {/* Header content */}
  </div>

  <div className="px-6">
    {/* Page content */}
  </div>
</div>

// Card
<div className="bg-white rounded-lg p-6 shadow-md border-l-4"
     style={{ borderColor: colors.chiliRed }}>
  <h3 className="text-xl font-bold mb-4"
      style={{ color: colors.chiliNavy }}>
    Title
  </h3>
  <p style={{ color: colors.chiliBrown }}>Content</p>
</div>

// Button
<button style={styles.buttonPrimary} onClick={handleClick}>
  Action
</button>
```

---

## 🔧 Implementation Checklist

Before committing any new UI component, verify:

- [ ] Uses dark navy gradient background
- [ ] All cards are glassmorphic (`.bg-white` class)
- [ ] Text is white/light on dark surfaces
- [ ] Buttons use pill shape (`border-radius: 100px`)
- [ ] Buttons have Chili's signature shadow
- [ ] Hover states have lift/scale animations
- [ ] Montserrat font is used
- [ ] No solid white backgrounds anywhere
- [ ] Proper spacing from design system
- [ ] Mobile responsive (grid layouts)

---

## 💪 The Bottom Line

This app looks **fucking amazing** because we:
1. Borrowed the best from chilis.com
2. Added modern glassmorphism
3. Used bold, high-contrast colors
4. Never settled for boring enterprise UI

**Keep it that way.** Every new feature should make the app more beautiful, not less.

---

**ChiliHead Commitment**: If it doesn't spark joy, it doesn't ship. 🌶️✨
