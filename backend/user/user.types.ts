export interface User {
    id: number;
    email: string;
    name: string;
    role_id: number; 
    created_at: Date;
    updated_at: Date;
}

export interface GetAllUsersResponse {
    users: User[];
    count: number;
}