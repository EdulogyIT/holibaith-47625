import { Shield, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const TransactionSecurityCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">{t('holibaytPayProtected')}</h3>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">{t('fundsInEscrow')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionSecurityCard;
