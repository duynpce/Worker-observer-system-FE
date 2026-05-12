import { useMutation, useQuery } from "@tanstack/react-query";
import { checkAttendance, getDailyAttendances } from "./dailyAttendanceService";
import type { AttendanceTypeValue, DailyAttendanceFilter } from "./dailyAttendance.type";

export const useCheckAttendance = () => {
    return useMutation({
        mutationKey: ["check-attendance"],
        mutationFn: (attendanceType: AttendanceTypeValue) => checkAttendance(attendanceType),
    });
};

export const useGetDailyAttendancesQuery = (filter: DailyAttendanceFilter) => {
    return useQuery({
        queryKey: ["daily-attendances", filter.attendanceDate, filter.type, filter.status, filter.page, filter.limit],
        queryFn: () => getDailyAttendances(filter),
        enabled: filter.attendanceDate.trim().length > 0,
    });
};
