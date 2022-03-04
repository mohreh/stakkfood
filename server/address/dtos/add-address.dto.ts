import { PickType } from '@nestjs/mapped-types';
import { Address } from '../entities/address.entity';

export class AddAddressDto extends PickType(Address, [
  'description',
  'latitude',
  'longitude',
  'user',
]) {}
