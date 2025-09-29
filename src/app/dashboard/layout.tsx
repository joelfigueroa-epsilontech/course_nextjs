import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { MobileHeader } from '@/components/mobile-header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
