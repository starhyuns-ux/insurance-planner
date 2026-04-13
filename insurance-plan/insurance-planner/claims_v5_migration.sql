-- V5 Migration: Fax transmission tracking
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS fax_receipt_id text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS fax_status text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS fax_sent_at timestamptz;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS fax_error text;
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS fax_pages integer;
