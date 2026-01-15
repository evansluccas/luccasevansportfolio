import { Briefcase, Coffee, Award, Users, Star, Code, Rocket, Heart, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Coffee,
  Award,
  Users,
  Star,
  Code,
  Rocket,
  Heart,
};

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Briefcase;
}
