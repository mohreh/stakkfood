import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDev } from '../common/common.constants';
import { authenticationCodeGenerator } from '../common/nanoid';
import { SmsService } from '../sms/sms.service';
import { VerifyPinDto } from './dtos/verify-pin.dto';
import { AuthCode } from './entities/auth-code.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthCode)
    private readonly authCodeRepo: Repository<AuthCode>,
    private readonly smsService: SmsService,
  ) {}

  async sendAuthenticationCode(receptor: string) {
    const pin = authenticationCodeGenerator();

    try {
      let authCode = (await this.authCodeRepo.find({ receptor }))[0];
      let id: string;

      if (!authCode) {
        authCode = this.authCodeRepo.create({
          pin,
          receptor,
        });

        id = (await this.authCodeRepo.save(authCode)).id;
      } else {
        id = authCode.id;
        authCode = await this.authCodeRepo.save({
          id,
          pin,
          expireOn: new Date(Date.now() + 30 * 1000),
        });
      }

      // const msg = await this.smsService.simpleSend({
      //   message: `your authentication code: ${pin}`,
      //   receptor: phoneNumber,
      //   linenumber: '10008566',
      // });

      return id;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyAuthenticationCode({ reqId, pin }: VerifyPinDto) {
    const authCode = await this.authCodeRepo.findOne(reqId);
    if (!authCode) {
      throw new BadRequestException(
        'pin you entered doesnt exist on database or expired',
      );
    }

    if (pin !== authCode.pin) {
      throw new BadRequestException('pin you enterd is wrong');
    }

    return true;
  }

  // for remove expired pins from database
  @Interval(isDev ? 100 * 1000 : 2 * 1000)
  async deleteOldAuthenticationCodes() {
    const currentDate = new Date();
    await this.authCodeRepo
      .createQueryBuilder('auth_code')
      .delete()
      .where('expireOn <= :currentDate', { currentDate })
      .execute();
  }
}
