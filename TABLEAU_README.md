# Tableau Integration - Next Steps

## ✅ What's Been Done

1. **Created TableauDashboards Component** (`src/components/TableauDashboards.jsx`)
   - Beautiful branded interface matching your Chili's design system
   - Tab navigation for 5 dashboards: RAP Portal, GWAP, P&L, Comps, Server Scorecard
   - Loads Tableau Embedding API automatically
   - Proper error handling and loading states

2. **Added Route** to AppFixed.jsx
   - New `/tableau` route accessible from anywhere in the app
   - Protected - requires logged-in manager

3. **Added Menu Button** to App.jsx
   - New "Tableau Analytics" button on main dashboard
   - Shows "📊 Live Metrics" badge
   - Navy blue border to match analytics theme

## 🚀 How to Test

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Log in to your app** (use any manager login)

3. **Click "Tableau Analytics"** button on the main dashboard

4. **Expected behavior:**
   - Should load the dashboards interface
   - Tabs will appear for each dashboard
   - Dashboards will attempt to load from tab.brinker.com
   - You'll see loading states while dashboards initialize

## ⚠️ Important Notes

### Authentication
- The dashboards are currently loading with direct URLs
- Your PAT token expires Nov 9, 2026
- **For production**: You'll want to add server-side authentication (see tableau-integration-plan.md in project docs)

### Network Requirements
- You must be on Brinker's network OR have VPN access to see the dashboards
- Tableau server (tab.brinker.com) must be accessible
- CORS must be configured on Tableau server to allow your app domain

### If Dashboards Don't Load
This is expected if you're not on Brinker network. You'll see error states with options to:
- Reload the page
- Navigate back to dashboard

## 📝 Next Steps (Optional Enhancements)

1. **Add Server-Side Auth** (Recommended for production)
   - See `/mnt/user-data/outputs/TABLEAU_INTEGRATION.md` for detailed guide
   - Create Vercel serverless function for secure PAT handling
   - Add environment variables to Vercel

2. **Role-Based Dashboard Filtering**
   - Show different dashboards based on manager's AOR
   - Hospitality leaders see GWAP, Server Scorecard
   - Culinary leaders see different metrics

3. **Add More Dashboards**
   - Kitchen Sync validation
   - Food quality metrics
   - SAFE scores
   - To-Go accuracy

4. **Mobile Optimization**
   - Test on mobile devices
   - Adjust heights for smaller screens
   - Consider simplified mobile-only dashboards

## 🎨 Branding

The component uses your existing design system:
- **Colors**: Chili Red (#c8102e), Navy (#1a2332, #2d3e50), Cream (#f5f5dc)
- **Icons**: From lucide-react
- **Styles**: From your `styles/design-system.js`

## 📚 Files Created

1. `src/components/TableauDashboards.jsx` - Main component
2. Updated `src/AppFixed.jsx` - Added route
3. Updated `src/App.jsx` - Added menu button

## 🐛 Troubleshooting

**Dashboard shows error state:**
- Check network connection to tab.brinker.com
- Verify you're on Brinker network/VPN
- Check browser console for specific errors

**"Loading" appears forever:**
- Tableau Embedding API may be blocked
- Check browser console for script loading errors
- Try refreshing the page

**Dashboards are blank:**
- URL might be incorrect for your specific Tableau site
- Check that you have permissions to view these dashboards
- PAT token may have expired

## Need Help?

Check the comprehensive integration guide:
- Location: `/mnt/user-data/outputs/TABLEAU_INTEGRATION.md`
- Covers authentication, troubleshooting, and advanced features

You can also hand this off to Claude Code for deeper integration work!
