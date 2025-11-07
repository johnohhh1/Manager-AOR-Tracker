# 🌶️ ChiliHead Manager AOR Tracker - Chili's #605

**John Olenski, Managing Partner**
Chili's Auburn Hills #605 | Ranked 25th of 1,600 Nationwide 🏆

A complete management accountability system for tracking Areas of Responsibility (AOR), team development, and operational excellence. Built by managers, for managers who execute.

---

## 🚀 What This Is

A powerful React app that replaces Excel sheets, paper checklists, and scattered notes with one unified system for managing your restaurant. Tracks tasks, coaching, team development, and performance across all 3 AORs.

### Core Systems

#### 📋 **AOR Task Tracker**
- Daily/Weekly/Monthly/Quarterly tasks by role
- Brinker Fiscal Calendar integration (5-4-4 pattern)
- Real-time completion tracking
- Period metrics and historical performance

#### 👥 **Coaching & Development Suite**
- **Weekly 1-on-1s**: Multi-step wizard with position-specific behaviors, metrics tracking, and development plans
- **Floor Observations**: Document real-time coaching moments with follow-up tracking
- **Training Scenarios**: 18 interactive role-play scenarios by position
- **Coaching Guide**: Observable behaviors, scenarios, and recognition examples
- **Quick Reference**: Mobile-friendly 5-step coaching model
- **Analytics Dashboard**: Real-time coaching metrics and progress tracking

#### 👔 **Manager Account System**
- 4 manager profiles (1 GM + 3 AOR managers)
- Supabase session management (24-hour sessions)
- Role-based dashboards (GM sees all, managers see their AOR)
- Yellow warning when viewing non-primary AOR
- Simple profile selection login (no passwords needed)

#### 🏢 **Team Management**
- Excel import for bulk team member upload
- Position tracking and contact management
- Quick search and filtering

---

## 🎯 The 3 AORs

### 👨‍🍳 Culinary Leader / SAFE Leader
- Kitchen operations & food safety
- COS (Cost of Sales) management
- HOH team development
- Food quality metrics (72%+ goal)
- SAFE compliance and training

### 🤝 Hospitality Leader
- Guest satisfaction (GWAP 2.3% target)
- FOH team management
- Culture calendar execution
- Service standards & hospitality excellence

### 🍹 To-Go/Bar Leader
- To-Go operations (9% missing items target)
- Bar incremental sales ($10 goal)
- Liquor cost management
- MCR sign-up tracking

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite (lightning fast)
- **Backend**: Supabase (PostgreSQL + real-time sync)
- **Styling**: Tailwind CSS + Chili's brand colors
- **Icons**: Lucide React
- **Excel Parsing**: SheetJS (xlsx)

---

## 📦 Installation

### Quick Start (Development)
```bash
# Clone the repo
git clone https://github.com/johnohhh1/Manager-AOR-Tracker.git
cd Manager-AOR-Tracker

# Install dependencies
npm install

# Run dev server
npm run dev
```

### Supabase Setup (Required)

