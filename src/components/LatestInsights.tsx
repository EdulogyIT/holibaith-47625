import { useState, useEffect } from "react";
import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const LatestInsights = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="px-4 py-4 bg-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">{t('latestInsights')}</h2>
        </div>
        <div className="text-center text-muted-foreground py-4">
          Loading...
        </div>
      </section>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">{t('latestInsights')}</h2>
        <button 
          onClick={() => navigate('/blog')}
          className="text-primary font-medium text-xs hover:underline"
        >
          {t('seeAll')}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => navigate(`/blog/${insight.id}`)}
            className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={insight.image_url || '/placeholder.jpg'}
                alt={insight.title}
                className="w-full h-36 object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                  {insight.category || 'Article'}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm mb-1 line-clamp-2">{insight.title}</h3>
              <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                {insight.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-0.5" />
                  {insight.author_name}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-0.5" />
                  5 min read
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
