import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';



export class GeneratePaypalQRCodeDto {
  @ApiProperty({ required: false, default: 'test@gmail.com' })
  @IsOptional()
  @IsEmail()
  readonly email_address: string;

  @ApiProperty({ required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  readonly currency_code: string;

  @ApiProperty({ required: false, default: '100' })
  @IsOptional()
  @IsString()
  readonly value: string;

  @ApiProperty({ required: true})
  @IsOptional()
  @IsString()
  readonly note: string;

  @ApiProperty({ required: true})
  @IsOptional()
  @IsString()
  readonly invoicer_given_name: string;

  @ApiProperty({ required: true})
  @IsOptional()
  @IsString()
  readonly recipient_email_address: string;
}
