# 👥 Manager Accounts System - Specification

## Overview

Build a manager account system where:
- **GM assigns each manager a primary AOR** (their accountability)
- **Managers can VIEW all AORs** (for learning/cross-training)
- **Managers are TRACKED on their assigned AOR** (for performance)
- **GM sees everyone's progress** across all AORs

---

## Database Schema

### managers Table

```sql
CREATE TABLE managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  primary_aor TEXT NOT NULL, -- 'culinary', 'hospitality', 'togoBar'
  is_gm BOOLEAN DEFAULT false,
  hire_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS for now (or add policies)
ALTER TABLE managers DISABLE ROW LEVEL SECURITY;

-- Sample data
INSERT INTO managers (name, email, primary_aor, is_gm) VALUES
('Allen', 'allen@chilis605.com', 'culinary', true),
('Tiffany Larkins', 'tlarkins@chilis605.com', 'culinary', false),
('Tiff Wright', 'twright@chilis605.com', 'hospitality', false),
('Jason Roberts', 'jroberts@chilis605.com', 'togoBar', false);
```

### manager_aor_activity Table

**Track which AOR each manager is currently viewing/using:**

```sql
CREATE TABLE manager_aor_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  current_aor TEXT NOT NULL, -- What they're viewing right now
  primary_aor TEXT NOT NULL, -- Their accountability AOR
  session_start TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW()
);

ALTER TABLE manager_aor_activity DISABLE ROW LEVEL SECURITY;
```

### manager_aor_metrics Table

**Track performance metrics per manager per AOR:**

```sql
CREATE TABLE manager_aor_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  aor TEXT NOT NULL,
  period_number INT NOT NULL,
  fiscal_year INT NOT NULL,
  tasks_completed INT DEFAULT 0,
  tasks_total INT DEFAULT 0,
  completion_rate DECIMAL(5,2),
  last_updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (manager_id, aor, period_number, fiscal_year)
);

ALTER TABLE manager_aor_metrics DISABLE ROW LEVEL SECURITY;
```

---

## App Flow

### 1. Login / Manager Selection

**Simple manager selection (no passwords for now):**

```jsx
const ManagerLogin = () => {
  const [managers, setManagers] = useState([]);
  
  useEffect(() => {
    loadManagers();
  }, []);
  
  const loadManagers = async () => {
    const { data } = await supabase
      .from('managers')
      .select('*')
      .order('name');
    setManagers(data);
  };
  
  const selectManager = (manager) => {
    // Store in localStorage
    localStorage.setItem('currentManager', JSON.stringify(manager));
    
    // Track activity
    trackManagerLogin(manager);
    
    // Navigate to dashboard
    if (manager.is_gm) {
      navigate('/gm-dashboard');
    } else {
      navigate('/manager-dashboard');
    }
  };
  
  return (
    <div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh' }}>
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 className="text-3xl font-bold mb-2">🌶️ Chili's #605</h1>
        <p className="text-xl">Manager AOR Tracker</p>
      </div>
      
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.chiliNavy }}>
          Select Your Profile
        </h2>
        
        <div className="grid gap-4">
          {managers.map(manager => (
            <button
              key={manager.id}
              onClick={() => selectManager(manager)}
              style={{
                backgroundColor: 'white',
                border: `3px solid ${colors.chiliNavy}`,
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
                    {manager.name}
                    {manager.is_gm && ' 👑'}
                  </h3>
                  <p style={{ color: colors.chiliBrown }}>
                    {managerResponsibilities[manager.primary_aor].title}
                  </p>
                </div>
                <div style={{
                  backgroundColor: colors.chiliGreen,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  {manager.is_gm ? 'GM' : 'Manager'}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* GM Admin Button (only visible to you) */}
        <button
          onClick={() => navigate('/gm-admin')}
          style={{
            backgroundColor: colors.chiliRed,
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            width: '100%',
            marginTop: '2rem',
            border: 'none'
          }}
        >
          🔧 GM Admin (Manage Managers)
        </button>
      </div>
    </div>
  );
};
```

---

### 2. Manager Dashboard (Non-GM)

**Shows their PRIMARY AOR, but lets them explore others:**

