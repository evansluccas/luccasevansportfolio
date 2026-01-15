-- Create table for experience story slides (left side carousel)
CREATE TABLE public.experience_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  lang TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experience_stories ENABLE ROW LEVEL SECURITY;

-- Public can read experience stories
CREATE POLICY "Public can read experience stories"
ON public.experience_stories
FOR SELECT
USING (true);

-- Admins can manage experience stories
CREATE POLICY "Admins can manage experience stories"
ON public.experience_stories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_experience_stories_updated_at
BEFORE UPDATE ON public.experience_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();