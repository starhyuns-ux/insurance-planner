-- V3 Migration: Add comprehensive claim fields
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS resident_number text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS same_as_policyholder boolean DEFAULT true;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS policyholder_name text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS notification_person text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS accident_type text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS accident_detail text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS bank_account text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS bank_holder text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'GENERAL';
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS signature_type text DEFAULT 'NON_FACE';
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS consent_third_party boolean DEFAULT false;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS consent_at timestamptz;
