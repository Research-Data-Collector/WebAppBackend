import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserData } from 'src/utils/types';
import { UpdatePasswordDto } from './user.dto';


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

  @Post('/updatePW/:email') //user can change his name,organization and email
  //should implement the email varification method for change password
  async updateUserPassword(@Param('email') email:string,
    @Body() userData: UpdatePasswordDto) {
    return await this.usersService.updateUserPassword(userData,email);
  }
//(@Param('email') email:string)
  @Post('/delete')
  async deleteUser(@Body() email: string): Promise<object> {
    return await this.usersService.deleteUser(email);
  }
  // @Post('/updatePassword/:id')
  // async updatePassword(@Param('userId', ParseIntPipe) userId: number,
  // @Body() changePasswordDto: UpdatePasswordDto): Promise<{message:string}> {
  //   await this.usersService.updatePassword(userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
  //   return{message:'Password updated successfully'}
  // }
}
