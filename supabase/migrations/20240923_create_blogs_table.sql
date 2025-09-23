-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  image TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- Create index on user_id for filtering user's blogs
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON public.blogs(user_id);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at when row is modified
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    )
  );
END;
$$ language 'plpgsql';

-- Function to ensure unique slug
CREATE OR REPLACE FUNCTION public.ensure_unique_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base slug from title
  base_slug := public.generate_slug(NEW.title);
  final_slug := base_slug;
  
  -- Check if slug exists and increment counter if needed
  WHILE EXISTS (
    SELECT 1 FROM public.blogs 
    WHERE slug = final_slug 
    AND (NEW.id IS NULL OR id != NEW.id)
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically generate slug before insert/update
CREATE TRIGGER ensure_unique_slug_trigger
  BEFORE INSERT OR UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_unique_slug();

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all published blogs
CREATE POLICY "Anyone can view blogs" ON public.blogs
  FOR SELECT USING (true);

-- Policy: Users can insert their own blogs
CREATE POLICY "Users can insert their own blogs" ON public.blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own blogs
CREATE POLICY "Users can update their own blogs" ON public.blogs
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own blogs
CREATE POLICY "Users can delete their own blogs" ON public.blogs
  FOR DELETE USING (auth.uid() = user_id);

