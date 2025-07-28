import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'; 
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '../domain/entities/user.entity';
import { config } from 'shared/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async validateGithubKey(githubKey: string): Promise<boolean> {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${githubKey}` },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async validateGithubUsername(githubKey: string, username: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: { Authorization: `token ${githubKey}` },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async register(username: string, email: string, password: string, githubKey: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const isValidKey = await this.validateGithubKey(githubKey);
    if (!isValidKey) {
      throw new UnauthorizedException('Invalid GitHub key');
    }
    const isValidUsername = await this.validateGithubUsername(githubKey, username);
    if (!isValidUsername) {
      throw new UnauthorizedException('Username does not exist on GitHub');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(username, email, hashedPassword, githubKey);
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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.secret) as any;
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found');
      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      return { accessToken, refreshToken: newRefreshToken, user };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { sub: user.username, email: user.email },
      config.jwt.secret,
      { expiresIn: '15m' },
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { sub: user.username, email: user.email },
      config.jwt.secret,
      { expiresIn: '1d' },
    );
  }
}