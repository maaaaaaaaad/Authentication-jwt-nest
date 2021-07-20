import { Injectable } from '@nestjs/common';
import { User, UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    inputPassword: string,
  ): Promise<Omit<User, 'password'>> {
    //
    const user = await this.usersService.findOne(username);

    if (user && user.password === inputPassword) {
      const { password, ...result } = user;
      console.log(password);

      return result;
    }

    return null;
  }
}
