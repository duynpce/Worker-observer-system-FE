import { api } from "../../config/axios/api";
import type { CreateAttendancePolicyRequest, UpdateAttendancePolicyRequest } from "./attendancePolicy.type";

export const createAttendancePolicy = async (request: CreateAttendancePolicyRequest) => {
    await api.post<string>("/v1/attendance-policy", request, { toastMessageWhenSuccess: true });
};

export const updateAttendancePolicy = async (id: number, request: UpdateAttendancePolicyRequest) => {
    await api.put<string>(`/v1/attendance-policy/${id}`, request, { toastMessageWhenSuccess: true });
};
