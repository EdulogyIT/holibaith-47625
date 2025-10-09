import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileFooter from "@/components/MobileFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollToTop();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [t('AllCategories'), t('MarketTrends'), t('BuyingGuide'), t('Investment'), t('Finance'), t('Renovation'), t('Legal')];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20")}>
        {/* Hero Section */}
        <section className={cn("bg-gradient-subtle", isMobile ? "py-8" : "py-16")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={cn("font-bold text-foreground mb-4 font-playfair", isMobile ? "text-3xl" : "text-4xl md:text-5xl")}>
              {t('Blog Insights')}
            </h1>
            <p className={cn("text-muted-foreground font-inter max-w-2xl mx-auto", isMobile ? "text-base" : "text-xl")}>
              {t('Blog Description')}
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className={cn(isMobile ? "py-4" : "py-8")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={cn("flex flex-wrap justify-center", isMobile ? "gap-1.5" : "gap-2")}>
              {categories.map((category) => (
                <Badge 
                  key={category}
                  variant="outline"
                  className={cn("cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors", isMobile && "text-xs px-2 py-0.5")}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className={cn(isMobile ? "py-6" : "py-12")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading posts...</p>
              </div>
            ) : (
              <div className={cn("grid gap-8", isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
                {blogPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="group cursor-pointer hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className={cn("bg-muted rounded-t-lg overflow-hidden", isMobile ? "h-48" : "aspect-video")}>
                      <img 
                        src={post.image_url || '/placeholder.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className={cn(isMobile && "p-4")}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className={cn(isMobile && "text-xs")}>{post.category}</Badge>
                        <div className={cn("flex items-center text-muted-foreground", isMobile ? "text-[10px]" : "text-xs")}>
                          <Clock className={cn(isMobile ? "w-3 h-3 mr-0.5" : "w-3 h-3 mr-1")} />
                          5 min read
                        </div>
                      </div>
                      <CardTitle className={cn("font-playfair group-hover:text-primary transition-colors", isMobile ? "text-lg" : "text-xl")}>
                        {post.title}
                      </CardTitle>
                      <CardDescription className={cn("font-inter line-clamp-2", isMobile && "text-sm")}>
                        {post.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className={cn(isMobile && "p-4 pt-0")}>
                      <div className={cn("flex items-center justify-between text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                        <div className="flex items-center">
                          <User className={cn(isMobile ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1")} />
                          {post.author_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className={cn(isMobile ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1")} />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className={cn("bg-gradient-subtle", isMobile ? "py-8" : "py-16")}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("font-bold text-foreground mb-4 font-playfair", isMobile ? "text-2xl" : "text-3xl")}>
              {t('StayUpdated')}
            </h2>
            <p className={cn("text-muted-foreground mb-8 font-inter", isMobile ? "text-sm mb-4" : "text-lg")}>
              {t('NewsletterDescription')}
            </p>
            <div className={cn("flex flex-col gap-4 max-w-md mx-auto", isMobile ? "gap-2" : "sm:flex-row")}>
              <input 
                type="email" 
                placeholder={t('Enter Email')}
                className={cn("flex-1 px-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-inter", isMobile ? "py-2 text-sm" : "py-3")}
              />
              <button className={cn("bg-gradient-primary text-primary-foreground rounded-md font-medium hover:shadow-elegant transition-all font-inter", isMobile ? "px-4 py-2 text-sm" : "px-6 py-3")}>
                {t('Subscribe')}
              </button>
            </div>
          </div>
        </section>
      </main>
      {isMobile ? (
        <>
          <MobileFooter />
          <MobileBottomNav />
        </>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default Blog;
