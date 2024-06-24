import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginGoogleDto {
  @ApiProperty({ description: 'Google access_token' })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
