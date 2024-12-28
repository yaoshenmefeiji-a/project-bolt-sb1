import { Resource } from '../types/resource';
import { additionalResources } from './additionalResources';

const initialResources: Resource[] = [
  {
    id: '1',
    subnet: '192.168.1.0/24',
    location: '美国',
    purityLevel: 1,
    price: 1999,
    type: 'native',
    isp: 'ISP',
    properties: [
      { key: 'speed', value: '10Gbps', icon: 'speed' },
      { key: 'latency', value: '20ms', icon: 'latency' },
      { key: 'uptime', value: '99.9%', icon: 'uptime' },
    ],
  },
  // ... 其他资源保持不变，但需要添加 isp 和 properties
];

const generateProperties = () => [
  { key: 'speed', value: `${Math.floor(Math.random() * 9 + 1)}Gbps`, icon: 'speed' },
  { key: 'latency', value: `${Math.floor(Math.random() * 50 + 10)}ms`, icon: 'latency' },
  { key: 'uptime', value: '99.9%', icon: 'uptime' },
];

export const mockResources: Resource[] = [...initialResources, ...additionalResources.map(resource => ({
  ...resource,
  isp: 'ISP',
  properties: generateProperties(),
}))];