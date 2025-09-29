'use server';

import { type Profile, type ProfileUpdate, UserRole } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile, isAdmin, withAdminRole } from '@/lib/utils/rbac';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Input validation schemas
const profileUpdateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100, 'Full name must be less than 100 characters').optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
  role: z.enum(['user', 'admin']).optional(),
});

const searchProfileSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be less than 100 characters'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

// Get current user's profile
export async function getCurrentProfile(): Promise<Profile | null> {
  return getCurrentUserProfile();
}

// Update current user's profile (users can update their own profile but not role)
export async function updateProfile(profileData: Partial<ProfileUpdate>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Validate input data
  const validationResult = profileUpdateSchema.safeParse(profileData);
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
    throw new Error(`Validation failed: ${errors}`);
  }

  let validatedData = validationResult.data;

  // Remove role from profileData if user is not admin
  const adminAccess = await isAdmin();
  if (!adminAccess && validatedData.role) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...dataWithoutRole } = validatedData;
    validatedData = dataWithoutRole;
  }

  const { data: profile, error } = await supabase.from('profiles').update(validatedData).eq('id', user.id).select().single();

  if (error) {
    throw new Error('Failed to update profile');
  }

  revalidatePath('/dashboard/account');
  return profile as Profile;
}

// Admin-specific functions for managing all profiles

// Get all profiles for admin
export const getAllProfilesForAdmin = withAdminRole(async (page: number = 1, limit: number = 20) => {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data: profiles,
    error,
    count,
  } = await supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);

  if (error) {
    throw new Error('Failed to fetch profiles for admin');
  }

  return {
    profiles: profiles as Profile[],
    totalCount: count || 0,
    hasMore: count ? count > to + 1 : false,
  };
});

// Get any profile by ID for admin
export const getProfileByIdForAdmin = withAdminRole(async (id: string): Promise<Profile | null> => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Profile not found
    }
    throw new Error('Failed to fetch profile');
  }

  return profile as Profile;
});

// Update any profile as admin (including role changes)
export const updateProfileAsAdmin = withAdminRole(async (id: string, profileData: Partial<ProfileUpdate>) => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase.from('profiles').update(profileData).eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Profile not found');
    }
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  revalidatePath('/admin/users');
  return profile as Profile;
});

// Update user role as admin
export const updateUserRole = withAdminRole(async (userId: string, newRole: UserRole) => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('User not found');
    }
    throw new Error(`Failed to update user role: ${error.message}`);
  }

  revalidatePath('/admin/users');
  return profile as Profile;
});

// Delete profile as admin (this will also delete the auth.users record due to cascade)
export const deleteProfileAsAdmin = withAdminRole(async (id: string) => {
  const supabase = await createClient();

  // Get current user to prevent self-deletion
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !currentUser) {
    throw new Error('Current user not authenticated');
  }

  if (currentUser.id === id) {
    throw new Error('Cannot delete your own profile');
  }

  const { error } = await supabase.from('profiles').delete().eq('id', id);

  if (error) {
    throw new Error('Failed to delete profile');
  }

  revalidatePath('/admin/users');
  return { success: true };
});

// Get user statistics for admin dashboard
export const getUserStatistics = withAdminRole(async () => {
  const supabase = await createClient();

  // Get total user count
  const { count: totalUsers, error: totalError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  if (totalError) {
    throw new Error('Failed to get total user count');
  }

  // Get admin count
  const { count: adminUsers, error: adminError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');

  if (adminError) {
    throw new Error('Failed to get admin user count');
  }

  // Get regular user count
  const { count: regularUsers, error: regularError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user');

  if (regularError) {
    throw new Error('Failed to get regular user count');
  }

  // Get recent users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: recentUsers, error: recentError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (recentError) {
    throw new Error('Failed to get recent user count');
  }

  return {
    totalUsers: totalUsers || 0,
    adminUsers: adminUsers || 0,
    regularUsers: regularUsers || 0,
    recentUsers: recentUsers || 0,
  };
});

// Search profiles for admin
export const searchProfilesForAdmin = withAdminRole(async (query: string, page: number = 1, limit: number = 20) => {
  const supabase = await createClient();

  // Validate search parameters
  const validationResult = searchProfileSchema.safeParse({ query, page, limit });
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
    data: profiles,
    error,
    count,
  } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .or(`full_name.ilike.%${sanitizedQuery}%, email.ilike.%${sanitizedQuery}%`)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error('Failed to search profiles');
  }

  return {
    profiles: profiles as Profile[],
    totalCount: count || 0,
    hasMore: count ? count > to + 1 : false,
  };
});
