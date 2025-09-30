import { Search, Heart, Calendar, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { id: "explore", icon: Search, label: "Explore", path: "/" },
    { id: "wishlist", icon: Heart, label: "Wishlist", path: "/wishlist" },
    { id: "trips", icon: Calendar, label: "Trips", path: "/bookings" },
    { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              <Icon 
                className={`h-6 w-6 mb-1 ${active ? "text-primary fill-primary" : "text-muted-foreground"}`} 
              />
              <span className={`text-xs ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
