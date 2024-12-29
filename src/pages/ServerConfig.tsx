import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { ServerConfigForm } from '../components/ServerConfigForm';
import { OrderSummary } from '../components/OrderSummary';
import { STEPS } from '../constants/steps';
import { Resource } from '../types/resource';
import { ServerConfig as IServerConfig } from '../types/server';
import { useResourceManager } from '../hooks/useResourceManager';

type StepStatus = 'current' | 'completed' | 'upcoming';

interface Step {
  title: string;
  status: StepStatus;
}

const SERVER_SPECS_PRICES = {
  entry: 200,
  basic: 300,
  standard: 500,
  advanced: 800,
  professional: 1200,
  ultimate: 2000,
};

const BANDWIDTH_PRICES = {
  '10': 50,
  '20': 90,
  '50': 200,
  '100': 350,
  '200': 600,
  '500': 1400,
};

export function ServerConfig() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverConfig, setServerConfig] = useState<IServerConfig | null>(null);
  
  // 使用 useResourceManager 来管理资源状态
  const { selectedResources, removeResource, getRemainingTime } = useResourceManager();

  const steps: Step[] = STEPS.map((step, index) => ({
    ...step,
    status: index === 1 ? 'current' : index < 1 ? 'completed' : 'upcoming'
  }));

  // 验证必选项是否已填写
  const isFormValid = () => {
    if (!serverConfig) return false;
    return (
      serverConfig.serverSpec && // 服务器配置
      serverConfig.bandwidthSpeed && // 带宽
      serverConfig.osType === 'Linux' && serverConfig.os && // 系统（只允许 Linux）
      serverConfig.period // 时长
    );
  };

  const handleNext = () => {
    if (!isFormValid()) return;
    navigate('/payment', { 
      state: { 
        serverConfig 
      }
    });
  };

  const handleBack = () => {
    navigate('/', { 
      state: { 
        serverConfig 
      }
    });
  };

  const handleConfigChange = (newConfig: IServerConfig) => {
    setServerConfig({
      ...newConfig,
      price: calculatePrice(newConfig)
    });
  };

  // 计算总价
  const calculateTotal = () => {
    let total = 0;
    // 加上资源的价格
    selectedResources.forEach(resource => {
      total += resource.price || 0;
    });
    // 加上服务器配置的价格
    if (serverConfig) {
      total += calculatePrice(serverConfig);
    }
    return total;
  };

  // 计算服务器配置的价格
  const calculatePrice = (config: IServerConfig) => {
    let price = 0;
    
    // 根据服务器规格计算基础价格
    if (config.serverSpec) {
      price += SERVER_SPECS_PRICES[config.serverSpec as keyof typeof SERVER_SPECS_PRICES] || 0;
    }

    // 根据带宽计算价格
    if (config.bandwidthType === 'dedicated' && config.bandwidthSpeed) {
      price += BANDWIDTH_PRICES[config.bandwidthSpeed as keyof typeof BANDWIDTH_PRICES] || 0;
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ServerConfigForm 
                onConfigChange={handleConfigChange}
                initialConfig={serverConfig}
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-8 space-y-4">
              <OrderSummary
                selectedResources={selectedResources}
                serverConfig={serverConfig}
                total={calculateTotal()}
                onRemoveResource={removeResource}
                getRemainingTime={getRemainingTime}
              />
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  上一步：选择资源
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isFormValid()}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    isFormValid()
                      ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  下一步：确认订单
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