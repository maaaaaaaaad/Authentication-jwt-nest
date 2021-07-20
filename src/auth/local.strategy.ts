import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    //
    const userOne = await this.authService.validateUser(username, password);

    if (!userOne) {
      throw new UnauthorizedException();
    }
    return userOne;
  }
}
