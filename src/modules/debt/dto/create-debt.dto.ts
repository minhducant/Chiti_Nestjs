import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId, IsOptional } from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsMongoId()
  readonly lender_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsMongoId()
  readonly borrower_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsMongoId()
  readonly note_id: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly note: string;

  @ApiProperty({ required: true, type: Number, example: 0 })
  @IsNumber()
  readonly cost: Number;

  @ApiProperty({ required: false, type: Number, example: 0, default: 0 })
  @IsNumber()
  readonly interest: Number;

  @ApiProperty({ required: false, type: Number, example: 0, default: 0 })
  @IsNumber()
  readonly status: Number;
}
