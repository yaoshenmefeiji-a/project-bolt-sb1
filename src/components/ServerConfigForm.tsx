import React, { useState, useEffect } from 'react';
import { ChevronDown, Copy, HardDrive, Monitor } from 'lucide-react';
import { ServerConfig } from '../types/server';

interface ServerConfig {
  serverSpec: string;
  bandwidthType: 'dedicated' | 'shared';
  bandwidthSpeed: string;
  osType: 'Linux' | 'Windows' | '';
  os: string;
  osVersion: string;
  period: 'month' | 'quarter' | 'halfYear' | 'year';
  notes: string;
  price: number;
  cpu: string;
  memory: string;
  storage: string;
}

const SERVER_SPECS = [
  { id: 'entry', name: '入门配置', cpu: '2核', memory: '2GB', disk: '40GB' },
  { id: 'basic', name: '基础配置', cpu: '2核', memory: '4GB', disk: '40GB' },
  { id: 'standard', name: '标准配置', cpu: '4核', memory: '4GB', disk: '40GB' },
  { id: 'advanced', name: '高级配置', cpu: '4核', memory: '8GB', disk: '50GB' },
  { id: 'professional', name: '专业配置', cpu: '8核', memory: '12GB', disk: '70GB' },
  { id: 'ultimate', name: '旗舰配置', cpu: '8核', memory: '16GB', disk: '100GB' },
];

const BANDWIDTH_SPEEDS = [
  { speed: '10', limit: '1TB', price: 50 },
  { speed: '20', limit: '2TB', price: 90 },
  { speed: '50', limit: '5TB', price: 200 },
  { speed: '100', limit: '10TB', price: 350 },
  { speed: '200', limit: '20TB', price: 600 },
  { speed: '500', limit: '50TB', price: 1400 },
];

const OS_OPTIONS = {
  Linux: [
    { name: 'Ubuntu', version: '22.04 LTS', description: '长期支持版本' },
    { name: 'Ubuntu', version: '20.04 LTS', description: '长期支持版本' },
    { name: 'CentOS', version: '7.9', description: '企业级稳定版本' },
    { name: 'Debian', version: '11', description: '稳定可靠' },
    { name: 'Debian', version: '10', description: '稳定可靠' },
  ],
  Windows: [
    { name: 'Windows Server', version: '2022', description: '企业级服务器系统' },
    { name: 'Windows Server', version: '2019', description: '企业级服务器系统' },
  ],
};

interface ServerConfigFormProps {
  onConfigChange: (config: ServerConfig) => void;
  initialConfig: ServerConfig | null;
}

