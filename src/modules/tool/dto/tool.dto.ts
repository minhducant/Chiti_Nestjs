import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsString, IsEnum, IsOptional } from 'class-validator';

export enum GoldAgency {
  BTMT = 'btmt',
  SJC = 'sjc',
  PNG = 'png',
  DOJI = 'doji',
  MI_HONG = 'mi_hong',
}

export class GoldPriceQueryDto {
  @ApiPropertyOptional({
    enum: GoldAgency,
    example: GoldAgency.BTMT,
    required: false,
  })
  @IsEnum(GoldAgency)
  @IsOptional()
  agency?: GoldAgency;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly city: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly date?: Date;
}
