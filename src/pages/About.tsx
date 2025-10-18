import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileFooter from "@/components/MobileFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Award, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const About = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  useScrollToTop();

  const stats = [
    { icon: Building, title: t('properties'), value: "10,000+", description: t('propertiesListed') },
    { icon: Users, title: t('clients'), value: "50,000+", description: t('satisfiedClients') },
    { icon: Award, title: t('experience'), value: "15 " + t('years'), description: t('realEstateExpertise') },
    { icon: Shield, title: t('security'), value: "100%", description: t('secureTransactions') }
  ];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20")}>
        {/* Hero Section with Background */}
        <div className={cn(
          "relative overflow-hidden",
          isMobile ? "py-8 mb-6" : "py-16 mb-12"
        )}>
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${new URL('../assets/algeria-architecture-hero.jpg', import.meta.url).href})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70"></div>
          </div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxOTI4YyIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10")}>
            <div className="text-center">
              <h1 className={cn("font-bold text-foreground mb-6 font-playfair", isMobile ? "text-3xl mb-4" : "text-5xl")}>About Holibayt</h1>
              <p className={cn("text-muted-foreground max-w-3xl mx-auto font-inter", isMobile ? "text-base" : "text-xl")}>
                Your trusted partner in Algeria's real estate market, connecting property seekers with their perfect homes through secure, transparent, and innovative solutions.
              </p>
            </div>
          </div>
        </div>

        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", isMobile ? "py-0" : "py-0")}>

          {/* Stats Section */}
          <div className={cn("grid gap-6", isMobile ? "grid-cols-2 gap-4 mb-8" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-16")}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader className={cn(isMobile && "p-4")}>
                    <div className={cn("mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4", isMobile ? "w-10 h-10 mb-2" : "w-12 h-12")}>
                      <IconComponent className={cn("text-primary", isMobile ? "w-5 h-5" : "w-6 h-6")} />
                    </div>
                    <CardTitle className={cn("font-bold text-primary font-playfair", isMobile ? "text-xl" : "text-3xl")}>{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent className={cn(isMobile && "p-4 pt-0")}>
                    <h3 className={cn("font-semibold mb-2 font-playfair", isMobile ? "text-sm" : "text-base")}>{stat.title}</h3>
                    <p className={cn("text-muted-foreground font-inter", isMobile ? "text-xs" : "text-sm")}>{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Company Story */}
          <div className={cn("bg-muted/50 rounded-lg", isMobile ? "p-4 mb-8" : "p-8 mb-16")}>
            <h2 className={cn("font-bold text-foreground mb-6 font-playfair", isMobile ? "text-2xl mb-4" : "text-3xl")}>Our Story</h2>
            <div className={cn("grid gap-8", isMobile ? "grid-cols-1 gap-4" : "md:grid-cols-2")}>
              <div>
                <p className={cn("text-muted-foreground mb-4 font-inter", isMobile && "text-sm")}>
                  Founded with a vision to transform Algeria's real estate landscape, Holibayt emerged from a simple observation: finding and securing property transactions needed to be easier, safer, and more transparent. We set out to bridge the gap between property seekers and homeowners through technology and trust.
                </p>
                <p className={cn("text-muted-foreground mb-4 font-inter", isMobile && "text-sm")}>
                  Starting in Algiers, we quickly expanded across Algeria's major cities - from Oran to Constantine, Annaba to Tlemcen. Our platform has become synonymous with reliable property transactions, serving thousands of families in their journey to find their perfect home.
                </p>
              </div>
              <div>
                <p className={cn("text-muted-foreground mb-4 font-inter", isMobile && "text-sm")}>
                  What sets us apart is our commitment to security and transparency. We pioneered Holibayt Pay, an escrow-based payment system that protects both buyers and sellers, ensuring every transaction is secure and worry-free. Our verification processes and legal review services add layers of confidence to every deal.
                </p>
                <p className={cn("text-muted-foreground font-inter", isMobile && "text-sm")}>
                  Today, Holibayt stands as Algeria's leading real estate platform, trusted by over 50,000 clients and listing 10,000+ properties. But we're more than numbers - we're about real people finding real homes, creating memories, and building futures.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className={cn("grid gap-8", isMobile ? "grid-cols-1 gap-4" : "md:grid-cols-3")}>
            <Card>
              <CardHeader className={cn(isMobile && "p-4")}>
                <CardTitle className={cn("font-playfair", isMobile ? "text-lg" : "text-xl")}>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className={cn(isMobile && "p-4 pt-0")}>
                <p className={cn("text-muted-foreground font-inter", isMobile && "text-sm")}>
                  To revolutionize Algeria's real estate market by providing a secure, transparent, and user-friendly platform that connects property seekers with their ideal homes. We're committed to eliminating the stress and uncertainty traditionally associated with property transactions through innovative technology and unwavering dedication to customer protection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={cn(isMobile && "p-4")}>
                <CardTitle className={cn("font-playfair", isMobile ? "text-lg" : "text-xl")}>Our Vision</CardTitle>
              </CardHeader>
              <CardContent className={cn(isMobile && "p-4 pt-0")}>
                <p className={cn("text-muted-foreground font-inter", isMobile && "text-sm")}>
                  To become the most trusted name in Algerian real estate, setting the standard for secure property transactions across North Africa. We envision a future where every property transaction is protected, every listing is verified, and every client feels confident in their real estate journey. Our goal is to make property ownership accessible and stress-free for all Algerians.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={cn(isMobile && "p-4")}>
                <CardTitle className={cn("font-playfair", isMobile ? "text-lg" : "text-xl")}>Our Values</CardTitle>
              </CardHeader>
              <CardContent className={cn(isMobile && "p-4 pt-0")}>
                <p className={cn("text-muted-foreground font-inter", isMobile && "text-sm")}>
                  Trust, transparency, and innovation drive everything we do. We believe in protecting our clients through secure escrow payments, verifying every listing for authenticity, providing exceptional customer service, and continuously improving our platform. We're committed to integrity in every transaction and building lasting relationships with the communities we serve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <div className={cn(isMobile && "pb-6")}>
        {isMobile ? (
          <>
            <MobileFooter />
            <MobileBottomNav />
          </>
        ) : (
          <Footer />
        )}
      </div>
    </div>
  );
};

export default About;
