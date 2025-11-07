# 🌶️ ChiliHead Hospitality Coaching - React App Integration Prompt

## CONTEXT
You are enhancing a React-based Manager AOR Tracker application (currently live on Vercel) by adding interactive coaching tools. The app already has:
- Manager authentication/profiles
- Task tracking by frequency (daily/weekly/monthly/quarterly)
- Supabase backend for data persistence
- Manager AOR roles: Culinary, Hospitality, To-Go/Bar, and GM view

## OBJECTIVE
Transform the coaching materials in `/refs` directory into interactive React components that integrate with the existing Manager AOR Tracker app.

---

## REFERENCE MATERIALS LOCATION

Create a `/refs` folder in the app root and place these files:
- `chilihead_hospitality_coaching_guide.md`
- `coaching_quick_card.txt`
- `floor_observation_form.md`
- `roleplay_training_scenarios.md`
- `weekly_1on1_template.md`
- `ChiliHead_Coaching_At_A_Glance.md`

---

## REQUIRED NEW FEATURES

### 1. NEW MAIN MENU ITEM: "Coaching Tools" 🎓
Add to the main menu (alongside Daily/Weekly/Monthly/Quarterly Tasks):
- Icon: Graduation cap or clipboard
- Accessible to all manager roles
- Opens coaching dashboard

---

### 2. COACHING DASHBOARD (New View)
**Route:** `/coaching`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  🎓 ChiliHead Hospitality Coaching Tools    │
├─────────────────────────────────────────────┤
│                                              │
│  [Quick Reference Card] [Training Scenarios] │
│  [Floor Observations]   [Weekly 1:1s]        │
│  [Coaching Guide]       [At-A-Glance]        │
│                                              │
└─────────────────────────────────────────────┘
```

**Cards should show:**
- Tool name
- Quick description
- Last used date (if applicable)
- Click to open

---

### 3. COMPONENT: Quick Reference Card (Modal/Drawer)
**File:** `src/components/coaching/QuickReferenceCard.jsx`

**Features:**
- Parse the `coaching_quick_card.txt` content
- Display in collapsible sections:
  - 5-Step Coaching Model
  - Position-Specific Quick Fixes (filterable by position)
  - Coaching Conversation Starters
  - Daily Self-Check (with checkboxes)
- "Always on top" toggle option
- Print-friendly view

**Data:**
- No database needed (static content from ref file)
- LocalStorage for "checked" items on daily self-check

---

### 4. COMPONENT: Floor Observation Form (Database-Backed)
**File:** `src/components/coaching/FloorObservation.jsx`

**Database Schema (Supabase):**
```sql
CREATE TABLE floor_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL, -- 'AM', 'PM', 'Close'
  observations JSONB NOT NULL, -- Position-specific observations
  metrics JSONB, -- Shift metrics
  top_performer JSONB, -- Top performer data
  coaching_priorities JSONB, -- Follow-up items
  guest_feedback JSONB,
  manager_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_floor_obs_manager ON floor_observations(manager_id, shift_date);
CREATE INDEX idx_floor_obs_date ON floor_observations(shift_date DESC);
```

**Features:**
- **Create New Observation:**
  - Select shift type (AM/PM/Close)
  - Position-by-position checklists (dynamic based on positions in restaurant)
  - For each position:
    - Behavior checkboxes (✓/✗)
    - Notes field
    - Coaching given (radio: None/Real-time/Follow-up needed)
    - Recognition given (checkbox)
  - Metrics snapshot section
  - Top performer of shift
  - Coaching priorities for next shift

- **View Past Observations:**
  - List view (sortable by date)
  - Filter by: Date range, Manager, Shift type, Position
  - Search functionality
  - Export to PDF

- **Analytics View:**
  - Trends over time (how often positions are meeting standards)
  - Most coached behaviors
  - Recognition frequency
  - Manager coaching activity

**UI Flow:**
1. Click "New Observation" button
2. Modal/fullscreen form opens
3. Fill out sections (save progress to LocalStorage as draft)
4. Submit → Saves to Supabase
5. Confirmation + option to start next observation

---

### 5. COMPONENT: Role-Play Training Scenarios (Interactive)
**File:** `src/components/coaching/RolePlayScenarios.jsx`

**Features:**
- Parse `roleplay_training_scenarios.md`
- Display as interactive cards:
  - Scenario title and position
  - Context/Setup
  - "What to Observe" checklist
  - Coaching Focus points
  - Debrief template

- **Interactive Elements:**
  - "Run This Scenario" button → Opens focused view
  - Timer for practice (configurable: 2-5 min)
  - Notes field during scenario
  - Mark as "Practiced" (saves to user profile)
  - Filter by position
  - Search scenarios

- **Manager Pre-Shift Mode:**
  - "Pick Random Scenario" button
  - "Daily Scenario Suggester" (different one each day of week)
  - Share scenario with team via SMS/email

**Data:**
- Static content from markdown
- User data (practiced scenarios, notes) in Supabase:
  ```sql
  CREATE TABLE scenario_practice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_id TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    practiced_date DATE NOT NULL,
    notes TEXT,
    team_members TEXT[], -- Who participated
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

