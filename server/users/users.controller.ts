import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'server/common/interceptors/serialize.interceptor';

declare global {
  namespace Express {
    interface User {
      id: string | undefined;
      role: Role;
    }
  }
}

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
