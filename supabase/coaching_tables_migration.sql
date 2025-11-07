-- Coaching Tools Database Schema
-- Run this in Supabase SQL Editor after the main schema

-- ===========================================
-- FLOOR OBSERVATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS floor_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL, -- 'AM', 'PM', 'Close'
  observations JSONB NOT NULL, -- Position-specific observations
  metrics JSONB, -- Shift metrics (sales, labor, etc)
  top_performer JSONB, -- Top performer data {name, position, reason}
  coaching_priorities JSONB, -- Follow-up items for next shift
  guest_feedback JSONB, -- Guest compliments/complaints
  manager_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_floor_obs_manager ON floor_observations(manager_id, shift_date);
CREATE INDEX idx_floor_obs_date ON floor_observations(shift_date DESC);

-- ===========================================
-- TEAM MEMBERS TABLE (for 1:1s)
-- ===========================================
CREATE TABLE IF NOT EXISTS coaching_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  manager_id TEXT NOT NULL,
  hire_date DATE,
  cross_training JSONB, -- {positions: ['Server', 'Host'], status: 'in_progress'}
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_team_member_manager ON coaching_team_members(manager_id);

-- ===========================================
-- WEEKLY 1:1s TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS one_on_ones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_member_id UUID REFERENCES coaching_team_members(id) ON DELETE CASCADE,
  manager_id TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  fiscal_week TEXT,
  fiscal_period TEXT,

  -- Metrics
  metrics JSONB NOT NULL DEFAULT '{}', -- {sales: 100, upsells: 5, gwap: 2.3}

  -- Wins & Recognition
  wins TEXT[], -- Array of win descriptions
  manager_recognition TEXT[], -- Recognition from manager
  peer_shoutouts TEXT[], -- Shoutouts from peers
  guest_compliments TEXT[], -- Guest compliments

  -- Behavior Ratings (position-specific)
  behavior_ratings JSONB NOT NULL DEFAULT '{}', -- {greeting: 4, suggestive_selling: 3, ...}

  -- Development
  focus_behavior TEXT,
  action_plan JSONB, -- {steps: [], timeline: '', support_needed: ''}

  -- Cross-Training
  cross_training_status JSONB, -- {current: ['Server'], next: 'Bartender', progress: 50}

  -- Schedule & Feedback
  schedule_notes TEXT,
  open_feedback TEXT,
  manager_feedback TEXT,

  -- Goals & Commitments
  team_member_commits TEXT[], -- What TM commits to
  manager_commits TEXT[], -- What manager commits to

  -- Follow-up
  follow_up_items JSONB, -- [{item: '', due_date: '', status: ''}]
  next_meeting_date DATE,

  -- Visibility (CRITICAL for multi-manager access)
  visible_to TEXT[], -- Array of manager_ids who can view

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_1on1_team_member ON one_on_ones(team_member_id, meeting_date DESC);
CREATE INDEX idx_1on1_manager ON one_on_ones(manager_id, meeting_date DESC);
CREATE INDEX idx_1on1_visible ON one_on_ones USING GIN(visible_to);

