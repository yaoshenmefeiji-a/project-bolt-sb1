import React, { useState } from 'react';
import { Calendar, ChevronDown, Info, Sparkles } from 'lucide-react';
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
] as const;

// 将类型修改为
type Country = {
  code: string;
  name: string;
  flag: string;
};

interface CustomResourceFormProps {
  onFormChange?: (formData: any) => void;
}

export function CustomResourceForm({ onFormChange }: CustomResourceFormProps) {
  // 表单状态
  const [formData, setFormData] = useState({
    country: '',
    usageType: '',
    businessName: '',
    customBusinessUrl: '',
    subnetSize: '',
    budget: '',
    commitmentPeriod: '',
    database: '',
    notes: ''
  });

  // 处理表单字段变化
  const handleChange = (field: string, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value,
      // 当业务名称不是自定义时，清空自定义URL
      ...(field === 'businessName' && value !== 'custom' ? { customBusinessUrl: '' } : {})
    };
    setFormData(newFormData);
    onFormChange?.(newFormData);
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* 页面标题 */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          IP资源定制
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          填写以下信息，我们将为您量身定制最适合的IP资源解决方案
        </p>
      </div>

      {/* 表单内容 */}
      <div className="px-8 py-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                国家/地区
              </label>
              <CountrySelect
                value={formData.country}
                onChange={(value) => handleChange('country', value)}
                countries={COUNTRIES}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP类型
              </label>
              <div className="relative">
                <select 
                  value={formData.usageType}
                  onChange={(e) => handleChange('usageType', e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="native">原生</option>
                  <option value="broadcast">广播</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AS属性
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="ISP"
                  disabled
                  className="w-full h-[42px] rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-500 shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                业务名称
              </label>
              <div className="relative">
                <select 
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择或输入</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="wechat">WeChat</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter</option>
                  <option value="telegram">Telegram</option>
                  <option value="custom">自定义业务网址...</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {formData.businessName === 'custom' && (
                <input
                  type="text"
                  value={formData.customBusinessUrl}
                  onChange={(e) => handleChange('customBusinessUrl', e.target.value)}
                  placeholder="请输入您的业务网址"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                子网规模
              </label>
              <div className="relative">
                <select 
                  value={formData.subnetSize}
                  onChange={(e) => handleChange('subnetSize', e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="24">/24 (256 IPs)</option>
                  <option value="23">/23 (512 IPs)</option>
                  <option value="22">/22 (1024 IPs)</option>
                  <option value="21">/21 (2048 IPs)</option>
                  <option value="20">/20 (4096 IPs)</option>
                  <option value="19">/19 (8192 IPs)</option>
                  <option value="18">/18 (16384 IPs)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                月度预算
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500">¥</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="请输入预算金额"
                  className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  合约期
                </label>
                <span className="text-xs text-gray-500">合约期和付款周期可以不一致</span>
              </div>
              <div className="relative">
                <select 
                  value={formData.commitmentPeriod}
                  onChange={(e) => handleChange('commitmentPeriod', e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="1">1个月</option>
                  <option value="3">3个月</option>
                  <option value="6">6个月</option>
                  <option value="12">12个月</option>
                  <option value="24">24个月</option>
                  <option value="36">36个月</option>
                  <option value="0">无合约期</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数据库交付标准
              </label>
              <div className="relative">
                <select 
                  value={formData.database}
                  onChange={(e) => handleChange('database', e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="ipinfo">Ipinfo</option>
                  <option value="maxmind">Maxmind</option>
                  <option value="ipdata">Ipdata</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP资源备注
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请输入其他特殊要求或说明"
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => {
                // TODO: 处理表单提交
                console.log('Form submitted:', formData);
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
                text-white text-base font-medium rounded-lg 
                hover:from-blue-500 hover:to-blue-400
                focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                transition-all duration-200 shadow-lg shadow-blue-600/20
                hover:shadow-xl hover:shadow-blue-600/30"
            >
              提交申请
            </button>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="flex items-center justify-center gap-1 border-t border-gray-100 bg-gray-50 px-8 py-4 text-sm text-gray-500">
        <Info className="h-4 w-4" />
        <span>需要帮助？请联系我们的客服团队</span>
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
          获取支持
        </a>
      </div>
    </div>
  );
}