import { Menu, Home, Building2, MapPin, User, MessageCircle, Calendar, Settings, LogOut, Globe, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const MobileHeader = () => {
  const navigate = useNavigate();
  const { t, currentLang, setCurrentLang } = useLanguage();
  const { currentCurrency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-transparent z-50 safe-top">
      <div className="flex items-center justify-end px-4 h-16">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white rounded-xl">
              <Menu className="h-6 w-6 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-background p-0">
            <div className="flex flex-col h-full">
              {/* Header with Logo */}
              <div className="p-6 pb-4">
                <img 
                  src="/holibayt-logo-transparent.png" 
                  alt="Holibayt" 
                  className="h-16 w-auto"
                />
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
                    <span className="text-base font-medium">Home</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/buy")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-base font-medium">Buy</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/rent")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-base font-medium">Rent</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/short-stay")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    <span className="text-base font-medium">Short Stay</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/about")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-base font-medium">About</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("/blog")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    <span className="text-base font-medium">Blog</span>
                  </button>

                  {user && (
                    <button
                      onClick={() => handleNavigation("/host/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <Building2 className="h-5 w-5" />
                      <span className="text-base font-medium">Host Dashboard</span>
                    </button>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Your Account Section */}
                <div className="px-4">
                  <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">Your Account</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation("/wishlist")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      <span className="text-base font-medium">Wishlist</span>
                    </button>

                    <button
                      onClick={() => handleNavigation("/bookings")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="text-base font-medium">My Trips</span>
                    </button>

                    <button
                      onClick={() => handleNavigation("/messages")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-base font-medium">Messages</span>
                    </button>

                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-base font-medium">Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="text-base font-medium">Settings</span>
                    </button>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Preferences Section */}
                <div className="px-4 pb-4">
                  <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">Preferences</h3>
                  
                  {/* Language Selection */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Language</span>
                    </div>
                    <div className="flex gap-2">
                      {(['EN', 'FR', 'AR'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCurrentLang(lang)}
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
                      <span className="text-sm font-medium">Currency</span>
                    </div>
                    <div className="flex gap-2">
                      {(['USD', 'EUR', 'DZD'] as const).map((currency) => (
                        <button
                          key={currency}
                          onClick={() => setCurrency(currency)}
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
                        <span className="text-base font-medium">Logout ({user.email?.split('@')[0]})</span>
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
