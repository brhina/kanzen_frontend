export const ServiceItemStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type ServiceItemStatus = (typeof ServiceItemStatus)[keyof typeof ServiceItemStatus];
export type ServiceItemStatusType = ServiceItemStatus;
export const ServiceStatus = ServiceItemStatus;
export type ServiceStatus = ServiceItemStatus;
