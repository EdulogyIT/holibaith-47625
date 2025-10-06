-- Update blog post image URLs to use public folder paths
UPDATE blog_posts 
SET image_url = REPLACE(image_url, '/src/assets/', '/')
WHERE image_url LIKE '/src/assets/%';