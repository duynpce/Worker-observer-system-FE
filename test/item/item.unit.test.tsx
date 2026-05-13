import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { createItemBatch, getItems, updateItemStation } from "../../src/feat/item/item.service";
import type { GetItemDto, ItemFilter } from "../../src/feat/item/item.type";

vi.mock("../../src/config/axios/api", () => ({
    api: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        defaults: { headers: { common: {} } },
    },
}));

const mockPost = api.post as Mock;
const mockGet = api.get as Mock;
const mockPatch = api.patch as Mock;

describe("item.service unit", () => {
    test("createItemBatch should call /v1/items/batch with correct request", async () => {
        mockPost.mockResolvedValue({ data: null });

        await createItemBatch({ count: 5 });

        expect(mockPost).toHaveBeenCalledWith("/v1/items/batch", { count: 5 }, {
            toastMessageWhenSuccess: true,
        });
    });

    test("createItemBatch should throw when api.post fails", async () => {
        mockPost.mockRejectedValue(new Error("network error"));

        await expect(createItemBatch({ count: 5 })).rejects.toThrow("network error");
    });

    test("getItems should call /v1/items and return data", async () => {
        const filter: ItemFilter = { page: 0, limit: 10 };

        const mockData: GetItemDto[] = [
            { id: "uuid-001", currentStation: "STATION_A", createdAt: "2026-05-13T08:00:00Z" },
        ];

        mockGet.mockResolvedValue({ data: mockData });

        const result = await getItems(filter);

        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith("/v1/items", {
            params: { paginationDto: { page: 0, limit: 10 }, currentStation: undefined },
        });
    });

    test("getItems should pass currentStation filter when provided", async () => {
        const filter: ItemFilter = { page: 0, limit: 10, currentStation: "STATION_B" };

        mockGet.mockResolvedValue({ data: [] });

        await getItems(filter);

        expect(mockGet).toHaveBeenCalledWith("/v1/items", {
            params: { paginationDto: { page: 0, limit: 10 }, currentStation: "STATION_B" },
        });
    });

    test("getItems should return empty array when data is null", async () => {
        mockGet.mockResolvedValue({ data: null });

        const result = await getItems({ page: 0, limit: 10 });

        expect(result).toEqual([]);
    });

    test("getItems should throw when api.get fails", async () => {
        mockGet.mockRejectedValue(new Error("network error"));

        await expect(getItems({ page: 0, limit: 10 })).rejects.toThrow("network error");
    });

    test("updateItemStation should call PATCH /v1/items with correct params", async () => {
        mockPatch.mockResolvedValue({ data: null });

        await updateItemStation("uuid-001", "STATION_C");

        expect(mockPatch).toHaveBeenCalledWith("/v1/items", undefined, {
            params: { id: "uuid-001", station: "STATION_C" },
            toastMessageWhenSuccess: true,
        });
    });

    test("updateItemStation should throw when api.patch fails", async () => {
        mockPatch.mockRejectedValue(new Error("not found"));

        await expect(updateItemStation("uuid-001", "STATION_C")).rejects.toThrow("not found");
    });
});
