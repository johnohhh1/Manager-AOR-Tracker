# Manager AOR Tracker - Supabase Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Name it something like "manager-aor-tracker"
4. Choose a region close to you
5. Set a strong database password (save it!)

### 3. Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy everything from `supabase/schema.sql` 
4. Paste and click **Run**

### 4. Get Your API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **Anon/Public key** (long string starting with eyJ...)

### 5. Configure Environment
1. Create a `.env` file in your project root:
```bash
cp .env.example .env
```

2. Edit `.env` and add your keys:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Run the App
```bash
npm run dev
```

## 📱 Features

### With Supabase Backend:
- ✅ **Data Persistence** - Tasks save to cloud automatically
- ✅ **Offline Mode** - Works without internet, syncs when back online
- ✅ **Multi-Device** - Access your data from phone, tablet, or computer
- ✅ **Team View** - GMs can see all manager progress
- ✅ **Period Metrics** - Track performance over fiscal periods
- ✅ **Historical Data** - Review past period performance

### Offline Capabilities:
- 📱 App works completely offline
- 💾 Data saves locally first
- 🔄 Auto-syncs when internet returns
- 🟢/🟠 Shows online/offline status

## 🛠️ Troubleshooting

### "Missing Supabase environment variables!"
- Make sure you created the `.env` file
- Check that your keys are correct
- Restart the dev server after adding `.env`

### Can't connect to Supabase
- Check your internet connection
- Verify your Supabase project is active
- Make sure RLS policies are enabled (they are by default in our schema)

### Data not saving
- Check the online/offline indicator
- Look for errors in browser console
- Verify your Supabase project isn't paused

## 📊 Database Structure

### Tables Created:
1. **managers** - Stores manager profiles
2. **task_completions** - Tracks daily task completion
3. **team_members** - Links GMs to their team
4. **period_metrics** - Stores period performance metrics

## 🔐 Security Notes

- The anon key is safe to use in frontend (it's public)
- Row Level Security (RLS) is enabled but currently allows all access
- When you add auth later, we'll update the RLS policies

## 🎯 Next Steps

After setup, you can:
1. Start tracking tasks immediately
2. View progress across devices
3. GMs can monitor team performance
4. Export data for period reports

## 💡 Pro Tips

- Keep the app open in a browser tab for quick access
- Bookmark it on your phone's home screen
- Check the online indicator to ensure syncing
- GMs should have team members set up their profiles first

---

## 🔥 Real Talk

This backend setup takes 5 minutes and gives you:
- Cloud sync across all your devices
- Team visibility for actual accountability
- Historical data to prove you're crushing it
- Or prove your team isn't - either way, FACTS

Don't be that manager running Excel sheets in 2025.
Set up the damn backend and level up. 🌶️💪
