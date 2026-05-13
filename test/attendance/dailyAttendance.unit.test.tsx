import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { checkAttendance, getDailyAttendances } from "../../src/feat/attendance/dailyAttendanceService";
import type { DailyAttendanceFilter, GetDailyAttendanceDto } from "../../src/feat/attendance/dailyAttendance.type";

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

describe("dailyAttendanceService unit", () => {
    test("checkAttendance should call /v1/daily-attendance/check-attendance with correct params", async () => {
        mockPost.mockResolvedValue({ data: null });

        await checkAttendance("START_TIME");

        expect(mockPost).toHaveBeenCalledWith(
            "/v1/daily-attendance/check-attendance",
            null,
            {
                params: { attendanceType: "START_TIME" },
                toastMessageWhenSuccess: true,
            }
        );
    });

    test("checkAttendance should throw when api.post fails", async () => {
        mockPost.mockRejectedValue(new Error("network error"));

        await expect(checkAttendance("END_TIME")).rejects.toThrow("network error");
    });

    test("getDailyAttendances should call /v1/daily-attendance and return data", async () => {
        const filter: DailyAttendanceFilter = {
            attendanceDate: "2026-05-12",
            type: "START_TIME",
            status: "ON_TIME",
            page: 0,
            limit: 10,
        };

        const mockData: GetDailyAttendanceDto[] = [
            {
                id: 1,
                attendanceDate: "2026-05-12",
                attendanceTime: { hour: 8, minute: 0, second: 0 },
                status: "ON_TIME",
                type: "START_TIME",
                accountId: "uuid-001",
                accountName: "John Doe",
                accountEmail: "john@example.com",
            },
        ];

        mockGet.mockResolvedValue({ data: mockData });

        const result = await getDailyAttendances(filter);

        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith("/v1/daily-attendance", {
            params: {
                attendanceDate: "2026-05-12",
                type: "START_TIME",
                status: "ON_TIME",
                paginationDto: { page: 0, limit: 10 },
            },
        });
    });

    test("getDailyAttendances should return empty array when data is null", async () => {
        const filter: DailyAttendanceFilter = {
            attendanceDate: "2026-05-12",
            page: 0,
            limit: 10,
        };

        mockGet.mockResolvedValue({ data: null });

        const result = await getDailyAttendances(filter);

        expect(result).toEqual([]);
    });

    test("getDailyAttendances should throw when api.get fails", async () => {
        const filter: DailyAttendanceFilter = {
            attendanceDate: "2026-05-12",
            page: 0,
            limit: 10,
        };

        mockGet.mockRejectedValue(new Error("network error"));

        await expect(getDailyAttendances(filter)).rejects.toThrow("network error");
    });
});
