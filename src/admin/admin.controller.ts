import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AddMembers, AuthUser, CreateForms, RoleData, checkAdmin } from 'src/utils/types';
import { CreateOrgDto } from 'src/auth/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.deco';

//@UseGuards(AuthGuard())
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
  async addMembers(@Body() addMembersData:AddMembers): Promise<object>{
    return await this.adminService.addMembers(addMembersData)
  }


  @Post('/getrequests')
  async getRequests(@Body() checkAdminData:checkAdmin): Promise<object>{
    return await this.adminService.showPendingrequests(checkAdminData);
  }  

  @Post('/uploadform')
  async uploadForm(@Body() createFormsData:CreateForms): Promise<object>{
    return await this.adminService.createForms(createFormsData)
  }

  @Post('/getforms')
  async getForms(@Body() emailData:checkAdmin): Promise<object>{//@User() user:AuthUser
    return await this.adminService.showForms(emailData)
  }

  @Get('/createform')
  async createForm(@Param() checkAdminData:checkAdmin, @User() user:AuthUser): Promise<object>{
    return await this.adminService.checkAdmin(checkAdminData,user)
  }




}