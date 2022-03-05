import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import axios, { Method } from 'axios';
import { Repository } from 'typeorm';
import { CONFIG_OPTIONS } from '../common/common.constants';
// import { ADDRESS_BASE_URL } from './address.constants';
import { AddressModuleOptions } from './address.interfaces';
import { AddAddressDto } from './dtos/add-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @Inject(CONFIG_OPTIONS) private readonly options: AddressModuleOptions,
  ) {}

  async findById(id: string): Promise<Address> {
    return await this.addressRepo.findOne(id, {
      relations: ['user'],
    });
  }

  async createAddress(data: AddAddressDto) {
    try {
      const address = this.addressRepo.create(data);
      return await this.addressRepo.save(address);
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateAddress(addressId: string, data: UpdateAddressDto) {
    try {
      return await this.addressRepo.save({
        id: addressId,
        ...data,
      });
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  // async request(reqUrl: string, method: Method = 'GET') {
  //   return await axios.request({
  //     method,
  //     url: ADDRESS_BASE_URL + reqUrl,
  //   });
  // }
}
