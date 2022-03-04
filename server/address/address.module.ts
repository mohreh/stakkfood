import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { Address } from './entities/address.entity';
import { AddressService } from './address.service';
import { AddressModuleOptions } from './address.interfaces';

@Module({})
@Global()
export class AddressModule {
  static register(options: AddressModuleOptions): DynamicModule {
    return {
      imports: [TypeOrmModule.forFeature([Address])],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        AddressService,
      ],
      exports: [AddressService],
      module: AddressModule,
    };
  }
}
