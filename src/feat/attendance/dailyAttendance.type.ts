import type { LocalTime } from "./attendancePolicy.type";

export const AttendanceType = ["START_TIME", "END_TIME"] as const;
export const AttendanceStatus = ["ON_TIME", "ABSENT", "LATE", "EARLY_LEAVE", "ON_TIME_LEAVE"] as const;

export type AttendanceTypeValue = (typeof AttendanceType)[number];
export type AttendanceStatusValue = (typeof AttendanceStatus)[number];

export interface DailyAttendanceFilter {
    attendanceDate: string;
    type?: AttendanceTypeValue;
    status?: AttendanceStatusValue;
    page: number;
    limit: number;
}

export interface GetDailyAttendanceDto {
    id: number;
    attendanceDate: string;
    attendanceTime: LocalTime;
    status: AttendanceStatusValue;
    type: AttendanceTypeValue;
    accountId: string;
    accountName: string;
    accountEmail: string;
}
