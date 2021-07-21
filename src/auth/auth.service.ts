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
