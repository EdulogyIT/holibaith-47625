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

// Import blog images
import blogRealEstateFuture from "@/assets/blog-real-estate-future.jpg";
import blogPropertyLocation from "@/assets/blog-property-location.jpg";
import blogShortStayRental from "@/assets/blog-short-stay-rental.jpg";
import blogPropertyValuation from "@/assets/blog-property-valuation.jpg";
import blogRenovationTips from "@/assets/blog-renovation-tips.jpg";
import blogLegalConsiderations from "@/assets/blog-legal-considerations.jpg";

const Blog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useScrollToTop();

  const blogPosts = [
    {
      id: 1,
      title: t('blogTitle1'),
      excerpt: t('blogExcerpt1'),
      author: t('author1'),
      date: t('march15'),
      readTime: t('readTime5'),
      category: t('marketTrends'),
      image: blogRealEstateFuture
    },
    {
      id: 2,
      title: t('blogTitle2'),
      excerpt: t('blogExcerpt2'),
      author: t('author2'),
      date: t('march10'),
      readTime: t('readTime7'),
      category: t('buyingGuide'),
      image: blogPropertyLocation
    },
    {
      id: 3,
      title: t('blogTitle3'),
      excerpt: t('blogExcerpt3'),
      author: t('author3'),
      date: t('march5'),
      readTime: t('readTime6'),
      category: t('investment'),
      image: blogShortStayRental
    },
    {
      id: 4,
      title: t('blogTitle4'),
      excerpt: t('blogExcerpt4'),
      author: t('author4'),
      date: t('february28'),
      readTime: t('readTime8'),
      category: t('finance'),
      image: blogPropertyValuation
    },
    {
      id: 5,
      title: t('blogTitle5'),
      excerpt: t('blogExcerpt5'),
      author: t('author5'),
      date: t('february20'),
      readTime: t('readTime9'),
      category: t('renovation'),
      image: blogRenovationTips
    },
    {
      id: 6,
      title: t('blogTitle6'),
      excerpt: t('blogExcerpt6'),
      author: t('author6'),
      date: t('february15'),
      readTime: t('readTime10'),
      category: t('legal'),
      image: blogLegalConsiderations
    }
  ];

  const categories = [t('allCategories'), t('marketTrends'), t('buyingGuide'), t('investment'), t('finance'), t('renovation'), t('legal')];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20")}>
        {/* Hero Section */}
        <section className={cn("bg-gradient-subtle", isMobile ? "py-8" : "py-16")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={cn("font-bold text-foreground mb-4 font-playfair", isMobile ? "text-3xl" : "text-4xl md:text-5xl")}>
              {t('blogInsights')}
            </h1>
            <p className={cn("text-muted-foreground font-inter max-w-2xl mx-auto", isMobile ? "text-base" : "text-xl")}>
              {t('blogDescription')}
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
            <div className={cn("grid gap-8", isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
              {blogPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group cursor-pointer hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className={cn("bg-muted rounded-t-lg overflow-hidden", isMobile ? "h-48" : "aspect-video")}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className={cn(isMobile && "p-4")}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className={cn(isMobile && "text-xs")}>{post.category}</Badge>
                      <div className={cn("flex items-center text-muted-foreground", isMobile ? "text-[10px]" : "text-xs")}>
                        <Clock className={cn(isMobile ? "w-3 h-3 mr-0.5" : "w-3 h-3 mr-1")} />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className={cn("font-playfair group-hover:text-primary transition-colors", isMobile ? "text-lg" : "text-xl")}>
                      {post.title}
                    </CardTitle>
                    <CardDescription className={cn("font-inter", isMobile && "text-sm")}>
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={cn(isMobile && "p-4 pt-0")}>
                    <div className={cn("flex items-center justify-between text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                      <div className="flex items-center">
                        <User className={cn(isMobile ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1")} />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className={cn(isMobile ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1")} />
                        {post.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className={cn("bg-gradient-subtle", isMobile ? "py-8" : "py-16")}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={cn("font-bold text-foreground mb-4 font-playfair", isMobile ? "text-2xl" : "text-3xl")}>
              {t('stayUpdated')}
            </h2>
            <p className={cn("text-muted-foreground mb-8 font-inter", isMobile ? "text-sm mb-4" : "text-lg")}>
              {t('newsletterDescription')}
            </p>
            <div className={cn("flex flex-col gap-4 max-w-md mx-auto", isMobile ? "gap-2" : "sm:flex-row")}>
              <input 
                type="email" 
                placeholder={t('enterEmail')}
                className={cn("flex-1 px-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-inter", isMobile ? "py-2 text-sm" : "py-3")}
              />
              <button className={cn("bg-gradient-primary text-primary-foreground rounded-md font-medium hover:shadow-elegant transition-all font-inter", isMobile ? "px-4 py-2 text-sm" : "px-6 py-3")}>
                {t('subscribe')}
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