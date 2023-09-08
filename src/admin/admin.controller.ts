import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleData } from 'src/utils/types';
import { CreateOrgDto } from 'src/auth/dto/register.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Post('/create/organization')
  async organization(@Body() organizationData: CreateOrgDto): Promise<object> {
    return await this.adminService.organization(organizationData);
  }

  // @Post('/create/role')
  // async createRole(@Body() roleData: RoleData): Promise<object> {
  //   return await this.adminService.createRole(roleData);
  // }

  //changed the role in to enum
}
