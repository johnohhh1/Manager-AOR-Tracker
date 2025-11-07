import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ManagerAORTracker from './App';
import CoachingDashboard from './components/coaching/CoachingDashboard';
import ObservationList from './components/coaching/FloorObservation/ObservationList';
import ObservationForm from './components/coaching/FloorObservation/ObservationForm';
import OneOnOneList from './components/coaching/Weekly1on1/OneOnOneList';

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

        {/* Placeholder routes - to be implemented in Phase 2 */}
        <Route
          path="/coaching/1on1s/new"
          element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>1:1 Form - Phase 2</h2>
              <p>This feature will be implemented in Phase 2</p>
              <button onClick={() => window.location.href = '/coaching/1on1s'}>← Back to 1:1s</button>
            </div>
          }
        />
        <Route
          path="/coaching/scenarios"
          element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Training Scenarios - Phase 2</h2>
              <p>This feature will be implemented in Phase 2</p>
              <button onClick={() => window.location.href = '/coaching'}>← Back to Dashboard</button>
            </div>
          }
        />
        <Route
          path="/coaching/guide"
          element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Coaching Guide - Phase 2</h2>
              <p>This feature will be implemented in Phase 2</p>
              <button onClick={() => window.location.href = '/coaching'}>← Back to Dashboard</button>
            </div>
          }
        />
        <Route
          path="/coaching/quick-reference"
          element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Quick Reference - Phase 2</h2>
              <p>This feature will be implemented in Phase 2</p>
              <button onClick={() => window.location.href = '/coaching'}>← Back to Dashboard</button>
            </div>
          }
        />
        <Route
          path="/coaching/analytics"
          element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Analytics - Phase 2</h2>
              <p>This feature will be implemented in Phase 2</p>
              <button onClick={() => window.location.href = '/coaching'}>← Back to Dashboard</button>
            </div>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppFixed;