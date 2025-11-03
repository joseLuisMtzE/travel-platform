import { api } from "encore.dev/api";
import { createUser as createUserService } from "./user.service";
import { User, CreateUserResponse } from "./user.types";

export const createUser = api(
    { method: "POST", path: "/users", expose: true },
    async ({ email, name, role }: { email: string; name: string; role: string }): Promise<CreateUserResponse> => {
        return await createUserService(email, name, role);
    }
);