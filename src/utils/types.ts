export interface UserData {
    roleId: number;
    
    fname: string;
    lname?: string|null;
    email: string;
    password: string;
    orgId: number|null;
}

export interface OrganizationData {
    name: string;
}

export interface RoleData {
    name: string;
}

