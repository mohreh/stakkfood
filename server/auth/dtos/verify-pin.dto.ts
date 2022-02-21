import { IsString } from 'class-validator';

export class VerifyPinDto {
  @IsString()
  reqId: string;

  @IsString()
  pin: string;
}