---

### 6. COMPONENT: Weekly 1:1 Template (CRITICAL - Multi-Manager Access)
**File:** `src/components/coaching/Weekly1on1.jsx`

**Database Schema (Supabase):**
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  manager_id TEXT NOT NULL,
  hire_date DATE,
  cross_training JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE one_on_ones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_member_id UUID REFERENCES team_members(id),
  manager_id TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  fiscal_week TEXT,
  fiscal_period TEXT,
  
  -- Metrics
  metrics JSONB NOT NULL,
  
  -- Wins & Recognition
  wins TEXT[],
  manager_recognition TEXT[],
  peer_shoutouts TEXT[],
  guest_compliments TEXT[],
  
  -- Behavior Ratings (position-specific)
  behavior_ratings JSONB NOT NULL,
  
  -- Development
  focus_behavior TEXT,
  action_plan JSONB,
  
  -- Cross-Training
  cross_training_status JSONB,
  
  -- Schedule & Feedback
  schedule_notes TEXT,
  open_feedback TEXT,
  manager_feedback TEXT,
  
  -- Goals & Commitments
  team_member_commits TEXT[],
  manager_commits TEXT[],
  
  -- Follow-up
  follow_up_items JSONB,
  next_meeting_date DATE,
  
  -- Visibility (IMPORTANT)
  visible_to TEXT[], -- Array of manager_ids who can view
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_1on1_team_member ON one_on_ones(team_member_id, meeting_date DESC);
CREATE INDEX idx_1on1_manager ON one_on_ones(manager_id, meeting_date DESC);
CREATE INDEX idx_1on1_visible ON one_on_ones USING GIN(visible_to);
```

**Features:**

**For Creating 1:1:**
1. Select team member (or add new)
2. Auto-populate metrics from system (if available)
3. Structured form matching template sections:
   - Metrics review (with trend indicators)
   - Wins & recognition (text fields + tags)
   - Position-specific behavior ratings (1-5 scale with comments)
   - Development focus (select from common behaviors or free text)
   - Action plan builder
   - Cross-training tracker
   - Schedule/feedback sections
   - Goals & commitments (list builders)
   - Follow-up items with due dates

4. **Visibility Settings (CRITICAL):**
   - Checkbox: "Share with all managers" (default: checked)
   - Or: Select specific managers to share with
   - This populates the `visible_to` array

5. Save as draft or complete
6. Send summary via email/SMS option

**For Viewing 1:1s:**
- **My 1:1s Tab:** 1:1s conducted by logged-in manager
- **Team 1:1s Tab:** ALL 1:1s visible to logged-in manager (from all managers)
  - Shows manager who conducted it
  - Filter by: Team member, Manager, Date range, Position
  - Search functionality
  
- **Team Member Profile:**
  - Click team member → See all their 1:1s chronologically
  - Progress tracking over time
  - Development goals status

**Analytics:**
- How many 1:1s per manager per week
- Common development focuses
- Behavior rating trends
- Cross-training progress by position

---

### 7. COMPONENT: Coaching Guide (Searchable Knowledge Base)
**File:** `src/components/coaching/CoachingGuide.jsx`

**Features:**
- Parse `chilihead_hospitality_coaching_guide.md`
- Display as searchable, navigable content:
  - Table of contents (sticky sidebar)
  - Search bar (highlights matching text)
  - Position filter (show only relevant sections)
  - Bookmarks (save to user profile)
  - "Share This Section" → Copy link or send to manager

- **Smart Suggestions:**
  - Based on recent floor observations, suggest relevant guide sections
  - "You coached [behavior] 3 times this week. Here's the guide section."

---

### 8. COMPONENT: At-A-Glance Poster (Dashboard Widget)
**File:** `src/components/coaching/AtAGlancePoster.jsx`

**Features:**
- Parse `ChiliHead_Coaching_At_A_Glance.md`
- Display as dashboard widget (can be pinned to home screen)
- Sections:
  - 5-Step Model (visual)
  - Red Flags & Quick Fixes (searchable table)
  - Daily practice calendar
  - Manager self-check (today's checkboxes)
- Toggle compact/expanded view
- Print view

---

## NAVIGATION & USER FLOW

### Add to Main App Navigation:
```jsx
// Current menu items:
- Home
- Daily Tasks
- Weekly Tasks
- Monthly Tasks
- Quarterly Tasks
+ Coaching Tools 🎓 <-- NEW
```

### Coaching Tools Sub-Navigation:
```
Coaching Tools Dashboard
├── Quick Reference (modal/drawer)
├── Floor Observations
│   ├── New Observation
│   ├── View Past Observations
│   └── Analytics
├── Training Scenarios
│   ├── Browse Scenarios
│   ├── Practice Mode
│   └── Practice History
├── Weekly 1:1s
│   ├── Schedule 1:1
│   ├── My 1:1s
│   ├── Team 1:1s (all visible)
│   └── Team Member Profiles
├── Coaching Guide (searchable)
└── At-A-Glance Widget
```

---

## TECHNICAL IMPLEMENTATION NOTES

### File Structure:
```
src/
├── components/
│   └── coaching/
│       ├── CoachingDashboard.jsx
│       ├── QuickReferenceCard.jsx
│       ├── FloorObservation.jsx
│       │   ├── ObservationForm.jsx
│       │   ├── ObservationList.jsx
│       │   └── ObservationAnalytics.jsx
│       ├── RolePlayScenarios.jsx
│       │   ├── ScenarioCard.jsx
│       │   ├── ScenarioPractice.jsx
│       │   └── ScenarioHistory.jsx
│       ├── Weekly1on1.jsx
│       │   ├── OneOnOneForm.jsx
│       │   ├── OneOnOneList.jsx
│       │   ├── TeamMemberProfile.jsx
│       │   └── OneOnOneAnalytics.jsx
│       ├── CoachingGuide.jsx
│       └── AtAGlancePoster.jsx
├── utils/
│   └── markdownParser.js (parse .md files from /refs)
└── hooks/
    └── useCoaching.js (Supabase CRUD operations)

