import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MobileHeader from '@/components/MobileHeader';
import MobileBottomNav from '@/components/MobileBottomNav';
import FloatingMapButton from '@/components/FloatingMapButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  User, 
  BookOpen, 
  Home, 
  LogOut, 
  Settings, 
  Shield, 
  Bell, 
  Monitor, 
  Trash2,
  Camera,
  Save,
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';

const Profile = () => {
  const { user, logout, hasRole } = useAuth();
  const { t, currentLang } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const translations = {
    en: {
      title: "Profile",
      subtitle: "Manage your details, preferences, and security in one place.",
      userRole: "User",
      hostRole: "Host",
      editProfile: "Edit Profile",
      myBookings: "My Bookings",
      publishProperty: "Publish Property",
      signOut: "Sign out",
      savedProperties: "Saved properties",
      savedSearches: "Saved searches", 
      upcomingBookings: "Upcoming bookings",
      activeListings: "Active listings",
      noBookings: "No bookings yet. Start exploring homes.",
      personalInfo: "Personal Information",
      personalInfoDesc: "Keep your details up to date. Only your name and photo are visible to others.",
      profilePhoto: "Profile photo",
      displayName: "Display name",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      country: "Country",
      wilaya: "Wilaya",
      commune: "Commune",
      street: "Street",
      postalCode: "Postal code",
      language: "Language",
      timezone: "Timezone",
      currency: "Currency",
      save: "Save",
      cancel: "Cancel",
      account: "Account",
      accountDesc: "Manage your Holibayt account settings.",
      changeEmail: "Change email",
      password: "Password",
      passwordDesc: "Choose a strong password you don't use elsewhere.",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      changePassword: "Change password",
      notifications: "Notifications",
      notificationsDesc: "Decide how you want to hear from us.",
      privacy: "Privacy",
      privacyDesc: "Control what others can see and how we use your data.",
      sessions: "Sessions & Devices",
      sessionsDesc: "You're signed in on these devices.",
      dangerZone: "Danger Zone",
      dangerDesc: "Permanent actions. Please proceed with caution.",
      deactivateAccount: "Deactivate account",
      deleteAccount: "Delete account",
      hostSettings: "Host Settings",
      hostSettingsDesc: "Fine-tune how guests see you and how you manage requests."
    },
    fr: {
      title: "Profil",
      subtitle: "Gérez vos informations, préférences et sécurité en un seul endroit.",
      userRole: "Utilisateur",
      hostRole: "Hôte",
      editProfile: "Modifier le profil",
      myBookings: "Mes réservations",
      publishProperty: "Publier un bien",
      signOut: "Se déconnecter",
      savedProperties: "Biens enregistrés",
      savedSearches: "Recherches enregistrées",
      upcomingBookings: "Réservations à venir",
      activeListings: "Annonces actives",
      noBookings: "Aucune réservation pour le moment. Commencez à explorer.",
      personalInfo: "Informations personnelles",
      personalInfoDesc: "Gardez vos informations à jour. Seuls votre nom et votre photo sont visibles des autres.",
      profilePhoto: "Photo de profil",
      displayName: "Nom affiché",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      phone: "Téléphone",
      country: "Pays",
      wilaya: "Wilaya",
      commune: "Commune",
      street: "Rue",
      postalCode: "Code postal",
      language: "Langue",
      timezone: "Fuseau horaire",
      currency: "Devise",
      save: "Enregistrer",
      cancel: "Annuler",
      account: "Compte",
      accountDesc: "Gérez les paramètres de votre compte Holibayt.",
      changeEmail: "Changer l'e-mail",
      password: "Mot de passe",
      passwordDesc: "Choisissez un mot de passe robuste que vous n'utilisez nulle part ailleurs.",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le nouveau mot de passe",
      changePassword: "Changer le mot de passe",
      notifications: "Notifications",
      notificationsDesc: "Choisissez comment vous souhaitez recevoir nos messages.",
      privacy: "Confidentialité",
      privacyDesc: "Contrôlez ce que les autres voient et comment nous utilisons vos données.",
      sessions: "Sessions et appareils",
      sessionsDesc: "Vous êtes connecté sur ces appareils.",
      dangerZone: "Zone de danger",
      dangerDesc: "Actions irréversibles. Procédez avec prudence.",
      deactivateAccount: "Désactiver le compte",
      deleteAccount: "Supprimer le compte",
      hostSettings: "Paramètres hôte",
      hostSettingsDesc: "Ajustez la façon dont les voyageurs vous voient et la gestion des demandes."
    },
    ar: {
      title: "الملف الشخصي",
      subtitle: "أدِر بياناتك وتفضيلاتك وأمانك في مكان واحد.",
      userRole: "مستخدم",
      hostRole: "مضيف",
      editProfile: "تعديل الملف",
      myBookings: "حجوزاتي",
      publishProperty: "نشر عقار",
      signOut: "تسجيل الخروج",
      savedProperties: "العقارات المحفوظة",
      savedSearches: "عمليات البحث المحفوظة",
      upcomingBookings: "الحجوزات القادمة",
      activeListings: "الإعلانات النشطة",
      noBookings: "لا توجد حجوزات بعد. ابدأ في الاستكشاف.",
      personalInfo: "المعلومات الشخصية",
      personalInfoDesc: "حدِّث معلوماتك باستمرار. لا يظهر للآخرين سوى اسمك وصورتك.",
      profilePhoto: "صورة الملف",
      displayName: "الاسم المعروض",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      country: "الدولة",
      wilaya: "الولاية",
      commune: "البلدية",
      street: "الشارع",
      postalCode: "الرمز البريدي",
      language: "اللغة",
      timezone: "المنطقة الزمنية",
      currency: "العملة",
      save: "حفظ",
      cancel: "إلغاء",
      account: "الحساب",
      accountDesc: "إدارة إعدادات حسابك في هوليبَيت.",
      changeEmail: "تغيير البريد الإلكتروني",
      password: "كلمة المرور",
      passwordDesc: "اختر كلمة مرور قوية وغير مُستخدمة في مواقع أخرى.",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      changePassword: "تغيير كلمة المرور",
      notifications: "الإشعارات",
      notificationsDesc: "اختر طريقة تلقي الإشعارات.",
      privacy: "الخصوصية",
      privacyDesc: "تحكّم بما يراه الآخرون وكيفية استخدام بياناتك.",
      sessions: "الجلسات والأجهزة",
      sessionsDesc: "أنت مسجّل الدخول على هذه الأجهزة.",
      dangerZone: "منطقة الخطر",
      dangerDesc: "إجراءات دائمة. يرجى المتابعة بحذر.",
      deactivateAccount: "إيقاف تنشيط الحساب",
      deleteAccount: "حذف الحساب",
      hostSettings: "إعدادات المضيف",
      hostSettingsDesc: "خصّص كيف يراك الضيوف وكيف تدير الطلبات."
    }
  };

  const currentTranslations = translations[currentLang.toLowerCase()] || translations.en;

  const handleSave = () => {
    toast.success(currentLang === 'AR' ? 'تم تحديث الملف.' : currentLang === 'FR' ? 'Profil mis à jour.' : 'Profile updated.');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success(currentLang === 'AR' ? 'تم تسجيل الخروج.' : currentLang === 'FR' ? 'Déconnecté avec succès.' : 'Successfully logged out.');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <main className="pt-16 pb-20">
        <div className="px-4 py-4">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-lg bg-primary text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold mb-0.5">Profile</h1>
                <p className="text-xs text-muted-foreground">Manage your account</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {hasRole('host') ? currentTranslations.hostRole : currentTranslations.userRole}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              <Edit className="h-3 w-3 mr-1" />
              {currentTranslations.editProfile}
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              <BookOpen className="h-3 w-3 mr-1" />
              {currentTranslations.myBookings}
            </Button>
            {hasRole('host') && (
              <Button variant="outline" size="sm" className="text-xs h-8 px-3">
                <Home className="h-3 w-3 mr-1" />
                {currentTranslations.publishProperty}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs h-8 px-3">
              <LogOut className="h-3 w-3 mr-1" />
              {currentTranslations.signOut}
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 px-4">
          <Card className="border-accent/20">
            <CardContent className="p-3">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">12</div>
              <div className="text-xs text-muted-foreground font-medium">{currentTranslations.savedProperties}</div>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardContent className="p-3">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">3</div>
              <div className="text-xs text-muted-foreground font-medium">{currentTranslations.savedSearches}</div>
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardContent className="p-3">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">2</div>
              <div className="text-xs text-muted-foreground font-medium">{currentTranslations.upcomingBookings}</div>
            </CardContent>
          </Card>
          {hasRole('host') && (
            <Card className="border-accent/20">
              <CardContent className="p-3">
                <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">5</div>
                <div className="text-xs text-muted-foreground font-medium">{currentTranslations.activeListings}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="px-4">
          <Tabs defaultValue="personal" className="space-y-4 animate-fade-in">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm text-xs h-9">
              <TabsTrigger value="personal" className="flex items-center gap-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all text-xs px-2">
                <User className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Info</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all text-xs px-2">
                <Settings className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Account</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all text-xs px-2">
                <Shield className="h-3 w-3" />
                <span className="hidden sm:inline text-xs">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-3">
              <Card className="border-accent/20">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm text-primary">{currentTranslations.personalInfo}</CardTitle>
                  <CardDescription className="text-xs">{currentTranslations.personalInfoDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-3">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="displayName" className="text-xs font-medium">{currentTranslations.displayName}</Label>
                      <Input id="displayName" defaultValue={user.name} className="text-sm h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-medium">{currentTranslations.email}</Label>
                      <Input id="email" defaultValue={user.email} disabled className="text-sm h-9 bg-muted/50" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-medium">{currentTranslations.phone}</Label>
                      <Input id="phone" placeholder="+213 555 123 456" className="text-sm h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="country" className="text-xs font-medium">{currentTranslations.country}</Label>
                      <Select>
                        <SelectTrigger className="text-sm h-9">
                          <SelectValue placeholder="Algeria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="algeria">Algeria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90 text-xs h-8 flex-1">
                      <Save className="h-3 w-3 mr-1" />
                      {currentTranslations.save}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="text-xs h-8 flex-1">
                      {currentTranslations.cancel}
                    </Button>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-elegant">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                <CardTitle className="text-primary">{currentTranslations.account}</CardTitle>
                <CardDescription>{currentTranslations.accountDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between p-4 border border-accent/20 rounded-xl bg-gradient-to-r from-white/50 to-accent/5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{currentTranslations.changeEmail}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">Edit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone - Only in Account Section */}
            <Card className="border-destructive/20 bg-gradient-to-br from-card to-destructive/5 shadow-elegant">
              <CardHeader className="bg-gradient-to-r from-destructive/10 to-destructive/5 rounded-t-lg">
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  {currentTranslations.dangerZone}
                </CardTitle>
                <CardDescription>{currentTranslations.dangerDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl bg-gradient-to-r from-white/50 to-destructive/5">
                  <div>
                    <div className="font-medium text-foreground">{currentTranslations.deactivateAccount}</div>
                    <div className="text-sm text-muted-foreground">Temporarily disable your account</div>
                  </div>
                  <Button variant="destructive" size="sm" className="shadow-md hover:shadow-lg transition-all">
                    {currentTranslations.deactivateAccount}
                  </Button>
                </div>
                <Separator className="bg-destructive/20" />
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl bg-gradient-to-r from-white/50 to-destructive/5">
                  <div>
                    <div className="font-medium text-foreground">{currentTranslations.deleteAccount}</div>
                    <div className="text-sm text-muted-foreground">Permanently delete your account and data</div>
                  </div>
                  <Button variant="destructive" size="sm" className="shadow-md hover:shadow-lg transition-all">
                    {currentTranslations.deleteAccount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password */}
          <TabsContent value="password" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-elegant">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                <CardTitle className="text-primary">{currentTranslations.password}</CardTitle>
                <CardDescription>{currentTranslations.passwordDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-primary font-medium">{currentTranslations.currentPassword}</Label>
                  <Input id="currentPassword" type="password" className="border-accent/30 focus:border-primary transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-primary font-medium">{currentTranslations.newPassword}</Label>
                  <Input id="newPassword" type="password" className="border-accent/30 focus:border-primary transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-primary font-medium">{currentTranslations.confirmPassword}</Label>
                  <Input id="confirmPassword" type="password" className="border-accent/30 focus:border-primary transition-colors" />
                </div>
                <Button className="bg-gradient-primary hover:opacity-90 transition-all shadow-lg">
                  {currentTranslations.changePassword}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-elegant">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                <CardTitle className="text-primary">{currentTranslations.notifications}</CardTitle>
                <CardDescription>{currentTranslations.notificationsDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between p-4 border border-accent/20 rounded-xl bg-gradient-to-r from-white/50 to-accent/5">
                  <div>
                    <div className="font-medium text-foreground">Email notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-gradient-primary" />
                </div>
                <Separator className="bg-accent/20" />
                <div className="flex items-center justify-between p-4 border border-accent/20 rounded-xl bg-gradient-to-r from-white/50 to-accent/5">
                  <div>
                    <div className="font-medium text-foreground">SMS notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via SMS</div>
                  </div>
                  <Switch className="data-[state=checked]:bg-gradient-primary" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-elegant">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                <CardTitle className="text-primary">{currentTranslations.privacy}</CardTitle>
                <CardDescription>{currentTranslations.privacyDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between p-4 border border-accent/20 rounded-xl bg-gradient-to-r from-white/50 to-accent/5">
                  <div>
                    <div className="font-medium text-foreground">Show profile photo</div>
                    <div className="text-sm text-muted-foreground">Let others see your profile picture</div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-gradient-primary" />
                </div>
                <Separator className="bg-accent/20" />
                <div className="flex items-center justify-between p-4 border border-accent/20 rounded-xl bg-gradient-to-r from-white/50 to-accent/5">
                  <div>
                    <div className="font-medium text-foreground">Analytics & personalization</div>
                    <div className="text-sm text-muted-foreground">Help us improve your experience</div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-gradient-primary" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions & Devices */}
          <TabsContent value="sessions" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20 shadow-elegant">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
                <CardTitle className="text-primary">{currentTranslations.sessions}</CardTitle>
                <CardDescription>{currentTranslations.sessionsDesc}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-accent/20 rounded-xl bg-gradient-to-r from-white/50 to-accent/5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground">Current session</div>
                        <div className="text-sm text-muted-foreground">Chrome on Windows • Active now</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Current</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>

      <MobileBottomNav />
      <FloatingMapButton />
    </div>
  );
};

export default Profile;