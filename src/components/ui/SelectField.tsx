import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function SelectField({ 
  label, 
  icon: Icon, 
  children, 
  className = '', 
  ...props 
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-base font-medium text-gray-900">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        {label}
      </label>
      <div className="relative">
        <select
          className={`
            block w-full appearance-none rounded-lg border-gray-200 bg-white 
            px-4 py-3 pr-10 shadow-sm outline-none ring-1 ring-gray-200
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition-all duration-200
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}