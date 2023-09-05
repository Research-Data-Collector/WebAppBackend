import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import e from 'express';
import { PrismaService } from 'src/prisma.service';
import {  UserData } from 'src/utils/types';
import {compare, hash} from 'bcrypt'
import { User } from '@prisma/client';


@Injectable()
export class UsersService {
    constructor(private readonly prisma:PrismaService) {}

    async getUser(email:string): Promise<User> {


        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            throw new HttpException('User not found',HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    // async createUser(userDto:CreateUserDto): Promise<any> {
    //     // Implement Password Hashing.
        

    //     return await this.prisma.user.create(...userDto);
         

    // }






    async createUser(userData:UserData): Promise<object> {
        // Implement Password Hashing.

        const result = await this.prisma.user.create({
            data: userData
        });

        return result;
    }

    async updateUser(userData:UserData): Promise<object> {
        const result = await this.prisma.user.update({
            where: {
                email: userData.email
            },
            data: userData
        });

        return result;
    }

    async deleteUser(email:string): Promise<object> {
        const result = await this.prisma.user.delete({
            where: {
                email: email
            }
        });

        return result;
    }


    

    async getAllUsers(): Promise<object[]>  {
        const users = await this.prisma.user.findMany({
            include:{
                role: true 
            }
        });

        console.log(users[0].role.name);

        return users;
    }

   
    


}


