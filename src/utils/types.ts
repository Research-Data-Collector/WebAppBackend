import { RoleName } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

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
    formId: number;
    status: boolean;
    

}

export interface CreateForms{
    title: string;
    data:JsonValue;
    email:string;
    description:string;
}
export interface checkAdmin{
    email:string;
}

export interface AuthUser{
    id:number;
    email:string;
}
export interface SendRequests{
    email:string;
    formId:number;
}

export interface upload{
    file:Blob;
}

export interface checkForm{
    formId:number;
}

export interface UploadForm{
    formId:number;
    email:string;
    data:string;
}