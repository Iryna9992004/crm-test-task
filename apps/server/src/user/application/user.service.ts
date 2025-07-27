import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import { UserRepositoryMongo } from '../infrastructure/repos/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepositoryMongo) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }
    return new User(username, email, password);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
