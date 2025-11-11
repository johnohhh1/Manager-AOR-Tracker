import React, { useState } from 'react';
import { colors, styles } from '../styles/design-system';

const TableauPATTest = ({ onBack }) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testPAT = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      // Get PAT from environment variables
      const PAT_NAME = import.meta.env.VITE_TABLEAU_PAT_NAME;
      const PAT_SECRET = import.meta.env.VITE_TABLEAU_PAT_SECRET;

      if (!PAT_NAME || !PAT_SECRET) {
        throw new Error('PAT credentials not configured. Please set VITE_TABLEAU_PAT_NAME and VITE_TABLEAU_PAT_SECRET in your .env file');
      }

      console.log('Using PAT from environment - Name:', PAT_NAME, 'Secret:', PAT_SECRET.substring(0, 10) + '...');

      console.log('Testing PAT authentication...');

      // Step 1: Sign in with PAT
      const signInResponse = await fetch('https://tab.brinker.com/api/3.26/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: {
            personalAccessTokenName: PAT_NAME,
            personalAccessTokenSecret: PAT_SECRET,
            site: {
              contentUrl: ''
            }
          }
        })
      });

      console.log('Sign-in response status:', signInResponse.status);

      if (!signInResponse.ok) {
        const errorText = await signInResponse.text();
        throw new Error(`Authentication failed: ${signInResponse.status} - ${errorText}`);
      }

      const signInData = await signInResponse.json();
      console.log('Sign-in successful!', signInData);

      // Step 2: Get workbooks to verify access
      const token = signInData.credentials.token;
      const siteId = signInData.credentials.site.id;

      const workbooksResponse = await fetch(`https://tab.brinker.com/api/3.26/sites/${siteId}/workbooks`, {
        headers: {
          'X-Tableau-Auth': token
        }
      });

      console.log('Workbooks response status:', workbooksResponse.status);

      if (!workbooksResponse.ok) {
        throw new Error(`Failed to get workbooks: ${workbooksResponse.status}`);
      }

      const workbooksData = await workbooksResponse.json();
      console.log('Workbooks data:', workbooksData);

      setResult({
        success: true,
        token: token.substring(0, 20) + '...',
        siteId: siteId,
        workbookCount: workbooksData.workbooks?.workbook?.length || 0,
        message: 'PAT authentication successful! ✅'
      });

    } catch (err) {
      console.error('PAT test error:', err);
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

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
              <h1 className="text-2xl font-bold mb-1">🔑 Tableau PAT Test</h1>
              <p className="text-yellow-100">Testing Personal Access Token Authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Section */}
      <div className="p-6">
        <div 
          className="rounded-xl p-8"
          style={{ 
            backgroundColor: 'white',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
            Test Your PAT Authentication
          </h2>
          
          <p className="mb-6" style={{ color: colors.chiliBrown }}>
            This will test if your Personal Access Token can authenticate with the Tableau server
            and retrieve your workbooks.
          </p>

          <button
            onClick={testPAT}
            disabled={testing}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all mb-6"
            style={{
              backgroundColor: testing ? colors.chiliGray : colors.chiliRed,
              cursor: testing ? 'not-allowed' : 'pointer',
              opacity: testing ? 0.6 : 1
            }}
          >
            {testing ? 'Testing...' : 'Test PAT Connection'}
          </button>

          {/* Results */}
          {result && (
            <div 
              className="p-6 rounded-lg mb-4"
              style={{ 
                backgroundColor: colors.chiliGreen,
                color: 'white'
              }}
            >
              <h3 className="text-xl font-bold mb-3">✅ {result.message}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Token (truncated):</strong> {result.token}</p>
                <p><strong>Site ID:</strong> {result.siteId}</p>
                <p><strong>Workbooks Found:</strong> {result.workbookCount}</p>
              </div>
            </div>
          )}

          {error && (
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: colors.chiliRed,
                color: 'white'
              }}
            >
              <h3 className="text-xl font-bold mb-3">❌ Authentication Failed</h3>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-4 opacity-90">
                This is likely due to CORS restrictions. The PAT may still work when:
              </p>
              <ul className="text-sm mt-2 ml-4 opacity-90">
                <li>• You're on the Brinker network</li>
                <li>• Using server-side authentication (Vercel functions)</li>
                <li>• The app is deployed to production</li>
              </ul>
            </div>
          )}

          {/* Info Box */}
          <div 
            className="p-4 rounded-lg mt-6"
            style={{ 
              backgroundColor: colors.chiliYellow,
              color: colors.chiliBrown
            }}
          >
            <h4 className="font-bold mb-2">⚠️ Important Notes:</h4>
            <ul className="text-sm space-y-1">
              <li>• This test will likely fail due to CORS from localhost</li>
              <li>• CORS errors don't mean your PAT is invalid</li>
              <li>• The PAT will work properly when deployed or on Brinker network</li>
              <li>• Check browser console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauPATTest;
