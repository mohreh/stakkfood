import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDev } from '../common/common.constants';
import { authenticationCodeGenerator } from '../common/nanoid';
import { SmsService } from '../sms/sms.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { AuthCode } from './entities/auth-code.entity';
import { JwtPayload, JwtToken } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthCode)
    private readonly authCodeRepo: Repository<AuthCode>,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async sendAuthenticationCode(phoneNumber: string): Promise<string> {
    const pin = authenticationCodeGenerator();

    try {
      let authCode = (await this.authCodeRepo.find({ phoneNumber }))[0];
      let reqId: string;

      if (!authCode) {
        authCode = this.authCodeRepo.create({
          pin,
          phoneNumber,
        });

        reqId = (await this.authCodeRepo.save(authCode)).id;
      } else {
        reqId = authCode.id;
        authCode = await this.authCodeRepo.save({
          id: reqId,
          pin,
          expireOn: new Date(Date.now() + 30 * 1000),
        });
      }

      await this.smsService.sendAuthenticationCode({
        text: `your authentication code: ${pin}`,
        to: phoneNumber,
      });

      return reqId; // registration request id
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyAuthenticationCode(reqId: string, pin: string): Promise<string> {
    const authCode = await this.authCodeRepo.findOne(reqId);

    if (!authCode) {
      throw new BadRequestException(
        'pin you entered does not exist on database or expired',
      );
    }

    if (pin === authCode.pin) {
      return authCode.phoneNumber;
    }

    throw new BadRequestException('pin you entered is wrong');
  }

  async registerUser(phoneNumber: string): Promise<User> {
    let user: User;
    user = await this.usersService.findByPhoneNumber(phoneNumber);

    if (!user) {
      user = await this.usersService.create({ phoneNumber });
    }

    return user;
  }

  login({ id }: LoginDto): JwtToken {
    const payload: JwtPayload = { sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findById(id: string): Promise<User> {
    return await this.usersService.findById(id);
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
