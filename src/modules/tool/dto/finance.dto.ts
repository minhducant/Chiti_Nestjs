import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class VatDto {
  @ApiProperty({
    description: 'The amount on which VAT is to be calculated',
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The VAT rate in percentage',
    type: Number,
  })
  @IsNumber()
  rate: number;
}

export class IncomeTaxDto {
  @ApiProperty({
    description: 'The total income',
    type: Number,
  })
  @IsNumber()
  income: number;

  @ApiProperty({
    description: 'The tax brackets in JSON string format',
    type: String,
  })
  @IsString()
  taxBrackets: string;
}

export class CompoundInterestDto {
  @ApiProperty({
    description: 'The principal amount',
    type: Number,
  })
  @IsNumber()
  principal: number;

  @ApiProperty({
    description: 'The annual interest rate in percentage',
    type: Number,
  })
  @IsNumber()
  rate: number;

  @ApiProperty({
    description: 'The number of times interest applied per time period',
    type: Number,
  })
  @IsNumber()
  timesCompounded: number;

  @ApiProperty({
    description: 'The number of years the money is invested for',
    type: Number,
  })
  @IsNumber()
  years: number;
}

export class LoanRepaymentDto {
  @ApiProperty({
    description: 'The loan principal amount',
    type: Number,
  })
  @IsNumber()
  principal: number;

  @ApiProperty({
    description: 'The annual interest rate in percentage',
    type: Number,
  })
  @IsNumber()
  annualRate: number;

  @ApiProperty({
    description: 'The number of years to repay the loan',
    type: Number,
  })
  @IsNumber()
  years: number;
}
