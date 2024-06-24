import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetDebtDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  lender_id?: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  borrower_id?: string;

  @ApiProperty({ required: false, type: Number})
  @IsOptional()
  @IsNumber()
  readonly status?: Number;
}
