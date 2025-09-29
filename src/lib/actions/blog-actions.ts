'use server';

import { type Blog, type BlogFormData, type BlogInsert, type BlogUpdate } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';
import { isAdmin, withAdminRole } from '@/lib/utils/rbac';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Input validation schemas
const blogFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().max(300, 'Subtitle must be less than 300 characters').optional().nullable(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  author: z.string().min(1, 'Author is required').max(100, 'Author must be less than 100 characters'),
  image: z.string().url('Invalid image URL').optional().nullable(),
});

const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be less than 100 characters'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

const aiBlogGenerationSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  author: z.string().min(1, 'Author is required').max(100, 'Author must be less than 100 characters'),
});

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

  // Validate input data
  const validationResult = blogFormSchema.safeParse(formData);
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }

  const validatedData = validationResult.data;

  // Generate slug from title (the database trigger will handle uniqueness)
  const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', { title: validatedData.title });

  if (slugError) {
    throw new Error('Failed to generate slug');
  }

  const blogData: BlogInsert = {
    title: validatedData.title,
    slug: slugData,
    subtitle: validatedData.subtitle || null,
    image: validatedData.image || null,
    content: validatedData.content,
    author: validatedData.author,
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

  // Validate blog ID
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid blog ID');
  }

  // Validate input data
  const validationResult = blogFormSchema.safeParse(formData);
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }

  const validatedData = validationResult.data;

  const blogData: BlogUpdate = {
    title: validatedData.title,
    subtitle: validatedData.subtitle || null,
    image: validatedData.image || null,
    content: validatedData.content,
    author: validatedData.author,
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

  // Validate search parameters
  const validationResult = searchQuerySchema.safeParse({ query, page, limit });
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }

  const { query: validatedQuery, page: validatedPage, limit: validatedLimit } = validationResult.data;

  // Sanitize query to prevent injection - escape special characters
  const sanitizedQuery = validatedQuery.replace(/[%_]/g, '\\$&');

  const from = (validatedPage - 1) * validatedLimit;
  const to = from + validatedLimit - 1;

  const {
    data: blogs,
    error,
    count,
  } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .or(`title.ilike.%${sanitizedQuery}%, content.ilike.%${sanitizedQuery}%, author.ilike.%${sanitizedQuery}%`)
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

// AI Blog Generation Schema
const blogGenerationSchema = z.object({
  title: z.string().min(3).max(200).describe('The title of the blog post'),
  subtitle: z.string().max(300).optional().describe('An optional subtitle or tagline for the blog post'),
  content: z
    .string()
    .min(100)
    .describe('The main content of the blog post in HTML format with proper headings, paragraphs, and formatting'),
});

// Interface for AI blog generation input
export interface AIBlogGenerationData {
  description: string;
  author: string;
}

// Generate blog content using Google AI
export async function generateBlogWithAI(data: AIBlogGenerationData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Validate input data
  const validationResult = aiBlogGenerationSchema.safeParse(data);
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }

  const { description, author } = validationResult.data;

  try {
    // Generate blog content using Google AI
    const { object: generatedBlog } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: blogGenerationSchema,
      prompt: `Create a high-quality, engaging blog post based on the following description: "${description}"
      
      Requirements:
      - Write in a professional yet accessible tone
      - Include proper HTML formatting with headings (h2, h3), paragraphs, lists, and emphasis where appropriate
      - Make it informative and engaging for readers
      - Include practical insights or actionable advice where relevant
      - Ensure the content is well-structured with clear sections
      - The content should be substantial (at least 800-1200 words)
      - Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, etc.
      - Do not include any image tags or references to images in the content
      
      Generate a compelling title and optional subtitle along with the full content.`,
    });

    // Prepare blog data for insertion
    const { data: slugData, error: slugError } = await supabase.rpc('generate_slug', {
      title: generatedBlog.title,
    });

    if (slugError) {
      throw new Error('Failed to generate slug');
    }

    const blogData: BlogInsert = {
      title: generatedBlog.title,
      slug: slugData,
      subtitle: generatedBlog.subtitle || null,
      content: generatedBlog.content,
      author: author,
      user_id: user.id,
      image: null, // No image for AI-generated blogs initially
    };

    // Insert the blog into the database
    const { data: blog, error } = await supabase.from('blogs').insert(blogData).select().single();

    if (error) {
      throw new Error('Failed to save AI-generated blog');
    }

    // Revalidate and redirect to edit page
    revalidatePath('/dashboard/blogs');
    redirect(`/dashboard/blogs/${blog.slug}/edit?success=ai_blog_generated`);
  } catch (error) {
    // Handle redirect errors - these are expected and should be re-thrown
    if (error instanceof Error && (error.message.includes('NEXT_REDIRECT') || error.message.includes('redirect'))) {
      throw error; // Re-throw redirect errors without logging
    }

    // Log and handle actual errors
    console.error('AI blog generation error:', error);
    throw new Error('Failed to generate blog content. Please try again with a different description.');
  }
}

