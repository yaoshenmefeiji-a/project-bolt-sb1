import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { ArrowLeft, Upload, AlertCircle, Info, ExternalLink, Plus, X } from 'lucide-react';
import { CountrySelect } from '../components/CountrySelect';

// 热门国家列表
const COUNTRIES = [
  { code: 'US', name: '美国', flag: '🇺🇸' },
  { code: 'GB', name: '英国', flag: '🇬🇧' },
  { code: 'DE', name: '德国', flag: '🇩🇪' },
  { code: 'FR', name: '法国', flag: '🇫🇷' },
  { code: 'JP', name: '日本', flag: '🇯🇵' },
  { code: 'SG', name: '新加坡', flag: '🇸🇬' },
] as const;

// AS列表
const AS_OPTIONS = [
  { id: 'AS7018', name: 'AT&T', price: 20 },
  { id: 'AS10103', name: 'HKBN', price: 280 },
  { id: 'AS197537', name: 'WISDOM', price: 5 },
  { id: 'AS55201', name: 'SKYQUANTUM', price: 5 },
] as const;

// BYO-IP订单步骤
const BYOIP_STEPS = [
  { title: 'IP信息', status: 'current' as const },
  { title: '服务器配置', status: 'upcoming' as const },
  { title: '确认订单', status: 'upcoming' as const },
  { title: '购物车', status: 'upcoming' as const },
  { title: '支付', status: 'upcoming' as const },
];

interface IPPrefix {
  prefix: string;
  loaFile: File | null;
  geoUpdateService: boolean;
  geoCountry?: string;
  geoCity?: string;
}

interface BYOIPFormData {
  country: string;
  ipPrefixes: IPPrefix[];
  rpkiRequired: boolean;
  routeObject: boolean;
  asn: string;
}

