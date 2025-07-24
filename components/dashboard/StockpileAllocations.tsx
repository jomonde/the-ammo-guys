'use client';

'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Database } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

type StockpileAllocation = {
  id: string;
  user_id: string;
  product_id: string;
  monthly_budget: number;
  current_balance: number;
  estimated_rounds: number;
  created_at: string;
  updated_at: string;
  products: Database['public']['Tables']['products']['Row'];
};

export default function StockpileAllocations() {
  const supabase = createClient();

  const { data: allocations, isLoading } = useQuery<StockpileAllocation[]>({
    queryKey: ['stockpile-allocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stockpile_allocations')
        .select(`
          *,
          products (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-100 rounded-full w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!allocations?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No allocations found. Set up your stockpile to get started.
      </div>
    );
  }

  // Calculate total monthly budget
  const totalBudget = allocations.reduce(
    (sum, alloc) => sum + (alloc.monthly_budget || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Monthly Allocations</h3>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium">${totalBudget.toFixed(2)}/month</span>
        </div>
      </div>

      <div className="space-y-4">
        {allocations.map((allocation) => {
          const percentage = totalBudget > 0 
            ? Math.min(100, Math.round(((allocation.monthly_budget || 0) / totalBudget) * 100))
            : 0;
          
          return (
            <div key={allocation.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {allocation.products?.name || 'Unknown Product'}
                </span>
                <span>
                  ${allocation.monthly_budget?.toFixed(2)} ({percentage}%)
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={cn(
                  'h-2',
                  percentage > 80 ? 'bg-red-100' : 
                  percentage > 50 ? 'bg-yellow-100' : 'bg-green-100'
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {allocation.estimated_rounds} rounds/mo
                </span>
                <span>
                  ${(allocation.current_balance || 0).toFixed(2)} available
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
