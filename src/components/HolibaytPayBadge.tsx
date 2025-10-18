import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface HolibaytPayBadgeProps {
  className?: string;
}

const HolibaytPayBadge = ({ className = "" }: HolibaytPayBadgeProps) => {
  const { t } = useLanguage();

  return (
    <Badge 
      variant="secondary" 
      className={`inline-flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 ${className}`}
    >
      <Shield className="h-3 w-3" />
      <span className="font-semibold">Holibayt Pay™</span>
    </Badge>
  );
};

export default HolibaytPayBadge;
