import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { ArrowLeft, Info } from 'lucide-react';
import { ServerConfig } from '../types/server';
import { SERVER_SPECS, BANDWIDTH_SPEEDS, OS_OPTIONS, DURATION_OPTIONS } from '../components/ServerConfigForm';

interface OSVersion {
  version: string;
  description: string;
}

interface DurationOption {
  value: string;
  label: string;
  discount: number;
}

export function CustomOrderInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const customFormData = location.state?.customFormData;
  const [serverConfig, setServerConfig] = useState<ServerConfig | null>(() => ({
    serverSpec: 'entry',
    bandwidthType: 'dedicated',
    bandwidthSpeed: '10',
    osType: 'Linux',
    os: 'CentOS',
    osVersion: '7.9',
    period: 'month',
    notes: '',
    cpu: SERVER_SPECS[0].cpu,
    memory: SERVER_SPECS[0].memory,
    storage: SERVER_SPECS[0].disk,
    price: SERVER_SPECS[0].price,
    bandwidthPrice: BANDWIDTH_SPEEDS[0].price,
    trafficLimit: BANDWIDTH_SPEEDS[0].limit
  }));

  const steps = STEPS.map((step, index) => ({
    ...step,
    status: index === 1 ? 'current' as const : index < 1 ? 'completed' as const : 'upcoming' as const
  }));

  const handleChange = (field: keyof ServerConfig, value: string) => {
    setServerConfig(prev => {
      const newConfig = { ...prev, [field]: value } as ServerConfig;
      
      // 更新 CPU、内存、存储和价格信息
      if (field === 'serverSpec') {
        const selectedSpec = SERVER_SPECS.find(spec => spec.id === value);
        if (selectedSpec) {
          newConfig.cpu = selectedSpec.cpu;
          newConfig.memory = selectedSpec.memory;
          newConfig.storage = selectedSpec.disk;
          newConfig.price = selectedSpec.price;
        }
      }

      // 更新带宽价格
      if (field === 'bandwidthSpeed') {
        const selectedBandwidth = BANDWIDTH_SPEEDS.find(b => b.speed === value);
        if (selectedBandwidth) {
          newConfig.bandwidthPrice = selectedBandwidth.price;
          newConfig.trafficLimit = selectedBandwidth.limit;
        }
      }

      return newConfig;
    });
  };

  const handleBack = () => {
    navigate('/custom-resource');
  };

  const handleNext = () => {
    navigate('/custom-order-confirm', {
      state: {
        customFormData,
        serverConfig
      }
    });
  };

  // 计算折扣后的价格
  const getDiscountedPrice = (price: number, period: string) => {
    const multiplier = period === 'month' ? 1 :
      period === 'quarter' ? 3 :
      period === 'halfYear' ? 6 : 12;
    
    const discount = period === 'month' ? 1 :
      period === 'quarter' ? 0.95 :
      period === 'halfYear' ? 0.9 : 0.85;
    
    return Math.round(price * multiplier * discount);
  };

  // 获取周期单位
  const getPeriodUnit = (period: string) => {
    switch (period) {
      case 'month': return '月';
      case 'quarter': return '季度';
      case 'halfYear': return '半年';
      case 'year': return '年';
      default: return '月';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="col-span-3">
            {/* 服务器配置 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-4">
                <div className="space-y-8">
                  {/* 服务器套餐选择 */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">服务器套餐选择</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {SERVER_SPECS.map(spec => (
                        <button
                          key={spec.id}
                          onClick={() => handleChange('serverSpec', spec.id)}
                          className={`p-4 rounded-lg border ${
                            serverConfig?.serverSpec === spec.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } transition-colors h-full`}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-auto">
                              <div className="font-medium text-lg text-gray-900">{spec.name}</div>
                              <div className="font-medium text-lg text-blue-600 ml-4">¥{spec.price}/月</div>
                            </div>
                            <div className="text-sm text-gray-600 font-medium mt-2">
                              {spec.cpu} | {spec.memory} | {spec.disk}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 带宽选择 */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">带宽选择</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleChange('bandwidthType', 'dedicated')}
                          className={`flex-1 p-4 rounded-lg border ${
                            serverConfig?.bandwidthType === 'dedicated'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } transition-colors`}
                        >
                          <div className="font-medium text-gray-900">独享带宽</div>
                        </button>
                        <button
                          onClick={() => handleChange('bandwidthType', 'shared')}
                          className={`flex-1 p-4 rounded-lg border ${
                            serverConfig?.bandwidthType === 'shared'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } transition-colors`}
                        >
                          <div className="font-medium text-gray-900">共享带宽</div>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {BANDWIDTH_SPEEDS.map(({ speed, limit, price }) => (
                          <button
                            key={speed}
                            onClick={() => handleChange('bandwidthSpeed', speed)}
                            className={`p-4 rounded-lg border ${
                              serverConfig?.bandwidthSpeed === speed
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            } transition-colors`}
                          >
                            <div className="flex flex-col">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {speed}Mbps{serverConfig?.bandwidthType === 'shared' ? '(峰值)' : ''}
                                  </div>
                                  {serverConfig?.bandwidthType === 'shared' && (
                                    <div className="text-sm text-gray-500 mt-1">流量限制: {limit}/月</div>
                                  )}
                                </div>
                                <div className="font-medium text-blue-600">¥{price}/月</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 系统选择 */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">系统选择</h3>
                    </div>
                    <div className="space-y-6">
                      {/* 系统类型选择 */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-3">选择系统类型</div>
                        <div className="grid grid-cols-4 gap-4">
                          {Object.keys(OS_OPTIONS).map((osName) => (
                            <button
                              key={osName}
                              onClick={() => handleChange('os', osName)}
                              className={`p-4 rounded-lg border ${
                                serverConfig?.os === osName
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              } transition-colors`}
                            >
                              <div className="font-medium text-gray-900">{osName}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 版本选择 */}
                      {serverConfig?.os && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-3">选择版本</div>
                          <div className="grid grid-cols-4 gap-4">
                            {OS_OPTIONS[serverConfig.os as keyof typeof OS_OPTIONS].map(({ version, description }) => (
                              <button
                                key={version}
                                onClick={() => handleChange('osVersion', version)}
                                className={`p-3 rounded-lg border ${
                                  serverConfig.osVersion === version
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                } transition-colors`}
                              >
                                <div className="font-medium text-gray-900">{version}</div>
                                <div className="text-xs text-gray-500">{description}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 时长选择 */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">时长选择</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-3">
                        {DURATION_OPTIONS.map((option) => (
                          <div
                            key={option.value}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              serverConfig?.period === option.value
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-600'
                            }`}
                            onClick={() => handleChange('period', option.value)}
                          >
                            <span className="text-sm font-medium text-gray-900">{option.label}</span>
                            {option.discount > 0 && (
                              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                -{option.discount}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 备注 */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">备注</h3>
                    <textarea
                      value={serverConfig?.notes || ''}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="请输入备注信息（选填）"
                      className="w-full h-24 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* 定制订单信息 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">定制订单信息</h3>
                </div>
                <div className="px-4 py-3">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">国家/地区</span>
                      <span className="text-sm font-medium text-gray-900">US</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">IP类型</span>
                      <span className="text-sm font-medium text-gray-900">原生</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">AS属性</span>
                      <span className="text-sm font-medium text-gray-900">ISP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">业务名称</span>
                      <span className="text-sm font-medium text-gray-900">facebook</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">子网规模</span>
                      <span className="text-sm font-medium text-gray-900">/21</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">月度预算</span>
                      <span className="text-sm font-medium text-gray-900">¥6000/月</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">合约期</span>
                      <span className="text-sm font-medium text-gray-900">3个月</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">数据库交付标准</span>
                      <span className="text-sm font-medium text-gray-900">ipinfo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 服务器配置信息 */}
              {serverConfig && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-base font-medium text-gray-900">服务器配置信息</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {/* 服务器费用 */}
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">服务器费用</span>
                        <span className="text-sm font-medium text-blue-600">
                          ¥{Math.round(serverConfig.price * (
                            serverConfig.period === 'month' ? 1 :
                            serverConfig.period === 'quarter' ? 3 :
                            serverConfig.period === 'halfYear' ? 6 :
                            12
                          ))}/{serverConfig.period === 'month' ? '月' : 
                            serverConfig.period === 'quarter' ? '季度' : 
                            serverConfig.period === 'halfYear' ? '半年' : '年'}
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

                    {/* 带宽费用 */}
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">带宽费用</span>
                        <span className="text-sm font-medium text-blue-600">
                          ¥{Math.round(serverConfig.bandwidthPrice * (
                            serverConfig.period === 'month' ? 1 :
                            serverConfig.period === 'quarter' ? 3 :
                            serverConfig.period === 'halfYear' ? 6 :
                            12
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

                    {/* 折扣优惠 */}
                    {serverConfig.period !== 'month' && (
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-900">折扣优惠</span>
                          <span className="text-xs text-gray-400">
                            ({serverConfig.period === 'quarter' ? '季付95折' : 
                              serverConfig.period === 'halfYear' ? '半年付9折' : '年付85折'})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          -¥{Math.round((serverConfig.price + serverConfig.bandwidthPrice) * 
                            (serverConfig.period === 'quarter' ? 3 * 0.05 : 
                             serverConfig.period === 'halfYear' ? 6 * 0.1 : 12 * 0.15)
                          )}
                        </span>
                      </div>
                    )}

                    {/* 订单总金额 */}
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-900">订单总金额</span>
                        <div className="text-right">
                          <span className="text-base font-medium text-blue-600">
                            ¥{Math.round(
                              (serverConfig.price + serverConfig.bandwidthPrice) * (
                                serverConfig.period === 'month' ? 1 :
                                serverConfig.period === 'quarter' ? 3 :
                                serverConfig.period === 'halfYear' ? 6 :
                                12
                              ) * (
                                serverConfig.period === 'month' ? 1 :
                                serverConfig.period === 'quarter' ? 0.95 :
                                serverConfig.period === 'halfYear' ? 0.9 :
                                0.85
                              )
                            )}
                          </span>
                          <div className="mt-0.5 text-xs text-gray-500">
                            (服务器及带宽按{
                              serverConfig.period === 'month' ? '月' :
                              serverConfig.period === 'quarter' ? '季度' :
                              serverConfig.period === 'halfYear' ? '半年' :
                              '年'
                            }付费)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  返回选择
                </button>
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
                >
                  下一步：确认订单
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 