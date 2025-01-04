import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { ArrowLeft } from 'lucide-react';

// BYO-IP订单步骤
const BYOIP_STEPS = [
  { title: 'IP信息', status: 'completed' as const },
  { title: '服务器配置', status: 'completed' as const },
  { title: '确认订单', status: 'current' as const },
  { title: '购物车', status: 'upcoming' as const },
  { title: '支付', status: 'upcoming' as const },
];

export function BYOIPConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ipFormData, serverConfig } = location.state || {};

  const handleBack = () => {
    navigate('/byo-ip/server', {
      state: { ipFormData, serverConfig }
    });
  };

  const handleNext = () => {
    navigate('/payment', {
      state: {
        orderType: 'byoip',
        ipFormData,
        serverConfig
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={BYOIP_STEPS} />
        
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="space-y-6">
              {/* IP信息 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">IP信息</h3>
                </div>
                <div className="px-4 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500">地区</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.country}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">IP前缀</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.ipPrefix}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Geo更新服务</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.geoUpdateService ? '是' : '否'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">LOA文件</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.loaFile?.name || '未上传'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">ROA(RPKI)</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.rpkiRequired ? '已创建' : '未创建'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">route object</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.routeObject ? '是' : '否'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">BGP设置</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {ipFormData?.bgpSetup ? '需要' : '不需要'}
                      </div>
                    </div>
                    {ipFormData?.notes && (
                      <div className="col-span-2">
                        <div className="text-sm text-gray-500">备注说明</div>
                        <div className="mt-1 text-sm font-medium text-gray-900">
                          {ipFormData.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 服务器配置 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">服务器配置</h3>
                </div>
                <div className="px-4 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500">CPU</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.cpu} 核
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">内存</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.memory} GB
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">存储</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.storage} GB
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">带宽类型</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.bandwidthType === 'dedicated' ? '独享带宽' : '共享带宽'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">带宽大小</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.bandwidthSpeed} Mbps
                      </div>
                    </div>
                    {serverConfig?.bandwidthType === 'shared' && (
                      <div>
                        <div className="text-sm text-gray-500">流量限制</div>
                        <div className="mt-1 text-sm font-medium text-gray-900">
                          {serverConfig.trafficLimit} GB/月
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-gray-500">操作系统</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.os} {serverConfig?.osVersion}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">付费周期</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {serverConfig?.period === 'month' ? '按月付费' :
                         serverConfig?.period === 'quarter' ? '按季付费' :
                         serverConfig?.period === 'halfYear' ? '按半年付费' : '按年付费'}
                      </div>
                    </div>
                    {serverConfig?.notes && (
                      <div className="col-span-2">
                        <div className="text-sm text-gray-500">备注说明</div>
                        <div className="mt-1 text-sm font-medium text-gray-900">
                          {serverConfig.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* 费用预览 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">费用预览</h3>
                </div>
                <div className="px-4 py-3">
                  <div className="space-y-3">
                    {/* IP相关费用 */}
                    {ipFormData?.geoUpdateService && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Geo更新服务</span>
                        <span className="text-sm font-medium text-gray-900">$5/月</span>
                      </div>
                    )}
                    {ipFormData?.bgpSetup && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">BGP设置费用</span>
                        <span className="text-sm font-medium text-gray-900">$100(一次性)</span>
                      </div>
                    )}
                    {ipFormData?.routeObject && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Route Object代理费</span>
                        <span className="text-sm font-medium text-gray-900">$50(一次性)</span>
                      </div>
                    )}

                    {/* 服务器费用 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">服务器费用</span>
                      <span className="text-sm font-medium text-gray-900">
                        ¥{serverConfig?.price}/月
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">带宽费用</span>
                      <span className="text-sm font-medium text-gray-900">
                        ¥{serverConfig?.bandwidthPrice}/月
                      </span>
                    </div>
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
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-900">总费用</span>
                        <div className="text-right">
                          <span className="text-xl font-semibold text-blue-600">
                            ¥{Math.round(
                              (serverConfig?.price + serverConfig?.bandwidthPrice) * 
                              (serverConfig?.period === 'month' ? 1 :
                               serverConfig?.period === 'quarter' ? 3 :
                               serverConfig?.period === 'halfYear' ? 6 : 12) * 
                              (serverConfig?.period === 'month' ? 1 :
                               serverConfig?.period === 'quarter' ? 0.95 :
                               serverConfig?.period === 'halfYear' ? 0.9 : 0.85)
                            )}
                          </span>
                          <div className="mt-0.5 text-xs text-gray-500">
                            ({serverConfig?.period === 'month' ? '按月付费' :
                              serverConfig?.period === 'quarter' ? '按季付费' :
                              serverConfig?.period === 'halfYear' ? '按半年付费' : '按年付费'})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  返回服务器配置
                </button>
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
                >
                  下一步：支付
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