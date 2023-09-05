import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoleData } from 'src/utils/types';

@Injectable()
export class AdminService {

    constructor(private prisma: PrismaService) {}


    
    async createRole(roleData:RoleData): Promise<object> {
        const result = await this.prisma.role.create({
            data: roleData
        });


        return result;
    }

    
}
