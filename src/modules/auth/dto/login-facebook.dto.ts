import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginFacebookDto {
  @ApiProperty({ description: 'Facebook access_token' })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
