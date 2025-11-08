# 👨‍🍳 Culinary Manager Tools - Detailed Specification

## OVERVIEW

Build interactive tools specifically for the Culinary Leader / SAFE Leader to manage their AOR responsibilities.

These tools should help them:
- Track Five to Drive execution
- Monitor food quality and SAFE scores
- Manage COS (Cost of Sales) for food
- Oversee HOH team development
- Handle daily kitchen operations

---

## 🎨 DESIGN LANGUAGE

**Match the poster style:**
- Navy headers with white text
- Green success indicators
- Red for coaching needs
- Cream page backgrounds
- High contrast, bold buttons

---

## TOOL 1: Five to Drive Dashboard 🔥

### Purpose
Track the five critical prep procedures daily to ensure kitchen execution.

### Features

**Daily Five to Drive Checklist:**
```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '1rem'
}}>
  <h2 className="text-2xl font-bold mb-4">
    🔥 Five to Drive - {currentDate}
  </h2>
  
  {/* Each procedure gets a card */}
  <div className="space-y-3">
    {fiveToDrive.map((procedure, index) => (
      <div key={index} style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '8px',
        borderLeft: `4px solid ${procedure.completed ? colors.chiliGreen : colors.chiliRed}`
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{procedure.name}</h3>
            <p className="text-sm opacity-75">{procedure.standard}</p>
          </div>
          
          {/* Toggle completed */}
          <button
            onClick={() => toggleProcedure(index)}
            style={{
              backgroundColor: procedure.completed ? colors.chiliGreen : colors.chiliRed,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none'
            }}
          >
            {procedure.completed ? '✓ Complete' : '○ To Do'}
          </button>
        </div>
        
        {/* If incomplete, show coaching button */}
        {!procedure.completed && (
          <button
            onClick={() => openCoachingNotes(procedure)}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${colors.chiliYellow}`,
              color: colors.chiliYellow,
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              fontWeight: 'bold'
            }}
          >
            + Add Coaching Note
          </button>
        )}
      </div>
    ))}
  </div>
  
  {/* Overall completion */}
  <div className="mt-4 p-4 rounded-lg" style={{
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTop: `3px solid ${allComplete ? colors.chiliGreen : colors.chiliYellow}`
  }}>
    <div className="flex justify-between items-center">
      <span className="text-xl font-bold">
        {completedCount}/5 Complete
      </span>
      {allComplete && (
        <span className="text-2xl">🔥 ALL DONE!</span>
      )}
    </div>
  </div>
</div>
```

**Sample Five to Drive Procedures:**
1. Pull Thaw by 12pm
2. Prep in Order (FIFO)
3. Job Aids Posted & Current
4. Systems Followed (portions, recipes)
5. Quality Standards Met

**Data Storage (Supabase):**
```sql
CREATE TABLE five_to_drive_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  date DATE NOT NULL,
  procedures JSONB NOT NULL, -- Array of {name, completed, notes}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_5td_manager_date ON five_to_drive_tracking(manager_id, date DESC);
```

**Analytics View:**
- Weekly completion rate per procedure
- Trends over time
- Which procedures need most coaching

---

## TOOL 2: KitchenSync Validation Tracker 🔍

### Purpose
Daily validation that kitchen systems are being followed correctly.

### Features

**Morning Validation Checklist:**
```jsx
<div style={{
  backgroundColor: 'white',
  border: `3px solid ${colors.chiliNavy}`,
  borderRadius: '12px',
  overflow: 'hidden'
}}>
  {/* Header */}
  <div style={{
    backgroundColor: colors.chiliNavy,
    color: 'white',
    padding: '1rem'
  }}>
    <h3 className="text-xl font-bold">🔍 KitchenSync Validation - {shift}</h3>
    <p className="text-sm opacity-75">Complete by 11am</p>
  </div>
  
  {/* Checklist items */}
  <div className="p-4 space-y-3">
    {kitchenSyncItems.map((item, index) => (
      <label key={index} className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleItem(index)}
          className="mt-1 mr-3 w-5 h-5"
          style={{ accentColor: colors.chiliGreen }}
        />
        <div className="flex-1">
          <div className="font-semibold" style={{ color: colors.chiliNavy }}>
            {item.label}
          </div>
          <div className="text-sm" style={{ color: colors.chiliGray }}>
            {item.description}
          </div>
          
          {/* Issue reporting */}
          {item.checked === false && (
            <button
              onClick={() => reportIssue(item)}
              className="mt-2 text-sm"
              style={{
                color: colors.chiliRed,
                textDecoration: 'underline',
                fontWeight: 'bold'
              }}
            >
              ⚠ Report Issue
            </button>
          )}
        </div>
      </label>
    ))}
  </div>
  
  {/* Submit */}
  <div className="p-4 border-t">
    <button
      onClick={submitValidation}
      disabled={!allChecked}
      style={{
        backgroundColor: allChecked ? colors.chiliGreen : colors.chiliGray,
        color: 'white',
        padding: '1rem',
        width: '100%',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: 'none',
        cursor: allChecked ? 'pointer' : 'not-allowed'
      }}
    >
      {allChecked ? '✓ Submit Validation' : `${checkedCount}/${totalItems} Complete`}
    </button>
  </div>
