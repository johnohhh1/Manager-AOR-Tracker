-- Safely disable RLS on existing coaching tables
-- This script checks if tables exist before trying to disable RLS

DO $$
BEGIN
  -- Team Members (new table)
  IF to_regclass('public.team_members') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on team_members';
  END IF;

  -- Floor Observations
  IF to_regclass('public.floor_observations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.floor_observations DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on floor_observations';
  END IF;

  -- One on Ones (correct name, not weekly_1on1s)
  IF to_regclass('public.one_on_ones') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.one_on_ones DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on one_on_ones';
  END IF;

  -- Coaching Team Members
  IF to_regclass('public.coaching_team_members') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.coaching_team_members DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on coaching_team_members';
  END IF;

  -- Scenario Practice
  IF to_regclass('public.scenario_practice') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.scenario_practice DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on scenario_practice';
  END IF;

  -- Coaching Activity
  IF to_regclass('public.coaching_activity') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.coaching_activity DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on coaching_activity';
  END IF;

  -- Five to Drive Tracking (if exists)
  IF to_regclass('public.five_to_drive_tracking') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.five_to_drive_tracking DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on five_to_drive_tracking';
  END IF;

  -- KitchenSync Validations (if exists)
  IF to_regclass('public.kitchensync_validations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.kitchensync_validations DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on kitchensync_validations';
  END IF;

  -- SAFE Scores (if exists)
  IF to_regclass('public.safe_scores') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.safe_scores DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on safe_scores';
  END IF;

  -- COS Food Tracking (if exists)
  IF to_regclass('public.cos_food_tracking') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.cos_food_tracking DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on cos_food_tracking';
  END IF;

  -- HOH Connection Board (if exists)
  IF to_regclass('public.hoh_connection_board') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.hoh_connection_board DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'Disabled RLS on hoh_connection_board';
  END IF;

END $$;

-- Verify which tables have RLS disabled
SELECT
  schemaname,
  tablename,
  CASE
    WHEN rowsecurity THEN 'ENABLED'
    ELSE 'DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'team_members',
    'floor_observations',
    'one_on_ones',
    'coaching_team_members',
    'scenario_practice',
    'coaching_activity',
    'five_to_drive_tracking',
    'kitchensync_validations',
    'safe_scores',
    'cos_food_tracking',
    'hoh_connection_board'
  )
ORDER BY tablename;
