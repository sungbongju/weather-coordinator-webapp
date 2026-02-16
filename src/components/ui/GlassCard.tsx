import { cn } from '@/lib/cn';

type GlassVariant = 'light' | 'medium' | 'heavy';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  children: React.ReactNode;
}

const variantClasses: Record<GlassVariant, string> = {
  light: 'glass-light rounded-2xl shadow-glass-sm',
  medium: 'glass-card',
  heavy: 'glass-card-heavy',
};

export function GlassCard({ variant = 'medium', className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
}
