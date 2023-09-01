import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserData } from 'src/utils/types';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}


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
}
