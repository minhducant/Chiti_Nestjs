import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { parseStringPromise } from 'xml2js';

import { GoldPriceQueryDto } from './dto/tool.dto';

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

  async fetchGoldPrice(query: GoldPriceQueryDto) {
    try {
      if (query.agency === 'btmt') {
        const url = `http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v`;
        const response = await axios.get(url);
        return response?.data?.DataList?.Data;
      }
      if (query.agency === 'doji') {
        const url = `http://giavang.doji.vn/api/giavang/?api_key=258fbd2a72ce8481089d88c678e9fe4f`;
        const response = await axios.get(url);
        const xmlData = response?.data;
        const jsonData = await parseStringPromise(xmlData, {
          explicitArray: false,
          mergeAttrs: true,
        });
        return jsonData;
      }
      if (query.agency === 'sjc') {
        const url = `https://sjc.com.vn/xml/tygiavang.xml`;
        const response = await axios.get(url);
        const xmlData = response?.data;
        const jsonData = await parseStringPromise(xmlData, {
          explicitArray: false,
          mergeAttrs: true,
        });
        return jsonData;
      }
      if (query.agency === 'mi_hong') {
        const url = `https://www.mihong.vn/api/v1/gold/prices/current`;
        const response = await axios.get(url);
        return response?.data?.data;
      } else {
        return [];
      }
    } catch (error) {
      return { error: error.message };
    }
  }
}
