import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddMembers, CreateForms, RoleData } from 'src/utils/types';
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


  @Post('/addmember')
  async addMembers(@Body() addMembersData:AddMembers): Promise<object>{
    return await this.adminService.addMembers(addMembersData)
  }


  @Get('/getrequests')
  async getRequests(@Param('email')  email:string): Promise<object>{
    return await this.adminService.showPendingrequests(email)
  }  

  @Post('/uploadform')
  async uploadForm(@Body() createFormsData:CreateForms): Promise<object>{
    return await this.adminService.createForms(createFormsData)
  }

  @Get('/getforms')
  async getForms(@Param('email')  email:string): Promise<object>{
    return await this.adminService.showForms(email)
  }




}

