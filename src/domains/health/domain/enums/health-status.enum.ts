export const HealthStatus = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
} as const;

export type HealthStatus = (typeof HealthStatus)[keyof typeof HealthStatus];
export type HealthStatusValue = HealthStatus;
