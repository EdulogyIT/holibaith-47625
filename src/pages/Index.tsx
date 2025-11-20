// src/pages/index.tsx  (or wherever your Index component lives)

import SEOHead from "@/components/SEOHead";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import { HeroSection } from "@/components/home/hero-section";
import { DualOfferingSection } from "@/components/home/dual-offering-section";
import { FeaturedDestinations } from "@/components/home/featured-destinations";
import { PropertyShowcase } from "@/components/home/property-showcase";
import { WhyHolibayt } from "@/components/home/why-holibayt";
import { CTASection } from "@/components/home/cta-section";

const Index = () => {
  // same Schema.org data you had inside <script> in Next.js
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Holibayt - Hotels and Short Stays in Algeria",
    description:
      "Discover premium hotels and verified short-stay accommodations across Algeria",
    url: "https://holibayt.com",
    isPartOf: {
      "@type": "WebSite",
      name: "Holibayt",
      url: "https://holibayt.com",
    },
    about: {
      "@type": "Thing",
      name: "Algeria Tourism and Hospitality",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "45",
      highPrice: "500",
      offerCount: "2500",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Holibayt | Discover Algeria Differently - Hotels & Verified Homes"
        description="Book premium hotels and verified short-stay homes across Algeria. Explore Algiers, Oran, Constantine with curated accommodations. Experience authentic Algerian hospitality with trusted, verified properties in 48+ cities."
        keywords="algeria hotels, algeria accommodation, algiers hotels, oran vacation rentals, constantine lodging, algeria tourism, verified homes algeria, luxury hotels algeria, short stay algeria, algeria travel booking"
        canonicalUrl="https://holibayt.com"
        schema={schema} // SEOHead already accepts `schema` in your project
      />

      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <DualOfferingSection />
        <FeaturedDestinations />
        <PropertyShowcase />
        <WhyHolibayt />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
