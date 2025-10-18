import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  // Static testimonials - can be connected to database later
  const testimonials = [
    {
      id: "1",
      client_name: "Ahmed Benali",
      client_location: "Alger",
      rating: 5,
      review_text: "Holibayt made finding my dream apartment so easy! The escrow payment system gave me complete peace of mind. Highly recommended!",
      avatar_initials: "AB"
    },
    {
      id: "2",
      client_name: "Sarah Mansouri",
      client_location: "Oran",
      rating: 5,
      review_text: "Professional service from start to finish. The verification process ensured I was dealing with legitimate hosts. Great experience!",
      avatar_initials: "SM"
    },
    {
      id: "3",
      client_name: "Karim Larbi",
      client_location: "Constantine",
      rating: 5,
      review_text: "Found the perfect property for my family vacation. The payment protection and responsive support team made everything stress-free.",
      avatar_initials: "KL"
    },
    {
      id: "4",
      client_name: "Amina Kaci",
      client_location: "Annaba",
      rating: 4,
      review_text: "Excellent platform with great property selection. The booking process was smooth and transparent. Will definitely use again!",
      avatar_initials: "AK"
    },
    {
      id: "5",
      client_name: "Youcef Hamdi",
      client_location: "Tlemcen",
      rating: 5,
      review_text: "As a host, Holibayt Pay guarantees my earnings and the commission rates are fair. The platform has helped me grow my rental business.",
      avatar_initials: "YH"
    },
    {
      id: "6",
      client_name: "Leila Boudjemaa",
      client_location: "Béjaïa",
      rating: 5,
      review_text: "The best real estate platform in Algeria! Verified properties, secure payments, and excellent customer service. I found my home here!",
      avatar_initials: "LB"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-2xl mb-6">
            <Quote className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground font-inter font-light max-w-3xl mx-auto">
            Real experiences from real people who found their perfect property
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-10 w-10 text-primary/30" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground font-inter text-sm leading-relaxed mb-6 line-clamp-4">
                  {testimonial.review_text}
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary text-primary-foreground rounded-full font-semibold text-sm">
                    {testimonial.avatar_initials}
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-foreground">
                      {testimonial.client_name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-inter">
                      {testimonial.client_location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
