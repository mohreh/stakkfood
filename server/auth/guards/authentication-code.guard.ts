import { AuthGuard } from '@nestjs/passport';

export class AuthCodeGuard extends AuthGuard('auth_code') {}
