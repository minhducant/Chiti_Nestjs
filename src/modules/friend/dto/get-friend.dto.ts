import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetFriendDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;
}
