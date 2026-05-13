import { useMutation, useQuery } from "@tanstack/react-query";
import { createQuantityReport, getQuantityReports } from "./quantityReportService";
import type { CreateQuantityReportRequest, QuantityReportFilter } from "./quantityReport.type";

export const useCreateQuantityReport = () => {
    return useMutation({
        mutationKey: ["create-quantity-report"],
        mutationFn: (request: CreateQuantityReportRequest) => createQuantityReport(request),
    });
};

export const useGetQuantityReportsQuery = (filter: QuantityReportFilter) => {
    return useQuery({
        queryKey: ["quantity-reports", filter.date, filter.page, filter.limit],
        queryFn: () => getQuantityReports(filter),
        enabled: filter.date.trim().length > 0,
    });
};
