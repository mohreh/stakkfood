import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterActionDto } from './dtos/register-action.dto';
import { VerifyPinDto } from './dtos/verify-pin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async sendAuthenticationCode(@Body() { phoneNumber }: RegisterActionDto) {
    const reqId = await this.authService.sendAuthenticationCode(phoneNumber);
    return { reqId };
  }

  @Post('verify')
  async verifyAuthenticationCode(@Body() verifyPinDto: VerifyPinDto) {
    return await this.authService.verifyAuthenticationCode(verifyPinDto);
  }
}
