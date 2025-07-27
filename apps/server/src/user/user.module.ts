import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { AuthService } from './application/auth.service';
import { UserRepositoryMongo } from './infrastructure/repos/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './domain/entities/user.entity';
import { UserSchema } from './infrastructure/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, AuthService, UserRepositoryMongo]
})
export class UserModule {}
