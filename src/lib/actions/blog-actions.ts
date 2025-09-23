'use server';

import { type Blog, type BlogFormData, type BlogInsert, type BlogUpdate } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Get all blogs with pagination
export async function getBlogs(page = 1, limit = 10) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: blogs,
    error,
    count,
  } = await supabase.from('blogs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);

  if (error) {
    throw new Error('Failed to fetch blogs');
  }

  return {
    blogs: blogs as Blog[],
    totalCount: count || 0,
    hasMore: count ? count > to + 1 : false,
  };
}

// Get user's blogs with pagination
export async function getUserBlogs(page = 1, limit = 10) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: blogs,
    error,
    count,
  } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error('Failed to fetch user blogs');
  }

  return {
    blogs: blogs as Blog[],
    totalCount: count || 0,
    hasMore: count ? count > to + 1 : false,
  };
}

// Get a single blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient();

  const { data: blog, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Blog not found
    }
    throw new Error('Failed to fetch blog');
  }

  return blog as Blog;
}

// Get a single blog by ID (for editing - user must own it)
export async function getBlogById(id: string): Promise<Blog | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data: blog, error } = await supabase.from('blogs').select('*').eq('id', id).eq('user_id', user.id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Blog not found or user doesn't own it
    }
    throw new Error('Failed to fetch blog');
  }

  return blog as Blog;
}

// Get a single blog by slug (for editing - user must own it)
export async function getBlogBySlugForEdit(slug: string): Promise<Blog | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data: blog, error } = await supabase.from('blogs').select('*').eq('slug', slug).eq('user_id', user.id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Blog not found or user doesn't own it
    }
    throw new Error('Failed to fetch blog');
  }

  return blog as Blog;
}

// Create a new blog
export async function createBlog(formData: BlogFormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Validate required fields
  if (!formData.title || !formData.content || !formData.author) {
    throw new Error('Title, content, and author are required');
  }

  // Generate slug from title (the database trigger will handle uniqueness)
  const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', { title: formData.title });

  if (slugError) {
    throw new Error('Failed to generate slug');
  }

  const blogData: BlogInsert = {
    title: formData.title,
    slug: slugData,
    subtitle: formData.subtitle || null,
    image: formData.image || null,
    content: formData.content,
    author: formData.author,
    user_id: user.id,
  };

  const { data: blog, error } = await supabase.from('blogs').insert(blogData).select().single();

  if (error) {
    throw new Error('Failed to create blog');
  }

  revalidatePath('/dashboard/blogs');
  redirect(`/dashboard/blogs/${blog.slug}?success=blog_created`);
}

// Update an existing blog
export async function updateBlog(id: string, formData: BlogFormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Validate required fields
  if (!formData.title || !formData.content || !formData.author) {
    throw new Error('Title, content, and author are required');
  }

  const blogData: BlogUpdate = {
    title: formData.title,
    subtitle: formData.subtitle || null,
    image: formData.image || null,
    content: formData.content,
    author: formData.author,
  };

  const { data: blog, error } = await supabase.from('blogs').update(blogData).eq('id', id).eq('user_id', user.id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Blog not found or you do not have permission to edit it');
    }
    throw new Error(`Failed to update blog: ${error.message}`);
  }

  revalidatePath('/dashboard/blogs');
  revalidatePath(`/dashboard/blogs/${blog.slug}`);
  redirect(`/dashboard/blogs/${blog.slug}?success=blog_updated`);
}

// Delete a blog
export async function deleteBlog(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from('blogs').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    throw new Error('Failed to delete blog');
  }

  revalidatePath('/dashboard/blogs');
  return { success: true };
}

// Search blogs
export async function searchBlogs(query: string, page = 1, limit = 10) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: blogs,
    error,
    count,
  } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .or(`title.ilike.%${query}%, content.ilike.%${query}%, author.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error('Failed to search blogs');
  }

  return {
    blogs: blogs as Blog[],
    totalCount: count || 0,
    hasMore: count ? count > to + 1 : false,
  };
}
