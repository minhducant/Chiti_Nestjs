import {
  HttpStatus,
  HttpException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { httpErrors } from '../exceptions';

export const UserID = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const token =
        request?.headers?.authorization?.replace('Bearer ', '') || '';
      const jwtService = new JwtService({});
      const decodedToken: any = jwtService.decode(token);
      if (decodedToken && decodedToken.userId) {
        return decodedToken.userId.toString();
      } else {
        throw new HttpException(
          httpErrors.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (e) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  },
);

// import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
// import { httpErrors } from '../exceptions';

// export const UserID = createParamDecorator((data: string, ctx: ExecutionContext) => {
//   try {
//     return ctx.switchToHttp().getRequest()?.user?._id.toString();
//   } catch (e) {
//     throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
//   }
// });

