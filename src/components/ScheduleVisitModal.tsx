import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
  hostUserId: string;
}

const ScheduleVisitModal = ({ isOpen, onClose, propertyTitle, propertyId, hostUserId }: ScheduleVisitModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !visitorName || !visitorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const visitDateTime = `${selectedDate.toLocaleDateString()} at ${selectedTime}`;
      
      // Create notification for host
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: hostUserId,
          title: 'New Visit Scheduled',
          message: `${visitorName} has scheduled a visit to "${propertyTitle}" on ${visitDateTime}. Contact: ${visitorPhone}${visitorEmail ? `, ${visitorEmail}` : ''}`,
          type: 'visit_scheduled',
          related_id: propertyId
        });

      if (notificationError) throw notificationError;

      // Create or get conversation
      let conversationId: string;
      
      if (user) {
        // If user is logged in, create conversation between user and host
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .or(`and(user_id.eq.${user.id},recipient_id.eq.${hostUserId}),and(user_id.eq.${hostUserId},recipient_id.eq.${user.id})`)
          .eq('property_id', propertyId)
          .single();

        if (existingConv) {
          conversationId = existingConv.id;
        } else {
          const { data: newConv, error: convError } = await supabase
            .from('conversations')
            .insert({
              user_id: user.id,
              recipient_id: hostUserId,
              property_id: propertyId,
              conversation_type: 'property_inquiry',
              subject: `Visit Request: ${propertyTitle}`
            })
            .select()
            .single();

          if (convError) throw convError;
          conversationId = newConv.id;
        }

        // Create message from visitor
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: `Hi! I would like to schedule a visit to "${propertyTitle}" on ${visitDateTime}. ${message ? `\n\nAdditional notes: ${message}` : ''}\n\nMy contact details:\nName: ${visitorName}\nPhone: ${visitorPhone}${visitorEmail ? `\nEmail: ${visitorEmail}` : ''}`,
            message_type: 'text'
          });

        if (messageError) throw messageError;
      } else {
        // If no user logged in, create conversation from host's perspective
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: hostUserId,
            recipient_id: hostUserId,
            property_id: propertyId,
            conversation_type: 'property_inquiry',
            subject: `Visit Request from ${visitorName}: ${propertyTitle}`
          })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;

        // Create message with visitor details
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: hostUserId,
            content: `New visit request for "${propertyTitle}" on ${visitDateTime}.\n\nVisitor Details:\nName: ${visitorName}\nPhone: ${visitorPhone}${visitorEmail ? `\nEmail: ${visitorEmail}` : ''}${message ? `\n\nMessage: ${message}` : ''}\n\nPlease contact the visitor to confirm the visit.`,
            message_type: 'text'
          });

        if (messageError) throw messageError;
      }

      toast({
        title: "Visit Scheduled",
        description: `Your visit has been scheduled for ${visitDateTime}. The host will receive your message and contact details.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast({
        title: "Error",
        description: "Failed to schedule visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-playfair">
            <CalendarIcon className="w-5 h-5" />
            {t('scheduleVisit') || 'Schedule Property Visit'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-inter">{propertyTitle}</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium font-inter">Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border p-3 pointer-events-auto"
            />
          </div>

          {/* Time Slots & Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium font-inter">Available Time Slots</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="font-inter"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Visitor Details */}
            <div className="space-y-3">
              <Label className="text-base font-medium font-inter">Your Details</Label>
              
              <div>
                <Label htmlFor="name" className="text-sm font-inter">Full Name *</Label>
                <Input
                  id="name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Enter your full name"
                  className="font-inter"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-inter">Phone Number *</Label>
                <Input
                  id="phone"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="font-inter"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-inter">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="font-inter"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-inter">Additional Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific requirements or questions..."
                  className="font-inter"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium font-inter">Visit Summary</h4>
                  <p className="text-sm text-muted-foreground font-inter">
                    {selectedDate.toLocaleDateString()} at {selectedTime}
                  </p>
                </div>
                <Badge variant="secondary" className="font-inter">Confirmed</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 font-inter">
            Cancel
          </Button>
          <Button 
            onClick={handleSchedule} 
            disabled={isSubmitting}
            className="flex-1 bg-gradient-primary hover:shadow-elegant font-inter"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Visit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleVisitModal;