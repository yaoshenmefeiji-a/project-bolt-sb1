import { useState, useEffect, useCallback } from 'react';
import { Resource, SelectedResource } from '../types/resource';
import { mockResources as initialResources } from '../data/mockResources';

const LOCK_DURATION = 15 * 60 * 1000;
const SELECTED_RESOURCES_KEY = 'selectedResources';
const MAX_RESOURCES_PER_ORDER = 1;

export interface AddResourceError {
  type: 'country_mismatch' | 'max_resources_reached';
  message: string;
  currentCountry?: string;
  newCountry?: string;
}

export function useResourceManager() {
  // 初始化时从 localStorage 加载选中的资源
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>(() => {
    const savedResources = localStorage.getItem(SELECTED_RESOURCES_KEY);
    if (savedResources) {
      try {
        const parsed = JSON.parse(savedResources) as SelectedResource[];
        // 过滤掉已过期的资源
        const now = Date.now();
        return parsed.filter(r => r.expiresAt > now);
      } catch (e) {
        console.error('Failed to parse saved resources:', e);
        return [];
      }
    }
    return [];
  });

  // 初始化可用资源列表，排除已选中的资源
  const [resources, setResources] = useState(() => {
    return initialResources.filter(resource => 
      !selectedResources.some(selected => selected.id === resource.id)
    );
  });

  const [firstResourceTime, setFirstResourceTime] = useState<number | null>(() => {
    if (selectedResources.length > 0) {
      return Math.min(...selectedResources.map(r => r.expiresAt));
    }
    return null;
  });

  // 当选中的资源发生变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem(SELECTED_RESOURCES_KEY, JSON.stringify(selectedResources));
  }, [selectedResources]);
  
  const checkExpiredResources = useCallback(() => {
    const now = Date.now();
    const expiredResources: Resource[] = [];
    const remainingResources = selectedResources.filter(resource => {
      if (resource.expiresAt <= now) {
        expiredResources.push({
          id: resource.id,
          location: resource.location,
          type: resource.type,
          subnet: resource.subnet,
          price: resource.price,
          isp: resource.isp,
          purityLevel: resource.purityLevel,
          properties: resource.properties,
        });
        return false;
      }
      return true;
    });

    if (remainingResources.length !== selectedResources.length) {
      setSelectedResources(remainingResources);
      if (remainingResources.length === 0) {
        setFirstResourceTime(null);
      } else {
        const earliestExpiry = Math.min(...remainingResources.map(r => r.expiresAt));
        setFirstResourceTime(earliestExpiry);
      }
      setResources(prev => [...prev, ...expiredResources]);
    }

    return expiredResources;
  }, [selectedResources]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredResources();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkExpiredResources]);

  const addResource = (resource: Resource): AddResourceError | null => {
    // 检查是否已达到最大资源数量限制
    if (selectedResources.length >= MAX_RESOURCES_PER_ORDER) {
      return {
        type: 'max_resources_reached',
        message: '一个订单最多只能添加1个IP资源'
      };
    }

    // 检查是否已有其他国家的资源
    if (selectedResources.length > 0) {
      const currentCountry = selectedResources[0].location;
      if (resource.location !== currentCountry) {
        return {
          type: 'country_mismatch',
          message: '一个订单只能选择同一国家的IP资源',
          currentCountry,
          newCountry: resource.location
        };
      }
    }

    const now = Date.now();
    const expiresAt = firstResourceTime || now + LOCK_DURATION;
    const selectedResource: SelectedResource = {
      ...resource,
      selectedAt: now,
      expiresAt,
    };
    setSelectedResources(prev => [...prev, selectedResource]);
    if (!firstResourceTime) {
      setFirstResourceTime(expiresAt);
    }
    setResources(prev => prev.filter(r => r.id !== resource.id));
    return null;
  };

  const removeResource = (resourceId: string) => {
    const resource = selectedResources.find(r => r.id === resourceId);
    if (resource) {
      const newSelectedResources = selectedResources.filter(r => r.id !== resourceId);
      setSelectedResources(newSelectedResources);
      if (newSelectedResources.length === 0) {
        setFirstResourceTime(null);
      } else {
        const earliestExpiry = Math.min(...newSelectedResources.map(r => r.expiresAt));
        setFirstResourceTime(earliestExpiry);
      }
      const { selectedAt, expiresAt, ...originalResource } = resource;
      setResources(prev => [...prev, originalResource]);
      return originalResource;
    }
    return null;
  };

  const getRemainingTime = useCallback(() => {
    if (!firstResourceTime) return 0;
    return Math.max(0, firstResourceTime - Date.now());
  }, [firstResourceTime]);

  const initializeSelectedResources = useCallback((resources: SelectedResource[]) => {
    if (resources.length > 0) {
      const earliestExpiry = Math.min(...resources.map(r => r.expiresAt));
      setFirstResourceTime(earliestExpiry);
    }
    setSelectedResources(resources);
  }, []);

  return {
    resources,
    selectedResources,
    addResource,
    removeResource,
    getRemainingTime,
    checkExpiredResources,
    initializeSelectedResources,
  };
}