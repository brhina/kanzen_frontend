export const AuthTokenType = {
  BEARER: 'Bearer',
} as const;

export type AuthTokenType = (typeof AuthTokenType)[keyof typeof AuthTokenType];

export const AuthStatus = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  REFRESHING: 'refreshing',
  LOADING: 'loading',
} as const;

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];
