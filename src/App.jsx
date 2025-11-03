import React, { useState, useEffect } from 'react';
import { ChevronLeft, Settings, Users, BarChart3, CheckSquare, Calendar, Clock, AlertTriangle, TrendingUp, Edit3, Plus, Trash2, Eye, Shield } from 'lucide-react';

// Official Chili's Brand Colors
const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliRedAlt: 'rgb(232, 27, 35)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliNavyAlt: 'rgb(23, 37, 84)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliYellowAlt: 'rgb(254, 198, 13)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliGreenAlt: 'rgb(108, 192, 74)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliBrown: 'rgb(60, 58, 53)',
  chiliGray: 'rgb(161, 159, 154)'
};

// Manager AOR Responsibilities from updated spreadsheet
const managerResponsibilities = {
  culinary: {
    title: "Culinary Leader / SAFE Leader",
    shortTitle: "Culinary",
    allManagersOwn: [
      { task: "Big Swings and how leader impacts them", frequency: "Daily" },
      { task: "Brand Standards & Chili's Clean", frequency: "Daily" },
      { task: "QLC", frequency: "Daily" },
      { task: "Managers on the floor proactively engaging with Guests", frequency: "Daily" },
      { task: "Culture of ChiliHead Recognition", frequency: "Daily" },
      { task: "TM Development / Staffing Plan: cross-training TM 1:1s", frequency: "Weekly" },
      { task: "Ensure schedules are aligned to forecast", frequency: "Weekly" },
      { task: "Training and I-9s: 100% completion", frequency: "Weekly" },
      { task: "Dress Guidelines", frequency: "Daily" },
      { task: "Executing Manager Timeline", frequency: "DAILY" }
    ],
    coreResponsibilities: [
      "KitchenSync Validation: Job Aids / systems followed / prepped in order / Pull Thaw by 12pm",
      "Five to Drive execution – preps & procedures",
      "Dine-In & To-Go orders made to spec and sold 100",
      "Review and discuss Safe scores (93%+)",
      "COS results for food = analyze reporting, solves, coaching / HOH Connection Board updated daily"
    ],
    specificTasks: [
      { task: "EOP AOR Slide For Allen Due By 5pm 1st day of Period", frequency: "Monthly" },
      { task: "HOH Job Aids", frequency: "EOP" },
      { task: "COS: Inventory", frequency: "EOP" },
      { task: "COS: Mid-Month (As needed)", frequency: "Mid Mo" },
      { task: "COS: Action Plan", frequency: "EOP" },
      { task: "COS: COS Board Picture", frequency: "EOP" },
      { task: "Food Great @ 72%", frequency: "Weekly" },
      { task: "Coach TM's >72% (PT)", frequency: "Weekly" },
      { task: "HOH TM Reviews", frequency: "As Needed" },
      { task: "HOH Schedules (Posted Mon 5pm 2wks out)", frequency: "Mon-Wed" },
      { task: "HOH Training @ 100%", frequency: "Weekly" },
      { task: "HOH VBT @ 100%", frequency: "Weekly" },
      { task: "HOH VFD @ 100%", frequency: "Weekly" },
      { task: "HOH TM Meal Inspect", frequency: "Weekly" },
      { task: "Validate GSE", frequency: "QTRLY" },
      { task: "Marketing Guide Validation", frequency: "Monthly" },
      { task: "Trainer Meeting", frequency: "QTRLY" },
      { task: "HOH LINC By Whens", frequency: "Weekly" },
      { task: "Big Swing Rollouts", frequency: "QTRLY" },
      { task: "Steritech Self Audit", frequency: "Monthly" }
    ]
  },
  hospitality: {
    title: "Hospitality Leader",
    shortTitle: "Hospitality",
    allManagersOwn: [
      { task: "Big Swings and how leader impacts them", frequency: "Daily" },
      { task: "Brand Standards & Chili's Clean", frequency: "Daily" },
      { task: "QLC", frequency: "Daily" },
      { task: "Managers on the floor proactively engaging with Guests", frequency: "Daily" },
      { task: "Culture of ChiliHead Recognition", frequency: "Daily" },
      { task: "TM Development / Staffing Plan: cross-training TM 1:1s", frequency: "Weekly" },
      { task: "Ensure schedules are aligned to forecast", frequency: "Weekly" },
      { task: "Training and I-9s: 100% completion", frequency: "Weekly" },
      { task: "Dress Guidelines", frequency: "Daily" },
      { task: "Executing Manager Timeline", frequency: "DAILY" }
    ],
    coreResponsibilities: [
      "Dine-In GWAP – 2.3% or lower",
      "Coach servers below 82% Server Attentive and 73% Clean",
      "ChiliHead Hospitality Behavior by position",
      "5/10 Culture",
      "My Chili's / Guests Per Hour",
      "Culture Calendar"
    ],
    specificTasks: [
      { task: "EOP AOR Slide For Allen Due By 5pm 1st day of Period", frequency: "Monthly" },
      { task: "Big Swing Rollouts", frequency: "monthly" },
      { task: "Steritech Self Audit", frequency: "Weekly" },
      { task: "Incremental Add Ons @ $8", frequency: "Weekly" },
      { task: "Validate Standard Table Greet", frequency: "Weekly" },
      { task: "Coach TM's Missing Goals (PT)", frequency: "Weekly" },
      { task: "FOH TM Reviews", frequency: "As Needed" },
      { task: "FOH Schedules (Posted Mon 5pm 2wks out)", frequency: "Mon-Wed" },
      { task: "FOH Training @ 90%", frequency: "Weekly" },
      { task: "FOH VBT @ 90%", frequency: "Weekly" },
      { task: "FOH VFD @ 90%", frequency: "Weekly" },
      { task: "Connection Board Inspect", frequency: "Weekly" },
      { task: "Marketing Guide Validation", frequency: "Monthly" },
      { task: "Culture Calendar Planning", frequency: "Monthly" },
      { task: "Trainer Meeting", frequency: "QTRLY" },
      { task: "FOH BSB/LINC By Whens", frequency: "Weekly" },
      { task: "DSI Order", frequency: "Monthly" }
    ]
  },
  togoBar: {
    title: "To-Go Leader / Bar Leader",
    shortTitle: "To-Go/Bar",
    allManagersOwn: [
      { task: "Big Swings and how leader impacts them", frequency: "Daily" },
      { task: "Brand Standards & Chili's Clean", frequency: "Daily" },
      { task: "QLC", frequency: "Daily" },
      { task: "Managers on the floor proactively engaging with Guests", frequency: "Daily" },
      { task: "Culture of ChiliHead Recognition", frequency: "Daily" },
      { task: "TM Development / Staffing Plan: cross-training TM 1:1s", frequency: "Weekly" },
      { task: "Ensure schedules are aligned to forecast", frequency: "Weekly" },
      { task: "Training and I-9s: 100% completion", frequency: "Weekly" },
      { task: "Dress Guidelines", frequency: "Daily" },
      { task: "Executing Manager Timeline", frequency: "DAILY" }
    ],
    coreResponsibilities: [
      "To-Go Missing Items 9% or lower",
      "Coach TMs over 9% and Praise TMs below",
      "COS results for liquor = review monthly trends, analyze reporting, solves, coaching",
      "Scheduling 2nd Bartenders & Bar Servers"
    ],
    specificTasks: [
      { task: "EOP AOR Slide For Allen Due By 5pm 1st day of Period", frequency: "Monthly" },
      { task: "ToGo GWAP @ <10%", frequency: "Weekly" },
      { task: "ToGo Missing Items @ 8%", frequency: "Weekly" },
      { task: "Bar Incremental @ $10", frequency: "Weekly" },
      { task: "MCR Sign Ups", frequency: "Weekly" },
      { task: "Coach TM's Missing Goals (PT)", frequency: "Weekly" },
      { task: "Training Team Board Update", frequency: "Monthly" },
      { task: "Bar/ToGo Reviews", frequency: "Jan & Jun" },
      { task: "Trainer Meeting", frequency: "QTRLY" },
      { task: "COS: Action Plan", frequency: "QTRLY" },
      { task: "B/W/L Orders", frequency: "Weekly" },
      { task: "Marketing Guide Validation", frequency: "Monthly" },
      { task: "Incremental Sales/BWL Contest", frequency: "Monthly" },
      { task: "MOTM/Bar/ToGo/LINC By When", frequency: "Weekly" },
      { task: "Office Depot Order", frequency: "Monthly" },
      { task: "Big Swing Rollouts", frequency: "QTRLY" },
      { task: "Steritech Self Audit", frequency: "Monthly" },
      { task: "Validate Perfect Frozen Margs", frequency: "Monthly" },
      { task: "Monthly Safety", frequency: "" }
    ]
  }
};

