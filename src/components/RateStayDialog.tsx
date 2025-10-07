import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface RateStayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  propertyId: string;
  propertyTitle: string;
  userId: string;
}

export function RateStayDialog({
  open,
  onOpenChange,
  bookingId,
  propertyId,
  propertyTitle,
  userId,
}: RateStayDialogProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [cleanliness, setCleanliness] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [checkin, setCheckin] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [location, setLocation] = useState(0);
  const [value, setValue] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide an overall rating",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        booking_id: bookingId,
        property_id: propertyId,
        user_id: userId,
        rating,
        comment: comment.trim() || null,
        cleanliness_rating: cleanliness || null,
        accuracy_rating: accuracy || null,
        checkin_rating: checkin || null,
        communication_rating: communication || null,
        location_rating: location || null,
        value_rating: value || null,
      });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });

      onOpenChange(false);
      // Reset form
      setRating(0);
      setComment("");
      setCleanliness(0);
      setAccuracy(0);
      setCheckin(0);
      setCommunication(0);
      setLocation(0);
      setValue(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => {
    const [hovered, setHovered] = useState(0);

    return (
      <div className="space-y-1">
        <Label className="text-xs">{label}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  star <= (hovered || value)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate Your Stay</DialogTitle>
          <DialogDescription>
            How was your experience at {propertyTitle}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <StarRating
              value={cleanliness}
              onChange={setCleanliness}
              label="Cleanliness"
            />
            <StarRating value={accuracy} onChange={setAccuracy} label="Accuracy" />
            <StarRating value={checkin} onChange={setCheckin} label="Check-in" />
            <StarRating
              value={communication}
              onChange={setCommunication}
              label="Communication"
            />
            <StarRating value={location} onChange={setLocation} label="Location" />
            <StarRating value={value} onChange={setValue} label="Value" />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={submitting || rating === 0}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
