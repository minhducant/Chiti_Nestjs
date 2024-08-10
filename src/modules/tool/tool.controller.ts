import { Get, Query, Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { VatDto } from './dto/finance.dto';
import { ToolService } from './tool.service';
import {
  KQSXQueryDto,
  LogTelegramDto,
  ExchangeRateQueryDto,
} from './dto/tool.dto';

@ApiTags('Tool - Công cụ')
@ApiBearerAuth()
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('vat')
  @ApiOperation({ summary: '[Tool] Calculate VAT' })
  calculateVAT(@Query() query: VatDto) {
    return this.toolService.calculateVAT(query.amount, query.rate);
  }

  @Get('tax')
  @ApiOperation({ summary: '[Tool] Fetch Tax info' })
  async fetchTaxInfo(@Query('tax_code') tax_code: string) {
    return await this.toolService.fetchTaxInfo(tax_code);
  }

  @Get('gas')
  @ApiOperation({ summary: '[Tool] Get Petro Price' })
  async petroPrice() {
    return this.toolService.fetchPetroleumPrice();
  }

  @Get('gold')
  @ApiOperation({ summary: '[Tool] Get Gold Price' })
  async goldPrice() {
    return this.toolService.fetchGoldPrice();
  }

  @Get('kqsx')
  @ApiOperation({ summary: '[Tool] Get Lottery results' })
  async KQSX(@Query() query: KQSXQueryDto) {
    return this.toolService.fetchKQSX(query);
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

  @Get('exchange')
  @ApiOperation({ summary: '[Tool] Get Exchange Rate list Vietnam' })
  async fetchExchangeRate(@Query() query: ExchangeRateQueryDto) {
    return this.toolService.fetchExchangeRate(query);
  }

  @Get('telegram')
  @ApiOperation({ summary: '[Tool] Send Message to Telegram Chatbot' })
  async logTelegram(@Query() query: LogTelegramDto) {
    return this.toolService.sendPaymentNotificationMessage(query.message);
  }
}
