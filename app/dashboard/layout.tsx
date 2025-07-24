import { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
