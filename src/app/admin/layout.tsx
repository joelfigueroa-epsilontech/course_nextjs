import { AdminMobileHeader } from '@/components/admin-mobile-header';
import { AdminSidebar } from '@/components/admin-sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check if user has admin role
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (error || !profile || profile.role !== 'admin') {
    // User is not admin, redirect to dashboard with error
    redirect('/dashboard?error=unauthorized_admin_access');
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <AdminMobileHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
