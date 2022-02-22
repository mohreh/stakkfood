import { Inject, Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { BASE_URL, SIMPLE_SMS } from './sms.constants';
import { SmsModuleOptions, SmsSubmitData } from './sms.interfaces';

@Injectable()
export class SmsService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: SmsModuleOptions,
  ) {}

  public async request(
    action: string,
    data: Record<any, any> = null,
    method: Method = 'POST',
  ) {
    const res = await axios.request({
      method,
      url: BASE_URL + action + this.options.apiKey,
      data,
    });
    return res;
  }

  public async sendAuthenticationCode(data: SmsSubmitData) {
    return await this.request(SIMPLE_SMS, data);
  }
}
