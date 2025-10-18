-- Add spoken languages preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS spoken_languages JSONB DEFAULT '["Arabic"]'::jsonb;

-- Add index for better query performance on language searches
CREATE INDEX IF NOT EXISTS idx_profiles_spoken_languages 
ON public.profiles USING GIN (spoken_languages);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.spoken_languages IS 'Array of languages the host/user speaks. Used for host profiles and matching with guests.';