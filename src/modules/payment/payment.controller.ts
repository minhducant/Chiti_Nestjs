import { DecodedIdToken } from 'firebase-admin/auth';
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
import { GetPaymentDto } from './dto/get-payments.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Payment - Thanh toán, chuyển tiền')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/list')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Get list payments' })
  async getNotifications(
    @UserID() user_id: string,
    @Query() query: GetPaymentDto,
  ): Promise<ResPagingDto<Notification[]>> {
    return this.paymentService.getPaymentMethods(query);
  }

  @Get('/vn/banks')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Get list of Vietnam banks' })
  async getBankList() {
    return this.paymentService.getVietNamBanks();
  }
}
