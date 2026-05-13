import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { createAttendancePolicy, updateAttendancePolicy } from "../../src/feat/attendance/attendancePolicy";
import type { CreateAttendancePolicyRequest, UpdateAttendancePolicyRequest } from "../../src/feat/attendance/attendancePolicy.type";

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

const startTime = { hour: 8, minute: 0, second: 0 };
const endTime = { hour: 17, minute: 0, second: 0 };

describe("attendancePolicyService unit", () => {
    test("createAttendancePolicy should call /v1/attendance-policy with correct request", async () => {
        const request: CreateAttendancePolicyRequest = {
            effectiveFrom: "2026-01-01",
            effectiveTo: "2026-12-31",
            startTime,
            endTime,
        };

        mockPost.mockResolvedValue({ data: "create attendance policy successfully" });

        await createAttendancePolicy(request);

        expect(mockPost).toHaveBeenCalledWith("/v1/attendance-policy", request, {
            toastMessageWhenSuccess: true,
        });
    });

    test("createAttendancePolicy should throw when api.post fails", async () => {
        const request: CreateAttendancePolicyRequest = {
            effectiveFrom: "2026-01-01",
            effectiveTo: "2026-12-31",
            startTime,
            endTime,
        };

        mockPost.mockRejectedValue(new Error("network error"));

        await expect(createAttendancePolicy(request)).rejects.toThrow("network error");
    });

    test("updateAttendancePolicy should call /v1/attendance-policy/:id with correct request", async () => {
        const id = 1;
        const request: UpdateAttendancePolicyRequest = {
            effectiveTo: "2027-12-31",
            endTime: { hour: 18, minute: 0, second: 0 },
        };

        mockPut.mockResolvedValue({ data: "update attendance policy successfully" });

        await updateAttendancePolicy(id, request);

        expect(mockPut).toHaveBeenCalledWith(`/v1/attendance-policy/${id}`, request, {
            toastMessageWhenSuccess: true,
        });
    });

    test("updateAttendancePolicy should throw when api.put fails", async () => {
        const id = 1;
        const request: UpdateAttendancePolicyRequest = { effectiveTo: "2027-12-31" };

        mockPut.mockRejectedValue(new Error("unauthorized"));

        await expect(updateAttendancePolicy(id, request)).rejects.toThrow("unauthorized");
    });
});
