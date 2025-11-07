import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Shield } from 'lucide-react';
import { supabase, db } from '../supabase';

const colors = {
  chiliRed: 'rgb(237, 28, 36)',
  chiliNavy: 'rgb(34, 35, 91)',
  chiliYellow: 'rgb(255, 198, 11)',
  chiliGreen: 'rgb(116, 158, 51)',
  chiliCream: 'rgb(248, 247, 245)',
  chiliBrown: 'rgb(60, 58, 53)',
  chiliGray: 'rgb(161, 159, 154)'
};

const aorTitles = {
  culinary: {
    title: 'Culinary Leader / SAFE Leader',
    shortTitle: 'Culinary',
    icon: '👨‍🍳'
  },
  hospitality: {
    title: 'Hospitality Leader',
    shortTitle: 'Hospitality',
    icon: '🤝'
  },
  togoBar: {
    title: 'To-Go/Bar Leader',
    shortTitle: 'To-Go/Bar',
    icon: '🍹'
  }
};

const ManagerLogin = ({ setManager, setSessionToken }) => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .order('is_gm', { ascending: false })
        .order('name');

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error loading managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectManager = async (manager) => {
    try {
      // Create session in Supabase
      const session = await db.sessions.create(manager.id, manager.primary_aor);

      // Store only the token in localStorage
      localStorage.setItem('session_token', session.session_token);
      setSessionToken(session.session_token);
      setManager(manager);

      // Track activity in manager_aor_activity
      await supabase.from('manager_aor_activity').insert({
        manager_id: manager.id,
        current_aor: manager.primary_aor,
        primary_aor: manager.primary_aor
      });

      // Navigate based on role
      if (manager.is_gm) {
        navigate('/gm-dashboard');
      } else {
        navigate('/manager-dashboard');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to log in. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 className="text-4xl font-bold mb-2">🌶️ Chili's #605</h1>
        <p className="text-xl opacity-90">Auburn Hills</p>
        <p className="text-lg opacity-75 mt-2">Manager AOR Tracker</p>
      </div>

      {/* Manager Selection */}
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.chiliNavy }}>
          <Users className="inline mr-2" size={28} />
          Select Your Profile
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: colors.chiliBrown }}>
              Loading manager profiles...
            </div>
          </div>
        ) : managers.length === 0 ? (
          <div className="text-center py-12" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            border: `3px solid ${colors.chiliRed}`
          }}>
            <p className="text-lg mb-4" style={{ color: colors.chiliNavy }}>
              No managers found. Please run the database migration first.
            </p>
            <p className="text-sm" style={{ color: colors.chiliBrown }}>
              Run <code>supabase/managers_migration.sql</code> in your Supabase SQL Editor
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {managers.map(manager => {
              const aor = manager.primary_aor ? aorTitles[manager.primary_aor] : null;
              const displayTitle = manager.is_gm
                ? { title: 'General Manager / Managing Partner', shortTitle: 'GM', icon: '👑' }
                : aor;

              return (
                <button
                  key={manager.id}
                  onClick={() => selectManager(manager)}
                  style={{
                    backgroundColor: 'white',
                    border: `3px solid ${manager.is_gm ? colors.chiliRed : colors.chiliNavy}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
                          {manager.name}
                        </h3>
                        {manager.is_gm && (
                          <Crown size={24} style={{ color: colors.chiliRed }} />
                        )}
                      </div>

                      {displayTitle && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{displayTitle.icon}</span>
                          <p style={{ color: colors.chiliBrown, fontWeight: '500' }}>
                            {displayTitle.title}
                          </p>
                        </div>
                      )}

                      {manager.email && (
                        <p className="text-sm mt-2" style={{ color: colors.chiliGray }}>
                          {manager.email}
                        </p>
                      )}
                    </div>

                    <div style={{
                      backgroundColor: manager.is_gm ? colors.chiliRed : colors.chiliGreen,
                      color: 'white',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {manager.is_gm ? (
                        <>
                          <Shield size={16} />
                          GM
                        </>
                      ) : (
                        'Manager'
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Admin Quick Access (only show if managers exist) */}
        {!loading && managers.length > 0 && managers.some(m => m.is_gm) && (
          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(237, 28, 36, 0.1)',
            borderRadius: '12px',
            border: `2px dashed ${colors.chiliRed}`
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold mb-1" style={{ color: colors.chiliRed }}>
                  🔧 GM Quick Actions
                </h3>
                <p className="text-sm" style={{ color: colors.chiliBrown }}>
                  Manage manager assignments and team settings
                </p>
              </div>
              <button
                onClick={() => {
                  const gm = managers.find(m => m.is_gm);
                  if (gm) {
                    localStorage.setItem('currentManager', JSON.stringify(gm));
                    setManager(gm);
                    navigate('/gm-admin');
                  }
                }}
                style={{
                  backgroundColor: colors.chiliRed,
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Admin Panel →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerLogin;
