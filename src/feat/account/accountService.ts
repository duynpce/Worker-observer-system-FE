import { api } from "../../config/axios/api";
import type { CreateAccountRequest, UpdateAccountRequest } from "./account.type";

export const createAccount = async (request: CreateAccountRequest) => {
    await api.post<string>("/v1/accounts", request, { toastMessageWhenSuccess: true });
};

export const updateAccount = async (id: string, request: UpdateAccountRequest) => {
    await api.put<string>(`/v1/accounts/${id}`, request, { toastMessageWhenSuccess: true });
};
