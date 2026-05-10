import { useMutation } from "@tanstack/react-query";
import { createAccount, updateAccount } from "./accountService";
import type { CreateAccountRequest, UpdateAccountRequest } from "./account.type";

export const useCreateAccount = () => {
    return useMutation({
        mutationKey: ["create-account"],
        mutationFn: (request: CreateAccountRequest) => createAccount(request),
    });
};

export const useUpdateAccount = () => {
    return useMutation({
        mutationKey: ["update-account"],
        mutationFn: ({ id, request }: { id: string; request: UpdateAccountRequest }) =>
            updateAccount(id, request),
    });
};
