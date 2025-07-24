'use client';

import { useState } from 'react';
import Image from 'next/image';
import { StockpileItem } from '@/types/stockpile';

interface StockpileTableProps {
  stockpile: StockpileItem[];
}

export default function StockpileTable({ stockpile }: StockpileTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ 
    key: 'added_date', 
    direction: 'descending' 
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStockpile = [...stockpile].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="ml-2">↕️</span>;
    }
    return (
      <span className="ml-2">
        {sortConfig.direction === 'ascending' ? '⬆️' : '⬇️'}
      </span>
    );
  };

  if (stockpile.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
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
          Get started by adding ammunition to your stockpile.
        </p>
        <div className="mt-6">
          <a
            href="/shop"
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
            Shop Ammo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('products.name')}
            >
              <div className="flex items-center">
                Product
                <SortIcon columnKey="products.name" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('products.caliber')}
            >
              <div className="flex items-center">
                Caliber
                <SortIcon columnKey="products.caliber" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('quantity')}
            >
              <div className="flex items-center">
                Quantity
                <SortIcon columnKey="quantity" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('value')}
            >
              <div className="flex items-center">
                Value
                <SortIcon columnKey="value" />
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('added_date')}
            >
              <div className="flex items-center">
                Added
                <SortIcon columnKey="added_date" />
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStockpile.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {item.products?.image ? (
                      <Image
                        className="h-10 w-10 rounded-md"
                        src={item.products.image}
                        alt={item.products.name}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.products?.name || 'Unknown Product'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.products?.description || ''}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {item.products?.caliber || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {item.quantity} rounds
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${item.value?.toFixed(2) || '0.00'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.added_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-primary hover:text-primary-dark mr-4">
                  Ship
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
