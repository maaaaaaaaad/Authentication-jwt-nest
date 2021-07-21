# Authentication by Nest.js with JWT

1. Local strategy

```javascript
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

```

2. Jwt startegy

```javascript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/user.type';
import { jwtConstants } from './constants';
import { Payload } from './interface/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload<Omit<User, 'password'>>) {
    return { username: payload.username, userId: payload.sub };
  }
}
```

3. Interface

- User

```javascript
export type User = {
  userId: number,
  username: string,
  password: string,
};
```

- Payload

```javascript
export interface Payload<T> {
  username: T;
  sub: T;
}
```

4. Auth service

```javascript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    inputPassword: string,
  ): Promise<Omit<User, 'password'>> {
    //
    const user = await this.usersService.findOne(username);

    if (user && user.password === inputPassword) {
      const { password, ...result } = user;
      console.log(`Password: ${password}`);

      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

5. Controller

```javascript
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  //
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
```
