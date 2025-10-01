import { useNavigate } from "react-router-dom";
import cityAlger from "@/assets/city-alger.jpg";
import cityOran from "@/assets/city-oran.jpg";
import cityConstantine from "@/assets/city-constantine.jpg";
import cityAnnaba from "@/assets/city-annaba.jpg";

const ExploreCities = () => {
  const navigate = useNavigate();

  const cities = [
    { name: "Alger", properties: "1,200+", image: cityAlger },
    { name: "Oran", properties: "800+", image: cityOran },
    { name: "Constantine", properties: "650+", image: cityConstantine },
    { name: "Annaba", properties: "450+", image: cityAnnaba },
    { name: "Tlemcen", properties: "320+", image: cityOran },
    { name: "Béjaïa", properties: "280+", image: cityAlger },
    { name: "Sétif", properties: "240+", image: cityConstantine },
    { name: "Batna", properties: "210+", image: cityAnnaba },
    { name: "Blida", properties: "380+", image: cityAlger },
    { name: "Ouargla", properties: "150+", image: cityOran },
  ];

  return (
    <section className="px-4 py-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Explore by Cities</h2>
        <button 
          onClick={() => navigate('/cities')}
          className="text-primary font-medium text-sm hover:underline"
        >
          See all
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {cities.map((city) => (
          <div
            key={city.name}
            onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}
            className="relative h-40 min-w-[160px] flex-shrink-0 rounded-3xl overflow-hidden shadow-sm cursor-pointer"
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="text-lg font-bold">{city.name}</h3>
              <p className="text-xs">{city.properties} properties</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreCities;
