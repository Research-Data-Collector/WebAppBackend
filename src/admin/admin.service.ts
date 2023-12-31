import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { CreateOrgDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import { AddMembers, AuthUser, CreateForms, RoleData, checkAdmin, checkForm, upload } from 'src/utils/types';
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


        

        if(addMembersData.status==true){
            await this.prisma.teamMembers.update({
                where:{
                    id:memeber.id
                },
                
                data:{
                    status:addMembersData.status
                }
            });
        }
        else{
            await this.prisma.teamMembers.delete({
                where:{
                    id:memeber.id
                }
            });
        };//if status is false, delete the request

        if(addMembersData.status==true){
            return {
                message: 'Succefully added member',
            }
        }else{
            return {
                message: 'Succefully rejected member,record deleted',
            }
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


         const requestsMap = new Map();

        for (const request of pendingRequests) {
            const formId = request.formId;
            const userId = request.userId;
            const reqCreatedAt = request.createdAt;
    
            if (!requestsMap.has(formId)) {
                requestsMap.set(formId, {
                    formId,
                    request: []
                });
            }
    
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }});
    
            if (user) {
                requestsMap.get(formId).request.push({
                    userId: user.id,
                    fname: user.fname,
                    lname: user.lname,
                    createdAt: reqCreatedAt
                });
            }
        }
    
        const reqs = Array.from(requestsMap.values());
        return reqs;
        }
    

        

    // const ids = pendingRequests.map((item) => {
    //     return item.userId;
    // });
    // const formId=pendingRequests.map((item) => {
    //     return item.formId;
    // });

    // const users = await this.prisma.user.findMany({
    //     where: {
    //         id: {
    //             in: ids
    //         }
    //     }
    // });

    // const fnames = users.map((user) => user.fname);
    // const lnames = users.map((user) => user.lname);
    // const Ids = users.map((user) => user.id);

    // return [fnames,lnames,Ids,formId];


    
    // }

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
        const userID=admin.id;
        const title=creatFormsData.title;
        //const adminId=admin.id;
        var data=creatFormsData.data;
        const description=creatFormsData.description;

        //upload the form
       // return [orgId,creatFormsData.title,data,admin.email];
      // return [data];

        const form =await this.prisma.forms.create({
            data:{
                title:title,
                data:data,
                orgId:orgId,
                description:description
            }
        });
        


        //research owner should be added to the members table
        //userId,orgId,formId,status

    

        const formId=form.id;
        console.log(formId);

        const teamMember=await this.prisma.teamMembers.create({
            data:{
                userId:userID,
                orgId:orgId,
                formId:formId,
                status:true
            }
        });

        return teamMember;




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



    // async UploadedFile(uploadData:upload):Promise<object>{
    //     const result=await this.prisma.testFile.create({
    //       data:uploadData,
    //     });

    //     return result;
      
    //   }
      

    async showSubmissions(formIdData:checkForm):Promise<object>{
        const formSubmissions = await this.prisma.formSubmissions.findMany({
            where: {
                formId: formIdData.formId,
            },
        });

        const userIds = formSubmissions.map((item) => Number(item.userId));
        //console.log(userIds, "userIds");

        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            },
        });

        const usernames = users.map((user) => ({
            fname: user.fname,
            lname: user.lname,
        }));

        return [formSubmissions, usernames];
    }

    
}
