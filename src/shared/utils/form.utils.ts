import type { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";

export const onError = <T extends FieldValues>(errors: FieldErrors<T>) => {
    toast.error(errors.text?.message?.toString() || "Validation error");
};
