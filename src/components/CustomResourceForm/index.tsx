import React, { useState } from 'react';
import { StepIndicator } from '../StepIndicator';
import { StepContent } from './StepContent';
import { Sparkles } from 'lucide-react';

const FORM_STEPS = [
  { title: '基础信息', status: 'current' },
  { title: '网络配置', status: 'upcoming' },
  { title: '交付信息', status: 'upcoming' },
  { title: '确认信息', status: 'upcoming' },
] as const;

const initialFormData = {
  // 基础信息
  country: '',
  customCountry: '',
  type: '',
  businessType: '',
  customBusinessType: '',
  
  // 网络配置
  subnetSize: '',
  bandwidth: '',
  bandwidthUnit: 'Mbps',
  database: '',
  
  // 交付信息
  deliveryTimeStart: '',
  deliveryTimeEnd: '',
  budget: '',
  commitmentPeriod: '',
};

export function CustomResourceForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  const steps = FORM_STEPS.map((step, index) => ({
    ...step,
    status: index === currentStep 
      ? 'current'
      : index < currentStep 
        ? 'completed' 
        : 'upcoming'
  }));

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* 页面标题 */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-600">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">定制您的专属资源</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          IP资源定制申请
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          填写以下信息，我们将为您量身定制最适合的IP资源解决方案
        </p>
      </div>

      {/* 步骤指示器 */}
      <div className="px-8 py-6">
        <StepIndicator steps={steps} />
      </div>

      {/* 表单内容 */}
      <div className="px-8 pb-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
          <StepContent
            currentStep={currentStep}
            formData={formData}
            onChange={setFormData}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* 底部提示 */}
      <div className="flex items-center justify-center gap-1 border-t border-gray-100 bg-gray-50 px-8 py-4 text-sm text-gray-500">
        <span>需要帮助？请联系我们的客服团队</span>
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
          获取支持
        </a>
      </div>
    </div>
  );
}