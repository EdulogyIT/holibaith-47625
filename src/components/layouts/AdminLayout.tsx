import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Calendar, 
  Building2, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  Home,
  User
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const adminMenuItems = [
    { title: t('admin.dashboard'), url: '/admin', icon: LayoutDashboard },
    { title: t('admin.properties'), url: '/admin/properties', icon: Building2 },
    { title: t('admin.hostsGuests'), url: '/admin/users', icon: Users },
    { title: t('admin.messages'), url: '/admin/messages', icon: MessageSquare },
    { title: t('admin.settings'), url: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile ? (
        <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
              alt="Holibayt" 
              className="h-8 w-auto"
            />
            <span className="font-semibold text-base">Admin</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.role}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to App
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      ) : (
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">{user?.name}</div>
                          <div className="text-xs text-muted-foreground">{user?.role}</div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <NavLink to="/admin">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          {t('admin.adminConsole')}
                        </NavLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <NavLink to="/">
                          <Home className="mr-2 h-4 w-4" />
                          Back to App
                        </NavLink>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('admin.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SidebarContent>
            </Sidebar>

            <main className="flex-1">
              <header className="h-16 border-b bg-background flex items-center px-4 md:px-6">
                <SidebarTrigger />
                <div className="ml-4">
                  <h1 className="text-lg md:text-xl font-semibold">{t('admin.adminPanel')}</h1>
                </div>
              </header>
              
              <div className="p-4 md:p-6">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      )}

      {/* Mobile Content */}
      {isMobile && (
        <main className="pt-14 pb-20">
          <div className="p-4">
            {children}
          </div>
        </main>
      )}
    </div>
  );
};