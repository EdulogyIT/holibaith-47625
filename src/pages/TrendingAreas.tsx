import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";

const TrendingAreas = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useScrollToTop();

  const areas = [
    { name: "Alger", displayName: "Alger Centre", properties: 1250, description: "Downtown with modern apartments" },
    { name: "Oran", displayName: "Oran", properties: 890, description: "Coastal properties and villas" },
    { name: "Constantine", displayName: "Constantine", properties: 567, description: "Historic area with traditional homes" },
    { name: "Annaba", displayName: "Annaba Beach", properties: 445, description: "Seaside properties" },
    { name: "Tlemcen", displayName: "Tlemcen Old Town", properties: 320, description: "Heritage properties" },
    { name: "Béjaïa", displayName: "Béjaïa Port", properties: 280, description: "Port area apartments" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20 pb-8")}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Trending Areas</h1>
            <p className="text-muted-foreground">Discover the most popular neighborhoods in Algeria</p>
          </div>

          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
          )}>
            {areas.map((area) => (
              <div
                key={area.name}
                onClick={() => navigate(`/city/${area.name.toLowerCase()}`)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-bold mb-1">{area.displayName}</h3>
                <p className="text-sm text-muted-foreground mb-2">{area.description}</p>
                <p className="text-sm font-semibold text-primary">{area.properties} properties</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isMobile ? <MobileBottomNav /> : <Footer />}
    </div>
  );
};

export default TrendingAreas;
