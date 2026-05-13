import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { useCheckAttendance, useGetDailyAttendancesQuery } from "../../src/feat/attendance/useDailyAttendance";
import type { AttendanceTypeValue, DailyAttendanceFilter } from "../../src/feat/attendance/dailyAttendance.type";

const CheckAttendanceButton = ({ attendanceType }: { attendanceType: AttendanceTypeValue }) => {
    const { mutate, isPending } = useCheckAttendance();
    return (
        <button onClick={() => mutate(attendanceType)} disabled={isPending}>
            Check Attendance
        </button>
    );
};

const DailyAttendanceList = ({ filter }: { filter: DailyAttendanceFilter }) => {
    const { data, isLoading } = useGetDailyAttendancesQuery(filter);

    if (isLoading) return <span>Loading</span>;

    return (
        <ul>
            {(data ?? []).map((item) => (
                <li key={item.id}>{item.accountName}</li>
            ))}
        </ul>
    );
};

describe("dailyAttendance integration", () => {
    const renderWithProvider = (ui: React.ReactNode) => {
        const queryClient = new QueryClient();
        return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
    };

    it("checkAttendance should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/daily-attendance/check-attendance`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "attendance checked successfully", data: null }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<CheckAttendanceButton attendanceType="START_TIME" />);
        await user.click(screen.getByRole("button", { name: "Check Attendance" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("attendance checked successfully");
        });
    });

    it("checkAttendance should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/daily-attendance/check-attendance`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "attendance already checked" }),
                    { status: 400 }
                );
            })
        );

        renderWithProvider(<CheckAttendanceButton attendanceType="END_TIME" />);
        await user.click(screen.getByRole("button", { name: "Check Attendance" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("attendance already checked", {
                toastId: "generic-error",
            });
        });
    });

    it("getDailyAttendances should render fetched attendance records", async () => {
        server.use(
            http.get(`${ROOT_API_URL}/v1/daily-attendance`, () => {
                return new Response(
                    JSON.stringify({
                        success: true,
                        data: [
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
                        ],
                    }),
                    { status: 200 }
                );
            })
        );

        const filter: DailyAttendanceFilter = {
            attendanceDate: "2026-05-12",
            page: 0,
            limit: 10,
        };

        renderWithProvider(<DailyAttendanceList filter={filter} />);

        expect(await screen.findByText("John Doe")).toBeInTheDocument();
    });

    it("getDailyAttendances should show error toast when backend returns failure", async () => {
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.get(`${ROOT_API_URL}/v1/daily-attendance`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "failed to fetch attendance" }),
                    { status: 400 }
                );
            })
        );

        const filter: DailyAttendanceFilter = {
            attendanceDate: "2026-05-12",
            page: 0,
            limit: 10,
        };

        renderWithProvider(<DailyAttendanceList filter={filter} />);

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("failed to fetch attendance", {
                toastId: "generic-error",
            });
        });
    });
});
