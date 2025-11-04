import { APIError } from "encore.dev/api";
import { db } from "../db/database";
import { CreateUserResponse, GetAllUsersResponse, GetUserByEmailResponse, GetUserByIdResponse, User } from "./user.types";

export const createUser = async (email: string, name: string, role: string = 'user'): Promise<CreateUserResponse> => {
    if (await checkUserExists(email)) {
        throw APIError.alreadyExists('Email already exists');
    }
    const user = await db.queryRow<User>`INSERT INTO users (email, name, role) VALUES (${email}, ${name}, ${role}) RETURNING *`;
    if (!user) {
        throw new Error('Failed to create user');
    }
    return toUserString(user);
}

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
    const users = await db.query`SELECT * FROM users`;
    const usersArray = [];
    for await (const user of users) {
        usersArray.push(toUserString(user as User));
    }


    if (!usersArray) {
        throw APIError.notFound('No users found');
    }
    return { users: usersArray as CreateUserResponse[], count: usersArray.length };
}

export const getUserByEmail = async (email: string): Promise<GetUserByEmailResponse> => {
    const user = await db.queryRow<User>`SELECT * FROM users WHERE email = ${email}`;
    if (!user) {
        throw APIError.notFound('User not found');
    }
    return toUserString(user as User);
}

export const getUserById = async (id: number): Promise<GetUserByIdResponse> => {
    const user = await db.queryRow<User>`SELECT * FROM users WHERE id = ${id}`;
    if (!user) {
        throw APIError.notFound('User not found');
    }
    return user;
}

export const checkUserExists = async (email: string) => {
    const res = await db.queryRow<User>`SELECT * FROM users WHERE email = ${email}`;
    return res !== null;
}

export const toUserString = (user: User) : CreateUserResponse => {
    return {
        email: user.email,
        name: user.name,
        role: user.role,
    };
}