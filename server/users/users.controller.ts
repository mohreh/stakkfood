import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AddAddressDto } from '../address/dtos/add-address.dto';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateAddressDto } from '../address/dtos/update-address.dto';
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
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@Req() req: Request): Promise<User> {
    return this.usersService.findById(req.user.id);
    // return req.user;
  }

  @Post('address')
  addAddress(@Req() req: Request, @Body() data: AddAddressDto): Promise<User> {
    data.user = req.user as User;
    return this.usersService.addAddress(req.user.id, data);
  }

  // deleteAddress() {}

  @Post('address/:addressId')
  updateAddress(
    @Req() req: Request,
    @Body() body: UpdateAddressDto,
    @Param('addressId') addressId: string,
  ): Promise<User> {
    return this.usersService.updateAddress(addressId, req.user.id, body);
  }

  // changeDefaultAddress() {}
}
