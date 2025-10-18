import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface EstimatedClosingTimeProps {
  category: 'short-stay' | 'rent' | 'sale';
}

const EstimatedClosingTime = ({ category }: EstimatedClosingTimeProps) => {
  const { t } = useLanguage();
  
  const timeText = category === 'short-stay' 
    ? t('instantConfirmation') 
    : t('businessDays');

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{t('estimatedClosingTime')}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{timeText}</p>
      </CardContent>
    </Card>
  );
};

export default EstimatedClosingTime;
