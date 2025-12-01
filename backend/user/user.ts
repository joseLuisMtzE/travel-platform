import { api, APIError, Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { createUser as createUserService, getAllUsers as getAllUsersService, getUserByEmail as getUserByEmailService, getUserById as getUserByIdService} from "./user.service";
import { UserPublic, GetAllUsersResponse } from "./user.types";
import { z } from "zod";

const createUserSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

const emailSchema = z.string().email("Invalid email address").min(1, "Email is required");

const idSchema = z.string().regex(/^\d+$/, "ID must be a positive integer").transform((val) => parseInt(val, 10));

export const createUser = api(
    { method: "POST", path: "/users", expose: true },
    async ({ email, name, password }: { email: string; name: string; password: string }): Promise<UserPublic> => {
        const validated = createUserSchema.safeParse({ email, name, password });

        if (!validated.success) {
            const firstError = validated.error.issues[0];
            throw APIError.invalidArgument(firstError.message);
        }

        return await createUserService(validated.data.email, validated.data.name, validated.data.password);
    }
);

export const getAllUsers = api(
    { method: "GET", path: "/users", expose: true },
    async ({ page, limit }: { page?: Query<number>; limit?: Query<number> }): Promise<GetAllUsersResponse> => {
        const pageNum = page && page > 0 ? page : 1;
        const limitNum = limit && limit > 0 && limit <= 100 ? limit : 10;
        
        return await getAllUsersService(pageNum, limitNum);
    }
);

export const getUserByEmail = api(
    { method: "GET", path: "/users/email/:email", expose: true },
    async ({ email }: { email: string }): Promise<UserPublic> => {
        const validated = emailSchema.safeParse(email);
        
        if (!validated.success) {
            throw APIError.invalidArgument("Invalid email address");
        }
        
        return await getUserByEmailService(validated.data);
    }
);

export const getUserById = api(
    { method: "GET", path: "/users/:id", expose: true },
    async ({ id }: { id: string }): Promise<UserPublic> => {
        const validated = idSchema.safeParse(id);
        
        if (!validated.success) {
            throw APIError.invalidArgument("ID must be a positive integer");
        }
        
        return await getUserByIdService(validated.data);
    }
);

// Ejemplo de endpoint protegido que requiere autenticación
// Para proteger un endpoint, agrega auth: true en las opciones
// Nota: Después de ejecutar 'encore run', Encore regenerará los tipos de autenticación
export const getMyProfile = api(
    { method: "GET", path: "/users/me", expose: true, auth: true },
    async (): Promise<UserPublic> => {
        // Obtener datos del usuario autenticado
        // En endpoints con auth: true, getAuthData() siempre retorna un valor
        const authData = getAuthData() as { userID: string; email: string; role_id: number } | null;
        
        if (!authData) {
            throw APIError.unauthenticated("Authentication required");
        }
        
        // Convertir userID de string a number para la consulta
        const userId = parseInt(authData.userID, 10);
        if (isNaN(userId)) {
            throw APIError.invalidArgument("Invalid user ID");
        }
        
        // Obtener datos completos del usuario
        return await getUserByIdService(userId);
    }
);