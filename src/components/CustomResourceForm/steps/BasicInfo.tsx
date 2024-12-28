import React from 'react';
import { Globe2, Server, Building2 } from 'lucide-react';
import { COUNTRIES } from '../../../constants/countries';
import { BUSINESS_TYPES } from '../../../constants/businessTypes';
import { Select } from '../../ui/Select';

interface BasicInfoProps {
  formData: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function BasicInfo({ formData, onChange, onNext }: BasicInfoProps) {
  const countryOptions = COUNTRIES.map(({ code, flag, name }) => ({
    value: code,
    label: name,
    icon: flag
  }));

  const typeOptions = [
    { value: 'native', label: '原生' },
    { value: 'broadcast', label: '广播' }
  ];

  const businessTypeOptions = BUSINESS_TYPES.map(type => ({
    value: type,
    label: type
  }));

  const handleChange = (field: string) => (value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const isValid = formData.country && formData.type && formData.businessType;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <Select
          label="国家/地区"
          value={formData.country}
          onChange={handleChange('country')}
          options={countryOptions}
          placeholder="请选择国家"
        />

        <Select
          label="IP类型"
          value={formData.type}
          onChange={handleChange('type')}
          options={typeOptions}
          placeholder="请选择类型"
        />

        <Select
          label="业务类型"
          value={formData.businessType}
          onChange={handleChange('businessType')}
          options={businessTypeOptions}
          placeholder="请选择业务类型"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="
            inline-flex items-center px-6 py-3 
            bg-gradient-to-r from-blue-600 to-blue-500 
            text-white text-base font-medium rounded-lg
            hover:from-blue-500 hover:to-blue-400
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg shadow-blue-600/20
            hover:shadow-xl hover:shadow-blue-600/30
            disabled:hover:shadow-none
          "
        >
          下一步
        </button>
      </div>
    </div>
  );
}