import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { AuthService } from './application/auth.service';
import { UserRepositoryMongo } from './infrastructure/repos/user.repository';
import { RepoRepositoryMongo } from './infrastructure/repos/repo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './domain/entities/user.entity';
import { RepoSchema, UserSchemaModel, RepoSchemaClass } from './infrastructure/schemas/user.schema';
import { AuthController } from './interface/auth.controller';
import { RepoController } from './interface/repo.controller';
import { RepoService } from './application/repo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchemaModel },
      { name: RepoSchemaClass.name, schema: RepoSchema }
    ]),
  ],
  providers: [UserService, AuthService, UserRepositoryMongo, RepoRepositoryMongo, RepoService],
  controllers: [AuthController, RepoController]
})
export class UserModule {}
