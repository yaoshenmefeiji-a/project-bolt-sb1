import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export function FormField({ label, icon: Icon, className = '', ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-base font-medium text-gray-900">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        {label}
      </label>
      <input
        className={`
          block w-full rounded-lg border-gray-200 bg-white px-4 py-3
          shadow-sm outline-none ring-1 ring-gray-200
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
}