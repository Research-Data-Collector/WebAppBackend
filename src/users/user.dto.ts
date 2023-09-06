import {IsNotEmpty,IsEmail, IsString, MinLength, MaxLength} from 'class-validator';

import {ApiProperty} from "@nestjs/swagger";
export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty() readonly login: string;

    @ApiProperty()
    @IsNotEmpty() readonly password: string;
}export class CreateUserDto {  
    roleId: number;
    @IsNotEmpty()
    @ApiProperty() fname: string;    @IsNotEmpty()
    @ApiProperty() lname: string;    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty() password: string;

    

    orgId: number;
    

//     id        Int      @id @default(autoincrement())
//   roleId    Int
//   orgId     Int
//   fname     String
//   lname     String
//   email     String   @unique
//   password  String

}export class UpdatePasswordDto {

   
    //email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;


    @IsNotEmpty()
    @IsString()
    oldPassword: string;

}