import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { useCreateAttendancePolicy, useUpdateAttendancePolicy } from "../../src/feat/attendance/useAttendancePolicy";
import type { CreateAttendancePolicyRequest, UpdateAttendancePolicyRequest } from "../../src/feat/attendance/attendancePolicy.type";

const startTime = { hour: 8, minute: 0, second: 0 };
const endTime = { hour: 17, minute: 0, second: 0 };

const createRequest: CreateAttendancePolicyRequest = {
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    startTime,
    endTime,
};

const CreatePolicyButton = ({ request }: { request: CreateAttendancePolicyRequest }) => {
    const { mutate, isPending } = useCreateAttendancePolicy();
    return (
        <button onClick={() => mutate(request)} disabled={isPending}>
            Create Policy
        </button>
    );
};

const UpdatePolicyButton = ({ id, request }: { id: number; request: UpdateAttendancePolicyRequest }) => {
    const { mutate, isPending } = useUpdateAttendancePolicy();
    return (
        <button onClick={() => mutate({ id, request })} disabled={isPending}>
            Update Policy
        </button>
    );
};

describe("attendancePolicy integration", () => {
    const renderWithProvider = (ui: React.ReactNode) => {
        const queryClient = new QueryClient();
        return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
    };

    it("createAttendancePolicy should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/attendance-policy`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "create attendance policy successfully", data: "ok" }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<CreatePolicyButton request={createRequest} />);
        await user.click(screen.getByRole("button", { name: "Create Policy" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("create attendance policy successfully");
        });
    });

    it("createAttendancePolicy should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/attendance-policy`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "policy already exists" }),
                    { status: 400 }
                );
            })
        );

        renderWithProvider(<CreatePolicyButton request={createRequest} />);
        await user.click(screen.getByRole("button", { name: "Create Policy" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("policy already exists", {
                toastId: "generic-error",
            });
        });
    });

    it("updateAttendancePolicy should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        const id = 1;
        const updateRequest: UpdateAttendancePolicyRequest = { effectiveTo: "2027-12-31" };

        server.use(
            http.put(`${ROOT_API_URL}/v1/attendance-policy/${id}`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "update attendance policy successfully", data: "ok" }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<UpdatePolicyButton id={id} request={updateRequest} />);
        await user.click(screen.getByRole("button", { name: "Update Policy" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("update attendance policy successfully");
        });
    });

    it("updateAttendancePolicy should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        const id = 1;
        const updateRequest: UpdateAttendancePolicyRequest = { effectiveTo: "2027-12-31" };

        server.use(
            http.put(`${ROOT_API_URL}/v1/attendance-policy/${id}`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "update attendance policy failed" }),
                    { status: 400 }
                );
            })
        );

        renderWithProvider(<UpdatePolicyButton id={id} request={updateRequest} />);
        await user.click(screen.getByRole("button", { name: "Update Policy" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("update attendance policy failed", {
                toastId: "generic-error",
            });
        });
    });
});
