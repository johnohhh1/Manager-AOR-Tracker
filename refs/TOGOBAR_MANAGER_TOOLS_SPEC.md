# 🍹 To-Go/Bar Manager Tools - Complete Specification

## OVERVIEW

Interactive tools for the To-Go Leader / Bar Leader to manage their AOR responsibilities:
- To-Go order accuracy (Missing Items <9%)
- To-Go GWAP (<10%)
- Bar incremental sales ($10 target)
- My Chili's Rewards sign-ups
- BWL (Beer, Wine, Liquor) orders
- Liquor COS management
- Bar/To-Go team development

---

## 🎨 DESIGN LANGUAGE

**Navy/Green/Red color scheme from poster:**
- Navy headers with white text
- Green for success/on-target
- Red for needs attention
- Cream page backgrounds

---

## TOOL 1: To-Go Order Accuracy Tracker 📦

### Purpose
Track missing items percentage and coach team for improvement.

### Dashboard

```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">📦 To-Go Order Accuracy</h2>
  
  {/* Key Metrics */}
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div style={{
      backgroundColor: missingItemsPercent <= 9 ? colors.chiliGreen : colors.chiliRed,
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-5xl font-bold">{missingItemsPercent}%</div>
      <div className="text-lg opacity-90">Missing Items</div>
      <div className="text-sm mt-2">Target: <9%</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold">{ordersToday}</div>
      <div>Orders Today</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold">{issuesLogged}</div>
      <div>Issues This Week</div>
    </div>
  </div>
  
  {/* Quick Log Missing Item */}
  <div style={{
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.chiliRed}`
  }}>
    <h3 className="font-bold mb-3">🚨 Log Missing Item</h3>
    <div className="grid grid-cols-3 gap-2">
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setTeamMember(e.target.value)}
      >
        <option>Select Team Member</option>
        {togoTeam.map(tm => <option key={tm.id}>{tm.name}</option>)}
      </select>
      
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setMissingItem(e.target.value)}
      >
        <option>What's Missing?</option>
        <option>Sauce/Condiments</option>
        <option>Utensils/Napkins</option>
        <option>Side Item</option>
        <option>Drink</option>
        <option>Entree Item</option>
        <option>Other</option>
      </select>
      
      <button
        onClick={logIssue}
        style={{
          backgroundColor: colors.chiliRed,
          color: 'white',
          padding: '0.75rem',
          borderRadius: '6px',
          fontWeight: 'bold',
          border: 'none'
        }}
      >
        Log Issue
      </button>
    </div>
  </div>
</div>

{/* Team Performance */}
<div style={{
  backgroundColor: 'white',
  border: `3px solid ${colors.chiliNavy}`,
  borderRadius: '12px',
  marginTop: '1rem',
  overflow: 'hidden'
}}>
  <div style={{
    backgroundColor: colors.chiliNavy,
    color: 'white',
    padding: '1rem'
  }}>
    <h3 className="text-xl font-bold">Team Missing Items %</h3>
  </div>
  
  <div className="p-4 space-y-3">
    {togoTeam.map(tm => (
      <div key={tm.id} className="flex justify-between items-center">
        <div>
          <div className="font-bold" style={{ color: colors.chiliNavy }}>{tm.name}</div>
          <div className="text-sm" style={{ color: colors.chiliGray }}>
            {tm.issueCount} issues this week
          </div>
        </div>
        <div style={{
          backgroundColor: tm.missingPercent <= 9 ? colors.chiliGreen : colors.chiliRed,
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          {tm.missingPercent}%
        </div>
      </div>
    ))}
  </div>
</div>
```

### Database Schema

```sql
CREATE TABLE togo_missing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  team_member_id UUID REFERENCES team_members(id),
  item_category TEXT NOT NULL,
  notes TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE togo_missing_items DISABLE ROW LEVEL SECURITY;
```

---

## TOOL 2: To-Go GWAP Tracker 💰

### Purpose
Monitor Guest Wrong at Pickup percentage (target: <10%).

### Dashboard

```jsx
<div style={{
  background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
  color: 'white',
  padding: '2rem',
  borderRadius: '12px'
}}>
  <h2 className="text-3xl font-bold mb-4">💰 To-Go GWAP</h2>
  
  <div className="grid grid-cols-4 gap-4">
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{gwapPercent}%</div>
      <div className="opacity-90">Current GWAP</div>
      <div className="text-sm mt-2">
        {gwapPercent < 10 ? '✓ On Target' : '⚠ Over Target'}
      </div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-3xl font-bold mb-2">{gwapCount}</div>
      <div className="opacity-90">GWAP Count</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-3xl font-bold mb-2">{totalOrders}</div>
      <div className="opacity-90">Total Orders</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-3xl font-bold mb-2" style={{
        color: trend === 'down' ? colors.chiliGreen : colors.chiliRed
      }}>
        {trend === 'down' ? '↓' : '↑'} {trendValue}%
      </div>
      <div className="opacity-90">vs Last Week</div>
    </div>
  </div>
  
  <button
    onClick={() => navigate('/gwap-detail')}
    style={{
      backgroundColor: colors.chiliGreen,
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      width: '100%',
      marginTop: '1rem'
    }}
  >
    View GWAP Details & Action Plan
  </button>
</div>
```

---

## TOOL 3: Bar Incremental Sales Tracker 🍹

### Purpose
Track bar upsells and incremental sales (target: $10 per shift).

### Dashboard

```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">🍹 Bar Incremental Sales</h2>
  
  {/* Today's Performance */}
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div style={{
      backgroundColor: incrementalToday >= 10 ? colors.chiliGreen : colors.chiliYellow,
      color: incrementalToday >= 10 ? 'white' : colors.chiliNavy,
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-5xl font-bold mb-2">${incrementalToday}</div>
      <div className="text-lg font-semibold">Today's Incremental</div>
      <div className="text-sm mt-2">Target: $10</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">${weeklyAvg}</div>
      <div>Weekly Average</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{topSeller}</div>
      <div>Top Upseller</div>
    </div>
  </div>
  
  {/* Top Upsell Items */}
  <div style={{
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.chiliGreen}`
  }}>
    <h3 className="font-bold mb-3">🏆 Top Upsell Items Today</h3>
    <div className="space-y-2">
      {topItems.map((item, i) => (
        <div key={i} className="flex justify-between">
          <span>{item.name}</span>
          <span className="font-bold">${item.sales}</span>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Bartender Performance */}
<div style={{
  backgroundColor: 'white',
  border: `3px solid ${colors.chiliNavy}`,
  borderRadius: '12px',
  marginTop: '1rem',
  overflow: 'hidden'
}}>
  <div style={{
    backgroundColor: colors.chiliNavy,
    color: 'white',
    padding: '1rem'
  }}>
    <h3 className="text-xl font-bold">Bartender Incremental Sales</h3>
  </div>
  
  <div className="p-4 space-y-3">
    {bartenders.map(bt => (
      <div key={bt.id} className="flex justify-between items-center">
        <div>
          <div className="font-bold" style={{ color: colors.chiliNavy }}>{bt.name}</div>
          <div className="text-sm" style={{ color: colors.chiliGray }}>
            {bt.shiftsThisWeek} shifts this week
          </div>
        </div>
        <div style={{
          backgroundColor: bt.avgIncremental >= 10 ? colors.chiliGreen : colors.chiliYellow,
          color: bt.avgIncremental >= 10 ? 'white' : colors.chiliNavy,
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          ${bt.avgIncremental}
        </div>
      </div>
    ))}
  </div>
</div>
```

### Database Schema

```sql
CREATE TABLE bar_incremental_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  bartender_id UUID REFERENCES team_members(id),
  shift_date DATE NOT NULL,
  incremental_amount DECIMAL(10,2),
  top_items JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE bar_incremental_sales DISABLE ROW LEVEL SECURITY;
```

---

## TOOL 4: My Chili's Rewards Sign-Ups 🎁

### Purpose
Track MCR sign-ups and coach team on enrollment techniques.

### Dashboard

```jsx
<div style={{
  backgroundColor: 'white',
  border: `3px solid ${colors.chiliNavy}`,
  borderRadius: '12px',
  overflow: 'hidden'
}}>
  <div style={{
    backgroundColor: colors.chiliNavy,
    color: 'white',
    padding: '1rem'
  }}>
    <h3 className="text-xl font-bold">🎁 My Chili's Rewards Sign-Ups</h3>
  </div>
  
  <div className="p-4">
    {/* This Week Stats */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliGreen }}>
          {signUpsThisWeek}
        </div>
        <div style={{ color: colors.chiliBrown }}>Sign-Ups This Week</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliNavy }}>
          {avgPerShift}
        </div>
        <div style={{ color: colors.chiliBrown }}>Avg Per Shift</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliYellow }}>
          {conversionRate}%
        </div>
        <div style={{ color: colors.chiliBrown }}>Conversion Rate</div>
      </div>
    </div>
    
    {/* Team Leaderboard */}
    <h4 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
      Team Leaderboard
    </h4>
    <div className="space-y-2">
      {togoTeam.map((tm, index) => (
        <div key={tm.id} className="flex justify-between items-center p-2 rounded" style={{
          backgroundColor: index === 0 ? colors.chiliCream : 'white'
        }}>
          <div className="flex items-center gap-3">
            <div style={{
              backgroundColor: index === 0 ? colors.chiliGreen : colors.chiliGray,
              color: 'white',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            <div>
              <div className="font-bold" style={{ color: colors.chiliNavy }}>
                {tm.name}
              </div>
              <div className="text-sm" style={{ color: colors.chiliGray }}>
                {tm.shiftsThisWeek} shifts
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.chiliNavy }}>
            {tm.mcrSignUps}
          </div>
        </div>
      ))}
    </div>
    
    <button
      onClick={() => navigate('/mcr-coaching')}
      style={{
        backgroundColor: colors.chiliGreen,
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none',
        width: '100%',
        marginTop: '1rem'
      }}
    >
      View MCR Coaching Tips
    </button>
  </div>
</div>
```

---

## TOOL 5: BWL Order Manager 🍺🍷

### Purpose
Manage Beer, Wine, Liquor orders and track inventory.

### Dashboard

```jsx
<div style={{
  background: `linear-gradient(135deg, ${colors.chiliNavy}, ${colors.chiliNavyAlt})`,
  color: 'white',
  padding: '2rem',
  borderRadius: '12px'
}}>
  <h2 className="text-3xl font-bold mb-4">🍺 BWL Order Manager</h2>
  
  {/* Next Order Due */}
  <div style={{
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    borderLeft: `4px solid ${daysUntilOrder <= 2 ? colors.chiliRed : colors.chiliYellow}`
  }}>
    <div className="flex justify-between items-center">
      <div>
        <div className="text-2xl font-bold mb-1">Next BWL Order Due</div>
        <div className="opacity-75">Weekly standing order</div>
      </div>
      <div className="text-5xl font-bold">
        {daysUntilOrder} days
      </div>
    </div>
  </div>
  
  {/* Quick Inventory Check */}
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-3xl font-bold mb-2">{beerStock}%</div>
      <div>Beer Stock</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-3xl font-bold mb-2">{wineStock}%</div>
      <div>Wine Stock</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-3xl font-bold mb-2">{liquorStock}%</div>
      <div>Liquor Stock</div>
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={() => navigate('/bwl-order-form')}
      style={{
        backgroundColor: colors.chiliGreen,
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none'
      }}
    >
      📋 Create Order
    </button>
    
    <button
      onClick={() => navigate('/bwl-history')}
      style={{
        backgroundColor: 'white',
        color: colors.chiliNavy,
        padding: '1rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none'
      }}
    >
      📊 Order History
    </button>
  </div>
</div>
```

---

## TOOL 6: Liquor COS Tracker 📊

### Purpose
Track and analyze Cost of Sales for liquor inventory.

### Dashboard

```jsx
<div style={{
  backgroundColor: 'white',
  border: `3px solid ${colors.chiliNavy}`,
  borderRadius: '12px',
  overflow: 'hidden'
}}>
  <div style={{
    backgroundColor: colors.chiliNavy,
    color: 'white',
    padding: '1rem'
  }}>
    <h3 className="text-xl font-bold">📊 Liquor Cost of Sales</h3>
  </div>
  
  <div className="p-4">
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{
          color: liquorCOS <= targetCOS ? colors.chiliGreen : colors.chiliRed
        }}>
          {liquorCOS}%
        </div>
        <div style={{ color: colors.chiliBrown }}>Current COS</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliNavy }}>
          {targetCOS}%
        </div>
        <div style={{ color: colors.chiliBrown }}>Target COS</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{
          color: variance < 0 ? colors.chiliGreen : colors.chiliRed
        }}>
          {variance > 0 ? '+' : ''}{variance}%
        </div>
        <div style={{ color: colors.chiliBrown }}>Variance</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliNavy }}>
          ${wastage}
        </div>
        <div style={{ color: colors.chiliBrown }}>Wastage</div>
      </div>
    </div>
    
    {/* Action Plan */}
    <button
      onClick={() => navigate('/liquor-cos-action-plan')}
      style={{
        backgroundColor: colors.chiliNavy,
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none',
        width: '100%'
      }}
    >
      View COS Action Plan
    </button>
  </div>
</div>
```

---

## TOOL 7: Bar/To-Go Team Development 👥

### Purpose
Manage training, reviews, and development for Bar and To-Go team members.

### Dashboard

```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">👥 Bar & To-Go Team</h2>
  
  <div className="grid grid-cols-4 gap-4 mb-4">
    <div className="text-center">
      <div className="text-4xl font-bold">{totalTeam}</div>
      <div className="text-sm opacity-75">Total Team</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold" style={{ color: colors.chiliGreen }}>
        {trainingComplete}%
      </div>
      <div className="text-sm opacity-75">Training Complete</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold" style={{ color: colors.chiliYellow }}>
        {crossTrained}
      </div>
      <div className="text-sm opacity-75">Cross-Trained</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold" style={{ color: colors.chiliRed }}>
        {needsReview}
      </div>
      <div className="text-sm opacity-75">Need Reviews</div>
    </div>
  </div>
</div>

{/* Team Member Cards */}
<div className="grid gap-4 mt-4">
  {barToGoTeam.map(member => (
    <div key={member.id} style={{
      backgroundColor: 'white',
      border: `3px solid ${colors.chiliNavy}`,
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: colors.chiliCream,
        padding: '1rem'
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              {member.name}
            </h3>
            <div className="flex gap-2 mt-2">
              {member.positions.map(pos => (
                <span key={pos} style={{
                  backgroundColor: colors.chiliGreen,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {pos}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate(`/1on1/${member.id}`)}
            style={{
              backgroundColor: colors.chiliNavy,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none'
            }}
          >
            Schedule 1:1
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Training Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1" style={{ color: colors.chiliBrown }}>
            <span>Training Progress</span>
            <span>{member.trainingPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div style={{
              width: `${member.trainingPercent}%`,
              backgroundColor: member.trainingPercent === 100 ? colors.chiliGreen : colors.chiliYellow,
              height: '100%',
              borderRadius: '9999px'
            }} />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.mcrSignUps}
            </div>
            <div style={{ color: colors.chiliGray }}>MCR Sign-Ups</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.missingItemsPercent}%
            </div>
            <div style={{ color: colors.chiliGray }}>Missing Items</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              ${member.avgIncremental}
            </div>
            <div style={{ color: colors.chiliGray }}>Avg Incremental</div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## DATABASE SCHEMA

```sql
-- To-Go Missing Items
CREATE TABLE togo_missing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  team_member_id UUID REFERENCES team_members(id),
  item_category TEXT NOT NULL,
  notes TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

-- To-Go GWAP
CREATE TABLE togo_gwap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  date DATE NOT NULL,
  gwap_count INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  gwap_percent DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bar Incremental Sales
CREATE TABLE bar_incremental_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  bartender_id UUID REFERENCES team_members(id),
  shift_date DATE NOT NULL,
  incremental_amount DECIMAL(10,2),
  top_items JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- MCR Sign-Ups
CREATE TABLE mcr_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  team_member_id UUID REFERENCES team_members(id),
  signup_date DATE NOT NULL,
  shift_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- BWL Orders
CREATE TABLE bwl_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  order_date DATE NOT NULL,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10,2),
  delivery_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Liquor COS
CREATE TABLE liquor_cos_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  period_number INT NOT NULL,
  fiscal_year INT NOT NULL,
  current_cos DECIMAL(5,2),
  target_cos DECIMAL(5,2),
  variance DECIMAL(5,2),
  wastage_amount DECIMAL(10,2),
  action_plan JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS on all tables
ALTER TABLE togo_missing_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE togo_gwap DISABLE ROW LEVEL SECURITY;
ALTER TABLE bar_incremental_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE mcr_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE bwl_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE liquor_cos_tracking DISABLE ROW LEVEL SECURITY;
```

---

## NAVIGATION & LAYOUT

### To-Go/Bar Manager Dashboard (Main View)

```jsx
<div style={{ backgroundColor: colors.chiliCream, minHeight: '100vh', padding: '1rem' }}>
  {/* Header */}
  <div style={{
    background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
    color: 'white',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem'
  }}>
    <h1 className="text-3xl font-bold mb-2">🍹 To-Go/Bar Leader Dashboard</h1>
    <p className="opacity-90">Excellence in Service & Sales</p>
  </div>
  
  {/* Quick Stats Row */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
    <StatCard value="8.2%" label="Missing Items" color={colors.chiliGreen} />
    <StatCard value="9.5%" label="To-Go GWAP" color={colors.chiliGreen} />
    <StatCard value="$12" label="Bar Incremental" color={colors.chiliGreen} />
    <StatCard value="18" label="MCR Sign-Ups" color={colors.chiliYellow} />
    <StatCard value="23.5%" label="Liquor COS" color={colors.chiliNavy} />
  </div>
  
  {/* Tool Cards */}
  <div className="grid gap-4">
    <ToolCard
      icon="📦"
      title="To-Go Order Accuracy"
      description="Track missing items and coach team"
      status="8.2% - On Target"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="💰"
      title="To-Go GWAP Tracker"
      description="Monitor Guest Wrong at Pickup"
      status="9.5% - On Target"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="🍹"
      title="Bar Incremental Sales"
      description="Track upsells and add-ons"
      status="$12 Today - Exceeds!"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="🎁"
      title="MCR Sign-Ups"
      description="My Chili's Rewards enrollment"
      status="18 this week"
      statusColor={colors.chiliYellow}
    />
    
    <ToolCard
      icon="🍺"
      title="BWL Order Manager"
      description="Beer, Wine, Liquor ordering"
      status="Order due in 2 days"
      statusColor={colors.chiliYellow}
    />
    
    <ToolCard
      icon="📊"
      title="Liquor COS Tracker"
      description="Cost of sales analysis"
      status="23.5% - Review"
      statusColor={colors.chiliNavy}
    />
    
    <ToolCard
      icon="👥"
      title="Team Development"
      description="Training, reviews, cross-training"
      status="2 need reviews"
      statusColor={colors.chiliRed}
    />
  </div>
</div>
```

---

🌶️ **Complete To-Go/Bar Manager toolkit - manage orders, sales, and team from your phone!**
