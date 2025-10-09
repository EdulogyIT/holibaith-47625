-- Add translation columns to blog_posts table for multilingual support

-- Add title translations
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_ar TEXT;

-- Add content translations  
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS content_fr TEXT,
ADD COLUMN IF NOT EXISTS content_en TEXT,
ADD COLUMN IF NOT EXISTS content_ar TEXT;

-- Add author name translations (optional, if authors have localized names)
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS author_name_fr TEXT,
ADD COLUMN IF NOT EXISTS author_name_en TEXT,
ADD COLUMN IF NOT EXISTS author_name_ar TEXT;

-- Add category translations
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS category_fr TEXT,
ADD COLUMN IF NOT EXISTS category_en TEXT,
ADD COLUMN IF NOT EXISTS category_ar TEXT;

-- Update existing blog posts to copy current data to all language columns
-- This ensures backward compatibility with existing content
UPDATE public.blog_posts 
SET 
  title_fr = title,
  title_en = title,
  title_ar = title,
  content_fr = content,
  content_en = content,
  content_ar = content,
  author_name_fr = author_name,
  author_name_en = author_name,
  author_name_ar = author_name,
  category_fr = category,
  category_en = category,
  category_ar = category
WHERE title_fr IS NULL;

-- Add helpful comment
COMMENT ON COLUMN public.blog_posts.title_fr IS 'French translation of blog post title';
COMMENT ON COLUMN public.blog_posts.title_en IS 'English translation of blog post title';
COMMENT ON COLUMN public.blog_posts.title_ar IS 'Arabic translation of blog post title';
COMMENT ON COLUMN public.blog_posts.content_fr IS 'French translation of blog post content';
COMMENT ON COLUMN public.blog_posts.content_en IS 'English translation of blog post content';
COMMENT ON COLUMN public.blog_posts.content_ar IS 'Arabic translation of blog post content';