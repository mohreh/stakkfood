import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterActionDto } from './dtos/register-action.dto';
import { AuthCodeGuard } from './guards/authentication-code.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtToken } from './interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface User {
      id?: string | undefined;
    }
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async sendAuthenticationCode(@Body() { phoneNumber }: RegisterActionDto) {
    const reqId = await this.authService.sendAuthenticationCode(phoneNumber);
    return { reqId };
  }

  @Post('verify')
  @UseGuards(AuthCodeGuard)
  verifyUser(@Req() req: Request): JwtToken {
    return this.authService.login({ id: req.user.id });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request, @Session() session) {
    console.log(session);
    return req.user;
  }
}
