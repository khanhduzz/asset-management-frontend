import { ReportSearchParams, ReportSortParams } from "@/types/Report";
import instance from "../instance.axios";
import { APIConstants } from "../api.constant";

export class ReportAPICaller {

    static getReport = (reportSearchParams: ReportSearchParams) => {
        return instance.get(APIConstants.REPORT.GET_REPORTS, {
            params: reportSearchParams,
        });
    }

    static exportReport = (reportSortParams: ReportSortParams) => {
        return instance.get(APIConstants.REPORT.EXPORT_REPORT, {
            params: reportSortParams,
            responseType: 'blob',
        });
    }

}