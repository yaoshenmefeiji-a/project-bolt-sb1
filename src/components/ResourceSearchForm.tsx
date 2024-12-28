import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CountrySelect } from './CountrySelect';

// 热门国家列表
const COUNTRIES = [
  { code: 'US', name: '美国', flag: '🇺🇸' },
  { code: 'GB', name: '英国', flag: '🇬🇧' },
  { code: 'DE', name: '德国', flag: '🇩🇪' },
  { code: 'FR', name: '法国', flag: '🇫🇷' },
  { code: 'JP', name: '日本', flag: '🇯🇵' },
  { code: 'KR', name: '韩国', flag: '🇰🇷' },
  { code: 'SG', name: '新加坡', flag: '🇸🇬' },
  { code: 'AU', name: '澳大利亚', flag: '🇦🇺' },
  { code: 'CA', name: '加拿大', flag: '🇨🇦' },
  { code: 'NL', name: '荷兰', flag: '🇳🇱' },
  { code: 'IT', name: '意大利', flag: '🇮🇹' },
  { code: 'ES', name: '西班牙', flag: '🇪🇸' },
  { code: 'CH', name: '瑞士', flag: '🇨🇭' },
  { code: 'SE', name: '瑞典', flag: '🇸🇪' },
  { code: 'NO', name: '挪威', flag: '🇳🇴' },
  { code: 'DK', name: '丹麦', flag: '🇩🇰' },
  { code: 'FI', name: '芬兰', flag: '🇫🇮' },
  { code: 'IE', name: '爱尔兰', flag: '🇮🇪' },
  { code: 'BR', name: '巴西', flag: '🇧🇷' },
  { code: 'IN', name: '印度', flag: '🇮🇳' },
  { code: 'RU', name: '俄罗斯', flag: '🇷🇺' },
  { code: 'AE', name: '阿联酋', flag: '🇦🇪' },
  { code: 'IL', name: '以色列', flag: '🇮🇱' },
  { code: 'HK', name: '香港', flag: '🇭🇰' },
  { code: 'TW', name: '台湾', flag: '🇹🇼' },
  { code: 'MY', name: '马来西亚', flag: '🇲🇾' },
  { code: 'TH', name: '泰国', flag: '🇹🇭' },
  { code: 'VN', name: '越南', flag: '🇻🇳' },
  { code: 'ID', name: '印度尼西亚', flag: '🇮🇩' },
  { code: 'PH', name: '菲律宾', flag: '🇵🇭' },
  { code: 'MX', name: '墨西哥', flag: '🇲🇽' },
  { code: 'AR', name: '阿根廷', flag: '🇦🇷' },
  { code: 'CL', name: '智利', flag: '🇨🇱' },
  { code: 'CO', name: '哥伦比亚', flag: '🇨🇴' },
  { code: 'PE', name: '秘鲁', flag: '🇵🇪' },
  { code: 'ZA', name: '南非', flag: '🇿🇦' },
  { code: 'EG', name: '埃及', flag: '🇪🇬' },
  { code: 'TR', name: '土耳其', flag: '🇹🇷' },
  { code: 'SA', name: '沙特阿拉伯', flag: '🇸🇦' },
  { code: 'PL', name: '波兰', flag: '🇵🇱' },
  { code: 'CZ', name: '捷克', flag: '🇨🇿' },
  { code: 'HU', name: '匈牙利', flag: '🇭🇺' },
  { code: 'RO', name: '罗马尼亚', flag: '🇷🇴' },
  { code: 'GR', name: '希腊', flag: '🇬🇷' },
  { code: 'PT', name: '葡萄牙', flag: '🇵🇹' },
  { code: 'NZ', name: '新西兰', flag: '🇳🇿' },
  { code: 'BE', name: '比利时', flag: '🇧🇪' },
  { code: 'AT', name: '奥地利', flag: '🇦🇹' },
  { code: 'UA', name: '乌克兰', flag: '🇺🇦' },
  { code: 'BG', name: '保加利亚', flag: '🇧🇬' }
] as const;

interface ResourceSearchFormProps {
  country: string;
  resourceType: string;
  onCountryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSearch: () => void;
}

export function ResourceSearchForm({
  country,
  resourceType,
  onCountryChange,
  onTypeChange,
  onSearch
}: ResourceSearchFormProps) {
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
            <label className="block text-lg font-medium text-gray-900 mb-3">
              选择国家
            </label>
            <div>
              <CountrySelect
                value={country}
                onChange={(value) => {
                  onCountryChange(value);
                  setErrors(prev => ({ ...prev, country: '' }));
                }}
                countries={COUNTRIES}
              />
              {errors.country && (
                <p className="mt-2 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-3">
              选择IP类型
            </label>
            <div className="relative">
              <button
                type="button"
                className={`relative w-full h-[42px] bg-white pl-4 pr-10 text-left border ${
                  errors.type ? 'border-red-300' : 'border-gray-200'
                } rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                onClick={() => document.getElementById('type-select')?.click()}
              >
                <span className="flex items-center h-full">
                  {resourceType ? (
                    <span className="leading-none text-gray-900">
                      {resourceType === 'native' ? '原生' : '广播'}
                    </span>
                  ) : (
                    <span className="text-gray-500 leading-none">请选择类型</span>
                  )}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </span>
              </button>
              <select
                id="type-select"
                className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
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
            </div>
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
            搜索
          </button>
        </div>
      </div>
    </div>
  );
}