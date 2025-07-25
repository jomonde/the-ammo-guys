'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { StockpileOverview } from './StockpileOverview';
import { StockpileItems } from './StockpileItems';
import { StockpileActions } from './StockpileActions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { ArrowRight, Box, Clock, DollarSign, Package } from 'lucide-react';
import { Progress } from '@radix-ui/react-progress';

type StockpileSummary = {
  totalValue: number;
  totalRounds: number;
  valueProgress: number;
  roundsProgress: number;
  items: Array<{
    id: string;
    name: string;
    caliber: string;
    quantity: number;
    progress: number;
    imageUrl?: string;
  }>;
};

export function StockpileDashboard() {
  const router = useRouter();
  const [data, setData] = useState<StockpileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stockpile/summary');
        if (!response.ok) throw new Error('Failed to fetch stockpile data');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <StockpileDashboardSkeleton />;
  if (error) return (
    <div className="text-center p-4">
      <p className="text-red-500">Error: {error}</p>
      <Button onClick={() => window.location.reload()} className="mt-2">Retry</Button>
    </div>
  );

  if (!data) return (
    <div className="text-center p-4">
      <p>No stockpile data available</p>
      <Button onClick={() => router.push('/products')} className="mt-2">
        Add Products
      </Button>
    </div>
  );

  const { totalValue, totalRounds, valueProgress, roundsProgress, items = [] } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Value" 
          value={formatCurrency(totalValue)} 
          progress={valueProgress}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <SummaryCard 
          title="Total Rounds" 
          value={totalRounds.toLocaleString()} 
          progress={roundsProgress}
          icon={<Package className="h-4 w-4" />}
        />
        <SummaryCard 
          title="Items Tracked" 
          value={items.length.toString()} 
          progress={0}
          icon={<Box className="h-4 w-4" />}
        />
        <SummaryCard 
          title="Next Shipment" 
          value="Ready" 
          progress={0}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardButton 
          icon={<DollarSign />} 
          label="Manage Allocations"
          onClick={() => router.push('/stockpile/allocate')}
        />
        <DashboardButton 
          icon={<Package />} 
          label="New Shipment"
          onClick={() => router.push('/shipments/new')}
        />
        <DashboardButton 
          icon={<Box />} 
          label="Setup Triggers"
          onClick={() => router.push('/stockpile/triggers')}
        />
        <DashboardButton 
          icon={<Clock />} 
          label="View History"
          onClick={() => router.push('/stockpile/history')}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/stockpile/history')}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-8 w-8 object-contain" />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.caliber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity.toLocaleString()} rounds</p>
                    <div className="w-32">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent activity</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push('/products')}>
                Add Products
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, progress, icon }: { title: string; value: string; progress: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {progress > 0 && (
          <>
            <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% of target</p>
            <Progress value={progress} className="h-2 mt-2" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Button variant="outline" className="h-24 flex flex-col space-y-2" onClick={onClick}>
      <div className="text-2xl">{icon}</div>
      <span>{label}</span>
    </Button>
  );
}

function StockpileDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mt-2" />
              <Skeleton className="h-4 w-[80px] mt-2" />
              <Skeleton className="h-2 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-md" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
