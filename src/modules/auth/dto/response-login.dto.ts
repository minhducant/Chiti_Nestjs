export class ResponseLogin {
  accessToken: string;
  refreshToken?: string;
  iat: number;
  exp: number;
  _id?: string;
}
