import { Injectable } from '@nestjs/common';
import { User } from './user.type';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'Dong',
      password: 'first',
    },
    {
      userId: 2,
      username: 'Woong',
      password: 'second',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
