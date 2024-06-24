import axios from 'axios';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { GetPaymentDto } from './dto/get-payments.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  listVietnamBanks,
  paymentMethodsByCountry,
} from './config/payment-methods.config';

@Injectable()
export class PaymentService {
  private bankListCache: any;
  private bankListCacheTimestamp: number;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.bankListCache = null;
    this.bankListCacheTimestamp = 0;
  }
  async getPaymentMethods(GetPaymentDto: GetPaymentDto) {
    const normalizedCountryCode = GetPaymentDto.country.toUpperCase();
    return paymentMethodsByCountry[normalizedCountryCode] || [];
  }

  async getVietNamBanks() {
    // const cacheTTL = 86400000; // 1 day in milliseconds
    // const now = Date.now();
    // if (this.bankListCache && now - this.bankListCacheTimestamp < cacheTTL) {
    //   return this.bankListCache;
    // }
    // try {
    //   const response = await axios.get('https://api.vietqr.io/v2/banks');
    //   this.bankListCache = response.data;
    //   this.bankListCacheTimestamp = now;
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error fetching bank list: ${error.message}`);
    //   throw error;
    // }
    return listVietnamBanks || [];
  }
}
