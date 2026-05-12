import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { createQuantityReport, getQuantityReports } from "../../src/feat/quanity_report/quantityReportService";
import type { GetQuantityReportDto, QuantityReportFilter } from "../../src/feat/quanity_report/quantityReport.type";

vi.mock("../../src/config/axios/api", () => ({
    api: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        defaults: { headers: { common: {} } },
    },
}));

const mockPost = api.post as Mock;
const mockGet = api.get as Mock;

describe("quantityReportService unit", () => {
    test("createQuantityReport should call /v1/quantity-report with correct request", async () => {
        mockPost.mockResolvedValue({ data: null });

        await createQuantityReport({ quantity: 50 });

        expect(mockPost).toHaveBeenCalledWith(
            "/v1/quantity-report",
            { quantity: 50 },
            { toastMessageWhenSuccess: true }
        );
    });

    test("createQuantityReport should throw when api.post fails", async () => {
        mockPost.mockRejectedValue(new Error("network error"));

        await expect(createQuantityReport({ quantity: 50 })).rejects.toThrow("network error");
    });

    test("getQuantityReports should call /v1/quantity-report and return data", async () => {
        const filter: QuantityReportFilter = {
            date: "2026-05-12",
            page: 0,
            limit: 10,
        };

        const mockData: GetQuantityReportDto[] = [
            {
                id: 1,
                quantity: 100,
                date: "2026-05-12",
                accountId: "uuid-001",
                accountName: "John Doe",
                accountEmail: "john@example.com",
            },
        ];

        mockGet.mockResolvedValue({ data: mockData });

        const result = await getQuantityReports(filter);

        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith("/v1/quantity-report", {
            params: { date: "2026-05-12", paginationDto: { page: 0, limit: 10 } },
        });
    });

    test("getQuantityReports should return empty array when data is null", async () => {
        const filter: QuantityReportFilter = { date: "2026-05-12", page: 0, limit: 10 };

        mockGet.mockResolvedValue({ data: null });

        const result = await getQuantityReports(filter);

        expect(result).toEqual([]);
    });

    test("getQuantityReports should throw when api.get fails", async () => {
        const filter: QuantityReportFilter = { date: "2026-05-12", page: 0, limit: 10 };

        mockGet.mockRejectedValue(new Error("network error"));

        await expect(getQuantityReports(filter)).rejects.toThrow("network error");
    });
});
