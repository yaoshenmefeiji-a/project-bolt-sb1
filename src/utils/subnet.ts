export function calculateIpsInSubnet(subnet: string): number {
  const cidr = subnet.split('/')[1];
  if (!cidr) return 0;
  return Math.pow(2, 32 - parseInt(cidr));
}

export function calculatePricePerIp(price: number, subnet: string): number {
  const ips = calculateIpsInSubnet(subnet);
  return ips ? price / ips : 0;
}

export function formatPricePerIp(pricePerIp: number): string {
  return pricePerIp.toFixed(3);
}