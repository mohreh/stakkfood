import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { User } from '../users/entities/user.entity';
import { AddressService } from './address.service';
import { AddAddressDto } from './dtos/add-address.dto';
import { Address } from './entities/address.entity';

describe('AddressService', () => {
  const randomString = (length = 7) =>
    Math.random().toString(16).slice(2, length);

  let service: AddressService;
  const mockAddressRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockOption = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Address),
          useValue: mockAddressRepo,
        },
        {
          provide: CONFIG_OPTIONS,
          useValue: mockOption,
        },
        AddressService,
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return address', async () => {
      mockAddressRepo.findOne.mockResolvedValue({});

      expect(await service.findById(randomString())).toEqual({});
      expect(mockAddressRepo.findOne).toHaveBeenCalledWith(
        expect.any(String) /* : id */,
        {
          relations: expect.arrayContaining(['user']),
        },
      );
    });

    it('should fail on exception', async () => {
      mockAddressRepo.findOne.mockRejectedValueOnce(new Error('Unknown Error'));

      try {
        await service.findById(randomString());
      } catch (err: any) {
        expect(err.message).toEqual('Unknown Error');
      }
    });
  });

  describe('createAddress', () => {
    mockAddressRepo.create.mockImplementation((data: AddAddressDto) =>
      Promise.resolve({
        id: randomString(),
        ...data,
        user: {
          ...data.user,
          name: randomString(),
        },
      }),
    );
    mockAddressRepo.save.mockImplementation((address: Address) =>
      Promise.resolve(address),
    );

    it('should create and save address', async () => {
      const res = await service.createAddress({
        latitude: 40,
        longitude: 40,
        user: {
          id: randomString(),
        } as User,
        description: 'description',
      });

      expect(res).toEqual({
        id: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        description: expect.any(String),
        user: expect.any(Object),
      });
      expect(mockAddressRepo.save).toHaveBeenCalledTimes(1);
      expect(mockAddressRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should fail on exception', async () => {
      mockAddressRepo.save.mockRejectedValueOnce(new Error('Unknown Error'));

      expect(service.createAddress).rejects.toThrow(
        InternalServerErrorException,
      );
      try {
        await service.createAddress({} as AddAddressDto);
      } catch (err: any) {
        expect(err.message).toBe('Unknown Error');
      }
    });
  });

  describe('updateAddress', () => {
    const id = randomString();

    it('should call addressRepo.save function on update', async () => {
      mockAddressRepo.save.mockResolvedValueOnce({});
      await service.updateAddress(id, { longitude: 30 });

      expect(mockAddressRepo.save).toHaveBeenCalledWith({
        id,
        longitude: expect.any(Number),
      });
    });

    it('should fail on exception', async () => {
      mockAddressRepo.save.mockRejectedValueOnce(new Error('Unknown Error'));

      expect(service.updateAddress).rejects.toThrow(
        InternalServerErrorException,
      );
      try {
        await service.updateAddress(id, {});
      } catch (err: any) {
        expect(err.message).toBe('Unknown Error');
      }
    });
  });

  describe('deleteAddress', () => {
    const id = randomString();

    it('should delete address by call addressRepo.delete', async () => {
      await service.deleteAddress(id);
      expect(mockAddressRepo.delete).toHaveBeenCalledWith(id);
    });

    it('should fail on exception', async () => {
      mockAddressRepo.delete.mockRejectedValueOnce(new Error('Unknown Error'));

      expect(service.deleteAddress).rejects.toThrow(
        InternalServerErrorException,
      );
      try {
        await service.deleteAddress(id);
      } catch (err: any) {
        expect(err.message).toBe('Unknown Error');
      }
    });
  });
});
