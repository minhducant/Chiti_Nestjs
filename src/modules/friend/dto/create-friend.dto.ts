import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateFriendDto {
  @ApiProperty({ required: true, description: 'The member ID' })
  @IsOptional()
  @IsMongoId()
  readonly friend_id: string;
}
