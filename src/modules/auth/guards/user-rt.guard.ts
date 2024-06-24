import { AuthGuard } from '@nestjs/passport';

export class UserRtGuards extends AuthGuard('user-jwt-refresh') {
  constructor() {
    super();
  }
}
