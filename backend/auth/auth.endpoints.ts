import { api, APIError } from "encore.dev/api";
import { login as loginService } from "./auth.service";
import { LoginRequest, LoginResponse } from "./auth.types";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
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

