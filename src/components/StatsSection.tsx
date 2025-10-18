import { Home, Users, Shield, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Home,
      value: "10,000+",
      label: "Properties Listed",
      color: "bg-primary"
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Happy Clients",
      color: "bg-accent"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Verified Hosts",
      color: "bg-foreground"
    },
    {
      icon: TrendingUp,
      value: "4.8/5",
      label: "Average Rating",
      color: "bg-primary"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
