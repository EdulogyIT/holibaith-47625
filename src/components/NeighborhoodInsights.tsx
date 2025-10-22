import { School, Bus, ShoppingBag, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NeighborhoodInsightsProps {
  city: string;
  location: string;
  description?: string;
}

const NeighborhoodInsights = ({ city, location, description }: NeighborhoodInsightsProps) => {
  const defaultDescription = `Located in ${city} — a vibrant residential area with excellent connectivity and growing demand. This neighborhood offers easy access to amenities, schools, and transportation hubs, making it ideal for families and professionals alike.`;

  const amenities = [
    { icon: School, label: "Schools nearby", distance: "500m" },
    { icon: Bus, label: "Public transport", distance: "200m" },
    { icon: ShoppingBag, label: "Shopping centers", distance: "1km" }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-playfair">Neighborhood Insights</h3>
        <Badge variant="outline" className="text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified Location
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description || defaultDescription}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {amenities.map((amenity, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-3 text-center">
              <amenity.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
              <div className="text-[10px] font-medium mb-0.5">{amenity.label}</div>
              <div className="text-[10px] text-muted-foreground">{amenity.distance}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NeighborhoodInsights;