// Admin-specific functions for managing all blogs

// Get all blogs for admin (no user restriction)
export const getAllBlogsForAdmin = withAdminRole(async (page = 1, limit = 10) => {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: blogs,
    error,
    count,
  } = await supabase
    .from('blogs')
    .select('*, profiles(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error('Failed to fetch blogs for admin');
  }

  return {
    blogs: blogs as (Blog & { profiles: { full_name: string | null; email: string } | null })[],
    totalCount: count || 0,
    hasMore: count ? count > to + 1 : false,
  };
});

// Get any blog by ID for admin (no user restriction)
export const getBlogByIdForAdmin = withAdminRole(async (id: string): Promise<Blog | null> => {
  const supabase = await createClient();

  const { data: blog, error } = await supabase.from('blogs').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Blog not found
    }
    throw new Error('Failed to fetch blog');
  }

  return blog as Blog;
});

// Update any blog as admin (no user restriction)
export const updateBlogAsAdmin = withAdminRole(async (id: string, formData: BlogFormData) => {
  const supabase = await createClient();

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

  const { data: blog, error } = await supabase.from('blogs').update(blogData).eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Blog not found');
    }
    throw new Error(`Failed to update blog: ${error.message}`);
  }

  revalidatePath('/admin/blogs');
  revalidatePath('/dashboard/blogs');
  revalidatePath(`/blogs/${blog.slug}`);
  redirect(`/admin/blogs?success=blog_updated`);
});

// Delete any blog as admin (no user restriction)
export const deleteBlogAsAdmin = withAdminRole(async (id: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from('blogs').delete().eq('id', id);

  if (error) {
    throw new Error('Failed to delete blog');
  }

  revalidatePath('/admin/blogs');
  revalidatePath('/dashboard/blogs');
  return { success: true };
});

// Enhanced getBlogById that works for both users and admins
export async function getBlogByIdEnhanced(id: string): Promise<Blog | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Check if user is admin
  const adminAccess = await isAdmin();

  let query = supabase.from('blogs').select('*').eq('id', id);

  // If not admin, restrict to user's own blogs
  if (!adminAccess) {
    query = query.eq('user_id', user.id);
  }

  const { data: blog, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Blog not found or user doesn't own it
    }
    throw new Error('Failed to fetch blog');
  }

  return blog as Blog;
}

// Enhanced deleteBlog that works for both users and admins
export async function deleteBlogEnhanced(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Check if user is admin
  const adminAccess = await isAdmin();

  let query = supabase.from('blogs').delete().eq('id', id);

  // If not admin, restrict to user's own blogs
  if (!adminAccess) {
    query = query.eq('user_id', user.id);
  }

  const { error } = await query;

  if (error) {
    throw new Error('Failed to delete blog');
  }

  revalidatePath('/dashboard/blogs');
  if (adminAccess) {
    revalidatePath('/admin/blogs');
  }

  return { success: true };
}
