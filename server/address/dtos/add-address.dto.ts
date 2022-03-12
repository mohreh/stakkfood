import { OmitType } from '@nestjs/mapped-types';
import { Address } from '../entities/address.entity';

export class AddAddressDto extends OmitType(Address, [
  'id',
  'setId',
  'createdAt',
  'updatedAt',
]) {}
