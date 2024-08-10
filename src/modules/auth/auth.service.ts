import {
  Inject,
  Injectable,
  HttpStatus,
  HttpException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as config from 'config';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import {
  JWT_CONSTANTS,
  USER_AUTH_CACHE_PREFIX,
} from 'src/modules/auth/auth.constants';
import { httpErrors } from 'src/shares/exceptions';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { UserGoogleInfoDto } from './dto/user-google-info.dto';
import { UserFacebookInfoDto } from './dto/user-facebook-info.dto';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { PayloadRefreshTokenDto } from './dto/payload-refresh-token.dto';
import { ResponseRefreshTokenDto } from './dto/response-refresh-token.dto';
import { PayloadAccessTokenDto } from 'src/shares/dtos/payload-access-token.dto';

const baseZaloUrl = config.get<string>('zalo.base_api');
const baseGoogleUrl = config.get<string>('google.base_api');
const baseFacebookUrl = config.get<string>('facebook.graph_api');

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  async UserGetAccessToken(
    payload: PayloadRefreshTokenDto,
  ): Promise<ResponseRefreshTokenDto> {
    const { userId, refreshToken } = payload;
    const [user, oldRefreshToken] = await Promise.all([
      this.userService.findById(userId.toString()),
      this.cacheManager.get<string>(`${USER_AUTH_CACHE_PREFIX}${userId}`),
    ]);
    if (!user) throw new ForbiddenException();
    if (!oldRefreshToken)
      throw new HttpException(
        httpErrors.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    if (refreshToken === oldRefreshToken) {
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateUserAccessToken(user['_id']),
        this.generateUserRefreshToken(user['_id']),
      ]);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        iat: Date.now(),
        exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
      };
    } else
      throw new HttpException(
        httpErrors.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
  }

  async generateUserAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      {
        userId: user,
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.userAccessTokenSecret,
        expiresIn: JWT_CONSTANTS.userAccessTokenExpiry,
      },
    );
  }

  async generateUserRefreshToken(user: User): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: user,
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.userAccessTokenSecret,
        expiresIn: JWT_CONSTANTS.userAccessTokenExpiry,
      },
    );
    // await this.cacheManager.set(
    //   `${USER_AUTH_CACHE_PREFIX}${user['_id']}`,
    //   refreshToken,
    //   JWT_CONSTANTS.userAccessTokenExpiry,
    // );
    return refreshToken;
  }

  async decodeAccessToken(
    accessToken: string,
  ): Promise<PayloadAccessTokenDto | any> {
    return this.jwtService.decode(accessToken);
  }

  async loginFacebook(
    loginFacebookDto: LoginFacebookDto,
  ): Promise<ResponseLogin> {
    const { accessToken } = loginFacebookDto;
    const url = `${baseFacebookUrl}me?fields=id,first_name,last_name,picture&access_token=${accessToken}`;
    const userData: UserFacebookInfoDto = await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) => {
            return response.data || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );
    if (!userData) {
      throw new BadRequestException(
        httpErrors.FACEBOOK_TOKEN_INVALID_OR_EXPIRES,
      );
    }
    const user = await this.userService.findOrCreateFacebookUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateUserAccessToken(user['_id']),
      this.generateUserRefreshToken(user['_id']),
    ]);
    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
    };
  }

  async logInGoogle(loginGoogleDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginGoogleDto;
    const url = `${baseGoogleUrl}userinfo?access_token=${accessToken}`;
    const userData: UserGoogleInfoDto = await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) => {
            return response || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );
    if (!userData) {
      throw new BadRequestException(httpErrors.GOOGLE_TOKEN_INVALID_OR_EXPIRES);
    }
    const user = await this.userService.findOrCreateGoogleUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateUserAccessToken(user['_id']),
      this.generateUserRefreshToken(user['_id']),
    ]);
    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
    };
  }

  async logInZalo(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
    const url = `${baseZaloUrl}me?fields=id,name,picture`;
    const userData = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: {
            access_token: accessToken,
          },
        })
        .pipe(
          map((response) => {
            return response.data || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );
    if (userData.error === 452) {
      throw new BadRequestException(httpErrors.ZALO_TOKEN_INVALID_OR_EXPIRES);
    }
    const user = await this.userService.findOrCreateZaloUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateUserAccessToken(user['_id']),
      this.generateUserRefreshToken(user['_id']),
    ]);
    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
    };
  }

  async logInApple(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
  }

  async logInLINE(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
    const url = 'https://api.line.me/v2/profile';
    const userData = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          map((response) => {
            return response.data || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );
    if (!userData) {
      throw new BadRequestException(httpErrors.ZALO_TOKEN_INVALID_OR_EXPIRES);
    }
    const user = await this.userService.findOrCreateLINEUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateUserAccessToken(user['_id']),
      this.generateUserRefreshToken(user['_id']),
    ]);
    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
    };
  }

  async logInX(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
    const url = "https://api.twitter.com/2/me";
    const userData = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          map((response) => {
            return response.data || null;
          }),
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new BadRequestException(error.message);
          }),
        ),
    );
    console.log(userData)
    // if (userData.error === 452) {
    //   throw new BadRequestException(httpErrors.ZALO_TOKEN_INVALID_OR_EXPIRES);
    // }
    // const user = await this.userService.findOrCreateZaloUser(userData);
    // const [accessToken_, refreshToken] = await Promise.all([
    //   this.generateUserAccessToken(user['_id']),
    //   this.generateUserRefreshToken(user['_id']),
    // ]);
    // return {
    //   accessToken: accessToken_,
    //   refreshToken,
    //   iat: Date.now(),
    //   exp: Date.now() + JWT_CONSTANTS.userAccessTokenExpiry,
    // };
  }

  async logInKakaoTalk(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
    const url = `https://kapi.kakao.com/v1/api/talk/profile`;
  }

  async logInWhatsApp(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
  }

  async logInWeChat(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
  }

  async logInSnapchat(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
  }

  async logInTwitter(loginDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginDto;
  }
}
