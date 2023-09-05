export interface UserData {
    roleId: number;
    orgname?: string|null;
    fname: string;
    lname: string;
    email: string;
    password: string;
}

export interface RoleData {
    name: string;
}