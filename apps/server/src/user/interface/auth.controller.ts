import { Controller, Get, Post, Req, Res, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/auth/register.dto';
import { LoginDto } from './dto/auth/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const { username, email, password } = body;
    const { accessToken, refreshToken, user } = await this.authService.register(username, email, password);
    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ user });
  }

  @Post('/login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;
    const { accessToken, refreshToken, user } = await this.authService.login(email, password);
    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ user });
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
      const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refreshToken(refreshToken);
      res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
      res.cookie('refresh_token', newRefreshToken, { httpOnly: true, sameSite: 'strict' });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out' });
  }
}
