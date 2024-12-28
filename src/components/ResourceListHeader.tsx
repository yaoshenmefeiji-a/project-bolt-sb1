import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortField, SortState } from '../types/sorting';

interface ResourceListHeaderProps {
  onSort: (field: SortField) => void;
  sortState: SortState;
}

export function ResourceListHeader({ onSort, sortState }: ResourceListHeaderProps) {
  const getSortButtonClass = (field: SortField) => {
    const isActive = sortState.field === field;
    return `inline-flex items-center gap-1 hover:text-gray-700 transition-colors group ${
      isActive ? 'text-gray-900' : 'text-gray-500'
    }`;
  };

  const getArrowClass = (field: SortField) => {
    const isActive = sortState.field === field;
    return `h-4 w-4 transition-colors ${
      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
    }`;
  };

  return (
    <div className="grid grid-cols-24 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium">
      <div className="col-span-3 text-center">类型</div>
      <div className="col-span-3 text-center">目标位置</div>
      <div className="col-span-3 text-center">As属性</div>
      <div className="col-span-5 text-center">
        <button
          onClick={() => onSort('subnet')}
          className={getSortButtonClass('subnet')}
        >
          子网
          <ArrowUpDown className={getArrowClass('subnet')} />
        </button>
      </div>
      <div className="col-span-4 text-center">
        <button
          onClick={() => onSort('purityLevel')}
          className={getSortButtonClass('purityLevel')}
        >
          纯净度
          <ArrowUpDown className={getArrowClass('purityLevel')} />
        </button>
      </div>
      <div className="col-span-3 text-center">
        <button
          onClick={() => onSort('price')}
          className={getSortButtonClass('price')}
        >
          月度费用
          <ArrowUpDown className={getArrowClass('price')} />
        </button>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
}