import { Injectable } from '@nestjs/common';
import axios from 'axios';
import moment from 'moment';
import * as https from 'https';

import { KQSXQueryDto, ExchangeRateQueryDto } from './dto/tool.dto';

@Injectable()
export class ToolService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        keepAlive: true,
        maxSockets: 10,
        maxFreeSockets: 10,
        rejectUnauthorized: false,
      }),
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });
  }

  async fetchApiResponse(url: string, token?: string) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await this.axiosInstance.get(url, { headers });
      return response?.data;
    } catch (error) {
      return { error: error.message };
    }
  }

  async fetchTaxInfo(tax_code: string) {
    try {
      const url = `https://api.vietqr.io/v2/business/${tax_code}`;
      const response = await axios.get(url);
      return response?.data;
    } catch (error) {
      return { error: error };
    }
  }

  calculateVAT(amount: number, rate: number): number {
    return amount * (rate / 100);
  }

  async fetchGoldPrice() {
    const url =
      'https://baomoi.com/_next/data/uZbPKprv4IEKetyH91lar/utilities/gold/sjc.json';
    try {
      const response = await this.axiosInstance.get(url);
      return response?.data?.pageProps?.resp?.data?.content?.boards;
    } catch (error) {
      return { error: error.message };
    }
  }

  async fetchPetroleumPrice() {
    const url =
      'https://baomoi.com/_next/data/uZbPKprv4IEKetyH91lar/utilities/petroleum.json';
    try {
      const response = await this.axiosInstance.get(url);
      return response?.data?.pageProps?.resp?.data?.content;
    } catch (error) {
      return { error: error.message };
    }
  }

  async fetchKQSX(query: KQSXQueryDto) {
    const baseUrl =
      'https://baomoi.com/_next/data/uZbPKprv4IEKetyH91lar/utilities/lottery';
    const { type, province, date, type_vietlott } = query;
    let url = baseUrl;
    if (type === 'kqsx') {
      if (province) {
        url += `/${province}.json`;
        if (date) url += `?date=${date}&slug=${province}`;
        else url += `?slug=${province}`;
      }
    } else if (type_vietlott) {
      url += `/vietlott/${type_vietlott}.json`;
      if (date) url += `?date=${date}&slug=${type_vietlott}`;
      else url += `?slug=${type_vietlott}`;
    }
    try {
      const response = await this.axiosInstance.get(url);
      return response?.data?.pageProps?.resp?.data?.content;
    } catch (error) {
      return { error: error.message };
    }
  }

  async fetchExchangeRate(query: ExchangeRateQueryDto) {
    const url = `https://baomoi.com/_next/data/uZbPKprv4IEKetyH91lar/utilities/exchange-rate/${query.bank}.json?shortName=${query.bank}`;
    try {
      const response = await this.axiosInstance.get(url);
      return response?.data?.pageProps?.resp?.data?.content;
    } catch (error) {
      return { error: error.message };
    }
  }

  async LogTelegram(message: string) {
    const chatId = '-1002146975231';
    const telegramBotToken = '6380191156:AAEevp_arLDk874xSYfrfjymCZsXee5xEwo';
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${message}`,
      );
      return response;
    } catch (error) {
      console.error('Error sending log message to Telegram:', error);
    }
  }

  async sendPaymentNotificationMessage(payment: any) {
    const Format3Dot = (currency: number) => {
      return currency.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };
    let message = `🔊 +${Format3Dot(payment?.amount || 0)} ${payment.content}`;
    message += `\r\n💰 Số tiền: ${Format3Dot(payment?.amount || 0)}`;
    message += `\r\n📇 Nội dung: ${payment?.content}`;
    message += `\r\n💳 Tài khoản: ${payment.account_receiver} (${payment.gate})`;
    message += `\r\n📅 Thời gian: ${moment(payment?.date).format(
      'HH:mm DD/MM/YYYY',
    )}`;
    message += `\r\n🗃 Transaction id: ${payment?.transaction_id}`;
    message += `\r\n---`;
    await this.LogTelegram(message);
  }
}
