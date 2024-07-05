import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

import { Wallet } from './schemas/wallet.schema';
import { PaymentService } from './payment.service';
import { GetPaymentDto } from './dto/get-payments.dto';
import { GetBankListDto } from './dto/get-bank-list.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { GetWalletDto, AddWalletDto, UpdateWalletDto } from './dto/wallet.dto';
import { GenerateQRCodeDto, LookupAccountDto } from './dto/generate-vietqr.dto';

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
  ): Promise<ResPagingDto<[]>> {
    return this.paymentService.getPaymentMethods(query);
  }

  @Get('/vn/banks')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Get Vietnam banks' })
  async getBankList(@Query() query: GetBankListDto) {
    return this.paymentService.getVnBankList(query);
  }

  @Get('/wallet/get')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Get All Wallets' })
  async find(
    @UserID() userId: string,
    @Query() query: GetWalletDto,
  ): Promise<ResPagingDto<Wallet[]>> {
    return this.paymentService.getWallet(query, userId);
  }

  @Post('/wallet/add')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Add Wallet to Database' })
  async addWallet(
    @Body() body: AddWalletDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.paymentService.addWallet(body);
  }

  @Put('/wallet/update')
  @ApiOperation({ summary: '[Payment] Update Wallet to Database' })
  @ApiBearerAuth()
  async updateWallet(@Body() updateWalletDto: UpdateWalletDto): Promise<void> {
    await this.paymentService.updateWallet(updateWalletDto);
  }

  @Delete('/wallet/delete/:id')
  @ApiOperation({ summary: '[Payment] Delete Wallet by _id' })
  @ApiBearerAuth()
  async deleteWallet(@Param('id') walletId: string): Promise<void> {
    await this.paymentService.deleteWalletById(walletId);
  }

  @Post('/vn/lookup-account')
  @ApiOperation({ summary: '[Payment] Lookup Banking account' })
  @ApiBearerAuth()
  async lookupAccount(@Body() lookupAccount: LookupAccountDto) {
    return this.paymentService.lookupAccount(lookupAccount);
  }

  @Post('/vn/generate-qrcode')
  @ApiOperation({ summary: '[Payment] Generate QR Code for Bank Transfer' })
  @ApiBearerAuth()
  async generateQRCode(
    @Body() generateQRCodeDto: GenerateQRCodeDto,
  ): Promise<{ qrCodeUrl: string }> {
    const qrCodeUrl =
      await this.paymentService.generateQRCode(generateQRCodeDto);
    return { qrCodeUrl };
  }

  @Post('/vn/generate-quicklink')
  @ApiOperation({ summary: '[Payment] Generate Quick Link for Bank Transfer' })
  @ApiBearerAuth()
  async generateQuickLink(
    @Body() generateQRCodeDto: GenerateQRCodeDto,
  ): Promise<{ qrCodeUrl: string }> {
    const qrCodeUrl =
      await this.paymentService.generateQuickLink(generateQRCodeDto);
    return { qrCodeUrl };
  }
}
