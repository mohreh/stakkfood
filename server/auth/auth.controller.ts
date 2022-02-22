import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RegisterActionDto } from './dtos/register-action.dto';
import { AuthCodeGuard } from './guards/authentication-code.guard';
import { JwtToken } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async sendAuthenticationCode(@Body() { phoneNumber }: RegisterActionDto) {
    const reqId = await this.authService.sendAuthenticationCode(phoneNumber);
    return { reqId };
  }

  @Public()
  @Post('verify')
  @UseGuards(AuthCodeGuard)
  verifyUser(@Req() req: Request): JwtToken {
    return this.authService.login({ id: req.user.id });
  }
}
