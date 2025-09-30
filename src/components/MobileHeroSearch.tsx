import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileHeroSearch = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'buy' | 'stay' | 'rent'>('buy');
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: 'buy' as const, label: t('buy') || 'Buy' },
    { id: 'stay' as const, label: t('shortStay') || 'Short Stay' },
    { id: 'rent' as const, label: t('rent') || 'Rent' },
  ];

  const handleSearch = () => {
    const route = selectedTab === 'stay' ? 'short-stay' : selectedTab;
    navigate(`/${route}?location=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Tab Selector */}
      <div className="flex bg-white rounded-2xl p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              selectedTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder={t('searchPlaceholder') || 'Search for a city, area or property code'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-12 pr-4 h-14 rounded-2xl bg-white text-base"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        <Button variant="outline" className="rounded-full whitespace-nowrap">
          Price <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">
          Beds <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">
          Property Type <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileHeroSearch;
