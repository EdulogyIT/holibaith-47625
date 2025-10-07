import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Award,
  Search,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AdminSuperhosts() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'host')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHosts(data || []);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hosts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuperhostToggle = async (userId: string, currentStatus: boolean, userName: string) => {
    try {
      const newStatus = !currentStatus;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_superhost: newStatus })
        .eq('id', userId);

      if (updateError) throw updateError;

      if (newStatus) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title: 'Congratulations! You are now a Superhost',
            message: `You've been awarded Superhost status! This badge recognizes your commitment to providing exceptional hospitality and service.`,
            type: 'superhost_promotion',
            related_id: userId
          });

        if (notificationError) throw notificationError;
      }

      toast({
        title: 'Success',
        description: `${userName} ${newStatus ? 'is now' : 'is no longer'} a Superhost`,
      });
      
      fetchHosts();
    } catch (error) {
      console.error('Error updating superhost status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update superhost status',
        variant: 'destructive',
      });
    }
  };

  const filteredHosts = hosts.filter(host => 
    host.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHosts = hosts.length;
  const superhostCount = hosts.filter(h => h.is_superhost).length;
  const superhostPercentage = totalHosts > 0 ? ((superhostCount / totalHosts) * 100).toFixed(0) : 0;
  const averageRating = totalHosts > 0 
    ? (hosts.reduce((sum, h) => sum + (h.average_rating || 0), 0) / totalHosts).toFixed(2)
    : '0.00';

  if (loading && isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading hosts...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Superhost Management</h2>
          <p className="text-sm text-muted-foreground">Manage superhost status for property hosts</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Total Hosts</p>
                <Users className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{totalHosts}</p>
              <p className="text-xs text-muted-foreground mt-1">Active property hosts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Superhosts</p>
                <Award className="h-3 w-3 text-primary" />
              </div>
              <p className="text-2xl font-bold">{superhostCount}</p>
              <p className="text-xs text-muted-foreground mt-1">{superhostPercentage}% of total hosts</p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Average Rating</p>
                <Star className="h-3 w-3 text-primary" />
              </div>
              <p className="text-2xl font-bold">{averageRating}</p>
              <p className="text-xs text-muted-foreground mt-1">Across all hosts</p>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hosts by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Hosts ({filteredHosts.length})</h3>
          {filteredHosts.map((host) => (
            <Card key={host.id}>
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="text-sm">
                      {host.name?.slice(0, 2).toUpperCase() || host.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm line-clamp-1">{host.name || 'No name'}</p>
                          {host.is_superhost && <Award className="h-3 w-3 text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{host.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        {host.average_rating?.toFixed(2) || '0.00'}
                      </div>
                      <span>{host.total_reviews || 0} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {host.is_superhost ? (
                        <>
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            Superhost
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSuperhostToggle(host.id, host.is_superhost, host.name)}
                            className="text-xs h-7"
                          >
                            Remove Superhost
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary" className="text-xs">
                            Host
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => handleSuperhostToggle(host.id, host.is_superhost, host.name)}
                            className="text-xs h-7"
                          >
                            Make Superhost
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Superhost Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage superhost status for property hosts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{loading ? '...' : totalHosts}</div>
            <p className="text-xs text-muted-foreground">Active property hosts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Superhosts</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{loading ? '...' : superhostCount}</div>
            <p className="text-xs text-muted-foreground">{superhostPercentage}% of total hosts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{loading ? '...' : averageRating}</div>
            <p className="text-xs text-muted-foreground">Across all hosts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search hosts by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hosts ({filteredHosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading hosts...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Host</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHosts.map((host) => (
                  <TableRow key={host.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {host.name?.slice(0, 2).toUpperCase() || host.email?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{host.name || 'No name'}</span>
                          {host.is_superhost && <Award className="h-4 w-4 text-primary" />}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{host.email}</span>
                    </TableCell>
                    <TableCell>
                      {host.is_superhost ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Superhost
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Host
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm">{host.average_rating?.toFixed(2) || '0.00'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{host.total_reviews || 0}</span>
                    </TableCell>
                    <TableCell>
                      {host.is_superhost ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSuperhostToggle(host.id, host.is_superhost, host.name)}
                        >
                          Remove Superhost
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleSuperhostToggle(host.id, host.is_superhost, host.name)}
                        >
                          Make Superhost
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
