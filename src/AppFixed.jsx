import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ManagerAORTracker from './App';
import ManagerLogin from './components/ManagerLogin';
import AppHeader from './components/AppHeader';
import CoachingDashboard from './components/coaching/CoachingDashboard';
import ObservationList from './components/coaching/FloorObservation/ObservationList';
import ObservationForm from './components/coaching/FloorObservation/ObservationForm';
import OneOnOneList from './components/coaching/Weekly1on1/OneOnOneList';
import OneOnOneForm from './components/coaching/Weekly1on1/OneOnOneForm';
import TrainingScenarios from './components/coaching/TrainingScenarios';
import CoachingGuide from './components/coaching/CoachingGuide';
import QuickReference from './components/coaching/QuickReference';
import Analytics from './components/coaching/Analytics';
import TeamManagement from './components/TeamManagement';
import BirthdayTracker from './components/BirthdayTracker';
import BrandStandardsDashboard from './components/brand-standards/BrandStandardsDashboard';
import BrandStandardsManualNew from './components/BrandStandardsManualNew';
import OracleAlohaGuide from './components/OracleAlohaGuide';
import ScheduleGuide from './components/ScheduleGuide';
import TableauDashboards from './components/TableauDashboards';
import TableauPATTest from './components/TableauPATTest';
import TableauAPIExplorer from './components/TableauAPIExplorer';
import { db } from './supabase';

const AppFixed = () => {
  const [manager, setManager] = useState(null);
  const [sessionToken, setSessionToken] = useState(() => {
    return localStorage.getItem('session_token'); // Only store token, not full data
  });
  const [loading, setLoading] = useState(true);

  // Load session from Supabase on mount
  useEffect(() => {
    const loadSession = async () => {
      if (sessionToken) {
        try {
          const session = await db.sessions.getByToken(sessionToken);
          if (session && session.manager) {
            setManager(session.manager);
          } else {
            // Session expired or invalid
            localStorage.removeItem('session_token');
            setSessionToken(null);
          }
        } catch (error) {
          console.error('Failed to load session:', error);
          localStorage.removeItem('session_token');
          setSessionToken(null);
        }
      }
      setLoading(false);
    };

    loadSession();
  }, [sessionToken]);

  // Update session activity every 5 minutes
  useEffect(() => {
    if (!sessionToken) return;

    const updateActivity = async () => {
      try {
        await db.sessions.updateActivity(sessionToken);
      } catch (error) {
        console.error('Failed to update session activity:', error);
      }
    };

    const interval = setInterval(updateActivity, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [sessionToken]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Router>
      {manager && <AppHeader manager={manager} />}
      <Routes>
        {/* Manager Login - DEFAULT ENTRY POINT */}
        <Route
          path="/"
          element={!manager ? <ManagerLogin setManager={setManager} setSessionToken={setSessionToken} /> : <Navigate to="/dashboard" replace />}
        />

        {/* Main AOR Tracker Dashboard */}
        <Route
          path="/dashboard"
          element={manager ? <ManagerAORTracker manager={manager} setManager={setManager} sessionToken={sessionToken} /> : <Navigate to="/" replace />}
        />

        {/* Coaching Dashboard */}
        <Route
          path="/coaching"
          element={manager ? <CoachingDashboard manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Floor Observations */}
        <Route
          path="/coaching/observations"
          element={manager ? <ObservationList manager={manager} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/coaching/observations/new"
          element={manager ? <ObservationForm manager={manager} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/coaching/observations/:id"
          element={manager ? <ObservationForm manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Weekly 1:1s */}
        <Route
          path="/coaching/1on1s"
          element={manager ? <OneOnOneList manager={manager} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/coaching/1on1s/new"
          element={manager ? <OneOnOneForm manager={manager} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/coaching/1on1s/:id"
          element={manager ? <OneOnOneForm manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Training Scenarios */}
        <Route
          path="/coaching/scenarios"
          element={manager ? <TrainingScenarios manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Coaching Guide */}
        <Route
          path="/coaching/guide"
          element={manager ? <CoachingGuide manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Quick Reference */}
        <Route
          path="/coaching/quick-reference"
          element={manager ? <QuickReference manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Analytics */}
        <Route
          path="/coaching/analytics"
          element={manager ? <Analytics manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Team Management */}
        <Route
          path="/team"
          element={manager ? <TeamManagement manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Birthday Tracker */}
        <Route
          path="/birthdays"
          element={manager ? <BirthdayTracker manager={manager} /> : <Navigate to="/" replace />}
        />

        {/* Brand Standards Validation */}
        <Route
          path="/brand-standards"
          element={manager ? <BrandStandardsDashboard manager={manager} onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Brand Standards Manual */}
        <Route
          path="/brand-standards-manual"
          element={manager ? <BrandStandardsManualNew manager={manager} onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Oracle/Aloha Quick Reference Guide */}
        <Route
          path="/oracle-aloha"
          element={manager ? <OracleAlohaGuide onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Schedule & Labor Card Guide */}
        <Route
          path="/schedule-guide"
          element={manager ? <ScheduleGuide onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Tableau Analytics Dashboards */}
        <Route
          path="/tableau"
          element={manager ? <TableauDashboards onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Tableau PAT Test */}
        <Route
          path="/tableau-test"
          element={manager ? <TableauPATTest onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Tableau API Explorer */}
        <Route
          path="/tableau-api"
          element={manager ? <TableauAPIExplorer onBack={() => window.location.href = '/dashboard'} /> : <Navigate to="/" replace />}
        />

        {/* Catch all - redirect to login if no manager, otherwise home */}
        <Route path="*" element={<Navigate to={manager ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default AppFixed;