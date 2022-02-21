import { PickType } from '@nestjs/mapped-types';
import { User } from 'server/users/entities/user.entity';

export class RegisterActionDto extends PickType(User, ['phoneNumber']) {}
