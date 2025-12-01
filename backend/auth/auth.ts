import { Header, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { APIError } from "encore.dev/api";
import { verifyToken } from "./auth.service";
import { AuthData } from "./auth.types";


interface AuthParams {
    authorization: Header<"Authorization">;
}

// Auth handler para Encore.ts
export const auth = authHandler<AuthParams, AuthData>(
    async (params) => {
        const authHeader = params.authorization;

        if (!authHeader) {
            throw APIError.unauthenticated("Authorization header is required");
        }

        // Extraer el token del header "Bearer <token>"
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw APIError.unauthenticated("Invalid authorization header format. Expected: Bearer <token>");
        }

        const token = parts[1];

        // Verificar el token y obtener los datos de autenticación
        const authData = await verifyToken(token);

        return authData;
    }
);

// Configurar Gateway con el auth handler
export const gateway = new Gateway({
    authHandler: auth,
});

