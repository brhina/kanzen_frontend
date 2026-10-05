export const LeadStatus = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  DISQUALIFIED: 'disqualified',
  CONVERTED: 'converted',
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];
