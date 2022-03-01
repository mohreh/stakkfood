import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { idGenerator } from '../common/nanoid';
import { SmsService } from '../sms/sms.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthCode } from './entities/auth-code.entity';

describe('AuthService', () => {
  let service: AuthService;

  const id = idGenerator();
  const phoneNumber = idGenerator(10);
  const pin = idGenerator(5);

  const mockAuthCodeRepo = {
    create: jest.fn((data) => data),
    save: jest.fn((user) => Promise.resolve({ id, ...user })),
    find: jest.fn((data?: Record<string, unknown>) => [
      {
        ...plainToClass(AuthCode, data),
        id,
      },
    ]),
    findOne: jest.fn((_id: string) => ({
      pin,
      phoneNumber,
    })),
  };
  const mockJwtService = {
    sign: jest.fn(() => 'ey.test.token'),
  };
  const mockSmsService = {
    sendAuthenticationCode: jest.fn((): void => undefined),
  };
  const mockUsersSerivce = {
    create: jest.fn(),
    findByPhoneNumber: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthCode),
          useValue: mockAuthCodeRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersSerivce,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a reqId after send auth code', async () => {
    expect(await service.sendAuthenticationCode('+98123456')).toEqual(id);
  });

  it('should return a phoneNumber after verify authentication code', async () => {
    expect(await service.verifyAuthenticationCode(idGenerator(), pin)).toEqual(
      phoneNumber,
    );
  });

  it('should call methods on register', async () => {
    await service.registerUser(phoneNumber);
    expect(mockUsersSerivce.findByPhoneNumber).toHaveBeenCalled();
    expect(mockUsersSerivce.create).toHaveBeenCalled();
  });

  it('should return an access-token', () => {
    expect(service.login(id)).toEqual({
      access_token: 'ey.test.token',
    });
  });
});
