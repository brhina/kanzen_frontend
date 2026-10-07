import type { HealthStatusValue } from '../domain/enums/health-status.enum';

export interface SubsystemHealth {
  status: 'up' | 'down';
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface MemoryHealth {
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
}

export interface ProcessHealth {
  pid: number;
  nodeVersion: string;
  platform: string;
}

export interface HealthResponseDto {
  status: HealthStatusValue;
  uptime: number;
  timestamp: string;
}

export interface DetailedHealthResponseDto extends HealthResponseDto {
  database: SubsystemHealth;
  redis: SubsystemHealth;
  queue: SubsystemHealth;
  memory: MemoryHealth;
  process: ProcessHealth;
}
