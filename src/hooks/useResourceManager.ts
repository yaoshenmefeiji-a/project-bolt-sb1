import { useState, useMemo, useEffect } from 'react';
import { Resource, SelectedResource } from '../types/resource';
import { mockResources as initialResources } from '../data/mockResources';
import { useResourceTimeout } from './useResourceTimeout';

// 使用 localStorage 来持久化选中的资源状态
const SELECTED_RESOURCES_KEY = 'selectedResources';

export function useResourceManager() {
  const [resources, setResources] = useState(initialResources);
  const {
    selectedResources,
    addResource,
    removeResource,
    getRemainingTime,
    checkExpiredResources,
    initializeSelectedResources
  } = useResourceTimeout();
  
  // 初始化时从 localStorage 加载选中的资源
  useEffect(() => {
    const savedResources = localStorage.getItem(SELECTED_RESOURCES_KEY);
    if (savedResources) {
      try {
        const parsed = JSON.parse(savedResources) as SelectedResource[];
        // 过滤掉已过期的资源
        const now = Date.now();
        const validResources = parsed.filter(r => r.expiresAt > now);
        if (validResources.length > 0) {
          initializeSelectedResources(validResources);
          // 从可用资源列表中移除已选中的资源
          setResources(prev => 
            prev.filter(r => !validResources.some(vr => vr.id === r.id))
          );
        }
      } catch (e) {
        console.error('Failed to parse saved resources:', e);
      }
    }
  }, [initializeSelectedResources]);

  // 当选中的资源发生变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem(SELECTED_RESOURCES_KEY, JSON.stringify(selectedResources));
  }, [selectedResources]);
  
  const totalPrice = useMemo(() => {
    return selectedResources.reduce((sum, resource) => sum + resource.price, 0);
  }, [selectedResources]);

  useEffect(() => {
    // 检查过期资源并返回到可用列表
    const interval = setInterval(() => {
      const expiredResources = checkExpiredResources();
      if (expiredResources.length > 0) {
        // 将过期的资源添加回可用列表
        setResources(prev => {
          // 确保不会添加重复的资源
          const newResources = expiredResources.filter(
            expired => !prev.some(r => r.id === expired.id)
          );
          return [...prev, ...newResources];
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkExpiredResources]);

  const selectResource = (resource: Resource) => {
    addResource(resource);
    setResources(prev => prev.filter(r => r.id !== resource.id));
  };

  const handleRemoveResource = (resourceId: string) => {
    const removedResource = removeResource(resourceId);
    if (removedResource) {
      setResources(prev => {
        // 确保不会添加重复的资源
        if (prev.some(r => r.id === removedResource.id)) {
          return prev;
        }
        return [...prev, removedResource];
      });
    }
  };

  return {
    resources,
    selectedResources,
    totalPrice,
    selectResource,
    removeResource: handleRemoveResource,
    getRemainingTime,
  };
}