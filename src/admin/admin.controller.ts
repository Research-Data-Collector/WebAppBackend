import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { OrganizationData, RoleData } from 'src/utils/types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Post('/create/organization')
  async createOrganization(@Body() organizationData: OrganizationData): Promise<object> {
    return await this.adminService.createOrganization(organizationData);
  }

  @Post('/create/role')
  async createRole(@Body() roleData: RoleData): Promise<object> {
    return await this.adminService.createRole(roleData);
  }
}
