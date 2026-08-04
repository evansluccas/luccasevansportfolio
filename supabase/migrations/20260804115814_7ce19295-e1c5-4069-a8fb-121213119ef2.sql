ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS hero_subtitle text,
  ADD COLUMN IF NOT EXISTS hero_subheadline text,
  ADD COLUMN IF NOT EXISTS resume_url text;