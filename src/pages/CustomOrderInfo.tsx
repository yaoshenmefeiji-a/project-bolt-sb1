import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { ArrowLeft, Info } from 'lucide-react';
import { ServerConfigForm } from '../components/ServerConfigForm';

export function CustomOrderInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const customFormData = location.state?.customFormData;
  const serverConfig = location.state?.serverConfig;

  const steps = STEPS.map((step, index) => ({
    ...step,
    status: index === 1 ? 'current' as const : index < 1 ? 'completed' as const : 'upcoming' as const
  }));

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 max-w-4xl mx-auto space-y-6">
          {/* 定制资源信息 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">定制订单IP资源信息</h3>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">国家/地区</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.country || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">IP类型</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.usageType === 'native' ? '原生' : '广播'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">AS属性</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      ISP
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">业务名称</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.businessName === 'custom' 
                        ? customFormData?.customBusinessUrl 
                        : customFormData?.businessName || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">子网规模</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      /{customFormData?.subnetSize || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">月度预算</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      ¥{customFormData?.budget || '-'}/月
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">合约期</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.commitmentPeriod === '0' 
                        ? '无合约期' 
                        : `${customFormData?.commitmentPeriod || '-'}个月`}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">数据库交付标准</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {customFormData?.database || '-'}
                    </div>
                  </div>
                </div>
                {customFormData?.notes && (
                  <div>
                    <span className="text-sm text-gray-500">备注说明</span>
                    <div className="mt-1 text-sm text-gray-900">
                      {customFormData.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 服务器配置 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">预订订单服务器信息</h3>
              </div>
            </div>
            <div className="px-4 py-4">
              <ServerConfigForm />
            </div>
          </div>

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

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              上一步
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 