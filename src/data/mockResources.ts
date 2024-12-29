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
  {
    id: '2',
    subnet: '192.168.2.0/24',
    location: '德国',
    purityLevel: 2,
    price: 2099,
    type: 'broadcast',
    isp: 'ISP',
    properties: [
      { key: 'speed', value: '5Gbps', icon: 'speed' },
      { key: 'latency', value: '30ms', icon: 'latency' },
      { key: 'uptime', value: '99.9%', icon: 'uptime' },
    ],
  },
  {
    id: '3',
    subnet: '192.168.3.0/24',
    location: '日本',
    purityLevel: 1,
    price: 2299,
    type: 'native',
    isp: 'ISP',
    properties: [
      { key: 'speed', value: '8Gbps', icon: 'speed' },
      { key: 'latency', value: '15ms', icon: 'latency' },
      { key: 'uptime', value: '99.9%', icon: 'uptime' },
    ],
  },
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