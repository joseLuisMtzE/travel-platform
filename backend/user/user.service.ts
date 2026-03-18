import { APIError } from "encore.dev/api";
import * as bcrypt from "bcrypt";
import { db } from "../db/database";
import { GetAllUsersResponse, User, UserPublic } from "./user.types";

// Helper para convertir User a UserPublic (sin password)
const toUserPublic = (user: User): UserPublic => {
    const { password, ...userPublic } = user;
    return userPublic;
};

// Hash de contraseña con bcrypt
const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const ROLE_ADMIN_ID = 1;
const ROLE_USER_ID = 2;

export const createUser = async (email: string, name: string, password: string): Promise<UserPublic> => {
    return createUserWithRole(email, name, password, ROLE_USER_ID);
};

/** Crea usuario con un role_id dado. Solo admins pueden pasar role_id = 1 (admin). */
export const createUserWithRole = async (
    email: string,
    name: string,
    password: string,
    role_id: number
): Promise<UserPublic> => {
    if (await checkUserExists(email)) {
        throw APIError.alreadyExists('Email already exists');
    }
    if (role_id !== ROLE_USER_ID && role_id !== ROLE_ADMIN_ID) {
        throw APIError.invalidArgument('Invalid role_id; must be 1 (admin) or 2 (user)');
    }

    const hashedPassword = await hashPassword(password);
    const user = await db.queryRow<User>`INSERT INTO users (email, name, password, role_id) VALUES (${email}, ${name}, ${hashedPassword}, ${role_id}) RETURNING *`;

    if (!user) {
        throw APIError.internal('Failed to create user');
    }

    return toUserPublic(user);
}

export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<GetAllUsersResponse> => {
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;
    
    const offset = (page - 1) * limit;
    
    // Obtener total de usuarios para calcular totalPages
    const totalResult = await db.queryRow<{ count: bigint }>`SELECT COUNT(*) as count FROM users`;
    const total = Number(totalResult?.count || 0);
    const totalPages = Math.ceil(total / limit);
    
    // Obtener usuarios paginados
    const users = await db.query<User>`SELECT * FROM users ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const usersArray: User[] = [];
    for await (const user of users) {
        usersArray.push(user as User);
    }

    return { 
        users: usersArray.map(toUserPublic), 
        count: usersArray.length,
        page,
        limit,
        totalPages
    };
}

export const getUserByEmail = async (email: string): Promise<UserPublic> => {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        throw APIError.invalidArgument('Email is required and must be a valid string');
    }
    
    const user = await db.queryRow<User>`SELECT * FROM users WHERE email = ${email.trim()}`;
    if (!user) {
        throw APIError.notFound('User not found');
    }
    return toUserPublic(user);
}

export const getUserById = async (id: number): Promise<UserPublic> => {
    if (!id || id <= 0 || !Number.isInteger(id)) {
        throw APIError.invalidArgument('ID must be a positive integer');
    }
    
    const user = await db.queryRow<User>`SELECT * FROM users WHERE id = ${id}`;
    if (!user) {
        throw APIError.notFound('User not found');
    }
    return toUserPublic(user);
}

export const checkUserExists = async (email: string): Promise<boolean> => {
    const res = await db.queryRow<{ exists: boolean }>`SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) as exists`;
    return res?.exists || false;
}
