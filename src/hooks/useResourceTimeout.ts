import { useState, useEffect, useCallback } from 'react';
import { Resource, SelectedResource } from '../types/resource';

const LOCK_DURATION = 15 * 60 * 1000;

export function useResourceTimeout() {
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([]);
  const [firstResourceTime, setFirstResourceTime] = useState<number | null>(null);
  
  const checkExpiredResources = useCallback(() => {
    if (!firstResourceTime) return [];
    const now = Date.now();
    if (firstResourceTime <= now) {
      const expired = [...selectedResources];
      setSelectedResources([]);
      return expired.map(({ selectedAt, expiresAt, ...resource }) => resource);
    }
    return [];
  }, [firstResourceTime, selectedResources]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredResources();
    }, 1000);

    return () => clearInterval(interval);
  }, [checkExpiredResources]);

  const addResource = (resource: Resource) => {
    const now = Date.now();
    if (!firstResourceTime) {
      setFirstResourceTime(now + LOCK_DURATION);
    }
    const selectedResource: SelectedResource = {
      ...resource,
      selectedAt: now,
      expiresAt: firstResourceTime || now + LOCK_DURATION,
    };
    setSelectedResources(prev => [...prev, selectedResource]);
  };

  const removeResource = (resourceId: string) => {
    const resource = selectedResources.find(r => r.id === resourceId);
    if (resource) {
      const newSelectedResources = selectedResources.filter(r => r.id !== resourceId);
      setSelectedResources(newSelectedResources);
      if (newSelectedResources.length === 0) {
        setFirstResourceTime(null);
      }
      const { selectedAt, expiresAt, ...originalResource } = resource;
      return originalResource;
    }
    return null;
  };

  const getRemainingTime = () => {
    if (!firstResourceTime) return 0;
    return Math.max(0, firstResourceTime - Date.now());
  };

  const initializeSelectedResources = useCallback((resources: SelectedResource[]) => {
    if (resources.length > 0) {
      setFirstResourceTime(resources[0].expiresAt);
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