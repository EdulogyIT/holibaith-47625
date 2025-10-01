import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";
import cityAlger from "@/assets/city-alger.jpg";
import cityOran from "@/assets/city-oran.jpg";
import cityConstantine from "@/assets/city-constantine.jpg";
import cityAnnaba from "@/assets/city-annaba.jpg";

const Cities = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useScrollToTop();

  const cities = [
    { name: "Alger", properties: "1,200+", image: cityAlger, description: "Capital city with diverse properties" },
    { name: "Oran", properties: "800+", image: cityOran, description: "Coastal city with modern apartments" },
    { name: "Constantine", properties: "650+", image: cityConstantine, description: "Historic city with traditional homes" },
    { name: "Annaba", properties: "450+", image: cityAnnaba, description: "Seaside city with villas and beaches" },
    { name: "Tlemcen", properties: "320+", image: cityOran, description: "Cultural hub with heritage properties" },
    { name: "Béjaïa", properties: "280+", image: cityAlger, description: "Port city with coastal properties" },
    { name: "Sétif", properties: "240+", image: cityConstantine, description: "Central city with family homes" },
    { name: "Batna", properties: "210+", image: cityAnnaba, description: "Mountain city with spacious properties" },
    { name: "Blida", properties: "380+", image: cityAlger, description: "Garden city near the capital" },
    { name: "Ouargla", properties: "150+", image: cityOran, description: "Saharan city with unique properties" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20 pb-8")}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Explore All Cities</h1>
            <p className="text-muted-foreground">Discover properties across Algeria's major cities</p>
          </div>

          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}>
            {cities.map((city) => (
              <div
                key={city.name}
                onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}
                className="relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                  <p className="text-xs opacity-90 mb-1">{city.description}</p>
                  <p className="text-sm font-medium">{city.properties} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isMobile ? <MobileBottomNav /> : <Footer />}
    </div>
  );
};

export default Cities;
