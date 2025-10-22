import { ChevronDown, Clock, Shield, XCircle, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface ThingsToKnowProps {
  checkInTime?: string;
  checkOutTime?: string;
  houseRules?: any;
  safetyFeatures?: any;
  cancellationPolicy?: string;
}

const ThingsToKnow = ({ 
  checkInTime = "15:00", 
  checkOutTime = "11:00",
  houseRules,
  safetyFeatures,
  cancellationPolicy = "moderate"
}: ThingsToKnowProps) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold font-playfair">Things to Know</h3>

      <div className="space-y-2">
        {/* House Rules */}
        <Card>
          <CardContent className="p-4">
            <Collapsible open={openSections.includes('rules')}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Clock className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">House Rules</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Check-in: After {checkInTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Check-out: Before {checkOutTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CollapsibleTrigger onClick={() => toggleSection('rules')}>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('rules') ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                <div className="text-xs text-muted-foreground space-y-1 pl-6">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Self check-in with keypad</span>
                  </div>
                  {houseRules?.pets === false && (
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-destructive" />
                      <span>No pets allowed</span>
                    </div>
                  )}
                  {houseRules?.smoking === false && (
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-destructive" />
                      <span>No smoking</span>
                    </div>
                  )}
                  {houseRules?.events === false && (
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-destructive" />
                      <span>No parties or events</span>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Safety & Property */}
        <Card>
          <CardContent className="p-4">
            <Collapsible open={openSections.includes('safety')}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Shield className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Safety & Property</h4>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Secure lockbox for keys</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CollapsibleTrigger onClick={() => toggleSection('safety')}>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('safety') ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                <div className="text-xs text-muted-foreground space-y-1 pl-6">
                  {safetyFeatures?.smokeAlarm && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Smoke alarm</span>
                    </div>
                  )}
                  {safetyFeatures?.fireExtinguisher && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Fire extinguisher</span>
                    </div>
                  )}
                  {safetyFeatures?.firstAidKit && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>First aid kit</span>
                    </div>
                  )}
                  {safetyFeatures?.coAlarm && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Carbon monoxide alarm</span>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card>
          <CardContent className="p-4">
            <Collapsible open={openSections.includes('cancellation')}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <XCircle className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Cancellation Policy</h4>
                    <div className="text-xs text-muted-foreground">
                      <div className="font-medium mb-1">
                        {cancellationPolicy === 'flexible' && 'Flexible Cancellation'}
                        {cancellationPolicy === 'moderate' && 'Moderate Cancellation'}
                        {cancellationPolicy === 'strict' && 'Strict Cancellation'}
                      </div>
                      <div>
                        {cancellationPolicy === 'moderate' && 'Full refund if cancelled 5 days before check-in'}
                        {cancellationPolicy === 'flexible' && 'Full refund if cancelled 24 hours before check-in'}
                        {cancellationPolicy === 'strict' && 'Full refund if cancelled 14 days before check-in'}
                      </div>
                    </div>
                  </div>
                </div>
                <CollapsibleTrigger onClick={() => toggleSection('cancellation')}>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('cancellation') ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                <div className="text-xs text-muted-foreground pl-6">
                  {cancellationPolicy === 'moderate' && (
                    <p>Cancellations made 5+ days before check-in receive a full refund. Cancellations within 5 days forfeit 50% of the booking fee.</p>
                  )}
                  {cancellationPolicy === 'flexible' && (
                    <p>Cancellations made 24+ hours before check-in receive a full refund. Cancellations within 24 hours forfeit the first night's booking fee.</p>
                  )}
                  {cancellationPolicy === 'strict' && (
                    <p>Cancellations made 14+ days before check-in receive a full refund. Cancellations within 14 days forfeit 50% of the total booking amount.</p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThingsToKnow;