</div>
```

**Checklist Items:**
- ☐ Job Aids posted and current
- ☐ Prep systems followed (order, portions)
- ☐ Pull Thaw completed by 12pm
- ☐ Temp logs updated
- ☐ Waste log started
- ☐ Expo setup complete

---

## TOOL 3: SAFE Score Manager 🛡️

### Purpose
Track and improve food safety scores (target: 93%+).

### Features

**SAFE Score Dashboard:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* Current Score */}
  <div style={{
    backgroundColor: currentScore >= 93 ? colors.chiliGreen : colors.chiliRed,
    color: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }}>
    <div className="text-5xl font-bold mb-2">{currentScore}%</div>
    <div className="text-lg opacity-90">Current SAFE Score</div>
    <div className="text-sm mt-2">
      {currentScore >= 93 ? '✓ Target Met' : `Need ${93 - currentScore}% improvement`}
    </div>
  </div>
  
  {/* Trend */}
  <div style={{
    backgroundColor: 'white',
    border: `3px solid ${colors.chiliNavy}`,
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center'
  }}>
    <div className="text-3xl font-bold mb-2" style={{ 
      color: trend === 'up' ? colors.chiliGreen : colors.chiliRed 
    }}>
      {trend === 'up' ? '↑' : '↓'} {Math.abs(trendValue)}%
    </div>
    <div style={{ color: colors.chiliBrown }}>vs Last Period</div>
  </div>
  
  {/* Next Audit */}
  <div style={{
    backgroundColor: colors.chiliNavy,
    color: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center'
  }}>
    <div className="text-3xl font-bold mb-2">{daysUntilAudit}</div>
    <div className="text-lg opacity-90">Days Until Next Audit</div>
    <button
      onClick={openAuditPrep}
      style={{
        backgroundColor: colors.chiliYellow,
        color: colors.chiliNavy,
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        marginTop: '1rem',
        border: 'none'
      }}
    >
      Prepare Now
    </button>
  </div>
</div>

{/* Action Items */}
<div style={{
  backgroundColor: 'white',
  border: `3px solid ${colors.chiliRed}`,
  borderRadius: '12px',
  padding: '1.5rem'
}}>
  <h3 className="text-xl font-bold mb-4" style={{ color: colors.chiliRed }}>
    ⚠ Action Items to Improve Score
  </h3>
  
  {actionItems.map((item, index) => (
    <div key={index} className="mb-3 p-3 rounded-lg" style={{
      backgroundColor: colors.chiliCream,
      borderLeft: `4px solid ${colors.chiliRed}`
    }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold" style={{ color: colors.chiliNavy }}>
            {item.category}
          </div>
          <div className="text-sm mt-1" style={{ color: colors.chiliBrown }}>
            {item.issue}
          </div>
        </div>
        <button
          onClick={() => markResolved(item.id)}
          style={{
            backgroundColor: colors.chiliGreen,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            border: 'none',
            fontSize: '0.875rem'
          }}
        >
          Mark Resolved
        </button>
      </div>
    </div>
  ))}
</div>
```

**Data Storage:**
```sql
CREATE TABLE safe_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  audit_date DATE NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  action_items JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_safe_scores ON safe_scores(manager_id, audit_date DESC);
```

---

## TOOL 4: COS Food Tracker 📊

### Purpose
Track and analyze Cost of Sales for food inventory.

### Features

**COS Dashboard:**
```jsx
<div style={{
  background: `linear-gradient(135deg, ${colors.chiliRed}, ${colors.chiliNavy})`,
  color: 'white',
  padding: '2rem',
  borderRadius: '12px',
  marginBottom: '2rem'
}}>
  <h2 className="text-3xl font-bold mb-4">📊 Food Cost Management</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Current Period COS */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px'
    }}>
      <div className="text-4xl font-bold mb-2">
        {currentCOS.toFixed(1)}%
      </div>
      <div className="text-sm opacity-90">Current COS</div>
      <div className="text-xs mt-2">
        {currentCOS <= targetCOS ? '✓ On Target' : '⚠ Over Target'}
      </div>
    </div>
    
    {/* Target */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px'
    }}>
      <div className="text-4xl font-bold mb-2">
        {targetCOS.toFixed(1)}%
      </div>
      <div className="text-sm opacity-90">Target COS</div>
    </div>
    
    {/* Variance */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px'
    }}>
      <div className="text-4xl font-bold mb-2" style={{
        color: variance < 0 ? colors.chiliGreen : colors.chiliRed
      }}>
        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
      </div>
      <div className="text-sm opacity-90">Variance</div>
    </div>
    
    {/* Waste */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '1.5rem',
      borderRadius: '8px'
    }}>
      <div className="text-4xl font-bold mb-2">
        ${wasteTotal}
      </div>
      <div className="text-sm opacity-90">Waste This Period</div>
    </div>
  </div>
</div>

{/* COS Action Plan */}
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
    <h3 className="text-xl font-bold">📋 COS Action Plan</h3>
  </div>
  
  <div className="p-4">
    <button
      onClick={openCOSAnalysis}
      style={{
        backgroundColor: colors.chiliGreen,
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        border: 'none',
        width: '100%',
        fontSize: '1.1rem',
        marginBottom: '1rem'
      }}
    >
      📊 Run COS Analysis
    </button>
    
    <button
      onClick={openInventory}
      style={{
        backgroundColor: 'white',
        border: `2px solid ${colors.chiliNavy}`,
        color: colors.chiliNavy,
        padding: '1rem 2rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        width: '100%',
        fontSize: '1.1rem'
      }}
    >
      📦 Start EOP Inventory
    </button>
  </div>
</div>
```

