import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = '请选择',
  label,
  error,
  className
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-base font-medium text-gray-900">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative w-full bg-white pl-4 pr-10 py-3 text-left",
            "border border-gray-200 rounded-lg",
            "shadow-sm outline-none ring-1 ring-gray-200",
            "hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            "transition-all duration-200",
            error && "border-red-300 ring-red-200",
            className
          )}
        >
          <span className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className="text-2xl">{selectedOption.icon}</span>
                )}
                <span className="text-gray-900">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown 
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                isOpen && "transform rotate-180"
              )}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-gray-200">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2.5 text-left",
                  "hover:bg-gray-50 transition-colors duration-150",
                  value === option.value && "bg-blue-50 text-blue-600"
                )}
              >
                {option.icon && <span className="text-2xl">{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}