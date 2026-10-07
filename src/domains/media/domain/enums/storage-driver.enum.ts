export const StorageDriver = {
  LOCAL: 'local',
  S3: 's3',
  R2: 'r2',
} as const;

export type StorageDriver = (typeof StorageDriver)[keyof typeof StorageDriver];
export type StorageDriverType = StorageDriver;
