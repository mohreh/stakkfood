import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserDto extends OmitType(User, ['id', 'createdAt', 'updatedAt']) {}
