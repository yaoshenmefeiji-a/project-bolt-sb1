import { useState, useEffect, useCallback } from 'react';
import { Resource, SelectedResource } from '../types/resource';

const LOCK_DURATION = 15 * 60 * 1000;

export function useResourceTimeout() {
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([]);
  const [firstResourceTime, setFirstResourceTime] = useState<number | null>(null);
  
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
        // 更新 firstResourceTime 为剩余资源中最早的过期时间
        const earliestExpiry = Math.min(...remainingResources.map(r => r.expiresAt));
        setFirstResourceTime(earliestExpiry);
      }
    }

    return expiredResources;
  }, [selectedResources]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredResources();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkExpiredResources]);

  const addResource = (resource: Resource) => {
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
  };

  const removeResource = (resourceId: string) => {
    const resource = selectedResources.find(r => r.id === resourceId);
    if (resource) {
      const newSelectedResources = selectedResources.filter(r => r.id !== resourceId);
      setSelectedResources(newSelectedResources);
      if (newSelectedResources.length === 0) {
        setFirstResourceTime(null);
      } else {
        // 更新 firstResourceTime 为剩余资源中最早的过期时间
        const earliestExpiry = Math.min(...newSelectedResources.map(r => r.expiresAt));
        setFirstResourceTime(earliestExpiry);
      }
      const { selectedAt, expiresAt, ...originalResource } = resource;
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
    selectedResources,
    addResource,
    removeResource,
    getRemainingTime,
    checkExpiredResources,
    initializeSelectedResources,
  };
}