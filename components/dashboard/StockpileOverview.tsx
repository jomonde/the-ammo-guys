import { StockpileItem } from '@/types/stockpile';

interface StockpileOverviewProps {
  stockpile: StockpileItem[];
}

export default function StockpileOverview({ stockpile }: StockpileOverviewProps) {
  // Group stockpile items by caliber
  const stockpileByCaliber = stockpile.reduce((acc, item) => {
    const caliber = item.products?.caliber || 'Other';
    if (!acc[caliber]) {
      acc[caliber] = {
        rounds: 0,
        value: 0,
        items: [],
      };
    }
    acc[caliber].rounds += item.quantity;
    acc[caliber].value += item.value;
    acc[caliber].items.push(item);
    return acc;
  }, {} as Record<string, { rounds: number; value: number; items: StockpileItem[] }>);

  // Calculate totals
  const totalRounds = Object.values(stockpileByCaliber).reduce((sum, { rounds }) => sum + rounds, 0);
  const totalValue = Object.values(stockpileByCaliber).reduce((sum, { value }) => sum + value, 0);

  // Color palette for the chart
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Your Stockpile</h2>
        <div className="text-sm text-gray-500">
          {totalRounds} rounds • ${totalValue.toFixed(2)} value
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        {Object.entries(stockpileByCaliber).map(([caliber, data], index) => {
          const percentage = totalRounds > 0 ? Math.round((data.rounds / totalRounds) * 100) : 0;
          const color = colors[index % colors.length];
          
          return (
            <div key={caliber}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-900">{caliber}</span>
                <span className="text-gray-500">
                  {data.rounds} rounds (${data.value.toFixed(2)})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {stockpile.length === 0 && (
        <div className="text-center py-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v10l8 4.5m0-14.5v14.5m8-10v10l-8 4.5"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No ammo in stockpile</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding to your stockpile by setting up your budget and allocations.
          </p>
          <div className="mt-6">
            <a
              href="/dashboard/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Set Up Stockpile
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
