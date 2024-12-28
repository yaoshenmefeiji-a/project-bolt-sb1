import React, { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8">
      <div className="text-center">
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
        )}
        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>
        {action}
      </div>
    </div>
  );
}