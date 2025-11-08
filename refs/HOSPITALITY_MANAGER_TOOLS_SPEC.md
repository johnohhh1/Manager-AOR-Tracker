# 🎉 Hospitality Manager Tools - Complete Specification

## OVERVIEW

Interactive tools for the Hospitality Leader to manage their AOR responsibilities:
- GWAP (Guest Wrong at Pickup) tracking (<10% target)
- Server Excellence (60-second greet, attentiveness)
- 5/10 Culture enforcement
- FOH team development (Host, Server, Runner, Busser)
- Guest feedback management
- Connection Board updates

---

## 🎨 DESIGN LANGUAGE

**Navy/Green/Red color scheme from poster:**
- Navy headers with white text
- Green for success/on-target
- Red for needs attention
- Cream page backgrounds

---

## TOOL 1: GWAP Tracker 🚨

### Purpose
Track Guest Wrong at Pickup percentage (target: <10%) and identify service gaps.

### Dashboard

```jsx
<div style={{
  background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
  color: 'white',
  padding: '2rem',
  borderRadius: '12px'
}}>
  <h2 className="text-3xl font-bold mb-4">🚨 GWAP Tracking</h2>
  
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
      <div className="text-3xl font-bold mb-2">{totalGuests}</div>
      <div className="opacity-90">Total Guests</div>
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
  
  {/* Quick Log GWAP */}
  <div style={{
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    borderLeft: `4px solid ${colors.chiliRed}`
  }}>
    <h3 className="font-bold mb-3">🚨 Log GWAP Incident</h3>
    <div className="grid grid-cols-4 gap-2">
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setPosition(e.target.value)}
      >
        <option>Select Position</option>
        <option>Host</option>
        <option>Server</option>
        <option>Runner</option>
        <option>Busser</option>
      </select>
      
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setTeamMember(e.target.value)}
      >
        <option>Select Team Member</option>
        {fohTeam.map(tm => <option key={tm.id}>{tm.name}</option>)}
      </select>
      
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setIssueType(e.target.value)}
      >
        <option>Issue Type</option>
        <option>Slow Service</option>
        <option>Wrong Order</option>
        <option>Cold Food</option>
        <option>Missing Item</option>
        <option>Attitude</option>
        <option>Other</option>
      </select>
      
      <button
        onClick={logGWAP}
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

{/* GWAP Breakdown by Position */}
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
    <h3 className="text-xl font-bold">GWAP by Position</h3>
  </div>
  
  <div className="p-4 space-y-3">
    {['Host', 'Server', 'Runner', 'Busser'].map(position => (
      <div key={position} className="flex justify-between items-center">
        <div>
          <div className="font-bold" style={{ color: colors.chiliNavy }}>{position}</div>
          <div className="text-sm" style={{ color: colors.chiliGray }}>
            {gwapData[position].count} incidents this week
          </div>
        </div>
        <div style={{
          backgroundColor: gwapData[position].percent <= 10 ? colors.chiliGreen : colors.chiliRed,
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          {gwapData[position].percent}%
        </div>
      </div>
    ))}
  </div>
</div>
```

### Database Schema

```sql
CREATE TABLE hospitality_gwap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  date DATE NOT NULL,
  position TEXT NOT NULL,
  team_member_id UUID REFERENCES team_members(id),
  issue_type TEXT NOT NULL,
  description TEXT,
  resolution TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE hospitality_gwap DISABLE ROW LEVEL SECURITY;
```

---

## TOOL 2: Server Excellence Tracker ⭐

### Purpose
Monitor server performance (60-second greet, attentiveness, recommendations).

### Dashboard

