-- Add insurance company and transmission tracking columns
ALTER TABLE public.claims 
ADD COLUMN IF NOT EXISTS insurance_company text,
ADD COLUMN IF NOT EXISTS transmission_status text DEFAULT 'NOT_SENT';

-- Update existing rows if any
UPDATE public.claims SET transmission_status = 'NOT_SENT' WHERE transmission_status IS NULL;
