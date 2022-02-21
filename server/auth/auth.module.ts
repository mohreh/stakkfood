import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsModule } from '../sms/sms.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCode } from './entities/auth-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthCode]), SmsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// Authentication method is someting like that
// 1 - User with his phone number ----> client ---- POST { phoneNumber } ----> server
// ........................................................................... server: create pin and store hashed pin
// ...........................................................................         (we can store it in cashe or database)
// ........................................................................... server: send created pin as sms/email to user's phone number
// ........................................................................... server: send stored pinId as reqId to client
// 2 - User with sended pin ----------> client ---- POST { pin, reqId } -----> server: find pin with reqId from database
// ........................................................................... server: compare hashedPin and posted pin
// ........................................................................... server: register user with jwt token
