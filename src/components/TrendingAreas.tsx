import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const TrendingAreas = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const areas = [
    { name: "Alger", displayName: "Alger Centre", properties: 1250 },
    { name: "Oran", displayName: "Oran", properties: 890 },
    { name: "Constantine", displayName: "Constantine", properties: 567 },
  ];

  return (
    <section className="px-4 py-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Trending Areas</h2>
        <button 
          onClick={() => navigate('/rent')}
          className="text-primary font-medium text-xs hover:underline"
        >
          See all
        </button>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {areas.map((area) => (
          <button
            key={area.name}
            onClick={() => navigate(`/city/${area.name.toLowerCase()}`)}
            className="flex-shrink-0 bg-white rounded-xl p-3 min-w-[140px] shadow-sm border border-border"
          >
            <div className="text-left">
              <div className="font-semibold text-base mb-0.5">{area.displayName}</div>
              <div className="text-muted-foreground text-xs">
                {area.properties} properties
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default TrendingAreas;
