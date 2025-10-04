import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_email?: string;
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  user_email?: string;
  recipient_id?: string;
  recipient_email?: string;
  subject?: string;
  conversation_type?: string;
  status: string;
  created_at: string;
}

export default function AdminMessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchConversation();
    fetchMessages();
    getCurrentUser();
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchConversation = async () => {
    try {
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (convError) throw convError;

      // Fetch user email separately
      let userEmail = '';
      let recipientEmail = '';

      if (convData.user_id) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', convData.user_id)
          .maybeSingle();
        userEmail = userData?.email || '';
      }

      if ((convData as any).recipient_id) {
        const { data: recipientData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', (convData as any).recipient_id)
          .maybeSingle();
        recipientEmail = recipientData?.email || '';
      }

      setConversation({
        ...convData,
        user_email: userEmail,
        recipient_email: recipientEmail,
      } as Conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation',
        variant: 'destructive',
      });
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender emails for all unique sender IDs
      const senderIds = [...new Set(messagesData?.map(m => m.sender_id) || [])];
      const senderEmailMap: Record<string, string> = {};

      for (const senderId of senderIds) {
        const { data: senderData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', senderId)
          .single();
        if (senderData) {
          senderEmailMap[senderId] = senderData.email;
        }
      }

      setMessages((messagesData || []).map(msg => ({
        ...msg,
        sender_email: senderEmailMap[msg.sender_id] || 'Unknown',
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          sender_id: currentUserId,
          content: newMessage.trim(),
          message_type: 'text',
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading && !conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", isMobile ? "pb-6" : "")}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          onClick={() => navigate('/admin/messages')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
            {conversation?.subject || 'Conversation'}
          </h2>
          <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
            {conversation?.user_email} {conversation?.recipient_email && `↔ ${conversation.recipient_email}`}
          </p>
        </div>
        <Badge>{conversation?.status}</Badge>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader className={cn(isMobile && "p-4")}>
          <CardTitle className={cn(isMobile && "text-lg")}>Messages</CardTitle>
        </CardHeader>
        <CardContent className={cn(isMobile && "p-4")}>
          <div className={cn("space-y-4 mb-4", isMobile ? "max-h-[50vh]" : "max-h-[60vh]", "overflow-y-auto")}>
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className={cn(isMobile ? "h-6 w-6" : "h-8 w-8")}>
                    <AvatarFallback className={cn(isMobile && "text-xs")}>
                      {message.sender_email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("flex-1 max-w-[70%]", isCurrentUser && "text-right")}>
                    <p className={cn("text-muted-foreground mb-1", isMobile ? "text-[10px]" : "text-xs")}>
                      {message.sender_email}
                    </p>
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        isMobile ? "text-sm p-2" : "",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                    <p className={cn("text-muted-foreground mt-1", isMobile ? "text-[10px]" : "text-xs")}>
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <div className="space-y-2 pt-4 border-t border-border">
            <Textarea
              placeholder="Type your reply..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={cn(isMobile ? "min-h-[80px] text-sm" : "min-h-[100px]")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="w-full"
              size={isMobile ? "sm" : "default"}
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
