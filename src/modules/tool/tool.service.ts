import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class ToolService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        keepAlive: true,
        maxSockets: 10,
        maxFreeSockets: 10,
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
      return { error: error.message };
    }
  }

  calculateVAT(amount: number, rate: number): number {
    return amount * (rate / 100);
  }

  calculateIncomeTax(
    income: number,
    taxBrackets: { rate: number; threshold: number }[],
  ): number {
    let tax = 0;
    for (const bracket of taxBrackets) {
      if (income > bracket.threshold) {
        tax += (income - bracket.threshold) * (bracket.rate / 100);
        income = bracket.threshold;
      }
    }
    return tax;
  }

  calculateCompoundInterest(
    principal: number,
    rate: number,
    timesCompounded: number,
    years: number,
  ): number {
    return (
      principal * Math.pow(1 + rate / timesCompounded, timesCompounded * years)
    );
  }

  calculateLoanRepayment(
    principal: number,
    annualRate: number,
    years: number,
  ): number {
    const monthlyRate = annualRate / 12 / 100;
    const numberOfPayments = years * 12;
    return (
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
    );
  }
}
