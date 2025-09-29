'use client';

import { sanitizeErrorMessage } from '@/lib/utils/notification-filters';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface NotificationOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useNotifications() {
  // Success notifications
  const success = useCallback((message: string, options?: NotificationOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }, []);

  // Error notifications with framework message filtering
  const error = useCallback((message: string, options?: NotificationOptions) => {
    // Extra aggressive check for redirect messages
    if (
      message &&
      (message.includes('NEXT_REDIRECT') ||
        message.includes('redirect') ||
        message.toLowerCase().includes('next_redirect') ||
        message === 'NEXT_REDIRECT')
    ) {
      console.log('Hook filtered redirect message:', message);
      return; // Don't show redirect errors at all
    }

    const sanitizedMessage = sanitizeErrorMessage(message);

    if (!sanitizedMessage) {
      // Message was filtered out as internal framework message
      return;
    }

    return toast.error(sanitizedMessage, {
      duration: options?.duration || 6000,
      action: options?.action,
    });
  }, []);

  // Info notifications
  const info = useCallback((message: string, options?: NotificationOptions) => {
    return toast.info(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }, []);

  // Warning notifications
  const warning = useCallback((message: string, options?: NotificationOptions) => {
    return toast.warning(message, {
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }, []);

  // Loading notifications
  const loading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  // Promise-based notifications for async operations
  const promise = useCallback(
    <T>(
      promise: Promise<T>,
      {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: unknown) => string);
      }
    ) => {
      return toast.promise(promise, {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      });
    },
    []
  );

  // Dismiss specific toast
  const dismiss = useCallback((toastId?: string | number) => {
    return toast.dismiss(toastId);
  }, []);

  // Auth-specific notifications
  const auth = {
    loginSuccess: () => success('Welcome back! You have been signed in successfully.'),
    loginError: (errorMessage?: string) => error(errorMessage || 'Failed to sign in. Please check your credentials.'),
    signupSuccess: () => success('Account created successfully! Please check your email for verification.'),
    signupError: (errorMessage?: string) => error(errorMessage || 'Failed to create account. Please try again.'),
    logoutSuccess: () => success('You have been signed out successfully.'),
    logoutError: (errorMessage?: string) => error(errorMessage || 'Failed to sign out. Please try again.'),
    passwordResetSent: () => success('Password reset email sent! Please check your inbox.'),
    passwordResetError: (errorMessage?: string) => error(errorMessage || 'Failed to send password reset email.'),
    passwordUpdateSuccess: () => success('Password updated successfully!'),
    passwordUpdateError: (errorMessage?: string) => error(errorMessage || 'Failed to update password.'),
    sessionExpired: () => warning('Your session has expired. Please sign in again.'),
    unauthorized: () => error('You are not authorized to perform this action.'),
  };

  // Blog-specific notifications with redirect filtering
  const blog = {
    createSuccess: () => success('Blog post created successfully!'),
    createError: (errorMessage?: string) => {
      if (errorMessage) {
        error(errorMessage);
      } else {
        error('Failed to create blog post.');
      }
    },
    aiGenerateSuccess: () => success('AI blog post generated successfully! You can now edit and customize it.'),
    updateSuccess: () => success('Blog post updated successfully!'),
    updateError: (errorMessage?: string) => {
      if (errorMessage) {
        error(errorMessage);
      } else {
        error('Failed to update blog post.');
      }
    },
    deleteSuccess: () => success('Blog post deleted successfully!'),
    deleteError: (errorMessage?: string) => {
      if (errorMessage) {
        error(errorMessage);
      } else {
        error('Failed to delete blog post.');
      }
    },
    publishSuccess: () => success('Blog post published successfully!'),
    unpublishSuccess: () => success('Blog post unpublished successfully!'),
    draftSaved: () => info('Draft saved automatically.'),
    validationError: (field: string) => error(`Please provide a valid ${field}.`),
    requiredFields: () => error('Please fill in all required fields.'),
  };

  // Form-specific notifications
  const form = {
    saveSuccess: () => success('Changes saved successfully!'),
    saveError: (errorMessage?: string) => error(errorMessage || 'Failed to save changes.'),
    validationError: (message: string) => error(message),
    requiredFields: () => error('Please fill in all required fields.'),
    invalidFormat: (field: string) => error(`Please enter a valid ${field}.`),
    confirmAction: (message: string) => info(message),
  };

  // Network-specific notifications
  const network = {
    offline: () => warning('You are currently offline. Some features may not work.'),
    online: () => success('Connection restored!'),
    slowConnection: () => info('Slow connection detected. Please be patient.'),
    connectionError: () => error('Connection error. Please check your internet connection.'),
    serverError: () => error('Server error. Please try again later.'),
    timeout: () => error('Request timeout. Please try again.'),
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    promise,
    dismiss,
    auth,
    blog,
    form,
    network,
  };
}

// Export individual notification types for direct usage with filtering
export const notify = {
  success: (message: string, options?: NotificationOptions) =>
    toast.success(message, { duration: options?.duration || 4000, action: options?.action }),
  error: (message: string, options?: NotificationOptions) => {
    // Extra aggressive check for redirect messages
    if (
      message &&
      (message.includes('NEXT_REDIRECT') ||
        message.includes('redirect') ||
        message.toLowerCase().includes('next_redirect') ||
        message === 'NEXT_REDIRECT')
    ) {
      console.log('Export filtered redirect message:', message);
      return; // Don't show redirect errors at all
    }

    const sanitizedMessage = sanitizeErrorMessage(message);
    if (!sanitizedMessage) {
      return; // Message was filtered out
    }
    return toast.error(sanitizedMessage, { duration: options?.duration || 6000, action: options?.action });
  },
  info: (message: string, options?: NotificationOptions) =>
    toast.info(message, { duration: options?.duration || 4000, action: options?.action }),
  warning: (message: string, options?: NotificationOptions) =>
    toast.warning(message, { duration: options?.duration || 5000, action: options?.action }),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
};
