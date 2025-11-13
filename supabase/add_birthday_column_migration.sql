-- Add Birthday Column to Team Members Table
-- Run this migration to add date_of_birth support

-- Add date_of_birth column to team_members table
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create index for faster birthday queries
CREATE INDEX IF NOT EXISTS idx_team_members_birthday ON team_members(date_of_birth);

-- Add comment to document the column
COMMENT ON COLUMN team_members.date_of_birth IS 'Team member''s date of birth for birthday tracking';

-- Example queries after migration:

-- Get all birthdays this month
-- SELECT * FROM team_members
-- WHERE EXTRACT(MONTH FROM date_of_birth) = EXTRACT(MONTH FROM CURRENT_DATE)
-- ORDER BY EXTRACT(DAY FROM date_of_birth);

-- Get upcoming birthdays in next 30 days
-- SELECT name, date_of_birth,
--   CASE
--     WHEN DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || EXTRACT(MONTH FROM date_of_birth) || '-' || EXTRACT(DAY FROM date_of_birth)) >= CURRENT_DATE
--     THEN DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || EXTRACT(MONTH FROM date_of_birth) || '-' || EXTRACT(DAY FROM date_of_birth)) - CURRENT_DATE
--     ELSE DATE(EXTRACT(YEAR FROM CURRENT_DATE) + 1 || '-' || EXTRACT(MONTH FROM date_of_birth) || '-' || EXTRACT(DAY FROM date_of_birth)) - CURRENT_DATE
--   END as days_until_birthday
-- FROM team_members
-- WHERE date_of_birth IS NOT NULL
-- ORDER BY days_until_birthday;
