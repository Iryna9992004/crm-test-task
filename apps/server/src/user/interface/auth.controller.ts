import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: any, @Res() res: Response) {
    const { username, email, password } = body;
    const { accessToken, refreshToken, user } = await this.authService.register(username, email, password);
    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ user });
  }

  @Post('/login')
  async login(@Body() body: any, @Res() res: Response) {
    const { email, password } = body;
    const { accessToken, refreshToken, user } = await this.authService.login(email, password);
    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ user });
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.status(501).json({ message: 'Not implemented' });
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out' });
  }
}
