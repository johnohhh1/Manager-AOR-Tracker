import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clipboard, CheckCircle, AlertTriangle, Clock, Users, Target, TrendingUp } from 'lucide-react';
import { colors, styles, radius, spacing, shadows } from '../styles/design-system';

const ScheduleGuide = ({ onBack }) => {
  const [activePage, setActivePage] = useState('schedule');
  const [expandedSteps, setExpandedSteps] = useState({
    schedule1: true,
    schedule2: true,
    schedule3: true,
    schedule4: true,
    labor1: true,
    labor2: true,
    labor3: true,
    labor4: true
  });

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const scheduleWritingData = {
    step1: {
      title: 'ACES IN PLACES',
      icon: <Users size={28} />,
      color: colors.chiliGreen,
      items: [
        'Have conversations with all TMs on availability to schedule Aces in Places to deliver a great TM and Guest Experience.',
        'Validate that current availability is accurate in HotSchedules for schedule writing.',
        'Core vs Fringe exercise completed: Identify core 2/3 and Fringe 1/3 and ensure availability is up to date in HS with each TMs availability.'
      ]
    },
    step2: {
      title: 'UTILIZE THE FORECAST/SCHEDULE TIMELINE',
      icon: <Calendar size={28} />,
      color: colors.chiliYellow,
      items: [
        'Follow the timeline.',
        'Forecasts done by Fri 4PM.',
        'Write schedules Mon-Wed.',
        'Schedules reviewed & finalized by Fri 4PM.',
        'DOs review schedules Mon.',
        'Schedules posted by Mon 5PM.'
      ],
      timeline: true
    },
    step3: {
      title: 'WRITING A GREAT SCHEDULE',
      icon: <Target size={28} />,
      color: colors.chiliNavy,
      sections: [
        {
          subtitle: 'LABOR VOLUME CHART',
          items: [
            'Leverage blue bars to ensure schedules align to the forecast.',
            'USE chart to adjust in/out times as needed and to inspect/coach adherence to the schedule.',
          ]
        },
        {
          subtitle: 'GUEST PER HOUR',
          items: [
            'Check out GPH targets by job codes. This shows you what drives productivity targets.',
            'Opening and closing fixed hours are provided based on volume bands.'
          ]
        }
      ]
    },
    step4: {
      title: 'POST SCHEDULES BY 5PM ON MONDAYS',
      icon: <Clock size={28} />,
      color: '#0891B2',
      emphasis: true,
      message: 'In order to create a better quality of life for your TMs, make sure to post all schedules by 5pm on Mondays.'
    }
  };

  const laborCardData = {
    step1: {
      title: 'HS LABOR CARD SETUP',
      icon: <CheckCircle size={28} />,
      color: '#0891B2',
      intro: 'To setup your Labor Card go to Reporting > Dashboard > Labor Card Settings in HotSchedules. Setup your Labor Card to the following specs:',
      settings: [
        { label: 'Labor Card Details', value: 'Check Guest, Actual and Cumulative Guests' },
        { label: 'Roster Details', value: 'Check everything EXCEPT Phone Number' },
        { label: 'Row Separator', value: 'Check Alternate Shading' },
        { label: 'Report Modules', value: 'Show Overtime Warnings' },
        { label: 'Available Shifts', value: 'Check AM & PM' },
        { label: 'Schedules', value: 'Select them All' },
        { label: 'Print Preference', value: 'Landscape' },
        { label: 'SAVE settings', value: '✓ Complete setup' }
      ],
      proTip: 'Once you SAVE, it will automatically save your settings moving forward.'
    },
    step2: {
      title: 'PRE-SHIFT',
      icon: <Users size={28} />,
      color: colors.chiliGreen,
      items: [
        'Print Labor Card each morning of the shift for accurate hours',
        'Review TMs approaching OT & highlight',
        'Know who your first outs will be starting Thursday',
        'Identify Peak Times during shift hand off'
      ],
      proTip: 'Reviewing OT Thurs. allows you to focus on reducing hours for TMs with excessive OT'
    },
    step3: {
      title: 'RUNNING THE SHIFT',
      icon: <TrendingUp size={28} />,
      color: colors.chiliYellow,
      items: [
        'Run flash report every hour to compare cumulative Guest forecast to actual - write in Guest counts on the Labor Card.',
        'Make cuts if necessary',
        'On busy shifts, first cut TMs\' stations should be filled up then cut during peak business hours. *DO NOT wait to cut.',
        'Write the actual time that TMs clock out on the Labor Card to compare to scheduled out time.'
      ],
      proTip: 'Saving 25 minutes a day will help eliminate almost 3 hours of OT each week.'
    },
    step4: {
      title: 'POST SHIFT',
      icon: <Clipboard size={28} />,
      color: colors.chiliNavy,
      items: [
        'Keep Labor Card for schedule writing reference for two weeks in the Quarterly Binder for when writing schedules.'
      ]
    }
  };

  const timelineData = [
    { day: 'DAYS BEFORE WEEK SCHEDULES START', role: 'GM', task: 'COMPLETE FORECAST BY 4PM', span: 2, bg: '#0891B2' },
    { day: 'TU', role: 'SW', task: 'WRITE SCHEDULES', span: 2, bg: colors.chiliNavy },
    { day: 'TH', role: 'GM', task: 'REVIEW SCHEDULES & INCORPORATE FEEDBACK', span: 2, bg: '#0891B2' },
    { day: 'FR', role: 'All Mgrs', task: 'INSPECT FORECAST & ADJUST IF NEEDED', span: 1, bg: colors.chiliRed },
    { day: 'SAT', role: '', task: '', span: 1, bg: 'transparent' },
    { day: 'SUN', role: '', task: '', span: 1, bg: 'transparent' },
    { day: 'MON', role: 'SW', task: 'INCORPORATE EDITS BY 4PM', span: 1, bg: colors.chiliNavy },
    { day: 'TU (SCHEDULE STARTS THIS WEEK)', role: 'DO', task: 'POST SCHEDULE BY 5PM', span: 2, bg: colors.chiliGreen }
  ];

  const renderScheduleWriting = () => (
    <div className="space-y-6">
      {/* Step 1 */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${scheduleWritingData.step1.color}` }}
        onClick={() => toggleStep('schedule1')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${scheduleWritingData.step1.color} 0%, ${colors.chiliGreenBright} 100%)`,
                  boxShadow: `0 4px 16px ${scheduleWritingData.step1.color}80`
                }}>
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {scheduleWritingData.step1.title}
                </h2>
              </div>
            </div>
            {scheduleWritingData.step1.icon}
          </div>

          {expandedSteps.schedule1 && (
            <div className="mt-6 space-y-4 pl-4">
              {scheduleWritingData.step1.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0" style={{ color: scheduleWritingData.step1.color }}>•</span>
                  <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2 with Timeline */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${scheduleWritingData.step2.color}` }}
        onClick={() => toggleStep('schedule2')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${scheduleWritingData.step2.color} 0%, #F59E0B 100%)`,
                  boxShadow: `0 4px 16px ${scheduleWritingData.step2.color}80`
                }}>
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {scheduleWritingData.step2.title}
                </h2>
              </div>
            </div>
            {scheduleWritingData.step2.icon}
          </div>

          {expandedSteps.schedule2 && (
            <div className="mt-6 space-y-6 pl-4">
              {/* Timeline items */}
              <div className="space-y-3">
                {scheduleWritingData.step2.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: scheduleWritingData.step2.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visual Timeline */}
              <div className="mt-6 overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-7 gap-2 text-xs">
                    <div className="col-span-1 p-3 rounded-lg text-center font-bold" style={{
                      backgroundColor: colors.whiteAlpha(0.15),
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}>
                      9 DAYS BEFORE<br/>FRI 4PM<br/><span style={{ color: colors.chiliYellow }}>GM: Forecasts Due</span>
                    </div>
                    <div className="col-span-2 p-3 rounded-lg text-center font-bold" style={{
                      backgroundColor: colors.navyAlpha(0.3),
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}>
                      MON-WED<br/><span style={{ color: colors.chiliGreen }}>SW: Write Schedules</span>
                    </div>
                    <div className="col-span-2 p-3 rounded-lg text-center font-bold" style={{
                      backgroundColor: colors.whiteAlpha(0.15),
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}>
                      FRI 4PM<br/><span style={{ color: colors.chiliYellow }}>GM: Review & Finalize</span>
                    </div>
                    <div className="col-span-1 p-3 rounded-lg text-center font-bold" style={{
                      backgroundColor: colors.redAlpha(0.3),
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}>
                      MON<br/><span style={{ color: colors.chiliRed }}>DO Review</span>
                    </div>
                    <div className="col-span-1 p-3 rounded-lg text-center font-bold" style={{
                      backgroundColor: colors.navyAlpha(0.3),
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}>
                      MON 5PM<br/><span style={{ color: colors.chiliGreen }}>POST!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* WATCHOUT Box */}
              <div className="p-4 rounded-lg" style={{
                backgroundColor: `${colors.chiliYellow}40`,
                borderLeft: `4px solid ${colors.chiliYellow}`
              }}>
                <p className="font-bold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  <AlertTriangle size={20} />
                  WATCHOUT: Avoid making adjustments or generating labor more than 10 days prior to schedules posting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 3 */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${scheduleWritingData.step3.color}` }}
        onClick={() => toggleStep('schedule3')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${scheduleWritingData.step3.color} 0%, ${colors.chiliNavyLight} 100%)`,
                  boxShadow: `0 4px 16px ${scheduleWritingData.step3.color}80`
                }}>
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {scheduleWritingData.step3.title}
                </h2>
              </div>
            </div>
            {scheduleWritingData.step3.icon}
          </div>

          {expandedSteps.schedule3 && (
            <div className="mt-6 space-y-8 pl-4">
              {/* Labor Volume Chart */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.chiliYellow }}>
                  LABOR VOLUME CHART
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: scheduleWritingData.step3.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      Leverage blue bars to ensure schedules align to the forecast.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: scheduleWritingData.step3.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      USE chart to adjust in/out times as needed and to inspect/coach adherence to the schedule.
                    </span>
                  </div>
                </div>

                {/* Visual Labor Volume Chart */}
                <div className="p-6 rounded-lg" style={{
                  backgroundColor: colors.whiteAlpha(0.05),
                  border: `2px solid ${colors.whiteAlpha(0.15)}`
                }}>
                  <div className="flex items-end justify-between gap-2 h-48 mb-4">
                    {[
                      { time: '11am', height: 25, guests: 45, scheduled: 8 },
                      { time: '12pm', height: 55, guests: 95, scheduled: 14 },
                      { time: '1pm', height: 80, guests: 140, scheduled: 18 },
                      { time: '2pm', height: 65, guests: 110, scheduled: 16 },
                      { time: '3pm', height: 35, guests: 60, scheduled: 10 },
                      { time: '4pm', height: 30, guests: 50, scheduled: 9 },
                      { time: '5pm', height: 45, guests: 80, scheduled: 13 },
                      { time: '6pm', height: 90, guests: 160, scheduled: 20 },
                      { time: '7pm', height: 95, guests: 170, scheduled: 21 },
                      { time: '8pm', height: 75, guests: 130, scheduled: 17 },
                      { time: '9pm', height: 50, guests: 85, scheduled: 13 },
                      { time: '10pm', height: 30, guests: 50, scheduled: 9 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full mb-2">
                          {/* Blue forecast bar */}
                          <div
                            className="w-full rounded-t transition-all"
                            style={{
                              height: `${bar.height * 1.8}px`,
                              backgroundColor: '#3B82F6',
                              boxShadow: '0 -2px 8px rgba(59, 130, 246, 0.3)'
                            }}>
                          </div>
                          {/* Red scheduled line overlay */}
                          <div
                            className="absolute bottom-0 left-0 w-full border-t-4 border-red-500"
                            style={{
                              bottom: `${(bar.scheduled / 21) * bar.height * 1.8}px`
                            }}>
                          </div>
                          {/* Tooltip on hover */}
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-90 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                            Guests: {bar.guests}<br/>
                            Sched: {bar.scheduled}
                          </div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {bar.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-6 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Forecast Volume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-1 rounded" style={{ backgroundColor: '#EF4444' }}></div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Scheduled Labor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Per Hour */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.chiliYellow }}>
                  GUEST PER HOUR (GPH)
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: scheduleWritingData.step3.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      Check out GPH targets by job codes. This shows you what drives productivity targets.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: scheduleWritingData.step3.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      Opening and closing fixed hours are provided based on volume bands.
                    </span>
                  </div>
                </div>

                {/* GPH Targets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{
                    backgroundColor: colors.whiteAlpha(0.05),
                    borderRadius: radius.lg
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: colors.navyAlpha(0.3) }}>
                        <th className="px-4 py-3 text-left font-bold" style={{ color: colors.chiliYellow }}>Position</th>
                        <th className="px-4 py-3 text-center font-bold" style={{ color: colors.chiliYellow }}>Min</th>
                        <th className="px-4 py-3 text-center font-bold" style={{ color: colors.chiliYellow }}>Max</th>
                        <th className="px-4 py-3 text-center font-bold" style={{ color: colors.chiliYellow }}>Red-Light Target*</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { position: 'Server', min: 0, max: 1, target: '67.5' },
                        { position: 'Dish', min: 0, max: 1, target: '87.5' },
                        { position: 'Host', min: 0, max: 3, target: '120.0' },
                        { position: 'Runner', min: 1, max: 10, target: '32.0' },
                        { position: 'Bartender', min: 0, max: '2 R', target: '129.5' },
                        { position: 'Expo', min: 1, max: '2 R', target: '159.0' },
                        { position: 'Host', min: 0, max: 3, target: '46.6' },
                        { position: 'QA', min: 0, max: 2, target: '109.0' }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-t" style={{ borderColor: colors.whiteAlpha(0.1) }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                            {row.position}
                          </td>
                          <td className="px-4 py-3 text-center" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                            {row.min}
                          </td>
                          <td className="px-4 py-3 text-center" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                            {row.max}
                          </td>
                          <td className="px-4 py-3 text-center font-bold" style={{ color: colors.chiliGreen }}>
                            {row.target}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs mt-3 italic" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    *May vary by band/market and day of week
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 4 - Emphasis Card */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{
          borderLeft: `6px solid ${scheduleWritingData.step4.color}`,
          background: `linear-gradient(135deg, ${colors.whiteAlpha(0.12)} 0%, ${colors.whiteAlpha(0.08)} 100%)`
        }}
        onClick={() => toggleStep('schedule4')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
              style={{
                background: `linear-gradient(135deg, ${scheduleWritingData.step4.color} 0%, #06B6D4 100%)`,
                boxShadow: `0 8px 24px ${scheduleWritingData.step4.color}80`
              }}>
              4
            </div>
          </div>
          <h2 className="text-3xl font-bold uppercase mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            {scheduleWritingData.step4.title}
          </h2>
          {expandedSteps.schedule4 && (
            <p className="text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {scheduleWritingData.step4.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderLaborCard = () => (
    <div className="space-y-6">
      {/* Step 1 - Setup Checklist */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${laborCardData.step1.color}` }}
        onClick={() => toggleStep('labor1')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${laborCardData.step1.color} 0%, #06B6D4 100%)`,
                  boxShadow: `0 4px 16px ${laborCardData.step1.color}80`
                }}>
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {laborCardData.step1.title}
                </h2>
              </div>
            </div>
            {laborCardData.step1.icon}
          </div>

          {expandedSteps.labor1 && (
            <div className="mt-6 space-y-6 pl-4">
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                {laborCardData.step1.intro}
              </p>

              <div className="space-y-3">
                {laborCardData.step1.settings.map((setting, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{
                    backgroundColor: colors.whiteAlpha(0.05)
                  }}>
                    <CheckCircle size={20} style={{ color: colors.chiliGreen, flexShrink: 0 }} />
                    <div className="flex-1">
                      <span className="font-bold" style={{ color: colors.chiliYellow }}>{setting.label}: </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{setting.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRO TIP */}
              <div className="p-4 rounded-lg" style={{
                backgroundColor: colors.redAlpha(0.2),
                borderLeft: `4px solid ${colors.chiliRed}`
              }}>
                <p className="font-bold flex items-start gap-2" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  <span style={{ color: colors.chiliRed }}>PRO TIP!</span> {laborCardData.step1.proTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 2 - Pre-Shift */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${laborCardData.step2.color}` }}
        onClick={() => toggleStep('labor2')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${laborCardData.step2.color} 0%, ${colors.chiliGreenBright} 100%)`,
                  boxShadow: `0 4px 16px ${laborCardData.step2.color}80`
                }}>
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {laborCardData.step2.title}
                </h2>
              </div>
            </div>
            {laborCardData.step2.icon}
          </div>

          {expandedSteps.labor2 && (
            <div className="mt-6 space-y-6 pl-4">
              <div className="space-y-4">
                {laborCardData.step2.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: laborCardData.step2.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* PRO TIP */}
              <div className="p-4 rounded-lg" style={{
                backgroundColor: colors.redAlpha(0.2),
                borderLeft: `4px solid ${colors.chiliRed}`
              }}>
                <p className="font-bold flex items-start gap-2" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  <span style={{ color: colors.chiliRed }}>PRO TIP!</span> {laborCardData.step2.proTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 3 - Running the Shift */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${laborCardData.step3.color}` }}
        onClick={() => toggleStep('labor3')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${laborCardData.step3.color} 0%, #F59E0B 100%)`,
                  boxShadow: `0 4px 16px ${laborCardData.step3.color}80`
                }}>
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {laborCardData.step3.title}
                </h2>
              </div>
            </div>
            {laborCardData.step3.icon}
          </div>

          {expandedSteps.labor3 && (
            <div className="mt-6 space-y-6 pl-4">
              <div className="space-y-4">
                {laborCardData.step3.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0" style={{ color: laborCardData.step3.color }}>•</span>
                    <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* PRO TIP */}
              <div className="p-4 rounded-lg" style={{
                backgroundColor: colors.redAlpha(0.2),
                borderLeft: `4px solid ${colors.chiliRed}`
              }}>
                <p className="font-bold flex items-start gap-2" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  <span style={{ color: colors.chiliRed }}>PRO TIP!</span> {laborCardData.step3.proTip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 4 - Post Shift */}
      <div
        className="bg-white rounded-lg shadow-md transition-all relative overflow-hidden cursor-pointer"
        style={{ borderLeft: `6px solid ${laborCardData.step4.color}` }}
        onClick={() => toggleStep('labor4')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${laborCardData.step4.color} 0%, ${colors.chiliNavyLight} 100%)`,
                  boxShadow: `0 4px 16px ${laborCardData.step4.color}80`
                }}>
                4
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  {laborCardData.step4.title}
                </h2>
              </div>
            </div>
            {laborCardData.step4.icon}
          </div>

          {expandedSteps.labor4 && (
            <div className="mt-6 space-y-4 pl-4">
              {laborCardData.step4.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0" style={{ color: laborCardData.step4.color }}>•</span>
                  <span className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ ...styles.header, marginBottom: spacing.xl }}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="bg-white bg-opacity-20 p-2 rounded-md hover:bg-opacity-30 transition-all cursor-pointer"
              title="Back to Home">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold uppercase text-center flex-1" style={{
              color: 'white',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}>
              📋 SCHEDULE & LABOR GUIDE
            </h1>
            <div style={{ width: '40px' }}></div>
          </div>
          <p className="text-center text-yellow-100 text-lg font-medium">
            Your clipboard reference for schedule writing and labor card execution
          </p>
        </div>

        {/* Page Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActivePage('schedule')}
            className="px-8 py-4 rounded-full font-bold text-base transition-all transform hover:scale-105"
            style={activePage === 'schedule' ? {
              background: `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliRedDark} 100%)`,
              color: 'white',
              boxShadow: `-4px 4px 0px 0px rgba(0, 0, 0, 0.25), 0 0 30px ${colors.redAlpha(0.5)}`,
              border: 'none'
            } : {
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.75)',
              border: `2px solid ${colors.whiteAlpha(0.3)}`
            }}
            onMouseEnter={(e) => {
              if (activePage === 'schedule') {
                e.currentTarget.style.transform = 'translate(-2px, -2px) scale(1.05)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage === 'schedule') {
                e.currentTarget.style.transform = 'translate(0, 0) scale(1.05)';
                e.currentTarget.style.filter = 'brightness(1)';
              }
            }}>
            📅 SCHEDULE WRITING
          </button>
          <button
            onClick={() => setActivePage('labor')}
            className="px-8 py-4 rounded-full font-bold text-base transition-all transform hover:scale-105"
            style={activePage === 'labor' ? {
              background: `linear-gradient(135deg, ${colors.chiliRed} 0%, ${colors.chiliRedDark} 100%)`,
              color: 'white',
              boxShadow: `-4px 4px 0px 0px rgba(0, 0, 0, 0.25), 0 0 30px ${colors.redAlpha(0.5)}`,
              border: 'none'
            } : {
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.75)',
              border: `2px solid ${colors.whiteAlpha(0.3)}`
            }}
            onMouseEnter={(e) => {
              if (activePage === 'labor') {
                e.currentTarget.style.transform = 'translate(-2px, -2px) scale(1.05)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage === 'labor') {
                e.currentTarget.style.transform = 'translate(0, 0) scale(1.05)';
                e.currentTarget.style.filter = 'brightness(1)';
              }
            }}>
            📊 LABOR CARD EXECUTION
          </button>
        </div>

        {/* Content */}
        <div className="px-6">
          {activePage === 'schedule' ? renderScheduleWriting() : renderLaborCard()}
        </div>
      </div>
    </div>
  );
};

export default ScheduleGuide;
