import { z } from "zod";

export const CreateQuantityReportSchema = z.object({
    quantity: z.number().int().min(1, "Quantity is required"),
});

export type CreateQuantityReportRequest = z.infer<typeof CreateQuantityReportSchema>;

export interface QuantityReportFilter {
    date: string;
    page: number;
    limit: number;
}

export interface GetQuantityReportDto {
    id: number;
    quantity: number;
    date: string;
    accountId: string;
    accountName: string;
    accountEmail: string;
}
