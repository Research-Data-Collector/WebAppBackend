import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
  @UsePipes(new ValidationPipe())
  createUser(@Body() userData: UserData){
    console.log(userData)
    return this.usersService.createUser(userData);
  }

  @Post('/update') //user can change his name,organization and email
  //should implement the email varification method for change password
  async updateUser(@Body() userData: UserData): Promise<object> {
    return await this.usersService.updateUser(userData);
  }

  @Post('/delete')
  async deleteUser(@Body() email: string): Promise<object> {
    return await this.usersService.deleteUser(email);
  }
  
}
