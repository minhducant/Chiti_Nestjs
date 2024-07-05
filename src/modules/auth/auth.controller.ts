import { User } from '@sentry/node';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserRtGuards } from './guards/user-rt.guard';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { PayloadRefreshTokenDto } from './dto/payload-refresh-token.dto';
import { ResponseRefreshTokenDto } from './dto/response-refresh-token.dto';
import { GetCurrentUser } from 'src/shares/decorators/get-current-user.decorators';

@Controller('auth')
@ApiTags('Auth - Xác thực')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('current-user')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Auth] Get User Information' })
  async currentUser(@UserID() userId: string): Promise<User> {
    return this.userService.findById(userId);
  }

  @Post('login-apple')
  @ApiOperation({ summary: '[Auth] Login with Apple' })
  async logInApple(
    @Body() loginInstagramDto: LoginGoogleDto,
  ): Promise<ResponseLogin> {
    return this.authService.logInGoogle(loginInstagramDto);
  }

  @Post('login-google')
  @ApiOperation({ summary: '[Auth] Login with Google' })
  async logInGoogle(
    @Body() loginInstagramDto: LoginGoogleDto,
  ): Promise<ResponseLogin> {
    return this.authService.logInGoogle(loginInstagramDto);
  }

  @Post('login-facebook')
  @ApiOperation({ summary: '[Auth] Login with Facebook' })
  async loginFacebook(
    @Body() loginFacebookDto: LoginFacebookDto,
  ): Promise<ResponseLogin> {
    return this.authService.loginFacebook(loginFacebookDto);
  }

  @Post('refresh-access-token')
  @ApiOperation({ summary: '[Auth] Get new Access Token' })
  @UseGuards(UserRtGuards)
  async userRefreshAccessToken(
    @GetCurrentUser() user: PayloadRefreshTokenDto,
  ): Promise<ResponseRefreshTokenDto> {
    return this.authService.UserGetAccessToken(user);
  }
}
