-- Migration: Create blog images storage bucket
-- Purpose: Set up a public storage bucket for blog post images with appropriate RLS policies
-- Created: 2025-09-23
-- Affected: storage.buckets, storage.objects tables
-- Dependencies: storage schema (already available in Supabase)

-- Create a public bucket for blog images
-- Public buckets allow direct access to files without authentication
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',                    -- bucket id
  'blog-images',                    -- bucket name
  true,                            -- public bucket (files accessible via direct URL)
  5242880,                         -- 5MB file size limit
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']  -- allowed image types
);

-- Note: Row Level Security is already enabled on storage.objects by Supabase

-- RLS Policy: Allow anonymous users to view/download blog images
-- This policy allows anyone to SELECT (view/download) images from the blog-images bucket
create policy "Public blog images are viewable by everyone"
on storage.objects for select
to anon
using (bucket_id = 'blog-images');

-- RLS Policy: Allow authenticated users to view/download blog images
-- This policy allows authenticated users to SELECT (view/download) images from the blog-images bucket
create policy "Blog images are viewable by authenticated users"
on storage.objects for select
to authenticated
using (bucket_id = 'blog-images');

-- RLS Policy: Allow authenticated users to upload blog images
-- This policy allows authenticated users to INSERT (upload) images to the blog-images bucket
-- Only authenticated users can upload to ensure some level of control
create policy "Authenticated users can upload blog images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-images');

-- RLS Policy: Allow authenticated users to update their uploaded blog images
-- This policy allows authenticated users to UPDATE their own uploaded images
-- Users can only update images they uploaded (auth.uid() = owner)
create policy "Users can update their own blog images"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-images' and auth.uid() = owner)
with check (bucket_id = 'blog-images' and auth.uid() = owner);

-- RLS Policy: Allow authenticated users to delete their uploaded blog images
-- This policy allows authenticated users to DELETE their own uploaded images
-- Users can only delete images they uploaded (auth.uid() = owner)
create policy "Users can delete their own blog images"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-images' and auth.uid() = owner);

-- Migration completed: blog-images bucket created with appropriate RLS policies
