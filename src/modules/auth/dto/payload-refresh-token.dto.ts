import { ObjectId } from 'mongoose';

export class PayloadRefreshTokenDto {
  userId: ObjectId;
  date: number;
  iat: number;
  exp: number;
  refreshToken: string;
}
