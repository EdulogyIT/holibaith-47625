import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  author_name: string;
  content: string;
  image_url?: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .select('*')
        .eq('id', id)
        .single() as any;

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('blog_posts' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
        <Button onClick={() => navigate('/admin/blogs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", isMobile ? "pb-6" : "pb-8")}>
      {/* Header */}
      <div className={cn("flex items-center justify-between", isMobile && "flex-col gap-3 items-start")}>
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/blogs')}
          className={cn(isMobile && "px-2")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>
        <div className={cn("flex gap-2", isMobile && "w-full")}>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/blogs/edit/${post.id}`)}
            className={cn(isMobile && "flex-1")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className={cn(isMobile && "flex-1")}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getStatusColor(post.status)}>
                {post.status}
              </Badge>
              <Badge variant="outline">{post.category}</Badge>
            </div>
            <CardTitle className={cn("font-playfair", isMobile ? "text-xl" : "text-3xl")}>
              {post.title}
            </CardTitle>
            <div className={cn("flex flex-wrap gap-4 text-muted-foreground", isMobile && "text-sm")}>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author_name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created: {new Date(post.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Updated: {new Date(post.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {post.image_url && (
            <div className={cn("overflow-hidden rounded-lg", isMobile ? "h-48" : "h-96")}>
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={cn("prose prose-slate max-w-none", isMobile && "prose-sm")}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this blog post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
