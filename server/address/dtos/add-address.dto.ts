import { OmitType } from '@nestjs/mapped-types';
import { Address } from '../entities/address.entity';

export class AddAddressDto extends OmitType(Address, [
  'setId',
  'createdAt',
  'updatedAt',
]) {}
