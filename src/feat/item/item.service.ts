import { api } from "../../config/axios/api";
import type { CreateItemBatchRequest, GetItemDto, ItemFilter } from "./item.type";
import type { Station } from "../account/account.type";

export const createItemBatch = async (request: CreateItemBatchRequest) => {
    await api.post<void>("/v1/items/batch", request, { toastMessageWhenSuccess: true });
};

export const getItems = async (filter: ItemFilter) => {
    const { page, limit, currentStation } = filter;
    const res = await api.get<GetItemDto[]>("/v1/items", {
        params: { paginationDto: { page, limit }, currentStation },
    });
    return res.data ?? [];
};

export const updateItemStation = async (id: string, station: Station) => {
    await api.patch<void>("/v1/items", undefined, {
        params: { id, station },
        toastMessageWhenSuccess: true,
    });
};
