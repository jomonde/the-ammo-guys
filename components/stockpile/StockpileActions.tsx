'use client';

import { Button } from '../ui/button';
import { DollarSign, Package, Settings, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function StockpileActions() {
  const router = useRouter();
  
  const actions = [
    {
      title: 'Allocate Budget',
      description: 'Manage your monthly ammunition budget allocation',
      icon: <DollarSign className="h-6 w-6" />,
      onClick: () => router.push('/stockpile/allocate')
    },
    {
      title: 'Request Shipment',
      description: 'Ship your accumulated ammunition',
      icon: <Package className="h-6 w-6" />,
      onClick: () => router.push('/shipments/new')
    },
    {
      title: 'Configure Triggers',
      description: 'Set up automatic shipment rules',
      icon: <Settings className="h-6 w-6" />,
      onClick: () => router.push('/stockpile/triggers')
    },
    {
      title: 'View Analytics',
      description: 'Track your stockpile growth',
      icon: <BarChart2 className="h-6 w-6" />,
      onClick: () => router.push('/stockpile/analytics')
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex flex-col items-center justify-center p-6 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center h-full"
        >
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
            {action.icon}
          </div>
          <h3 className="font-medium mb-1">{action.title}</h3>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </button>
      ))}
    </div>
  );
}
