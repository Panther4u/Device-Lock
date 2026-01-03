import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'from-primary/20 to-primary/5',
  primary: 'from-primary/20 to-primary/5',
  success: 'from-accent/20 to-accent/5',
  warning: 'from-warning/20 to-warning/5',
  danger: 'from-destructive/20 to-destructive/5',
};

const iconVariantStyles = {
  default: 'bg-primary/20 text-primary',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-accent/20 text-accent',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-destructive/20 text-destructive',
};

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: StatCardProps) => {
  return (
    <div className="stat-card border border-border/50">
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]} rounded-xl`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-accent' : 'text-destructive'}`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{trend.value}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconVariantStyles[variant]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
