import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t('subscriptionError'),
        description: t('subscriptionError'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate subscription (implement actual API call here)
    setTimeout(() => {
      toast({
        title: t('subscriptionSuccess'),
        description: t('newsletterDescription')
      });
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 text-white rounded-2xl mb-6">
            <Mail className="h-8 w-8" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
            {t('newsletterCTA')}
          </h2>
          <p className="text-lg text-white/90 font-inter font-light mb-8 max-w-2xl mx-auto">
            {t('newsletterSubtitle')}
          </p>

          {/* Subscribe Form */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder={t('emailPlaceholderNewsletter')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:bg-white/20"
                disabled={loading}
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:shadow-lg h-12 px-8"
              >
                {loading ? t('subscribing') : (
                  <>
                    {t('subscribeNow')} <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Privacy Note */}
          <p className="text-sm text-white/70 font-inter mt-4">
            {t('privacyPolicy')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
