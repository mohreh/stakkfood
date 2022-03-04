import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AddAddressDto } from '../address/dtos/add-address.dto';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Serialize } from 'server/common/interceptors/serialize.interceptor';

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

  @Post('address')
  addAddress(@Req() req: Request, @Body() data: AddAddressDto) {
    data.user = req.user as User;
    return this.usersService.addAddress(req.user.id, data);
  }
}
