import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterActionDto } from '../auth/dtos/register-action.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepo.find();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return (await this.usersRepo.find({ phoneNumber }))[0];
  }

  findById(id: string): Promise<User> {
    return this.usersRepo.findOne(id);
  }

  async create({ phoneNumber }: RegisterActionDto): Promise<User> {
    const user = this.usersRepo.create({ phoneNumber });

    try {
      return await this.usersRepo.save(user);
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
