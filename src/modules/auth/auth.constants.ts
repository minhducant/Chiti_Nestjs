import * as config from 'config';

export const JWT_CONSTANTS = {
  clientAccessTokenSecret: config.get<string>(
    'app.client_jwt_access_token_secret',
  ),
  clientAccessTokenExpiry: parseInt(
    config.get<string>('app.client_jwt_access_token_expiration_time'),
  ),
  clientRefreshTokenSecret: config.get<string>(
    'app.client_jwt_refresh_token_secret',
  ),
  clientRefreshTokenExpiry: parseInt(
    config.get<string>('app.client_jwt_refresh_token_expiration_time'),
  ),
  userAccessTokenSecret: config.get<string>('app.user_jwt_access_token_secret'),
  userAccessTokenExpiry: parseInt(
    config.get<string>('app.user_jwt_access_token_expiration_time'),
  ),
  userRefreshTokenSecret: config.get<string>(
    'app.user_jwt_refresh_token_secret',
  ),
  userRefreshTokenExpiry: parseInt(
    config.get<string>('app.user_jwt_refresh_token_expiration_time'),
  ),
};

export const SIGN_UP_EXPIRY = parseInt(
  config.get<string>('sign_up_expiration_time'),
);

export const FORGOT_PASSWORD_EXPIRY = parseInt(
  config.get<string>('forgot_password_expiration_time'),
);

export const SIGN_UP_CACHE = 'SIGN_CACHE_';

export const FORGOT_PASSWORD_CACHE = 'FORGOT_PASSWORD_CACHE_';

export const USER_AUTH_CACHE_PREFIX = 'USER_AUTH_CACHE_PREFIX_';

export const CLIENT_AUTH_CACHE_PREFIX = 'CLIENT_AUTH_CACHE_PREFIX_';
