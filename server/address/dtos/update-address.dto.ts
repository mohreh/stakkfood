import { PartialType, PickType } from '@nestjs/mapped-types';
import { Address } from '../entities/address.entity';

export class UpdateAddressDto extends PartialType(
  PickType(Address, ['description', 'latitude', 'longitude']),
) {}
