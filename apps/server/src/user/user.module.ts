import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { AuthService } from './application/auth.service';
import { UserRepositoryMongo } from './infrastructure/repos/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './domain/entities/user.entity';
import { UserSchemaModel } from './infrastructure/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchemaModel }]),
  ],
  providers: [UserService, AuthService, UserRepositoryMongo]
})
export class UserModule {}
