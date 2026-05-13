import { useMutation } from "@tanstack/react-query";
import { createAttendancePolicy, updateAttendancePolicy } from "./attendancePolicy";
import type { CreateAttendancePolicyRequest, UpdateAttendancePolicyRequest } from "./attendancePolicy.type";

export const useCreateAttendancePolicy = () => {
    return useMutation({
        mutationKey: ["create-attendance-policy"],
        mutationFn: (request: CreateAttendancePolicyRequest) => createAttendancePolicy(request),
    });
};

export const useUpdateAttendancePolicy = () => {
    return useMutation({
        mutationKey: ["update-attendance-policy"],
        mutationFn: ({ id, request }: { id: number; request: UpdateAttendancePolicyRequest }) =>
            updateAttendancePolicy(id, request),
    });
};
