import { Controller, Get, Query, DefaultValuePipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';

import { VatDto } from './dto/finance.dto';
import { ToolService } from './tool.service';
import { GoldPriceQueryDto } from './dto/tool.dto';

@ApiTags('Tool - Công cụ')
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('vat')
  @ApiOperation({ summary: '[Tool] Calculate VAT' })
  calculateVAT(@Query() query: VatDto) {
    return this.toolService.calculateVAT(query.amount, query.rate);
  }

  @Get('gold')
  @ApiOperation({ summary: '[Tool] Get Gold Price' })
  async goldPrice(@Query() query: GoldPriceQueryDto) {
    return this.toolService.fetchGoldPrice(query);
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
}
