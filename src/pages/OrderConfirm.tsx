import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { useResourceManager } from '../hooks/useResourceManager';
import { ServerConfig } from '../types/server';
import { ArrowLeft, Server, Network, Clock, Edit2, Info, Wifi } from 'lucide-react';
import { SERVER_SPECS } from '../components/ServerConfigForm';
import { ResourceTimer } from '../components/ResourceTimer';

interface ServerSpec {
  id: string;
  name: string;
  cpu: string;
  memory: string;
  disk: string;
  price: number;
}

interface DiscountCode {
  type: 'discount';
  value: number;
  name: string;
}

interface Voucher {
  type: 'voucher';
  value: number;
  name: string;
  minAmount: number;
}

// 获取付费周期单位
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

// 获取折扣后的价格
function getDiscountedPrice(price: number, period: string) {
  const multiplier = {
    month: 1,
    quarter: 3 * 0.95, // 5% discount
    halfYear: 6 * 0.9, // 10% discount
    year: 12 * 0.85 // 15% discount
  }[period] || 1;

  return Math.round(price * multiplier);
}

// 优惠码配置
const DISCOUNT_CODES: Record<string, DiscountCode> = {
  'NEWYEAR': { type: 'discount', value: 0.88, name: '新年特惠' }, // 88折
  'SUMMER': { type: 'discount', value: 0.95, name: '夏季特惠' }, // 95折
};

// 代金券配置
const VOUCHERS: Record<string, Voucher> = {
  'GIFT100': { type: 'voucher', value: 100, name: '满1000减100', minAmount: 1000 },
  'GIFT500': { type: 'voucher', value: 500, name: '满5000减500', minAmount: 5000 },
};

