import React from 'react';
import { Check, Globe2, Server, Building2, Network, Database, Calendar, DollarSign, Clock } from 'lucide-react';
import { COUNTRIES } from '../../../constants/countries';

interface ConfirmationProps {
  formData: any;
  onBack: () => void;
  onSubmit: () => void;
}

export function Confirmation({ formData, onBack, onSubmit }: ConfirmationProps) {
  const getCountryName = () => {
    if (formData.country === 'custom') return formData.customCountry;
    const country = COUNTRIES.find(c => c.code === formData.country);
    return country ? `${country.flag} ${country.name}` : '';
  };

  const getBusinessType = () => {
    if (formData.businessType === 'custom') return formData.customBusinessType;
    return formData.businessType;
  };

  const sections = [
    {
      title: '基础信息',
      items: [
        { icon: Globe2, label: '国家/地区', value: getCountryName() },
        { icon: Server, label: 'IP类型', value: formData.type === 'native' ? '原生' : '广播' },
        { icon: Building2, label: '业务类型', value: getBusinessType() },
      ],
    },
    {
      title: '网络配置',
      items: [
        { icon: Network, label: '子网规模', value: formData.subnetSize },
        { icon: Network, label: '带宽要求', value: `${formData.bandwidth} ${formData.bandwidthUnit}` },
        { icon: Database, label: '数据库要求', value: formData.database },
      ],
    },
    {
      title: '交付信息',
      items: [
        { 
          icon: Calendar,
          label: '期望交付时间', 
          value: `${formData.deliveryTimeStart} 至 ${formData.deliveryTimeEnd}` 
        },
        { icon: DollarSign, label: '月度预算', value: `$${formData.budget}` },
        { icon: Clock, label: '承诺期限', value: `${formData.commitmentPeriod} 个月` },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-3 gap-6">
                {section.items.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="space-y-2">
                    <dt className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon className="h-4 w-4" />
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg
            hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            transition-all duration-200"
        >
          上一步
        </button>
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 
            bg-gradient-to-r from-blue-600 to-blue-500 
            text-white text-base font-medium rounded-lg
            hover:from-blue-500 hover:to-blue-400
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
            transition-all duration-200 shadow-lg shadow-blue-600/20
            hover:shadow-xl hover:shadow-blue-600/30"
        >
          <Check className="h-5 w-5" />
          提交申请
        </button>
      </div>
    </div>
  );
}