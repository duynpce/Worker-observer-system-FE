import { api } from "../../config/axios/api";
import type { CreateQuantityReportRequest, GetQuantityReportDto, QuantityReportFilter } from "./quantityReport.type";

export const createQuantityReport = async (request: CreateQuantityReportRequest) => {
    await api.post<void>("/v1/quantity-report", request, { toastMessageWhenSuccess: true });
};

export const getQuantityReports = async (filter: QuantityReportFilter) => {
    const { page, limit, date } = filter;
    const res = await api.get<GetQuantityReportDto[]>("/v1/quantity-report", {
        params: { date, paginationDto: { page, limit } },
    });
    return res.data ?? [];
};
