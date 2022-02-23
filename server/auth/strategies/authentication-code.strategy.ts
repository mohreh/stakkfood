import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { UserLogin } from '../interfaces/user-login.interface';
import { VerifyAuthCodeDto } from '../interfaces/verify-auth-code.interface';

@Injectable()
export class AuthCodeStrategy extends PassportStrategy(Strategy, 'auth_code') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<UserLogin> {
    const { reqId, pin } = req.body as VerifyAuthCodeDto;
    const phoneNumber = await this.authService.verifyAuthenticationCode(
      reqId,
      pin,
    );

    const { id, role } = await this.authService.registerUser(phoneNumber);

    return { id, role };
  }
}
