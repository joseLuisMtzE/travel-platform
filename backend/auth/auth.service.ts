import { APIError } from "encore.dev/api";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret } from "encore.dev/config";
import { db } from "../db/database";
import { User } from "../user/user.types";
import { AuthData, LoginResponse } from "./auth.types";

// Secret para JWT - debe configurarse como secret de Encore
const jwtSecret = secret("JWTSecret");

// Generar token JWT
const generateToken = (authData: AuthData): string => {
    const secret = jwtSecret();
    if (!secret) {
        throw APIError.internal("JWT secret not configured");
    }
    
    return jwt.sign(
        {
            userID: authData.userID,
            email: authData.email,
            role_id: authData.role_id,
        },
        secret,
        {
            expiresIn: "7d", // Token válido por 7 días
        }
    );
};

// Verificar credenciales y retornar datos de autenticación
export const verifyCredentials = async (
    email: string,
    password: string
): Promise<AuthData> => {
    if (!email || !password) {
        throw APIError.invalidArgument("Email and password are required");
    }

    // Buscar usuario por email
    const user = await db.queryRow<User>`SELECT * FROM users WHERE email = ${email.trim()}`;
    
    if (!user) {
        throw APIError.unauthenticated("Invalid email or password");
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw APIError.unauthenticated("Invalid email or password");
    }

    return {
        userID: user.id.toString(),
        email: user.email,
        role_id: user.role_id,
    };
};

// Login: verificar credenciales y generar token
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const authData = await verifyCredentials(email, password);
    const token = generateToken(authData);

    // Obtener datos completos del usuario para la respuesta
    const userId = parseInt(authData.userID, 10);
    const user = await db.queryRow<User>`SELECT * FROM users WHERE id = ${userId}`;
    
    if (!user) {
        throw APIError.internal("User data not found");
    }

    return {
        token,
        user: {
            id: authData.userID,
            email: authData.email,
            name: user.name,
            role_id: authData.role_id,
        },
    };
};

// Verificar token JWT y retornar AuthData
export const verifyToken = async (token: string): Promise<AuthData> => {
    const secret = jwtSecret();
    if (!secret) {
        throw APIError.internal("JWT secret not configured");
    }

    try {
        const decoded = jwt.verify(token, secret) as {
            userID: string | number;
            email: string;
            role_id: number;
        };

        // Convertir userID a string si es número (para compatibilidad)
        const userIDString = typeof decoded.userID === 'string' 
            ? decoded.userID 
            : decoded.userID.toString();

        // Verificar que el usuario aún existe (convertir a número para la consulta)
        const userId = parseInt(userIDString, 10);
        const user = await db.queryRow<User>`SELECT * FROM users WHERE id = ${userId}`;
        
        if (!user) {
            throw APIError.unauthenticated("User no longer exists");
        }

        return {
            userID: userIDString,
            email: decoded.email,
            role_id: decoded.role_id,
        };
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw APIError.unauthenticated("Invalid token");
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw APIError.unauthenticated("Token expired");
        }
        if (error instanceof jwt.NotBeforeError) {
            throw APIError.unauthenticated("Token not active yet");
        }
        throw error;
    }
};

// Hash de contraseña con bcrypt (mismo que user.service para consistencia)
const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Cambiar contraseña del usuario autenticado
export const changePassword = async (
    userID: string,
    currentPassword: string,
    newPassword: string
): Promise<void> => {
    if (!currentPassword || !newPassword) {
        throw APIError.invalidArgument("Current password and new password are required");
    }
    if (newPassword.length < 8) {
        throw APIError.invalidArgument("New password must be at least 8 characters");
    }

    const userId = parseInt(userID, 10);
    const user = await db.queryRow<User>`SELECT * FROM users WHERE id = ${userId}`;
    if (!user) {
        throw APIError.unauthenticated("User not found");
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
        throw APIError.unauthenticated("Current password is incorrect");
    }

    const hashedNew = await hashPassword(newPassword);
    await db.exec`
        UPDATE users SET password = ${hashedNew}, updated_at = NOW() WHERE id = ${userId}
    `;
};

