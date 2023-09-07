import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import e from 'express';
import { PrismaService } from 'src/prisma.service';
import { UserData, UserDataUpdate } from 'src/utils/types';
import { compare, hash } from 'bcrypt'
import { User } from '@prisma/client';
import { UpdatePasswordDto } from './user.dto';


@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getUser(email: string): Promise<User> {


        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }




    //use this to let user edit info in profile. handle password change in another method. UI should not allow user to change password in profile
    async updateUser(userData: UserDataUpdate): Promise<object> {

        const result = await this.prisma.user.update({
            where: {
                email: userData.email
            },
            data: userData
        });

        return result;
    }

    //change password second method-working. use this to let user change password in profile. 
    //change email here to id??
    async updateUserPassword(userData: UpdatePasswordDto, email: string) {

        const user = await this.prisma.user.findFirst({
            where: {
                email: email
            },
        });
        const checkPassword = await compare(
            userData.oldPassword,
            user.password,
        );

        if (!checkPassword) {
            throw new HttpException('Password Incorrect', HttpStatus.UNAUTHORIZED)
        }
        const newPasswordHash = await hash(userData.password, 12);
        await this.prisma.user.update({
            where: {
                email: email
            },
            data: { password: newPasswordHash }
        });

        return {
            message: 'Password Updated',
        };
    }


    async deleteUser(email: string): Promise<object> {
        const result = await this.prisma.user.delete({
            where: {
                email: email
            }
        });

        return result;
    }




    async getAllUsers(): Promise<object[]> {
        const users = await this.prisma.user.findMany({
            include: {
                role: true
            }
        });

        console.log(users[0].role.name);

        return users;
    }





}


