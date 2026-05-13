import { z } from "zod";
import { Station } from "../account/account.type";

export const CreateItemBatchSchema = z.object({
    count: z.number().int().min(1, "Count must be at least 1"),
});

export type CreateItemBatchRequest = z.infer<typeof CreateItemBatchSchema>;

export type GetItemDto = {
    id: string;
    currentStation: Station;
    createdAt: string;
};

export type ItemFilter = {
    page: number;
    limit: number;
    currentStation?: Station;
};
