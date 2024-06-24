import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { paymentMethodsCode } from '../config/payment-methods.config';

export class GetPaymentDto {
  @ApiProperty({
    required: false,
    default: 'VN',
    enum: paymentMethodsCode,
    description:
      'Country code. E.g.: VN (Vietnam), JP (Japan), KR (South Korea), etc.',
  })
  @IsOptional()
  @IsString()
  @IsIn(paymentMethodsCode)
  readonly country: string;
}
