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
    <section className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Latest Insights</h2>
        <button className="text-primary font-medium">See all</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => navigate(`/blog/${insight.slug}`)}
            className="flex-shrink-0 w-80 bg-white rounded-3xl overflow-hidden shadow-sm border border-border cursor-pointer"
          >
            <div className="relative">
              <img
                src={insight.image}
                alt={insight.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                  {insight.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">{insight.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {insight.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {insight.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
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
