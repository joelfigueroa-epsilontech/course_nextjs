import { Profile, UserRole } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';

/**
 * Gets the current user's profile including their role
 * @returns Promise with profile data or null if not found
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (profileError || !profile) {
    return null;
  }

  return profile;
}

/**
 * Checks if the current user has the specified role
 * @param requiredRole - The role to check for
 * @returns Promise<boolean> - true if user has the required role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === requiredRole;
}

/**
 * Checks if the current user is an admin
 * @returns Promise<boolean> - true if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Checks if the current user is a regular user
 * @returns Promise<boolean> - true if user is a regular user
 */
export async function isUser(): Promise<boolean> {
  return hasRole('user');
}

/**
 * Gets the current user's role
 * @returns Promise<UserRole | null> - the user's role or null if not found
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const profile = await getCurrentUserProfile();
  return profile?.role || null;
}

/**
 * Throws an error if the current user doesn't have the required role
 * Used for server actions and API routes that require specific roles
 * @param requiredRole - The role to check for
 * @throws Error if user doesn't have the required role
 */
export async function requireRole(requiredRole: UserRole): Promise<void> {
  const userHasRole = await hasRole(requiredRole);

  if (!userHasRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }
}

/**
 * Throws an error if the current user is not an admin
 * Used for server actions and API routes that require admin access
 * @throws Error if user is not an admin
 */
export async function requireAdmin(): Promise<void> {
  await requireRole('admin');
}

/**
 * Higher-order function that wraps server actions with role checking
 * @param requiredRole - The role required to execute the action
 * @param action - The server action to wrap
 * @returns Wrapped server action that checks roles before execution
 */
export function withRole<T extends unknown[], R>(requiredRole: UserRole, action: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    await requireRole(requiredRole);
    return action(...args);
  };
}

/**
 * Higher-order function that wraps server actions with admin checking
 * @param action - The server action to wrap
 * @returns Wrapped server action that checks for admin role before execution
 */
export function withAdminRole<T extends unknown[], R>(action: (...args: T) => Promise<R>) {
  return withRole('admin', action);
}
