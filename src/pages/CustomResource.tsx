import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { ArrowLeft, Server, Network, Clock, Edit2, Info, Wifi } from 'lucide-react';
import { CustomResourceForm } from '../components/CustomResourceForm';

export function CustomResource() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  const steps = STEPS.map((step, index) => ({
    ...step,
    status: index === 0 ? 'current' as const : 'upcoming' as const
  }));

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate('/custom-order-info', {
      state: {
        customFormData: formData
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="col-span-3">
            {/* 定制资源表单 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">定制订单IP资源信息</h3>
                </div>
              </div>

              <div className="px-4 py-4">
                <CustomResourceForm onFormChange={setFormData} />
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
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">国家/地区</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData?.country || '-'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">IP类型</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData?.usageType === 'native' ? '原生' : '广播'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">AS属性</span>
                    <span className="text-sm font-medium text-gray-900">
                      ISP
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">业务名称</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData?.businessName === 'custom' 
                        ? formData?.customBusinessUrl 
                        : formData?.businessName || '-'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">子网规模</span>
                    <span className="text-sm font-medium text-gray-900">
                      /{formData?.subnetSize || '-'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">月度预算</span>
                    <span className="text-sm font-medium text-gray-900">
                      ¥{formData?.budget || '-'}/月
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">合约期</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData?.commitmentPeriod === '0' 
                        ? '无合约期' 
                        : `${formData?.commitmentPeriod || '-'}个月`}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">数据库交付标准</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData?.database || '-'}
                    </span>
                  </div>
                  {formData?.notes && (
                    <div className="px-4 py-3">
                      <span className="text-sm text-gray-500 block mb-1">备注说明</span>
                      <span className="text-sm text-gray-900">
                        {formData.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>

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
                  下一步：服务器配置
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