import React, { useState } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
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

// 将类型修改为
type Country = {
  code: string;
  name: string;
  flag: string;
};

export function CustomResourceForm() {
  // 表单状态
  const [formData, setFormData] = useState({
    country: '',
    usageType: '',
    businessName: '',
    customBusinessUrl: '',
    subnetSize: '',
    budget: '',
    commitmentPeriod: '',
    deliveryTimeStart: '',
    deliveryTimeEnd: '',
    database: '',
    notes: ''
  });

  // 处理表单字段变化
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // 当业务名称不是自定义时，清空自定义URL
      ...(field === 'businessName' && value !== 'custom' ? { customBusinessUrl: '' } : {})
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">定制资源申请</h2>
          <p className="mt-2 text-gray-600">请填写以下信息，我们将为您定制最适合的IP资源方案</p>
        </div>

        <div className="space-y-8">
          <div>
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
                    <option value="snapchat">Snapchat</option>
                    <option value="netflix">Netflix</option>
                    <option value="spotify">Spotify</option>
                    <option value="amazon">Amazon</option>
                    <option value="google">Google</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="reddit">Reddit</option>
                    <option value="twitch">Twitch</option>
                    <option value="discord">Discord</option>
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
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        handleChange('subnetSize', '256');
                      } else {
                        handleChange('subnetSize', e.target.value);
                      }
                    }}
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
                    <option value="custom">自定义数量...</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {formData.subnetSize === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="number"
                      value={formData.subnetSize}
                      onChange={(e) => {
                        const value = Math.floor(parseInt(e.target.value) / 256) * 256;
                        handleChange('subnetSize', value.toString());
                      }}
                      step="256"
                      min="256"
                      placeholder="请输入IP数量（256的整倍数）"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月度预算
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
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
                  交付时间
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">希望交付时间</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.deliveryTimeStart}
                        onChange={(e) => handleChange('deliveryTimeStart', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">最迟交付时间</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.deliveryTimeEnd}
                        onChange={(e) => handleChange('deliveryTimeEnd', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
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
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => {
                // TODO: 处理表单提交
                console.log('Form submitted:', formData);
              }}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              提交申请
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}