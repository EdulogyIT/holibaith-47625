import { Search, Heart, Calendar, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('messages-unread')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchUnreadCount();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            id,
            sender_id,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!data) return;

      // Deduplicate and filter conversations
      const conversationsMap = new Map();
      for (const conv of data) {
        if (conv.user_id === conv.admin_id || conv.user_id === conv.recipient_id) continue;
        if (!conv.messages || conv.messages.length === 0) continue;
        
        const subject = conv.subject || 'Support Request';
        if (!conversationsMap.has(subject)) {
          conversationsMap.set(subject, conv);
        } else {
          const existing = conversationsMap.get(subject);
          if (new Date(conv.updated_at) > new Date(existing.updated_at)) {
            conversationsMap.set(subject, conv);
          }
        }
      }

      // Count unread conversations
      let count = 0;
      for (const conv of conversationsMap.values()) {
        const lastReadAt = conv.last_read_at ? new Date(conv.last_read_at) : new Date(0);
        const hasUnread = conv.messages?.some((msg: any) => 
          msg.sender_id !== user.id && new Date(msg.created_at) > lastReadAt
        );
        if (hasUnread) count++;
      }
      
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const navItems = [
    { id: "explore", icon: Search, label: t('navExplore'), path: "/" },
    { id: "wishlist", icon: Heart, label: t('navWishlist'), path: "/wishlist" },
    { id: "trips", icon: Calendar, label: t('trips'), path: "/bookings" },
    { id: "messages", icon: MessageCircle, label: t('messages'), path: "/messages" },
    { id: "profile", icon: User, label: t('navProfile'), path: "/profile" },
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
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <Icon 
                className={`h-6 w-6 mb-1 ${active ? "text-primary fill-primary" : "text-muted-foreground"}`} 
              />
              {item.id === 'messages' && unreadCount > 0 && (
                <span className="absolute top-2 right-1/4 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
