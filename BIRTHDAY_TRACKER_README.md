# 🎂 Birthday Tracker - Feature Documentation

## Overview
The Birthday Tracker is a comprehensive team birthday management system that helps you celebrate your team members' special days. It integrates seamlessly with your team management system and follows the Chili's dark glassmorphic design system.

## 🌟 Features

### 1. **Dashboard Views**
- **Upcoming View** - Shows birthdays in the next 60 days
- **By Month View** - Filter birthdays by specific month
- **All Birthdays** - Complete list of team birthdays

### 2. **Smart Stats Cards**
- 🎉 **Today** - Birthdays happening today
- 📅 **This Week** - Birthdays in the next 7 days
- 🎂 **This Month** - Birthdays in the next 30 days
- 👥 **Total Team** - Total team members with birthdays on file

### 3. **Birthday Cards**
Each birthday card displays:
- Team member name with birthday icon
- Position badge (Server, Host, Kitchen, etc.)
- Birthday date and upcoming age
- Days until birthday countdown
- Urgency indicator (color-coded by proximity)
- Quick contact buttons (Call/Email)

### 4. **Urgency System**
Birthday cards are color-coded by urgency:
- 🎉 **TODAY** (Red) - Birthday is today!
- 🎂 **This Week** (Yellow) - Birthday within 7 days
- 📅 **This Month** (Green) - Birthday within 30 days
- ⏰ **Later** (Gray) - Birthday more than 30 days away

### 5. **Search & Filter**
- **Search by name** - Quick search functionality
- **Filter by position** - Show specific team roles
- **Filter by month** - View birthdays for any month

### 6. **Export to Excel**
Download birthday lists with:
- Name, Position, Birthday Date
- Age and Days Until Birthday
- Phone and Email contact info

## 📱 Usage

### Accessing Birthday Tracker
1. From the main dashboard, click **"Birthday Tracker"**
2. Or navigate directly to `/birthdays` route

### Importing Birthdays from Excel
1. Go to **Team Management** (`/team`)
2. Click **"Upload Excel File"**
3. Select your TM Roster Excel file
4. The system automatically parses "Date of Birth" column
5. Birthdays are imported along with team member data

### Viewing Birthdays
- **Upcoming Tab** - See the next 60 days of birthdays
- **By Month Tab** - Select any month to view
- **All Birthdays Tab** - Complete birthday list

### Contacting Team Members
- Click **Call** button to initiate phone call
- Click **Email** button to send email
- Contact info comes from team management data

## 🎨 Design System

### Colors Used
- **Chili Red** (`rgb(237, 28, 36)`) - Today's birthdays, primary accents
- **Chili Yellow** (`rgb(255, 198, 11)`) - This week, highlights
- **Chili Green** (`rgb(116, 158, 51)`) - This month, position badges
- **Chili Navy** (`rgb(34, 35, 91)`) - Background, headers
- **White Alpha** - Glassmorphic cards with transparency

### Component Styling
- **Glassmorphic cards** - `backdrop-filter: blur(12px)`
- **Gradient header** - Red to yellow gradient
- **Pill buttons** - Rounded with active/inactive states
- **Shadows** - Multi-layer shadows for depth
- **Responsive grid** - 1-3 columns based on screen size

## 🗄️ Database Schema

### team_members table
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  position TEXT NOT NULL,
  date_of_birth DATE,  -- NEW COLUMN
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Migration
Run this SQL in Supabase dashboard:
```bash
# File: supabase/add_birthday_column_migration.sql
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS date_of_birth DATE;
CREATE INDEX IF NOT EXISTS idx_team_members_birthday ON team_members(date_of_birth);
```

## 💻 Technical Implementation

### Excel Date Parsing
Excel stores dates as serial numbers (days since 1900-01-01):
```javascript
const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0]; // YYYY-MM-DD
};
```

### Birthday Calculation
```javascript
const getDaysUntilBirthday = (dateOfBirth) => {
  const today = new Date();
  const birthday = new Date(dateOfBirth);
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  );

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffDays = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
  return diffDays;
};
```

### Age Calculation
```javascript
const getAge = (dateOfBirth) => {
  const today = new Date();
  const birthday = new Date(dateOfBirth);
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  return age;
};
```

## 📁 File Structure

```
src/
├── components/
│   ├── BirthdayTracker.jsx          # Main birthday tracker component
│   └── TeamManagement.jsx           # Updated with birthday parsing
├── styles/
│   └── design-system.js             # Shared design tokens
└── AppFixed.jsx                     # Router with /birthdays route
supabase/
└── add_birthday_column_migration.sql # Database migration
```

## 🚀 Setup Instructions

### 1. Run Database Migration
In Supabase SQL Editor:
```sql
-- Copy contents of supabase/add_birthday_column_migration.sql
-- Run in your Supabase dashboard
```

### 2. Import Team Data
1. Navigate to `/team`
2. Click "Upload Excel File"
3. Select your TM Roster with "Date of Birth" column
4. Confirm import with birthday count

### 3. Start Using
1. Navigate to `/birthdays`
2. View upcoming birthdays
3. Export lists as needed
4. Contact team members directly

## 🎯 Pro Tips

### For Managers
- Check weekly for upcoming birthdays
- Export monthly lists for planning
- Use contact buttons for quick birthday wishes
- Keep team data updated in Team Management

### For GMs
- Review birthday tracker in team meetings
- Coordinate celebration budgets
- Track recognition efforts
- Ensure all team members have birthdays on file

### Best Practices
- Update birthdays when onboarding new team members
- Double-check dates when importing from Excel
- Export lists at beginning of month for planning
- Use urgency colors to prioritize outreach

## 🔮 Future Enhancements

Potential features for future updates:
- [ ] Birthday reminder notifications
- [ ] Celebration budget tracker
- [ ] Birthday recognition log
- [ ] Team birthday calendar export (iCal)
- [ ] Birthday wishes sent tracker
- [ ] Integration with company recognition program
- [ ] Birthday month statistics and insights

## 🐛 Troubleshooting

### No birthdays showing
- Check if team members have `date_of_birth` data
- Verify database migration ran successfully
- Try re-importing Excel data with birthday column

### Excel import not parsing birthdays
- Ensure column is named "Date of Birth" exactly
- Check that dates are in Excel date format (not text)
- Verify Excel file matches expected structure

### Birthday calculation seems wrong
- Check system timezone settings
- Verify date format in database (YYYY-MM-DD)
- Test with known birthdays to validate logic

## 📞 Support

For issues or feature requests:
1. Check this documentation first
2. Review console for errors
3. Verify database schema matches migration
4. Test with sample data to isolate issues

---

## 🌶️ Final Notes

This Birthday Tracker brings team celebration management into the modern era. No more forgetting birthdays, no more missed celebrations. Just solid data, beautiful UI, and a team that feels appreciated.

**Keep crushing it!** 💪🔥

