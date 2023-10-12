import { Injectable } from '@nestjs/common';
import { CreateOrgDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import { AddMembers, CreateForms, RoleData } from 'src/utils/types';
import { User } from '@prisma/client';
import { title } from 'process';
@Injectable()
export class AdminService {

    constructor(private prisma: PrismaService) {}

    async organization(organizationData: CreateOrgDto): Promise<object> {
        
        const checkUserExists = await this.prisma.user.findFirst({
            where: {
              email: organizationData.email,
            },
          });

         if(checkUserExists.roleId == 1){ //let admins create the organization
            //only admins can create the organization. UI only 4 admins
            //console.log(checkUserExists.roleId);
            const org = await this.prisma.organization.create({
              data:{
                orgname: organizationData.orgname, 
                adminId: checkUserExists.id
              }
            });

            //update the orgId in user table
            const createdOrg= await this.prisma.organization.findFirst({
                where:{
                    adminId: checkUserExists.id,
                },
            });

            await this.prisma.user.update({
                where: {
                    id: checkUserExists.id,
                },
                data: { orgId: createdOrg.id }
            })
            
            
            
        
        
        return {
            message: 'Succefully created organization',
            //checkUserExists
          }; 
        }
    }
 
    
    async createRole(roleData:RoleData): Promise<object> {
        const result = await this.prisma.role.create({
            data: roleData
        });


        return result;
    }

    //admin add teammembers to the organization
    async addMembers(addMembersData: AddMembers): Promise<object> {

        //find the team member id in table
        const memeber=await this.prisma.teamMembers.findFirst({
            where:{
                userId:addMembersData.userId,
                orgId:addMembersData.orgId
            }
        })
        
        //should update the teammembers table
       const addMembers=await this.prisma.teamMembers.update({
            where:{
                id:memeber.id
            },
            data:addMembersData
              
         });

         //update the orgId in user table
         if(addMembersData.status){ //if status is 1 update the user table
            await this.prisma.user.update({
                where: {
                    id: addMembersData.userId,
                },
                data: { orgId: addMembersData.orgId }
            });

            return {
                message: 'Succefully added members',
            }
        }
    //remove request from the admin dashboard
    //notify the user accepted or not

    }


        //show pending join requests where status=0 in teamMember table
        //should show the user name with picture. pic part to be implemented later
    async showPendingrequests(email:string): Promise<object[]> {
    //find the organization id of the admin
    //find the team members with status=0 and orgId=admin orgId
    //get team member userid
    //display the user name and picture

    const admin=await this.prisma.user.findFirst({
        where:{
            email:email
        }
    });

    const orgId=admin.orgId;
    const pendingRequests=await this.prisma.teamMembers.findMany({
        where:{
            orgId:orgId,
            status:false
        },
        // include:{
        //     user:true
        // }
    });

    const ids=pendingRequests.map((item)=>{
        return item.userId;
    });

    const users= await this.prisma.user.findMany({
        where:{
            id:{
                in:ids
            }
        }
    });

    return users;


    
    }


    //user create forms
    //upload forms to database
    async createForms(creatFormsData:CreateForms): Promise<object> {
        //find the admin id and his organization id using email
        //upload the form to the database with data, title, adminID

        const admin=await this.prisma.user.findFirst({
            where:{
                email:creatFormsData.email
            }
        });
        const orgId=admin.orgId;
        const title=creatFormsData.title;
        const adminId=admin.id;
        const data=JSON.stringify(creatFormsData.data);

        //upload the form

        await this.prisma.forms.create({
            data:{
                title:title,
                data:data,
                orgId:orgId
            }
        });

        return {
            message: 'Succefully created form',
        }


    }
    //show created forms

    
}

