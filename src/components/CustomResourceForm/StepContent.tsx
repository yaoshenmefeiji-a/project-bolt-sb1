import React from 'react';
import { BasicInfo } from './steps/BasicInfo';
import { NetworkConfig } from './steps/NetworkConfig';
import { DeliveryInfo } from './steps/DeliveryInfo';
import { Confirmation } from './steps/Confirmation';

interface StepContentProps {
  currentStep: number;
  formData: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepContent({ currentStep, formData, onChange, onNext, onBack }: StepContentProps) {
  const steps = [
    {
      title: '基础信息',
      component: BasicInfo,
    },
    {
      title: '网络配置',
      component: NetworkConfig,
    },
    {
      title: '交付信息',
      component: DeliveryInfo,
    },
    {
      title: '确认信息',
      component: Confirmation,
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="mt-8">
      <CurrentStepComponent
        formData={formData}
        onChange={onChange}
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
}