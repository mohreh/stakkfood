import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepo.find();
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create(createUserDto);

    try {
      return await this.usersRepo.save(user);
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
