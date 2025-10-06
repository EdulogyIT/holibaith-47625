import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  Send, 
  MessageCircle, 
  Users,
  Star,
  Clock,
  Award,
  MapPin,
  ChevronLeft
} from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import heroImage from "@/assets/contact-advisor-hero.jpg";

const ContactAdvisor = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useScrollToTop();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const advisorStats = [
    { icon: Users, number: "150+", label: t('expertAdvisors') },
    { icon: Star, number: "4.9", label: t('averageRating') },
    { icon: Clock, number: "2min", label: t('averageResponseTime') },
    { icon: Award, number: "98%", label: t('satisfactionRate') }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: t('phoneSupport'),
      details: "+213 (0) 21 123 456",
      action: () => window.open('tel:+213021123456')
    },
    {
      icon: Mail,
      title: t('emailSupport'),
      details: "contact@holibayt.com",
      action: () => window.open('mailto:contact@holibayt.com')
    },
    {
      icon: MessageCircle,
      title: t('liveChat'),
      details: t('chatNow'),
      action: () => navigate('/messages?start=true')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {isMobile && <MobileHeader />}
      
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="pt-16">
          {/* Header with Back Button and Background */}
          <div className="relative px-4 py-8 border-b border-border overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src={heroImage} 
                alt="Contact advisor" 
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/95 to-background"></div>
            </div>
            <div className="relative z-10">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-foreground mb-4 active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="text-sm font-inter font-medium">{t('back')}</span>
              </button>
              <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
                {t('speakToAdvisor')}
              </h1>
              <p className="text-base text-muted-foreground font-inter">
                {t('getPersonalizedGuidance') || 'Get personalized guidance from experts'}
              </p>
            </div>
          </div>

          {/* Stats Grid with Background */}
          <div className="relative px-4 py-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background z-0"></div>
            <div className="relative z-10 grid grid-cols-2 gap-3">
              {advisorStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-playfair font-bold text-foreground">
                        {stat.number}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-inter font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Contact Methods */}
          <div className="relative px-4 py-6 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold font-playfair mb-4">{t('chooseContactMethod')}</h2>
              <div className="space-y-3">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={index}
                      onClick={method.action}
                      className="w-full flex items-center justify-between p-4 bg-background/90 backdrop-blur-sm border border-border rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold font-inter text-sm">{method.title}</div>
                          <div className="text-xs text-muted-foreground font-inter">{method.details}</div>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold font-playfair mb-3">{t('sendMessage')}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-xs font-inter">{t('fullName')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={t('yourFullName')}
                  className="h-11 text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-inter">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder={t('emailPlaceholder')}
                  className="h-11 text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-inter">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+213 XX XX XX XX"
                  className="h-11 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-xs font-inter">{t('subject')}</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder={t('whatCanWeHelp')}
                  className="h-11 text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-xs font-inter">{t('message')}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={t('tellUsMore')}
                  rows={4}
                  className="text-sm resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11 bg-gradient-primary font-inter text-sm">
                <Send className="h-4 w-4 mr-2" />
                {t('sendMessage')}
              </Button>
            </form>
          </div>

          {/* Office Info */}
          <div className="relative px-4 py-6 space-y-3 pb-24 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-background to-transparent"></div>
            </div>
            <div className="relative z-10 space-y-3">
              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm font-inter mb-1">{t('ourOffice')}</h3>
                    <p className="text-xs text-muted-foreground font-inter">
                      123 Boulevard des Martyrs<br />
                      Alger Centre, 16000<br />
                      Algiers, Algeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm font-inter mb-1">{t('businessHours')}</h3>
                    <div className="text-xs text-muted-foreground font-inter space-y-0.5">
                      <p>{t('mondayFriday')}</p>
                      <p>{t('saturday')}</p>
                      <p>{t('sunday')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-5 text-primary-foreground shadow-lg">
                <h3 className="font-semibold text-base font-inter mb-2 text-center">{t('needImmediateHelp')}</h3>
                <p className="text-xs mb-3 opacity-90 text-center">{t('call247Hotline')}</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full font-inter text-sm h-10 font-semibold"
                  onClick={() => window.open('tel:+213021999999')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  +213 (0) 21 999 999
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Desktop version
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-playfair font-bold mb-6">{t('speakToAdvisor')}</h1>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {advisorStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-card rounded-lg p-4 border text-center">
                    <IconComponent className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={index}
                    onClick={method.action}
                    className="bg-card border rounded-lg p-4 hover:shadow-lg transition-shadow text-center"
                  >
                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-primary">{method.details}</p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t('sendMessage')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">{t('subject')}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">{t('message')}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">
                <Send className="h-4 w-4 mr-2" />
                {t('sendMessage')}
              </Button>
            </form>
          </div>
        </div>
      )}

      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ContactAdvisor;
