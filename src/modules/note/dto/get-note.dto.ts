import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

import { StatusEnum } from 'src/shares/enums/note.enum';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetNoteDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({ required: false, enum: StatusEnum })
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
