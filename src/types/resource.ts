export interface ResourceProperty {
  key: string;
  value: string;
  icon: 'speed' | 'latency' | 'uptime' | 'bandwidth';
}

export interface Resource {
  id: string;
  location: string;
  type: 'native' | 'broadcast';
  subnet: string;
  price: number;
  isp: string;
  purityLevel: number;
}

export interface SelectedResource extends Resource {
  selectedAt: number;
  expiresAt: number;
}