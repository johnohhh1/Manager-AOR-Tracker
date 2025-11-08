-- ============================================
-- COMPLETE AOR TOOLS MIGRATION
-- All 21 tools across 3 manager dashboards
-- ============================================

-- Drop all existing AOR tables if they exist
DROP TABLE IF EXISTS public.liquor_cos_tracking CASCADE;
DROP TABLE IF EXISTS public.bwl_orders CASCADE;
DROP TABLE IF EXISTS public.mcr_signups CASCADE;
DROP TABLE IF EXISTS public.bar_incremental_sales CASCADE;
DROP TABLE IF EXISTS public.togo_gwap CASCADE;
DROP TABLE IF EXISTS public.togo_missing_items CASCADE;
DROP TABLE IF EXISTS public.host_observations CASCADE;
DROP TABLE IF EXISTS public.connection_board_updates CASCADE;
DROP TABLE IF EXISTS public.guest_feedback CASCADE;
DROP TABLE IF EXISTS public.five_ten_observations CASCADE;
DROP TABLE IF EXISTS public.server_observations CASCADE;
DROP TABLE IF EXISTS public.hospitality_gwap_issues CASCADE;
DROP TABLE IF EXISTS public.hospitality_gwap CASCADE;
DROP TABLE IF EXISTS public.hoh_connection_board CASCADE;
DROP TABLE IF EXISTS public.cos_food_tracking CASCADE;
DROP TABLE IF EXISTS public.safe_scores CASCADE;
DROP TABLE IF EXISTS public.kitchensync_validations CASCADE;
DROP TABLE IF EXISTS public.five_to_drive_tracking CASCADE;

-- ============================================
-- CULINARY MANAGER TOOLS (7 tools, 5 tables)
-- ============================================

-- TOOL 1: Five to Drive Dashboard
CREATE TABLE public.five_to_drive_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  procedures JSONB NOT NULL,
  completion_rate DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, tracking_date)
);

-- TOOL 2: KitchenSync Validation Tracker
CREATE TABLE public.kitchensync_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('am', 'pm', 'overnight')),
  checklist JSONB NOT NULL,
  issues JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, shift_date, shift_type)
);

-- TOOL 3: SAFE Score Manager
CREATE TABLE public.safe_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  audit_date DATE NOT NULL,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  action_items JSONB,
  resolved_items JSONB,
  next_audit_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, audit_date)
);

-- TOOL 4: COS Food Tracker
CREATE TABLE public.cos_food_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  period_number INT NOT NULL CHECK (period_number BETWEEN 1 AND 13),
  fiscal_year INT NOT NULL,
  current_cos DECIMAL(5,2),
  target_cos DECIMAL(5,2),
  variance DECIMAL(5,2),
  waste_total DECIMAL(10,2),
  action_plan JSONB,
  inventory_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, period_number, fiscal_year)
);

-- TOOL 7: Daily HOH Connection Board
CREATE TABLE public.hoh_connection_board (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  board_date DATE NOT NULL DEFAULT CURRENT_DATE,
  food_cost DECIMAL(5,2),
  safe_score DECIMAL(5,2),
  safety_days INT DEFAULT 0,
  recognition TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, board_date)
);

-- ============================================
-- HOSPITALITY MANAGER TOOLS (7 tools, 6 tables)
-- ============================================

-- TOOL 1: GWAP Tracker
CREATE TABLE public.hospitality_gwap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_guests INTEGER NOT NULL DEFAULT 0,
  issues_count INTEGER NOT NULL DEFAULT 0,
  gwap_percent DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN total_guests > 0 THEN (issues_count::DECIMAL / total_guests::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, tracking_date)
);

CREATE TABLE public.hospitality_gwap_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gwap_id UUID NOT NULL REFERENCES public.hospitality_gwap(id) ON DELETE CASCADE,
  issue_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  issue_type TEXT NOT NULL CHECK (issue_type IN ('wait_time', 'wrong_order', 'service_quality', 'food_quality', 'cleanliness', 'other')),
  server_name TEXT,
  table_number TEXT,
  description TEXT NOT NULL,
  resolution TEXT,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 2: Server Excellence Tracker
CREATE TABLE public.server_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  server_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  observation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  greet_time_seconds INT,
  recommended_margapp BOOLEAN,
  attentiveness_score INT CHECK (attentiveness_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 3: 5/10 Culture Tracker
CREATE TABLE public.five_ten_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  observation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  five_foot_rule BOOLEAN NOT NULL,
  ten_foot_rule BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 4: Guest Feedback Manager
CREATE TABLE public.guest_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  feedback_date DATE NOT NULL DEFAULT CURRENT_DATE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('compliment', 'complaint', 'survey', 'social_media')),
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  comment TEXT,
  response TEXT,
  responded BOOLEAN DEFAULT false,
  responded_at TIMESTAMP WITH TIME ZONE,
  survey_score INT CHECK (survey_score BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 5: Connection Board Tracker
CREATE TABLE public.connection_board_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('recognition', 'safety', 'sales', 'guest_feedback', 'team_news')),
  content TEXT NOT NULL,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 6: Host Excellence Tracker
