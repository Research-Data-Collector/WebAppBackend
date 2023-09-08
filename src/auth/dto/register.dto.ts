import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  
  export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    fname: string;

    @IsNotEmpty()
    @IsString()
    lname: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string; 

    roleId: number;
  }
//   roleId    Int
//   orgname   String? @unique 
//   fname     String
//   lname     String
//   email     String   @unique
//   password  String

export class ValidationDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}

export class CreateOrgDto {
  @IsNotEmpty()
  @IsString()
  orgname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

}