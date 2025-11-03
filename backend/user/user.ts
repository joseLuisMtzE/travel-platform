import { api } from "encore.dev/api";
import { createUser as createUserService, getAllUsers as getAllUsersService} from "./user.service";
import { User, CreateUserResponse, GetAllUsersResponse } from "./user.types";

export const createUser = api(
    { method: "POST", path: "/users", expose: true },
    async ({ email, name, role }: { email: string; name: string; role: string }): Promise<CreateUserResponse> => {
        return await createUserService(email, name, role);
    }
);

export const getAllUsers = api(
    { method: "GET", path: "/users", expose: true },
    async (): Promise<GetAllUsersResponse> => {
        return await getAllUsersService();
    }
);