import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { createAccount, updateAccount } from "../../src/feat/account/accountService";
import type { CreateAccountRequest, UpdateAccountRequest } from "../../src/feat/account/account.type";

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
const mockPut = api.put as Mock;

describe("accountService unit", () => {
    test("createAccount should call /v1/accounts with correct request", async () => {
        const request: CreateAccountRequest = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            station: "STATION_A",
            role: "WORKER",
        };

        mockPost.mockResolvedValue({ data: "create account successfully" });

        await createAccount(request);

        expect(mockPost).toHaveBeenCalledWith("/v1/accounts", request, {
            toastMessageWhenSuccess: true,
        });
    });

    test("createAccount should throw when api.post fails", async () => {
        const request: CreateAccountRequest = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            station: "STATION_A",
            role: "WORKER",
        };

        mockPost.mockRejectedValue(new Error("network error"));

        await expect(createAccount(request)).rejects.toThrow("network error");
    });

    test("updateAccount should call /v1/accounts/:id with correct request", async () => {
        const id = "abc-123";
        const request: UpdateAccountRequest = {
            name: "Jane Doe",
            email: "jane@example.com",
        };

        mockPut.mockResolvedValue({ data: "update account successfully" });

        await updateAccount(id, request);

        expect(mockPut).toHaveBeenCalledWith(`/v1/accounts/${id}`, request, {
            toastMessageWhenSuccess: true,
        });
    });

    test("updateAccount should throw when api.put fails", async () => {
        const id = "abc-123";
        const request: UpdateAccountRequest = { name: "Jane Doe" };

        mockPut.mockRejectedValue(new Error("unauthorized"));

        await expect(updateAccount(id, request)).rejects.toThrow("unauthorized");
    });
});
