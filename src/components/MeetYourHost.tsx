import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Shield, MessageCircle, Award, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MeetYourHostProps {
  userId: string;
  onMessageHost?: () => void;
}

interface HostProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  is_superhost?: boolean;
  average_rating?: number;
  total_reviews?: number;
  created_at: string;
}

export const MeetYourHost = ({ userId, onMessageHost }: MeetYourHostProps) => {
  const [host, setHost] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setHost(data);
      } catch (error) {
        console.error('Error fetching host profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHostProfile();
    }
  }, [userId]);

  if (loading) {
    return <div className="animate-pulse h-64 bg-muted rounded-xl" />;
  }

  if (!host) {
    return null;
  }

  const yearsHosting = new Date().getFullYear() - new Date(host.created_at).getFullYear();
  const responseRate = 100; // Mock data
  const responseTime = 'within a few hours'; // Mock data

  return (
    <Card className="border-accent/20">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center gap-2">
          Meet your host
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Host Profile Card */}
        <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-accent/20">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={host.avatar_url} alt={host.name} />
              <AvatarFallback className="text-lg bg-primary text-white">
                {host.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {host.is_superhost && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{host.name}</h3>
              {host.is_superhost && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Award className="h-3 w-3 mr-1" />
                  Superhost
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              {host.average_rating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{host.average_rating.toFixed(2)}</span>
                  <span className="text-muted-foreground">
                    ({host.total_reviews} review{host.total_reviews !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Hosting for {yearsHosting} year{yearsHosting !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Superhost Info */}
        {host.is_superhost && (
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">{host.name} is a Superhost</h4>
                <p className="text-xs text-muted-foreground">
                  Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Host Details */}
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Host details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response rate:</span>
                <span className="font-medium">{responseRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Responds:</span>
                <span className="font-medium">{responseTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Button */}
        <Button 
          className="w-full" 
          variant="outline"
          onClick={onMessageHost}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message host
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          To protect your payment, always use Holibayt to send money and communicate with hosts.
        </p>
      </CardContent>
    </Card>
  );
};
