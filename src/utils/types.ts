import { RoleName } from "@prisma/client";

export interface UserData {
    roleId: number;
    orgname?: string|null;
    fname: string;
    lname: string;
    email: string;
    password: string;
}

export interface UserDataUpdate {
    roleId: number;
    orgname?: string|null;
    fname: string;
    lname: string;
    email: string;
}

export interface RoleData {
    name: RoleName;
}

export interface AddMembers{
    userId: number;
    orgId: number;
    status: boolean;
    

}

export interface CreateForms{
    title: string;
    data:JSON;
    email:string;
}