-- Drop all AOR tracking tables
-- Run this in Supabase SQL Editor to remove unused AOR tables

-- Hospitality Tables
DROP TABLE IF EXISTS public.hospitality_gwap_issues CASCADE;
DROP TABLE IF EXISTS public.hospitality_gwap CASCADE;
DROP TABLE IF EXISTS public.server_performance CASCADE;
DROP TABLE IF EXISTS public.five_ten_culture CASCADE;
DROP TABLE IF EXISTS public.guest_feedback CASCADE;
DROP TABLE IF EXISTS public.host_performance CASCADE;

-- Culinary Tables
DROP TABLE IF EXISTS public.five_to_drive_tracking CASCADE;
DROP TABLE IF EXISTS public.kitchen_sync_validation CASCADE;
DROP TABLE IF EXISTS public.safe_scores CASCADE;
DROP TABLE IF EXISTS public.culinary_cos CASCADE;
DROP TABLE IF EXISTS public.hoh_schedules CASCADE;
DROP TABLE IF EXISTS public.hoh_connection_board CASCADE;

-- To-Go/Bar Tables
DROP TABLE IF EXISTS public.togo_accuracy CASCADE;
DROP TABLE IF EXISTS public.togo_gwap CASCADE;
DROP TABLE IF EXISTS public.bar_sales CASCADE;
DROP TABLE IF EXISTS public.mcr_signups CASCADE;
DROP TABLE IF EXISTS public.bwl_orders CASCADE;
DROP TABLE IF EXISTS public.liquor_cos CASCADE;
