import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GenerateQRCodeDto {
  @ApiProperty({ required: true, default: '970423' })
  @IsOptional()
  @IsString()
  bankCode: string;

  @ApiProperty({ required: true, default: 'Do Minh Duc' })
  @IsOptional()
  @IsString()
  accountName: string;

  @ApiProperty({ required: true, default: '03639886616' })
  @IsOptional()
  @IsString()
  accountNumber: string;

  @ApiProperty({ required: true, default: '100000' })
  @IsOptional()
  @IsString()
  amount: string;

  @ApiProperty({ required: false, default: 'Tien phong thang 6 phong 506' })
  @IsOptional()
  @IsString()
  description: string;
}

export class LookupAccountDto {
  @ApiProperty({ required: true, default: '970423' })
  @IsOptional()
  @IsString()
  bin: string;

  @ApiProperty({ required: true, default: '03639886616' })
  @IsOptional()
  @IsString()
  accountNumber: string;
}
