import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SendRequests, UserDataUpdate } from 'src/utils/types';
import { compare, hash } from 'bcrypt'
import { User } from '@prisma/client';
import { UpdatePasswordDto } from 'src/users/user.dto';


@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getUser(email: string): Promise<User> {


        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }




    //use this to let user edit info in profile. handle password change in another method. UI should not allow user to change password in profile
    async updateUser(userData: UserDataUpdate): Promise<object> {

        const result = await this.prisma.user.update({
            where: {
                email: userData.email
            },
            data: userData
        });

        return result;
    }

    //change password second method-working. use this to let user change password in profile. 
    //change email here to id??
    async updateUserPassword(userData: UpdatePasswordDto, email: string) {

        const user = await this.prisma.user.findFirst({
            where: {
                email: email
            },
        });
        const checkPassword = await compare(
            userData.oldPassword,
            user.password,
        );

        if (!checkPassword) {
            throw new HttpException('Password Incorrect', HttpStatus.UNAUTHORIZED)
        }
        const newPasswordHash = await hash(userData.password, 12);
        await this.prisma.user.update({
            where: {
                email: email 
            },
            data: { password: newPasswordHash }
        });

        return {
            message: 'Password Updated',
        };
    }


    async deleteUser(email: string): Promise<object> {
        const result = await this.prisma.user.delete({
            where: {
                email: email
            }
        });

        return result;
    }




    async getAllUsers(): Promise<object[]> {
        const users = await this.prisma.user.findMany({
            include: {
                role: true
            }
        });

        console.log(users[0].role.name);

        return users;
    }


    //show created forms
    //show title, data of creation and form data
    //if user wants to see the form data, he can click on the title


    // async showForms(showFormsData:CreateForms):Promise<object[]>{
    //     //take user email
    //     //check user tabe

    // }

    //this is should be the method where user can see the form he has access to 
    
    
    //users send join requests to admin

    async sendjoinRequests(sendRequestsdata:SendRequests):Promise<object>{
        //userId Int 
  //orgId Int
  //formId Int -from data

        //find user id using email
        const user = await this.prisma.user.findFirst({
            where:{
                email:sendRequestsdata.email
            }
        });
        const userId=user.id;

        //find org id using formId
        const form = await this.prisma.forms.findFirst({
            where:{
                id:sendRequestsdata.formId
            }
        });
        const orgId=form.orgId;

        const result = await this.prisma.teamMembers.create({
            data:{
                userId:userId,
                orgId:orgId,
                formId:sendRequestsdata.formId,
            }
        });
        return {
            message: 'Succefully sent request',
        }


        
    }


    //for searching
     async queryBuilder(alias:string ,table:string){
        console.log(alias,'alias');
       







        if(table.match('forms')){
            const res=await this.prisma.forms.findMany({
                where:{
                    title:{
                        contains:alias
                    }
                }
    
            });
            console.log(res,'forms');
            return res;

        }
        else if(table.match('organization')){
            const res=await this.prisma.organization.findMany({
                where:{
                    orgname:{
                        contains:alias
                    }
                }
            });
            return res;
        }


        
        
     }





}


