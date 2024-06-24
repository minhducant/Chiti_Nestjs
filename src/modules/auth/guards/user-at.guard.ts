import { AuthGuard } from '@nestjs/passport';

export class UserAtGuards extends AuthGuard('user-jwt') {
  constructor() {
    super();
  }
}
