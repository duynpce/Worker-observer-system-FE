import { z } from "zod";

export const Station = ["STATION_A", "STATION_B", "STATION_C", "STATION_D"] as const;
export const Role = ["WORKER", "FLOOR_MANAGER"] as const;

export const CreateAccountSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().trim().min(1, "Password is required"),
    station: z.enum(Station, { error: "Invalid station" }),
    role: z.enum(Role, { error: "Invalid role" }),
});

export type CreateAccountRequest = z.infer<typeof CreateAccountSchema>;

export const UpdateAccountSchema = z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.email("Invalid email").optional(),
    password: z.string().trim().min(1, "Password is required").optional(),
    station: z.enum(Station, { error: "Invalid station" }).optional(),
    role: z.enum(Role, { error: "Invalid role" }).optional(),
});

export type UpdateAccountRequest = z.infer<typeof UpdateAccountSchema>;
