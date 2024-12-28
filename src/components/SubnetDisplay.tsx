import React from 'react';

interface SubnetDisplayProps {
  subnet: string;
}

export function SubnetDisplay({ subnet }: SubnetDisplayProps) {
  const parts = subnet.split('.');
  const prefix = parts.slice(0, 3).join('.');
  const suffix = parts[3];

  return (
    <div className="flex justify-start pl-12">
      <div className="inline-flex items-center font-mono text-sm bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors group">
        <div className="px-3 py-1.5 bg-blue-500 text-white font-semibold">
          <span>{prefix}</span>
        </div>
        <div className="px-3 py-1.5 border-l border-gray-200 group-hover:bg-gray-50/50 transition-colors">
          <span className="text-gray-600">{suffix}</span>
        </div>
      </div>
    </div>
  );
}