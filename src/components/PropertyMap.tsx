import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyMapProps {
  location: string;
  address?: string;
}

const PropertyMap = ({ location, address }: PropertyMapProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-playfair">
          <MapPin className="w-5 h-5 mr-2" />
          Localisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Map-like Background with Grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/30 to-accent/5" />
          
          {/* Street Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-0 right-0 h-px bg-muted-foreground/30" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground/30" />
            <div className="absolute top-3/4 left-0 right-0 h-px bg-muted-foreground/30" />
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-muted-foreground/30" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/30" />
            <div className="absolute left-3/4 top-0 bottom-0 w-px bg-muted-foreground/30" />
          </div>

          {/* Central Location Marker with "You're Here" */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Pulsing Circle Animation */}
            <div className="absolute w-24 h-24 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute w-16 h-16 rounded-full bg-primary/30 animate-pulse" />
            
            {/* Main Marker Pin */}
            <div className="relative">
              <MapPin className="w-12 h-12 text-primary fill-primary/20 drop-shadow-lg animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            
            {/* "You're Here" Badge */}
            <div className="mt-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-elegant font-inter font-semibold text-sm">
              You're here
            </div>
            
            {/* Location Name */}
            <p className="mt-3 font-inter font-medium text-foreground text-center">{location}</p>
            {address && (
              <p className="font-inter text-sm text-muted-foreground text-center mt-1">{address}</p>
            )}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm font-inter">
            <span className="font-medium text-foreground mr-2">Adresse:</span>
            <span className="text-muted-foreground">{location}</span>
          </div>
          {address && (
            <div className="flex items-center text-sm font-inter">
              <span className="font-medium text-foreground mr-2">Détails:</span>
              <span className="text-muted-foreground">{address}</span>
            </div>
          )}
        </div>
        
        {/* Interactive elements placeholder */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-inter font-medium text-foreground">Transport</div>
            <div className="text-xs font-inter text-muted-foreground mt-1">Accessible</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-inter font-medium text-foreground">Commerces</div>
            <div className="text-xs font-inter text-muted-foreground mt-1">À proximité</div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-3"
          onClick={() => {
            const query = encodeURIComponent(address || location);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
            window.open(mapsUrl, '_blank');
          }}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyMap;