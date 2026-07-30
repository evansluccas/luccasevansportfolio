ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS star_situation text,
  ADD COLUMN IF NOT EXISTS star_task text,
  ADD COLUMN IF NOT EXISTS star_action text,
  ADD COLUMN IF NOT EXISTS star_result text,
  ADD COLUMN IF NOT EXISTS show_details boolean NOT NULL DEFAULT true;