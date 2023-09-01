import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrganizationData, RoleData } from 'src/utils/types';

@Injectable()
export class AdminService {

    constructor(private prisma: PrismaService) {}


    async createOrganization(organizationData:OrganizationData): Promise<object> {
        const result = await this.prisma.organization.create({
            data: organizationData
        });

        return result;
    }

    async createRole(roleData:RoleData): Promise<object> {
        const result = await this.prisma.role.create({
            data: roleData
        });


        return result;
    }

    
}
