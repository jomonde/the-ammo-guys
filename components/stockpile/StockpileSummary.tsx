interface StockpileSummaryProps {
  totalValue: number;
  totalRounds: number;
  valueProgress: number;
  roundsProgress: number;
  valueThreshold: number;
  roundsThreshold: number;
}

export default function StockpileSummary({
  totalValue,
  totalRounds,
  valueProgress,
  roundsProgress,
  valueThreshold,
  roundsThreshold,
}: StockpileSummaryProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Stockpile Summary</h3>
        
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Value Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Value Progress</p>
              <span className="text-sm font-medium text-gray-900">
                ${totalValue.toFixed(2)} / ${valueThreshold}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${valueProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {valueProgress >= 100 
                  ? 'Ready to ship!'
                  : `$${(valueThreshold - totalValue).toFixed(2)} to next shipment`}
              </p>
            </div>
          </div>

          {/* Rounds Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Rounds Progress</p>
              <span className="text-sm font-medium text-gray-900">
                {totalRounds} / {roundsThreshold} rounds
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${roundsProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {roundsProgress >= 100 
                  ? 'Ready to ship!'
                  : `${roundsThreshold - totalRounds} rounds to next shipment`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Total Value</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              ${totalValue.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Total Rounds</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {totalRounds}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Estimated Ship Date</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {valueProgress >= 100 || roundsProgress >= 100 
                ? 'Ready to Ship' 
                : 'Building...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
