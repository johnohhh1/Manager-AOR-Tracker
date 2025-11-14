-- Brand Standards Validation Tool - Database Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Validation Sessions Table
CREATE TABLE IF NOT EXISTS brand_standards_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id TEXT NOT NULL,
  validation_date DATE NOT NULL,
  shift TEXT, -- 'AM' or 'PM'
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Individual Section Results Table
CREATE TABLE IF NOT EXISTS validation_section_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID NOT NULL REFERENCES brand_standards_validations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL, -- 'Food Safety', 'Host Stand', 'Dining Room', etc.
  items_checked INTEGER DEFAULT 0,
  items_total INTEGER,
  issues_found INTEGER DEFAULT 0,
  compliant BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Action Items from Validation Table
CREATE TABLE IF NOT EXISTS validation_action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID NOT NULL REFERENCES brand_standards_validations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  action_required TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed'
  reference_photo_url TEXT, -- URL to reference photo from doc
  issue_photo_url TEXT, -- URL to compressed photo taken during validation
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Photo Storage Table (compressed)
CREATE TABLE IF NOT EXISTS validation_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_id UUID NOT NULL REFERENCES brand_standards_validations(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  photo_data TEXT NOT NULL, -- Base64 compressed image (max 100KB)
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_validations_manager ON brand_standards_validations(manager_id, validation_date);
CREATE INDEX IF NOT EXISTS idx_brand_validations_date ON brand_standards_validations(validation_date DESC);
CREATE INDEX IF NOT EXISTS idx_section_results_validation ON validation_section_results(validation_id);
CREATE INDEX IF NOT EXISTS idx_action_items_validation ON validation_action_items(validation_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON validation_action_items(status);
CREATE INDEX IF NOT EXISTS idx_photos_validation ON validation_photos(validation_id);

-- Disable RLS (matching app pattern - no auth yet)
ALTER TABLE brand_standards_validations DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_section_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_action_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_photos DISABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Brand Standards Validation tables created successfully!';
  RAISE NOTICE 'Tables: brand_standards_validations, validation_section_results, validation_action_items, validation_photos';
END $$;
