# Supabase Setup Instructions

## Step 1: Get Your Anon Key

1. Go to: https://supabase.com/dashboard/project/okxfbabeyolgidzwqcxw/settings/api
2. Look for the **"anon"** or **"public"** key (starts with `eyJ...`)
3. Copy that entire key

## Step 2: Update .env File

1. Open the `.env` file in the project root
2. Replace `YOUR_ANON_KEY_HERE` with your actual anon key
3. Save the file

## Step 3: Run Database Migration

1. Go to: https://supabase.com/dashboard/project/okxfbabeyolgidzwqcxw/editor
2. Click **"New Query"**
3. Copy and paste the contents of `supabase/coaching_tables_migration.sql`
4. Click **"Run"** to execute the migration

## Step 4: Restart Dev Server

1. Stop the current dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open http://localhost:3006 (or whatever port it shows)

## You're Done!

The app will now have full cloud sync enabled. All coaching data will be saved to your Supabase database.

## What You Get:

✅ Floor Observations saved to cloud
✅ Weekly 1:1s synced across devices
✅ Team member management
✅ Multi-manager visibility
✅ Analytics and metrics
✅ Historical data tracking

## Troubleshooting:

**If you see "Supabase not configured":**
- Make sure you replaced `YOUR_ANON_KEY_HERE` in `.env`
- Make sure you restarted the dev server
- Check that your anon key is correct

**If database operations fail:**
- Make sure you ran the migration SQL script
- Check the Supabase dashboard for any errors
- Verify your database connection

## Need Help?

The app works in **local-only mode** without Supabase, but you won't have:
- Cloud sync across devices
- Data persistence across browser sessions
- Multi-manager data sharing
- Historical analytics
