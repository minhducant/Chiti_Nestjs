import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({ required: true, description: 'The member ID' })
  @IsOptional()
  @IsMongoId()
  readonly _id: string;

  // @ApiProperty({ required: false, default: '' })
  // @IsString()
  // readonly name: string;

  // @ApiProperty({ required: true, default: '' })
  // @IsOptional()
  // @IsString()
  // readonly image_url: string;
}
