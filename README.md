# 🌶️ Manager AOR Tracker - Chili's #605

A comprehensive task tracking and accountability system for Chili's restaurant management teams. Built specifically for tracking Areas of Responsibility (AOR) across Culinary, Hospitality, and To-Go/Bar leadership roles.

## 🚀 Features

### Core Functionality
- **Role-Based Task Management** - Customized task lists for each leadership role
- **Brinker Fiscal Calendar** - Accurate P&L period tracking (5-4-4 quarter pattern)
- **Daily/Weekly/Monthly/Quarterly Tasks** - Organized by frequency with progress tracking
- **GM Dashboard** - Complete team oversight and performance metrics
- **Offline-First Architecture** - Works without internet, syncs when online
- **Real-Time Progress Tracking** - Visual indicators and completion percentages

### Technical Features
- ⚡ **Vite + React** - Lightning fast development and build times
- 🔄 **Supabase Backend** - Cloud sync and data persistence
- 📱 **Mobile Responsive** - Works on any device
- 🎨 **Official Chili's Branding** - Matches corporate color scheme
- 📊 **Period Metrics** - Historical performance tracking
- 🔒 **Secure Data Storage** - Row-level security ready

## 📸 Screenshots

### Manager View
- Daily task tracking with completion status
- Core responsibilities dashboard
- Fiscal period awareness

### GM Dashboard  
- Team performance overview
- Individual manager progress
- Period-end task monitoring

## 🛠️ Installation

### Quick Start (Local Only)
```bash
# Clone the repository
git clone https://github.com/johnohhh1/Manager-AOR-Tracker.git
cd Manager-AOR-Tracker

# Install dependencies
npm install

# Run locally
npm run dev
```

### With Supabase Backend (Recommended)
1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Run SQL from `supabase/schema.sql`

2. **Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. **Start Application**
```bash
npm run dev
```

## 📅 Fiscal Calendar

Currently tracking **FY26 Period 5, Week 1** (Oct 30 - Nov 5, 2025)

| Quarter | Periods | Pattern |
|---------|---------|---------|
| Q1 | P1-P3 | 5-4-4 weeks |
| Q2 | P4-P6 | 5-4-4 weeks |
| Q3 | P7-P9 | 5-4-4 weeks |
| Q4 | P10-P12 | 5-4-4 weeks |

## 🏢 Manager Roles

### Culinary Leader / SAFE Leader
- Kitchen operations and food safety
- COS (Cost of Sales) management
- HOH team development
- Food quality metrics (72%+ goal)

### Hospitality Leader  
- Guest satisfaction (GWAP 2.3% target)
- FOH team management
- Culture calendar execution
- Service standards enforcement

### To-Go/Bar Leader
- To-Go operations (9% missing items target)
- Bar incremental sales ($10 goal)
- Liquor cost management
- MCR sign-up tracking

## 📊 Database Schema

```sql
managers           -- Manager profiles and roles
task_completions   -- Daily task tracking
team_members      -- GM team associations
period_metrics    -- Historical performance data
```

## 🤝 Contributing

This tool was built specifically for Chili's #605 operations. For modifications:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Proprietary - Built for Chili's Bar & Grill #605 Auburn Hills, MI

## 🏆 Acknowledgments

- Built by the management team at Chili's #605
- Ranked 25th out of 1,600 locations nationwide
- Focused on Excellence Through Leadership & Accountability

## 📞 Support

For questions or issues, contact the management team at Chili's #605

---

**Remember:** Don't be that manager running Excel sheets in 2025. This is how we execute with excellence. 🌶️💪

**ChiliHead Commitment:** Every task, every day, no excuses.