**COS Analysis Tool:**
- Variance by category (protein, produce, dry goods)
- Waste analysis (what's being thrown away most)
- Coaching opportunities (which cooks need training)
- Action plan builder

---

## TOOL 5: HOH Team Development Tracker 👥

### Purpose
Manage HOH team training, reviews, and development.

### Features

**Team Overview:**
```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '2rem'
}}>
  <h2 className="text-2xl font-bold mb-4">👥 Heart of House Team</h2>
  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="text-center">
      <div className="text-4xl font-bold">{teamSize}</div>
      <div className="text-sm opacity-75">Total HOH</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold" style={{ color: colors.chiliGreen }}>
        {trainingComplete}%
      </div>
      <div className="text-sm opacity-75">Training Complete</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold" style={{ color: colors.chiliYellow }}>
        {crossTraining}
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
<div className="grid gap-4">
  {hohTeam.map(member => (
    <div key={member.id} style={{
      backgroundColor: 'white',
      border: `3px solid ${colors.chiliNavy}`,
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: colors.chiliCream,
        padding: '1rem',
        borderBottom: `2px solid ${colors.chiliNavy}`
      }}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold" style={{ color: colors.chiliNavy }}>
              {member.name}
            </h3>
            <div className="flex gap-2 mt-2">
              {member.positions.map(pos => (
                <span
                  key={pos}
                  style={{
                    backgroundColor: colors.chiliGreen,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => open1on1(member)}
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
        {/* Training progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1" style={{ color: colors.chiliBrown }}>
            <span>Training Progress</span>
            <span>{member.trainingPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              style={{
                width: `${member.trainingPercent}%`,
                backgroundColor: member.trainingPercent === 100 ? colors.chiliGreen : colors.chiliYellow,
                height: '100%',
                borderRadius: '9999px',
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.vbtPercent}%
            </div>
            <div style={{ color: colors.chiliGray }}>VBT</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.vfdPercent}%
            </div>
            <div style={{ color: colors.chiliGray }}>VFD</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: colors.chiliNavy }}>
              {member.lastReview}
            </div>
            <div style={{ color: colors.chiliGray }}>Last Review</div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## TOOL 6: HOH Schedule Builder 📅

### Purpose
Build and manage HOH schedules aligned to forecast.

### Features

**Schedule Dashboard:**
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
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <h3 className="text-xl font-bold">📅 HOH Schedule - Week {weekNumber}</h3>
      <p className="text-sm opacity-75">Must post by Monday 5pm</p>
    </div>
    <div style={{
      backgroundColor: schedulePosted ? colors.chiliGreen : colors.chiliRed,
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontWeight: 'bold'
    }}>
      {schedulePosted ? '✓ Posted' : '○ Not Posted'}
    </div>
  </div>
  
  <div className="p-4">
    {/* Forecast alignment check */}
    <div className="mb-4 p-3 rounded-lg" style={{
      backgroundColor: forecastAligned ? colors.chiliGreen : colors.chiliYellow,
      color: forecastAligned ? 'white' : colors.chiliNavy
    }}>
      <div className="flex items-center justify-between">
        <span className="font-bold">
          {forecastAligned ? '✓ Schedule Aligned to Forecast' : '⚠ Review Labor vs Forecast'}
        </span>
        <button
          onClick={openForecastComparison}
          style={{
            backgroundColor: 'white',
            color: forecastAligned ? colors.chiliGreen : colors.chiliYellow,
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            border: 'none'
          }}
        >
          View Details
        </button>
      </div>
    </div>
    
    {/* Quick actions */}
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={openScheduleBuilder}
        style={{
          backgroundColor: colors.chiliGreen,
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          border: 'none'
        }}
      >
        Build Schedule
      </button>
      <button
        onClick={postSchedule}
        disabled={!readyToPost}
        style={{
          backgroundColor: readyToPost ? colors.chiliNavy : colors.chiliGray,
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          border: 'none'
        }}
      >
        Post Schedule
      </button>
    </div>
  </div>
</div>
```

---

## TOOL 7: Daily HOH Connection Board 📋

### Purpose
Manage and update the HOH Connection Board daily.

### Features

**Connection Board Manager:**
```jsx
<div style={{
  backgroundColor: colors.chiliNavy,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '12px'
}}>
  <h2 className="text-2xl font-bold mb-4">📋 HOH Connection Board - {today}</h2>
  
  <div className="space-y-4">
    {/* Food Cost % */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.chiliYellow}`
    }}>
      <label className="block text-sm font-bold mb-2">Food Cost %</label>
      <input
        type="number"
        step="0.1"
        value={foodCost}
        onChange={(e) => setFoodCost(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '6px',
          border: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: colors.chiliNavy
        }}
      />
    </div>
    
    {/* SAFE Score */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.chiliGreen}`
    }}>
      <label className="block text-sm font-bold mb-2">SAFE Score</label>
      <input
        type="number"
        value={safeScore}
        onChange={(e) => setSafeScore(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '6px',
          border: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: colors.chiliNavy
        }}
      />
    </div>
    
    {/* Safety Days */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.chiliGreen}`
    }}>
      <label className="block text-sm font-bold mb-2">Safety Days</label>
      <input
        type="number"
        value={safetyDays}
        onChange={(e) => setSafetyDays(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '6px',
          border: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: colors.chiliNavy
        }}
      />
    </div>
    
    {/* Team Recognition */}
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.chiliRed}`
    }}>
      <label className="block text-sm font-bold mb-2">🔥 Team Recognition</label>
      <textarea
        value={recognition}
        onChange={(e) => setRecognition(e.target.value)}
        placeholder="Shoutouts, achievements, wins..."
        rows={3}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '6px',
          border: 'none',
          color: colors.chiliNavy,
          fontFamily: 'inherit'
        }}
      />
    </div>
    
    {/* Update button */}
    <button
      onClick={updateConnectionBoard}
      style={{
        backgroundColor: colors.chiliGreen,
        color: 'white',
        padding: '1rem',
        width: '100%',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      ✓ Update Connection Board
    </button>
    
    {/* Take photo button */}
    <button
      onClick={takePhoto}
      style={{
        backgroundColor: 'white',
        color: colors.chiliNavy,
        padding: '1rem',
        width: '100%',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: `2px solid white`
      }}
    >
      📸 Take EOP Photo
    </button>
  </div>
</div>
```

---

## NAVIGATION & LAYOUT

