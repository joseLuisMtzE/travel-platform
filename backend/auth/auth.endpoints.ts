import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { changePassword as changePasswordService, login as loginService } from "./auth.service";
import { ChangePasswordRequest, LoginRequest, LoginResponse } from "./auth.types";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "New password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

// Endpoint de login (público, no requiere autenticación)
export const login = api(
    { method: "POST", path: "/auth/login", expose: true },
    async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
        const validated = loginSchema.safeParse({ email, password });

        if (!validated.success) {
            const firstError = validated.error.issues[0];
            throw APIError.invalidArgument(firstError.message);
        }

        return await loginService(validated.data.email, validated.data.password);
    }
);

// Endpoint de logout (protegido). El cliente debe desechar el token; opcionalmente se puede implementar blacklist.
export const logout = api(
    { method: "POST", path: "/auth/logout", expose: true, auth: true },
    async (): Promise<{ ok: true }> => {
        return { ok: true };
    }
);

// Endpoint para cambiar contraseña (protegido)
export const changePassword = api(
    { method: "POST", path: "/auth/change-password", expose: true, auth: true },
    async ({ currentPassword, newPassword }: ChangePasswordRequest): Promise<{ ok: true }> => {
        const validated = changePasswordSchema.safeParse({ currentPassword, newPassword });
        if (!validated.success) {
            const firstError = validated.error.issues[0];
            throw APIError.invalidArgument(firstError.message);
        }

        const authData = getAuthData() as { userID: string } | null;
        if (!authData) {
            throw APIError.unauthenticated("Authentication required");
        }

        await changePasswordService(authData.userID, validated.data.currentPassword, validated.data.newPassword);
        return { ok: true };
    }
);

