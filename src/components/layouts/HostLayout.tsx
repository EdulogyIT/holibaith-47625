import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  CalendarDays, 
  Building2, 
  MessageSquare, 
  CreditCard,
  LogOut,
  Home,
  Plus,
  Menu,
  ArrowLeft
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MobileBottomNav from '@/components/MobileBottomNav';
import { cn } from '@/lib/utils';

interface HostLayoutProps {
  children: ReactNode;
}

export const HostLayout = ({ children }: HostLayoutProps) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const hostMenuItems = [
    { title: 'Reservations', url: '/host', icon: Calendar },
    { title: 'Calendar', url: '/host/calendar', icon: CalendarDays },
    { title: 'Listings', url: '/host/listings', icon: Building2 },
    { title: 'Messages', url: '/host/messages', icon: MessageSquare },
    { title: 'Payouts & Settings', url: '/host/payouts', icon: CreditCard },
  ];

  const quickActions = [
    { title: 'Publish Property', url: '/publish-property', icon: Plus },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mobile Layout
  if (isMobile) {
    const isMainDashboard = location.pathname === '/host' || location.pathname === '/host/dashboard';
    
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            {!isMainDashboard && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/host/dashboard')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <img 
              src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
              alt="Holibayt" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-foreground">Holibayt</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
                      alt="Holibayt" 
                      className="h-8 w-auto"
                    />
                    <span className="font-semibold text-lg">Holibayt</span>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="px-4 pt-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <Button 
                    onClick={() => navigate('/publish-property')} 
                    className="w-full justify-start bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Publish Property
                  </Button>
                </div>

                {/* Host Dashboard Section */}
                <div className="px-4 pt-6 flex-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Host Dashboard
                  </h3>
                  <nav className="space-y-1">
                    {hostMenuItems.map((item) => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        onClick={() => navigate(item.url)}
                        className={cn(
                          "w-full justify-start",
                          location.pathname === item.url && "bg-primary text-primary-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Button>
                    ))}
                  </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mb-2"
                    onClick={() => navigate('/')}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Back to Home
                  </Button>
                  <div className="text-xs text-muted-foreground px-3">
                    Logged in as {user?.name}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Mobile Content */}
        <main className="pt-16 pb-20 px-4 min-h-screen bg-background">
          <div className="py-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
              alt="Holibayt" 
              className="h-8 w-auto"
            />
            <span className="font-semibold text-lg text-foreground">Host</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </div>
              {quickActions.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  {item.title}
                </NavLink>
              ))}
            </div>

            {/* Main Navigation */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Host Dashboard
              </div>
              {hostMenuItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end={item.url === '/host'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  {item.title}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="p-4 border-t border-border">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Back to Site
            </Button>
            <Button variant="ghost" className="justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Logged in as {user?.name}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-background flex items-center px-4 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-foreground">Host Dashboard</h1>
        </header>
        
        {/* Content */}
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};