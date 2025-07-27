import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'; 
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async register(username: string, email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(username, email, hashedPassword);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  async refresh(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { sub: user.username, email: user.email },
      { expiresIn: '15m' },
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { sub: user.username, email: user.email },
      { expiresIn: '1d' },
    );
  }
}