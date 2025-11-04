import { api, APIError } from "encore.dev/api";
import { createUser as createUserService, getAllUsers as getAllUsersService, getUserByEmail as getUserByEmailService, getUserById as getUserByIdService} from "./user.service";
import { User, CreateUserResponse, GetAllUsersResponse, GetUserByEmailResponse, GetUserByIdResponse } from "./user.types";
import { z } from "zod";

const createUserSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    name: z.string().min(1, "Name is required"),
    role: z.enum(["admin", "user"], "Role is required"),
});

export const createUser = api(
    { method: "POST", path: "/users", expose: true },
    async ({ email, name, role }: { email: string; name: string; role: string }): Promise<CreateUserResponse> => {
        const validated = createUserSchema.safeParse({ email, name, role });

        if (!validated.success) {
            throw APIError.invalidArgument(validated.error.issues[0].message);
        }

        return await createUserService(email, name, role);
    }
);

export const getAllUsers = api(
    { method: "GET", path: "/users", expose: true },
    async (): Promise<GetAllUsersResponse> => {
        return await getAllUsersService();
    }
);

export const getUserByEmail = api(
    { method: "GET", path: "/users/:email", expose: true },
    async ({ email }: { email: string }): Promise<GetUserByEmailResponse> => {
        return await getUserByEmailService(email);
    }
);

export const getUserById = api(
    { method: "GET", path: "/user/:id", expose: true },
    async ({ id }: { id: number }): Promise<GetUserByIdResponse> => {
        return await getUserByIdService(id);
    }
);