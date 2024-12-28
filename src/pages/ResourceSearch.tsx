import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { ResourceList } from '../components/ResourceList';
import { OrderSummary } from '../components/OrderSummary';
import { ResourceSearchForm } from '../components/ResourceSearchForm';
import { CustomResourceForm } from '../components/CustomResourceForm';
import { useResourceManager } from '../hooks/useResourceManager';
import { STEPS } from '../constants/steps';

type StepStatus = 'current' | 'completed' | 'upcoming';

interface Step {
  title: string;
  status: StepStatus;
}

export function ResourceSearch() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  const {
    resources,
    selectedResources,
    totalPrice,
    selectResource,
    removeResource,
    getRemainingTime
  } = useResourceManager();
  
  const steps: Step[] = STEPS.map((step, index) => ({
    ...step,
    status: currentStep === index 
      ? 'current' 
      : currentStep > index 
        ? 'completed' 
        : 'upcoming'
  }));

  const filteredResources = isSearched
    ? resources.filter(resource => {
        const countryMatch = resource.location === (
          selectedCountry === 'US' ? '美国' : 
          selectedCountry === 'DE' ? '德国' : 
          selectedCountry === 'JP' ? '日本' : ''
        );
        const typeMatch = resource.type === resourceType;
        return countryMatch && typeMatch;
      })
    : [];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        <StepIndicator steps={steps} />
        
        <div className="mt-8 grid grid-cols-4 gap-6">
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
                onSelect={selectResource}
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
                total={totalPrice}
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
    </div>
  );
}