import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

import { ToolService } from './tool.service';
import {
  VatDto,
  IncomeTaxDto,
  LoanRepaymentDto,
  CompoundInterestDto,
} from './dto/finance.dto';

@ApiTags('Tool - Công cụ')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('vat')
  @ApiOperation({ summary: '[Tool] Calculate VAT' })
  calculateVAT(@Query() query: VatDto) {
    return this.toolService.calculateVAT(query.amount, query.rate);
  }

  @Get('fetch')
  @ApiOperation({ summary: '[Tool] Fetch API response from URL' })
  @ApiQuery({
    name: 'token',
    required: false,
  })
  async fetchApi(@Query('url') url: string, @Query('token') token?: string) {
    return await this.toolService.fetchApiResponse(url, token);
  }

  @Get('tax-info')
  @ApiOperation({ summary: '[Tool] Fetch tax information by tax code' })
  async fetchTaxInfo(@Query('tax_code') tax_code: string) {
    return await this.toolService.fetchTaxInfo(tax_code);
  }

  //   @Get('income-tax')
  //   @ApiOperation({ summary: 'Calculate Income Tax' })
  //   calculateIncomeTax(@Query() query: IncomeTaxDto) {
  //     const brackets = JSON.parse(query.taxBrackets);
  //     return this.toolService.calculateIncomeTax(query.income, brackets);
  //   }

  // @Get('loan-repayment')
  // @ApiOperation({ summary: '[Tool] Calculate Loan Repayment' })
  // calculateLoanRepayment(@Query() query: LoanRepaymentDto) {
  //   return this.toolService.calculateLoanRepayment(
  //     query.principal,
  //     query.annualRate,
  //     query.years,
  //   );
  // }

  // @Get('compound-interest')
  // @ApiOperation({ summary: '[Tool] Calculate Compound Interest' })
  // calculateCompoundInterest(@Query() query: CompoundInterestDto) {
  //   return this.toolService.calculateCompoundInterest(
  //     query.principal,
  //     query.rate,
  //     query.timesCompounded,
  //     query.years,
  //   );
  // }
}