```jsx
const ManagerDashboard = () => {
  const [manager, setManager] = useState(null);
  const [currentAOR, setCurrentAOR] = useState(null);
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const storedManager = JSON.parse(localStorage.getItem('currentManager'));
    setManager(storedManager);
    setCurrentAOR(storedManager.primary_aor); // Start with their primary
    loadMetrics(storedManager);
  }, []);
  
  const switchAOR = async (newAOR) => {
    setCurrentAOR(newAOR);
    
    // Track AOR switch
    await supabase.from('manager_aor_activity').insert({
      manager_id: manager.id,
      current_aor: newAOR,
      primary_aor: manager.primary_aor
    });
  };
  
  const isPrimaryAOR = currentAOR === manager?.primary_aor;
  
  return (
    <div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
        color: 'white',
        padding: '2rem'
      }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              👋 Welcome, {manager?.name}!
            </h1>
            <p className="text-yellow-200">
              Your AOR: {managerResponsibilities[manager?.primary_aor]?.title}
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Switch User
          </button>
        </div>
      </div>
      
      {/* AOR Selector with Primary Indicator */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3" style={{ color: colors.chiliNavy }}>
            {isPrimaryAOR ? '🎯 Your Primary AOR' : '👀 Viewing Other AOR'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(managerResponsibilities).map(([aor, data]) => {
              const isActive = currentAOR === aor;
              const isPrimary = manager?.primary_aor === aor;
              
              return (
                <button
                  key={aor}
                  onClick={() => switchAOR(aor)}
                  style={{
                    backgroundColor: isActive ? colors.chiliNavy : 'white',
                    color: isActive ? 'white' : colors.chiliNavy,
                    border: `3px solid ${isPrimary ? colors.chiliGreen : colors.chiliNavy}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Primary AOR Badge */}
                  {isPrimary && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: colors.chiliGreen,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      YOUR AOR
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">{data.shortTitle}</h3>
                  <p className="text-sm opacity-75">{data.title}</p>
                  
                  {/* Show metrics for their primary AOR */}
                  {isPrimary && metrics[aor] && (
                    <div className="mt-3 pt-3 border-t" style={{
                      borderColor: isActive ? 'rgba(255,255,255,0.2)' : colors.chiliGray
                    }}>
                      <div className="text-2xl font-bold">
                        {metrics[aor].completion_rate}%
                      </div>
                      <div className="text-xs opacity-75">This Period</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Warning when viewing non-primary AOR */}
          {!isPrimaryAOR && (
            <div style={{
              backgroundColor: colors.chiliYellow,
              color: colors.chiliNavy,
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              ℹ️ You're viewing a different AOR for learning purposes. 
              Your performance is tracked on: {managerResponsibilities[manager?.primary_aor]?.shortTitle}
            </div>
          )}
        </div>
        
        {/* Show appropriate dashboard for current AOR */}
        {currentAOR === 'culinary' && <CulinaryDashboard manager={manager} isPrimary={isPrimaryAOR} />}
        {currentAOR === 'hospitality' && <HospitalityDashboard manager={manager} isPrimary={isPrimaryAOR} />}
        {currentAOR === 'togoBar' && <ToGoBarDashboard manager={manager} isPrimary={isPrimaryAOR} />}
      </div>
    </div>
  );
};
```

---

### 3. GM Dashboard (Full Visibility)

**GM sees ALL managers' performance across ALL AORs:**

```jsx
const GMDashboard = () => {
  const [managers, setManagers] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(fiscalInfo.period);
  const [metricsData, setMetricsData] = useState({});
  
  useEffect(() => {
    loadManagerMetrics();
  }, [selectedPeriod]);
  
  const loadManagerMetrics = async () => {
    // Get all managers
    const { data: mgrs } = await supabase
      .from('managers')
      .select('*')
      .eq('is_gm', false);
    
    // Get metrics for each manager
    const { data: metrics } = await supabase
      .from('manager_aor_metrics')
      .select('*')
      .eq('period_number', selectedPeriod);
    
    setManagers(mgrs);
    setMetricsData(metrics);
  };
  
  return (
    <div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh' }}>
      {/* GM Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
        color: 'white',
        padding: '2rem'
      }}>
        <h1 className="text-3xl font-bold mb-2">👑 GM Dashboard - Team Overview</h1>
        <p className="opacity-90">Full visibility across all AORs</p>
      </div>
      
      {/* Period Selector */}
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
            Period {selectedPeriod} Performance
          </h2>
          <button
            onClick={() => navigate('/gm-admin')}
            style={{
              backgroundColor: colors.chiliRed,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none'
            }}
          >
            ⚙️ Manage Managers
          </button>
        </div>
        
        {/* Manager Performance Cards */}
        <div className="space-y-4">
          {managers.map(manager => (
            <div
              key={manager.id}
              style={{
                backgroundColor: 'white',
                border: `3px solid ${colors.chiliNavy}`,
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {/* Manager Header */}
              <div style={{
                backgroundColor: colors.chiliNavy,
                color: 'white',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 className="text-xl font-bold">{manager.name}</h3>
                  <p className="text-sm opacity-75">
                    Primary AOR: {managerResponsibilities[manager.primary_aor]?.title}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/manager-detail/${manager.id}`)}
                  style={{
                    backgroundColor: colors.chiliGreen,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  View Details →
                </button>
              </div>
              
              {/* Performance Grid - Show all AORs */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['culinary', 'hospitality', 'togoBar'].map(aor => {
                    const isPrimary = manager.primary_aor === aor;
                    const metrics = metricsData.find(m => 
                      m.manager_id === manager.id && m.aor === aor
                    );
                    
                    return (
                      <div
                        key={aor}
                        style={{
                          backgroundColor: isPrimary ? colors.chiliCream : '#f8f9fa',
                          border: `2px solid ${isPrimary ? colors.chiliGreen : colors.chiliGray}`,
                          borderRadius: '8px',
                          padding: '1rem',
                          position: 'relative'
                        }}
                      >
                        {isPrimary && (
                          <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            backgroundColor: colors.chiliGreen,
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.625rem',
                            fontWeight: 'bold'
                          }}>
                            PRIMARY
                          </div>
                        )}
                        
                        <h4 className="font-bold mb-2" style={{ color: colors.chiliNavy }}>
                          {managerResponsibilities[aor]?.shortTitle}
                        </h4>
                        
                        {metrics ? (
                          <>
                            <div className="text-3xl font-bold mb-1" style={{
                              color: metrics.completion_rate >= 90 ? colors.chiliGreen :
                                     metrics.completion_rate >= 70 ? colors.chiliYellow :
                                     colors.chiliRed
                            }}>
                              {metrics.completion_rate}%
                            </div>
                            <div className="text-sm" style={{ color: colors.chiliBrown }}>
                              {metrics.tasks_completed}/{metrics.tasks_total} tasks
                            </div>
                          </>
                        ) : (
                          <div className="text-sm" style={{ color: colors.chiliGray }}>
                            No activity
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Team Summary */}
        <div style={{
          backgroundColor: colors.chiliNavy,
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          <h3 className="text-2xl font-bold mb-4">📊 Team Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {calculateTeamAverage(metricsData, 'culinary')}%
              </div>
              <div className="opacity-75">Culinary Avg</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {calculateTeamAverage(metricsData, 'hospitality')}%
              </div>
              <div className="opacity-75">Hospitality Avg</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {calculateTeamAverage(metricsData, 'togoBar')}%
              </div>
              <div className="opacity-75">To-Go/Bar Avg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 4. GM Admin Panel (Manage Managers)

**Where you assign/change AORs:**

```jsx
const GMAdmin = () => {
  const [managers, setManagers] = useState([]);
  const [editingManager, setEditingManager] = useState(null);
  
  useEffect(() => {
    loadManagers();
  }, []);
  
  const updateManagerAOR = async (managerId, newAOR) => {
    await supabase
      .from('managers')
      .update({ 
        primary_aor: newAOR,
        updated_at: new Date()
      })
      .eq('id', managerId);
    
    loadManagers();
    alert('✅ Manager AOR updated!');
  };
  
  return (
    <div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh', padding: '2rem' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: colors.chiliNavy }}>
            ⚙️ Manage Managers
          </h1>
          <button
            onClick={() => navigate('/gm-dashboard')}
            style={{
              backgroundColor: colors.chiliNavy,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
        
        {/* Manager List */}
        <div className="space-y-4">
          {managers.filter(m => !m.is_gm).map(manager => (
            <div
              key={manager.id}
              style={{
                backgroundColor: 'white',
                border: `3px solid ${colors.chiliNavy}`,
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
                    {manager.name}
                  </h3>
                  <p style={{ color: colors.chiliBrown }}>{manager.email}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block font-bold mb-2" style={{ color: colors.chiliNavy }}>
                  Primary AOR (Accountability):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['culinary', 'hospitality', 'togoBar'].map(aor => (
                    <button
                      key={aor}
                      onClick={() => updateManagerAOR(manager.id, aor)}
                      style={{
                        backgroundColor: manager.primary_aor === aor ? colors.chiliGreen : 'white',
                        color: manager.primary_aor === aor ? 'white' : colors.chiliNavy,
                        border: `2px solid ${manager.primary_aor === aor ? colors.chiliGreen : colors.chiliNavy}`,
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {managerResponsibilities[aor]?.shortTitle}
                      {manager.primary_aor === aor && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-sm" style={{ color: colors.chiliGray }}>
                Hired: {new Date(manager.hire_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Add New Manager Button */}
        <button
          onClick={() => setShowAddManager(true)}
          style={{
            backgroundColor: colors.chiliGreen,
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            border: 'none',
            width: '100%',
            marginTop: '2rem',
            fontSize: '1.1rem'
          }}
        >
          + Add New Manager
        </button>
      </div>
    </div>
  );
};
```

---

## Key Features Summary

### ✅ For Regular Managers:
1. **See their assigned AOR** (their accountability)
2. **Can VIEW all AORs** (for learning/cross-training)
3. **Warning shown** when viewing non-primary AOR
4. **Performance tracked** only on primary AOR
5. **Can't change their own AOR**

### ✅ For GM (You):
1. **Full visibility** of all managers across all AORs
2. **Can assign/change** manager AORs
3. **See team averages** per AOR
4. **Track who's working on what**
5. **Admin panel** to manage team

### ✅ Accountability:
- Each manager has ONE primary AOR
- Metrics tracked per AOR per manager
- GM can see if they're working on non-primary AORs
- Primary AOR clearly marked everywhere

---

## Implementation Steps

1. **Create database tables** (managers, manager_aor_activity, manager_aor_metrics)
2. **Add manager data** (your 4 managers)
3. **Build login/selection screen**
4. **Build manager dashboard** with AOR switcher
5. **Build GM dashboard** with team overview
6. **Build GM admin panel** for AOR assignment

---

🌶️ **This gives you full control as GM while letting managers explore and learn!**
