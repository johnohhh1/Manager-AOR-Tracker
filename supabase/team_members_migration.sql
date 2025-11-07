-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS team_members CASCADE;

-- Team Members Table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  position TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read team members
CREATE POLICY "Anyone can view team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to insert team members
CREATE POLICY "Anyone can insert team members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow all authenticated users to update team members
CREATE POLICY "Anyone can update team members"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow all authenticated users to delete team members
CREATE POLICY "Anyone can delete team members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_team_members_name ON team_members(name);
CREATE INDEX idx_team_members_position ON team_members(position);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_team_members_updated_at()
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
REVOKE ALL ON FUNCTION public.update_team_members_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_team_members_updated_at() TO authenticated;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS team_members_updated_at ON public.team_members;
CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_members_updated_at();
