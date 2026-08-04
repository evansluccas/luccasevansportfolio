import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  immediate?: boolean;
  as?: 'div' | 'li' | 'article' | 'section';
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  immediate = false,
  as = 'div',
}: RevealProps) {
  const Component = motion[as];

  if (immediate) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </Component>
  );
}
