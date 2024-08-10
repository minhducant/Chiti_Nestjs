import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetBattlesDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiProperty({
    description: 'Filter by battle status',
    enum: [0, 1, 2, 3],
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}
