import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Resource } from '../types/resource';
import { ResourceListItem } from './ResourceListItem';
import { ResourceListHeader } from './ResourceListHeader';
import { EmptyState } from './EmptyState';
import { SortField, SortState } from '../types/sorting';
import { useNavigate } from 'react-router-dom';

interface ResourceListProps {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
  showEmptyState: boolean;
  isSearched: boolean;
  onCustomize: () => void;
}

export function ResourceList({ 
  resources, 
  onSelect, 
  showEmptyState,
  isSearched,
  onCustomize
}: ResourceListProps) {
  const navigate = useNavigate();
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: null,
  });

  const handleSort = (field: SortField) => {
    setSortState(current => ({
      field,
      direction: 
        current.field === field
          ? current.direction === null
            ? 'asc'
            : current.direction === 'asc'
              ? 'desc'
              : null
          : 'asc',
    }));
  };

  const sortedResources = useMemo(() => {
    if (!sortState.field || !sortState.direction) return resources;

    return [...resources].sort((a, b) => {
      const direction = sortState.direction === 'asc' ? 1 : -1;
      
      switch (sortState.field) {
        case 'price':
          return (a.price - b.price) * direction;
        case 'subnet':
          return a.subnet.localeCompare(b.subnet) * direction;
        case 'purityLevel':
          return (a.purityLevel - b.purityLevel) * direction;
        default:
          return 0;
      }
    });
  }, [resources, sortState]);

  if (showEmptyState) {
    return <EmptyState message="请选择国家和IP类型" />;
  }

  if (isSearched && resources.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            没有找到符合条件的资源
          </h3>
          <p className="text-gray-500 mb-6">
            我们可以为您定制最适合的IP资源方案，匹配您的具体需求
          </p>
          <button
            onClick={onCustomize}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 
              text-white text-base font-medium rounded-lg 
              hover:from-blue-500 hover:to-blue-400
              focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
              transition-all duration-200 shadow-lg shadow-blue-600/20
              hover:shadow-xl hover:shadow-blue-600/30"
          >
            定制资源
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <ResourceListHeader 
        onSort={handleSort}
        sortState={sortState}
      />
      <div className="divide-y divide-gray-200">
        {sortedResources.map((resource) => (
          <ResourceListItem 
            key={resource.id}
            resource={resource}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}