import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ManagerAORTracker from './App';
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

const AppFixed = () => {
  const [manager, setManager] = useState(() => {
    const saved = localStorage.getItem('currentManager');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (manager) {
      localStorage.setItem('currentManager', JSON.stringify(manager));
    } else {
      localStorage.removeItem('currentManager');
    }
  }, [manager]);

  return (
    <Router>
      <Routes>
        {/* Main AOR Tracker - pass both manager and setManager */}
        <Route
          path="/"
          element={<ManagerAORTracker manager={manager} setManager={setManager} />}
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

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppFixed;