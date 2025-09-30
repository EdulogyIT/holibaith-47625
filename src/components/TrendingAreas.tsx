import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const TrendingAreas = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const areas = [
    { name: "Alger Centre", properties: 1250 },
    { name: "Oran", properties: 890 },
    { name: "Constantine", properties: 567 },
  ];

  return (
    <section className="px-4 py-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Trending areas</h2>
        <button className="text-primary font-medium text-sm">See all</button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {areas.map((area) => (
          <button
            key={area.name}
            onClick={() => navigate(`/buy?location=${encodeURIComponent(area.name)}`)}
            className="flex-shrink-0 bg-white rounded-2xl p-4 min-w-[160px] shadow-sm border border-border"
          >
            <div className="text-left">
              <div className="font-semibold text-lg mb-1">{area.name}</div>
              <div className="text-muted-foreground text-sm">
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
