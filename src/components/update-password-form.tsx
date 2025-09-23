'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { getUserFriendlyErrorMessage } from '@/lib/utils/notification-filters';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { auth, form } = useNotifications();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!password.trim()) {
      form.validationError('Please enter a new password');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      form.validationError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        const userMessage = getUserFriendlyErrorMessage(error, 'Failed to update password');
        auth.passwordUpdateError(userMessage);
        setError(userMessage);
      } else {
        auth.passwordUpdateSuccess();
        router.push('/protected');
      }
    } catch (error: unknown) {
      const userMessage = getUserFriendlyErrorMessage(error, 'Failed to update password');
      auth.passwordUpdateError(userMessage);
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save new password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
