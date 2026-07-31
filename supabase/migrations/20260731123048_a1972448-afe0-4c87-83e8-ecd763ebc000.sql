ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS cover_heading text,
  ADD COLUMN IF NOT EXISTS cover_subheading text;