import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from 'src/user/domain/repos/user.repository';
import { UserSchema } from '../schemas/user.schema';
import { User } from 'src/user/domain/entities/user.entity';
import { Repo } from 'src/user/domain/entities/repo.entity';

@Injectable()
export class UserRepositoryMongo implements IUserRepository {
  constructor(@InjectModel(UserSchema.name) private readonly model: Model<UserSchema>) {}

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email });
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async save(user: User): Promise<User> {
    const plain = {
      username: user.username,
      email: user.email,
      password: user.password,
    };

    const doc = await this.model.findOneAndUpdate(
      { email: user.email },
      plain,
      { new: true, upsert: true }
    );
    return this.toDomain(doc);
  }

  private toDomain(doc: any): User {
    return new User(doc.username, doc.email, doc.password);
  }
}
