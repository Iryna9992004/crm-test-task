import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post('/register')
  async register() {}

  @Post('/login')
  async login() {}

  @Get('/refresh')
  async refresh() {}

  @Get('/logout')
  async logout() {}
}
