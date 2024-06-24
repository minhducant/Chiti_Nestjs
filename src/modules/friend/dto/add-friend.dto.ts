import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({ required: true, description: 'The member ID' })
  @IsOptional()
  @IsMongoId()
  readonly _id: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  readonly image_url: string;
}
