'use client';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { createClient } from '@/lib/supabase/client';
import { getUserFriendlyErrorMessage } from '@/lib/utils/notification-filters';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const { auth } = useNotifications();

  const logout = async () => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        const userMessage = getUserFriendlyErrorMessage(error, 'Failed to sign out');
        auth.logoutError(userMessage);
        return;
      }

      auth.logoutSuccess();
      router.push('/auth/login');
    } catch (error) {
      const userMessage = getUserFriendlyErrorMessage(error, 'Failed to sign out');
      auth.logoutError(userMessage);
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}
