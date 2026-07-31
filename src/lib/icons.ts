import { Briefcase, Coffee, Award, Users, Star, Code, Rocket, Heart, TrendingUp, DollarSign, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Coffee,
  Award,
  Users,
  Star,
  Code,
  Rocket,
  Heart,
  Revenue: TrendingUp,
  TrendingUp,
  DollarSign,
};

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Briefcase;
}