export function OrderConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedResources, removeResource, getRemainingTime } = useResourceManager();
  const serverConfig = location.state?.serverConfig as ServerConfig;
  const [couponCode, setCouponCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const steps = STEPS.map((step, index) => ({
    ...step,
    status: index === 2 ? 'current' as const : index < 2 ? 'completed' as const : 'upcoming' as const
  }));

  const handleBack = () => {
    navigate('/server-config', { 
      state: { 
        serverConfig: {
          ...serverConfig,
          notes: serverConfig.notes
        } 
      } 
    });
  };

  const handleSubmit = () => {
    // TODO: 处理订单提交
    console.log('提交订单');
  };

  function getBgColor(remainingTime: number) {
    if (remainingTime <= 60) return 'bg-red-50 text-red-900'; // 1分钟以下
    if (remainingTime <= 300) return 'bg-amber-50 text-amber-900'; // 5分钟以下
    return 'bg-blue-50 text-blue-900'; // 正常状态
  }

  // 验证并应用优惠码
  const validateCoupon = () => {
    setErrorMessage('');
    const code = couponCode.trim().toUpperCase();
    
    // 检查是否已经应用了优惠码
    if (appliedCode) {
      setErrorMessage('已经使用了优惠码，每个订单只能使用一个优惠码或代金券');
      return;
    }

    // 检查优惠码是否存在
    const discountCode = DISCOUNT_CODES[code];
    const voucher = VOUCHERS[code];

    if (!discountCode && !voucher) {
      setErrorMessage('无效的优惠码或代金券');
      return;
    }

    // 如果是代金券，检查订单金额是否满足最低要求
    if (voucher) {
      const totalAmount = getDiscountedPrice(
        (serverConfig?.price ?? 0) + (serverConfig?.bandwidthPrice ?? 0),
        serverConfig?.period ?? 'month'
      ) + selectedResources.reduce((sum, resource) => sum + resource.price, 0);

      if (totalAmount < voucher.minAmount) {
        setErrorMessage(`订单金额未满${voucher.minAmount}元，无法使用该代金券`);
        return;
      }
    }

    // 应用优惠码
    setAppliedCode(code);
    setCouponCode('');
  };

  // 计算优惠金额
  const getDiscountAmount = () => {
    if (!appliedCode) return 0;

    const totalAmount = getDiscountedPrice(
      (serverConfig?.price ?? 0) + (serverConfig?.bandwidthPrice ?? 0),
      serverConfig?.period ?? 'month'
    ) + selectedResources.reduce((sum, resource) => sum + resource.price, 0);

    const discountCode = DISCOUNT_CODES[appliedCode];
    if (discountCode) {
      return Math.round(totalAmount * (1 - discountCode.value));
    }

    const voucher = VOUCHERS[appliedCode];
    if (voucher) {
      return voucher.value;
    }

    return 0;
  };

  // 获取优惠码或代金券的显示信息
  const getAppliedCodeInfo = () => {
    if (!appliedCode) return null;

    const discountCode = DISCOUNT_CODES[appliedCode];
    if (discountCode) {
      return {
        name: discountCode.name,
        description: `${Math.round(discountCode.value * 100)}折`
      };
    }

    const voucher = VOUCHERS[appliedCode];
    if (voucher) {
      return {
        name: voucher.name,
        description: `满${voucher.minAmount}减${voucher.value}`
      };
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 max-w-4xl mx-auto space-y-6">
          {selectedResources.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Network className="h-12 w-12 text-gray-400" />
                <div className="text-lg font-medium text-gray-900">未选择任何 IP 资源</div>
                <div className="text-sm text-gray-500">请先选择需要的 IP 资源，再进行服务器配置</div>
                <button
                  onClick={() => navigate('/', { 
                    state: { 
                      selectedLocation: selectedResources[0]?.location,
                      selectedType: selectedResources[0]?.type
                    }
                  })}
                  className="mt-4 px-6 py-3 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  返回选择资源
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* IP资源信息 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900">预订订单IP资源信息</h3>
                    <ResourceTimer getRemainingTime={getRemainingTime} />
                  </div>
                </div>

                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-[80px] text-center">
                      <div className="text-sm font-medium text-gray-500">类型</div>
                    </div>
                    <div className="w-[40px]" />
                    <div className="w-[180px] text-center">
                      <div className="text-sm font-medium text-gray-500">目标位置</div>
                    </div>
                    <div className="w-[180px]">
                      <div className="text-sm font-medium text-gray-500">子网</div>
                    </div>
                    <div className="w-[120px]">
                      <div className="text-sm font-medium text-gray-500">As属性</div>
                    </div>
                    <div className="w-[100px] text-center">
                      <div className="text-sm font-medium text-gray-500">价格</div>
                    </div>
                    <div className="w-[40px]" />
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {selectedResources.map(resource => (
                    <div key={resource.id} className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-[80px] flex justify-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            resource.type === 'native' 
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}>
                            {resource.type === 'native' ? '原生' : '广播'}
                          </span>
                        </div>
                        <div className="w-[40px]" />
                        <div className="w-[180px] flex justify-center">
                          <div className="text-sm font-medium text-gray-900">{resource.location}</div>
                        </div>
                        <div className="w-[180px]">
                          <div className="text-sm font-medium text-gray-900">{resource.subnet}</div>
                        </div>
                        <div className="w-[120px]">
                          <div className="text-sm text-gray-900 flex items-center gap-1.5">
                            <Wifi className="h-4 w-4 text-green-500" />
                            <span>ISP</span>
                          </div>
                        </div>
                        <div className="w-[100px] flex justify-center">
                          <div className="text-sm font-medium text-blue-600">
                            ¥{resource.price}/月
                          </div>
                        </div>
                        <div className="w-[40px] flex justify-center">
                          <button
                            onClick={() => removeResource(resource.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="删除"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 服务器配置信息 */}
              {serverConfig && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-gray-900">预订订单服务器信息</h3>
                      <button
                        onClick={() => navigate('/server-config', { 
                          state: { 
                            serverConfig: {
                              ...serverConfig,
                              notes: serverConfig.notes
                            } 
                          } 
                        })}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        修改配置
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {/* 基础配置 */}
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">
                          {SERVER_SPECS.find(spec => spec.id === serverConfig.serverSpec)?.name || ''}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          ¥{serverConfig.price}/{serverConfig.period === 'month' ? '月' : '季度'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">
                          CPU: {serverConfig.cpu}
                        </div>
                        <div className="text-sm text-gray-500">
                          内存: {serverConfig.memory}
                        </div>
                        <div className="text-sm text-gray-500">
                          存储: {serverConfig.storage}
                        </div>
                        <div className="text-sm text-gray-500">
                          系统: {serverConfig.os} {serverConfig.osVersion}
                        </div>
                      </div>
                    </div>

                    {/* 带宽配置 */}
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">带宽配置</span>
                        <span className="text-sm font-medium text-blue-600">
                          ¥{Math.round(serverConfig.bandwidthPrice * (
                            serverConfig.period === 'month' ? 1 :
                            serverConfig.period === 'quarter' ? 2.85 :
                            serverConfig.period === 'halfYear' ? 5.4 :
                            11.4
                          ))}/{serverConfig.period === 'month' ? '月' : 
                            serverConfig.period === 'quarter' ? '季度' : 
                            serverConfig.period === 'halfYear' ? '半年' : '年'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">
                          带宽类型: {serverConfig.bandwidthType === 'dedicated' ? '独享带宽' : '共享带宽'}
                        </div>
                        {serverConfig.bandwidthType === 'dedicated' ? (
                          <div className="text-sm text-gray-500">
                            带宽规格: {serverConfig.bandwidthSpeed}Mbps
                          </div>
                        ) : (
                          <>
                            <div className="text-sm text-gray-500">
                              带宽规格: {serverConfig.bandwidthSpeed}Mbps
                            </div>
                            <div className="text-sm text-gray-500">
                              流量限制: {serverConfig.trafficLimit}/月
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 备注 */}
                    {serverConfig.notes && (
                      <div className="px-4 py-4">
                        <div className="flex items-center mb-3">
                          <span className="text-sm font-medium text-gray-900">备注</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {serverConfig.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 交付时间 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">交付时间</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">希望交付时间</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">建议的最早交付时间</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">最迟交付时间</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">可接受的最晚交付时间</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5">
                    <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="leading-5">
                      我们将尽可能在您期望的时间内完成交付，如遇特殊情况会提前与您沟通
                    </p>
                  </div>
                </div>
              </div>

              {/* 优惠码/代金券输入框 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">优惠码/代金券</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="请输入优惠码或代金券码"
                      value={couponCode}
                      onChange={(e) => {
                        setErrorMessage('');
                        setCouponCode(e.target.value);
                      }}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={validateCoupon}
                      disabled={!couponCode.trim() || !!appliedCode}
                    >
                      使用
                    </button>
                  </div>
                  {errorMessage && (
                    <div className="mt-2 text-sm text-red-600">
                      {errorMessage}
                    </div>
                  )}
                  {appliedCode && (
                    <div className="mt-2 text-sm text-green-600 flex items-center justify-between">
                      <span>已使用：{getAppliedCodeInfo()?.name} ({getAppliedCodeInfo()?.description})</span>
                      <button
                        onClick={() => {
                          setAppliedCode(null);
                          setErrorMessage('');
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5">
                    <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="leading-5">
                      每个订单仅可使用一个优惠码或代金券，部分商品可能不参与优惠
                    </p>
                  </div>
                </div>
              </div>

              {/* 费用明细 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">费用明细</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {selectedResources.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">IP资源费用</span>
                        <span className="text-sm font-medium">
                          ¥{selectedResources.reduce((sum, resource) => sum + resource.price, 0)}/月
                        </span>
                      </div>
                    )}
                    {serverConfig && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">服务器费用</span>
                          <span className="text-sm font-medium">
                            ¥{serverConfig.price}/{serverConfig.period === 'month' ? '月' : 
                              serverConfig.period === 'quarter' ? '季度' : 
                              serverConfig.period === 'halfYear' ? '半年' : '年'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">带宽费用</span>
                          <span className="text-sm font-medium">
                            ¥{serverConfig.bandwidthPrice}/{serverConfig.period === 'month' ? '月' : 
                              serverConfig.period === 'quarter' ? '季度' : 
                              serverConfig.period === 'halfYear' ? '半年' : '年'}
                          </span>
                        </div>
                      </>
                    )}
                    {/* 付费周期折扣 */}
                    {serverConfig?.period !== 'month' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">付费周期折扣</span>
                          <span className="text-xs text-gray-400">
                            ({serverConfig.period === 'quarter' ? '季付95折' : 
                              serverConfig.period === 'halfYear' ? '半年付9折' : '年付85折'})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          -¥{Math.round((serverConfig.price + serverConfig.bandwidthPrice) * 
                            (serverConfig.period === 'quarter' ? 0.05 : 
                             serverConfig.period === 'halfYear' ? 0.1 : 0.15) * 
                            (serverConfig.period === 'quarter' ? 3 : 
                             serverConfig.period === 'halfYear' ? 6 : 12)
                          )}
                        </span>
                      </div>
                    )}
                    {/* 优惠码/代金券折扣 */}
                    {appliedCode && getDiscountAmount() > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">
                            {DISCOUNT_CODES[appliedCode] ? '折扣码优惠' : '代金券优惠'}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({getAppliedCodeInfo()?.description})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          -¥{getDiscountAmount()}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-900">订单总金额</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold text-blue-600">
                            ¥{Math.round(
                              getDiscountedPrice(
                                (serverConfig?.price ?? 0) + (serverConfig?.bandwidthPrice ?? 0),
                                serverConfig?.period ?? 'month'
                              ) + selectedResources.reduce((sum, resource) => sum + resource.price, 0)
                              - getDiscountAmount()
                            )}
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
            </>
          )}

          {/* 操作按钮 */}
          {selectedResources.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                上一步
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                提交订单
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 