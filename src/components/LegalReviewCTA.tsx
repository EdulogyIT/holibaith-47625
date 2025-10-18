import { FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const LegalReviewCTA = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="border-amber-500/20 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
            {t('legalReview')}
          </h3>
        </div>
        
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {t('legalReviewDesc')}
        </p>
        
        <button
          onClick={() => navigate('/contact-advisor')}
          className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
        >
          {t('learnMore')}
          <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  );
};

export default LegalReviewCTA;
