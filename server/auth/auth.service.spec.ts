import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { SmsService } from '../sms/sms.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthCode } from './entities/auth-code.entity';

describe('AuthService', () => {
  let service: AuthService;

  const randomString = (length = 7) =>
    Math.random().toString(16).slice(2, length);

  const mockAuthCodeRepo = {
    create: jest.fn((data) => data),
    save: jest.fn((user) => Promise.resolve({ id: randomString(), ...user })),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => randomString()),
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

  describe('send authentication code', () => {
    mockAuthCodeRepo.find.mockImplementation((data?: Record<string, unknown>) =>
      Promise.resolve([
        {
          ...plainToClass(AuthCode, data),
          id: randomString(),
        },
      ]),
    );

    it('should return a reqId after send phone number', async () => {
      expect(await service.sendAuthenticationCode(randomString())).toEqual(
        expect.any(String),
      );
      expect(mockAuthCodeRepo.save).toHaveBeenCalledWith({
        id: expect.any(String),
        pin: expect.any(String),
        expireOn: expect.any(Date),
      });
    });

    it('should create a new auth code for phoneNumber if phoneNumber does not exist and return reqId', async () => {
      mockAuthCodeRepo.find.mockResolvedValue([]);

      const testPhoneNumber = randomString();

      expect(await service.sendAuthenticationCode(testPhoneNumber)).toEqual(
        expect.any(String),
      );
      expect(mockAuthCodeRepo.find).toHaveBeenCalled();
      expect(mockAuthCodeRepo.create).toHaveBeenCalledTimes(1);
      expect(mockAuthCodeRepo.save).toHaveBeenCalledWith({
        pin: expect.any(String),
        phoneNumber: testPhoneNumber,
      });
      expect(mockAuthCodeRepo.create).toHaveBeenCalledWith({
        pin: expect.any(String),
        phoneNumber: testPhoneNumber,
      });
    });

    it('should call sms.sendAuthenticationCode and save auth-code in database', () => {
      expect(mockSmsService.sendAuthenticationCode).toHaveBeenCalledTimes(2);
      expect(mockAuthCodeRepo.save).toHaveBeenCalledTimes(2);
    });

    it('should fail on excepton', async () => {
      mockAuthCodeRepo.save.mockRejectedValueOnce(new Error('Unknown Error'));

      expect(service.sendAuthenticationCode).rejects.toThrow(
        InternalServerErrorException,
      );

      try {
        await service.sendAuthenticationCode(
          randomString() /* : phoneNumber */,
        );
      } catch (err: any) {
        expect(err.message).toBe('Unknown Error');
      }
    });
  });

  describe('verify authentication code', () => {
    const phoneNumber = randomString();
    const pin = randomString(5);
    mockAuthCodeRepo.findOne.mockReturnValue({
      pin,
      phoneNumber,
    });

    it('should return a phoneNumber after verify authentication code', async () => {
      expect(
        await service.verifyAuthenticationCode(
          randomString() /* : reqId */,
          pin,
        ),
      ).toEqual(phoneNumber);
    });

    it('should return error if pin are not correct', async () => {
      try {
        await service.verifyAuthenticationCode(
          randomString() /* : reqId */,
          randomString() /* : pin */,
        );
      } catch (err) {
        expect(err).toEqual(
          new BadRequestException('pin you entered is wrong'),
        );
      }
    });

    it('sould return error if reqId have expired or not exist', async () => {
      mockAuthCodeRepo.findOne.mockResolvedValue(undefined);

      try {
        await service.verifyAuthenticationCode(
          randomString() /* : reqId */,
          pin,
        );
      } catch (err) {
        expect(err).toEqual(
          new BadRequestException(
            'pin you entered does not exist on database or expired',
          ),
        );
      }
    });
  });

  describe('register user', () => {
    const user = {
      phoneNumber: randomString(),
      id: randomString(),
    } as User;

    it('should return signed user', async () => {
      mockUsersSerivce.findByPhoneNumber.mockResolvedValue(user);

      const res = await service.registerUser(
        randomString() /* : phoneNumber */,
      );

      expect(res).toEqual(user);
      expect(mockUsersSerivce.findByPhoneNumber).toHaveBeenCalled();
      expect(mockUsersSerivce.create).toHaveBeenCalledTimes(0);
    });

    it('should create new user and return user', async () => {
      mockUsersSerivce.findByPhoneNumber.mockResolvedValue(undefined);
      mockUsersSerivce.create.mockResolvedValue(user);

      const testPhoneNumber = randomString();
      const res = await service.registerUser(testPhoneNumber);

      expect(res).toEqual(user);
      expect(mockUsersSerivce.create).toHaveBeenCalledWith({
        phoneNumber: testPhoneNumber,
      });
    });
  });

  describe('login', () => {
    it('should return an access-token', () => {
      expect(service.login(randomString() /* : user Id */)).toEqual({
        access_token: expect.any(String),
      });
    });
  });
});