export function BYOIPOrder() {
  const navigate = useNavigate();
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [selectedPrefixIndexes, setSelectedPrefixIndexes] = useState<number[]>([]);
  const [formData, setFormData] = useState<BYOIPFormData>({
    country: '',
    ipPrefixes: [{ prefix: '', loaFile: null, geoUpdateService: false }],
    rpkiRequired: false,
    routeObject: false,
    asn: '',
  });

  const handleChange = (field: keyof BYOIPFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrefixChange = (index: number, value: string) => {
    const newPrefixes = [...formData.ipPrefixes];
    newPrefixes[index] = { ...newPrefixes[index], prefix: value };
    handleChange('ipPrefixes', newPrefixes);
  };

  const handleFileChange = (indexes: number[], file: File | null) => {
    const newPrefixes = [...formData.ipPrefixes];
    indexes.forEach(index => {
      newPrefixes[index] = { ...newPrefixes[index], loaFile: file };
    });
    handleChange('ipPrefixes', newPrefixes);
  };

  const addPrefix = () => {
    handleChange('ipPrefixes', [...formData.ipPrefixes, { prefix: '', loaFile: null, geoUpdateService: false }]);
  };

  const removePrefix = (index: number) => {
    if (formData.ipPrefixes.length > 1) {
      const newPrefixes = formData.ipPrefixes.filter((_, i) => i !== index);
      handleChange('ipPrefixes', newPrefixes);
    }
  };

  const handleGeoServiceChange = (index: number, value: boolean) => {
    const newPrefixes = [...formData.ipPrefixes];
    newPrefixes[index] = { 
      ...newPrefixes[index], 
      geoUpdateService: value,
      geoCountry: value ? formData.country : undefined,
      geoCity: value ? '' : undefined
    };
    handleChange('ipPrefixes', newPrefixes);
  };

  const handleGeoCountryChange = (index: number, value: string) => {
    const newPrefixes = [...formData.ipPrefixes];
    newPrefixes[index] = { ...newPrefixes[index], geoCountry: value };
    handleChange('ipPrefixes', newPrefixes);
  };

  const handleGeoCityChange = (index: number, value: string) => {
    const newPrefixes = [...formData.ipPrefixes];
    newPrefixes[index] = { ...newPrefixes[index], geoCity: value };
    handleChange('ipPrefixes', newPrefixes);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate('/byo-ip/server', {
      state: {
        ipFormData: formData
      }
    });
  };

  const isFormValid = () => {
    return formData.country &&
           formData.ipPrefixes.every(p => p.prefix && p.loaFile) &&
           formData.asn;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={BYOIP_STEPS} />
        
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900"></h3>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="space-y-8">
                  {/* 地区选择 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      地区选择
                    </label>
                    <CountrySelect
                      value={formData.country}
                      onChange={(value) => handleChange('country', value)}
                      countries={COUNTRIES}
                    />
                  </div>

                  {/* IP前缀 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        IP前缀
                      </label>
                      <button
                        onClick={addPrefix}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Plus className="h-4 w-4" />
                        添加前缀
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.ipPrefixes.map((prefix, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={prefix.prefix}
                                onChange={(e) => handlePrefixChange(index, e.target.value)}
                                placeholder="例如：192.168.0.0/24"
                                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                              />
                              {formData.ipPrefixes.length > 1 && (
                                <button
                                  onClick={() => removePrefix(index)}
                                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LOA文件 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        LOA文件
                      </label>
                    </div>
                    <div className="space-y-3">
                      {formData.ipPrefixes.map((prefix, index) => (
                        prefix.prefix && (
                          <label
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              prefix.loaFile
                                ? 'bg-white border-gray-200'
                                : selectedPrefixIndexes.includes(index)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            } transition-colors`}
                          >
                            <div className="flex items-center flex-1">
                              {!prefix.loaFile && (
                                <input
                                  type="checkbox"
                                  checked={selectedPrefixIndexes.includes(index)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPrefixIndexes([...selectedPrefixIndexes, index]);
                                    } else {
                                      setSelectedPrefixIndexes(selectedPrefixIndexes.filter(i => i !== index));
                                    }
                                  }}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded mr-3"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-900">{prefix.prefix}</span>
                                  {!prefix.loaFile && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      需要上传LOA
                                    </span>
                                  )}
                                </div>
                                {prefix.loaFile && (
                                  <div className="text-sm text-gray-500 mt-1">{prefix.loaFile.name}</div>
                                )}
                              </div>
                            </div>
                            {prefix.loaFile && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleFileChange([index], null);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </label>
                        )
                      ))}
                    </div>
                    {selectedPrefixIndexes.length > 0 && (
                      <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-white">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>上传文件</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={(e) => {
                                  handleFileChange(selectedPrefixIndexes, e.target.files?.[0] || null);
                                  setSelectedPrefixIndexes([]);
                                }}
                                accept=".pdf,.doc,.docx"
                              />
                            </label>
                            <p className="pl-1">或拖拽文件到此处</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            支持 PDF、Word 格式
                          </p>
                        </div>
                      </div>
                    )}
                    {!formData.ipPrefixes.some(p => p.prefix) && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        请先添加IP前缀
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                      <Info className="h-4 w-4" />
                      <a href="#" className="hover:underline flex items-center gap-1 hover:text-blue-700 transition-colors">
                        了解如何填写LOA
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Geo更新服务 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Geo更新服务
                      </label>
                    </div>
                    <div className="space-y-3">
                      {formData.ipPrefixes.map((prefix, index) => (
                        prefix.prefix && (
                          <div key={index} className="flex flex-col gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm text-gray-900">
                                  {prefix.prefix}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={prefix.geoUpdateService}
                                    onChange={(e) => handleGeoServiceChange(index, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                                  />
                                  <span className="text-sm text-gray-900">需要Geo更新服务</span>
                                </label>
                                {prefix.geoUpdateService && (
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">$5</div>
                                    <div className="text-xs text-gray-500">一次性设置费</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {prefix.geoUpdateService && (
                              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    国家
                                  </label>
                                  <CountrySelect
                                    value={prefix.geoCountry || ''}
                                    onChange={(value) => handleGeoCountryChange(index, value)}
                                    countries={COUNTRIES}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    城市 <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={prefix.geoCity || ''}
                                    onChange={(e) => handleGeoCityChange(index, e.target.value)}
                                    placeholder="请输入城市名称"
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      ))}
                      {!formData.ipPrefixes.some(p => p.prefix) && (
                        <div className="text-sm text-gray-500 text-center py-4">
                          请先添加IP前缀
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                      <Info className="h-4 w-4" />
                      <a href="#" className="hover:underline flex items-center gap-1 hover:text-blue-700 transition-colors">
                        如何设置Geo指定URL
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* ROA(RPKI) */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        ROA(RPKI)
                      </label>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.rpkiRequired}
                          onChange={() => handleChange('rpkiRequired', true)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">已创建</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!formData.rpkiRequired}
                          onChange={() => handleChange('rpkiRequired', false)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">未创建</span>
                      </label>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>重要提醒：如果您的IP地址已经创建了RPKI，则必须创建相应的ROA记录。</span>
                    </div>
                  </div>

                  {/* route object */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Route object
                      </label>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">免费服务</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.routeObject}
                          onChange={() => handleChange('routeObject', true)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">需要创建</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!formData.routeObject}
                          onChange={() => handleChange('routeObject', false)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900">自行创建</span>
                      </label>
                    </div>
                  </div>

                  {/* BGP设置 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        BGP广播
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {AS_OPTIONS.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            formData.asn === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          } cursor-pointer transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={formData.asn === option.id}
                              onChange={() => handleChange('asn', option.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{option.name}</div>
                              <div className="text-sm text-gray-500">{option.id}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">${option.price}</div>
                            <div className="text-xs text-gray-500">一次性设置费</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* 费用预览 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">BYO-IP订单信息</h3>
                </div>
                <div className="px-4 py-3">
                  <div className="space-y-6">
                    {/* IP信息 */}
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-3">IP信息</div>
                      <div className="space-y-3">
                        {formData.ipPrefixes.map((prefix, index) => (
                          <div key={index} className="flex flex-col gap-2 py-2">
                            <div className="text-sm text-gray-900">{prefix.prefix}</div>
                            {prefix.geoUpdateService && (
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  {prefix.geoCountry && prefix.geoCity ? `${prefix.geoCountry}, ${prefix.geoCity}` : '未设置位置'}
                                </div>
                                <div className="text-xs text-blue-600">Geo更新</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BGP设置 */}
                    {formData.asn && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-sm font-medium text-gray-900 mb-3">BGP广播</div>
                        <div className="text-sm text-gray-900 mb-2">
                          {AS_OPTIONS.find(a => a.id === formData.asn)?.name} ({formData.asn})
                        </div>
                      </div>
                    )}

                    {/* 费用明细 */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-900 mb-3">费用明细</div>
                      <div className="space-y-2">
                        {formData.ipPrefixes.some(p => p.geoUpdateService) && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Geo更新服务</span>
                            <span className="font-medium text-gray-900">
                              ${formData.ipPrefixes.filter(p => p.geoUpdateService).length * 5}
                            </span>
                          </div>
                        )}
                        {formData.asn && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">BGP广播</span>
                            <span className="font-medium text-gray-900">
                              ${AS_OPTIONS.find(a => a.id === formData.asn)?.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 总费用 */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">总费用</div>
                        <div className="text-base font-medium text-gray-900">
                          ${
                            (formData.ipPrefixes.filter(p => p.geoUpdateService).length * 5) +
                            (formData.asn ? AS_OPTIONS.find(a => a.id === formData.asn)?.price || 0 : 0)
                          }
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-right mt-1">一次性设置费</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">注意事项：</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>请确保您拥有IP地址的所有权</li>
                      <li>LOA文件必须清晰完整</li>
                      <li>如有疑问请联系客服</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  返回选择
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isFormValid()}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    isFormValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  下一步：服务器配置
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 