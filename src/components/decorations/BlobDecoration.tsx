import { cn } from '@/lib/utils';

interface BlobDecorationProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function BlobDecoration({ 
  className, 
  variant = 'primary',
  size = 'md',
  animated = true 
}: BlobDecorationProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]',
  };

  const variantClasses = {
    primary: 'from-primary/40 to-secondary/30',
    secondary: 'from-secondary/40 to-primary/20',
    accent: 'from-coral/40 to-primary/30',
  };

  return (
    <div
      className={cn(
        'absolute rounded-full blur-3xl pointer-events-none bg-gradient-to-br',
        sizeClasses[size],
        variantClasses[variant],
        animated && 'animate-float',
        className
      )}
      aria-hidden="true"
    />
  );
}
