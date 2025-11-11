import React, { useState } from 'react';
import { colors, styles } from '../styles/design-system';
import { BarChart3, Database, Image, FileText, RefreshCw, Users } from 'lucide-react';

const TableauAPIExplorer = ({ onBack }) => {
  const [authToken, setAuthToken] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});

  const PAT_NAME = 'hVuuTMI2Spunl+CnBXmnFw==';
  const PAT_SECRET = 'idxeJumPNgNJyrFepzS8EqlkAv396FUa';

  // Authenticate first
  const authenticate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://tab.brinker.com/api/3.26/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials: {
            personalAccessTokenName: PAT_NAME,
            personalAccessTokenSecret: PAT_SECRET,
            site: { contentUrl: '' }
          }
        })
      });

      if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
      
      const data = await response.json();
      setAuthToken(data.credentials.token);
      setSiteId(data.credentials.site.id);
      setResults(prev => ({ ...prev, auth: 'Success! ✅' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, auth: err.message }));
    }
    setLoading(false);
  };

  // Generic API call function
  const makeAPICall = async (endpoint, key, description) => {
    if (!authToken) {
      setErrors(prev => ({ ...prev, [key]: 'Must authenticate first!' }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://tab.brinker.com/api/3.26/${endpoint}`, {
        headers: { 'X-Tableau-Auth': authToken }
      });

      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [key]: data }));
      setErrors(prev => ({ ...prev, [key]: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err.message }));
    }
    setLoading(false);
  };

  const apiCapabilities = [
    {
      id: 'workbooks',
      name: 'List Workbooks',
      description: 'Get all workbooks you have access to',
      icon: BarChart3,
      endpoint: `sites/${siteId}/workbooks`,
      color: colors.chiliRed
    },
    {
      id: 'views',
      name: 'List Views/Dashboards',
      description: 'Get all views (individual dashboards) in your workbooks',
      icon: Database,
      endpoint: `sites/${siteId}/views`,
      color: colors.chiliNavy
    },
    {
      id: 'datasources',
      name: 'List Data Sources',
      description: 'Get all data sources',
      icon: Database,
      endpoint: `sites/${siteId}/datasources`,
      color: colors.chiliGreen
    },
    {
      id: 'users',
      name: 'List Users',
      description: 'Get users on the site (if you have permissions)',
      icon: Users,
      endpoint: `sites/${siteId}/users`,
      color: colors.chiliYellow
    }
  ];

  return (
    <div style={{ ...styles.pageContainer }}>
      {/* Header */}
      <div style={{ ...styles.header }}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="bg-white bg-opacity-20 p-2 rounded-md mr-3 hover:bg-opacity-30 transition-all"
              style={{ cursor: 'pointer' }}
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-1">🔍 Tableau REST API Explorer</h1>
              <p className="text-yellow-100">Discover what your PAT can do</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="p-6">
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
            Step 1: Authenticate
          </h2>
          <button
            onClick={authenticate}
            disabled={loading || authToken}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
            style={{
              backgroundColor: authToken ? colors.chiliGreen : colors.chiliRed,
              cursor: loading || authToken ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {authToken ? '✅ Authenticated' : loading ? 'Authenticating...' : 'Authenticate with PAT'}
          </button>
          
          {results.auth && (
            <div className="mt-3 text-sm" style={{ color: colors.chiliGreen }}>
              {results.auth}
            </div>
          )}
          {errors.auth && (
            <div className="mt-3 text-sm" style={{ color: colors.chiliRed }}>
              ❌ {errors.auth}
            </div>
          )}
        </div>

        {/* API Capabilities */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
            Step 2: Try API Calls
          </h2>
          <p className="text-sm mb-6" style={{ color: colors.chiliBrown }}>
            Click any capability below to test what data you can retrieve
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiCapabilities.map((capability) => {
              const Icon = capability.icon;
              const hasResult = results[capability.id];
              const hasError = errors[capability.id];

              return (
                <div key={capability.id}>
                  <button
                    onClick={() => makeAPICall(capability.endpoint, capability.id, capability.description)}
                    disabled={!authToken || loading}
                    className="w-full text-left p-4 rounded-lg border-2 transition-all"
                    style={{
                      borderColor: hasResult ? colors.chiliGreen : hasError ? colors.chiliRed : colors.chiliGray,
                      backgroundColor: hasResult ? 'rgba(116, 158, 51, 0.1)' : 'white',
                      cursor: !authToken || loading ? 'not-allowed' : 'pointer',
                      opacity: !authToken ? 0.5 : 1
                    }}
                  >
                    <div className="flex items-start mb-2">
                      <Icon size={24} style={{ color: capability.color }} className="mr-3 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold mb-1" style={{ color: colors.chiliNavy }}>
                          {capability.name}
                        </h3>
                        <p className="text-xs" style={{ color: colors.chiliBrown }}>
                          {capability.description}
                        </p>
                      </div>
                    </div>
                    {hasResult && (
                      <div className="text-xs mt-2 p-2 rounded" style={{ backgroundColor: 'rgba(116, 158, 51, 0.1)' }}>
                        ✅ Success - Click to see in console
                      </div>
                    )}
                    {hasError && (
                      <div className="text-xs mt-2" style={{ color: colors.chiliRed }}>
                        ❌ {hasError}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Display */}
        {Object.keys(results).length > 1 && (
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
              📊 Results Summary
            </h2>
            <div className="space-y-3">
              {Object.entries(results).map(([key, value]) => {
                if (key === 'auth') return null;
                
                let count = 0;
                let itemType = key;
                
                if (value?.workbooks?.workbook) {
                  count = value.workbooks.workbook.length;
                  itemType = 'workbooks';
                } else if (value?.views?.view) {
                  count = value.views.view.length;
                  itemType = 'views';
                } else if (value?.datasources?.datasource) {
                  count = value.datasources.datasource.length;
                  itemType = 'data sources';
                } else if (value?.users?.user) {
                  count = value.users.user.length;
                  itemType = 'users';
                }

                return (
                  <div key={key} className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(116, 158, 51, 0.1)' }}>
                    <div className="font-semibold" style={{ color: colors.chiliNavy }}>
                      Found {count} {itemType}
                    </div>
                    <button
                      onClick={() => console.log(`Full ${key} data:`, value)}
                      className="text-xs mt-1"
                      style={{ color: colors.chiliRed, cursor: 'pointer' }}
                    >
                      → View full data in console
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Capabilities Info */}
        <div className="bg-white rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
            🚀 What Else Can the PAT Do?
          </h2>
          <div className="space-y-3 text-sm" style={{ color: colors.chiliBrown }}>
            <div className="flex items-start">
              <span className="mr-2">📸</span>
              <div>
                <strong>Export Dashboard Images:</strong> Download PNG/PDF snapshots of dashboards
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2">📊</span>
              <div>
                <strong>Query View Data:</strong> Get the actual data behind a dashboard as CSV/JSON
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2">🔄</span>
              <div>
                <strong>Trigger Refreshes:</strong> Refresh data extracts programmatically
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2">📋</span>
              <div>
                <strong>Get Metadata:</strong> View names, descriptions, tags, created dates, etc.
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-2">🎯</span>
              <div>
                <strong>Filter Data:</strong> Apply filters to get specific subsets of data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauAPIExplorer;
