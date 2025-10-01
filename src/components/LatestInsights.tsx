import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import blogRealEstate from "@/assets/blog-real-estate-future.jpg";
import blogLocation from "@/assets/blog-property-location.jpg";

const LatestInsights = () => {
  const navigate = useNavigate();

  const insights = [
    {
      id: 1,
      image: blogRealEstate,
      category: "Market Trends",
      title: "The Future of Real Estate in Algeria",
      description: "Discover the emerging trends shaping Algeria's property market",
      author: "Sarah Benali",
      readTime: "5 min read",
      slug: "future-real-estate-algeria",
    },
    {
      id: 2,
      image: blogLocation,
      category: "Buying Guide",
      title: "Choosing the Right Location",
      description: "Essential factors when selecting your next property",
      author: "Karim Mansouri",
      readTime: "4 min read",
      slug: "property-location-guide",
    },
  ];

  return (
    <section className="px-4 py-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Latest Insights</h2>
        <button 
          onClick={() => navigate('/blog')}
          className="text-primary font-medium text-xs hover:underline"
        >
          See all
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => navigate(`/blog/${insight.slug}`)}
            className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer"
          >
            <div className="relative">
              <img
                src={insight.image}
                alt={insight.title}
                className="w-full h-36 object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                  {insight.category}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm mb-1 line-clamp-2">{insight.title}</h3>
              <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                {insight.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-0.5" />
                  {insight.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-0.5" />
                  {insight.readTime}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestInsights;
