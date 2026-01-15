import { useQuery } from '@tanstack/react-query';
import type { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

export interface SiteConfig {
  id: string;
  name: string;
  title: string;
  title_2: string | null;
  title_3: string | null;
  title_4: string | null;
  hero_tag: string | null;
  bio_short: string | null;
  bio_long: string | null;
  profile_image_url: string | null;
  social_linkedin: string | null;
  social_email: string | null;
  location: string | null;
  linkedin_icon_url: string | null;
  email_icon_url: string | null;
  location_icon_url: string | null;
}

export interface HeroStat {
  id: string;
  number: string;
  unit: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  technologies: string[];
  employment_type: string;
  display_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  featured: boolean;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  cover_image_url: string | null;
  gallery: string[];
  technologies: string[];
  demo_link: string | null;
  repo_link: string | null;
  completion_date: string | null;
  category: string;
  featured: boolean;
  display_order: number;
  results: string[];
  published: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  cover_image_url: string | null;
  excerpt: string | null;
  published_date: string | null;
  category: string | null;
  tags: string[];
  status: string;
  author: string;
  reading_time: number;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  display_order: number;
  is_visible: boolean;
}

export interface ExperienceStory {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export interface SectionConfig {
  id: string;
  section_key: string;
  tag: string | null;
  title: string;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
  display_order: number;
}

export function useNavLinks() {
  return useQuery({
    queryKey: ['nav-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nav_links')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as NavLink[];
    },
  });
}

export function useSiteConfig() {
  return useQuery({
    queryKey: ['site-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as SiteConfig | null;
    },
  });
}

export function useHeroStats() {
  return useQuery({
    queryKey: ['hero-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_stats')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as HeroStat[];
    },
  });
}

export function useAboutCards() {
  return useQuery({
    queryKey: ['about-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_cards')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AboutCard[];
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Experience[];
    },
  });
}

export function useExperienceStories() {
  return useQuery({
    queryKey: ['experience-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience_stories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ExperienceStory[];
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!slug,
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });
}

export function useSectionConfig(sectionKey: string) {
  return useQuery({
    queryKey: ['section-config', sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_config')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as SectionConfig | null;
    },
    enabled: !!sectionKey,
  });
}

export function useSectionConfigs() {
  return useQuery({
    queryKey: ['section-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_config')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SectionConfig[];
    },
  });
}
