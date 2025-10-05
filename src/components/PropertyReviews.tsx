import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Camera, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

interface PropertyReviewsProps {
  propertyId: string;
  canLeaveReview?: boolean;
}

export const PropertyReviews = ({ propertyId, canLeaveReview = false }: PropertyReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user profiles for each review
      if (data && data.length > 0) {
        const userIds = data.map(r => r.user_id);
        const profilesQuery = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', userIds);

        const profiles = profilesQuery.data;
        
        if (!profilesQuery.error && profiles) {
          // Merge profiles with reviews
          const reviewsWithProfiles = data.map(review => ({
            ...review,
            profiles: profiles.find((p: any) => p.id === review.user_id)
          }));
          
          setReviews(reviewsWithProfiles as any);
        } else {
          setReviews(data as any);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !newReview.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          rating,
          comment: newReview.trim(),
        });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setNewReview('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4">
      {/* Reviews Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="text-lg font-bold">{averageRating}</span>
        </div>
        <span className="text-muted-foreground">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Write Review Form - Only if user can leave review */}
      {canLeaveReview && user && (
        <Card className="border-accent/20">
          <CardHeader className="p-4">
            <CardTitle className="text-base">Leave a review</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Your rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= rating
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <Textarea
              placeholder="Share your experience with this property..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              className="resize-none"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={handleSubmitReview}
                disabled={submitting || !newReview.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-24 bg-muted rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="border-accent/20">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} className="border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary text-white">
                      {review.profiles?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">
                        {review.profiles?.name || 'Anonymous'}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviews.length > 3 && (
        <Button variant="outline" className="w-full">
          Show all {reviews.length} reviews
        </Button>
      )}
    </div>
  );
};
