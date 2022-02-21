import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dtos/login.dto';
import { VerifyPinDto } from '../dtos/verify-pin.dto';

@Injectable()
export class AuthCodeStrategy extends PassportStrategy(Strategy, 'auth_code') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<LoginDto> {
    const { reqId, pin } = req.body as VerifyPinDto;
    const phoneNumber = await this.authService.verifyAuthenticationCode(
      reqId,
      pin,
    );

    const { id } = await this.authService.registerUser(phoneNumber);

    return { id };
  }
}
