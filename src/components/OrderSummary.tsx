import React from 'react';
import { X, Info, Server, Network, HardDrive, AlertCircle } from 'lucide-react';
import { Resource } from '../types/resource';
import { ServerConfig } from '../types/server';
import { BANDWIDTH_SPEEDS } from '../components/ServerConfigForm';
import { ResourceTimer } from './ResourceTimer';

interface OrderSummaryProps {
  selectedResources: Resource[];
  serverConfig: ServerConfig | null;
  total: number;
  onRemoveResource: (resourceId: string) => void;
  getRemainingTime: () => number;
}

export function OrderSummary({
  selectedResources,
  serverConfig,
  total,
  onRemoveResource,
  getRemainingTime,
}: OrderSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm divide-y divide-gray-200">
      {/* 标题部分 */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">预订订单信息</h2>
      </div>

      {/* IP资源部分 */}
      {selectedResources.length > 0 && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900">IP资源配置</h3>
            </div>
            <ResourceTimer getRemainingTime={getRemainingTime} />
          </div>
          <div className="space-y-3">
            {selectedResources.map(resource => (
              <div key={resource.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {resource.location}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          resource.type === 'native' 
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {resource.type === 'native' ? '原生' : '广播'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">¥{resource.price}/月</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">子网</span>
                        <span className="text-sm font-medium text-gray-900">{resource.subnet}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">As属性</span>
                        <span className="text-sm font-medium text-gray-900">ISP</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveResource(resource.id)}
                    className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-50 rounded-full transition-colors ml-2"
                    title="删除资源"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5 px-1">
            <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="leading-5">
              子网将在锁定时间结束后自动释放，请及时完成付款以确保资源不被他人选择
            </p>
          </div>
        </div>
      )}

      {/* 服务器配置部分 */}
      {serverConfig && selectedResources.length > 0 && (
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-medium text-gray-900">服务器配置</h3>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 divide-y divide-gray-200">
            {/* 基础配置部分 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">{getServerSpecName(serverConfig.serverSpec)}</span>
                <span className="text-sm font-medium text-blue-600">¥{getDiscountedPrice(serverConfig.price, serverConfig.period)}/{getPeriodUnit(serverConfig.period)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">处理器</div>
                  <div className="text-sm font-medium text-gray-900">{serverConfig.cpu}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">内存</div>
                  <div className="text-sm font-medium text-gray-900">{serverConfig.memory}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">存储</div>
                  <div className="text-sm font-medium text-gray-900">{serverConfig.storage}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">系统</div>
                  <div className="text-sm font-medium text-gray-900">{serverConfig.os} {serverConfig.osVersion}</div>
                </div>
              </div>
            </div>
            
            {/* 带宽配置部分 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">带宽配置</span>
                <span className="text-sm font-medium text-blue-600">¥{getDiscountedPrice(serverConfig.bandwidthPrice, serverConfig.period)}/{getPeriodUnit(serverConfig.period)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 whitespace-nowrap">带宽类型</div>
                  <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                    {serverConfig.bandwidthType === 'dedicated' ? '独享带宽' : '共享带宽'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 whitespace-nowrap">带宽规格</div>
                  <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                    {serverConfig.bandwidthSpeed}Mbps
                  </div>
                </div>
                {serverConfig.bandwidthType === 'shared' && (
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="text-xs text-gray-500 whitespace-nowrap">流量限制</div>
                    <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                      {BANDWIDTH_SPEEDS.find(b => b.speed === serverConfig.bandwidthSpeed)?.limit}/月
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 费用明细部分 */}
      <div className="px-6 py-4">
        <div className="space-y-3">
          {selectedResources.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">IP资源费用</span>
              <span className="font-medium">
                ¥{selectedResources.reduce((sum, resource) => sum + resource.price, 0)}/月
              </span>
            </div>
          )}
          {serverConfig && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">服务器费用</span>
                <span className="font-medium">
                  ¥{getDiscountedPrice(serverConfig.price, serverConfig.period)}/{getPeriodUnit(serverConfig.period)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">带宽费用</span>
                <span className="font-medium">
                  ¥{getDiscountedPrice(serverConfig.bandwidthPrice, serverConfig.period)}/{getPeriodUnit(serverConfig.period)}
                </span>
              </div>
            </>
          )}
          {serverConfig?.period !== 'month' && serverConfig && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">折扣优惠</span>
              <span className="font-medium text-red-600">
                -¥{Math.round((serverConfig.price + serverConfig.bandwidthPrice) * getMonthMultiplier(serverConfig.period)) - 
                (getDiscountedPrice(serverConfig.price + serverConfig.bandwidthPrice, serverConfig.period))}
              </span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">订单总金额</span>
              <div className="text-right">
                <span className="text-xl font-semibold text-blue-600">
                  ¥{getDiscountedPrice(serverConfig?.price ?? 0 + (serverConfig?.bandwidthPrice ?? 0), serverConfig?.period ?? 'month') + 
                  selectedResources.reduce((sum, resource) => sum + resource.price, 0)}
                </span>
                {serverConfig?.period !== 'month' && (
                  <div className="text-xs text-gray-500 mt-1">
                    (服务器及带宽按{getPeriodUnit(serverConfig?.period ?? 'month')}付费)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getBgColor(remainingTime: number) {
  if (remainingTime <= 60) return 'bg-red-100 text-red-900'; // 1分钟以下
  if (remainingTime <= 300) return 'bg-amber-100 text-amber-900'; // 5分钟以下
  return 'bg-blue-50 text-blue-900'; // 正常状态
}

function getPeriodUnit(period: string) {
  switch (period) {
    case 'month':
      return '月';
    case 'quarter':
      return '季度';
    case 'halfYear':
      return '半年';
    case 'year':
      return '年';
    default:
      return '月';
  }
}

function getDiscountedPrice(price: number, period: string) {
  const multiplier = {
    month: 1,
    quarter: 3 * 0.95, // 5% discount
    halfYear: 6 * 0.9, // 10% discount
    year: 12 * 0.85 // 15% discount
  }[period] || 1;

  return Math.round(price * multiplier);
}

function getMonthMultiplier(period: string) {
  switch (period) {
    case 'month':
      return 1;
    case 'quarter':
      return 3;
    case 'halfYear':
      return 6;
    case 'year':
      return 12;
    default:
      return 1;
  }
}

function getServerSpecName(spec: string) {
  const specMap: Record<string, string> = {
    entry: '入门配置',
    basic: '基础配置',
    standard: '标准配置',
    advanced: '高级配置',
    professional: '专业配置',
    ultimate: '旗舰配置'
  };
  return specMap[spec] || '基础配置';
}