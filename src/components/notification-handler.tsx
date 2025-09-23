'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function NotificationHandler() {
  const searchParams = useSearchParams();
  const { blog, auth } = useNotifications();

  useEffect(() => {
    const handleNotifications = () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const info = searchParams.get('info');

      // Handle success notifications
      if (success) {
        switch (success) {
          case 'blog_created':
            blog.createSuccess();
            break;
          case 'blog_updated':
            blog.updateSuccess();
            break;
          case 'blog_deleted':
            blog.deleteSuccess();
            break;
          case 'blog_published':
            blog.publishSuccess();
            break;
          case 'blog_unpublished':
            blog.unpublishSuccess();
            break;
          case 'login':
            auth.loginSuccess();
            break;
          case 'signup':
            auth.signupSuccess();
            break;
          case 'logout':
            auth.logoutSuccess();
            break;
          case 'password_reset':
            auth.passwordResetSent();
            break;
          case 'password_updated':
            auth.passwordUpdateSuccess();
            break;
        }
      }

      // Handle error notifications
      if (error) {
        switch (error) {
          case 'blog_create_failed':
            blog.createError();
            break;
          case 'blog_update_failed':
            blog.updateError();
            break;
          case 'blog_delete_failed':
            blog.deleteError();
            break;
          case 'login_failed':
            auth.loginError();
            break;
          case 'signup_failed':
            auth.signupError();
            break;
          case 'unauthorized':
            auth.unauthorized();
            break;
          case 'session_expired':
            auth.sessionExpired();
            break;
          default:
            if (error.includes('_')) {
              // Custom error message from URL
              const message = error.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
              blog.createError(message);
            }
            break;
        }
      }

      // Handle info notifications
      if (info) {
        switch (info) {
          case 'draft_saved':
            blog.draftSaved();
            break;
          case 'email_verification_sent':
            auth.signupSuccess();
            break;
        }
      }

      // Clean up URL parameters after showing notifications
      if (success || error || info) {
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('error');
        url.searchParams.delete('info');
        window.history.replaceState({}, '', url.toString());
      }
    };

    // Small delay to ensure page has loaded
    const timer = setTimeout(handleNotifications, 100);

    return () => clearTimeout(timer);
  }, [searchParams, blog, auth]);

  return null;
}
