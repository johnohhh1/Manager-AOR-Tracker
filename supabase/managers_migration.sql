-- Manager Accounts System Migration
-- Creates tables for multi-manager system with AOR assignments

-- Drop existing tables if they exist
DROP TABLE IF EXISTS manager_aor_metrics CASCADE;
DROP TABLE IF EXISTS manager_aor_activity CASCADE;
DROP TABLE IF EXISTS managers CASCADE;

-- Managers Table
CREATE TABLE public.managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  primary_aor TEXT NOT NULL CHECK (primary_aor IN ('culinary', 'hospitality', 'togoBar')),
  is_gm BOOLEAN DEFAULT false,
  hire_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Manager AOR Activity Table (tracks which AOR managers are viewing)
CREATE TABLE public.manager_aor_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE,
  current_aor TEXT NOT NULL CHECK (current_aor IN ('culinary', 'hospitality', 'togoBar')),
  primary_aor TEXT NOT NULL CHECK (primary_aor IN ('culinary', 'hospitality', 'togoBar')),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Manager AOR Metrics Table (tracks performance per AOR per manager)
CREATE TABLE public.manager_aor_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE,
  aor TEXT NOT NULL CHECK (aor IN ('culinary', 'hospitality', 'togoBar')),
  period_number INT NOT NULL,
  fiscal_year INT NOT NULL DEFAULT 2025,
  tasks_completed INT DEFAULT 0,
  tasks_total INT DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, aor, period_number, fiscal_year)
);

-- Disable RLS for managers system
ALTER TABLE public.managers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_aor_activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_aor_metrics DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_managers_email ON public.managers(email);
CREATE INDEX idx_managers_primary_aor ON public.managers(primary_aor);
CREATE INDEX idx_aor_activity_manager ON public.manager_aor_activity(manager_id);
CREATE INDEX idx_aor_metrics_manager_aor ON public.manager_aor_metrics(manager_id, aor);
CREATE INDEX idx_aor_metrics_period ON public.manager_aor_metrics(period_number, fiscal_year);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_managers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_temp, public
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Revoke public access and grant to authenticated users only
REVOKE ALL ON FUNCTION public.update_managers_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_managers_updated_at() TO authenticated;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS managers_updated_at ON public.managers;
CREATE TRIGGER managers_updated_at
  BEFORE UPDATE ON public.managers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_managers_updated_at();

-- Insert sample manager data
INSERT INTO public.managers (name, email, primary_aor, is_gm, hire_date) VALUES
('John Olenski', 'johnolenski@gmail.com', 'culinary', true, '2020-01-01'),
('Tiffany Larkins', 'tlarkins@chilis605.com', 'culinary', false, '2021-03-15'),
('Tiff Wright', 'twright@chilis605.com', 'hospitality', false, '2021-06-01'),
('Jason Roberts', 'jroberts@chilis605.com', 'togoBar', false, '2022-01-10');

-- Verify the data
SELECT
  name,
  email,
  primary_aor,
  is_gm,
  CASE
    WHEN primary_aor = 'culinary' THEN 'Culinary Leader / SAFE Leader'
    WHEN primary_aor = 'hospitality' THEN 'Hospitality Leader'
    WHEN primary_aor = 'togoBar' THEN 'To-Go/Bar Leader'
  END as aor_title
FROM public.managers
ORDER BY is_gm DESC, name;
