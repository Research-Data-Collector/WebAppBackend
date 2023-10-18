import { Injectable } from '@nestjs/common';
import { CreateOrgDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import { AddMembers, AuthUser, CreateForms, RoleData, checkAdmin } from 'src/utils/types';
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
        const memeber = await this.prisma.teamMembers.findFirst({
            where:{
                userId:addMembersData.userId,//else we can use email
                formId:addMembersData.formId
            }
        })
        
        //should update the teammembers table
    //    const addMembers=await this.prisma.teamMembers.update({
    //         where:{
    //             id:memeber.id
    //         },
    //         data:addMembersData
    //      });

         //update the orgId in user table
        //  if(addMembersData.status){ //if status is 1 update the user table
        //     await this.prisma.user.update({
        //         where: {
        //             id: addMembersData.userId,
        //         },
        //         data: { orgId: addMembersData.orgId }
        //     });

        //     return {
        //         message: 'Succefully added members',
        //     }
        // }


        //no need to update user table
        //only update the team members table- make status=1

        await this.prisma.teamMembers.update({
            where:{
                id:memeber.id
            },
            data:{
                status:addMembersData.status
            }
        });

        return {
            message: 'Succefully added members',
        }

    //remove request from the admin dashboard
    //notify the user accepted or not

    }


        //show pending join requests where status=0 in teamMember table
        //should show the user name with picture. pic part to be implemented later
    async showPendingrequests(checkAdminData:checkAdmin): Promise<object> {
    //find the organization id of the admin
    //find the team members with status=0 and orgId=admin orgId
    //get team member userid
    //display the user name and picture

    ;

    const admin=await this.prisma.user.findUnique({
        where:{
            email:checkAdminData.email
        }
    });
    //console.log(admin.email);

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

    const ids = pendingRequests.map((item) => {
        return item.userId;
    });

    const users = await this.prisma.user.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });

    const fnames = users.map((user) => user.fname);
    const lnames = users.map((user) => user.lname);
    const Ids = users.map((user) => user.id);

    return [fnames,lnames,Ids];


    
    }

    //only admins can create forms
    //if the email is admin email, he can create forms-return true
    //else return false
    //if true show the create form page----front end
    async checkAdmin(checkAdminData:checkAdmin, user:AuthUser): Promise<object[]> {
        //find the organization id of the admin
        //find the team members with status=0 and orgId=admin orgId
        //get team member userid
        //display the user name and picture
    
        const admin=await this.prisma.user.findFirst({
            where:{
                email: user.email
            }
        });
        return [admin];
    }
    // async checkAdmin(email:string): Promise<object[]> {
    //     const req=await this.prisma.user.findUnique({
    //         where:{
    //             email:email
    //         }
    //     });
    //     console.log(req.email);

    //     return [req];
    // }


    //user create forms
    //upload forms to database
    async createForms(creatFormsData:CreateForms): Promise<object> {
        //find the admin id and his organization id using email
        //upload the form to the database with data, title, adminID

        const admin = await this.prisma.user.findFirst({
            where:{
                email:creatFormsData.email
            }
        });
       // console.log(admin);
       //return [admin];
       
        const orgId=admin.orgId;
        const title=creatFormsData.title;
        //const adminId=admin.id;
        var data=creatFormsData.data;
        const description=creatFormsData.description;

        //upload the form
       // return [orgId,creatFormsData.title,data,admin.email];
      // return [data];

        await this.prisma.forms.create({
            data:{
                title:title,
                data:data,
                orgId:orgId,
                description:description
            }
        });

        return {
            message: 'Succefully created form',
        }


    }
    //show created forms
    //show title, data of creation and form data
    //if user wants to see the form data, he can click on the title

    //common for both user and admin
    //should implement in the user module
    //this should be where user can see all the forms relevant to that organization

    //show all the forms of the organization

    async showOrgForms(emailData:checkAdmin):Promise<object>{
        const adminForms = await this.prisma.forms.findMany({
            where:{
                organization: {
                    admin:{ 
                        email:emailData.email
                    }
                }
            }
        });

        return adminForms;
    }

    async showForms(emailData:checkAdmin):Promise<object>{
        //email is the any email
        //find the ordId using admin email in user table
        //using orgID display all the forms in that organization in forms table

        // const adminForms = await this.prisma.forms.findMany({
        //     where:{
        //         organization: {
        //             admin:{ 
        //                 email:email
        //             }
        //         }
        //     }
        // });

        const user = await this.prisma.user.findFirst({
            where:{
                email:emailData.email
            }
        });

        // const form=await this.prisma.forms.findMany({
        //     where:{
        //         orgId:user.orgId
        //     }
        // }); //this is finding forms in the organization

        //forms related to the user

        const forms = await this.prisma.teamMembers.findMany({
            where:{
                userId:user.id
            }
        });//get the form ID
        //display form

        const display=await this.prisma.forms.findMany({
            where:{
                id:{
                    in:forms.map((item) => {
                        return item.formId;
                    })
                }
            }
        });

        return display;


        //this method is common for both datacollector and admin
        //both can view forms in their organization

    }

    
}
