# 🚀 Setup Instructions - ChiliHead Manager AOR Tracker

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Quick Start

### Step 1: Extract the Project
If you received this as a ZIP file, extract it to your desired location.

### Step 2: Open Terminal/Command Prompt
Navigate to the project folder:

**Windows (PowerShell):**
```powershell
cd C:\path\to\manager-aor-tracker
```

**Mac/Linux:**
```bash
cd /path/to/manager-aor-tracker
```

### Step 3: Install Dependencies
Run this command (this will take 2-3 minutes the first time):
```bash
npm install
```

### Step 4: Start the App
```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## First Time Usage

1. **Setup Screen**: Enter your name and select your role:
   - General Manager (View All) - See all 3 managers' progress
   - Culinary Leader / SAFE Leader
   - Hospitality Leader
   - To-Go Leader / Bar Leader

2. **Home Screen**: View your dashboard with:
   - Quick stats
   - Core responsibilities
   - Task frequency buttons

3. **Task Tracking**: Click any frequency to view and check off tasks:
   - Daily Tasks
   - Weekly Tasks
   - Monthly Tasks
   - Quarterly Tasks

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### Port 3000 already in use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### App won't start
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Run `npm start`

## Building for Production

To create a production build:
```bash
npm run build
```

The optimized files will be in the `build/` folder.

## Deploying

### Option 1: Vercel (Easiest)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. Follow prompts

### Option 3: Traditional Hosting
1. Run `npm run build`
2. Upload the `build/` folder to your web server
3. Configure server to serve `index.html` for all routes

## Support

For issues or questions, contact:
John Olenski - Managing Partner, Chili's Auburn Hills #605
