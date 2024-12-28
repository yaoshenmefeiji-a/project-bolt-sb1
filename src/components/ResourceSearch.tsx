import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { COUNTRIES } from '../constants/countries';

interface ResourceSearchProps {
  country: string;
  resourceType: string;
  onCountryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSearch: () => void;
}

export function ResourceSearch({
  country,
  resourceType,
  onCountryChange,
  onTypeChange,
  onSearch
}: ResourceSearchProps) {
  const [errors, setErrors] = useState({
    country: '',
    type: ''
  });

  const handleSearch = () => {
    const newErrors = {
      country: country ? '' : '请选择国家/地区',
      type: resourceType ? '' : '请选择IP类型'
    };
    
    setErrors(newErrors);
    
    if (country && resourceType) {
      onSearch();
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              国家/地区
            </label>
            <select
              className={`block w-full h-12 px-4 rounded-lg text-base ${
                errors.country 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              value={country}
              onChange={(e) => {
                onCountryChange(e.target.value);
                setErrors(prev => ({ ...prev, country: '' }));
              }}
            >
              <option value="">请选择国家</option>
              {COUNTRIES.map(({ code, flag, name }) => (
                <option key={code} value={code}>
                  {flag} {name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-2 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              IP类型
            </label>
            <select
              className={`block w-full h-12 px-4 rounded-lg text-base ${
                errors.type 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              value={resourceType}
              onChange={(e) => {
                onTypeChange(e.target.value);
                setErrors(prev => ({ ...prev, type: '' }));
              }}
            >
              <option value="">请选择类型</option>
              <option value="native">原生</option>
              <option value="broadcast">广播</option>
            </select>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            搜索资源
          </button>
        </div>
      </div>
    </div>
  );
}