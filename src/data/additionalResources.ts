import { Resource } from '../types/resource';

// Helper function to generate random subnet
const generateSubnet = (index: number): string => {
  const first = Math.floor(index / 64) % 256;
  const second = Math.floor(index / 8) % 256;
  const third = index % 256;
  return `${first}.${second}.${third}.0/24`;
};

// Helper function to generate price within a range
const generatePrice = (base: number): number => {
  const variance = Math.floor(Math.random() * 400) - 200; // ±200 variance
  return base + variance;
};

// Helper function to generate properties
const generateProperties = () => [
  { key: 'speed', value: `${Math.floor(Math.random() * 9 + 1)}Gbps`, icon: 'speed' },
  { key: 'latency', value: `${Math.floor(Math.random() * 50 + 10)}ms`, icon: 'latency' },
  { key: 'uptime', value: '99.9%', icon: 'uptime' },
];

export const additionalResources: Omit<Resource, 'isp' | 'properties'>[] = Array.from({ length: 50 }, (_, index) => {
  // Distribute locations evenly
  const locationIndex = index % 3;
  const location = ['美国', '德国', '日本'][locationIndex];
  
  // Alternate between native and broadcast
  const type = index % 2 === 0 ? 'native' : 'broadcast';
  
  // Base prices for different locations
  const basePrices = {
    '美国': 1999,
    '德国': 2099,
    '日本': 2299
  };

  // Generate purity level with weighted distribution
  const purityLevels = [1, 1, 1, 2, 2, 3]; // More likely to be level 1 or 2
  const purityLevel = purityLevels[Math.floor(Math.random() * purityLevels.length)] as 1 | 2 | 3;

  return {
    id: `additional_${index + 1}`,
    subnet: generateSubnet(index),
    location,
    purityLevel,
    price: generatePrice(basePrices[location]),
    type,
  };
});