import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { useCreateAccount, useUpdateAccount } from "../../src/feat/account/useAccount";
import type { CreateAccountRequest, UpdateAccountRequest } from "../../src/feat/account/account.type";

const createRequest: CreateAccountRequest = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    station: "STATION_A",
    role: "WORKER",
};

const CreateAccountButton = ({ request }: { request: CreateAccountRequest }) => {
    const { mutate, isPending } = useCreateAccount();
    return (
        <button onClick={() => mutate(request)} disabled={isPending}>
            Create Account
        </button>
    );
};

const UpdateAccountButton = ({ id, request }: { id: string; request: UpdateAccountRequest }) => {
    const { mutate, isPending } = useUpdateAccount();
    return (
        <button onClick={() => mutate({ id, request })} disabled={isPending}>
            Update Account
        </button>
    );
};

describe("account integration", () => {
    const renderWithProvider = (ui: React.ReactNode) => {
        const queryClient = new QueryClient();
        return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
    };

    it("createAccount should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/accounts`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "create account successfully", data: "ok" }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<CreateAccountButton request={createRequest} />);
        await user.click(screen.getByRole("button", { name: "Create Account" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("create account successfully");
        });
    });

    it("createAccount should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/accounts`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "email already exists" }),
                    { status: 409 }
                );
            })
        );

        renderWithProvider(<CreateAccountButton request={createRequest} />);
        await user.click(screen.getByRole("button", { name: "Create Account" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("email already exists", {
                toastId: "generic-error",
            });
        });
    });

    it("updateAccount should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        const id = "abc-123";
        const updateRequest: UpdateAccountRequest = { name: "Jane Doe" };

        server.use(
            http.put(`${ROOT_API_URL}/v1/accounts/${id}`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "update account successfully", data: "ok" }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<UpdateAccountButton id={id} request={updateRequest} />);
        await user.click(screen.getByRole("button", { name: "Update Account" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("update account successfully");
        });
    });

    it("updateAccount should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        const id = "abc-123";
        const updateRequest: UpdateAccountRequest = { email: "bad@example.com" };

        server.use(
            http.put(`${ROOT_API_URL}/v1/accounts/${id}`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "update account failed" }),
                    { status: 400 }
                );
            })
        );

        renderWithProvider(<UpdateAccountButton id={id} request={updateRequest} />);
        await user.click(screen.getByRole("button", { name: "Update Account" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("update account failed", {
                toastId: "generic-error",
            });
        });
    });
});