export function ServerConfigForm({ onConfigChange, initialConfig }: ServerConfigFormProps) {
  const [config, setConfig] = useState<ServerConfig>(
    initialConfig || {
      serverSpec: '',
      bandwidthType: 'dedicated',
      bandwidthSpeed: '',
      osType: '',
      os: '',
      osVersion: '',
      period: 'month',
      notes: '',
      price: 0,
      cpu: '',
      memory: '',
      storage: ''
    }
  );

  // 当配置改变时通知父组件
  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  const handleChange = (field: keyof ServerConfig, value: string) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      
      // 更新 CPU、内存和存储信息
      if (field === 'serverSpec') {
        const selectedSpec = SERVER_SPECS.find(spec => spec.id === value);
        if (selectedSpec) {
          newConfig.cpu = selectedSpec.cpu;
          newConfig.memory = selectedSpec.memory;
          newConfig.storage = selectedSpec.disk;
        }
      }

      // 计算价格
      newConfig.price = calculatePrice(newConfig);
      return newConfig;
    });
  };

  const calculatePrice = (config: ServerConfig) => {
    let price = 0;
    
    // 根据服务器规格计算基础价格
    const selectedSpec = SERVER_SPECS.find(spec => spec.id === config.serverSpec);
    if (selectedSpec) {
      switch (config.serverSpec) {
        case 'entry': price += 200; break;
        case 'basic': price += 300; break;
        case 'standard': price += 500; break;
        case 'advanced': price += 800; break;
        case 'professional': price += 1200; break;
        case 'ultimate': price += 2000; break;
      }
    }

    // 根据带宽计算价格
    if (config.bandwidthType === 'dedicated') {
      const bandwidthOption = BANDWIDTH_SPEEDS.find(b => b.speed === config.bandwidthSpeed);
      if (bandwidthOption) {
        price += bandwidthOption.price;
      }
    }

    // 根据时长计算折扣
    switch (config.period) {
      case 'quarter':
        price = price * 3 * 0.95; // 季付95折
        break;
      case 'halfYear':
        price = price * 6 * 0.90; // 半年付90折
        break;
      case 'year':
        price = price * 12 * 0.85; // 年付85折
        break;
      default:
        // 月付无折扣
        break;
    }

    return Math.round(price); // 四舍五入到整数
  };

  return (
    <div className="space-y-8">
      {/* 服务器套餐选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">服务器套餐选择</h3>
        <div className="grid grid-cols-3 gap-4">
          {SERVER_SPECS.map(spec => (
            <button
              key={spec.id}
              onClick={() => handleChange('serverSpec', spec.id)}
              className={`flex flex-col items-start p-4 rounded-lg border ${
                config.serverSpec === spec.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="font-medium text-gray-900">{spec.name}</div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Copy className="w-4 h-4 mr-2" />
                  {spec.cpu}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Monitor className="w-4 h-4 mr-2" />
                  {spec.memory}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <HardDrive className="w-4 h-4 mr-2" />
                  {spec.disk}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 带宽选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">带宽选择</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleChange('bandwidthType', 'dedicated')}
              className={`flex-1 p-4 rounded-lg border ${
                config.bandwidthType === 'dedicated'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="font-medium text-blue-600">独享带宽</div>
              <div className="text-sm text-gray-500 mt-1">专属网络带宽，无限量限制</div>
              <div className="text-sm text-gray-500 mt-1">适合对网络质量要求较高的业务</div>
            </button>
            <button
              onClick={() => handleChange('bandwidthType', 'shared')}
              className={`flex-1 p-4 rounded-lg border ${
                config.bandwidthType === 'shared'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="font-medium text-gray-900">共享带宽</div>
              <div className="text-sm text-gray-500 mt-1">共享网络带宽，按流量计费</div>
              <div className="text-sm text-gray-500 mt-1">性价比高，适合一般业务</div>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {BANDWIDTH_SPEEDS.map(({ speed, limit, price }) => (
              <button
                key={speed}
                onClick={() => handleChange('bandwidthSpeed', speed)}
                className={`p-4 rounded-lg border ${
                  config.bandwidthSpeed === speed
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="font-medium text-gray-900">{speed}Mbps</div>
                <div className="text-sm text-gray-500 mt-1">流量限制: {limit}/月</div>
                <div className="text-sm text-blue-600 mt-1">¥{price}/月</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 系统选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">系统选择</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                handleChange('osType', 'Linux');
                handleChange('os', '');
                handleChange('osVersion', '');
              }}
              className={`flex-1 p-4 rounded-lg border ${
                config.osType === 'Linux'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="font-medium text-gray-900">Linux</div>
            </button>
            <button
              onClick={() => {
                handleChange('osType', 'Windows');
                handleChange('os', '');
                handleChange('osVersion', '');
              }}
              className={`flex-1 p-4 rounded-lg border ${
                config.osType === 'Windows'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="font-medium text-gray-900">Windows</div>
            </button>
          </div>
          {config.osType && (
            <div className="grid grid-cols-3 gap-4">
              {OS_OPTIONS[config.osType].map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleChange('os', option.name);
                    handleChange('osVersion', option.version);
                  }}
                  className={`p-4 rounded-lg border ${
                    config.os === option.name && config.osVersion === option.version
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } transition-colors`}
                >
                  <div className="font-medium text-gray-900">{option.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.version}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 时长选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">时长选择</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleChange('period', 'month')}
            className={`flex-1 p-4 rounded-lg border ${
              config.period === 'month'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } transition-colors`}
          >
            <div className="font-medium text-gray-900">月付</div>
          </button>
          <button
            onClick={() => handleChange('period', 'quarter')}
            className={`flex-1 p-4 rounded-lg border ${
              config.period === 'quarter'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } transition-colors relative`}
          >
            <div className="font-medium text-gray-900">季付</div>
            <div className="absolute top-1 right-2 text-xs text-orange-500">省5%</div>
          </button>
          <button
            onClick={() => handleChange('period', 'halfYear')}
            className={`flex-1 p-4 rounded-lg border ${
              config.period === 'halfYear'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } transition-colors relative`}
          >
            <div className="font-medium text-gray-900">半年付</div>
            <div className="absolute top-1 right-2 text-xs text-orange-500">省10%</div>
          </button>
          <button
            onClick={() => handleChange('period', 'year')}
            className={`flex-1 p-4 rounded-lg border ${
              config.period === 'year'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } transition-colors relative`}
          >
            <div className="font-medium text-gray-900">年付</div>
            <div className="absolute top-1 right-2 text-xs text-orange-500">省15%</div>
          </button>
        </div>
      </div>

      {/* 备注 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">服务器备注</h3>
          <span className="text-sm text-gray-500">(选填)</span>
        </div>
        <textarea
          value={config.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="您可以在这里填写其他特殊需求或备注信息..."
        />
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>您可以在这里填写特殊的系统配置需求，安全需求等</span>
          <span className="ml-auto">0/500</span>
        </div>
      </div>
    </div>
  );
} 