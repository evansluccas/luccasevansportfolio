-- Create section_config table for managing section headers and visibility
CREATE TABLE public.section_config (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT NOT NULL,
    tag TEXT,
    title TEXT NOT NULL,
    title_highlight TEXT,
    description TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    lang TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(section_key, lang)
);

-- Enable RLS
ALTER TABLE public.section_config ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view section_config"
ON public.section_config
FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can manage section_config"
ON public.section_config
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_section_config_updated_at
BEFORE UPDATE ON public.section_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default section configurations
INSERT INTO public.section_config (section_key, tag, title, title_highlight, description, display_order, lang) VALUES
('about', 'About me', 'Know Who', 'I Am', 'A glimpse into my personality, work style, and what drives me to create impactful solutions.', 1, 'en'),
('experience', 'About me', 'Professional', 'Experience', 'A journey of growth, learning, and impactful contributions across different roles and companies.', 2, 'en'),
('skills', 'Expertise', 'Skills &', 'Technologies', 'A comprehensive overview of the tools and technologies I use to bring ideas to life.', 3, 'en'),
('projects', 'Portfolio', 'Featured', 'Projects', 'A selection of projects that showcase my skills and experience.', 4, 'en'),
('contact', 'Get in Touch', 'Let''s Work', 'Together', 'Have a project in mind? Let''s discuss how we can collaborate.', 5, 'en');