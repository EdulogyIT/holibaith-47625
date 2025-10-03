import { Menu, Home, Building2, MapPin, User, MessageCircle, Calendar, Settings, LogOut, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import holibaytLogo from "@/assets/holibayt-logo-new.png";
import { useState } from "react";

const MobileHeader = () => {
  const navigate = useNavigate();
  const { t, currentLang, setCurrentLang } = useLanguage();
  const { currentCurrency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSheetOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setSheetOpen(false);
  };

  const handleLanguageChange = (lang: 'EN' | 'FR' | 'AR') => {
    setCurrentLang(lang);
    setSheetOpen(false);
  };

  const handleCurrencyChange = (currency: 'USD' | 'EUR' | 'DZD') => {
    setCurrency(currency);
    setSheetOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo and Brand Name */}
        <div 
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          onClick={() => navigate('/')}
        >
          <img 
            src={holibaytLogo} 
            alt="Holibayt Logo" 
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg font-semibold text-foreground">Holibayt</span>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white rounded-xl">
              <Menu className="h-6 w-6 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-background p-0">
            <div className="flex flex-col h-full">
              {/* Header with Logo */}
              <div className="p-6 pb-4 flex items-center gap-3">
                <img 
                  src={holibaytLogo} 
                  alt="Holibayt Logo" 
                  className="h-12 w-12"
                />
                <span className="text-2xl font-semibold" style={{ color: '#2d5a4a' }}>Holibayt</span>
              </div>

              <Separator />

              {/* Main Navigation */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-1">
                  <button
                    onClick={() => handleNavigation("/")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span className="text-base font-medium">{t('home')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/buy")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-base font-medium">{t('buy')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/rent")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-base font-medium">{t('rent')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/short-stay")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-base font-medium">{t('shortStay')}</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/about")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-base font-medium">{t('about')}</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/blog")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-base font-medium">{t('blog')}</span>
                  </button>

                  {user && (
                    <>
                      <button
                        onClick={() => handleNavigation("/host/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Building2 className="h-5 w-5" />
                        <span className="text-base font-medium">{t('host.dashboard')}</span>
                      </button>
                      
                      <button
                        onClick={() => handleNavigation("/publish-property")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Building2 className="h-5 w-5" />
                        <span className="text-base font-medium">{t('publishProperty')}</span>
                      </button>
                    </>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Your Account Section */}
                {user && (
                  <div className="px-4">
                    <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">{t('myProfile')}</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation("/wishlist")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Home className="h-5 w-5" />
                        <span className="text-base font-medium">{t('wishlist') || 'Wishlist'}</span>
                      </button>

                      <button
                        onClick={() => handleNavigation("/bookings")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Calendar className="h-5 w-5" />
                        <span className="text-base font-medium">{t('myBookings')}</span>
                      </button>

                      <button
                        onClick={() => handleNavigation("/messages")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-base font-medium">{t('messages') || 'Messages'}</span>
                      </button>

                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <User className="h-5 w-5" />
                        <span className="text-base font-medium">{t('myProfile')}</span>
                      </button>

                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="text-base font-medium">{t('settings') || 'Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Preferences Section */}
                <div className="px-4 pb-4">
                  <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">{t('preferences') || 'Preferences'}</h3>
                  
                  {/* Language Selection */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('language') || 'Language'}</span>
                    </div>
                    <div className="flex gap-2">
                      {(['EN', 'FR', 'AR'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentLang === lang
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('currency') || 'Currency'}</span>
                    </div>
                    <div className="flex gap-2">
                      {(['USD', 'EUR', 'DZD'] as const).map((currency) => (
                        <button
                          key={currency}
                          onClick={() => handleCurrencyChange(currency)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentCurrency === currency
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {currency}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {user && (
                  <>
                    <Separator className="my-4" />
                    <div className="px-4 pb-6">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="text-base font-medium">{t('logout')} ({user.email?.split('@')[0]})</span>
                      </button>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileHeader;
