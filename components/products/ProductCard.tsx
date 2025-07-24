'use client';

import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    caliber: string;
    inStock: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');

  const calculateDiscount = (qty: number) => {
    if (qty >= 11) return 0.2;
    if (qty >= 6) return 0.15;
    if (qty >= 1) return 0.1;
    return 0;
  };

  const discount = calculateDiscount(quantity);
  const subtotal = product.price * quantity;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const frequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'bimonthly', label: 'Every 2 Months' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center relative">
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        <span className="text-gray-500">Image: {product.name}</span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.caliber}</p>
          </div>
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4">{product.description}</p>
        
        {isSubscribing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Frequency
            </label>
            <select
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {frequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-lg font-bold"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-3 py-1 border-x border-gray-300">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-lg font-bold"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => setIsSubscribing(!isSubscribing)}
            className={`text-sm font-medium ${
              isSubscribing ? 'text-primary' : 'text-gray-600'
            }`}
          >
            {isSubscribing ? 'Switch to One-Time' : 'Subscribe & Save'}
          </button>
        </div>
        
        {discount > 0 && isSubscribing && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({quantity} {quantity === 1 ? 'box' : 'boxes'}):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-green-700">
              <span>Subscription Discount ({discount * 100}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-1">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Save ${discountAmount.toFixed(2)} with subscription
            </div>
          </div>
        )}
        
        <button
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center py-2 px-4 rounded-md ${
            product.inStock
              ? 'bg-primary hover:bg-primary-dark text-white'
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {product.inStock
            ? isSubscribing
              ? 'Subscribe Now'
              : 'Add to Cart'
            : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
