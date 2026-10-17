export const ConsultationType = {
  CONSULTATION: 'consultation',
  TRAINING: 'training',
} as const;

export type ConsultationType =
  (typeof ConsultationType)[keyof typeof ConsultationType];
