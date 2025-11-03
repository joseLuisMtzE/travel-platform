export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    created_at: Date;
}

export interface CreateUserResponse {
    email: string;
    name: string;
    role: string;
}

export interface GetAllUsersResponse {
    users: CreateUserResponse[];
    count: number;
}