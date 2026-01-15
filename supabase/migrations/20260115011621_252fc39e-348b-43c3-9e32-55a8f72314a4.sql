-- Create table for navigation links
CREATE TABLE public.nav_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  lang TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;

-- Public can read visible nav links
CREATE POLICY "Public can read visible nav links"
ON public.nav_links
FOR SELECT
USING (is_visible = true);

-- Admins can manage nav links
CREATE POLICY "Admins can manage nav links"
ON public.nav_links
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_nav_links_updated_at
BEFORE UPDATE ON public.nav_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default navigation links
INSERT INTO public.nav_links (label, href, display_order) VALUES
  ('Home', '#home', 1),
  ('About', '#about', 2),
  ('Experience', '#experience', 3),
  ('Skills', '#skills', 4),
  ('Projects', '#projects', 5),
  ('Contact', '#contact', 6);