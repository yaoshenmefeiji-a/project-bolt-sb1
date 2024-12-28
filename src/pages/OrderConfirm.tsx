import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { useResourceManager } from '../hooks/useResourceManager';
import { ServerConfig as IServerConfig } from '../types/server';
import { ArrowLeft, Server, Network, Globe2, FileText, DollarSign, Trash2, Edit } from 'lucide-react';

type StepStatus = 'current' | 'completed' | 'upcoming';

interface Step {
  title: string;
  status: StepStatus;
}

export function OrderConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverConfig, setServerConfig] = useState<IServerConfig | null>(null);
  const { selectedResources, removeResource } = useResourceManager();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const state = location.state as { serverConfig?: IServerConfig } | null;
    if (state?.serverConfig) {
      setServerConfig(state.serverConfig);
    }
  }, [location.state]);

  const steps: Step[] = STEPS.map((step, index) => ({
    ...step,
    status: index === 2 ? 'current' : index < 2 ? 'completed' : 'upcoming'
  }));

  const handleBack = () => {
    navigate('/server-config', { state: { serverConfig } });
  };

  const handleSubmit = () => {
    console.log('提交订单', { selectedResources, serverConfig, notes });
  };

  const calculatePrice = (config: IServerConfig) => {
    let price = 0;
    
    switch (config.serverSpec) {
      case 'entry': price += 200; break;
      case 'basic': price += 300; break;
      case 'standard': price += 500; break;
      case 'advanced': price += 800; break;
      case 'professional': price += 1200; break;
      case 'ultimate': price += 2000; break;
    }

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

    switch (config.period) {
      case 'quarter': price = price * 3 * 0.95; break;
      case 'halfYear': price = price * 6 * 0.90; break;
      case 'year': price = price * 12 * 0.85; break;
    }

    return Math.round(price);
  };

  const resourcesTotal = selectedResources.reduce((sum, r) => sum + r.price, 0);
  const serverTotal = serverConfig ? calculatePrice(serverConfig) : 0;
  const total = resourcesTotal + serverTotal;

  const handleDeleteResource = (resourceId: string) => {
    removeResource(resourceId);
  };

  const handleEditServerConfig = () => {
    navigate('/server-config', { state: { serverConfig } });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 max-w-4xl mx-auto space-y-6">
          {/* IP资源信息 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium text-gray-900">IP资源信息</h3>
              </div>
              <div className="text-sm font-medium text-blue-600">
                月度费用：${resourcesTotal}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="text-sm font-medium text-gray-500">位置</div>
                <div className="text-sm font-medium text-gray-500">类型</div>
                <div className="text-sm font-medium text-gray-500">子网</div>
                <div className="text-sm font-medium text-gray-500">ISP</div>
                <div className="text-sm font-medium text-gray-500 text-right">月度费用</div>
              </div>
              <div className="divide-y divide-gray-100">
                {selectedResources.map(resource => (
                  <div key={resource.id} className="grid grid-cols-5 gap-4 px-6 py-4 items-center">
                    <div className="text-sm text-gray-900">{resource.location}</div>
                    <div className="text-sm text-gray-900">
                      {resource.type === 'native' ? '原生' : '广播'}
                    </div>
                    <div className="text-sm text-gray-900">{resource.subnet}</div>
                    <div className="text-sm text-gray-900">{resource.isp}</div>
                    <div className="flex items-center justify-end gap-4">
                      <div className="text-sm font-medium text-blue-600">
                        ${resource.price}/月
                      </div>
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 服务器配置信息 */}
          {serverConfig && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-gray-900">服务器配置信息</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-blue-600">
                    月度费用：${serverTotal}
                  </div>
                  <button
                    onClick={handleEditServerConfig}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title="修改配置"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="text-sm font-medium text-gray-500">配置项</div>
                  <div className="text-sm font-medium text-gray-500">配置值</div>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="grid grid-cols-2 gap-4 px-6 py-4">
                    <div className="text-sm text-gray-500">服务器规格</div>
                    <div className="text-sm text-gray-900">
                      {serverConfig.serverSpec === 'entry' ? '入门型' :
                       serverConfig.serverSpec === 'basic' ? '基础型' :
                       serverConfig.serverSpec === 'standard' ? '标准型' :
                       serverConfig.serverSpec === 'advanced' ? '进阶型' :
                       serverConfig.serverSpec === 'professional' ? '专业型' : '旗舰型'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-6 py-4">
                    <div className="text-sm text-gray-500">操作系统</div>
                    <div className="text-sm text-gray-900">
                      {serverConfig.os} {serverConfig.osVersion}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-6 py-4">
                    <div className="text-sm text-gray-500">带宽类型</div>
                    <div className="text-sm text-gray-900">
                      {serverConfig.bandwidthType === 'dedicated' ? '独享带宽' : '共享带宽'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-6 py-4">
                    <div className="text-sm text-gray-500">带宽大小</div>
                    <div className="text-sm text-gray-900">
                      {serverConfig.bandwidthSpeed}Mbps
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-6 py-4">
                    <div className="text-sm text-gray-500">付费方式</div>
                    <div className="text-sm text-gray-900">
                      {serverConfig.period === 'month' ? '月付' :
                       serverConfig.period === 'quarter' ? '季付' :
                       serverConfig.period === 'halfYear' ? '半年付' : '年付'}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 备注信息 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium text-gray-900">备注信息</h3>
            </div>
            <div className="p-6">
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                placeholder="请输入备注信息（选填）"
              />
            </div>
          </section>

          {/* 费用信息 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium text-gray-900">费用总计</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">IP资源月度费用</dt>
                  <dd className="text-sm font-medium text-gray-900">${resourcesTotal}</dd>
                </div>
                {serverConfig && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500">服务器月度费用</dt>
                    <dd className="text-sm font-medium text-gray-900">${serverTotal}</dd>
                  </div>
                )}
                <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                  <dt className="font-medium text-gray-900">月度总费用</dt>
                  <dd className="text-lg font-semibold text-blue-600">${total}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              上一步：配置服务器
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              提交订单
              <Network className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 