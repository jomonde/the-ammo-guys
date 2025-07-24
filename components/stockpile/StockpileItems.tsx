'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface StockpileItem {
  id: string;
  name: string;
  caliber: string;
  quantity: number;
  target: number;
  price: number;
  imageUrl?: string;
  progress: number;
  value: number;
}

interface StockpileItemsProps {
  items: StockpileItem[];
  onAddItem?: () => void;
}

export function StockpileItems({ items, onAddItem }: StockpileItemsProps) {
  if (items.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Stockpile is Empty</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-6">
            You haven't added any items to your stockpile yet.
          </p>
          <Button onClick={onAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Ammunition
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Stockpile</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/stockpile/items">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.caliber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{item.quantity.toLocaleString()}/{item.target.toLocaleString()}</p>
                <div className="w-32">
                  <Progress value={item.progress} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
