import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class GetNoteDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  readonly user_id: string;
}
