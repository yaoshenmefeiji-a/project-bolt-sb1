export const COMMITMENT_PERIODS = Array.from(
  { length: 34 }, 
  (_, i) => i + 3
) as const;