import React from 'react';
import { X } from 'lucide-react';
import { Resource } from '../../types/resource';
import { ResourceTimer } from '../ResourceTimer';

interface OrderSummaryItemProps {
  resource: Resource;
  remainingTime: number;
  onRemove: (id: string) => void;
}

export function OrderSummaryItem({ resource, remainingTime, onRemove }: OrderSummaryItemProps) {
  const isNative = resource.type === 'native';
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                isNative 
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {isNative ? '原生' : '广播'}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {resource.location}
              </span>
            </div>
            <div className="font-mono text-sm text-gray-600">
              {resource.subnet}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-blue-600">
                ${resource.price}
              </span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
          </div>
          <button
            onClick={() => onRemove(resource.id)}
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">
          <ResourceTimer remainingTime={remainingTime} />
        </div>
      </div>
    </div>
  );
}