import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBankListDto {
  @ApiProperty({
    required: false,
    description: 'Filter by bank name, code, shortName, or short_name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
