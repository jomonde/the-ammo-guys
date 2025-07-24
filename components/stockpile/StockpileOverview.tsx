'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Package, Target, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StockpileOverviewProps {
  totalValue: number;
  totalRounds: number;
  targetRounds: number;
  valueProgress: number;
  roundsProgress: number;
  nextAllocationDate?: string;
}

export function StockpileOverview({
  totalValue,
  totalRounds,
  targetRounds,
  valueProgress,
  roundsProgress,
  nextAllocationDate
}: StockpileOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            {valueProgress.toFixed(0)}% of target
          </p>
          <Progress value={valueProgress} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rounds Stockpiled</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRounds.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            {roundsProgress.toFixed(0)}% of {targetRounds.toLocaleString()} target
          </div>
          <Progress value={roundsProgress} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Allocation</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {nextAllocationDate || 'Not scheduled'}
          </div>
          <p className="text-xs text-muted-foreground">
            {nextAllocationDate ? 'Next automatic allocation' : 'Set up allocation schedule'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shipment Ready</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {roundsProgress >= 100 ? 'Yes' : 'No'}
          </div>
          <p className="text-xs text-muted-foreground">
            {roundsProgress >= 100 
              ? 'Ready to ship!' 
              : `${(targetRounds - totalRounds).toLocaleString()} more rounds needed`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