refs/ (in app root)
├── chilihead_hospitality_coaching_guide.md
├── coaching_quick_card.txt
├── floor_observation_form.md
├── roleplay_training_scenarios.md
├── weekly_1on1_template.md
└── ChiliHead_Coaching_At_A_Glance.md
```

### Parsing Reference Files:
```javascript
// Example: utils/markdownParser.js
export const parseCoachingGuide = async () => {
  const response = await fetch('/refs/chilihead_hospitality_coaching_guide.md');
  const text = await response.text();
  
  // Parse markdown into sections
  // Return structured data
};

// Use react-markdown or marked.js for rendering
```

### Supabase Setup:
```javascript
// supabase/migrations/add_coaching_tables.sql
// Run migrations to create tables

// utils/supabase.js - add coaching functions
export const createFloorObservation = async (data) => { ... };
export const getFloorObservations = async (filters) => { ... };
export const create1on1 = async (data) => { ... };
export const get1on1s = async (managerId, includeShared = true) => { ... };
// etc.
```

### Mobile Responsiveness:
- Floor observation form: Multi-step wizard on mobile
- 1:1 form: Collapsible sections on mobile
- Tables: Horizontal scroll or card view on mobile
- Quick Reference: Drawer on mobile, modal on desktop

---

## CRITICAL FEATURES FOR GM VIEW

### GM-Specific Coaching Dashboard:
When a GM logs in, show:
- **Team Coaching Activity:**
  - How many floor observations per manager this week
  - How many 1:1s completed per manager
  - Recent coaching trends (which behaviors most coached)
  
- **Team Development Overview:**
  - All team members' latest 1:1 status
  - Cross-training progress across restaurant
  - Common development focuses
  
- **Coaching Leaderboard:**
  - Most active coach (floor observations)
  - Most consistent 1:1s
  - Best recognition giver

---

## UI/UX GUIDELINES

### Colors (Match existing Chili's brand):
- Primary: chiliRed (rgb(237, 28, 36))
- Secondary: chiliNavy (rgb(34, 35, 91))
- Accent: chiliYellow (rgb(255, 198, 11))
- Success: chiliGreen (rgb(116, 158, 51))

### Icons (use lucide-react):
- Coaching: GraduationCap, Clipboard
- Observation: Eye, CheckCircle
- 1:1: Users, MessageSquare
- Training: PlayCircle, BookOpen
- Guide: Book, Search
- Recognition: Award, Star

### Notifications:
- Toast notifications for actions (saved, deleted, etc.)
- Reminder notifications for upcoming 1:1s
- Celebration animations for completed observations

---

## DATA MIGRATION / INITIAL SETUP

If existing managers are already in the system:
1. Create team_members table entries for their staff
2. Set up manager relationships
3. Populate initial cross-training data

---

## ACCESSIBILITY

- All forms: proper labels, ARIA attributes
- Keyboard navigation throughout
- Color contrast for readability
- Screen reader friendly

---

## TESTING CHECKLIST

- [ ] Manager can create floor observation
- [ ] Manager can view past observations
- [ ] Manager can create 1:1 for team member
- [ ] Manager can view their 1:1s
- [ ] Manager can view 1:1s shared by other managers
- [ ] GM can view all coaching activity
- [ ] Role-play scenarios load and are searchable
- [ ] Quick reference card displays correctly
- [ ] Coaching guide is searchable
- [ ] Data persists across sessions
- [ ] Mobile responsive
- [ ] Print views work correctly

---

## DEPLOYMENT NOTES

1. Add /refs folder to Git (these are static assets)
2. Run Supabase migrations
3. Update Vercel environment variables if needed
4. Deploy to staging first
5. Test all features
6. Deploy to production

---

## EXAMPLE IMPLEMENTATION START

```jsx
// src/components/coaching/CoachingDashboard.jsx
import React from 'react';
import { GraduationCap, Eye, Users, PlayCircle, Book, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachingDashboard = () => {
  const navigate = useNavigate();
  
  const tools = [
    {
      icon: <Eye size={32} />,
      title: 'Floor Observations',
      description: 'Track behaviors and coaching during shifts',
      route: '/coaching/observations',
      color: 'chiliRed'
    },
    {
      icon: <Users size={32} />,
      title: 'Weekly 1:1s',
      description: 'Conduct and view team member development conversations',
      route: '/coaching/1on1s',
      color: 'chiliNavy'
    },
    {
      icon: <PlayCircle size={32} />,
      title: 'Training Scenarios',
      description: '18 role-play exercises for pre-shift practice',
      route: '/coaching/scenarios',
      color: 'chiliGreen'
    },
    {
      icon: <Book size={32} />,
      title: 'Coaching Guide',
      description: 'Searchable coaching manual',
      route: '/coaching/guide',
      color: 'chiliYellow'
    }
  ];
  
  return (
    <div className="coaching-dashboard">
      <h1>🎓 ChiliHead Hospitality Coaching Tools</h1>
      <div className="tools-grid">
        {tools.map(tool => (
          <div 
            key={tool.route}
            className="tool-card"
            onClick={() => navigate(tool.route)}
          >
            <div style={{ color: tool.color }}>
              {tool.icon}
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachingDashboard;
```

---

## FINAL NOTES

- **Priority Order:** 
  1. Floor Observations (daily use)
  2. Weekly 1:1s (most complex, highest value)
  3. Training Scenarios (pre-shift tool)
  4. Coaching Guide (reference)
  5. Quick Reference & At-A-Glance (nice-to-have widgets)

- **Phase 1 (MVP):** Floor Observations + 1:1s
- **Phase 2:** Training Scenarios + Guide
- **Phase 3:** Analytics & GM Dashboard enhancements

This transforms your coaching materials from 2003-style printouts into a 2025 interactive management platform. All data is real-time, shareable, and tracked. Managers coach from their phones during shifts and see team development trends over time.

🌶️ Let's build this!
