import { useEffect, useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, Search, Eye, MoreVertical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Conversation {
  id: string;
  user_id: string;
  recipient_id?: string | null;
  property_id?: string | null;
  subject?: string | null;
  status: string;
  conversation_type?: string;
  created_at: string;
  admin_id?: string | null;
  user_email?: string;
  recipient_email?: string;
  message_count?: number;
}

export default function AdminMessages() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false }) as any;

      if (convError) throw convError;

      // Fetch user emails and message counts
      const conversationsWithDetails = await Promise.all(
        ((convData || []) as any[]).map(async (conv) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', conv.user_id)
            .single();

          const { data: recipientData } = conv.recipient_id
            ? await supabase
                .from('profiles')
                .select('email')
                .eq('id', conv.recipient_id)
                .single()
            : { data: null };

          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          return {
            ...conv,
            user_email: userData?.email,
            recipient_email: recipientData?.email,
            message_count: count || 0,
          } as Conversation;
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // Mobile Loading
  if (loading && isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-sm text-muted-foreground">All user conversations</p>
        </div>

        {/* Stats - Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-4 w-4 text-muted-foreground mb-1" />
                <p className="text-xl font-bold">{conversations.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-4 w-4 text-green-600 mb-1" />
                <p className="text-xl font-bold">{conversations.filter(c => c.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-4 w-4 text-blue-600 mb-1" />
                <p className="text-xl font-bold">{conversations.reduce((sum, c) => sum + (c.message_count || 0), 0)}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.map((conv) => (
            <Card key={conv.id}>
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {conv.user_email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{conv.user_email || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{conv.subject || 'No subject'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{conv.conversation_type || 'support'}</Badge>
                          <Badge className={`${getStatusColor(conv.status)} text-xs`}>
                            {conv.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{conv.message_count} msgs</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

  // Desktop Layout
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages & Conversations</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all user conversations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{loading ? '...' : conversations.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">
              {loading ? '...' : conversations.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Ongoing conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">
              {loading ? '...' : conversations.reduce((sum, c) => sum + (c.message_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">All conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by user email or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations ({filteredConversations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading conversations...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {conv.user_email?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{conv.user_email || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{conv.recipient_email || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{conv.subject || 'No subject'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{conv.conversation_type || 'support'}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{conv.message_count}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(conv.status)}>
                        {conv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(conv.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
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
