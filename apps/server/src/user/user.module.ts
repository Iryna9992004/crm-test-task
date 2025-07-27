import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { AuthService } from './application/auth.service';

@Module({
  providers: [UserService, AuthService]
})
export class UserModule {}