```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">⭐ Server Excellence</h2>
  
  {/* Today's Stats */}
  <div className="grid grid-cols-4 gap-4 mb-4">
    <div style={{
      backgroundColor: greetTime <= 60 ? colors.chiliGreen : colors.chiliRed,
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-5xl font-bold mb-2">{greetTime}s</div>
      <div className="text-lg font-semibold">Avg Greet Time</div>
      <div className="text-sm mt-2">Target: ≤60s</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{recommendRate}%</div>
      <div>Recommendation Rate</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{attentivenessScore}</div>
      <div>Attentiveness Score</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{topServer}</div>
      <div>Top Server Today</div>
    </div>
  </div>
  
  {/* Quick Server Observation */}
  <div style={{
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '1rem',
    borderRadius: '8px',
    borderLeft: `4px solid ${colors.chiliGreen}`
  }}>
    <h3 className="font-bold mb-3">✓ Log Server Observation</h3>
    <div className="grid grid-cols-5 gap-2">
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setServer(e.target.value)}
      >
        <option>Select Server</option>
        {servers.map(s => <option key={s.id}>{s.name}</option>)}
      </select>
      
      <input
        type="number"
        placeholder="Greet time (sec)"
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setGreetTime(e.target.value)}
      />
      
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setRecommended(e.target.value)}
      >
        <option value="">Recommended?</option>
        <option value="yes">Yes - Marg/App</option>
        <option value="no">No</option>
      </select>
      
      <select 
        style={{ padding: '0.75rem', borderRadius: '6px', color: colors.chiliNavy }}
        onChange={(e) => setAttentiveness(e.target.value)}
      >
        <option value="">Attentiveness</option>
        <option value="5">5 - Excellent</option>
        <option value="4">4 - Good</option>
        <option value="3">3 - Fair</option>
        <option value="2">2 - Needs Work</option>
        <option value="1">1 - Poor</option>
      </select>
      
      <button
        onClick={logObservation}
        style={{
          backgroundColor: colors.chiliGreen,
          color: 'white',
          padding: '0.75rem',
          borderRadius: '6px',
          fontWeight: 'bold',
          border: 'none'
        }}
      >
        Log
      </button>
    </div>
  </div>
</div>

{/* Server Leaderboard */}
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
    <h3 className="text-xl font-bold">Server Performance This Week</h3>
  </div>
  
  <div className="p-4 space-y-3">
    {servers.map((server, index) => (
      <div key={server.id} className="flex justify-between items-center p-2 rounded" style={{
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
              {server.name}
            </div>
            <div className="text-sm" style={{ color: colors.chiliGray }}>
              Greet: {server.avgGreet}s | Rec: {server.recRate}% | Att: {server.attScore}
            </div>
          </div>
        </div>
        <div style={{
          backgroundColor: server.overallScore >= 90 ? colors.chiliGreen : 
                         server.overallScore >= 75 ? colors.chiliYellow : colors.chiliRed,
          color: server.overallScore >= 75 ? 'white' : colors.chiliNavy,
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          {server.overallScore}
        </div>
      </div>
    ))}
  </div>
</div>
```

### Database Schema

```sql
CREATE TABLE server_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  server_id UUID REFERENCES team_members(id),
  observation_date TIMESTAMP DEFAULT NOW(),
  greet_time_seconds INT,
  recommended_margapp BOOLEAN,
  attentiveness_score INT CHECK (attentiveness_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE server_observations DISABLE ROW LEVEL SECURITY;
```

---

## TOOL 3: 5/10 Culture Tracker 👀

