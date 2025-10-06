-- Update blog_posts RLS policy for admins to use has_role function
DROP POLICY IF EXISTS "Admins can update any blog post" ON blog_posts;

CREATE POLICY "Admins can update any blog post"
ON blog_posts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));