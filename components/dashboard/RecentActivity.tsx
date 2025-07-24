import { ShippingHistory } from '@/types/stockpile';

interface RecentActivityProps {
  shipments: ShippingHistory[];
}

export default function RecentActivity({ shipments }: RecentActivityProps) {
  if (shipments.length === 0) {
    return (
      <div className="text-center py-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your shipping history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {shipments.map((shipment, index) => (
          <li key={shipment.id}>
            <div className="relative pb-8">
              {index !== shipments.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      shipment.status === 'delivered'
                        ? 'bg-green-500'
                        : shipment.status === 'shipped'
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {shipment.status === 'delivered' ? (
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : shipment.status === 'shipped' ? (
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 00.894-1.447l-1.5-3A1 1 0 008.5 10H7V8.5a1 1 0 011-1h1.5a1 1 0 00.8-.4l1.5-2a1 1 0 00.2-.6V4a1 1 0 00-1-1H4a1 1 0 00-1 1v1.5a1 1 0 001 1h1v1H4a1 1 0 00-1 1v2a1 1 0 001 1h1v1H4a1 1 0 00-1 1z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {shipment.status === 'delivered'
                        ? 'Delivered'
                        : shipment.status === 'shipped'
                        ? 'Shipped'
                        : 'Processing'}
                      <span className="font-medium text-gray-900">
                        {' '}
                        {shipment.total_rounds} rounds
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      ${shipment.total_value.toFixed(2)} •{' '}
                      {new Date(shipment.shipping_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {shipment.tracking_number ? (
                      <a
                        href={`#`}
                        className="font-medium text-primary hover:text-primary-dark"
                      >
                        Track
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <a
          href="/dashboard/shipping"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          View all shipping history
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  );
}
