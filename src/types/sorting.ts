export type SortField = 'price' | 'subnet' | 'purityLevel';
export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}