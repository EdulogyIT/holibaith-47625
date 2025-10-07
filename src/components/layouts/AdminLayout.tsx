import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  Home,
  Menu,
  FileText,
  Award
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const adminMenuItems = [
    { title: t('admin.dashboard'), url: '/admin', icon: LayoutDashboard },
    { title: t('admin.properties'), url: '/admin/properties', icon: Building2 },
    { title: t('admin.hostsGuests'), url: '/admin/users', icon: Users },
    { title: 'Superhosts', url: '/admin/superhosts', icon: Award },
    { title: t('admin.messages'), url: '/admin/messages', icon: MessageSquare },
    { title: 'Blogs', url: '/admin/blogs', icon: FileText },
    { title: t('admin.settings'), url: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
              alt="Holibayt" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-foreground">Admin</h1>
          </div>
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                    <span className="font-semibold text-lg">Admin Panel</span>
                  </div>
                </div>

                {/* Admin Dashboard Section */}
                <div className="px-4 pt-6 flex-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t('admin.administration')}
                  </h3>
                  <nav className="space-y-1">
                    {adminMenuItems.map((item) => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        onClick={() => {
                          navigate(item.url);
                          setIsSheetOpen(false);
                        }}
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
                    onClick={() => {
                      navigate('/');
                      setIsSheetOpen(false);
                    }}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Back to Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive mb-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
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
        <main className="pt-16 pb-6 px-4 min-h-screen bg-background">
          <div className="py-6">
            {children}
          </div>
        </main>
      </>
    );
  }

  // Desktop Layout
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar 
          variant="sidebar"
          className="w-64"
          collapsible="none"
        >
          <SidebarContent>
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
                  alt="Holibayt" 
                  className="h-8 w-auto"
                />
                <span className="font-semibold text-lg">Admin</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('admin.administration')}</h3>
              <nav className="space-y-1">
                {adminMenuItems.map((item) => (
                  <NavLink 
                    key={item.title}
                    to={item.url} 
                    end={item.url === '/admin'}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                      }`
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4 border-t">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Logged in as {user?.name}
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <div className="ml-4">
                <h1 className="text-lg md:text-xl font-semibold">{t('admin.adminPanel')}</h1>
              </div>
            </div>
          </header>
          
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};