import { api } from "../../config/axios/api";
import type { AttendanceTypeValue, DailyAttendanceFilter, GetDailyAttendanceDto } from "./dailyAttendance.type";

export const checkAttendance = async (attendanceType: AttendanceTypeValue) => {
        await api.post("/v1/daily-attendance/check-attendance", null, {
        params: {
            "attendanceType": attendanceType,
        },
        toastMessageWhenSuccess: true,
    });
};

export const getDailyAttendances = async (filter: DailyAttendanceFilter) => {
    const { page, limit, ...rest } = filter;
    const res = await api.get<GetDailyAttendanceDto[]>("/v1/daily-attendance", {
        params: { ...rest, paginationDto: { page, limit } },
    });
    return res.data ?? [];
};
