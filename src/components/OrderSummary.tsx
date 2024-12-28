import React from 'react';
import { X } from 'lucide-react';
import { Resource } from '../types/resource';
import { ServerConfig } from '../types/server';
import { ResourceTimer } from './ResourceTimer';

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
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">订单摘要</h2>
      <div className="mt-6 space-y-4">
        {selectedResources.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">已选IP资源</h3>
            {selectedResources.map(resource => (
              <div key={resource.id} className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {resource.location} - {resource.type === 'native' ? '原生' : '广播'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">子网: {resource.subnet}</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      月度费用: ${resource.price}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveResource(resource.id)}
                    className="text-gray-400 hover:text-gray-500 p-1"
                    title="删除资源"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <ResourceTimer remainingTime={getRemainingTime(resource.id)} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">暂未选择任何资源</p>
        )}

        {serverConfig && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">服务器配置</h3>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">处理器</span>
                  <span className="text-sm font-medium text-gray-900">{serverConfig.cpu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">内存</span>
                  <span className="text-sm font-medium text-gray-900">{serverConfig.memory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">存储</span>
                  <span className="text-sm font-medium text-gray-900">{serverConfig.storage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">操作系统</span>
                  <span className="text-sm font-medium text-gray-900">
                    {serverConfig.os} {serverConfig.osVersion}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">带宽</span>
                  <span className="text-sm font-medium text-gray-900">
                    {serverConfig.bandwidthType === 'dedicated' ? '独享' : '共享'} {serverConfig.bandwidthSpeed}Mbps
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">付费方式</span>
                  <span className="text-sm font-medium text-gray-900">
                    {serverConfig.period === 'month' ? '月付' :
                     serverConfig.period === 'quarter' ? '季付' :
                     serverConfig.period === 'halfYear' ? '半年付' : '年付'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-900">月度总费用</p>
            <p className="text-xl font-semibold text-blue-600">${total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}