import { IsString } from 'class-validator';

export class VerifyAuthCodeDto {
  @IsString()
  reqId: string;

  @IsString()
  pin: string;
}
