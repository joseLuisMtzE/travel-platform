export interface User {
    id: number;
    email: string;
    name: string;
    password: string; 
    role_id: number; 
    created_at: Date;
    updated_at: Date;
}

export interface UserPublic {
    id: number;
    email: string;
    name: string;
    role_id: number; 
    created_at: Date;
    updated_at: Date;
}

export interface GetAllUsersResponse {
    users: UserPublic[];
    count: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}