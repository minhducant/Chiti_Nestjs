import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    required: true,
    example: -1,
    description: '',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsIn([1, -1])
  sort?: -1 | 1 = -1;

  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Max(100)
  @IsPositive()
  @IsOptional()
  limit?: number = 10;
}

export class ResPagingDto<T> {
  result: T;
  total: number;
  lastPage: number;
}
