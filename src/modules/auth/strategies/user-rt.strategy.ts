import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JWT_CONSTANTS } from '../auth.constants';
import { PayloadRefreshTokenDto } from '../dto/payload-refresh-token.dto';

@Injectable()
export class UserRtStrategy extends PassportStrategy(Strategy, 'user-jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONSTANTS.userRefreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: PayloadRefreshTokenDto): Promise<any> {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
