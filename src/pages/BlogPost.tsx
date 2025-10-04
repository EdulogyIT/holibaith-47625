import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileFooter from "@/components/MobileFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowLeft, Facebook, Twitter, Share2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import blog images
import blogRealEstateFuture from "@/assets/blog-real-estate-future.jpg";
import blogPropertyLocation from "@/assets/blog-property-location.jpg";
import blogShortStayRental from "@/assets/blog-short-stay-rental.jpg";
import blogPropertyValuation from "@/assets/blog-property-valuation.jpg";
import blogRenovationTips from "@/assets/blog-renovation-tips.jpg";
import blogLegalConsiderations from "@/assets/blog-legal-considerations.jpg";

const BlogPost = () => {
  const { t, currentLang } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useScrollToTop();

  useEffect(() => {
    if (id) {
      fetchBlogPost();
      fetchComments();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('blog_comments' as any)
        .select('*')
        .eq('blog_post_id', id)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20")}>
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="font-inter mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToBlog')}
          </Button>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img 
              src={post.image_url || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                5 min read
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-playfair">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 font-inter line-clamp-3">
              {post.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground font-inter border-b border-border pb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="mr-4">{post.author_name}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-xs">
                By {post.author_name}
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none font-inter"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4 font-playfair">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-inter">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className={cn("font-semibold mb-4 font-playfair", isMobile ? "text-base" : "text-lg")}>
              {t("shareThisArticle") || "Share this article"}
            </h3>
            <div className={cn("flex gap-3", isMobile && "flex-wrap")}>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                }}
                className="gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => {
                  const url = window.location.href;
                  const text = post.title;
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="gap-2"
              >
                <Twitter className="h-4 w-4" />
                X (Twitter)
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => {
                  const url = window.location.href;
                  const text = post.title;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                }}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    });
                  } catch (error) {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: t("success") || "Success",
                      description: t("linkCopied") || "Link copied to clipboard",
                    });
                  }
                }}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                {t("share") || "Share"}
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className={cn("font-semibold mb-6 font-playfair", isMobile ? "text-lg" : "text-xl")}>
              {t("comments") || "Comments"} ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <div className="mb-8">
              <Textarea
                placeholder={t("writeComment") || "Write your comment..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={cn(isMobile ? "min-h-[100px]" : "min-h-[120px]")}
              />
              <Button
                className={cn("mt-3", isMobile && "w-full")}
                onClick={async () => {
                  if (!comment.trim()) return;
                  
                  try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) {
                      toast({
                        title: t("error") || "Error",
                        description: t("loginToComment") || "Please login to comment",
                        variant: "destructive",
                      });
                      return;
                    }

                    const { error } = await supabase
                      .from('blog_comments' as any)
                      .insert({
                        blog_post_id: id,
                        user_id: user.id,
                        content: comment.trim(),
                      });

                    if (error) throw error;

                    toast({
                      title: t("success") || "Success",
                      description: t("commentAdded") || "Comment added successfully",
                    });
                    setComment("");
                    // Refresh comments
                    const { data } = await supabase
                      .from('blog_comments' as any)
                      .select('*')
                      .eq('blog_post_id', id)
                      .order('created_at', { ascending: false });
                    setComments(data || []);
                  } catch (error) {
                    console.error('Error adding comment:', error);
                    toast({
                      title: t("error") || "Error",
                      description: t("commentFailed") || "Failed to add comment",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!comment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {t("postComment") || "Post Comment"}
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className={cn(isMobile ? "h-8 w-8" : "h-10 w-10")}>
                    <AvatarFallback className={cn(isMobile && "text-xs")}>
                      {c.user_id?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className={cn("bg-muted rounded-lg p-3", isMobile && "p-2")}>
                      <p className={cn("text-sm font-medium mb-1", isMobile && "text-xs")}>
                        User {c.user_id?.slice(0, 8)}
                      </p>
                      <p className={cn("text-foreground", isMobile && "text-sm")}>
                        {c.content}
                      </p>
                    </div>
                    <div className={cn("flex items-center gap-4 mt-2", isMobile && "text-xs")}>
                      <span className="text-muted-foreground text-xs">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-auto p-0 text-xs", isMobile && "text-[10px]")}
                        onClick={() => setReplyTo(c.id)}
                      >
                        {t("reply") || "Reply"}
                      </Button>
                    </div>

                    {/* Reply Form */}
                    {replyTo === c.id && (
                      <div className="mt-3 ml-4">
                        <Textarea
                          placeholder={t("writeReply") || "Write your reply..."}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className={cn(isMobile ? "min-h-[80px]" : "min-h-[100px]")}
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (!replyText.trim()) return;
                              
                              try {
                                const { data: { user } } = await supabase.auth.getUser();
                                if (!user) {
                                  toast({
                                    title: t("error") || "Error",
                                    description: t("loginToComment") || "Please login to comment",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                const { error } = await supabase
                                  .from('blog_comments' as any)
                                  .insert({
                                    blog_post_id: id,
                                    user_id: user.id,
                                    content: replyText.trim(),
                                    parent_comment_id: c.id,
                                  });

                                if (error) throw error;

                                toast({
                                  title: t("success") || "Success",
                                  description: t("replyAdded") || "Reply added successfully",
                                });
                                setReplyText("");
                                setReplyTo(null);
                                // Refresh comments
                                const { data } = await supabase
                                  .from('blog_comments' as any)
                                  .select('*')
                                  .eq('blog_post_id', id)
                                  .order('created_at', { ascending: false });
                                setComments(data || []);
                              } catch (error) {
                                console.error('Error adding reply:', error);
                                toast({
                                  title: t("error") || "Error",
                                  description: t("replyFailed") || "Failed to add reply",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            {t("reply") || "Reply"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setReplyTo(null);
                              setReplyText("");
                            }}
                          >
                            {t("cancel") || "Cancel"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {t("noComments") || "No comments yet. Be the first to comment!"}
                </p>
              )}
            </div>
          </div>
        </article>
      </main>
      {isMobile ? (
        <div className="pb-6">
          <MobileFooter />
          <MobileBottomNav />
        </div>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default BlogPost;