export interface AuthTokensEntity {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}
