import SEOHead from "@/components/SEOHead";
import MobileHeader from "@/components/MobileHeader";
import MobileHeroSearch from "@/components/MobileHeroSearch";
import TrendingAreas from "@/components/TrendingAreas";
import FeaturedListings from "@/components/FeaturedListings";
import LatestInsights from "@/components/LatestInsights";
import ThreeWaysSection from "@/components/ThreeWaysSection";
import ExploreCities from "@/components/ExploreCities";
import ExpertGuidanceCTA from "@/components/ExpertGuidanceCTA";
import MobileFooter from "@/components/MobileFooter";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingMapButton from "@/components/FloatingMapButton";
import AIChatBox from "@/components/AIChatBox";

const Index = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Holibayt",
    "url": "https://holibayt.com",
    "logo": "https://holibayt.com/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png",
    "description": "Plateforme immobilière leader en Algérie pour l'achat, la location et la location saisonnière de propriétés",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DZ",
      "addressLocality": "Alger"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+213-21-123-456",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/holibayt",
      "https://instagram.com/holibayt"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Accueil - Immobilier Algérie"
        description="Découvrez des milliers de propriétés à vendre et à louer en Algérie. Villa, appartement, studio - Trouvez votre propriété idéale avec Holibayt."
        keywords="immobilier algérie, achat maison alger, location appartement, villa à vendre, propriété algérie"
        schema={schema}
        canonicalUrl="https://holibayt.com"
      />
      <MobileHeader />
      <main className="pb-20">
        {/* Background Image Hero - Reduced Height and Moved Up */}
        <div 
          className="h-[360px] relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${new URL('../assets/algeria-hero-mobile.jpg', import.meta.url).href})`
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-end pb-4">
            <MobileHeroSearch />
          </div>
        </div>

        <TrendingAreas />
        <FeaturedListings />
        <LatestInsights />
        <ThreeWaysSection />
        <ExploreCities />
        <ExpertGuidanceCTA />
        <MobileFooter />
      </main>
      <MobileBottomNav />
      <FloatingMapButton />
      <AIChatBox />
    </div>
  );
};

export default Index;
