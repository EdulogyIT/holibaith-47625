import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Key, Bed, Shield, Star, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import luxuryApartment from "@/assets/property-luxury-apartment.jpg";
import villaMediterranean from "@/assets/property-villa-mediterranean.jpg";
import shortStay from "@/assets/property-short-stay.jpg";
import modernApartment from "@/assets/property-modern-apartment.jpg";
import traditionalHouse from "@/assets/property-traditional-house.jpg";
import penthouse from "@/assets/property-penthouse.jpg";
import studio from "@/assets/property-studio.jpg";

const ServicesSection = () => {
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();

  // Localized metrics formatting
  const locale = currentLang === "AR" ? "ar" : currentLang.toLowerCase();
  const int1 = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const int0 = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });

  // Actual numbers
  const verifiedPercent = 100;
  const rating = 4.8;
  const responseHours = 2;

  const statVerified = `${int0.format(verifiedPercent)}% ${t("verifiedLabel")}`;
  const statRating = `${int1.format(rating)}/5 ${t("ratingLabel")}`;
  const statResponse = `< ${int0.format(responseHours)}${t("hoursAbbrev")} ${t("responseLabel")}`;
  
  const services = [
    {
      id: "buy",
      icon: Home,
      title: t('Buy Title'),
      subtitle: t('Buy Subtitle'),
      description: t('Buy Description'),
      features: [t('Buy_feat_Verified'), t('Buy_feat_VirtualTour'), t('Buy_feat_Legal'), t('Buy_feat_Financing')],
      color: "bg-primary",
      gradient: "from-primary to-primary/80",
      image: villaMediterranean,
      ctaKey: 'exploreBuy'
    },
    {
      id: "rent",
      icon: Key,
      title: t('Rent Title'),
      subtitle: t('Rent Subtitle'),
      description: t('Rent Description'),
      features: [t('Rent_feat_PaymentGuarantee'), t('Rent_feat_SecureContracts'), t('Rent_feat_DedicatedTeam'), t('Rent_feat_DigitalInspection')],
      color: "bg-accent",
      gradient: "from-accent to-accent/80",
      image: modernApartment,
      ctaKey: 'exploreRent'
    },
    {
      id: "stay",
      icon: Bed,
      title: t('Stay Title'),
      subtitle: t('Stay Subtitle'),
      description: t('Stay Description'),
      features: [t('Stay_feat_InstantBooking'), t('Stay_feat_VerifiedHosts'), t('Stay_feat_TravelInsurance'), t('Stay_feat_LocalExperiences')],
      color: "bg-foreground",
      gradient: "from-foreground to-foreground/80",
      image: shortStay,
      ctaKey: 'exploreShortStay'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            {t('Three Ways To Live In Algeria')} <span className="text-primary">{t('Live Algeria')}</span>
          </h2>
          <p className="text-xl text-muted-foreground font-inter font-light max-w-3xl mx-auto">
            {t('platformDesc')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="group relative overflow-hidden border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-card flex flex-col h-full min-h-[420px] w-[280px] md:w-[320px] flex-shrink-0 snap-center">
                {/* Hero Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={`${service.title} - ${service.subtitle}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Icon overlay */}
                  <div className={`absolute top-4 right-4 inline-flex items-center justify-center w-12 h-12 ${service.color} text-primary-foreground rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>

                <CardContent className="relative p-6 flex flex-col flex-grow">
                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-playfair font-semibold text-foreground mb-1">{service.title}</h3>
                    <p className="text-primary font-inter font-medium text-sm mb-3">{service.subtitle}</p>
                    <p className="text-muted-foreground font-inter text-sm leading-relaxed">{service.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-xs font-inter text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button - Anchored to bottom */}
                  <div className="mt-auto pt-6">
                    <Button 
                      className="h-11 px-5 text-sm font-medium whitespace-nowrap w-full bg-gradient-primary font-inter group-hover:shadow-elegant transition-all duration-300"
                      onClick={() => navigate(`/${service.id === 'stay' ? 'short-stay' : service.id}`)}
                    >
                      <span className="whitespace-nowrap">{t(service.ctaKey)}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
