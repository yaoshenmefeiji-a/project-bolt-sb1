import React, { useState, useEffect } from 'react';
import { ChevronDown, Copy, HardDrive, Monitor } from 'lucide-react';
import { ServerConfig as IServerConfig } from '../types/server';

export const SERVER_SPECS = [
  { id: 'entry', name: '入门配置', cpu: '2 Core', memory: '2 GB RAM', disk: '40 GB SSD', price: 200 },
  { id: 'basic', name: '基础配置', cpu: '2 Core', memory: '4 GB RAM', disk: '40 GB SSD', price: 300 },
  { id: 'standard', name: '标准配置', cpu: '4 Core', memory: '4 GB RAM', disk: '40 GB SSD', price: 500 },
  { id: 'advanced', name: '高级配置', cpu: '4 Core', memory: '8 GB RAM', disk: '50 GB SSD', price: 800 },
  { id: 'professional', name: '专业配置', cpu: '8 Core', memory: '12 GB RAM', disk: '70 GB SSD', price: 1200 },
  { id: 'ultimate', name: '旗舰配置', cpu: '8 Core', memory: '16 GB RAM', disk: '100 GB SSD', price: 2000 },
];

export const BANDWIDTH_SPEEDS = [
  { speed: '10', limit: '1TB', price: 50 },
  { speed: '20', limit: '2TB', price: 90 },
  { speed: '50', limit: '5TB', price: 200 },
  { speed: '100', limit: '10TB', price: 350 },
  { speed: '200', limit: '20TB', price: 600 },
  { speed: '500', limit: '50TB', price: 1400 },
];

const OS_OPTIONS = {
  CentOS: [
    { version: '7.9', description: '企业级稳定版本' },
    { version: '7.8', description: '企业级稳定版本' },
    { version: '7.6', description: '企业级稳定版本' },
    { version: '8.5', description: '新一代企业版' },
  ],
  Ubuntu: [
    { version: '22.04 LTS', description: '长期支持版本' },
    { version: '20.04 LTS', description: '长期支持版本' },
    { version: '18.04 LTS', description: '长期支持版本' },
    { version: '16.04 LTS', description: '长期支持版本' },
  ],
  Debian: [
    { version: '12', description: '最新稳定版' },
    { version: '11', description: '稳定可靠' },
    { version: '10', description: '经典稳定版' },
    { version: '9', description: '传统稳定版' },
  ],
  AlmaLinux: [
    { version: '9.2', description: '最新版本' },
    { version: '9.1', description: '稳定版本' },
    { version: '9.0', description: 'CentOS 替代版' },
    { version: '8.8', description: '企业级版本' },
  ],
};

interface ServerConfigFormProps {
  onConfigChange: (config: IServerConfig) => void;
  initialConfig: IServerConfig | null;
}

export function ServerConfigForm({ onConfigChange, initialConfig }: ServerConfigFormProps) {
  const [config, setConfig] = useState<IServerConfig>(
    initialConfig || {
      serverSpec: 'entry',
      bandwidthType: 'dedicated',
      bandwidthSpeed: '10',
      osType: 'Linux',
      os: 'CentOS',
      osVersion: '7.9',
      period: 'month',
      notes: '',
      cpu: SERVER_SPECS[0].cpu,
      memory: SERVER_SPECS[0].memory,
      storage: SERVER_SPECS[0].disk,
      price: SERVER_SPECS[0].price,
      bandwidthPrice: BANDWIDTH_SPEEDS[0].price
    }
  );

  // 当配置改变时通知父组件
  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  const handleChange = (field: keyof IServerConfig, value: string) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      
      // 更新 CPU、内存、存储和价格信息
      if (field === 'serverSpec') {
        const selectedSpec = SERVER_SPECS.find(spec => spec.id === value);
        if (selectedSpec) {
          newConfig.cpu = selectedSpec.cpu;
          newConfig.memory = selectedSpec.memory;
          newConfig.storage = selectedSpec.disk;
          newConfig.price = selectedSpec.price;
        }
      }

      // 更新带宽价格
      if (field === 'bandwidthSpeed') {
        const selectedBandwidth = BANDWIDTH_SPEEDS.find(b => b.speed === value);
        if (selectedBandwidth) {
          newConfig.bandwidthPrice = selectedBandwidth.price;
          newConfig.trafficLimit = selectedBandwidth.limit;
        }
      }

      return newConfig;
    });
  };

  // 初始化时设置为 Linux
  useEffect(() => {
    if (config.osType !== 'Linux') {
      handleChange('osType', 'Linux');
    }
  }, []);

  const DURATION_OPTIONS = [
    { value: 'month', label: '月付', discount: 0 },
    { value: 'quarter', label: '季付', discount: 5 },
    { value: 'halfYear', label: '半年付', discount: 10 },
    { value: 'year', label: '年付', discount: 15 }
  ];

  return (
    <div className="space-y-8">
      {/* 服务器套餐选择 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">服务器套餐选择</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {SERVER_SPECS.map(spec => (
            <button
              key={spec.id}
              onClick={() => handleChange('serverSpec', spec.id)}
              className={`p-4 rounded-lg border ${
                config.serverSpec === spec.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-colors h-full`}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <div className="font-medium text-lg text-gray-900">{spec.name}</div>
                  <div className="font-medium text-lg text-blue-600 ml-4">¥{spec.price}/月</div>
                </div>
                <div className="text-sm text-gray-600 font-medium mt-2">
                  {spec.cpu} | {spec.memory} | {spec.disk}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 带宽选择 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">带宽选择</h3>
        </div>
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
              <div className="font-medium text-gray-900">独享带宽</div>
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
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {speed}Mbps{config.bandwidthType === 'shared' ? '(峰值)' : ''}
                      </div>
                      {config.bandwidthType === 'shared' && (
                        <div className="text-sm text-gray-500 mt-1">流量限制: {limit}/月</div>
                      )}
                    </div>
                    <div className="font-medium text-blue-600">¥{price}/月</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 系统选择 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">系统选择</h3>
        </div>
        <div className="space-y-6">
          {/* 系统类型选择 */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">选择系统类型</div>
            <div className="grid grid-cols-4 gap-4">
              {Object.keys(OS_OPTIONS).map((osName) => (
                <button
                  key={osName}
                  onClick={() => handleChange('os', osName)}
                  className={`p-4 rounded-lg border ${
                    config.os === osName
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } transition-colors`}
                >
                  <div className="font-medium text-gray-900">{osName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 版本选择 */}
          {config.os && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">选择版本</div>
              <div className="grid grid-cols-4 gap-4">
                {OS_OPTIONS[config.os as keyof typeof OS_OPTIONS].map(({ version, description }) => (
                  <button
                    key={version}
                    onClick={() => handleChange('osVersion', version)}
                    className={`p-3 rounded-lg border ${
                      config.osVersion === version
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } transition-colors`}
                  >
                    <div className="font-medium text-gray-900">{version}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 时长选择 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">时长选择</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            {DURATION_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  config.period === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-600'
                }`}
                onClick={() => handleChange('period', option.value)}
              >
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                {option.discount > 0 && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    -{option.discount}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 备注 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">备注</h3>
        <textarea
          value={config.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="请输入备注信息（选填）"
          className="w-full h-24 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
} 