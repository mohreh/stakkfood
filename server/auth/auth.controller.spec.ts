import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from './enum/role.enum';

const id = 'randomId';
const token = 'token';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockAuthService = {
      sendAuthenticationCode: jest.fn((_phoneNumber) => id),
      login: jest.fn((_id) => ({
        access_token: token,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a request id', async () => {
    expect(
      await controller.sendAuthenticationCode({ phoneNumber: '+9812345' }),
    ).toEqual({ reqId: id });
  });

  it('should return an access_token', () => {
    expect(
      controller.verifyUser({
        user: { id, role: Role.Client },
      } as Request),
    ).toEqual({
      access_token: token,
    });
  });
});
