import { useState, useEffect, useCallback } from 'react';
import { Resource, SelectedResource } from '../types/resource';

const LOCK_DURATION = 15 * 60 * 1000; // 15分钟

export function useResourceTimeout() {
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([]);
  
  const checkExpiredResources = useCallback(() => {
    const now = Date.now();
    const expired = selectedResources.filter(resource => resource.expiresAt <= now);
    
    if (expired.length > 0) {
      setSelectedResources(prev => prev.filter(resource => resource.expiresAt > now));
      return expired.map(({ selectedAt, expiresAt, ...resource }) => resource);
    }
    return [];
  }, [selectedResources]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredResources();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkExpiredResources]);

  const addResource = (resource: Resource) => {
    const now = Date.now();
    const selectedResource: SelectedResource = {
      ...resource,
      selectedAt: now,
      expiresAt: now + LOCK_DURATION,
    };
    setSelectedResources(prev => [...prev, selectedResource]);
  };

  const removeResource = (resourceId: string) => {
    const resource = selectedResources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResources(prev => prev.filter(r => r.id !== resourceId));
      const { selectedAt, expiresAt, ...originalResource } = resource;
      return originalResource;
    }
    return null;
  };

  const getRemainingTime = (resourceId: string) => {
    const resource = selectedResources.find(r => r.id === resourceId);
    if (!resource) return 0;
    
    const remaining = Math.max(0, resource.expiresAt - Date.now());
    return remaining;
  };

  const initializeSelectedResources = useCallback((resources: SelectedResource[]) => {
    setSelectedResources(resources);
  }, []);

  return {
    selectedResources,
    addResource,
    removeResource,
    getRemainingTime,
    checkExpiredResources,
    initializeSelectedResources,
  };
}