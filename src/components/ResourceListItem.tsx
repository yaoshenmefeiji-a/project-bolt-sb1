import React from 'react';
import { Wifi } from 'lucide-react';
import { Resource } from '../types/resource';
import { PURITY_LEVELS } from '../constants/purityLevels';
import { SubnetDisplay } from './SubnetDisplay';
import { calculatePricePerIp, formatPricePerIp } from '../utils/subnet';

interface ResourceListItemProps {
  resource: Resource;
  onSelect: (resource: Resource) => void;
}

export function ResourceListItem({ resource, onSelect }: ResourceListItemProps) {
  const isNative = resource.type === 'native';
  const pricePerIp = calculatePricePerIp(resource.price, resource.subnet);
  
  return (
    <div className="grid grid-cols-24 gap-4 px-6 py-4 hover:bg-gray-50 group items-center">
      <div className="col-span-3 flex justify-center">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-sm font-medium ${
          isNative 
            ? 'bg-blue-50 text-blue-600' 
            : 'bg-purple-50 text-purple-600'
        }`}>
          {isNative ? '原生' : '广播'}
        </span>
      </div>
      
      <div className="col-span-3 flex justify-center">
        <span className="text-sm text-gray-900">{resource.location}</span>
      </div>

      <div className="col-span-3 flex justify-center">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
            <Wifi className="h-4 w-4" />
          </div>
          <span className="text-sm text-gray-900">{resource.isp}</span>
        </div>
      </div>
      
      <div className="col-span-5">
        <SubnetDisplay subnet={resource.subnet} />
      </div>
      
      <div className="col-span-4 flex justify-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          PURITY_LEVELS[resource.purityLevel].style
        }`}>
          {PURITY_LEVELS[resource.purityLevel].text}
        </span>
      </div>
      
      <div className="col-span-3 flex justify-center">
        <div className="text-center">
          <div>
            <span className="text-lg font-semibold text-blue-600">${resource.price}</span>
            <span className="text-sm text-gray-500">/mo</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            (${formatPricePerIp(pricePerIp)}/IP)
          </div>
        </div>
      </div>
      
      <div className="col-span-3 flex justify-end">
        <button
          onClick={() => onSelect(resource)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${isNative 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
        >
          选择
        </button>
      </div>
    </div>
  );
}