import axios from 'axios';
import { VietQR } from 'vietqr';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { GetPaymentDto } from './dto/get-payments.dto';
import { GetBankListDto } from './dto/get-bank-list.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { VnBank, VnBankDocument } from './schemas/vn-bank.schema';
import { paymentMethodsByCountry } from './config/payment-methods.config';
import { GetWalletDto, AddWalletDto, UpdateWalletDto } from './dto/wallet.dto';
import { GenerateQRCodeDto, LookupAccountDto } from './dto/generate-vietqr.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(VnBank.name) private VnBankModel: Model<WalletDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getPaymentMethods(GetPaymentDto: GetPaymentDto) {
    const normalizedCountryCode = GetPaymentDto.country.toUpperCase();
    return paymentMethodsByCountry[normalizedCountryCode] || [];
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async getVietNamBanks() {
    let vietQR = new VietQR({
      clientID: process.env.VIETQR_CLIENT_ID,
      apiKey: process.env.VIETQR_API_KEY,
    });
    try {
      const banks = await vietQR.getBanks();
      if (banks?.data) {
        await this.VnBankModel.deleteMany({});
        await this.VnBankModel.insertMany(banks.data);
      }
    } catch (err) {
      throw new Error('Failed to get list banks');
    }
  }

  async getVnBankList(getBankListDto: GetBankListDto) {
    const { name } = getBankListDto;
    const query: any = {};
    if (name) {
      const regexName = name.split(' ').join('.*');
      const regex = new RegExp(regexName, 'i');
      query.$or = [
        { name: { $regex: regex } },
        { code: { $regex: regex } },
        { shortName: { $regex: regex } },
        { short_name: { $regex: regex } },
      ];
    }
    const bankList = await this.VnBankModel.find(query).exec();
    if (bankList.length === 0) {
      await this.getVietNamBanks();
      return this.VnBankModel.find(query).exec();
    }
    return bankList;
  }

  async getWallet(
    getWalletDto: GetWalletDto,
    user_id: string,
  ): Promise<ResPagingDto<Wallet[]>> {
    const { sort, page, limit, type } = getWalletDto;
    const query: any = { user_id: new mongoose.Types.ObjectId(user_id) };
    if (type) {
      query.type = type;
    }
    const pipeline = [
      { $match: query },
      { $sort: { createdAt: sort } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];
    const [result, total] = await Promise.all([
      this.walletModel.aggregate(pipeline).exec(),
      this.walletModel.countDocuments(query),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async updateWallet(updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return await this.walletModel
      .findOneAndUpdate({ _id: updateWalletDto._id }, updateWalletDto, {
        new: true,
      })
      .exec();
  }

  async addWallet(payload: AddWalletDto): Promise<void> {
    await this.walletModel.create({
      ...payload,
    });
  }

  async deleteWalletById(walletId: string): Promise<void> {
    await this.walletModel.findByIdAndDelete(walletId).exec();
  }

  async generateQRCode(generateQRCodeDto: GenerateQRCodeDto): Promise<string> {
    const { bankCode, accountName, accountNumber, amount, description } =
      generateQRCodeDto;
    let vietQR = new VietQR({
      clientID: process.env.VIETQR_CLIENT_ID,
      apiKey: process.env.VIETQR_API_KEY,
    });
    try {
      const qrCodeData = await vietQR.genQRCodeBase64({
        bank: bankCode,
        accountName,
        accountNumber,
        amount: amount,
        memo: description,
        template: 'compact2',
      });
      return qrCodeData.data.data;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate QR code');
    }
  }

  async generateQuickLink(
    generateQRCodeDto: GenerateQRCodeDto,
  ): Promise<string> {
    const { bankCode, accountName, accountNumber, amount, description } =
      generateQRCodeDto;
    let vietQR = new VietQR({
      clientID: process.env.VIETQR_CLIENT_ID,
      apiKey: process.env.VIETQR_API_KEY,
    });
    try {
      const link = await vietQR.genQuickLink({
        bank: bankCode,
        accountName,
        accountNumber,
        amount: amount,
        memo: description,
        template: 'compact2',
        media: '.jpg',
      });
      return link;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate Quick Link');
    }
  }

  async lookupAccount(lookupAccount: LookupAccountDto) {
    const url = 'https://api.vietqr.io/v2/lookup';
    const headers = {
      'x-client-id': process.env.VIETQR_CLIENT_ID,
      'x-api-key': process.env.VIETQR_API_KEY,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.post(url, lookupAccount, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to lookup account');
    }
  }
}
