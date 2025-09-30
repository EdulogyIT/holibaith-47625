import { useNavigate } from "react-router-dom";
import cityAlger from "@/assets/city-alger.jpg";
import cityOran from "@/assets/city-oran.jpg";

const ExploreCities = () => {
  const navigate = useNavigate();

  const cities = [
    {
      name: "Alger",
      properties: "1,200+",
      image: cityAlger,
    },
    {
      name: "Oran",
      properties: "800+",
      image: cityOran,
    },
  ];

  return (
    <section className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Explore by Cities</h2>
        <button className="text-primary font-medium">See all</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cities.map((city) => (
          <div
            key={city.name}
            onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}
            className="relative h-40 rounded-3xl overflow-hidden shadow-sm cursor-pointer"
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="text-xl font-bold">{city.name}</h3>
              <p className="text-sm">{city.properties} properties</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreCities;
