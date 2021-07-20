import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  //
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request) {
    return req.user;
  }
}
