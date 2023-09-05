import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  export class LoginDto {
    // @IsNotEmpty()
    // @IsString()
    // fname: string;

    // @IsNotEmpty()
    // @IsString()
    // lname: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    roleId: number;
  }
//   roleId    Int
//   orgname   String? @unique 
//   fname     String
//   lname     String
//   email     String   @unique
//   password  String