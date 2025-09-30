import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import propertyVilla from "@/assets/property-villa-mediterranean.jpg";
import propertyPenthouse from "@/assets/property-penthouse.jpg";

const ThreeWaysSection = () => {
  const navigate = useNavigate();

  const ways = [
    {
      id: 1,
      icon: Home,
      image: propertyVilla,
      title: "Buy",
      subtitle: "Find Your Dream Home",
      description: "Explore verified properties",
      path: "/buy",
    },
    {
      id: 2,
      icon: Home,
      image: propertyPenthouse,
      title: "Rent",
      subtitle: "Flexible Living",
      description: "Quality rental options",
      path: "/rent",
    },
  ];

  return (
    <section className="px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Three Ways To Live In Algeria
      </h2>
      <div className="space-y-4">
        {ways.map((way) => {
          const Icon = way.icon;
          return (
            <div
              key={way.id}
              onClick={() => navigate(way.path)}
              className="relative h-64 rounded-3xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={way.image}
                alt={way.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-primary/90 p-3 rounded-full">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold mb-1">{way.title}</h3>
                <p className="text-lg mb-1">{way.subtitle}</p>
                <p className="text-sm text-white/90">{way.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ThreeWaysSection;
