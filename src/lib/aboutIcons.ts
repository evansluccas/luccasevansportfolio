import { MessageSquare, Lightbulb, Code2, Users, Target, Zap, Briefcase, Award, LucideIcon } from 'lucide-react';

const aboutIconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Lightbulb,
  Code2,
  Users,
  Target,
  Zap,
  Briefcase,
  Award,
};

export function getAboutIcon(iconName: string): LucideIcon {
  return aboutIconMap[iconName] || Lightbulb;
}
