import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId } from 'class-validator';

export class RegisterNotificationDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly notification_token: string;
}
