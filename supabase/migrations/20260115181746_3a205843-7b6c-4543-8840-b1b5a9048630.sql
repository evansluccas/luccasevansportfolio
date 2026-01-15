-- Add year column to experiences table
ALTER TABLE public.experiences ADD COLUMN year text;

-- Migrate existing data: extract year from start_date
UPDATE public.experiences SET year = EXTRACT(YEAR FROM start_date)::text WHERE year IS NULL;