### Culinary Manager Dashboard (Main View)

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
    <h1 className="text-3xl font-bold mb-2">👨‍🍳 Culinary Leader Dashboard</h1>
    <p className="opacity-90">Excellence Through Execution & Safety</p>
  </div>
  
  {/* Quick Stats Row */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
    <StatCard
      value="4/5"
      label="Five to Drive"
      color={colors.chiliYellow}
      onClick={openFiveToDrive}
    />
    <StatCard
      value="94%"
      label="SAFE Score"
      color={colors.chiliGreen}
      onClick={openSAFE}
    />
    <StatCard
      value="28.3%"
      label="Food COS"
      color={colors.chiliRed}
      onClick={openCOS}
    />
    <StatCard
      value="87%"
      label="HOH Training"
      color={colors.chiliYellow}
      onClick={openTeam}
    />
    <StatCard
      value="✓"
      label="Schedule Posted"
      color={colors.chiliGreen}
      onClick={openSchedule}
    />
  </div>
  
  {/* Tool Cards */}
  <div className="grid gap-4">
    <ToolCard
      icon="🔥"
      title="Five to Drive"
      description="Track daily prep procedures"
      status="4/5 Complete"
      statusColor={colors.chiliYellow}
      onClick={openFiveToDrive}
    />
    
    <ToolCard
      icon="🔍"
      title="KitchenSync Validation"
      description="Morning systems check"
      status="Not Started"
      statusColor={colors.chiliRed}
      onClick={openKitchenSync}
    />
    
    <ToolCard
      icon="🛡️"
      title="SAFE Score Manager"
      description="Food safety tracking and action plans"
      status="94% - On Target"
      statusColor={colors.chiliGreen}
      onClick={openSAFE}
    />
    
    <ToolCard
      icon="📊"
      title="COS Food Tracker"
      description="Cost of sales analysis and inventory"
      status="28.3% - Review Needed"
      statusColor={colors.chiliRed}
      onClick={openCOS}
    />
    
    <ToolCard
      icon="👥"
      title="HOH Team Development"
      description="Training, reviews, cross-training"
      status="3 need reviews"
      statusColor={colors.chiliYellow}
      onClick={openTeam}
    />
    
    <ToolCard
      icon="📅"
      title="HOH Schedule"
      description="Build and post schedules"
      status="Posted - On Time"
      statusColor={colors.chiliGreen}
      onClick={openSchedule}
    />
    
    <ToolCard
      icon="📋"
      title="Connection Board"
      description="Update daily metrics and recognition"
      status="Updated Today"
      statusColor={colors.chiliGreen}
      onClick={openConnectionBoard}
    />
  </div>
</div>
```

---

## DATABASE SCHEMA ADDITIONS

```sql
-- Five to Drive tracking
CREATE TABLE five_to_drive_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  date DATE NOT NULL,
  procedures JSONB NOT NULL,
  completion_rate DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- KitchenSync validations
CREATE TABLE kitchensync_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL,
  checklist JSONB NOT NULL,
  issues JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SAFE scores and action items
CREATE TABLE safe_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  audit_date DATE NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  action_items JSONB,
  resolved_items JSONB,
  next_audit_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- COS tracking
CREATE TABLE cos_food_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  period_number INT NOT NULL,
  fiscal_year INT NOT NULL,
  current_cos DECIMAL(5,2),
  target_cos DECIMAL(5,2),
  variance DECIMAL(5,2),
  waste_total DECIMAL(10,2),
  action_plan JSONB,
  inventory_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Connection board updates
CREATE TABLE hoh_connection_board (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  date DATE NOT NULL,
  food_cost DECIMAL(5,2),
  safe_score DECIMAL(5,2),
  safety_days INT,
  recognition TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## MOBILE OPTIMIZATION

All tools should work perfectly on mobile:
- Large touch targets (min 44px)
- Sticky headers for long scrolls
- Collapsible sections
- Swipe gestures for navigation
- Camera access for photo uploads
- Offline draft saving

---

## INTEGRATION WITH EXISTING APP

Add to main navigation:
```jsx
// If user is Culinary Manager
{manager.aor === 'culinary' && (
  <button onClick={() => navigate('/culinary-tools')}>
    👨‍🍳 My Culinary Tools
  </button>
)}
```

---

🌶️ **Build these tools so Culinary Managers can manage their kitchen from their phones - no more clipboards and paper!**
