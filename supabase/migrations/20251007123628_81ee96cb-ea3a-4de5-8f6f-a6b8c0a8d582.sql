-- Add is_featured column to properties table
ALTER TABLE public.properties 
ADD COLUMN is_featured boolean DEFAULT false;

-- Add last_read_at to conversations for tracking message reads
ALTER TABLE public.conversations 
ADD COLUMN last_read_at timestamp with time zone DEFAULT NULL;

-- Create index for featured properties
CREATE INDEX idx_properties_featured ON public.properties(is_featured) WHERE is_featured = true;