-- ===========================================
-- SCENARIO PRACTICE TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS scenario_practice (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL, -- ID from the markdown file
  practiced_date DATE NOT NULL,
  notes TEXT,
  team_members TEXT[], -- Who participated
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_scenario_manager ON scenario_practice(manager_id, practiced_date DESC);

-- ===========================================
-- COACHING ACTIVITY TRACKING (for analytics)
-- ===========================================
CREATE TABLE IF NOT EXISTS coaching_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'floor_observation', '1on1', 'scenario', 'recognition'
  activity_date DATE NOT NULL,
  team_member_id UUID REFERENCES coaching_team_members(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_coaching_activity_manager ON coaching_activity(manager_id, activity_date DESC);
CREATE INDEX idx_coaching_activity_type ON coaching_activity(activity_type, activity_date DESC);

-- ===========================================
-- Enable RLS for all new tables
-- ===========================================
ALTER TABLE floor_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_on_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_activity ENABLE ROW LEVEL SECURITY;

-- For now, create policies that allow all operations (we'll tighten this with auth later)
CREATE POLICY "Enable all for floor_observations" ON floor_observations
  FOR ALL USING (true);

CREATE POLICY "Enable all for coaching_team_members" ON coaching_team_members
  FOR ALL USING (true);

CREATE POLICY "Enable all for one_on_ones" ON one_on_ones
  FOR ALL USING (true);

CREATE POLICY "Enable all for scenario_practice" ON scenario_practice
  FOR ALL USING (true);

CREATE POLICY "Enable all for coaching_activity" ON coaching_activity
  FOR ALL USING (true);

-- ===========================================
-- Helper Functions
-- ===========================================

-- Function to get visible 1:1s for a manager
CREATE OR REPLACE FUNCTION get_visible_one_on_ones(manager_id_param TEXT)
RETURNS TABLE (
  id UUID,
  team_member_id UUID,
  manager_id TEXT,
  manager_name TEXT,
  meeting_date DATE,
  team_member_name TEXT,
  team_member_position TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id,
    o.team_member_id,
    o.manager_id,
    o.manager_name,
    o.meeting_date,
    tm.name as team_member_name,
    tm.position as team_member_position
  FROM one_on_ones o
  JOIN coaching_team_members tm ON tm.id = o.team_member_id
  WHERE o.manager_id = manager_id_param
     OR manager_id_param = ANY(o.visible_to)
  ORDER BY o.meeting_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate coaching metrics for a manager
CREATE OR REPLACE FUNCTION get_coaching_metrics(
  manager_id_param TEXT,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  total_observations INTEGER,
  total_one_on_ones INTEGER,
  total_scenarios INTEGER,
  team_members_coached INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM floor_observations
     WHERE manager_id = manager_id_param
     AND shift_date BETWEEN start_date AND end_date),
    (SELECT COUNT(*)::INTEGER FROM one_on_ones
     WHERE manager_id = manager_id_param
     AND meeting_date BETWEEN start_date AND end_date),
    (SELECT COUNT(*)::INTEGER FROM scenario_practice
     WHERE manager_id = manager_id_param
     AND practiced_date BETWEEN start_date AND end_date),
    (SELECT COUNT(DISTINCT team_member_id)::INTEGER FROM one_on_ones
     WHERE manager_id = manager_id_param
     AND meeting_date BETWEEN start_date AND end_date);
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_floor_observations_updated_at
  BEFORE UPDATE ON floor_observations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_team_members_updated_at
  BEFORE UPDATE ON coaching_team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_one_on_ones_updated_at
  BEFORE UPDATE ON one_on_ones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Sample Data (Optional - for testing)
-- ===========================================

-- Sample team members (uncomment to use)
/*
INSERT INTO coaching_team_members (name, position, manager_id, hire_date) VALUES
('Sarah Johnson', 'Server', 'culinary', '2024-03-15'),
('Mike Rodriguez', 'Cook', 'culinary', '2024-01-10'),
('Emily Chen', 'Host', 'hospitality', '2024-06-01'),
('David Smith', 'Bartender', 'togoBar', '2023-11-20'),
('Jessica Williams', 'To-Go Specialist', 'togoBar', '2024-02-28');
*/

COMMENT ON TABLE floor_observations IS 'Stores daily floor observation data for tracking team member behaviors and coaching';
COMMENT ON TABLE coaching_team_members IS 'Team member profiles for 1:1 meetings and development tracking';
COMMENT ON TABLE one_on_ones IS 'Weekly 1:1 meeting records with multi-manager visibility';
COMMENT ON TABLE scenario_practice IS 'Tracking for role-play scenario practice sessions';
COMMENT ON TABLE coaching_activity IS 'General coaching activity tracking for analytics';