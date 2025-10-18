import SEOHead from "@/components/SEOHead";
import MobileHeader from "@/components/MobileHeader";
import MobileFooter from "@/components/MobileFooter";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Clock, CheckCircle, Lock, ArrowRight, CreditCard, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HolibaytPay = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Payment Protection",
      description: "Your payment is held securely in escrow until check-in is confirmed",
      color: "bg-primary"
    },
    {
      icon: Lock,
      title: "Secure Transactions",
      description: "Bank-level encryption with Stripe Connect integration",
      color: "bg-accent"
    },
    {
      icon: Clock,
      title: "Automatic Release",
      description: "Funds released 24h after check-out for short stays",
      color: "bg-foreground"
    },
    {
      icon: CheckCircle,
      title: "Verified Hosts",
      description: "All hosts undergo KYC verification before receiving payments",
      color: "bg-primary"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Book Property",
      description: "Complete your booking with any payment method",
      icon: CreditCard
    },
    {
      step: 2,
      title: "Payment Held in Escrow",
      description: "Your payment is securely held until check-in",
      icon: Shield
    },
    {
      step: 3,
      title: "Check-in Confirmed",
      description: "Host confirms your arrival at the property",
      icon: Users
    },
    {
      step: 4,
      title: "Automatic Release",
      description: "Payment released to host 24h after check-out",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Holibayt Pay - Secure Payment Escrow System"
        description="Learn how Holibayt Pay protects your payments with secure escrow, automatic release, and verified hosts. Safe transactions for all properties."
        keywords="holibayt pay, secure payment, escrow, payment protection, algeria real estate payments"
      />
      <MobileHeader />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-primary-foreground rounded-3xl mb-8 animate-pulse shadow-elegant">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
                Holibayt <span className="text-primary">Pay</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-inter font-light mb-8">
                Your Payments, Protected Every Step of the Way
              </p>
              <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
                Holibayt Pay is our secure escrow payment system that protects both guests and hosts throughout every transaction. Your money is safe until you're settled in.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                Why Holibayt Pay?
              </h2>
              <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
                Built-in protection for every booking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} text-primary-foreground rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-inter">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
                Simple, transparent, and secure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative">
                    <Card className="h-full hover:shadow-elegant transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-xl font-bold text-lg">
                            {step.step}
                          </div>
                          <div className="ml-auto">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-inter">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight className="h-8 w-8 text-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
                  For Guests: Complete Peace of Mind
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-foreground mb-1">Secure Escrow</h3>
                      <p className="text-muted-foreground text-sm">Your payment is protected until check-in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-foreground mb-1">Full Refund Protection</h3>
                      <p className="text-muted-foreground text-sm">Cancel within policy terms for refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-foreground mb-1">Dispute Resolution</h3>
                      <p className="text-muted-foreground text-sm">24/7 support for any issues</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
                  For Hosts: Guaranteed Payments
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-foreground mb-1">Fast Payouts</h3>
                      <p className="text-muted-foreground text-sm">Automatic release 24h after check-out</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-foreground mb-1">Verified Guests</h3>
                      <p className="text-muted-foreground text-sm">All guests verified before booking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-inter font-semibold text-foreground mb-1">No Chargebacks</h3>
                      <p className="text-muted-foreground text-sm">Protected from payment disputes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
              Ready to Book with Confidence?
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8">
              Start exploring properties protected by Holibayt Pay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
                onClick={() => navigate('/short-stay')}
              >
                Browse Properties
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MobileFooter />
      <MobileBottomNav />
    </div>
  );
};

export default HolibaytPay;
