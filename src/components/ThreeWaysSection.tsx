import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import propertyVilla from "@/assets/property-villa-mediterranean.jpg";
import propertyPenthouse from "@/assets/property-penthouse.jpg";
import propertyShortStay from "@/assets/property-short-stay.jpg";

const ThreeWaysSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const ways = [
    {
      id: 1,
      icon: Home,
      image: propertyVilla,
      title: t('buy'),
      subtitle: t('findYourDreamHome'),
      description: t('exploreVerifiedProperties'),
      path: "/buy",
    },
    {
      id: 2,
      icon: Home,
      image: propertyPenthouse,
      title: t('rent'),
      subtitle: t('flexibleLiving'),
      description: t('qualityRentalOptions'),
      path: "/rent",
    },
    {
      id: 3,
      icon: Home,
      image: propertyShortStay,
      title: t('shortStay'),
      subtitle: t('holidayRentals'),
      description: t('perfectVacationStays'),
      path: "/short-stay",
    },
  ];

  return (
    <section className="px-4 py-4 bg-gray-50">
      <h2 className="text-xl font-bold text-center mb-3">
        {t('threeWaysToLive')}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {ways.map((way) => {
          const Icon = way.icon;
          return (
            <div
              key={way.id}
              onClick={() => navigate(way.path)}
              className="flex-shrink-0 relative h-48 w-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={way.image}
                alt={way.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-3 right-3 bg-primary/90 p-2 rounded-full">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-lg font-bold mb-0.5">{way.title}</h3>
                <p className="text-sm mb-0.5">{way.subtitle}</p>
                <p className="text-xs text-white/90">{way.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ThreeWaysSection;
