import { useState, useRef, useEffect } from "react";
import { Search, MapPin, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DateRangePicker } from "@/components/DateRangePicker";
import { GuestsSelector } from "@/components/GuestsSelector";
import { cn } from "@/lib/utils";
import { searchAlgerianCities } from "@/data/algerianCities";

type DateRange = { from?: Date; to?: Date };

const MobileHeroSearch = () => {
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'buy' | 'stay' | 'rent'>('stay');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [travelers, setTravelers] = useState("");

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.length > 0) {
      const results = searchAlgerianCities(value, currentLang);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (cityName: string) => {
    setLocation(cityName);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'buy' as const, label: t('buy') || 'Buy' },
    { id: 'stay' as const, label: t('shortStay') || 'Short Stay' },
    { id: 'rent' as const, label: t('rent') || 'Rent' },
  ];

  const handleSearch = () => {
    if (!location.trim()) return;
    
    const route = selectedTab === 'stay' ? 'short-stay' : selectedTab;
    const params = new URLSearchParams();
    params.set('location', location);
    
    if (selectedTab === 'buy' && propertyType) {
      params.set('type', propertyType);
    }
    if (selectedTab === 'buy' && budget) {
      params.set('budget', budget);
    }
    if (selectedTab === 'rent' && propertyType) {
      params.set('type', propertyType);
    }
    if (selectedTab === 'rent' && budget) {
      params.set('maxRent', budget);
    }
    if (selectedTab === 'stay' && dateRange?.from) {
      params.set('checkIn', dateRange.from.toISOString());
    }
    if (selectedTab === 'stay' && dateRange?.to) {
      params.set('checkOut', dateRange.to.toISOString());
    }
    if (selectedTab === 'stay' && travelers) {
      params.set('travelers', travelers);
    }
    
    navigate(`/${route}?${params.toString()}`);
  };

  return (
    <div className="px-4 space-y-3">
      {/* Tab Selector */}
      <div className="flex bg-white rounded-2xl p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all ${
              selectedTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar with Integrated Button */}
      <div className="relative" ref={suggestionsRef}>
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
        <Input
          type="text"
          placeholder={
            selectedTab === 'buy' 
              ? t('cityNeighborhood') || 'City, neighborhood...' 
              : selectedTab === 'rent'
              ? t('whereToRent') || 'Where to rent?'
              : t('stayDestination') || 'Destination...'
          }
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          onFocus={() => {
            if (location) {
              setSuggestions(searchAlgerianCities(location, currentLang));
              setShowSuggestions(true);
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-12 pr-16 h-12 rounded-2xl bg-white text-base"
          autoComplete="off"
        />
        <Button
          onClick={handleSearch}
          disabled={!location.trim()}
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full",
            location.trim()
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          <Search className="h-4 w-4" />
        </Button>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-[200] max-h-60 overflow-y-auto">
            {suggestions.map((city, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectCity(currentLang === 'AR' ? city.nameAr : city.nameFr)}
                className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0 flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{currentLang === 'AR' ? city.nameAr : city.nameFr}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Options Based on Tab */}
      <div className="flex gap-2 overflow-x-auto">
        {/* Property Type / Housing Type - For Buy and Rent */}
        {(selectedTab === 'buy' || selectedTab === 'rent') && (
          <select
            className="flex-1 min-w-[140px] h-12 px-4 bg-white border border-input rounded-full text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring z-50"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">{selectedTab === 'buy' ? t('propertyType') : t('housingType')}</option>
            <option value="apartment">{t('apartment')}</option>
            <option value="house">{t('house')}</option>
            <option value="villa">{t('villa')}</option>
            {selectedTab === 'buy' && <option value="terrain">{t('land')}</option>}
            {selectedTab === 'rent' && <option value="studio">{t('studio')}</option>}
            {selectedTab === 'rent' && <option value="room">{t('room')}</option>}
          </select>
        )}

        {/* Budget / Max Rent - For Buy and Rent */}
        {(selectedTab === 'buy' || selectedTab === 'rent') && (
          <div className="flex-1 min-w-[140px] relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
            <Input
              type="text"
              placeholder={selectedTab === 'buy' ? t('maxBudget') : t('maxRentMonth')}
              className="h-12 pl-10 rounded-full text-sm bg-white border border-input"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        )}

        {/* Dates - For Short Stay */}
        {selectedTab === 'stay' && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-shrink-0 w-[30%] h-12 rounded-full text-xs bg-white border border-input justify-start px-2",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {dateRange?.from ? format(dateRange.from, "dd/MM/yy") : t('checkIn')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white z-[100]" align="start">
                <DateRangePicker
                  value={dateRange}
                  onChange={(range) => setDateRange(range)}
                  allowPast={false}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-shrink-0 w-[30%] h-12 rounded-full text-xs bg-white border border-input justify-start px-2",
                    !dateRange?.to && "text-muted-foreground"
                  )}
                  disabled={!dateRange?.from}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {dateRange?.to ? format(dateRange.to, "dd/MM/yy") : t('checkOut')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white z-[100]" align="start">
                <DateRangePicker
                  value={dateRange}
                  onChange={(range) => setDateRange(range)}
                  allowPast={false}
                />
              </PopoverContent>
            </Popover>

            <div className="flex-shrink-0 w-[30%]">
              <GuestsSelector
                value={travelers}
                onChange={(value) => setTravelers(value)}
                className="h-12 rounded-full text-xs px-2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileHeroSearch;