CREATE TABLE public.host_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  host_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  observation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  greeted_within_30s BOOLEAN,
  door_service_provided BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TO-GO/BAR MANAGER TOOLS (7 tools, 7 tables)
-- ============================================

-- TOOL 1: To-Go Order Accuracy Tracker
CREATE TABLE public.togo_missing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  item_category TEXT NOT NULL CHECK (item_category IN ('entree', 'side', 'sauce', 'utensils', 'drink', 'dessert', 'other')),
  missing_item TEXT NOT NULL,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 2: To-Go GWAP Tracker
CREATE TABLE public.togo_gwap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  gwap_count INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  gwap_percent DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN total_orders > 0 THEN (gwap_count::DECIMAL / total_orders::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, tracking_date)
);

-- TOOL 3: Bar Incremental Sales Tracker
CREATE TABLE public.bar_incremental_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  bartender_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  shift_date DATE NOT NULL,
  shift_type TEXT CHECK (shift_type IN ('lunch', 'dinner', 'late_night')),
  incremental_amount DECIMAL(10,2),
  top_items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 4: My Chili's Rewards Sign-Ups
CREATE TABLE public.mcr_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  signup_date DATE NOT NULL DEFAULT CURRENT_DATE,
  shift_type TEXT CHECK (shift_type IN ('lunch', 'dinner', 'late_night')),
  signup_method TEXT CHECK (signup_method IN ('table', 'bar', 'togo', 'online')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 5: BWL Order Manager
CREATE TABLE public.bwl_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  order_date DATE NOT NULL,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10,2),
  delivery_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOOL 6: Liquor COS Tracker
CREATE TABLE public.liquor_cos_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  period_number INT NOT NULL CHECK (period_number BETWEEN 1 AND 13),
  fiscal_year INT NOT NULL,
  current_cos DECIMAL(5,2),
  target_cos DECIMAL(5,2),
  variance DECIMAL(5,2),
  wastage_amount DECIMAL(10,2),
  action_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, period_number, fiscal_year)
);

-- ============================================
-- DISABLE RLS (Internal tool - no public access)
-- ============================================

ALTER TABLE public.five_to_drive_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchensync_validations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cos_food_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hoh_connection_board DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.hospitality_gwap DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitality_gwap_issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.five_ten_observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_board_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_observations DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.togo_missing_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.togo_gwap DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bar_incremental_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcr_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bwl_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquor_cos_tracking DISABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Culinary indexes
CREATE INDEX idx_5td_manager_date ON public.five_to_drive_tracking(manager_id, tracking_date DESC);
CREATE INDEX idx_kitchensync_manager_date ON public.kitchensync_validations(manager_id, shift_date DESC);
CREATE INDEX idx_safe_scores_manager_date ON public.safe_scores(manager_id, audit_date DESC);
CREATE INDEX idx_cos_food_manager_period ON public.cos_food_tracking(manager_id, period_number, fiscal_year);
CREATE INDEX idx_hoh_board_manager_date ON public.hoh_connection_board(manager_id, board_date DESC);

-- Hospitality indexes
CREATE INDEX idx_gwap_manager_date ON public.hospitality_gwap(manager_id, tracking_date DESC);
CREATE INDEX idx_gwap_issues_gwap_id ON public.hospitality_gwap_issues(gwap_id);
CREATE INDEX idx_gwap_issues_time ON public.hospitality_gwap_issues(issue_time DESC);
CREATE INDEX idx_server_obs_manager ON public.server_observations(manager_id, observation_date DESC);
CREATE INDEX idx_510_obs_manager ON public.five_ten_observations(manager_id, observation_date DESC);
CREATE INDEX idx_feedback_manager_date ON public.guest_feedback(manager_id, feedback_date DESC);
CREATE INDEX idx_connection_manager_date ON public.connection_board_updates(manager_id, update_date DESC);
CREATE INDEX idx_host_obs_manager ON public.host_observations(manager_id, observation_date DESC);

-- To-Go/Bar indexes
CREATE INDEX idx_togo_missing_manager_date ON public.togo_missing_items(manager_id, order_date DESC);
CREATE INDEX idx_togo_gwap_manager_date ON public.togo_gwap(manager_id, tracking_date DESC);
CREATE INDEX idx_bar_sales_manager_date ON public.bar_incremental_sales(manager_id, shift_date DESC);
CREATE INDEX idx_mcr_manager_date ON public.mcr_signups(manager_id, signup_date DESC);
CREATE INDEX idx_bwl_manager_date ON public.bwl_orders(manager_id, order_date DESC);
CREATE INDEX idx_liquor_cos_manager_period ON public.liquor_cos_tracking(manager_id, period_number, fiscal_year);

-- Verification query
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'five_to_drive_tracking', 'kitchensync_validations', 'safe_scores', 'cos_food_tracking', 'hoh_connection_board',
    'hospitality_gwap', 'hospitality_gwap_issues', 'server_observations', 'five_ten_observations', 'guest_feedback', 'connection_board_updates', 'host_observations',
    'togo_missing_items', 'togo_gwap', 'bar_incremental_sales', 'mcr_signups', 'bwl_orders', 'liquor_cos_tracking'
  )
ORDER BY tablename;
