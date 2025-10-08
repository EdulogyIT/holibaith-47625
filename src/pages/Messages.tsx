import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface Conversation {
  id: string;
  subject: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  admin_id: string | null;
  last_read_at: string | null;
  messages?: any[];
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  message_type: string;
}

const Messages = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            id,
            sender_id,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Filter and deduplicate conversations
      const conversationsMap = new Map();
      
      for (const conv of (data || [])) {
        // Skip self-conversations
        if (conv.user_id === conv.admin_id || conv.user_id === conv.recipient_id) {
          continue;
        }
        
        // Only show conversations that have messages
        if (!conv.messages || conv.messages.length === 0) {
          continue;
        }
        
        const subject = conv.subject || 'Support Request';
        
        // Deduplicate: keep only the most recent conversation per subject
        if (!conversationsMap.has(subject)) {
          conversationsMap.set(subject, conv);
        } else {
          const existing = conversationsMap.get(subject);
          // Replace if current conversation is more recent
          if (new Date(conv.updated_at) > new Date(existing.updated_at)) {
            conversationsMap.set(subject, conv);
          }
        }
      }
      
      const filteredConversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      
      setConversations(filteredConversations);
      
      // Calculate unread count correctly
      let unreadTotal = 0;
      for (const conv of filteredConversations) {
        const lastReadAt = conv.last_read_at ? new Date(conv.last_read_at) : new Date(0);
        
        // Check if there's any message from someone else that's newer than last_read_at
        const hasUnreadMessages = conv.messages.some((msg: any) => {
          const isFromOther = msg.sender_id !== user.id;
          const isAfterLastRead = new Date(msg.created_at) > lastReadAt;
          return isFromOther && isAfterLastRead;
        });
        
        if (hasUnreadMessages) {
          unreadTotal++;
        }
      }
      
      setUnreadCount(unreadTotal);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;
    
    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content: newMessage.trim()
        });

      if (error) throw error;
      
      setNewMessage("");
      await fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Start new conversation or select existing one
  const startNewConversation = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    try {
      // Check if user already has an active conversation
      const { data: existingConversations, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      // If conversation exists, select it
      if (existingConversations && existingConversations.length > 0) {
        setSelectedConversation(existingConversations[0].id);
        toast({
          title: "Chat Opened",
          description: "Continue your conversation with our support team"
        });
        return;
      }

      // Otherwise create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          subject: "Property Inquiry"
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchConversations();
      setSelectedConversation(data.id);
      
      toast({
        title: "Success",
        description: "New conversation started with our support team"
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
      
      // Auto-open or create conversation if coming from "Start Chat"
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('start') === 'true') {
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Start or open existing conversation
        setTimeout(() => {
          startNewConversation();
        }, 500);
      }
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      // Mark conversation as read
      markConversationAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await supabase
        .from('conversations')
        .update({ last_read_at: new Date().toISOString() })
        .eq('id', conversationId)
        .eq('user_id', user?.id);
      
      // Refresh conversations to update unread count
      fetchConversations();
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <main className="pt-16 pb-20">
          <div className="px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                <p className="text-muted-foreground mb-4">
                  Sign in to view your messages
                </p>
                <Button onClick={() => window.location.href = '/login'}>
                  Log In
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <main className="pt-16 pb-20">
          <div className="px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      <main className="pt-16 pb-20">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>

          {/* WhatsApp-style UI */}
          {selectedConversation ? (
            <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                >
                  ←
                </Button>
                <div className="flex-1">
                  <div className="font-semibold">
                    {conversations.find(c => c.id === selectedConversation)?.subject || 'Support Team'}
                  </div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-[#e5ddd5]" style={{ height: 'calc(100% - 130px)' }}>
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                            message.sender_id === user?.id
                              ? 'bg-[#dcf8c6]'
                              : 'bg-white'
                          }`}
                        >
                          {message.sender_id !== user?.id && (
                            <div className="text-xs font-medium text-primary mb-1">
                              Support Team
                            </div>
                          )}
                          <div className="text-sm break-words">{message.content}</div>
                          <div className="text-xs text-muted-foreground mt-1 text-right">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 border-t bg-gray-50">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={sendingMessage}
                    className="rounded-full"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={sendingMessage || !newMessage.trim()}
                    size="icon"
                    className="rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No conversations</h2>
                    <p className="text-muted-foreground mb-4">
                      Start a conversation with our support team
                    </p>
                    <Button onClick={startNewConversation}>
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Chats</h2>
                  </div>
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border cursor-pointer hover:bg-gray-50 transition-colors relative"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative">
                        <MessageCircle className="h-6 w-6 text-primary" />
                        {(() => {
                          const lastReadAt = conversation.last_read_at ? new Date(conversation.last_read_at) : new Date(0);
                          // Check if there are messages after last read time from someone else
                          const hasUnread = conversation.messages?.some((msg: any) => {
                            const isFromOther = msg.sender_id !== user?.id;
                            const isAfterLastRead = new Date(msg.created_at) > lastReadAt;
                            return isFromOther && isAfterLastRead;
                          });
                          return hasUnread && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></div>
                          );
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {conversation.subject || 'Support Request'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tap to open chat
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(conversation.updated_at), 'MMM dd')}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default Messages;