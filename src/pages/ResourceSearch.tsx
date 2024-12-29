import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator, Step } from '../components/StepIndicator';
import { STEPS } from '../constants/steps';
import { useResourceManager } from '../hooks/useResourceManager';
import { ResourceSearchForm } from '../components/ResourceSearchForm';
import { ResourceList } from '../components/ResourceList';
import { OrderSummary } from '../components/OrderSummary';
import { CustomResourceForm } from '../components/CustomResourceForm';

export function ResourceSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLocation, selectedType } = location.state || {};
  const { resources, selectedResources, addResource, removeResource, getRemainingTime } = useResourceManager();
  
  // 从 localStorage 或 location state 获取初始值
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return selectedLocation || localStorage.getItem('lastSelectedCountry') || '';
  });
  
  const [resourceType, setResourceType] = useState(() => {
    return selectedType || localStorage.getItem('lastResourceType') || '';
  });
  
  const [isSearched, setIsSearched] = useState(() => {
    return !!(selectedLocation && selectedType) || !!(localStorage.getItem('lastSelectedCountry') && localStorage.getItem('lastResourceType'));
  });

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showResourceList, setShowResourceList] = useState(false);
  const [showSelectionView, setShowSelectionView] = useState(true);
  
  // 保存搜索条件到 localStorage
  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem('lastSelectedCountry', selectedCountry);
    }
    if (resourceType) {
      localStorage.setItem('lastResourceType', resourceType);
    }
  }, [selectedCountry, resourceType]);

  // 当有之前的选择时，自动触发搜索
  useEffect(() => {
    if (selectedCountry && resourceType) {
      setIsSearched(true);
    }
  }, [selectedCountry, resourceType]);
  
  const steps = useMemo<Step[]>(() => {
    const currentStep = 0; // 资源选择页面是第一步
    return STEPS.map((step, index) => ({
    ...step,
    status: currentStep === index 
      ? 'current' 
      : currentStep > index 
        ? 'completed' 
        : 'upcoming'
  }));
  }, []);

  const filteredResources = useMemo(() => {
    if (!isSearched) return [];

    return resources.filter(resource => {
        const countryMatch = resource.location === (
          selectedCountry === 'US' ? '美国' : 
          selectedCountry === 'DE' ? '德国' : 
          selectedCountry === 'JP' ? '日本' : ''
        );
        const typeMatch = resource.type === resourceType;
        return countryMatch && typeMatch;
    });
  }, [isSearched, selectedCountry, resourceType, resources]);

  const handleSearch = () => {
    setIsSearched(true);
    setShowCustomForm(false);
  };

  const handleShowCustomForm = () => {
    setShowCustomForm(true);
  };

  const handleBackToSearch = () => {
    setShowCustomForm(false);
    setIsSearched(false);
  };

  const showEmptyState = !selectedCountry || !resourceType;

  const handleNext = () => {
    navigate('/server-config', {
      state: {
        selectedResources
      }
    });
  };

  const handleStartBrowsing = () => {
    setShowResourceList(true);
    setShowSelectionView(false);
  };

  const handleBackToSelection = () => {
    setShowResourceList(false);
    setShowSelectionView(true);
    setShowCustomForm(false);
    setIsSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        {/* 步骤指示器只在非首页显示 */}
        {!showSelectionView && (
          <StepIndicator steps={steps} />
        )}
        
        {/* ISP优势展示 - 只在首页显示 */}
        {showSelectionView && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">全球顶级ISP深度合作伙伴</h1>
                <p className="mt-2 text-blue-100">多年行业经验，专业团队为您提供最优质的双ISP静态住宅IP服务</p>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-white/10 rounded-lg p-4 mb-3">
                    <svg className="w-8 h-8 mx-auto text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base">顶级ISP合作</h3>
                  <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                    全球顶级ISP<br/>
                    深度合作伙伴
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 rounded-lg p-4 mb-3">
                    <svg className="w-8 h-8 mx-auto text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base">海量纯净资源</h3>
                  <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                    来自全球的<br/>
                    优质IP资源
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 rounded-lg p-4 mb-3">
                    <svg className="w-8 h-8 mx-auto text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base">专家级服务团队</h3>
                  <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                    多年行业经验<br/>
                    深度业务理解
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 rounded-lg p-4 mb-3">
                    <svg className="w-8 h-8 mx-auto text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base">快速响应支持</h3>
                  <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                    7x24小时<br/>
                    技术支持
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 选择提示 */}
        {showSelectionView && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-900">选择订单类型</h2>
                <p className="mt-3 text-base text-gray-500">
                  我们提供多种订单类型以满足您的不同需求
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {/* 测试订单 */}
                <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="absolute -top-3 right-4 px-2 bg-white">
                    <span className="text-sm font-medium text-blue-600">测试订单</span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">免费体验</h3>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>短期测试我们的服务质量</p>
                    <p>无需付费即可体验</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      免费使用
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      短期测试
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      快速开通
                    </li>
                  </ul>
                  <button 
                    onClick={handleStartBrowsing}
                    className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors group-hover:bg-blue-600 group-hover:text-white"
                  >
                    开始测试
                  </button>
                </div>

                {/* 正式订单 */}
                <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="absolute -top-3 right-4 px-2 bg-white">
                    <span className="text-sm font-medium text-green-600">正式订单</span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">立即使用</h3>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>从现有资源池中选择</p>
                    <p>支付后即可立即开通使用</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      即时开通
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      现货资源
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      标准定价
                    </li>
                  </ul>
                  <button 
                    onClick={handleStartBrowsing}
                    className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium text-sm transition-colors group-hover:bg-green-600 group-hover:text-white"
                  >
                    立即购买
                  </button>
                </div>

                {/* 预订订单 */}
                <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="absolute -top-3 right-4 px-2 bg-white">
                    <span className="text-sm font-medium text-purple-600">预订订单</span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">提前预订</h3>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>提前锁定优质资源</p>
                    <p>享受更优惠的价格</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      优先选择
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      价格优惠
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      资源锁定
                    </li>
                  </ul>
                  <button 
                    onClick={handleStartBrowsing}
                    className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium text-sm transition-colors group-hover:bg-purple-600 group-hover:text-white"
                  >
                    预订资源
                  </button>
                </div>

                {/* 定制订单 */}
                <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="absolute -top-3 right-4 px-2 bg-white">
                    <span className="text-sm font-medium text-orange-600">定制订单</span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">专属定制</h3>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>根据您的具体需求定制IP资源</p>
                    <p>提供专属解决方案</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      定制方案
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      灵活配置
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      专人服务
                    </li>
                  </ul>
                  <button 
                    onClick={() => navigate('/custom-resource')}
                    className="w-full px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 font-medium text-sm transition-colors group-hover:bg-orange-600 group-hover:text-white"
                  >
                    开始定制
                  </button>
                </div>

                {/* BYO-IP订单 */}
                <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="absolute -top-3 right-4 px-2 bg-white">
                    <span className="text-sm font-medium text-red-600">BYO-IP</span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">自带IP</h3>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>使用您自有的IP资源</p>
                    <p>我们提供托管和技术支持</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      自有IP
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      托管服务
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      技术支持
                    </li>
                  </ul>
                  <button 
                    onClick={() => navigate('/byo-ip')}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors group-hover:bg-red-600 group-hover:text-white"
                  >
                    开始托管
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 资源列表和搜索 */}
        {showResourceList && (
          <div className="mt-8">
            <button
              onClick={handleBackToSelection}
              className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← 返回选择
            </button>
            
            <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3 space-y-6">
            <ResourceSearchForm
              country={selectedCountry}
              resourceType={resourceType}
              onCountryChange={setSelectedCountry}
              onTypeChange={setResourceType}
              onSearch={handleSearch}
            />

            {showCustomForm ? (
                  <div>
                <button
                  onClick={handleBackToSearch}
                      className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← 返回搜索
                </button>
                <CustomResourceForm />
              </div>
            ) : (
              <ResourceList
                resources={filteredResources}
                    onSelect={addResource}
                showEmptyState={showEmptyState}
                isSearched={isSearched}
                    onCustomize={handleShowCustomForm}
              />
            )}
          </div>

          <div className="col-span-1">
                <div className="sticky top-8 space-y-4">
              <OrderSummary
                selectedResources={selectedResources}
                serverConfig={null}
                    total={selectedResources.reduce((sum, resource) => sum + resource.price, 0)}
                onRemoveResource={removeResource}
                getRemainingTime={getRemainingTime}
              />
                  {selectedResources.length > 0 && (
                    <button 
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      下一步：服务器配置
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}