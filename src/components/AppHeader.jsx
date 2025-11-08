import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { db } from '../supabase';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliCream: 'rgb(248, 247, 245)'
};

const AppHeader = ({ manager, showBack = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Return to manager selection?')) {
      try {
        // End session in Supabase
        const sessionToken = localStorage.getItem('session_token');
        if (sessionToken) {
          await db.sessions.end(sessionToken);
        }

        // Clear local storage
        localStorage.removeItem('session_token');
        localStorage.removeItem('currentManager');

        // Navigate to login
        window.location.href = '/';
      } catch (error) {
        console.error('Error logging out:', error);
        // Still navigate even if session end fails
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {manager && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg" style={{
          backgroundColor: colors.chiliNavy,
          border: `2px solid ${colors.chiliRed}`
        }}>
          <span className="text-white font-medium">{manager.name}</span>
          {manager.is_gm && (
            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{
              backgroundColor: colors.chiliRed,
              color: 'white'
            }}>
              GM
            </span>
          )}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: colors.chiliRed,
          color: 'white'
        }}
        title="Return to Manager Selection"
      >
        <Home size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default AppHeader;
