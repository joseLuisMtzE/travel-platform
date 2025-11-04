import { APIError } from "encore.dev/api";
import { db } from "../db/database";
import { GetAllUsersResponse, User } from "./user.types";

export const createUser = async (email: string, name: string, role: string = 'user'): Promise<User> => {
    if (await checkUserExists(email)) {
        throw APIError.alreadyExists('Email already exists');
    }
    const user = await db.queryRow<User>`INSERT INTO users (email, name, role) VALUES (${email}, ${name}, ${role}) RETURNING *`;
    if (!user) {
        throw new Error('Failed to create user');
    }
    return user;
}

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
    const users = await db.query`SELECT * FROM users`;
    const usersArray: User[] = [];
    for await (const user of users) {
        usersArray.push(user as User);
    }
    
    if (!usersArray) {
        throw APIError.notFound('No users found');
    }

    return { users: usersArray, count: usersArray.length };
}

export const getUserByEmail = async (email: string): Promise<User> => {
    const user = await db.queryRow<User>`SELECT * FROM users WHERE email = ${email}`;
    if (!user) {
        throw APIError.notFound('User not found');
    }
    return user ;
}

export const getUserById = async (id: number): Promise<User> => {
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
