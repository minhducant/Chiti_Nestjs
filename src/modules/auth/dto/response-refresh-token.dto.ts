export class ResponseRefreshTokenDto {
  accessToken: string;
  refreshToken: string;
  iat: number;
  exp: number;
}
