-- Supabase Schema for Manager AOR Tracker
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Managers table
CREATE TABLE IF NOT EXISTS managers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  aor TEXT NOT NULL, -- 'culinary', 'hospitality', 'togoBar', or 'gm'
  is_gm BOOLEAN DEFAULT FALSE,
  restaurant_number INTEGER DEFAULT 605,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Task completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'other'
  completion_date DATE NOT NULL,
  fiscal_period INTEGER NOT NULL,
  fiscal_week INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(manager_id, task_name, frequency, completion_date)
);

-- Team members table (for GM view)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gm_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(gm_id, member_id)
);

-- Period metrics table (for tracking overall performance)
CREATE TABLE IF NOT EXISTS period_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
  fiscal_period INTEGER NOT NULL,
  fiscal_year INTEGER NOT NULL,
  daily_completion_rate DECIMAL(5,2),
  weekly_completion_rate DECIMAL(5,2),
  monthly_completion_rate DECIMAL(5,2),
  quarterly_completion_rate DECIMAL(5,2),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(manager_id, fiscal_period, fiscal_year)
);

-- Create indexes for better query performance
CREATE INDEX idx_task_completions_manager_date ON task_completions(manager_id, completion_date);
CREATE INDEX idx_task_completions_period ON task_completions(fiscal_period, fiscal_week);
CREATE INDEX idx_managers_aor ON managers(aor);

-- Enable Row Level Security (RLS) - we'll add policies when we add auth
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_metrics ENABLE ROW LEVEL SECURITY;

-- For now, create policies that allow all operations (we'll tighten this with auth later)
CREATE POLICY "Enable all for managers" ON managers
  FOR ALL USING (true);

CREATE POLICY "Enable all for task_completions" ON task_completions
  FOR ALL USING (true);

CREATE POLICY "Enable all for team_members" ON team_members
  FOR ALL USING (true);

CREATE POLICY "Enable all for period_metrics" ON period_metrics
  FOR ALL USING (true);
