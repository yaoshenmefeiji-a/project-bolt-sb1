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

  const handleNext = () => {
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
    setServerConfig(newConfig);
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
    switch (config.serverSpec) {
      case 'entry': price += 200; break;
      case 'basic': price += 300; break;
      case 'standard': price += 500; break;
      case 'advanced': price += 800; break;
      case 'professional': price += 1200; break;
      case 'ultimate': price += 2000; break;
    }

    // 根据带宽计算价格
    if (config.bandwidthType === 'dedicated') {
      switch (config.bandwidthSpeed) {
        case '10': price += 50; break;
        case '20': price += 90; break;
        case '50': price += 200; break;
        case '100': price += 350; break;
        case '200': price += 600; break;
        case '500': price += 1400; break;
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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