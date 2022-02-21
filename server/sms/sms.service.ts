import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Ghasedak from 'ghasedak';
import { BASE_URL, SIMPLE_SMS } from './sms.constants';
import { SimpleMessage } from './sms.interfaces';

type Method = 'GET' | 'POST';

@Injectable()
export class SmsService {
  private readonly apiKey: string;
  private readonly ghasedak;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = configService.get('GHASEDAK_KEY');
    this.ghasedak = new Ghasedak(this.apiKey);
  }

  public async simpleSend(data: SimpleMessage) {
    return await this.ghasedak.send(data);
  }
}
