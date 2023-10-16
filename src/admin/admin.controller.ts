import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddMembers, AuthUser, CreateForms, RoleData, checkAdmin } from 'src/utils/types';
import { CreateOrgDto } from 'src/auth/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.deco';

@UseGuards(AuthGuard())
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Post('/create/organization')
  async organization(@Body() organizationData: CreateOrgDto, @User() user:AuthUser): Promise<object> {
    return await this.adminService.organization(organizationData);
  }

  // @Post('/create/role')
  // async createRole(@Body() roleData: RoleData): Promise<object> {
  //   return await this.adminService.createRole(roleData);
  // }

  //changed the role in to enum


  @Post('/addmember')
  async addMembers(@Body() addMembersData:AddMembers, @User() user:AuthUser): Promise<object>{
    return await this.adminService.addMembers(addMembersData)
  }


  @Get('/getrequests')
  async getRequests(@User() user:AuthUser): Promise<object>{
    return await this.adminService.showPendingrequests(user.email);
  }  

  @Post('/uploadform')
  async uploadForm(@Body() createFormsData:CreateForms, @User() user:AuthUser): Promise<object>{
    return await this.adminService.createForms(createFormsData)
  }

  @Post('/getforms')
  async getForms(@User() user:AuthUser): Promise<object>{
    return await this.adminService.showForms(user.email)
  }

  @Get('/createform')
  async createForm(@Param() checkAdminData:checkAdmin, @User() user:AuthUser): Promise<object>{
    return await this.adminService.checkAdmin(checkAdminData,user)
  }




}