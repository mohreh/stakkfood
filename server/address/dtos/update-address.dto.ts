import { PickType } from '@nestjs/mapped-types';
import { Address } from '../entities/address.entity';

export class UpdateAddressDto extends PickType(Address, [
  'description',
  'latitude',
  'longitude',
]) {}
