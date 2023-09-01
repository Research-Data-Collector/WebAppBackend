import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserData } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  async getAllUsers(): Promise<object[]> {
    return await this.usersService.getAllUsers();
  }

  @Post('/create')
  async createUser(@Body() userData: UserData): Promise<object> {
    return await this.usersService.createUser(userData);
  }

  @Post('/update')
  async updateUser(@Body() userData: UserData): Promise<object> {
    return await this.usersService.updateUser(userData);
  }

  @Post('/delete')
  async deleteUser(@Body() email: string): Promise<object> {
    return await this.usersService.deleteUser(email);
  }
  
}
