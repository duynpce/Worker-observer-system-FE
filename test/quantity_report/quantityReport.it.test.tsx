import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { useCreateQuantityReport, useGetQuantityReportsQuery } from "../../src/feat/quanity_report/useQuantityReport";
import type { QuantityReportFilter } from "../../src/feat/quanity_report/quantityReport.type";

const CreateQuantityReportButton = ({ quantity }: { quantity: number }) => {
    const { mutate, isPending } = useCreateQuantityReport();
    return (
        <button onClick={() => mutate({ quantity })} disabled={isPending}>
            Submit Report
        </button>
    );
};

const QuantityReportList = ({ filter }: { filter: QuantityReportFilter }) => {
    const { data, isLoading } = useGetQuantityReportsQuery(filter);

    if (isLoading) return <span>Loading</span>;

    return (
        <ul>
            {(data ?? []).map((item) => (
                <li key={item.id}>
                    {item.accountName}: {item.quantity}
                </li>
            ))}
        </ul>
    );
};

describe("quantityReport integration", () => {
    const renderWithProvider = (ui: React.ReactNode) => {
        const queryClient = new QueryClient();
        return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
    };

    it("createQuantityReport should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/quantity-report`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "quantity report created successfully", data: null }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<CreateQuantityReportButton quantity={50} />);
        await user.click(screen.getByRole("button", { name: "Submit Report" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("quantity report created successfully");
        });
    });

    it("createQuantityReport should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/quantity-report`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "invalid quantity" }),
                    { status: 400 }
                );
            })
        );

        renderWithProvider(<CreateQuantityReportButton quantity={0} />);
        await user.click(screen.getByRole("button", { name: "Submit Report" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("invalid quantity", {
                toastId: "generic-error",
            });
        });
    });

    it("getQuantityReports should render fetched report records", async () => {
        server.use(
            http.get(`${ROOT_API_URL}/v1/quantity-report`, () => {
                return new Response(
                    JSON.stringify({
                        success: true,
                        data: [
                            {
                                id: 1,
                                quantity: 100,
                                date: "2026-05-12",
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

        const filter: QuantityReportFilter = { date: "2026-05-12", page: 0, limit: 10 };

        renderWithProvider(<QuantityReportList filter={filter} />);

        expect(await screen.findByText("John Doe: 100")).toBeInTheDocument();
    });

    it("getQuantityReports should show error toast when backend returns failure", async () => {
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.get(`${ROOT_API_URL}/v1/quantity-report`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "failed to fetch reports" }),
                    { status: 400 }
                );
            })
        );

        const filter: QuantityReportFilter = { date: "2026-05-12", page: 0, limit: 10 };

        renderWithProvider(<QuantityReportList filter={filter} />);

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("failed to fetch reports", {
                toastId: "generic-error",
            });
        });
    });
});
