import React from 'react';
import { Check, CircleDot } from 'lucide-react';

interface Step {
  title: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex items-center relative group">
              <div
                className={`
                  flex h-12 w-12 items-center justify-center rounded-full border-2 
                  transition-all duration-200 
                  ${step.status === 'completed'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : step.status === 'current'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-400'
                  }
                  ${step.status === 'upcoming' && 'group-hover:border-gray-300'}
                `}
              >
                {step.status === 'completed' ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <CircleDot className="h-6 w-6" />
                )}
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p
                  className={`text-sm font-medium transition-colors duration-200
                    ${step.status === 'upcoming' 
                      ? 'text-gray-400 group-hover:text-gray-600' 
                      : 'text-gray-900'
                    }
                  `}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="relative w-32 mx-4">
                <div
                  className={`h-0.5 ${
                    step.status === 'completed' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
                {step.status === 'completed' && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 animate-pulse"
                  />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}