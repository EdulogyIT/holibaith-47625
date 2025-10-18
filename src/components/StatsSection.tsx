import { Home, Users, Shield, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Home,
      value: "10,000+",
      labelKey: "propertiesListed",
      color: "bg-primary"
    },
    {
      icon: Users,
      value: "50,000+",
      labelKey: "happyClients",
      color: "bg-accent"
    },
    {
      icon: Shield,
      value: "100%",
      labelKey: "verifiedHosts",
      color: "bg-foreground"
    },
    {
      icon: TrendingUp,
      value: "4.8/5",
      labelKey: "averageRating",
      color: "bg-primary"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} text-primary-foreground rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-inter">
                  {t(stat.labelKey)}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="flex-shrink-0 w-[200px] text-center group snap-start">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} text-primary-foreground rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-playfair font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-inter">
                    {t(stat.labelKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
