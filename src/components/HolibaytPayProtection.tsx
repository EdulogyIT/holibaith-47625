import { Shield, Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HolibaytPayProtection = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Holibayt Pay™ Protection</h3>
            <p className="text-sm text-muted-foreground">Rent Deposit Held Securely</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>Refunds Available</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-600" />
            <span>Secure payment processing feature</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-primary text-primary hover:bg-primary hover:text-white"
          onClick={() => navigate('/holibayt-pay')}
        >
          Learn More about Holibayt Pay™
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default HolibaytPayProtection;