### Purpose
Monitor and enforce the 5/10 Rule across FOH team.

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
    <h3 className="text-xl font-bold">👀 5/10 Culture Compliance</h3>
  </div>
  
  <div className="p-4">
    {/* This Week Stats */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliGreen }}>
          {fiveRuleCompliance}%
        </div>
        <div style={{ color: colors.chiliBrown }}>5-Foot Rule</div>
        <div className="text-sm" style={{ color: colors.chiliGray }}>
          Speaking to guests
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliGreen }}>
          {tenRuleCompliance}%
        </div>
        <div style={{ color: colors.chiliBrown }}>10-Foot Rule</div>
        <div className="text-sm" style={{ color: colors.chiliGray }}>
          Eye contact & smile
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliYellow }}>
          {observationsToday}
        </div>
        <div style={{ color: colors.chiliBrown }}>Observations Today</div>
        <div className="text-sm" style={{ color: colors.chiliGray }}>
          Target: 20+
        </div>
      </div>
    </div>
    
    {/* Quick Log */}
    <div style={{
      backgroundColor: colors.chiliCream,
      padding: '1rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.chiliGreen}`
    }}>
      <h4 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
        ✓ Log 5/10 Observation
      </h4>
      <div className="grid grid-cols-4 gap-2">
        <select 
          style={{ padding: '0.75rem', borderRadius: '6px', border: `2px solid ${colors.chiliNavy}` }}
          onChange={(e) => setTeamMember(e.target.value)}
        >
          <option>Select Team Member</option>
          {fohTeam.map(tm => <option key={tm.id}>{tm.name}</option>)}
        </select>
        
        <select 
          style={{ padding: '0.75rem', borderRadius: '6px', border: `2px solid ${colors.chiliNavy}` }}
          onChange={(e) => setFiveRule(e.target.value)}
        >
          <option value="">5-Foot Rule?</option>
          <option value="yes">✓ Yes</option>
          <option value="no">✗ No</option>
        </select>
        
        <select 
          style={{ padding: '0.75rem', borderRadius: '6px', border: `2px solid ${colors.chiliNavy}` }}
          onChange={(e) => setTenRule(e.target.value)}
        >
          <option value="">10-Foot Rule?</option>
          <option value="yes">✓ Yes</option>
          <option value="no">✗ No</option>
        </select>
        
        <button
          onClick={logFiveTen}
          style={{
            backgroundColor: colors.chiliGreen,
            color: 'white',
            padding: '0.75rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            border: 'none'
          }}
        >
          Log
        </button>
      </div>
    </div>
    
    {/* Team Compliance */}
    <div className="mt-4">
      <h4 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
        Team Compliance This Week
      </h4>
      <div className="space-y-2">
        {fohTeam.map(tm => (
          <div key={tm.id} className="flex justify-between items-center">
            <div>
              <div className="font-bold" style={{ color: colors.chiliNavy }}>{tm.name}</div>
              <div className="text-sm" style={{ color: colors.chiliGray }}>
                {tm.observationCount} observations
              </div>
            </div>
            <div className="flex gap-4">
              <div style={{
                backgroundColor: tm.fiveRuleCompliance >= 90 ? colors.chiliGreen : colors.chiliYellow,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}>
                5': {tm.fiveRuleCompliance}%
              </div>
              <div style={{
                backgroundColor: tm.tenRuleCompliance >= 90 ? colors.chiliGreen : colors.chiliYellow,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}>
                10': {tm.tenRuleCompliance}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

### Database Schema

```sql
CREATE TABLE five_ten_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  team_member_id UUID REFERENCES team_members(id),
  observation_date TIMESTAMP DEFAULT NOW(),
  five_foot_rule BOOLEAN NOT NULL,
  ten_foot_rule BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE five_ten_observations DISABLE ROW LEVEL SECURITY;
```

---

## TOOL 4: Guest Feedback Manager 💬

### Purpose
Track and respond to guest feedback/compliments/complaints.

### Dashboard

```jsx
<div style={{
  background: `linear-gradient(135deg, ${colors.chiliNavy}, ${colors.chiliNavyAlt})`,
  color: 'white',
  padding: '2rem',
  borderRadius: '12px'
}}>
  <h2 className="text-3xl font-bold mb-4">💬 Guest Feedback</h2>
  
  {/* Feedback Stats */}
  <div className="grid grid-cols-4 gap-4 mb-4">
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{compliments}</div>
      <div>Compliments</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{complaints}</div>
      <div>Complaints</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{surveyScore}</div>
      <div>Survey Score</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2" style={{
        color: responseRate >= 90 ? colors.chiliGreen : colors.chiliYellow
      }}>
        {responseRate}%
      </div>
      <div>Response Rate</div>
    </div>
  </div>
  
  <button
    onClick={() => navigate('/feedback/new')}
    style={{
      backgroundColor: colors.chiliGreen,
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      width: '100%'
    }}
  >
    + Log Guest Feedback
  </button>
</div>

{/* Recent Feedback */}
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
    <h3 className="text-xl font-bold">Recent Feedback</h3>
  </div>
  
  <div className="p-4 space-y-3">
    {feedbackList.map(feedback => (
      <div key={feedback.id} style={{
        backgroundColor: colors.chiliCream,
        padding: '1rem',
        borderRadius: '8px',
        borderLeft: `4px solid ${feedback.type === 'compliment' ? colors.chiliGreen : colors.chiliRed}`
      }}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <span style={{
              backgroundColor: feedback.type === 'compliment' ? colors.chiliGreen : colors.chiliRed,
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {feedback.type.toUpperCase()}
            </span>
            <span className="ml-2" style={{ color: colors.chiliGray }}>
              {feedback.date}
            </span>
          </div>
          {!feedback.responded && (
            <button
              onClick={() => respondToFeedback(feedback.id)}
              style={{
                backgroundColor: colors.chiliYellow,
                color: colors.chiliNavy,
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                border: 'none',
                fontSize: '0.875rem'
              }}
            >
              Respond
            </button>
          )}
        </div>
        <p style={{ color: colors.chiliNavy }}>{feedback.comment}</p>
        {feedback.teamMember && (
          <p className="text-sm mt-1" style={{ color: colors.chiliBrown }}>
            RE: {feedback.teamMember}
          </p>
        )}
      </div>
    ))}
  </div>
</div>
```

### Database Schema

```sql
CREATE TABLE guest_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  feedback_date DATE NOT NULL,
  feedback_type TEXT NOT NULL, -- 'compliment', 'complaint', 'survey'
  team_member_id UUID REFERENCES team_members(id),
  comment TEXT,
  response TEXT,
  responded BOOLEAN DEFAULT false,
  responded_at TIMESTAMP,
  survey_score INT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE guest_feedback DISABLE ROW LEVEL SECURITY;
```

---

## TOOL 5: Connection Board Tracker 📋

### Purpose
Manage and track updates to the Heart of House Connection Board.

### Dashboard

```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">📋 Connection Board Updates</h2>
  
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{updatesToday}</div>
      <div>Updates Today</div>
    </div>
    
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div className="text-4xl font-bold mb-2">{lastUpdate}</div>
      <div>Last Update</div>
    </div>
  </div>
  
  <button
    onClick={() => navigate('/connection-board/new')}
    style={{
      backgroundColor: colors.chiliGreen,
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      width: '100%'
    }}
  >
    + Add Connection Board Update
  </button>
</div>
```

---

## TOOL 6: Host Excellence Tracker 🚪

### Purpose
Monitor host performance (door service, greeting, seating).

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
    <h3 className="text-xl font-bold">🚪 Host Performance</h3>
  </div>
  
  <div className="p-4">
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliGreen }}>
          {greetRate}%
        </div>
        <div style={{ color: colors.chiliBrown }}>Greeting Rate</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliNavy }}>
          {doorService}s
        </div>
        <div style={{ color: colors.chiliBrown }}>Avg Door Service</div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-2" style={{ color: colors.chiliYellow }}>
          {waitTime} min
        </div>
        <div style={{ color: colors.chiliBrown }}>Avg Wait Time</div>
      </div>
    </div>
    
    {/* Host Leaderboard */}
    <h4 className="font-bold mb-3" style={{ color: colors.chiliNavy }}>
      Host Team This Week
    </h4>
    <div className="space-y-2">
      {hosts.map(host => (
        <div key={host.id} className="flex justify-between items-center">
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>{host.name}</div>
            <div className="text-sm" style={{ color: colors.chiliGray }}>
              {host.shiftsThisWeek} shifts
            </div>
          </div>
          <div style={{
            backgroundColor: host.greetingScore >= 90 ? colors.chiliGreen : colors.chiliYellow,
            color: host.greetingScore >= 90 ? 'white' : colors.chiliNavy,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            {host.greetingScore}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## TOOL 7: FOH Team Development 👥

### Purpose
Manage training, reviews, and development for FOH team members.

### Dashboard

```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">👥 FOH Team Development</h2>
  
  <div className="grid grid-cols-4 gap-4 mb-4">
    <div className="text-center">
      <div className="text-4xl font-bold">{totalFOH}</div>
      <div className="text-sm opacity-75">Total FOH Team</div>
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
  {fohTeam.map(member => (
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
              {member.gwapCount}
            </div>
            <div style={{ color: colors.chiliGray }}>GWAP Count</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.avgGreet}s
            </div>
            <div style={{ color: colors.chiliGray }}>Avg Greet Time</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.fiveTenScore}%
            </div>
            <div style={{ color: colors.chiliGray }}>5/10 Compliance</div>
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
-- GWAP Tracking
CREATE TABLE hospitality_gwap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  date DATE NOT NULL,
  position TEXT NOT NULL,
  team_member_id UUID REFERENCES team_members(id),
  issue_type TEXT NOT NULL,
  description TEXT,
  resolution TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

-- Server Observations
CREATE TABLE server_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  server_id UUID REFERENCES team_members(id),
  observation_date TIMESTAMP DEFAULT NOW(),
  greet_time_seconds INT,
  recommended_margapp BOOLEAN,
  attentiveness_score INT CHECK (attentiveness_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5/10 Observations
CREATE TABLE five_ten_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  team_member_id UUID REFERENCES team_members(id),
  observation_date TIMESTAMP DEFAULT NOW(),
  five_foot_rule BOOLEAN NOT NULL,
  ten_foot_rule BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guest Feedback
CREATE TABLE guest_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  feedback_date DATE NOT NULL,
  feedback_type TEXT NOT NULL,
  team_member_id UUID REFERENCES team_members(id),
  comment TEXT,
  response TEXT,
  responded BOOLEAN DEFAULT false,
  responded_at TIMESTAMP,
  survey_score INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Connection Board Updates
CREATE TABLE connection_board_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  update_date DATE NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  team_member_id UUID REFERENCES team_members(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Host Performance
CREATE TABLE host_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES managers(id),
  host_id UUID REFERENCES team_members(id),
  observation_date TIMESTAMP DEFAULT NOW(),
  greeted_properly BOOLEAN,
  door_service_seconds INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS on all tables
ALTER TABLE hospitality_gwap DISABLE ROW LEVEL SECURITY;
ALTER TABLE server_observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE five_ten_observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE guest_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE connection_board_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE host_observations DISABLE ROW LEVEL SECURITY;
```

---

## NAVIGATION & LAYOUT

### Hospitality Manager Dashboard (Main View)

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
    <h1 className="text-3xl font-bold mb-2">🎉 Hospitality Leader Dashboard</h1>
    <p className="opacity-90">Excellence in Guest Experience</p>
  </div>
  
  {/* Quick Stats Row */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
    <StatCard value="9.2%" label="GWAP" color={colors.chiliGreen} />
    <StatCard value="52s" label="Avg Greet" color={colors.chiliGreen} />
    <StatCard value="94%" label="5/10 Culture" color={colors.chiliGreen} />
    <StatCard value="4.2" label="Guest Rating" color={colors.chiliYellow} />
    <StatCard value="12" label="Feedback Today" color={colors.chiliNavy} />
  </div>
  
  {/* Tool Cards */}
  <div className="grid gap-4">
    <ToolCard
      icon="🚨"
      title="GWAP Tracker"
      description="Track guest service issues"
      status="9.2% - On Target"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="⭐"
      title="Server Excellence"
      description="Monitor server performance"
      status="52s avg greet"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="👀"
      title="5/10 Culture Tracker"
      description="Enforce hospitality standards"
      status="94% compliance"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="💬"
      title="Guest Feedback"
      description="Track compliments & complaints"
      status="12 new today"
      statusColor={colors.chiliYellow}
    />
    
    <ToolCard
      icon="📋"
      title="Connection Board"
      description="Update HOH communication"
      status="Last update: 2h ago"
      statusColor={colors.chiliNavy}
    />
    
    <ToolCard
      icon="🚪"
      title="Host Excellence"
      description="Monitor door service"
      status="96% greeting rate"
      statusColor={colors.chiliGreen}
    />
    
    <ToolCard
      icon="👥"
      title="FOH Team Development"
      description="Training, reviews, cross-training"
      status="3 need reviews"
      statusColor={colors.chiliRed}
    />
  </div>
</div>
```

---

🌶️ **Complete Hospitality Manager toolkit - manage FOH excellence from your phone!**
