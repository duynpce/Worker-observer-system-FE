import { z } from "zod";

export const LocalTimeSchema = z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    second: z.number().int().min(0).max(59),
    nano: z.number().int().min(0).optional(),
});

export type LocalTime = z.infer<typeof LocalTimeSchema>;

export const CreateAttendancePolicySchema = z.object({
    effectiveFrom: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid date"),
    effectiveTo: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid date"),
    startTime: LocalTimeSchema,
    endTime: LocalTimeSchema,
});

export type CreateAttendancePolicyRequest = z.infer<typeof CreateAttendancePolicySchema>;

export const UpdateAttendancePolicySchema = z.object({
    effectiveFrom: z
        .string()
        .refine((date) => !Number.isNaN(Date.parse(date)), "Invalid date")
        .optional(),
    effectiveTo: z
        .string()
        .refine((date) => !Number.isNaN(Date.parse(date)), "Invalid date")
        .optional(),
    startTime: LocalTimeSchema.optional(),
    endTime: LocalTimeSchema.optional(),
});

export type UpdateAttendancePolicyRequest = z.infer<typeof UpdateAttendancePolicySchema>;
