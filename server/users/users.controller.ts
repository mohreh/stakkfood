import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'server/common/interceptors/serialize.interceptor';

declare global {
  namespace Express {
    interface User {
      id?: string | undefined;
    }
  }
}

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
