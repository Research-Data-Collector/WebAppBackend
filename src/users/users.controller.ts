import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SendRequests, UserData } from 'src/utils/types';
import { UpdatePasswordDto } from 'src/users/user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  async getAllUsers(): Promise<object[]> {
    return await this.usersService.getAllUsers();
  }

  


  @Post('/update') //user can change his name,organization and email
  //should implement the email varification method for change password
  async updateUser(@Body() userData: UserData): Promise<object> {
    return await this.usersService.updateUser(userData);
  }

  @Post('/updatePW/:email') //user can change his password
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


  @Post('/sendrequest')
async sendRequest(@Body() sendRequestsData:SendRequests): Promise<object>{
  return await this.usersService.sendjoinRequests(sendRequestsData)
}

  @Get('/search/:alias/:table')
  async searchUser(@Param('alias')alias:string, @Param('table') table:string){
    const builder= await this.usersService.queryBuilder(alias,table);
    //console.log(table)
    return await builder;
  }
  @Post('/joinedforms')
  async joinedForms(@Body() emailData:SendRequests): Promise<object>{
    return await this.usersService.joinedResearches(emailData);
  }

}

