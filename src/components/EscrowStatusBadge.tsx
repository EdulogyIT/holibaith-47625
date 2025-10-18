import { Badge } from "@/components/ui/badge";
import { Shield, Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EscrowStatusBadgeProps {
  status: 'escrowed' | 'released' | 'pending' | 'failed';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const EscrowStatusBadge = ({ status, size = 'md', showIcon = true, className }: EscrowStatusBadgeProps) => {
  const configs = {
    escrowed: {
      icon: Shield,
      label: 'Payment Held Securely',
      variant: 'default' as const,
      className: 'bg-primary text-primary-foreground'
    },
    released: {
      icon: Check,
      label: 'Payment Released',
      variant: 'default' as const,
      className: 'bg-green-500 text-white'
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-500 text-white'
    },
    failed: {
      icon: AlertCircle,
      label: 'Failed',
      variant: 'destructive' as const,
      className: 'bg-destructive text-destructive-foreground'
    }
  };

  const config = configs[status];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.className,
        sizeClasses[size],
        'font-inter font-medium',
        className
      )}
    >
      {showIcon && <IconComponent className={cn("mr-1.5", size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
      {config.label}
    </Badge>
  );
};

export default EscrowStatusBadge;