1. **Create Supabase Project** at [supabase.com](https://supabase.com)

2. **Run Database Migrations** (in order):
   ```sql
   supabase/schema.sql                    # Core tables
   supabase/team_members_migration.sql    # Team management
   supabase/managers_migration.sql        # Manager accounts
   supabase/manager_sessions_migration.sql # Session management
   supabase/disable_rls_safe.sql          # Disable RLS for dev
   ```

3. **Configure Environment**:
   ```bash
   # Create .env file
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Deploy to Vercel** (or similar):
   - Add environment variables in Vercel dashboard
   - Connect GitHub repo
   - Deploy automatically on push

---

## 📅 Fiscal Calendar

Currently tracking **FY26 Period 5, Week 1** (Oct 30 - Nov 5, 2025)

Brinker uses a **5-4-4 quarter pattern**:

| Quarter | Periods | Weeks |
|---------|---------|-------|
| Q1 | P1-P3 | 5-4-4 |
| Q2 | P4-P6 | 5-4-4 |
| Q3 | P7-P9 | 5-4-4 |
| Q4 | P10-P12 | 5-4-4 |

**Total**: 12 periods, 52 weeks per fiscal year

---

## 📊 Database Schema

```
managers               # Manager profiles (John + 3 AOR managers)
manager_sessions       # Supabase session tracking (replaces localStorage)
manager_aor_activity   # AOR viewing/switching activity
manager_aor_metrics    # Performance metrics by AOR

team_members          # All team members with positions
task_completions      # Daily/weekly/monthly task tracking
period_metrics        # Historical performance data

one_on_ones          # Weekly 1-on-1 records
floor_observations   # Coaching observations with follow-up
```

---

## 🎨 Design System

### Color Palette (Chili's Official)
```javascript
chiliRed: 'rgb(237, 28, 36)'      // Primary brand
chiliNavy: 'rgb(34, 35, 91)'      // Dark backgrounds
chiliYellow: 'rgb(255, 198, 11)'  // Warnings/highlights
chiliGreen: 'rgb(116, 158, 51)'   // Success states
chiliCream: 'rgb(248, 247, 245)'  // Light backgrounds
chiliBrown: 'rgb(60, 58, 53)'     // Body text
chiliGray: 'rgb(161, 159, 154)'   // Secondary text
```

### Dark Mode
Matches the **ChiliHead Hospitality poster aesthetic**:
- Navy backgrounds with red accents
- Cream text on dark surfaces
- High contrast for kitchen tablet visibility

---

## 🔐 Manager Accounts

**4 Managers Total**:
- **John Olenski** (GM/Managing Partner) - Oversees all 3 AORs, no primary AOR
- **Tiffany Larkins** (Culinary AOR)
- **Tiff Wright** (Hospitality AOR)
- **Jason Roberts** (To-Go/Bar AOR)

**Session Management**:
- Click your profile to login (no passwords)
- 24-hour sessions stored in Supabase
- Auto-extends on activity every 5 minutes
- Only session token stored locally, full data from Supabase

---

## 🚀 What Makes This Different

### No Password Bullshit
You have 4 managers. You don't need OAuth, password resets, or verification emails. Just click your profile and go.

### Built by Managers
Every feature came from real operational needs. No bloat, no enterprise nonsense, just tools that help you execute daily.

### Supabase-First
We're paying for cloud storage - we use it. Sessions, team data, coaching records, all synced in real-time.

### Mobile-Optimized
Dark mode design looks good on kitchen tablets. Quick reference cards fit phone screens. Built for the floor, not just the office.

### Excel Integration
Upload your team roster from HotSchedules export. Don't manually enter 86 people.

---

## 📈 Metrics Tracked

- Task completion rates (by frequency)
- Coaching activity (1-on-1s, observations)
- AOR switching patterns (managers viewing other AORs)
- Session activity (who's logged in, when, from where)
- Team development progress
- Historical performance trends

---

## 🤝 Contributing

This is purpose-built for **Chili's #605**, but the code is clean and modular if you want to fork it.

**To modify**:
1. Fork the repo
2. Create feature branch
3. Test thoroughly (we don't have a test suite yet - we should)
4. Submit PR with clear description

---

## 🏆 Why This Matters

**We're ranked 25th out of 1,600 Chili's locations nationwide.**

That doesn't happen by accident. It happens through:
- Daily execution of core tasks
- Consistent coaching and development
- Clear accountability by AOR
- Real-time visibility into team performance

This tracker is how we **systematize excellence** instead of hoping for it.

---

## 📞 Contact

**John Olenski**
Managing Partner, Chili's #605
Auburn Hills, Michigan
johnolenski@gmail.com

---

## 📝 License

Proprietary - Built for Chili's Bar & Grill #605 Auburn Hills, MI

---

**ChiliHead Commitment**: Every task, every day, no excuses. 🌶️💪

Don't be that manager running Excel sheets in 2025.
