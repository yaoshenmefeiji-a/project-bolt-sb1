export interface ServerConfig {
  serverSpec: string;
  bandwidthType: 'dedicated' | 'shared';
  bandwidthSpeed: string;
  trafficLimit: string;
  osType: 'Linux' | 'Windows' | '';
  os: string;
  osVersion: string;
  period: 'month' | 'quarter' | 'halfYear' | 'year';
  notes: string;
  cpu: string;
  memory: string;
  storage: string;
  price: number;
  bandwidthPrice: number;
}