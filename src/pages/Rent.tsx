import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileFooter from "@/components/MobileFooter";
import FloatingMapButton from "@/components/FloatingMapButton";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RentHeroSearch from "@/components/RentHeroSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Loader2, Search, DollarSign, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useIsMobile } from "@/hooks/use-mobile";
import PropertyFilters from "@/components/PropertyFilters";
import { useState, useEffect } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import rentHeroBg from "@/assets/rent-hero-bg.jpg";

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: string | number;
  price_type: string;
  price_currency?: string;
  bedrooms?: string;
  bathrooms?: string;
  area: string | number;
  images: string[];
  property_type: string;
  features?: any;
  description?: string;
  contact_name: string;
  contact_phone: string;
}

const num = (v: unknown) => {
  if (typeof v === "number") return v;
  const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

const Rent = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFiltersFromURL();
  }, [properties, routerLocation.search]);

  const applyFiltersFromURL = () => {
    const urlParams = new URLSearchParams(routerLocation.search);
    const location = (urlParams.get("location") || "").trim();
    const type = (urlParams.get("type") || "").trim();
    const maxRent = (urlParams.get("maxRent") || "").trim();

    let filtered = [...properties];

    if (location) {
      const l = location.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.city || "").toLowerCase().includes(l) ||
          (p.location || "").toLowerCase().includes(l)
      );
    }

    if (type && type.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (p) => (p.property_type || "").toLowerCase() === type.toLowerCase()
      );
    }

    if (maxRent && maxRent !== "0") {
      const cap = num(maxRent);
      if (cap > 0) {
        filtered = filtered.filter((p) => num(p.price) <= cap);
      }
    }

    setFilteredProperties(filtered);
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("category", "rent")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        return;
      }

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (vals: { location?: string; type?: string; maxRent?: string | number }) => {
    const qs = new URLSearchParams();
    if (vals.location) qs.set("location", String(vals.location));
    if (vals.type && vals.type !== "all") qs.set("type", String(vals.type));
    if (vals.maxRent && String(vals.maxRent) !== "0") qs.set("maxRent", String(vals.maxRent));
    navigate({ pathname: "/rent", search: qs.toString() });
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      <div className={cn("relative overflow-hidden", isMobile ? "h-32" : "h-48")}>
        <img
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={cn("absolute left-2", isMobile ? "top-2" : "top-3")}>
          <Badge className={cn("bg-primary text-primary-foreground", isMobile && "text-xs px-1.5 py-0")}>
            {t(property.property_type) || property.property_type}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property.id);
          }}
          className={cn("absolute right-2 bg-white/90 hover:bg-white rounded-full", isMobile ? "top-2 h-7 w-7" : "top-3 h-9 w-9")}
        >
          <Heart className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4", isInWishlist(property.id) ? "fill-red-500 text-red-500" : "")} />
        </Button>
      </div>
      <CardHeader className={cn(isMobile ? "p-2 pb-1" : "pb-2")}>
        <CardTitle className={cn("font-semibold text-foreground line-clamp-2 capitalize", isMobile ? "text-xs" : "text-lg")}>
          {property.title}
        </CardTitle>
        <div className="flex items-center text-muted-foreground">
          <MapPin className={cn(isMobile ? "h-3 w-3 mr-0.5" : "h-4 w-4 mr-1")} />
          <span className={cn(isMobile ? "text-[10px]" : "text-sm")}>
            {(property.city || "").trim()}
            {property.city && property.location ? ", " : ""}
            {(property.location || "").trim()}
          </span>
        </div>
      </CardHeader>
      <CardContent className={cn(isMobile ? "p-2 pt-0" : "pt-0")}>
        <div className={cn("flex items-center justify-between", isMobile ? "mb-1" : "mb-3")}>
          <div className={cn("font-bold text-primary", isMobile ? "text-sm" : "text-2xl")}>
            {formatPrice(num(property.price), property.price_type, (property.price_currency as any) || 'DZD')}
          </div>
        </div>

        <div className={cn("flex items-center gap-2 text-muted-foreground mb-2", isMobile ? "text-[10px] gap-1" : "text-sm gap-4")}>
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className={cn(isMobile ? "h-3 w-3 mr-0.5" : "h-4 w-4 mr-1")} />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className={cn(isMobile ? "h-3 w-3 mr-0.5" : "h-4 w-4 mr-1")} />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center">
            <Square className={cn(isMobile ? "h-3 w-3 mr-0.5" : "h-4 w-4 mr-1")} />
            <span>{num(property.area)} m²</span>
          </div>
        </div>

        <Button 
          className={cn("w-full", isMobile && "text-xs h-7")} 
          onClick={() => navigate(`/property/${property.id}`)}
        >
          {t("viewDetails")}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-14" : "pt-20")}>
        {!isMobile && <RentHeroSearch onSearch={handleSearch} />}
        
        {/* Mobile Hero Search with Background */}
        {isMobile && (
          <div 
            className="relative pt-4 pb-6 px-4"
            style={{
              backgroundImage: `url(${rentHeroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="relative z-10 space-y-2">
              {/* Location Search */}
              <div className="relative bg-white rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, neighborhood or address"
                    value={new URLSearchParams(routerLocation.search).get("location") || ""}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(routerLocation.search);
                      if (e.target.value) {
                        newParams.set("location", e.target.value);
                      } else {
                        newParams.delete("location");
                      }
                      navigate({ search: newParams.toString() });
                    }}
                    className="flex-1 text-gray-700 placeholder:text-gray-400 outline-none text-sm"
                  />
                  <button className="p-1.5 bg-gray-100 rounded-full">
                    <Search className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex gap-2">
                <div className="flex-1 relative bg-white rounded-xl p-3 shadow-lg">
                  <select
                    className="w-full text-gray-700 outline-none text-sm appearance-none bg-transparent"
                    value={new URLSearchParams(routerLocation.search).get("type") || ""}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(routerLocation.search);
                      if (e.target.value) {
                        newParams.set("type", e.target.value);
                      } else {
                        newParams.delete("type");
                      }
                      navigate({ search: newParams.toString() });
                    }}
                  >
                    <option value="">Property type</option>
                    <option value="apartment">{t("apartment")}</option>
                    <option value="house">{t("house")}</option>
                    <option value="villa">{t("villa")}</option>
                  </select>
                </div>
                
                <div className="flex-1 relative bg-white rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Max rent"
                      className="flex-1 text-gray-700 placeholder:text-gray-400 outline-none text-sm"
                      value={new URLSearchParams(routerLocation.search).get("maxRent") || ""}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(routerLocation.search);
                        if (e.target.value) {
                          newParams.set("maxRent", e.target.value);
                        } else {
                          newParams.delete("maxRent");
                        }
                        navigate({ search: newParams.toString() });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", isMobile ? "py-4" : "py-8")}>
          <div className={cn("flex flex-col", !isMobile && "lg:flex-row gap-8")}>
            {!isMobile && (
              <div className="lg:w-1/4">
                <PropertyFilters
                  onFilterChange={(filters) => {
                    let filtered = properties;

                    if (filters.location) {
                      const loc = filters.location.toLowerCase();
                      filtered = filtered.filter(
                        (p) =>
                          (p.city || "").toLowerCase().includes(loc) ||
                          (p.location || "").toLowerCase().includes(loc)
                      );
                    }

                    if (filters.propertyType !== "all") {
                      filtered = filtered.filter((p) => p.property_type === filters.propertyType);
                    }

                    if (filters.bedrooms !== "all") {
                      filtered = filtered.filter((p) => p.bedrooms === filters.bedrooms);
                    }

                    if (filters.bathrooms !== "all") {
                      filtered = filtered.filter((p) => p.bathrooms === filters.bathrooms);
                    }

                    if (filters.minPrice[0] > 0 || filters.maxPrice[0] < 100000) {
                      filtered = filtered.filter((p) => {
                        const price = num(p.price);
                        return price >= filters.minPrice[0] && price <= filters.maxPrice[0];
                      });
                    }

                    if (filters.minArea || filters.maxArea) {
                      const minArea = filters.minArea ? num(filters.minArea) : 0;
                      const maxArea = filters.maxArea ? num(filters.maxArea) : Infinity;
                      filtered = filtered.filter((p) => {
                        const area = num(p.area);
                        return area >= minArea && area <= maxArea;
                      });
                    }

                    setFilteredProperties(filtered);
                  }}
                  listingType="rent"
                />
              </div>
            )}

            <div className={cn(isMobile ? "w-full" : "lg:w-3/4")}>
              <div className={cn("flex items-center justify-between", isMobile ? "mb-3" : "mb-6")}>
                <h2 className={cn("font-bold text-foreground font-playfair", isMobile ? "text-lg" : "text-2xl")}>
                  {t("propertiesForRent")}
                </h2>
                <div className={cn("text-muted-foreground", isMobile && "text-xs")}>
                  {filteredProperties.length} {t("properties")} {t("found")}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">{t("loading")}</span>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-lg font-semibold text-foreground mb-2">
                    {t("noPropertiesFound")}
                  </div>
                  <div className="text-muted-foreground">{t("adjustFiltersOrCheckLater")}</div>
                </div>
              ) : (
                <div className={cn("grid gap-4", isMobile ? "grid-cols-2 gap-3" : "md:grid-cols-2 xl:grid-cols-3 gap-6")}>
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
      <FloatingMapButton />
      {isMobile ? (
        <>
          <MobileBottomNav />
          <MobileFooter />
        </>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default Rent;
