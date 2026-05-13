import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { useCreateItemBatch, useGetItemsQuery, useUpdateItemStation } from "../../src/feat/item/useItem";
import type { ItemFilter } from "../../src/feat/item/item.type";

const CreateItemBatchButton = ({ count }: { count: number }) => {
    const { mutate, isPending } = useCreateItemBatch();
    return (
        <button onClick={() => mutate({ count })} disabled={isPending}>
            Create Batch
        </button>
    );
};

const ItemList = ({ filter }: { filter: ItemFilter }) => {
    const { data, isLoading } = useGetItemsQuery(filter);

    if (isLoading) return <span>Loading</span>;

    return (
        <ul>
            {(data ?? []).map((item) => (
                <li key={item.id}>{item.id} - {item.currentStation}</li>
            ))}
        </ul>
    );
};

const UpdateStationButton = ({ id, station }: { id: string; station: "STATION_A" | "STATION_B" | "STATION_C" | "STATION_D" }) => {
    const { mutate, isPending } = useUpdateItemStation();
    return (
        <button onClick={() => mutate({ id, station })} disabled={isPending}>
            Update Station
        </button>
    );
};

describe("item integration", () => {
    const renderWithProvider = (ui: React.ReactNode) => {
        const queryClient = new QueryClient();
        return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
    };

    it("createItemBatch should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/items/batch`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "items created successfully", data: null }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<CreateItemBatchButton count={5} />);
        await user.click(screen.getByRole("button", { name: "Create Batch" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("items created successfully");
        });
    });

    it("createItemBatch should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.post(`${ROOT_API_URL}/v1/items/batch`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "invalid count" }),
                    { status: 400 }
                );
            })
        );

        renderWithProvider(<CreateItemBatchButton count={0} />);
        await user.click(screen.getByRole("button", { name: "Create Batch" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("invalid count", {
                toastId: "generic-error",
            });
        });
    });

    it("getItems should render fetched items", async () => {
        server.use(
            http.get(`${ROOT_API_URL}/v1/items`, () => {
                return new Response(
                    JSON.stringify({
                        success: true,
                        data: [
                            { id: "uuid-001", currentStation: "STATION_A", createdAt: "2026-05-13T08:00:00Z" },
                            { id: "uuid-002", currentStation: "STATION_B", createdAt: "2026-05-13T09:00:00Z" },
                        ],
                    }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<ItemList filter={{ page: 0, limit: 10 }} />);

        await waitFor(() => {
            expect(screen.getByText("uuid-001 - STATION_A")).toBeInTheDocument();
            expect(screen.getByText("uuid-002 - STATION_B")).toBeInTheDocument();
        });
    });

    it("getItems should render empty list when backend returns empty array", async () => {
        server.use(
            http.get(`${ROOT_API_URL}/v1/items`, () => {
                return new Response(
                    JSON.stringify({ success: true, data: [] }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<ItemList filter={{ page: 0, limit: 10 }} />);

        await waitFor(() => {
            expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
        });
    });

    it("updateItemStation should show success toast on success", async () => {
        const user = userEvent.setup();
        const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

        server.use(
            http.patch(`${ROOT_API_URL}/v1/items`, () => {
                return new Response(
                    JSON.stringify({ success: true, message: "station updated successfully", data: null }),
                    { status: 200 }
                );
            })
        );

        renderWithProvider(<UpdateStationButton id="uuid-001" station="STATION_C" />);
        await user.click(screen.getByRole("button", { name: "Update Station" }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("station updated successfully");
        });
    });

    it("updateItemStation should show error toast when backend returns failure", async () => {
        const user = userEvent.setup();
        const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

        server.use(
            http.patch(`${ROOT_API_URL}/v1/items`, () => {
                return new Response(
                    JSON.stringify({ success: false, message: "item not found" }),
                    { status: 404 }
                );
            })
        );

        renderWithProvider(<UpdateStationButton id="uuid-999" station="STATION_D" />);
        await user.click(screen.getByRole("button", { name: "Update Station" }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("item not found", {
                toastId: "generic-error",
            });
        });
    });
});
