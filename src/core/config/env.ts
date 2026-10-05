import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .min(1, 'API Base URL is required')
    .refine(
      (val) =>
        val.startsWith('/') ||
        val.startsWith('http://') ||
        val.startsWith('https://'),
      {
        message:
          'API Base URL must be an absolute URL or a path starting with /',
      },
    ),
  VITE_APP_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  MODE: z.string().optional(),
  DEV: z.boolean().optional(),
  PROD: z.boolean().optional(),
});

const rawEnv = {
  VITE_API_BASE_URL:
    import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  VITE_APP_ENV:
    import.meta.env?.VITE_APP_ENV ||
    (import.meta.env?.MODE as 'development' | 'test' | 'production') ||
    'development',
  MODE: import.meta.env?.MODE,
  DEV: import.meta.env?.DEV,
  PROD: import.meta.env?.PROD,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', parsed.error.format());
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = {
  API_BASE_URL: parsed.data.VITE_API_BASE_URL.replace(/\/+$/, ''),
  APP_ENV: parsed.data.VITE_APP_ENV,
  IS_DEV: parsed.data.VITE_APP_ENV === 'development',
  IS_PROD: parsed.data.VITE_APP_ENV === 'production',
  IS_TEST: parsed.data.VITE_APP_ENV === 'test',
} as const;

export type EnvConfig = typeof env;
