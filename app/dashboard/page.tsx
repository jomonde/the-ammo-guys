import { createServerComponentClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import StockpileOverview from '@/components/dashboard/StockpileOverview';
import RecentActivity from '@/components/dashboard/RecentActivity';

// Dynamically import the client-side component
const StockpileAllocations = dynamic(
  () => import('@/components/dashboard/StockpileAllocations'),
  { ssr: false, loading: () => <div>Loading allocations...</div> }
);

export default async function DashboardPage() {
  const supabase = createServerComponentClient();
  
  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return redirect('/login');
  }

  // Fetch user's stockpile data
  const { data: stockpile } = await supabase
    .from('stockpile_items')
    .select(`
      *,
      products:product_id (*)
    `)
    .eq('user_id', session.user.id)
    .eq('is_shipped', false);

  // Fetch recent shipments
  const { data: shipments } = await supabase
    .from('shipping_history')
    .select('*')
    .eq('user_id', session.user.id)
    .order('shipping_date', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <StockpileOverview stockpile={stockpile || []} />
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Add Funds
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Ship My Stockpile
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Update Allocations
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stockpile Allocations */}
          <div className="bg-white shadow rounded-lg p-6">
            <StockpileAllocations />
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <RecentActivity shipments={shipments || []} />
          </div>
          
          {/* Stockpile Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Stockpile Value</h2>
            <div className="text-3xl font-bold text-gray-900">
              ${(stockpile || []).reduce((total, item) => total + (item.value || 0), 0).toFixed(2)}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {(stockpile || []).reduce((total, item) => total + (item.quantity || 0), 0)} total rounds
            </p>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                75% to next shipment threshold
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
