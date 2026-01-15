-- Add multiple title fields for cycling animation
ALTER TABLE public.site_config 
ADD COLUMN title_2 text NULL,
ADD COLUMN title_3 text NULL,
ADD COLUMN title_4 text NULL;

-- Add custom icon URLs for contact information
ALTER TABLE public.site_config 
ADD COLUMN linkedin_icon_url text NULL,
ADD COLUMN email_icon_url text NULL,
ADD COLUMN location_icon_url text NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.site_config.title IS 'Primary title/role (first in rotation)';
COMMENT ON COLUMN public.site_config.title_2 IS 'Second title/role (optional, for rotation)';
COMMENT ON COLUMN public.site_config.title_3 IS 'Third title/role (optional, for rotation)';
COMMENT ON COLUMN public.site_config.title_4 IS 'Fourth title/role (optional, for rotation)';
COMMENT ON COLUMN public.site_config.linkedin_icon_url IS 'Custom icon for LinkedIn contact';
COMMENT ON COLUMN public.site_config.email_icon_url IS 'Custom icon for Email contact';
COMMENT ON COLUMN public.site_config.location_icon_url IS 'Custom icon for Location contact';