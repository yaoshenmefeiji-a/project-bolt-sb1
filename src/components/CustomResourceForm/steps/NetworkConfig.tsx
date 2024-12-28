import React from 'react';
import { Network, Gauge, Database } from 'lucide-react';
import { SUBNET_SIZES } from '../../../constants/subnetSizes';
import { DATABASE_OPTIONS } from '../../../constants/database';
import { SelectField } from '../../ui/SelectField';

interface NetworkConfigProps {
  formData: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function NetworkConfig({ formData, onChange, onNext, onBack }: NetworkConfigProps) {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  const isValid = formData.subnetSize && formData.database;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {/* 子网规模 */}
        <SelectField
          icon={Network}
          label="子网规模"
          value={formData.subnetSize}
          onChange={handleChange('subnetSize')}
          placeholder="请选择规模"
        >
          <option value="">请选择规模</option>
          {SUBNET_SIZES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </SelectField>

        {/* 带宽要求 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-base font-medium text-gray-900">
            <Gauge className="h-5 w-5 text-gray-400" />
            带宽要求
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                className="block w-full rounded-lg border-gray-200 bg-white px-4 py-3
                  shadow-sm outline-none ring-1 ring-gray-200
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  transition-all duration-200"
                placeholder="请输入带宽"
                value={formData.bandwidth}
                onChange={handleChange('bandwidth')}
              />
            </div>
            <select
              className="w-32 rounded-lg border-gray-200 bg-white px-4 py-3
                shadow-sm outline-none ring-1 ring-gray-200
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-all duration-200"
              value={formData.bandwidthUnit}
              onChange={handleChange('bandwidthUnit')}
            >
              <option value="Mbps">Mbps</option>
              <option value="Gbps">Gbps</option>
            </select>
          </div>
        </div>

        {/* 数据库要求 */}
        <SelectField
          icon={Database}
          label="数据库要求"
          value={formData.database}
          onChange={handleChange('database')}
          placeholder="请选择数据库"
        >
          <option value="">请选择数据库</option>
          {DATABASE_OPTIONS.map(db => (
            <option key={db} value={db}>{db}</option>
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