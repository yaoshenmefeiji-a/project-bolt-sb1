import React from 'react';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { COMMITMENT_PERIODS } from '../../../constants/periods';
import { SelectField } from '../../ui/SelectField';

interface DeliveryInfoProps {
  formData: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DeliveryInfo({ formData, onChange, onNext, onBack }: DeliveryInfoProps) {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  const isValid = 
    formData.deliveryTimeStart &&
    formData.deliveryTimeEnd &&
    formData.budget &&
    formData.commitmentPeriod;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {/* 交付时间 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-base font-medium text-gray-900">
            <Calendar className="h-5 w-5 text-gray-400" />
            期望交付时间
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="block rounded-lg border-gray-200 bg-white px-4 py-3
                shadow-sm outline-none ring-1 ring-gray-200
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-all duration-200"
              value={formData.deliveryTimeStart}
              onChange={handleChange('deliveryTimeStart')}
            />
            <input
              type="date"
              className="block rounded-lg border-gray-200 bg-white px-4 py-3
                shadow-sm outline-none ring-1 ring-gray-200
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-all duration-200"
              value={formData.deliveryTimeEnd}
              onChange={handleChange('deliveryTimeEnd')}
            />
          </div>
        </div>

        {/* 月度预算 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-base font-medium text-gray-900">
            <DollarSign className="h-5 w-5 text-gray-400" />
            月度预算
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
              $
            </span>
            <input
              type="number"
              className="block w-full rounded-lg border-gray-200 bg-white pl-8 pr-4 py-3
                shadow-sm outline-none ring-1 ring-gray-200
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-all duration-200"
              placeholder="请输入预算金额"
              value={formData.budget}
              onChange={handleChange('budget')}
            />
          </div>
        </div>

        {/* 承诺期限 */}
        <SelectField
          icon={Clock}
          label="承诺期限"
          value={formData.commitmentPeriod}
          onChange={handleChange('commitmentPeriod')}
          placeholder="请选择期限"
        >
          <option value="">请选择期限</option>
          {COMMITMENT_PERIODS.map(period => (
            <option key={period} value={period}>{period} 个月</option>
          ))}
        </SelectField>
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
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
            text-white text-base font-medium rounded-lg
            hover:from-blue-500 hover:to-blue-400
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg shadow-blue-600/20
            hover:shadow-xl hover:shadow-blue-600/30
            disabled:hover:shadow-none"
        >
          下一步
        </button>
      </div>
    </div>
  );
}