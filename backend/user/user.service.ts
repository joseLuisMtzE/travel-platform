import { APIError } from "encore.dev/api";
import { db } from "../db/database";
import { CreateUserResponse, User } from "./user.types";

export const createUser = async (email: string, name: string, role: string = 'user'): Promise<CreateUserResponse> => {
    console.log(`Creating user ${email} ${name} ${role}`);
    if (await checkUserExists(email)) {
        throw APIError.alreadyExists('Email already exists');
    }
    const user = await db.queryRow<User>`INSERT INTO users (email, name, role) VALUES (${email}, ${name}, ${role}) RETURNING *`;
    console.log(`User created ${user}`);
    if (!user) {
        throw new Error('Failed to create user');
    }
    return toUserString(user);
}

// export const getAllUsers = async () => {
//     return await db.select().from(users);
// }

// export const getUserByEmail = async (email: string) => {
//     return await db.select().from(users).where(eq(users.email, email));
// }

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