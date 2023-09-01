import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserData } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createUser(@Body() userData: UserData): Promise<object> {
    return await this.usersService.createUser(userData);
  }

  @Post('/update')
  async updateUser(@Body() userData: UserData): Promise<object> {
    return await this.usersService.updateUser(userData);
  }
}