// Fiscal Calendar Functions - Fixed for proper Brinker FY26
const getFiscalInfo = () => {
  const today = new Date();
  
  // FY26 Period Structure - proper Brinker fiscal calendar
  const periods = [
    // Q1 (5-4-4 pattern)
    { period: 1, weeks: 5, startDate: new Date('2025-06-26'), endDate: new Date('2025-07-30') },
    { period: 2, weeks: 4, startDate: new Date('2025-07-31'), endDate: new Date('2025-08-27') },
    { period: 3, weeks: 4, startDate: new Date('2025-08-28'), endDate: new Date('2025-09-24') },
    // Q2 (5-4-4 pattern)
    { period: 4, weeks: 5, startDate: new Date('2025-09-25'), endDate: new Date('2025-10-29') },
    { period: 5, weeks: 4, startDate: new Date('2025-10-30'), endDate: new Date('2025-11-26') },
    { period: 6, weeks: 4, startDate: new Date('2025-11-27'), endDate: new Date('2025-12-24') },
    // Q3 (5-4-4 pattern)
    { period: 7, weeks: 5, startDate: new Date('2025-12-25'), endDate: new Date('2026-01-28') },
    { period: 8, weeks: 4, startDate: new Date('2026-01-29'), endDate: new Date('2026-02-25') },
    { period: 9, weeks: 4, startDate: new Date('2026-02-26'), endDate: new Date('2026-03-25') },
    // Q4 (5-4-4 pattern)
    { period: 10, weeks: 5, startDate: new Date('2026-03-26'), endDate: new Date('2026-04-29') },
    { period: 11, weeks: 4, startDate: new Date('2026-04-30'), endDate: new Date('2026-05-27') },
    { period: 12, weeks: 4, startDate: new Date('2026-05-28'), endDate: new Date('2026-06-24') }
  ];
  
  // Find current period
  let currentPeriod = 5; // Default to P5 for Nov 2
  let currentWeekInPeriod = 1;
  let totalWeeks = 4;
  
  for (const p of periods) {
    if (today >= p.startDate && today <= p.endDate) {
      currentPeriod = p.period;
      totalWeeks = p.weeks;
      
      // Calculate week within period (Thu-Wed cycles)
      const daysSincePeriodStart = Math.floor((today - p.startDate) / (1000 * 60 * 60 * 24));
      currentWeekInPeriod = Math.floor(daysSincePeriodStart / 7) + 1;
      break;
    }
  }
  
  return {
    fiscalYear: 26,
    period: currentPeriod,
    week: currentWeekInPeriod,
    totalWeeks: totalWeeks
  };
};

