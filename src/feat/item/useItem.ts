import { useMutation, useQuery } from "@tanstack/react-query";
import { createItemBatch, getItems, updateItemStation } from "./item.service";
import type { CreateItemBatchRequest, ItemFilter } from "./item.type";
import type { Station } from "../account/account.type";

export const useCreateItemBatch = () => {
    return useMutation({
        mutationKey: ["create-item-batch"],
        mutationFn: (request: CreateItemBatchRequest) => createItemBatch(request),
    });
};

export const useGetItemsQuery = (filter: ItemFilter) => {
    return useQuery({
        queryKey: ["items", filter.page, filter.limit, filter.currentStation],
        queryFn: () => getItems(filter),
    });
};

export const useUpdateItemStation = () => {
    return useMutation({
        mutationKey: ["update-item-station"],
        mutationFn: ({ id, station }: { id: string; station: Station }) =>
            updateItemStation(id, station),
    });
};
