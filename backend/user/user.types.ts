export interface User {
    id: number;
    email: string;
    name: string;
    role: "admin" | "user";
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
export interface GetUserByEmailResponse extends CreateUserResponse {
}

export interface GetUserByIdResponse extends User {
}