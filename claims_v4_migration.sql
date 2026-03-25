-- V4 Migration: Car accident specific fields
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS car_accident_detail text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS car_insurance_claim boolean DEFAULT false;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS car_insurance_company text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS car_agent_phone text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS car_plate_number text;
