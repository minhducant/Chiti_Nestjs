import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetNoteDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({ required: false, type: Number})
  @IsOptional()
  @IsNumber()
  readonly status?: Number;
}
