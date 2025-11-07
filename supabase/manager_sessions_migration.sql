-- Manager Sessions Table
-- Tracks active manager sessions in Supabase instead of localStorage

DROP TABLE IF EXISTS manager_sessions CASCADE;

CREATE TABLE public.manager_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  current_aor TEXT CHECK (current_aor IN ('culinary', 'hospitality', 'togoBar')),
  device_info TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Disable RLS for sessions
ALTER TABLE public.manager_sessions DISABLE ROW LEVEL SECURITY;

-- Create index for fast lookups
CREATE INDEX idx_sessions_token ON public.manager_sessions(session_token);
CREATE INDEX idx_sessions_manager ON public.manager_sessions(manager_id);
CREATE INDEX idx_sessions_expiry ON public.manager_sessions(expires_at);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SET search_path = pg_temp, public
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.manager_sessions
  WHERE expires_at < NOW();
END;
$$;

-- Revoke public access
REVOKE ALL ON FUNCTION public.cleanup_expired_sessions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions() TO authenticated;

-- Function to update last activity
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_temp, public
SECURITY DEFINER
AS $$
BEGIN
  NEW.last_activity = NOW();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.update_session_activity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_session_activity() TO authenticated;

-- Trigger to update last_activity
DROP TRIGGER IF EXISTS sessions_activity_update ON public.manager_sessions;
CREATE TRIGGER sessions_activity_update
  BEFORE UPDATE ON public.manager_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_activity();

-- Verify table created
SELECT 'Manager sessions table created successfully!' as status;
