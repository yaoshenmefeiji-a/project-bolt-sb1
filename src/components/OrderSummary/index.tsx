import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Resource } from '../../types/resource';
import { ServerConfig } from '../../types/server';
import { OrderSummaryItem } from './OrderSummaryItem';
import { ServerConfigSection } from './ServerConfigSection';

interface OrderSummaryProps {
  selectedResources: Resource[];
  serverConfig: ServerConfig | null;
  total: number;
  onRemoveResource: (resourceId: string) => void;
  getRemainingTime: (resourceId: string) => number;
}

export function OrderSummary({
  selectedResources,
  serverConfig,
  total,
  onRemoveResource,
  getRemainingTime,
}: OrderSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Selected Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">已选IP资源</h3>
            {selectedResources.length > 0 ? (
              <div className="space-y-3">
                {selectedResources.map(resource => (
                  <OrderSummaryItem
                    key={resource.id}
                    resource={resource}
                    remainingTime={getRemainingTime(resource.id)}
                    onRemove={onRemoveResource}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-4">
                <p className="text-center text-sm text-gray-500">
                  暂未选择任何资源
                </p>
              </div>
            )}
          </div>

          {/* Server Config */}
          {serverConfig && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">服务器配置</h3>
              <ServerConfigSection config={serverConfig} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">月度总费用</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-blue-600">
                ${total}
              </span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
          </div>
          <button
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedResources.length === 0}
          >
            确认订单
          </button>
        </div>
      </div>
    </div>
  );
}