const fiscalInfo = getFiscalInfo();

const ManagerAORTracker = () => {
  // Setup state
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [setupForm, setSetupForm] = useState({
    managerName: '',
    aor: '',
    isGM: false
  });
  
  // App state
  const [currentView, setCurrentView] = useState('home');
  const [selectedFrequency, setSelectedFrequency] = useState('daily');
  const [taskCompletions, setTaskCompletions] = useState({});
  const [manager, setManager] = useState(null);
  
  // GM View - simulate manager data (in real app, this would come from database)
  const [managerTeam, setManagerTeam] = useState([
    { name: 'Tiffany Larkins', aor: 'culinary', completions: {} },
    { name: 'Tiff Wright', aor: 'hospitality', completions: {} },
    { name: 'Jason Roberts', aor: 'togoBar', completions: {} }
  ]);

  // Get tasks organized by frequency
  const getTasksByFrequency = (aor) => {
    const aorData = managerResponsibilities[aor];
    const allTasks = [
      ...aorData.allManagersOwn,
      ...aorData.specificTasks
    ];
    
    const organized = {
      daily: [],
      weekly: [],
      monthly: [],
      quarterly: [],
      other: []
    };
    
    allTasks.forEach(item => {
      const freq = item.frequency.toLowerCase();
      if (freq.includes('daily')) {
        organized.daily.push(item.task);
      } else if (freq.includes('weekly') || freq === 'mon-wed') {
        organized.weekly.push(item.task);
      } else if (freq.includes('monthly') || freq === 'eop' || freq === 'mid mo') {
        organized.monthly.push(item.task);
      } else if (freq.includes('qtrly') || freq.includes('quarterly') || freq === 'jan & jun') {
        organized.quarterly.push(item.task);
      } else if (freq.includes('as needed') || freq === '') {
        organized.other.push(item.task);
      } else {
        organized.other.push(item.task);
      }
    });
    
    return organized;
  };

  const tasksByFrequency = manager && !manager.isGM ? getTasksByFrequency(manager.aor) : {};

  // Task completion handlers
  const toggleTask = (taskIndex) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${selectedFrequency}_${today}`;
    const taskKey = `task_${taskIndex}`;
    const isCompleted = !taskCompletions[key]?.[taskKey];

    setTaskCompletions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [taskKey]: isCompleted
      }
    }));
  };

  const getCompletionStats = (frequency, aor = null, completionsData = null) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${frequency}_${today}`;
    const targetAor = aor || manager?.aor;
    const targetCompletions = completionsData || taskCompletions;
    
    if (!targetAor) return { completed: 0, total: 0 };
    
    const tasks = getTasksByFrequency(targetAor)[frequency] || [];
    const completed = Object.values(targetCompletions[key] || {}).filter(Boolean).length;
    return { completed, total: tasks.length };
  };

  // Setup Screen
  if (!isSetupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.chiliCream }}>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.chiliNavy }}>
              🌶️ Manager AOR Tracker
            </h1>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              Let's get you set up!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliNavy }}>
                Your Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': colors.chiliRed }}
                placeholder="Enter your name"
                value={setupForm.managerName}
                onChange={(e) => setSetupForm(prev => ({ ...prev, managerName: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.chiliNavy }}>
                Your Role *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': colors.chiliRed }}
                value={setupForm.isGM ? 'gm' : setupForm.aor}
                onChange={(e) => {
                  if (e.target.value === 'gm') {
                    setSetupForm(prev => ({ ...prev, aor: '', isGM: true }));
                  } else {
                    setSetupForm(prev => ({ ...prev, aor: e.target.value, isGM: false }));
                  }
                }}
              >
                <option value="">Choose your role...</option>
                <option value="gm">General Manager (View All)</option>
                <option value="culinary">Culinary Leader / SAFE Leader</option>
                <option value="hospitality">Hospitality Leader</option>
                <option value="togoBar">To-Go Leader / Bar Leader</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                if (!setupForm.managerName || (!setupForm.aor && !setupForm.isGM)) {
                  alert('❌ Please fill in all fields');
                  return;
                }
                setManager({
                  name: setupForm.managerName,
                  aor: setupForm.aor,
                  isGM: setupForm.isGM
                });
                setIsSetupComplete(true);
                
                if (setupForm.isGM) {
                  alert(`🌶️ Welcome ${setupForm.managerName}! Your GM Dashboard is ready!`);
                } else {
                  alert(`🌶️ Welcome ${setupForm.managerName}! Your ${managerResponsibilities[setupForm.aor].title} tracker is ready!`);
                }
              }}
              className="w-full py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.chiliRed }}
            >
              Start Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GM Dashboard View
  if (manager?.isGM && currentView === 'home') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
        {/* Header */}
        <div className="text-white p-6" style={{ background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliRedAlt}, ${colors.chiliYellow})` }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">🌶️ GM Dashboard - Team Progress</h1>
              <p className="text-yellow-100">Welcome back, {manager.name}!</p>
            </div>
            <button 
              onClick={() => {
                if (window.confirm('Reset your profile?')) {
                  setIsSetupComplete(false);
                  setManager(null);
                  setSetupForm({ managerName: '', aor: '', isGM: false });
                  setTaskCompletions({});
                }
              }}
              className="bg-white bg-opacity-20 px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-30 transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
          <p className="text-center text-yellow-100 text-lg font-medium">Excellence Through Leadership & Accountability</p>
        </div>

        {/* Fiscal Info */}
        <div className="bg-white border-b-4 border-opacity-90 p-4 text-center" style={{ borderColor: colors.chiliNavy }}>
          <p className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
            Fiscal Period {fiscalInfo.period} • Week {fiscalInfo.week} of {fiscalInfo.totalWeeks}
          </p>
        </div>

        {/* Team Overview Cards */}
        <div className="p-6 space-y-4">
          {managerTeam.map((mgr, index) => {
            const aorData = managerResponsibilities[mgr.aor];
            const dailyStats = getCompletionStats('daily', mgr.aor, mgr.completions);
            const weeklyStats = getCompletionStats('weekly', mgr.aor, mgr.completions);
            const monthlyStats = getCompletionStats('monthly', mgr.aor, mgr.completions);
            
            const dailyProgress = dailyStats.total > 0 ? Math.round((dailyStats.completed / dailyStats.total) * 100) : 0;
            const weeklyProgress = weeklyStats.total > 0 ? Math.round((weeklyStats.completed / weeklyStats.total) * 100) : 0;
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Manager Header */}
                <div className="p-4" style={{ backgroundColor: colors.chiliNavy }}>
                  <h2 className="text-xl font-bold text-white">{mgr.name}</h2>
                  <p className="text-yellow-200 text-sm">{aorData.title}</p>
                </div>

                {/* Progress Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1" style={{ color: dailyProgress === 100 ? colors.chiliGreen : colors.chiliRed }}>
                        {dailyProgress}%
                      </div>
                      <div className="text-sm" style={{ color: colors.chiliBrown }}>Daily Tasks</div>
                      <div className="text-xs" style={{ color: colors.chiliGray }}>
                        {dailyStats.completed}/{dailyStats.total}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1" style={{ color: weeklyProgress === 100 ? colors.chiliGreen : colors.chiliYellow }}>
                        {weeklyProgress}%
                      </div>
                      <div className="text-sm" style={{ color: colors.chiliBrown }}>Weekly Tasks</div>
                      <div className="text-xs" style={{ color: colors.chiliGray }}>
                        {weeklyStats.completed}/{weeklyStats.total}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1" style={{ color: colors.chiliNavy }}>
                        {monthlyStats.completed}/{monthlyStats.total}
                      </div>
                      <div className="text-sm" style={{ color: colors.chiliBrown }}>Monthly Tasks</div>
                      <div className="text-xs" style={{ color: colors.chiliGray }}>Completed</div>
                    </div>
                  </div>

                  {/* Daily Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: colors.chiliBrown }}>
                      <span>Daily Progress</span>
                      <span>{dailyProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${dailyProgress}%`, 
                          backgroundColor: dailyProgress === 100 ? colors.chiliGreen : colors.chiliRed 
                        }}
                      />
                    </div>
                  </div>

                  {/* Weekly Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: colors.chiliBrown }}>
                      <span>Weekly Progress</span>
                      <span>{weeklyProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${weeklyProgress}%`, 
                          backgroundColor: weeklyProgress === 100 ? colors.chiliGreen : colors.chiliYellow 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Summary */}
        <div className="mx-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
              📊 Team Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['daily', 'weekly', 'monthly'].map(freq => {
                let totalCompleted = 0;
                let totalTasks = 0;
                
                managerTeam.forEach(mgr => {
                  const stats = getCompletionStats(freq, mgr.aor, mgr.completions);
                  totalCompleted += stats.completed;
                  totalTasks += stats.total;
                });
                
                const teamProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
                
                return (
                  <div key={freq} className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.chiliCream }}>
                    <div className="text-2xl font-bold mb-1" style={{ 
                      color: teamProgress === 100 ? colors.chiliGreen : 
                             teamProgress >= 75 ? colors.chiliYellow : colors.chiliRed 
                    }}>
                      {teamProgress}%
                    </div>
                    <div className="text-sm font-medium" style={{ color: colors.chiliNavy }}>
                      Team {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </div>
                    <div className="text-xs" style={{ color: colors.chiliBrown }}>
                      {totalCompleted}/{totalTasks} tasks
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Manager Home Screen
  if (currentView === 'home') {
    const dailyStats = getCompletionStats('daily');
    const weeklyStats = getCompletionStats('weekly');
    const aorData = managerResponsibilities[manager.aor];

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
        {/* Header */}
        <div className="text-white p-6" style={{ background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliRedAlt}, ${colors.chiliYellow})` }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">🌶️ {aorData.title}</h1>
              <p className="text-yellow-100">Welcome back, {manager.name}!</p>
            </div>
            <button 
              onClick={() => {
                if (window.confirm('Reset your profile?')) {
                  setIsSetupComplete(false);
                  setManager(null);
                  setSetupForm({ managerName: '', aor: '', isGM: false });
                  setTaskCompletions({});
                }
              }}
              className="bg-white bg-opacity-20 px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-30 transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
          <p className="text-center text-yellow-100 text-lg font-medium">Excellence Through Leadership & Accountability</p>
        </div>

        {/* Fiscal Info */}
        <div className="bg-white border-b-4 border-opacity-90 p-4 text-center" style={{ borderColor: colors.chiliNavy }}>
          <p className="font-bold text-lg" style={{ color: colors.chiliNavy }}>
            Fiscal Period {fiscalInfo.period} • Week {fiscalInfo.week} of {fiscalInfo.totalWeeks}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4" style={{ borderColor: colors.chiliRed }}>
            <h3 className="text-2xl font-bold" style={{ color: colors.chiliRed }}>
              {Math.round((dailyStats.completed / dailyStats.total) * 100) || 0}%
            </h3>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>Today's Progress</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4" style={{ borderColor: colors.chiliGreen }}>
            <h3 className="text-2xl font-bold" style={{ color: colors.chiliGreen }}>{weeklyStats.completed}/{weeklyStats.total}</h3>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>Weekly Tasks</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4" style={{ borderColor: colors.chiliYellow }}>
            <h3 className="text-2xl font-bold" style={{ color: colors.chiliYellow }}>P{fiscalInfo.period}</h3>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>Current Period</p>
          </div>
        </div>

        {/* Core Responsibilities */}
        <div className="mx-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
              🎯 Core Responsibilities
            </h2>
            <ul className="space-y-2">
              {aorData.coreResponsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2" style={{ color: colors.chiliRed }}>•</span>
                  <span style={{ color: colors.chiliBrown }}>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Menu */}
        <div className="p-6 space-y-4">
          <button
            onClick={() => { setSelectedFrequency('daily'); setCurrentView('tasks'); }}
            className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <CheckSquare size={32} style={{ color: colors.chiliNavy }} className="mr-4" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>Daily Tasks</h3>
                <p style={{ color: colors.chiliBrown }}>All Managers Own + Daily Operations</p>
                <p className="text-sm font-medium" style={{ color: colors.chiliRed }}>
                  {dailyStats.completed}/{dailyStats.total} complete
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setSelectedFrequency('weekly'); setCurrentView('tasks'); }}
            className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Calendar size={32} style={{ color: colors.chiliNavy }} className="mr-4" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>Weekly Tasks</h3>
                <p style={{ color: colors.chiliBrown }}>Weekly Responsibilities</p>
                <p className="text-sm font-medium" style={{ color: colors.chiliRed }}>
                  {weeklyStats.completed}/{weeklyStats.total} complete
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setSelectedFrequency('monthly'); setCurrentView('tasks'); }}
            className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <BarChart3 size={32} style={{ color: colors.chiliNavy }} className="mr-4" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>Monthly Tasks</h3>
                <p style={{ color: colors.chiliBrown }}>Monthly & EOP Responsibilities</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setSelectedFrequency('quarterly'); setCurrentView('tasks'); }}
            className="w-full bg-white rounded-lg p-6 text-left shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <TrendingUp size={32} style={{ color: colors.chiliNavy }} className="mr-4" />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>Quarterly Tasks</h3>
                <p style={{ color: colors.chiliBrown }}>Quarterly Responsibilities</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Tasks View
  if (currentView === 'tasks') {
    const tasks = tasksByFrequency[selectedFrequency] || [];
    const today = new Date().toISOString().split('T')[0];
    const key = `${selectedFrequency}_${today}`;
    const stats = getCompletionStats(selectedFrequency);
    const progress = (stats.completed / stats.total) * 100;

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.chiliCream }}>
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center">
          <button onClick={() => setCurrentView('home')} className="mr-4 cursor-pointer hover:opacity-70 transition-opacity">
            <ChevronLeft size={24} style={{ color: colors.chiliNavy }} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              {selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1)} Tasks
            </h1>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              {manager.name} • {managerResponsibilities[manager.aor].title}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white m-4 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold" style={{ color: colors.chiliNavy }}>
              {stats.completed}/{stats.total} Tasks Completed
            </h2>
            <span className="text-2xl font-bold" style={{ color: colors.chiliRed }}>
              {Math.round(progress) || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress || 0}%`, 
                backgroundColor: progress === 100 ? colors.chiliGreen : colors.chiliRed 
              }}
            />
          </div>
          {progress === 100 && (
            <div className="mt-4 text-center">
              <p className="text-2xl">🔥🙌🔥</p>
              <p className="text-lg font-bold" style={{ color: colors.chiliGreen }}>
                YOU CRUSHED IT!
              </p>
            </div>
          )}
        </div>

        {/* Frequency Selector */}
        <div className="mx-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(tasksByFrequency).filter(freq => tasksByFrequency[freq].length > 0).map(freq => (
              <button
                key={freq}
                onClick={() => setSelectedFrequency(freq)}
                className={`px-4 py-2 rounded-md font-medium cursor-pointer ${
                  selectedFrequency === freq 
                    ? 'text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                style={selectedFrequency === freq ? { backgroundColor: colors.chiliRed } : {}}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="mx-4 mb-4 space-y-2">
          {tasks.map((task, index) => {
            const taskKey = `task_${index}`;
            const isCompleted = taskCompletions[key]?.[taskKey] || false;
            
            return (
              <div
                key={index}
                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                  isCompleted ? 'bg-green-50' : ''
                }`}
                style={{ borderColor: isCompleted ? colors.chiliGreen : colors.chiliGray }}
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleTask(index)}
                    className="mr-3 w-5 h-5 rounded"
                    style={{ accentColor: colors.chiliGreen }}
                  />
                  <span
                    className={`${isCompleted ? 'line-through' : ''}`}
                    style={{ color: isCompleted ? colors.chiliGray : colors.chiliNavy }}
                  >
                    {task}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default ManagerAORTracker;
