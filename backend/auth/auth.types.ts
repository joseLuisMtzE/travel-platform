export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role_id: number;
    };
}

export interface AuthData {
    userID: string;
    email: string;
    role_id: number;
}

